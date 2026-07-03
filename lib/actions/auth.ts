"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Create an account with email + password. Uses the admin API with
 * email_confirm:true so there's no email-verification round-trip — the user
 * can sign in immediately. Returns ok even if the account already exists.
 */
export async function signUpUser(email: string, password: string) {
  const admin = createAdminClient();
  if (!admin) return { ok: false as const, reason: "not-configured" };
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      return { ok: true as const, existed: true };
    }
    return { ok: false as const, reason: error.message };
  }
  return { ok: true as const, existed: false };
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}
