"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, Wordmark } from "@/components/ui";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { signUpUser } from "@/lib/actions/auth";

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);
    setBusy(true);

    if (!isSupabaseConfigured) {
      window.location.assign("/dashboard");
      return;
    }
    const supabase = createClient();
    if (!supabase) {
      window.location.assign("/dashboard");
      return;
    }
    try {
      if (mode === "signup") {
        const res = await signUpUser(email, password);
        if (!res.ok) {
          setError(res.reason || "Could not create account.");
          setBusy(false);
          return;
        }
      }
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      window.location.assign("/dashboard");
    } catch {
      setError("Something went wrong. Try again.");
      setBusy(false);
    }
  }

  const inputCls =
    "h-12 w-full rounded-2xl bg-surface px-4 text-[0.95rem] shadow-soft outline-none transition-shadow placeholder:text-faint focus:ring-2 focus:ring-accent/30";

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <div className="w-full max-w-[380px]">
        <Link href="/" aria-label="Atelo home">
          <Wordmark />
        </Link>
        <h1 className="mt-10 text-[1.7rem] font-semibold tracking-[-0.02em]">
          {mode === "signin" ? "Welcome back" : "Create your studio"}
        </h1>
        <p className="mt-2 text-[0.92rem] text-muted">
          {mode === "signin"
            ? "Sign in to your Atelo dashboard."
            : "Email and a password — that's it."}
        </p>

        <form onSubmit={submit} className="mt-7 space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            autoComplete="email"
            className={inputCls}
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "signup" ? "Password (6+ characters)" : "Password"}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className={inputCls}
          />
          {error && <p className="text-[0.82rem] text-accent">{error}</p>}
          <Button
            type="submit"
            variant="primary"
            className={`w-full ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="mt-6 text-center text-[0.85rem] text-muted">
          {mode === "signin" ? "New to Atelo? " : "Already have an account? "}
          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
            }}
            className="font-medium text-ink underline-offset-4 hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
        {!isSupabaseConfigured && (
          <p className="mt-4 text-center text-[0.78rem] text-faint">
            Demo mode — connect Supabase to go live.
          </p>
        )}
      </div>
    </div>
  );
}
