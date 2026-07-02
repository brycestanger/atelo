"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";
import { X, Plus, Heart, ArrowRight, Check } from "lucide-react";
import type { Precedent } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button, Dot, Tag } from "@/components/ui";

type Verdict = "like" | "pass" | "pin";

function Card({
  p,
  x,
  interactive = false,
}: {
  p: Precedent;
  x?: MotionValue<number>;
  interactive?: boolean;
}) {
  // Hooks run unconditionally; a local fallback keeps the peek card valid.
  const local = useMotionValue(0);
  const mx = x ?? local;
  const likeOp = useTransform(mx, [30, 140], [0, 1]);
  const passOp = useTransform(mx, [-140, -30], [1, 0]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-[22px] border border-ink-line bg-ink-surface">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.src}
        alt={p.title}
        className="h-full w-full object-cover"
        draggable={false}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
      {interactive && (
        <>
          <motion.div
            style={{ opacity: likeOp }}
            className="pointer-events-none absolute right-5 top-5 rounded-lg border-2 border-accent px-3 py-1 font-mono text-sm font-bold uppercase tracking-wider text-accent"
          >
            Like
          </motion.div>
          <motion.div
            style={{ opacity: passOp }}
            className="pointer-events-none absolute left-5 top-5 rounded-lg border-2 border-white/80 px-3 py-1 font-mono text-sm font-bold uppercase tracking-wider text-white"
          >
            Pass
          </motion.div>
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <div className="text-[1.15rem] font-semibold leading-tight text-white">
          {p.title}
        </div>
        <div className="mt-1 flex items-center justify-between font-mono text-[0.64rem] uppercase tracking-[0.1em] text-white/70">
          <span>{p.meta}</span>
          <span>{p.location}</span>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  variant = "ghost",
  large = false,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "ghost" | "accent";
  large?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid place-items-center rounded-full border transition-all duration-200 active:scale-90",
        large ? "size-16" : "size-13",
        variant === "accent"
          ? "border-accent bg-accent text-[var(--color-on-accent)] hover:bg-accent-press"
          : "border-ink-line text-ink-text hover:border-white/50 hover:bg-white/5",
      )}
    >
      {children}
    </button>
  );
}

function DeckComplete({
  pins,
  likes,
  nextHref,
  categoryName,
}: {
  pins: number;
  likes: number;
  nextHref: string;
  categoryName: string;
}) {
  return (
    <div className="flex w-full max-w-[420px] flex-col items-center text-center">
      <div className="grid size-16 place-items-center rounded-full border border-accent text-accent">
        <Check className="size-7" strokeWidth={2} />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
        {categoryName} — done
      </h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-muted">
        You pinned <span className="text-ink-text">{pins}</span> and liked{" "}
        <span className="text-ink-text">{likes}</span>.{" "}
        {pins > 1 ? "Now pick a winner." : "Nicely done."}
      </p>
      <Button href={nextHref} variant="accent" size="lg" className="mt-8">
        {pins > 1 ? "Start the showdown" : "Continue"}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

export function SwipeDeck({
  categoryName,
  precedents,
  nextHref,
}: {
  categoryName: string;
  precedents: Precedent[];
  nextHref: string;
}) {
  const prefersReduced = useReducedMotion() ?? false;
  // Gate interactivity behind mount so SSR and first client render match.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const interactive = mounted && !prefersReduced;

  const [index, setIndex] = useState(0);
  const [pins, setPins] = useState<string[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [dir, setDir] = useState(1);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-240, 240], [-14, 14]);

  const total = precedents.length;
  const current = precedents[index];
  const peek = precedents[index + 1];
  const done = index >= total;

  function advance(v: Verdict) {
    const p = precedents[index];
    if (!p) return;
    if (v === "pin") setPins((a) => [...a, p.id]);
    if (v === "like" || v === "pin") setLikes((a) => [...a, p.id]);
    setDir(v === "pass" ? -1 : 1);
    x.set(0);
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <DeckComplete
        pins={pins.length}
        likes={likes.length}
        nextHref={nextHref}
        categoryName={categoryName}
      />
    );
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col">
      <div className="flex items-center justify-between">
        <Tag dark className="text-ink-muted">
          <Dot /> {categoryName}
        </Tag>
        <span className="font-mono text-[0.68rem] tracking-[0.1em] text-ink-muted tnum">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}{" "}
          · {pins.length} pinned
        </span>
      </div>
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <div className="relative mt-5 aspect-[3/4.15] w-full">
        {peek && (
          <div className="absolute inset-0 translate-y-3 scale-[0.95] opacity-50">
            <Card p={peek} />
          </div>
        )}
        <AnimatePresence custom={dir}>
          <motion.div
            key={current.id}
            className={cn(
              "absolute inset-0",
              interactive && "cursor-grab active:cursor-grabbing",
            )}
            style={interactive ? { x, rotate } : undefined}
            drag={interactive ? "x" : false}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.75}
            onDragEnd={(_, info) => {
              if (info.offset.x > 120) advance("like");
              else if (info.offset.x < -120) advance("pass");
            }}
            initial={mounted ? { scale: 0.96, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            exit={
              interactive
                ? {
                    x: dir * 520,
                    opacity: 0,
                    rotate: dir * 18,
                    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  }
                : { opacity: 0 }
            }
          >
            <Card p={current} x={x} interactive={interactive} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-5">
        <ActionBtn onClick={() => advance("pass")} label="Pass">
          <X className="size-5" strokeWidth={2.2} />
        </ActionBtn>
        <ActionBtn onClick={() => advance("pin")} variant="accent" large label="Pin">
          <Plus className="size-6" strokeWidth={2.4} />
        </ActionBtn>
        <ActionBtn onClick={() => advance("like")} label="Like">
          <Heart className="size-5" strokeWidth={2.2} />
        </ActionBtn>
      </div>
      <p className="mt-4 text-center font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-muted">
        Drag or tap · right likes · left passes · + pins
      </p>
    </div>
  );
}
