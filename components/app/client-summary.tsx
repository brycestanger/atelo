"use client";

import { useEffect, useState } from "react";
import { analyzeColours, type LikedColour } from "@/lib/analysis";
import type { ColourProfile } from "@/lib/types";
import { ProfileCard } from "@/components/app/profile-card";
import { completeSession } from "@/lib/actions/projects";
import { Button } from "@/components/ui";

const KEY = "atelo:likes";

/** Clears the liked-colours buffer — dropped on the welcome screen so every
 *  run of the swipe starts fresh. */
export function ResetLikes() {
  useEffect(() => {
    try {
      sessionStorage.removeItem(KEY);
    } catch {}
  }, []);
  return null;
}

/** The client-facing finish — runs the colour analysis on what they just liked
 *  (read from sessionStorage, so it's instant and needs no round-trip) and, for
 *  a real board, marks the session complete server-side. */
export function ClientSummary({ s, p }: { s?: string; p?: string }) {
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<ColourProfile | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    let liked: LikedColour[] = [];
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) liked = JSON.parse(raw) as LikedColour[];
    } catch {}
    setCount(liked.length);
    if (liked.length) setProfile(analyzeColours(liked));
    if (s && p) void completeSession(s, p).catch(() => {});
  }, [s, p]);

  // deterministic first paint (matches SSR) — avoids a hydration mismatch
  if (!mounted) return <div className="min-h-[70vh]" />;

  if (!profile || count === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[520px] flex-col items-center justify-center px-5 py-12 text-center">
        <h1 className="text-[clamp(2rem,7vw,3rem)] font-semibold tracking-[-0.03em]">
          All done<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 max-w-[42ch] text-[1.02rem] leading-relaxed text-muted">
          Your picks are in — your designer is turning them into a finish report
          right now.
        </p>
        <Button href="/" variant="ghost" size="lg" className="mt-8">
          Learn about Atelo
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[660px] px-5 py-12 sm:py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[0.8rem] text-muted shadow-soft">
          <span className="size-2 rounded-full bg-accent" /> All done — here&apos;s your read
        </span>
        <h1 className="mt-5 text-[clamp(2rem,7vw,3rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
          You, after {count} {count === 1 ? "swipe" : "swipes"}
          <span className="text-accent">.</span>
        </h1>
      </div>

      <div className="mt-8 rounded-[28px] border border-line bg-surface p-6 shadow-float sm:p-8">
        <ProfileCard profile={profile} />
      </div>

      <div className="mt-8 flex flex-col items-center gap-4 text-center">
        <p className="max-w-[44ch] text-[0.92rem] leading-relaxed text-muted">
          Your designer gets this exact read — plus every finish you loved — as a
          client-ready report.
        </p>
        <Button href="/" variant="ghost" size="lg">
          Learn about Atelo
        </Button>
      </div>
    </div>
  );
}
