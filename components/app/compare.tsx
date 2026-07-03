"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import type { Precedent } from "@/lib/types";
import { Button } from "@/components/ui";
import { recordWinner, completeSession } from "@/lib/actions/projects";

function Face({ p }: { p: Precedent }) {
  if (p.kind === "swatch") {
    return <div className="h-full w-full" style={{ background: p.color }} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={p.src}
      alt={p.title}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
  );
}

function CompareCard({ p, onPick }: { p?: Precedent; onPick: () => void }) {
  if (!p) return null;
  return (
    <button
      onClick={onPick}
      className="group relative overflow-hidden rounded-[22px] border border-line bg-surface text-left shadow-soft transition-all duration-200 hover:border-accent hover:shadow-float focus-visible:border-accent active:scale-[0.99]"
    >
      <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[3/4]">
        <Face p={p} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
        <div>
          <div className="text-[1.05rem] font-semibold text-white">{p.title}</div>
          <div className="mt-0.5 text-[0.75rem] text-white/80">{p.meta}</div>
        </div>
        <span className="grid size-9 place-items-center rounded-full bg-accent text-white opacity-0 transition-opacity group-hover:opacity-100">
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
  sessionId,
  projectId,
  categoryId,
  finalStep = true,
}: {
  categoryName: string;
  contenders: Precedent[];
  nextHref: string;
  sessionId?: string;
  projectId?: string;
  categoryId?: string;
  /** false when more categories follow — session is only completed on the last */
  finalStep?: boolean;
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

  // On a real board, record the winner + finish the session (once).
  const fired = useRef(false);
  useEffect(() => {
    if (champion && sessionId && categoryId && !fired.current) {
      fired.current = true;
      void recordWinner(sessionId, categoryId, champion.id).catch(() => {});
      if (finalStep && projectId) {
        void completeSession(sessionId, projectId).catch(() => {});
      }
    }
  }, [champion, sessionId, projectId, categoryId, finalStep]);

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
        <span className="inline-flex items-center gap-2 text-[0.85rem] font-medium">
          <span className="size-2 rounded-full bg-accent" /> {categoryName} — winner
        </span>
        <div className="mt-5 w-full overflow-hidden rounded-[24px] border border-accent shadow-float">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <Face p={champion} />
          </div>
          <div className="bg-surface p-4 text-left">
            <div className="text-[1.05rem] font-semibold">{champion.title}</div>
            <div className="mt-0.5 text-[0.8rem] text-muted">{champion.meta}</div>
          </div>
        </div>
        <Button href={nextHref} variant="accent" size="lg" className="mt-7">
          {finalStep ? "Finish" : "Next category"} <ArrowRight className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] w-full max-w-[880px] flex-col justify-center py-8">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[0.85rem] font-medium">
          <span className="size-2 rounded-full bg-accent" /> {categoryName}
        </span>
        <span className="text-[0.8rem] text-muted">
          {round.length > 2 ? "Semifinal" : "Final"} · pick one
        </span>
      </div>
      <h2 className="mt-3 text-center text-[1.6rem] font-semibold tracking-[-0.02em]">
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
          <span className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-[0.7rem] font-medium uppercase text-muted shadow-soft sm:grid">
            vs
          </span>
          <CompareCard p={b} onPick={() => pick(b)} />
        </motion.div>
      </AnimatePresence>
      <p className="mt-5 text-center text-[0.82rem] text-muted">
        Tap the one that wins
      </p>
    </div>
  );
}
