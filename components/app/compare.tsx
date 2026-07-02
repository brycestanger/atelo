"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { Precedent } from "@/lib/types";
import { Button, Dot, Tag } from "@/components/ui";

function CompareCard({ p, onPick }: { p?: Precedent; onPick: () => void }) {
  if (!p) return null;
  return (
    <button
      onClick={onPick}
      className="group relative overflow-hidden rounded-[20px] border border-ink-line bg-ink-surface text-left transition-all duration-200 hover:border-accent focus-visible:border-accent active:scale-[0.99]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[3/4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.src}
          alt={p.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <div>
          <div className="text-[1rem] font-semibold text-white">{p.title}</div>
          <div className="mt-0.5 font-mono text-[0.62rem] uppercase tracking-[0.1em] text-white/70">
            {p.meta}
          </div>
        </div>
        <span className="grid size-9 place-items-center rounded-full border border-white/50 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Check className="size-4" />
        </span>
      </div>
    </button>
  );
}

export function CompareArena({
  categoryName,
  contenders,
  nextHref,
}: {
  categoryName: string;
  contenders: Precedent[];
  nextHref: string;
}) {
  const prefersReduced = useReducedMotion() ?? false;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const anim = mounted && !prefersReduced;

  const [round, setRound] = useState<Precedent[]>(contenders);
  const [winners, setWinners] = useState<Precedent[]>([]);
  const [i, setI] = useState(0);

  const champion = round.length <= 1 ? round[0] : null;
  const a = round[i];
  const b = round[i + 1];

  function pick(w?: Precedent) {
    if (!w) return;
    const nw = [...winners, w];
    const ni = i + 2;
    if (ni >= round.length) {
      setRound(nw);
      setWinners([]);
      setI(0);
    } else {
      setWinners(nw);
      setI(ni);
    }
  }

  if (champion) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[460px] flex-col items-center justify-center py-10 text-center">
        <Tag dark className="text-ink-muted">
          <Dot /> {categoryName} — winner
        </Tag>
        <div className="mt-5 w-full overflow-hidden rounded-[22px] border border-accent">
          <div className="aspect-[4/3] w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={champion.src}
              alt={champion.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="bg-ink-surface p-4 text-left">
            <div className="text-[1.05rem] font-semibold">{champion.title}</div>
            <div className="mt-1 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-ink-muted">
              {champion.meta}
            </div>
          </div>
        </div>
        <Button href={nextHref} variant="accent" size="lg" className="mt-7">
          Finish <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-[880px] flex-col justify-center py-8">
      <div className="flex items-center justify-between">
        <Tag dark className="text-ink-muted">
          <Dot /> {categoryName}
        </Tag>
        <span className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-muted">
          {round.length > 2 ? "Semifinal" : "Final"} · pick one
        </span>
      </div>
      <h2 className="mt-3 text-center text-[1.5rem] font-semibold tracking-[-0.02em]">
        Which do you prefer?
      </h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${round.length}-${i}`}
          initial={anim ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          exit={anim ? { opacity: 0, y: -14 } : { opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-6 grid gap-4 sm:grid-cols-2"
        >
          <CompareCard p={a} onPick={() => pick(a)} />
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-ink-line bg-ink-bg font-mono text-[0.68rem] uppercase text-ink-muted sm:grid">
            vs
          </span>
          <CompareCard p={b} onPick={() => pick(b)} />
        </motion.div>
      </AnimatePresence>
      <p className="mt-5 text-center font-mono text-[0.64rem] uppercase tracking-[0.12em] text-ink-muted">
        Tap the one that wins
      </p>
    </div>
  );
}
