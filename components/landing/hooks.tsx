"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Heart, X } from "lucide-react";
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


/* ========================================================================== *
 * HookHero — autoplaying swipe demo, modelled as a real physical deck.        *
 *                                                                             *
 * Two counters drive everything, so the animation and the palette can never  *
 * desync:                                                                     *
 *   step      — advances one card per swipe (front card flings away).         *
 *   committed — advances a beat later, when that colour "lands" in the strip. *
 * Both increase forever and are read modulo COLOURS.length, so the loop is    *
 * genuinely endless — nothing ever resets to zero, there is no seam.          *
 *                                                                             *
 * The stage keeps a small WINDOW of cards persistently mounted, each keyed by *
 * its monotonic index. When `step` ticks the front card leaves the window and *
 * flings away (AnimatePresence exit) while every survivor keeps its identity  *
 * and SPRINGS up one depth level — the card behind was always there, so the   *
 * reveal is instant and there is never an empty frame.                        *
 * ========================================================================== */

const SLOTS = 5;
const BEAT = 2400; // ms between swipes — unhurried but alive
const DROP_MS = 360; // colour lands in the palette as the flung card clears frame
const CYCLE = SLOTS + 1; // fill all five, then one empty beat → the row resets to start

type PaletteItem = { id: number; c: Colour };

// Depth ladder for the deck. Index 0 = front; the last rung is where new cards
// enter (fully transparent) so promotion reads as a fade-up, never a pop. Every
// value is a resting target a card SPRINGS toward when it changes depth.
const RUNGS = [
  { y: 0, scale: 1, opacity: 1 }, // 0 — front, in focus
  { y: 16, scale: 0.955, opacity: 0.85 }, // 1 — next up
  { y: 32, scale: 0.912, opacity: 0.4 }, // 2 — a whisper of the stack
  { y: 46, scale: 0.874, opacity: 0 }, // 3 — incoming, waiting off-opacity
] as const;
const WINDOW = RUNGS.length;
const PROMOTE = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const;

// Mostly "love" (it's a palette you're keeping); an occasional "pass" for life.
const isLove = (k: number) => k % 5 !== 4;

/* -------------------------------------------------------------------------- */
/* Card face — pure static markup. Always render-safe (no motion, no JS gate). */
/* -------------------------------------------------------------------------- */
function CardFace({ c }: { c: Colour }) {
  return (
    <div
      className="relative h-full w-full select-none overflow-hidden rounded-[28px] shadow-float ring-1 ring-black/5"
      style={{ background: c.hex }}
    >
      {/* soft top sheen for depth on flat colour */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/12 to-transparent" />
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
/* SwipeCue — the verdict of the swipe that JUST happened. Nothing shows while  */
/* a card rests; this flashes in only after the swipe fires, on the side that   */
/* matches the action (Heart on the RIGHT to keep, X on the LEFT to pass — the  */
/* same way the card flings) then fades out, so nothing sits on permanently.    */
/* Opacity-only keyframes, so it stays gentle under reduced-motion too.         */
/* -------------------------------------------------------------------------- */
function SwipeCue({ love }: { love: boolean }) {
  return (
    <motion.div
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.24)] ring-1 backdrop-blur-sm",
        love
          ? "right-5 bg-accent text-white ring-white/25"
          : "left-5 bg-white/92 text-ink ring-black/5",
      )}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.06, 1, 0.94] }}
      transition={{ duration: 1.05, times: [0, 0.16, 0.62, 1], ease: EASE }}
    >
      {love ? (
        <Heart className="h-[1.35rem] w-[1.35rem]" fill="currentColor" strokeWidth={0} />
      ) : (
        <X className="h-[1.4rem] w-[1.4rem]" strokeWidth={2.75} />
      )}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/* Palette strip — fills left→right as colours land, one per swipe. The beat   */
/* after it reaches 5/5 the whole row clears and a fresh, random set begins:   */
/* a satisfying fill-and-reset loop, not an endless crawl. Chips sit in FIXED  */
/* slots (no sliding), so full and calm modes differ only in intensity — full  */
/* drops each chip in from the card above with a spring + a one-shot accent    */
/* bloom on the freshest; calm is a gentle in-place cross-fade.                */
/* -------------------------------------------------------------------------- */
function PaletteStrip({
  items,
  latestId,
  full,
}: {
  items: PaletteItem[];
  latestId: number;
  full: boolean;
}) {
  return (
    <div className="relative">
      {/* empty base — always present so the row reads before it fills */}
      <div className="flex gap-2.5">
        {Array.from({ length: SLOTS }).map((_, idx) => (
          <div
            key={idx}
            className="aspect-square flex-1 rounded-2xl bg-black/[0.05] ring-1 ring-inset ring-black/[0.06]"
          />
        ))}
      </div>

      {/* filled chips, one per slot; AnimatePresence plays the reset sweep */}
      <div className="absolute inset-0 flex gap-2.5">
        {Array.from({ length: SLOTS }).map((_, idx) => {
          const item = items[idx];
          return (
            <div key={idx} className="relative aspect-square flex-1">
              <AnimatePresence>
                {item && (
                  <motion.div
                    key={item.id}
                    className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_3px_10px_rgba(0,0,0,0.10)] ring-1 ring-inset ring-black/10"
                    style={{ background: item.c.hex }}
                    initial={full ? { opacity: 0, y: -24, scale: 0.55 } : { opacity: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: full ? 0.7 : 1,
                      transition: { duration: 0.34, ease: EASE },
                    }}
                    transition={
                      full
                        ? {
                            type: "spring",
                            stiffness: 440,
                            damping: 30,
                            mass: 0.85,
                            opacity: { duration: 0.3, ease: EASE },
                          }
                        : { duration: 0.5, ease: EASE }
                    }
                  >
                    {full && item.id === latestId && (
                      <motion.span
                        className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-inset ring-accent"
                        initial={{ opacity: 0.9, scale: 1.3 }}
                        animate={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 0.65, ease: EASE }}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* StackCard — one card in the persistent deck.                                */
/*                                                                             */
/* It is keyed by its monotonic index `k`, so as `step` advances the same DOM  */
/* node changes `depth` and SPRINGS to the shallower rung — a real card lifted */
/* off the top of the deck, never a fresh element popping in. The front card   */
/* (depth 0) carries the Verdict chip; when it leaves the window AnimatePresence*/
/* keeps it mounted at its last state and plays `exit`, flinging it — chip and  */
/* all — off frame on an accelerating arc. zIndex is `-k`, so the card you just */
/* threw always rides above the deck settling beneath it.                      */
/* -------------------------------------------------------------------------- */
function StackCard({
  k,
  depth,
  colour,
}: {
  k: number;
  depth: number;
  colour: Colour;
}) {
  const love = isLove(k);
  const dir = love ? 1 : -1;
  const rung = RUNGS[Math.min(depth, WINDOW - 1)];
  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: -k }}
      initial={{
        y: RUNGS[WINDOW - 1].y,
        scale: RUNGS[WINDOW - 1].scale,
        opacity: 0,
      }}
      animate={{ y: rung.y, scale: rung.scale, opacity: rung.opacity }}
      exit={{
        x: dir * 560,
        y: -44,
        rotate: dir * 12,
        opacity: 0,
        transition: {
          x: { duration: 0.42, ease: [0.5, 0, 0.75, 0] }, // accelerate away
          y: { duration: 0.42, ease: EASE },
          rotate: { duration: 0.42, ease: EASE },
          opacity: { duration: 0.34, ease: [0.55, 0, 1, 1] },
        },
      }}
      transition={PROMOTE}
    >
      <div className="relative h-full w-full">
        <CardFace c={colour} />
      </div>
    </motion.div>
  );
}

export function HookHero() {
  const reduce = useReducedMotion() ?? false;

  // `mounted` keeps the first render identical on server + client (both false),
  // so hydration never mismatches; the kinetic variant switches on after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [step, setStep] = useState(0); // advances one card per swipe
  const [committed, setCommitted] = useState(0); // advances when a colour lands

  // full = large, kinetic motion (fling + spring). Otherwise a calm cross-
  // dissolve that STILL cycles — reduced-motion users get a living hero with no
  // vestibular motion. The autoplay loop runs in both modes; only visuals differ.
  const full = mounted && !reduce;

  const n = COLOURS.length;

  // A long, client-generated random order of colour indices (no immediate
  // repeats, so adjacent cards never match). Built in an effect so the first
  // server + client render stay identical; until then colours fall back to a
  // stable sequence. Read modulo its length, so the supply is effectively
  // endless and each fresh fill cycle draws a new, random set.
  const [order, setOrder] = useState<number[]>([]);
  useEffect(() => {
    const seq: number[] = [];
    let prev = -1;
    for (let k = 0; k < 240; k++) {
      let r = Math.floor(Math.random() * n);
      if (r === prev) r = (r + 1) % n;
      seq.push(r);
      prev = r;
    }
    setOrder(seq);
  }, [n]);
  const colourAt = (k: number): Colour =>
    COLOURS[order.length ? order[k % order.length] : k % n];

  const current = colourAt(step); // front colour (calm mode reads this)
  // The verdict of the swipe that just fired belongs to the card that left —
  // index step-1. Right for a keep, left for a pass (matches its fling).
  const cueLove = isLove(step - 1);
  // Window of card indices, front-first: [step, step+1, … step+WINDOW-1].
  const deck = Array.from({ length: WINDOW }, (_, d) => step + d);

  // Fill progress within the current cycle: 0..SLOTS. It climbs one per landed
  // colour up to 5/5, then the next beat lands on 0 — the row empties for a beat
  // and starts over. `items` are this cycle's landed colours, keyed by their
  // monotonic index so keys never collide and the reset can't desync.
  const filled = committed % CYCLE;
  const items = useMemo<PaletteItem[]>(() => {
    const out: PaletteItem[] = [];
    for (let j = committed - filled; j < committed; j++) {
      out.push({ id: j, c: colourAt(j) });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, filled, order]);

  // Autoplay: swipe now, land the colour a beat later so its chip drops in as
  // the flung card clears frame. ONE interval for the whole lifetime — no per-
  // cycle teardown, so the cadence can never drift. Cleaned up on unmount.
  useEffect(() => {
    if (!mounted) return;
    let land = 0;
    const id = window.setInterval(() => {
      setStep((v) => v + 1);
      land = window.setTimeout(() => setCommitted((c) => c + 1), DROP_MS);
    }, BEAT);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(land);
    };
  }, [mounted]);

  return (
    <div className="mx-auto flex w-full max-w-[380px] flex-col items-stretch">
      {/* -------- Card stage (`isolate` contains the deck's negative z-order) -------- */}
      <div className="relative aspect-[3/4] w-full isolate">
        {full ? (
          /* FULL — a tactile deck. Every rung of RUNGS is a persistently mounted
             card; on each beat the front leaves the window and flings while the
             survivors keep identity and spring up one rung. The card behind was
             always there, so the reveal is instant — no empty frame, no gap. */
          <AnimatePresence initial={false}>
            {deck.map((k) => (
              <StackCard
                key={k}
                k={k}
                depth={k - step}
                colour={colourAt(k)}
              />
            ))}
          </AnimatePresence>
        ) : (
          /* CALM — reduced-motion / pre-mount. A faint static backing keeps depth
             while the front cross-dissolves in place: zero translate or rotate,
             yet still cycling and alive. */
          <>
            <div
              aria-hidden
              className="absolute inset-0 scale-[0.965] opacity-45"
            >
              <CardFace c={colourAt(step + 1)} />
            </div>
            <AnimatePresence initial={false}>
              <motion.div
                key={step}
                className="absolute inset-0"
                style={{ zIndex: 2 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <CardFace c={current} />
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* verdict cue — appears only after a swipe, on its side, then fades */}
        <AnimatePresence>
          {step > 0 && <SwipeCue key={step} love={cueLove} />}
        </AnimatePresence>
      </div>

      {/* -------- Palette strip -------- */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <span className="text-[0.72rem] font-medium uppercase tracking-[0.14em] text-muted">
            Your palette
          </span>
          <span className="tnum text-[0.72rem] font-medium text-faint">
            {filled}/{SLOTS}
          </span>
        </div>
        <div className="mt-2.5">
          <PaletteStrip items={items} latestId={committed - 1} full={full} />
        </div>
      </div>
    </div>
  );
}
