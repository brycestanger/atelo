"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button, Wordmark } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <div className="w-full max-w-[380px]">
        <Link href="/" aria-label="Atelo home">
          <Wordmark />
        </Link>

        {!sent ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setSent(true);
            }}
            className="mt-10"
          >
            <h1 className="text-[1.6rem] font-semibold tracking-[-0.02em]">
              Sign in
            </h1>
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
            <Button type="submit" variant="primary" className="mt-3 w-full">
              Send magic link <ArrowRight className="size-4" />
            </Button>
            <p className="mt-6 text-center font-mono text-[0.66rem] uppercase tracking-[0.12em] text-faint">
              New here? A link creates your account.
            </p>
          </form>
        ) : (
          <div className="mt-10">
            <div className="grid size-12 place-items-center rounded-full border border-accent text-accent">
              <Check className="size-6" strokeWidth={2} />
            </div>
            <h1 className="mt-6 text-[1.6rem] font-semibold tracking-[-0.02em]">
              Check your email
            </h1>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
              We sent a link to <span className="text-ink">{email}</span>. Click
              it to sign in.
            </p>
            <Button href="/dashboard" variant="ghost" className="mt-6 w-full">
              Continue to the demo dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
