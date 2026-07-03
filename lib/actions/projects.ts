"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Brief, CategoryKind, Precedent, Project } from "@/lib/types";
import { analyzeColours, analysisConfidence, type LikedColour } from "@/lib/analysis";

const SUPA = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Public URL for an uploaded option image (stored in the `options` bucket). */
function publicUrl(path?: string | null) {
  if (!path) return undefined;
  return `${SUPA}/storage/v1/object/public/options/${path}`;
}

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "project"
  );
}

/** A clean, stable slug derived from the name — "Kerrisdale Kitchen" → "kerrisdale-kitchen".
 *  Only appends -2, -3… if that exact slug is already taken, so the client link is
 *  predictable and never changes once the board exists. */
async function uniqueSlug(
  supabase: NonNullable<Awaited<ReturnType<typeof createClient>>>,
  base: string,
): Promise<string> {
  const { data } = await supabase
    .from("projects")
    .select("slug")
    .ilike("slug", `${base}%`);
  const taken = new Set((data ?? []).map((r: { slug: string }) => r.slug));
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

export type NewBoardInput = {
  name: string;
  client?: string;
  categories: { name: string; kind: CategoryKind }[];
};

/** Create a project + its categories for the signed-in designer. */
export async function createBoard(input: NewBoardInput) {
  const supabase = await createClient();
  if (!supabase) return { ok: false as const, reason: "not-configured" as const };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false as const, reason: "unauthenticated" as const };

  const slug = await uniqueSlug(supabase, slugify(input.name));
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

  let categories: { id: string; name: string; kind: CategoryKind }[] = [];
  if (input.categories.length) {
    const { data: cats } = await supabase
      .from("categories")
      .insert(
        input.categories.map((c, i) => ({
          project_id: project.id,
          name: c.name,
          kind: c.kind,
          position: i,
        })),
      )
      .select("id, name, kind");
    categories = (cats ?? []) as { id: string; name: string; kind: CategoryKind }[];
  }

  revalidatePath("/dashboard");
  return {
    ok: true as const,
    projectId: project.id as string,
    slug: project.slug as string,
    categories,
  };
}

export type NewOption = {
  categoryId: string;
  title: string;
  meta?: string;
  kind: CategoryKind;
  imagePath?: string;
  color?: string;
};

/** Save the swipeable options for a board's categories. */
export async function saveOptions(options: NewOption[]) {
  const supabase = await createClient();
  if (!supabase || !options.length) return { ok: false as const };
  const { error } = await supabase.from("options").insert(
    options.map((o, i) => ({
      category_id: o.categoryId,
      title: o.title,
      meta: o.meta ?? null,
      kind: o.kind,
      image_path: o.imagePath ?? null,
      color: o.color ?? null,
      position: i,
    })),
  );
  return { ok: !error, reason: error?.message };
}

export async function markAwaiting(projectId: string) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("projects").update({ status: "awaiting-client" }).eq("id", projectId);
  revalidatePath("/dashboard");
}

export type BoardData = {
  id: string;
  name: string;
  client?: string | null;
  slug: string;
  status: string;
  categories: { id: string; name: string; kind: CategoryKind; options: Precedent[] }[];
};

/** Public read of a full board by slug — used by the unauthenticated client link. */
export async function getBoard(slug: string): Promise<BoardData | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("projects")
    .select(
      "id,name,client_name,slug,status,categories(id,name,kind,position,options(id,title,meta,kind,image_path,color,position))",
    )
    .eq("slug", slug)
    .single();
  if (!data) return null;

  const d = data as unknown as {
    id: string;
    name: string;
    client_name: string | null;
    slug: string;
    status: string;
    categories: {
      id: string;
      name: string;
      kind: CategoryKind;
      position: number;
      options: {
        id: string;
        title: string;
        meta: string | null;
        kind: CategoryKind;
        image_path: string | null;
        color: string | null;
        position: number;
      }[];
    }[];
  };

  const categories = (d.categories ?? [])
    .sort((a, b) => a.position - b.position)
    .map((c) => ({
      id: c.id,
      name: c.name,
      kind: c.kind,
      options: (c.options ?? [])
        .sort((a, b) => a.position - b.position)
        .map((o) => ({
          id: o.id,
          categoryId: c.id,
          title: o.title,
          meta: o.meta ?? "",
          kind: o.kind,
          src: publicUrl(o.image_path),
          color: o.color ?? undefined,
        })),
    }));

  return { id: d.id, name: d.name, client: d.client_name, slug: d.slug, status: d.status, categories };
}

/** The signed-in designer's own boards, for the dashboard grid. */
export async function listMyBoards(): Promise<Project[] | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("projects")
    .select("name,client_name,slug,status,created_at,categories(id,options(id))")
    .eq("owner", user.id)
    .order("created_at", { ascending: false });
  if (!data) return [];

  const rows = data as unknown as {
    name: string;
    client_name: string | null;
    slug: string;
    status: string;
    created_at: string;
    categories: { id: string; options: { id: string }[] }[];
  }[];

  return rows.map((p) => ({
    id: p.slug,
    name: p.name,
    client: p.client_name ?? "—",
    status: p.status as Project["status"],
    updated: new Date(p.created_at).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    categories: (p.categories ?? []).map((c) => ({
      id: c.id,
      name: "",
      kind: "photo" as const,
      count: c.options?.length ?? 0,
    })),
    swipeProgress: p.status === "ready" ? 1 : p.status === "swiping" ? 0.5 : 0,
  }));
}

/* ------------------------------------------------- client recording */
export async function startSession(projectId: string) {
  const supabase = await createClient();
  if (!supabase) return null;
  await supabase.from("projects").update({ status: "swiping" }).eq("id", projectId);
  const { data } = await supabase.from("sessions").insert({ project_id: projectId }).select("id").single();
  return (data?.id as string) ?? null;
}

export async function recordResponse(
  sessionId: string,
  optionId: string,
  verdict: "like" | "pass" | "pin",
) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("responses").insert({ session_id: sessionId, option_id: optionId, verdict });
}

export async function recordWinner(sessionId: string, categoryId: string, optionId: string) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("winners").insert({
    session_id: sessionId,
    category_id: categoryId,
    option_id: optionId,
  });
}

export async function completeSession(sessionId: string, projectId: string) {
  const supabase = await createClient();
  if (!supabase) return;
  await supabase.from("sessions").update({ completed_at: new Date().toISOString() }).eq("id", sessionId);
  await supabase.from("projects").update({ status: "ready" }).eq("id", projectId);
  revalidatePath("/dashboard");
}

/* ------------------------------------------------- report generation */
/** Build the finish report from everything the client LIKED, then run the
 *  colour-analysis engine over their liked colours — no showdown. */
export async function buildReport(projectId: string): Promise<Brief | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: sess } = await supabase
    .from("sessions")
    .select("id")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!sess) return null;

  const { data: liked } = await supabase
    .from("responses")
    .select("verdict, options(title, meta, kind, image_path, color, categories(name))")
    .eq("session_id", sess.id)
    .in("verdict", ["like", "pin"]);
  if (!liked || !liked.length) return null;

  const rows = liked as unknown as {
    verdict: string;
    options: {
      title: string;
      meta: string | null;
      kind: CategoryKind;
      image_path: string | null;
      color: string | null;
      categories: { name: string } | null;
    } | null;
  }[];

  const selections = rows
    .filter((r) => r.options)
    .map((r) => ({
      category: r.options!.categories?.name ?? "Finish",
      title: r.options!.title,
      kind: (r.options!.kind ?? "photo") as CategoryKind,
      src: publicUrl(r.options!.image_path),
      color: r.options!.color ?? undefined,
      note: r.options!.meta ?? "",
    }));

  const likedColours: LikedColour[] = selections
    .filter((s) => s.color)
    .map((s) => ({ hex: s.color as string, name: s.title, category: s.category }));

  const profile = analyzeColours(likedColours);

  return {
    style: profile.persona,
    confidence: analysisConfidence(likedColours),
    summary: profile.description,
    palette: profile.palette.length ? profile.palette : [{ name: "Neutral", hex: "#8C9184" }],
    selections,
    notes: profile.traits,
    profile,
  };
}
