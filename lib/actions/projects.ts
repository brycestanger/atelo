"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CategoryKind } from "@/lib/types";

export type NewProjectInput = {
  name: string;
  client?: string;
  categories: { name: string; kind: CategoryKind }[];
};

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "project"
  );
}

/**
 * Create a project + its categories for the signed-in designer.
 * Returns { ok:false, reason:"not-configured" } when Supabase isn't wired yet,
 * so the wizard can fall back to its demo behaviour.
 */
export async function createProject(input: NewProjectInput) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, reason: "not-configured" as const };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, reason: "unauthenticated" as const };

  const slug = `${slugify(input.name)}-${Math.random().toString(36).slice(2, 7)}`;

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      owner: user.id,
      name: input.name,
      client_name: input.client ?? null,
      slug,
      status: "draft",
    })
    .select("id, slug")
    .single();

  if (error || !project) {
    return { ok: false as const, reason: error?.message ?? "insert-failed" };
  }

  if (input.categories.length) {
    await supabase.from("categories").insert(
      input.categories.map((c, i) => ({
        project_id: project.id,
        name: c.name,
        kind: c.kind,
        position: i,
      })),
    );
  }

  revalidatePath("/dashboard");
  return { ok: true as const, slug: project.slug, id: project.id };
}

/** Public read of a board by slug — used by the unauthenticated client link. */
export async function getBoardBySlug(slug: string) {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("projects")
    .select(
      "id, name, client_name, slug, status, categories(id, name, kind, position, options(id, title, meta, kind, image_path, color, position))",
    )
    .eq("slug", slug)
    .single();
  return data;
}
