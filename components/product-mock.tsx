"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { Check, Copy, Heart, Plus, Send, X } from "lucide-react";
import { SAMPLE_BRIEF, TEST_DECK } from "@/lib/mock-data";
import type { Precedent } from "@/lib/types";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCENES = ["Set up the board", "Client swipes", "Finish report"] as const;
const DWELL = 4.4;

function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function Avatar({ label, tone }: { label: string; tone: string }) {
  return (
    <span
      className="grid size-6 place-items-center rounded-full text-[0.6rem] font-medium text-white ring-2 ring-surface"
      style={{ background: tone }}
    >
      {label}
    </span>
  );
}

/* --------------------------------------------------- Scene 1: set up */
function SetupScene() {
  const chips = ["Exterior Colour", "Countertops", "Lighting", "Tile & Stone", "Fixtures"];
  return (
    <div className="grid h-full grid-cols-1 gap-5 p-6 sm:grid-cols-[0.85fr_1.15fr] sm:p-8">
      <div className="hidden flex-col justify-between rounded-2xl bg-surface-2/70 p-5 sm:flex">
        <div className="space-y-3">
          <div className="h-2.5 w-16 rounded-full bg-ink/10" />
          <div className="h-2.5 w-24 rounded-full bg-ink/10" />
          <div className="h-2.5 w-20 rounded-full bg-ink/10" />
        </div>
        <div className="rounded-xl bg-surface p-3 shadow-soft">
          <div className="text-[0.62rem] uppercase tracking-[0.12em] text-muted">Credits</div>
          <div className="mt-1 text-xl font-semibold">3</div>
        </div>
      </div>

      <div className="flex flex-col justify-center">
        <div className="text-[0.72rem] uppercase tracking-[0.14em] text-muted">New project</div>
        <div className="mt-2 flex items-center rounded-xl bg-surface px-4 py-3 text-[1.05rem] font-medium shadow-soft">
          Kerrisdale Kitchen
          <motion.span
            className="ml-0.5 inline-block h-5 w-px bg-accent"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 1.1 }}
          />
        </div>

        <div className="mt-5 text-[0.72rem] uppercase tracking-[0.14em] text-muted">Categories</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="rounded-full bg-surface px-3 py-1.5 text-[0.8rem] shadow-soft">
              {c}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-2 rounded-full bg-surface p-1.5 pl-4 shadow-soft">
          <span className="flex-1 truncate text-[0.82rem] text-muted">
            atelo.studio/c/kerrisdale-kitchen
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[0.78rem] font-medium text-white">
            <Copy className="size-3.5" /> Copy
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------- Scene 2: swipe */
function SwipeScene() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6">
      <div className="rounded-full bg-surface px-3 py-1 text-[0.72rem] text-muted shadow-soft tnum">
        14 loved · 5 pinned
      </div>
      <div className="relative w-[190px]">
        <div className="absolute inset-0 translate-y-2.5 scale-95 rounded-[18px] bg-surface-2" />
        <div className="relative overflow-hidden rounded-[18px] bg-surface shadow-float">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=500&q=80"
            alt="Honed marble countertop"
            className="h-[200px] w-full object-cover"
          />
          <span className="absolute right-3 top-3 rounded-lg border-2 border-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Love
          </span>
          <div className="p-3">
            <div className="text-[0.9rem] font-semibold">Honed Carrara</div>
            <div className="text-[0.72rem] text-muted">Marble · soft matte</div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-surface text-muted shadow-soft">
          <X className="size-4" />
        </span>
        <span className="grid size-11 place-items-center rounded-full bg-accent text-white shadow-soft">
          <Plus className="size-5" />
        </span>
        <span className="grid size-9 place-items-center rounded-full bg-surface text-muted shadow-soft">
          <Heart className="size-4" />
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------- Scene 3: report */
function ReportScene() {
  const b = SAMPLE_BRIEF;
  return (
    <div className="flex h-full flex-col justify-center gap-3 p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 text-[0.72rem] uppercase tracking-[0.14em] text-muted">
          Finish report · Kerrisdale Kitchen
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[0.66rem] font-medium text-white">
          <Check className="size-3" /> Ready
        </span>
      </div>
      <div className="text-[1.6rem] font-semibold leading-none tracking-[-0.02em]">{b.style}</div>
      <div className="flex items-center gap-1.5">
        {b.palette.map((c) => (
          <span key={c.name} className="size-6 rounded-full ring-1 ring-black/5" style={{ background: c.hex }} />
        ))}
        <span className="ml-2 text-[0.78rem] text-muted">{Math.round(b.confidence * 100)}% aligned</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {b.selections
          .filter((s) => s.kind === "photo")
          .slice(0, 3)
          .map((s) => (
            <div key={s.category} className="overflow-hidden rounded-xl bg-surface shadow-soft">
              <div className="aspect-[5/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-2">
                <div className="truncate text-[0.72rem] font-medium">{s.title}</div>
                <div className="truncate text-[0.6rem] text-muted">{s.category}</div>
              </div>
            </div>
          ))}
      </div>
      <div className="flex justify-end">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[0.78rem] font-medium text-white">
          <Send className="size-3.5" /> Send to client
        </span>
      </div>
    </div>
  );
}

const SCENE_COMPONENTS = [SetupScene, SwipeScene, ReportScene];

/* ------------------------------------------ the auto-sliding demo */
export function DemoSlider() {
  const mounted = useMounted();
  const reduce = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const n = SCENE_COMPONENTS.length;
  const advance = () => setIndex((i) => (i + 1) % n);

  // Reduced-motion: no fill animation to drive advance, so use a timer.
  useEffect(() => {
    if (!mounted || !reduce) return;
    const id = setInterval(advance, DWELL * 1000);
    return () => clearInterval(id);
  }, [mounted, reduce, index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-[28px] bg-surface shadow-float">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-hairline bg-surface-2/30 px-5 py-3.5">
          <div className="flex items-center gap-2 text-[0.8rem] font-medium">
            <span className="size-2 rounded-full bg-accent" />
            Atelo
            <span className="text-faint">/</span>
            <span className="text-muted">Kerrisdale Kitchen</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-1.5">
              <Avatar label="L" tone="#B26B47" />
              <Avatar label="A" tone="#26241F" />
              <Avatar label="M" tone="#8C9184" />
            </div>
            <span className="hidden rounded-full bg-surface-2/70 px-3 py-1 text-[0.72rem] text-muted sm:inline">
              Share
            </span>
          </div>
        </div>

        {/* sliding stage */}
        <div className="relative h-[400px] overflow-hidden sm:h-[440px]">
          <motion.div
            className="flex h-full w-full"
            animate={{ x: `-${index * 100}%` }}
            transition={reduce ? { duration: 0 } : { duration: 0.65, ease: EASE }}
          >
            {SCENE_COMPONENTS.map((Scene, i) => (
              <div key={i} className="h-full w-full shrink-0">
                <Scene />
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* segmented progress — three bars that fill with the timer */}
      <div className="mx-auto mt-6 max-w-[440px]">
        <div className="flex gap-2">
          {SCENES.map((label, i) => (
            <button
              key={label}
              onClick={() => setIndex(i)}
              aria-label={label}
              className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-black/10"
            >
              {i < index && <span className="absolute inset-0 rounded-full bg-accent" />}
              {i === index && reduce && (
                <span className="absolute inset-0 rounded-full bg-accent" />
              )}
              {i === index && !reduce && (
                <motion.span
                  key={index}
                  className="absolute inset-y-0 left-0 rounded-full bg-accent"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: DWELL, ease: "linear" }}
                  onAnimationComplete={advance}
                />
              )}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          {SCENES.map((label, i) => (
            <button
              key={label}
              onClick={() => setIndex(i)}
              className={cn(
                "text-[0.8rem] transition-colors",
                index === i ? "font-medium text-ink" : "text-muted hover:text-ink",
              )}
            >
              <span className="mr-1.5 text-accent">{i + 1}</span>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------- interactive test card */
function SwatchFace({ p, float = false }: { p: Precedent; float?: boolean }) {
  return (
    <div
      className={cn(
        "relative h-full w-full select-none overflow-hidden rounded-[24px]",
        float && "shadow-float",
      )}
    >
      <div className="h-full w-full" style={{ background: p.color }} />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-5">
        <div className="text-[1.3rem] font-semibold text-white">{p.title}</div>
        <div className="text-[0.85rem] text-white/85">{p.meta}</div>
      </div>
    </div>
  );
}

/** "Try it" — a real, swipeable deck of exterior colour swatches. Large + prominent. */
export function TestSwipe() {
  const mounted = useMounted();
  const reduce = useReducedMotion() ?? false;
  const interactive = mounted && !reduce;
  const [i, setI] = useState(0);
  const [liked, setLiked] = useState(0);
  const [dir, setDir] = useState(1);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const likeOp = useTransform(x, [20, 130], [0, 1]);
  const nopeOp = useTransform(x, [-130, -20], [1, 0]);

  const deck = TEST_DECK;
  const done = i >= deck.length;

  function go(like: boolean) {
    setDir(like ? 1 : -1);
    if (like) setLiked((n) => n + 1);
    x.set(0);
    setI((n) => n + 1);
  }
  function reset() {
    setI(0);
    setLiked(0);
    x.set(0);
  }

  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col items-center">
      <div className="relative aspect-[4/5] w-full">
        {!done && deck[i + 1] && (
          <div className="absolute inset-0 translate-y-3 scale-[0.96] opacity-70">
            <SwatchFace p={deck[i + 1]} />
          </div>
        )}
        <AnimatePresence custom={dir}>
          {!done ? (
            <motion.div
              key={deck[i].id}
              className={cn("absolute inset-0", interactive && "cursor-grab active:cursor-grabbing")}
              style={interactive ? { x, rotate } : undefined}
              drag={interactive ? "x" : false}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              dragElastic={0.7}
              onDragEnd={(_, info) => {
                if (info.offset.x > 110) go(true);
                else if (info.offset.x < -110) go(false);
              }}
              initial={mounted ? { scale: 0.96, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              exit={interactive ? { x: dir * 440, opacity: 0, rotate: dir * 16 } : { opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              <SwatchFace p={deck[i]} float />
              {interactive && (
                <>
                  <motion.span
                    style={{ opacity: likeOp }}
                    className="pointer-events-none absolute right-5 top-5 rounded-lg border-2 border-white px-3 py-1 text-sm font-bold uppercase tracking-wider text-white"
                  >
                    Love
                  </motion.span>
                  <motion.span
                    style={{ opacity: nopeOp }}
                    className="pointer-events-none absolute left-5 top-5 rounded-lg border-2 border-white/80 px-3 py-1 text-sm font-bold uppercase tracking-wider text-white/90"
                  >
                    Pass
                  </motion.span>
                </>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[24px] bg-surface text-center shadow-float"
            >
              <div className="grid size-14 place-items-center rounded-full bg-accent/12 text-accent">
                <Check className="size-7" />
              </div>
              <div className="text-[1.2rem] font-semibold">You loved {liked} of {deck.length}</div>
              <div className="max-w-[24ch] text-[0.9rem] text-muted">
                That&apos;s the whole client experience — about five minutes.
              </div>
              <button
                onClick={reset}
                className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-5 py-2.5 text-[0.85rem] font-medium transition-colors hover:bg-ink/10"
              >
                Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <div className="mt-6 flex items-center gap-5">
          <button
            onClick={() => go(false)}
            aria-label="Pass"
            className="grid size-14 place-items-center rounded-full bg-surface text-muted shadow-soft transition-all hover:text-ink active:scale-90"
          >
            <X className="size-6" />
          </button>
          <button
            onClick={() => go(true)}
            aria-label="Love"
            className="grid size-16 place-items-center rounded-full bg-accent text-white shadow-float transition-all hover:bg-accent-press active:scale-90"
          >
            <Heart className="size-7" />
          </button>
        </div>
      )}
      <p className="mt-4 text-center text-[0.85rem] text-muted">
        {done ? "Nice taste." : "Drag the card, or tap — try it."}
      </p>
    </div>
  );
}

/** Compact export-ready report used on the landing. */
export function ReportPreview() {
  const b = SAMPLE_BRIEF;
  return (
    <div className="overflow-hidden rounded-[24px] bg-surface shadow-float">
      <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <div className="flex items-center gap-2 text-[0.85rem] font-medium">
          <span className="size-2 rounded-full bg-accent" /> Finish Report
        </div>
        <span className="text-[0.72rem] text-muted">Kerrisdale Kitchen · for The Laurents</span>
      </div>
      <div className="grid gap-6 p-6 sm:grid-cols-[1.1fr_1fr]">
        <div>
          <div className="text-[0.72rem] uppercase tracking-[0.14em] text-muted">Direction</div>
          <div className="mt-1 text-[1.9rem] font-semibold tracking-[-0.02em]">{b.style}</div>
          <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{b.summary}</p>
          <div className="mt-5 flex items-center gap-2">
            {b.palette.map((c) => (
              <div key={c.name} className="flex flex-col items-center gap-1">
                <span className="size-8 rounded-full ring-1 ring-black/5" style={{ background: c.hex }} />
                <span className="text-[0.6rem] text-muted">{c.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-2.5">
          <div className="text-[0.72rem] uppercase tracking-[0.14em] text-muted">Selected finishes</div>
          {b.selections.map((s) => (
            <div key={s.category} className="flex items-center gap-3 rounded-xl bg-surface-2/60 p-2.5">
              {s.kind === "swatch" ? (
                <span className="size-10 shrink-0 rounded-lg" style={{ background: s.color }} />
              ) : (
                <span className="size-10 shrink-0 overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.title} className="h-full w-full object-cover" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[0.85rem] font-medium">{s.title}</div>
                <div className="truncate text-[0.72rem] text-muted">{s.category}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
