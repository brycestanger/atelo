"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Plus, X, Heart } from "lucide-react";
import { precedentsByCategory, SAMPLE_BRIEF } from "@/lib/mock-data";
import type { Precedent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Dot, Tag } from "@/components/ui";

const DECK = precedentsByCategory("exterior");
const VERDICTS = ["PIN", "LIKE", "PASS", "LIKE"] as const;

function DeckCard({
  p,
  muted = false,
  badge,
}: {
  p: Precedent;
  muted?: boolean;
  badge?: (typeof VERDICTS)[number];
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-ink-line bg-ink-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.src}
        alt={p.title}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/5" />
      {badge && !muted && (
        <div
          className={cn(
            "absolute left-4 top-4 rounded-full border px-3 py-1 font-mono text-[0.62rem] font-medium uppercase tracking-[0.16em] backdrop-blur-sm",
            badge === "PASS"
              ? "border-white/40 text-white/90"
              : badge === "PIN"
                ? "border-accent bg-accent text-[var(--color-on-accent)]"
                : "border-white/70 text-white",
          )}
        >
          {badge}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <div className="text-[0.98rem] font-medium leading-tight text-white">
          {p.title}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-white/70">
            {p.meta}
          </span>
          <span className="font-mono text-[0.62rem] tracking-[0.1em] text-white/50">
            {p.location}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Animated hero visual: a self-advancing swipe deck in the dark "toad" world. */
export function SwipeDeckMock({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => v + 1), 2900);
    return () => clearInterval(id);
  }, [reduce]);

  const stack = [0, 1, 2].map((o) => DECK[(i + o) % DECK.length]);
  const verdict = VERDICTS[i % VERDICTS.length];
  const dir = verdict === "PASS" ? -1 : 1;

  return (
    <div
      className={cn(
        "w-full max-w-[380px] rounded-[26px] border border-ink-line bg-ink-bg p-3 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      {/* device top bar */}
      <div className="flex items-center justify-between px-1 pb-3 pt-1">
        <Tag dark className="text-ink-muted">
          <Dot className="size-[0.4rem]" /> EXTERIOR MASSING
        </Tag>
        <span className="font-mono text-[0.66rem] tracking-[0.1em] text-ink-muted tnum">
          {String((i % DECK.length) + 1).padStart(2, "0")} / 24
        </span>
      </div>

      {/* card stack */}
      <div className="relative aspect-[3/4] w-full">
        {[2, 1].map((o) => {
          const p = stack[o];
          return (
            <div
              key={`${p.id}-${o}`}
              className="absolute inset-0"
              style={{
                transform: `translateY(${o * 12}px) scale(${1 - o * 0.05})`,
                opacity: o === 2 ? 0.45 : 0.8,
                zIndex: 3 - o,
              }}
            >
              <DeckCard p={p} muted />
            </div>
          );
        })}

        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={stack[0].id}
            className="absolute inset-0"
            style={{ zIndex: 4 }}
            initial={reduce ? false : { scale: 0.95, y: -12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0, x: 0 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { x: dir * 460, rotate: dir * 15, opacity: 0 }
            }
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <DeckCard p={stack[0]} badge={verdict} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* actions */}
      <div className="flex items-center justify-center gap-4 pb-1 pt-4">
        <ActionButton active={verdict === "PASS"} kind="pass">
          <X className="size-4" strokeWidth={2.2} />
        </ActionButton>
        <ActionButton active={verdict === "PIN"} kind="pin" large>
          <Plus className="size-5" strokeWidth={2.4} />
        </ActionButton>
        <ActionButton active={verdict === "LIKE"} kind="like">
          <Heart className="size-4" strokeWidth={2.2} />
        </ActionButton>
      </div>
    </div>
  );
}

function ActionButton({
  children,
  active,
  kind,
  large = false,
}: {
  children: React.ReactNode;
  active: boolean;
  kind: "pass" | "pin" | "like";
  large?: boolean;
}) {
  const isPin = kind === "pin";
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full border transition-all duration-300",
        large ? "size-14" : "size-11",
        isPin
          ? active
            ? "scale-110 border-accent bg-accent text-[var(--color-on-accent)]"
            : "border-accent/60 text-accent"
          : active
            ? "border-white/80 bg-white/10 text-white"
            : "border-ink-line text-ink-muted",
      )}
    >
      {children}
    </span>
  );
}

/** The payoff: a synthesized brief card (light world). */
export function BriefPreview({ className }: { className?: string }) {
  const b = SAMPLE_BRIEF;
  const top = b.materials.slice(0, 4);
  return (
    <div
      className={cn(
        "w-full max-w-[420px] rounded-[18px] border border-line bg-surface p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <Tag dot>SYNTHESIZED BRIEF</Tag>
        <span className="font-mono text-[0.7rem] tracking-[0.08em] text-accent tnum">
          {Math.round(b.confidence * 100)}% CONFIDENCE
        </span>
      </div>

      <h3 className="mt-4 text-[1.5rem] font-semibold leading-[1.05] tracking-[-0.02em]">
        {b.style}
      </h3>

      <div className="mt-5 space-y-2.5">
        {top.map((m, idx) => (
          <div key={m.name} className="flex items-center gap-3">
            <span className="w-40 shrink-0 truncate text-[0.82rem] text-ink">
              {m.name}
            </span>
            <span className="relative h-[6px] flex-1 overflow-hidden rounded-full bg-ink/[0.07]">
              <span
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full",
                  idx === 0 ? "bg-accent" : "bg-ink/70",
                )}
                style={{ width: `${m.pct}%` }}
              />
            </span>
            <span className="w-9 text-right font-mono text-[0.72rem] text-muted tnum">
              {m.pct}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <div className="flex items-center gap-2">
          {b.palette.map((c) => (
            <span
              key={c.name}
              title={`${c.name} ${c.hex}`}
              className="size-5 rounded-full border border-line"
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
        <span className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
          5 materials · 5 tones
        </span>
      </div>
    </div>
  );
}
