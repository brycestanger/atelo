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
  if (!error) return { ok: true as const, existed: false };

  // Account already exists (e.g. a passwordless user left over from an earlier
  // magic-link attempt). Set the password + confirm so sign-in works.
  // NOTE: before launch, gate this behind a real "forgot password" flow —
  // here "sign up" doubles as "set password", which is fine for early testing.
  if (/already|registered|exists/i.test(error.message)) {
    const { data } = await admin.auth.admin.listUsers();
    const existing = data?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase(),
    );
    if (existing) {
      const { error: upErr } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
      });
      if (upErr) return { ok: false as const, reason: upErr.message };
      return { ok: true as const, existed: true };
    }
    return { ok: false as const, reason: "Account exists — please sign in." };
  }
  return { ok: false as const, reason: error.message };
}

export async function signOut() {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/login");
}
