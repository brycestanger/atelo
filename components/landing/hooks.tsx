"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Colour = { name: string; hex: string; meta: string };

const COLOURS: Colour[] = [
  { name: "Sage Stone", hex: "#8C9184", meta: "Textured render" },
  { name: "Warm Clay", hex: "#B26B47", meta: "Lime render" },
  { name: "Charcoal Slate", hex: "#3B3E43", meta: "Fibre cement" },
  { name: "Bone", hex: "#E9E3D6", meta: "Smooth stucco" },
  { name: "Deep Forest", hex: "#33423B", meta: "Timber stain" },
  { name: "Oxide Red", hex: "#9E4B3B", meta: "Through-body brick" },
  { name: "Sand", hex: "#CBB99B", meta: "Lime wash" },
  { name: "Graphite", hex: "#4A4E54", meta: "Standing seam" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function Face({ c, stamp }: { c: Colour; stamp?: "LOVE" | "PASS" }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[28px] shadow-float"
      style={{ background: c.hex }}
    >
      {stamp && (
        <span
          className={cn(
            "absolute right-5 top-5 rounded-lg border-2 px-3 py-1 text-sm font-bold uppercase tracking-wider",
            stamp === "LOVE" ? "border-white text-white" : "border-white/70 text-white/80",
          )}
        >
          {stamp}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-6">
        <div className="text-[1.45rem] font-semibold text-white">{c.name}</div>
        <div className="text-[0.85rem] uppercase tracking-[0.06em] text-white/80">
          {c.meta} · {c.hex}
        </div>
      </div>
    </div>
  );
}

/* -------- Prototype 1 — The Deck: cards fling away like the real swipe */
export function HookDeck() {
  const reduce = useReducedMotion() ?? false;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => v + 1), 2000);
    return () => clearInterval(id);
  }, [reduce]);

  const n = COLOURS.length;
  const stack = [0, 1, 2].map((o) => COLOURS[(i + o) % n]);
  const dir = i % 4 === 3 ? -1 : 1;

  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px]">
      {[2, 1].map((o) => (
        <div
          key={o}
          className="absolute inset-0"
          style={{
            transform: `translateY(${o * 14}px) scale(${1 - o * 0.05})`,
            zIndex: 3 - o,
            opacity: o === 2 ? 0.5 : 0.82,
          }}
        >
          <Face c={stack[o]} />
        </div>
      ))}
      <AnimatePresence initial={false}>
        <motion.div
          key={`${stack[0].hex}-${i}`}
          className="absolute inset-0"
          style={{ zIndex: 4 }}
          initial={reduce ? false : { scale: 0.95, y: -10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1, x: 0, rotate: 0 }}
          exit={
            reduce
              ? { opacity: 0 }
              : { x: dir * 480, rotate: dir * 15, opacity: 0, transition: { duration: 0.45, ease: EASE } }
          }
          transition={{ duration: 0.45, ease: EASE }}
        >
          <Face c={stack[0]} stamp={dir > 0 ? "LOVE" : "PASS"} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* -------- Prototype 2 — The Flow: one field that morphs through the palette */
export function HookFlow() {
  const reduce = useReducedMotion() ?? false;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % COLOURS.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);
  const c = COLOURS[i];

  return (
    <div className="mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-[28px] shadow-float">
      <motion.div
        className="flex h-full w-full flex-col justify-end p-6"
        animate={{ backgroundColor: c.hex }}
        transition={{ duration: 1, ease: EASE }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={c.hex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <div className="text-[1.6rem] font-semibold text-white">{c.name}</div>
            <div className="text-[0.85rem] uppercase tracking-[0.06em] text-white/80">
              {c.meta} · {c.hex}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-5 flex gap-1.5">
          {COLOURS.map((x, idx) => (
            <span
              key={x.hex}
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: idx === i ? 26 : 8,
                background: idx === i ? "#fff" : "rgba(255,255,255,0.45)",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* -------- Prototype 3 — The Reel: colour columns scrolling past a focus band */
export function HookReel() {
  const cols = [
    COLOURS,
    [...COLOURS].reverse(),
    [...COLOURS.slice(3), ...COLOURS.slice(0, 3)],
  ];
  return (
    <div className="relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-[28px] bg-ink shadow-float">
      <div className="grid h-full grid-cols-3 gap-2 p-2">
        {cols.map((col, ci) => (
          <div key={ci} className="relative overflow-hidden rounded-2xl">
            <div
              className="reel-track flex flex-col gap-2"
              style={{
                animationDuration: `${16 + ci * 5}s`,
                animationDirection: ci === 1 ? "reverse" : "normal",
              }}
            >
              {[...col, ...col].map((c, idx) => (
                <div
                  key={idx}
                  className="aspect-square shrink-0 rounded-xl"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-2 top-1/2 h-20 -translate-y-1/2 rounded-2xl border-2 border-white/40" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink opacity-70" />
      <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-1.5 text-[0.8rem] font-medium text-ink">
        Swipe your palette
      </div>
    </div>
  );
}

/* -------- Deck concept B — The Build: each pick flies up into a palette */
export function HookDeckBuild() {
  const reduce = useReducedMotion() ?? false;
  const [i, setI] = useState(0);
  const [palette, setPalette] = useState<Colour[]>([]);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => v + 1), 1700);
    return () => clearInterval(id);
  }, [reduce]);

  useEffect(() => {
    if (i === 0) return;
    const c = COLOURS[(i - 1) % COLOURS.length];
    setPalette((p) => [...p.slice(-4), c]);
  }, [i]);

  const n = COLOURS.length;
  const cur = COLOURS[i % n];
  const peek = COLOURS[(i + 1) % n];

  return (
    <div className="mx-auto flex w-full max-w-[360px] flex-col">
      <div className="relative aspect-[3/4] w-full">
        <div className="absolute inset-0 translate-y-3 scale-[0.96] opacity-70">
          <Face c={peek} />
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            key={`${cur.hex}-${i}`}
            className="absolute inset-0"
            initial={reduce ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={
              reduce
                ? { opacity: 0 }
                : { y: -340, opacity: 0, scale: 0.9, transition: { duration: 0.5, ease: EASE } }
            }
          >
            <Face c={cur} stamp="LOVE" />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-5">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-muted">
          Your palette
        </div>
        <div className="mt-2 flex gap-2">
          {Array.from({ length: 5 }).map((_, idx) => {
            const c = palette[idx];
            return (
              <motion.span
                key={idx}
                className="h-12 flex-1 rounded-xl ring-1 ring-black/5"
                initial={false}
                animate={{ backgroundColor: c ? c.hex : "rgba(0,0,0,0.05)" }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* -------- The Reel (big): full-white, 5 columns, click to lock the line */
export function HookReelBig() {
  const [locked, setLocked] = useState(false);
  const cols = [0, 1, 2, 3, 4].map((ci) => {
    const rot = (ci * 2) % COLOURS.length;
    return [...COLOURS.slice(rot), ...COLOURS.slice(0, rot)];
  });

  return (
    <button
      type="button"
      onClick={() => setLocked((v) => !v)}
      aria-pressed={locked}
      className="group relative block w-full cursor-pointer overflow-hidden rounded-[32px] bg-surface text-left shadow-soft"
      style={{ height: "min(76vh, 720px)" }}
    >
      <div className="grid h-full grid-cols-5 gap-3 p-3">
        {cols.map((col, ci) => (
          <div key={ci} className="relative overflow-hidden">
            <div
              className="reel-track flex flex-col gap-3"
              style={{
                animationDuration: `${18 + ci * 4}s`,
                animationDirection: ci % 2 ? "reverse" : "normal",
                animationPlayState: locked ? "paused" : "running",
              }}
            >
              {[...col, ...col].map((c, idx) => (
                <div
                  key={idx}
                  className="aspect-square shrink-0 rounded-2xl"
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-surface via-surface/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface via-surface/70 to-transparent" />

      <div className="pointer-events-none absolute inset-x-6 top-1/2 -translate-y-1/2">
        <div
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            locked
              ? "bg-accent shadow-[0_0_28px_rgba(255,79,0,0.65)]"
              : "bg-ink/10 group-hover:bg-ink/25",
          )}
        />
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink/90 px-4 py-2 text-[0.82rem] font-medium text-white backdrop-blur">
        {locked ? "Locked — click to release" : "Click to lock your line"}
      </div>
    </button>
  );
}

const SLOTS = 5;
const INTERVAL = 2200; // > throw + ghost travel + pop, so cycles never overlap
const COMMIT_MS = 460; // when the flying ghost "arrives" and the slot receives it

/* -------------------------------------------------------------------------- */
/* Card face — pure static markup. Always render-safe (no motion, no JS gate). */
/* -------------------------------------------------------------------------- */
function CardFace({ c }: { c: Colour }) {
  return (
    <div
      className="relative h-full w-full select-none overflow-hidden rounded-[28px] shadow-float"
      style={{ background: c.hex }}
    >
      {/* soft top sheen for depth on flat colour */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      {/* bottom legibility gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
        <div className="text-[1.45rem] font-semibold leading-tight text-white">
          {c.name}
        </div>
        <div className="mt-1 text-[0.82rem] uppercase tracking-[0.08em] text-white/80">
          {c.meta} · {c.hex}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Palette slot. Empty base always painted (reads without JS). When a colour   */
/* lands it pops in (spring overshoot) with a snap flash + accent glow.        */
/* `popKey` remounts the swatch so re-filling an index re-triggers the pop.     */
/* -------------------------------------------------------------------------- */
function Slot({
  c,
  popKey,
  reduce,
  slotRef,
}: {
  c: Colour | undefined;
  popKey: number;
  reduce: boolean;
  slotRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={slotRef} className="relative aspect-square flex-1">
      {/* empty base — always present so the row reads even before/without JS */}
      <div className="absolute inset-0 rounded-2xl bg-[rgba(0,0,0,0.05)] ring-1 ring-inset ring-black/[0.06]" />
      <AnimatePresence>
        {c && (
          <motion.div
            key={`${c.hex}-${popKey}`}
            className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-inset ring-black/10"
            style={{ background: c.hex }}
            initial={reduce ? false : { scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : { type: "spring", stiffness: 460, damping: 18, mass: 0.7 }
            }
          >
            {!reduce && (
              <>
                {/* white snap flash */}
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-2xl"
                  style={{ boxShadow: "0 0 0 3px rgba(255,255,255,0.9) inset" }}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                />
                {/* brand accent glow ring blooms then fades */}
                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-accent"
                  initial={{ opacity: 0.85, scale: 1.14 }}
                  animate={{ opacity: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function HookHero() {
  const reduce = useReducedMotion() ?? false;

  // Hydration-safe: content is NEVER gated on this — only autoplay + motion.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [step, setStep] = useState(0); // advances one card per fling
  const [committed, setCommitted] = useState(0); // advances when a colour lands
  const active = mounted && !reduce;

  // Per-slot rising key so re-filling an index re-pops it.
  const [popKeys, setPopKeys] = useState<number[]>(() =>
    Array.from({ length: SLOTS }, () => 0),
  );

  // The flying ghost swatch (Ghost-to-slot). null between flings.
  const [ghost, setGhost] = useState<{
    hex: string;
    to: { x: number; y: number };
    id: number;
  } | null>(null);

  const n = COLOURS.length;
  const current = COLOURS[step % n];
  const peek = COLOURS[(step + 1) % n];
  // Mostly "Love" (it's a palette you're keeping); an occasional "Pass" for life.
  const dir = step % 5 === 4 ? -1 : 1;

  const originRef = useRef<HTMLDivElement>(null); // where the ghost is born
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Palette = trailing window of the last SLOTS committed colours (newest last).
  // Derived purely from `committed`, so it can never drift from the animation.
  const palette = useMemo(() => {
    const out: Colour[] = [];
    for (let k = Math.max(0, committed - SLOTS); k < committed; k++) {
      out.push(COLOURS[k % n]);
    }
    return out;
  }, [committed, n]);

  // Where the NEXT colour lands: first empty slot, else the last (after shift).
  const targetIndex = committed < SLOTS ? committed : SLOTS - 1;

  // Latest values live in a ref so the interval effect mounts ONCE and never
  // tears down / re-creates each cycle (avoids timing drift + double fires).
  const tickRef = useRef<() => void>(() => {});
  tickRef.current = () => {
    // Measure exact origin -> target slot delta (transform-only travel).
    const origin = originRef.current;
    const target = slotRefs.current[targetIndex];
    if (origin && target) {
      const oR = origin.getBoundingClientRect();
      const tR = target.getBoundingClientRect();
      const dx = tR.left + tR.width / 2 - (oR.left + oR.width / 2);
      const dy = tR.top + tR.height / 2 - (oR.top + oR.height / 2);
      setGhost({ hex: current.hex, to: { x: dx, y: dy }, id: step });
    }
    setStep((v) => v + 1);
  };

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let commitTimer = 0;

    const id = window.setInterval(() => {
      // Fling the card + launch the ghost on the next frame (post-measure).
      raf = window.requestAnimationFrame(() => tickRef.current());
      // The colour "arrives": commit it so the receiving slot pops in sync.
      commitTimer = window.setTimeout(() => {
        setCommitted((c) => c + 1);
        setGhost(null);
      }, COMMIT_MS);
    }, INTERVAL);

    return () => {
      window.clearInterval(id);
      window.cancelAnimationFrame(raf);
      window.clearTimeout(commitTimer);
    };
  }, [active]);

  // Bump the receiving slot's popKey exactly when a colour commits, so the
  // slot's spring-pop + glow fire as the ghost snaps home.
  useEffect(() => {
    if (committed === 0) return;
    const idx = committed - 1 < SLOTS ? committed - 1 : SLOTS - 1;
    setPopKeys((k) => {
      const copy = k.slice();
      copy[idx] = copy[idx] + 1;
      return copy;
    });
  }, [committed]);

  // Reduced-motion / no-JS view: a pre-filled palette so it never looks empty.
  const staticPalette = useMemo(() => COLOURS.slice(0, SLOTS), []);
  // Hydration-safe: `reduce` (useReducedMotion) is false on the server but the
  // real value on the client, so branching the FIRST render on it mismatches.
  // Until mounted we render the dynamic base on both sides; then switch.
  const showStatic = mounted && reduce;

  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col items-stretch">
      {/* -------- Card stage -------- */}
      <div className="relative aspect-[3/4] w-full">
        {/* Peek card underneath — reveals the next colour as the top card leaves. */}
        {!showStatic && (
          <div
            aria-hidden
            className="absolute inset-0 translate-y-3 scale-[0.955] opacity-70"
          >
            <CardFace c={peek} />
          </div>
        )}

        {/* Invisible origin marker: bottom-left of the card, where the ghost is born. */}
        <div
          ref={originRef}
          aria-hidden
          className="pointer-events-none absolute bottom-7 left-7 h-10 w-10"
        />

        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={showStatic ? "static" : `${current.hex}-${step}`}
            className="absolute inset-0"
            style={{ zIndex: 2 }}
            initial={showStatic ? false : { scale: 0.94, y: -14, opacity: 0 }}
            animate={
              showStatic
                ? { scale: 1, y: 0, opacity: 1 }
                : {
                    // Lift + scale-overshoot: the springy "ready to throw" beat.
                    scale: [0.94, 1.035, 1],
                    y: [-14, -6, 0],
                    x: 0,
                    rotate: 0,
                    opacity: 1,
                  }
            }
            exit={
              showStatic
                ? { opacity: 0 }
                : {
                    // The throw: spring fling with rotation + a touch of scale-up.
                    x: dir * 560,
                    y: -40,
                    rotate: dir * 16,
                    scale: 1.04,
                    opacity: 0,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                      mass: 0.9,
                      opacity: { duration: 0.32, ease: EASE },
                    },
                  }
            }
            transition={{
              duration: 0.5,
              ease: EASE,
              scale: { duration: 0.5, ease: EASE, times: [0, 0.55, 1] },
              y: { duration: 0.5, ease: EASE, times: [0, 0.55, 1] },
            }}
          >
            <div className="relative h-full w-full">
              <CardFace c={current} />
              {/* Love / Pass stamp that pops as the card commits. */}
              {!showStatic && (
                <motion.span
                  className={cn(
                    "pointer-events-none absolute top-6 rounded-xl border-[2.5px] px-3.5 py-1.5 text-[0.95rem] font-bold uppercase tracking-[0.14em]",
                    dir > 0
                      ? "right-6 -rotate-[14deg] border-accent text-accent"
                      : "left-6 rotate-[14deg] border-white/85 text-white/90",
                  )}
                  initial={{ opacity: 0, scale: 1.6 }}
                  animate={{
                    opacity: [0, 1, 1, 0.9],
                    scale: [1.6, 0.92, 1, 1],
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.12,
                    ease: EASE,
                    times: [0, 0.4, 0.7, 1],
                  }}
                >
                  {dir > 0 ? "Love" : "Pass"}
                </motion.span>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* -------- The flying ghost swatch (Ghost-to-slot) -------- */}
        <AnimatePresence>
          {ghost && !showStatic && (
            <motion.div
              key={ghost.id}
              aria-hidden
              className="pointer-events-none absolute bottom-7 left-7 z-30 h-10 w-10 rounded-xl shadow-soft ring-2 ring-white/70"
              style={{ background: ghost.hex }}
              initial={{ x: 0, y: 0, scale: 1, opacity: 0, rotate: -6 }}
              animate={{
                x: ghost.to.x,
                y: ghost.to.y,
                // Anticipation bulge, then shrink to slot size on arrival.
                scale: [1, 1.12, 0.62],
                opacity: [0, 1, 1],
                rotate: [-6, 4, 0],
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.12 } }}
              transition={{
                duration: COMMIT_MS / 1000,
                ease: [0.5, 0, 0.2, 1],
                opacity: { duration: 0.18, ease: EASE },
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* -------- Palette strip -------- */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted">
            Your palette
          </span>
          <span className="text-[0.72rem] font-medium tabular-nums text-faint">
            {showStatic ? SLOTS : Math.min(palette.length, SLOTS)}/{SLOTS}
          </span>
        </div>
        <div className="mt-2.5 flex gap-2.5">
          {Array.from({ length: SLOTS }).map((_, idx) => (
            <Slot
              key={idx}
              slotRef={(el) => {
                slotRefs.current[idx] = el;
              }}
              c={showStatic ? staticPalette[idx] : palette[idx]}
              popKey={popKeys[idx]}
              reduce={showStatic}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
