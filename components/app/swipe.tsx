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
import { Button } from "@/components/ui";
import { recordResponse } from "@/lib/actions/projects";
import { dominantHexFromUrl } from "@/lib/colour";

type Verdict = "like" | "pass" | "pin";

/** Buffer a liked colour so the finish screen can analyse it instantly. */
function bufferLike(hex: string, name: string, category: string) {
  try {
    const raw = sessionStorage.getItem("atelo:likes");
    const cur = raw ? (JSON.parse(raw) as unknown[]) : [];
    cur.push({ hex, name, category });
    sessionStorage.setItem("atelo:likes", JSON.stringify(cur));
  } catch {}
}

/** Record a liked option's colour so it feeds the profile — works on ANYTHING:
 *  a swatch carries its hex; a photo gets a representative colour sampled from
 *  the image so uploaded finishes count toward the taste read too. */
function persistLike(p: Precedent, category: string) {
  if (p.color) {
    bufferLike(p.color, p.title, category);
  } else if (p.src) {
    void dominantHexFromUrl(p.src).then((hex) => {
      if (hex) bufferLike(hex, p.title, category);
    });
  }
}

function Card({
  p,
  x,
  interactive = false,
}: {
  p: Precedent;
  x?: MotionValue<number>;
  interactive?: boolean;
}) {
  const local = useMotionValue(0);
  const mx = x ?? local;
  const likeOp = useTransform(mx, [30, 140], [0, 1]);
  const passOp = useTransform(mx, [-140, -30], [1, 0]);

  return (
    <div className="relative h-full w-full select-none overflow-hidden rounded-[24px] border border-line bg-surface shadow-float">
      {p.kind === "swatch" ? (
        <div className="h-full w-full" style={{ background: p.color }} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.src}
          alt={p.title}
          className="h-full w-full object-cover"
          draggable={false}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
      {interactive && (
        <>
          <motion.div
            style={{ opacity: likeOp }}
            className="pointer-events-none absolute right-5 top-5 rounded-lg border-2 border-white px-3 py-1 text-sm font-bold uppercase tracking-wider text-white"
          >
            Love
          </motion.div>
          <motion.div
            style={{ opacity: passOp }}
            className="pointer-events-none absolute left-5 top-5 rounded-lg border-2 border-white/80 px-3 py-1 text-sm font-bold uppercase tracking-wider text-white/90"
          >
            Pass
          </motion.div>
        </>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5">
        <div className="text-[1.2rem] font-semibold leading-tight text-white">
          {p.title}
        </div>
        <div className="mt-0.5 text-[0.82rem] text-white/80">{p.meta}</div>
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
        "grid place-items-center rounded-full transition-all duration-200 active:scale-90",
        large ? "size-16" : "size-13",
        variant === "accent"
          ? "bg-accent text-white shadow-soft hover:bg-accent-press"
          : "border border-line bg-surface text-muted hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function DeckComplete({
  likes,
  nextHref,
  categoryName,
}: {
  likes: number;
  nextHref: string;
  categoryName: string;
}) {
  const last = nextHref.includes("/complete");
  return (
    <div className="flex w-full max-w-[420px] flex-col items-center text-center">
      <div className="grid size-16 place-items-center rounded-full bg-accent/12 text-accent">
        <Check className="size-7" strokeWidth={2} />
      </div>
      <h2 className="mt-6 text-2xl font-semibold tracking-[-0.02em]">
        {categoryName} — done
      </h2>
      <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">
        You loved <span className="text-ink">{likes}</span>{" "}
        {likes === 1 ? "option" : "options"}.{" "}
        {last ? "Let's read your taste." : "On to the next one."}
      </p>
      <Button href={nextHref} variant="accent" size="lg" className="mt-8">
        {last ? "See your colour profile" : "Continue"}
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

export function SwipeDeck({
  categoryName,
  precedents,
  nextHref,
  sessionId,
}: {
  categoryName: string;
  precedents: Precedent[];
  nextHref: string;
  /** when present (real board), each swipe is recorded to Supabase */
  sessionId?: string;
}) {
  const prefersReduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const interactive = mounted && !prefersReduced;

  const [index, setIndex] = useState(0);
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
    if (sessionId) void recordResponse(sessionId, p.id, v).catch(() => {});
    if (v === "like" || v === "pin") {
      setLikes((a) => [...a, p.id]);
      persistLike(p, categoryName);
    }
    setDir(v === "pass" ? -1 : 1);
    x.set(0);
    setIndex((i) => i + 1);
  }

  if (done) {
    return (
      <DeckComplete likes={likes.length} nextHref={nextHref} categoryName={categoryName} />
    );
  }

  return (
    <div className="flex w-full max-w-[400px] flex-col">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[0.85rem] font-medium">
          <span className="size-2 rounded-full bg-accent" /> {categoryName}
        </span>
        <span className="text-[0.8rem] text-muted tnum">
          {index + 1}/{total} · {likes.length} loved
        </span>
      </div>
      <div className="mt-3 h-[4px] w-full overflow-hidden rounded-full bg-ink/8">
        <span
          className="block h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${(index / total) * 100}%` }}
        />
      </div>

      <div className="relative mt-5 aspect-[3/4.1] w-full">
        {peek && (
          <div className="absolute inset-0 translate-y-3 scale-[0.95] opacity-60">
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
        <ActionBtn onClick={() => advance("pin")} variant="accent" large label="Love a favourite">
          <Plus className="size-6" strokeWidth={2.4} />
        </ActionBtn>
        <ActionBtn onClick={() => advance("like")} label="Love">
          <Heart className="size-5" strokeWidth={2.2} />
        </ActionBtn>
      </div>
      <p className="mt-4 text-center text-[0.82rem] text-muted">
        Drag or tap · right to love, left to pass
      </p>
    </div>
  );
}
