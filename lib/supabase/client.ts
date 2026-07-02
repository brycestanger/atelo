"use client";

import { createBrowserClient } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when Supabase env vars are present. Lets the UI degrade to demo mode. */
export const isSupabaseConfigured = Boolean(url && key);

/** Browser Supabase client, or null when not configured (demo mode). */
export function createClient() {
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
