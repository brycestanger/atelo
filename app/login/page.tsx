"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button, Wordmark } from "@/components/ui";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setError(null);

    if (isSupabaseConfigured) {
      setBusy(true);
      const supabase = createClient();
      const { error } = await supabase!.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) {
        setError(error.message);
        return;
      }
    }
    setSent(true);
  }

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <div className="w-full max-w-[380px]">
        <Link href="/" aria-label="Atelo home">
          <Wordmark />
        </Link>

        {!sent ? (
          <form onSubmit={onSubmit} className="mt-10">
            <h1 className="text-[1.6rem] font-semibold tracking-[-0.02em]">Sign in</h1>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              We&apos;ll email you a magic link. No passwords, ever.
            </p>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              className="mt-6 h-12 w-full rounded-full border border-line bg-surface px-5 text-[0.95rem] outline-none transition-colors placeholder:text-faint focus:border-ink/40"
            />
            {error && (
              <p className="mt-2 text-[0.82rem] text-accent">{error}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              className={`mt-3 w-full ${busy ? "pointer-events-none opacity-60" : ""}`}
            >
              {busy ? "Sending…" : "Send magic link"} <ArrowRight className="size-4" />
            </Button>
            <p className="mt-6 text-center text-[0.8rem] text-faint">
              {isSupabaseConfigured
                ? "New here? A link creates your account."
                : "Demo mode — connect Supabase (see SUPABASE.md) to go live."}
            </p>
          </form>
        ) : (
          <div className="mt-10">
            <div className="grid size-12 place-items-center rounded-full bg-accent/12 text-accent">
              <Check className="size-6" strokeWidth={2} />
            </div>
            <h1 className="mt-6 text-[1.6rem] font-semibold tracking-[-0.02em]">
              {isSupabaseConfigured ? "Check your email" : "You're all set"}
            </h1>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              {isSupabaseConfigured ? (
                <>
                  We sent a link to <span className="text-ink">{email}</span>. Click
                  it to sign in.
                </>
              ) : (
                "Supabase isn't connected yet, so hop straight into the demo dashboard."
              )}
            </p>
            <Button href="/dashboard" variant="ghost" className="mt-6 w-full">
              Continue to the dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
