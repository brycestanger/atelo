"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Heart, Plus, X } from "lucide-react";
import { SAMPLE_BRIEF } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    title: "Set it up in a minute",
    body: "Name the project, add the categories you care about — colours, countertops, lighting, whatever — and drop in the options.",
  },
  {
    title: "Send one simple link",
    body: "No login for your client. It opens on their phone and they're swiping in seconds.",
  },
  {
    title: "They swipe, favourites face off",
    body: "Love, pass, pin. Then the pinned picks go head-to-head until one wins each category.",
  },
  {
    title: "You get the report",
    body: "A client-ready finish report — palette, picks, and takeaways — lands on your dashboard. Export to PDF and send.",
  },
];

function StepVisual({ step }: { step: number }) {
  if (step === 0) {
    const chips = ["Exterior Colour", "Countertops", "Lighting", "Tile", "Fixtures"];
    return (
      <div className="rounded-2xl bg-surface p-5 shadow-float">
        <div className="text-[0.66rem] uppercase tracking-[0.14em] text-muted">New project</div>
        <div className="mt-2 rounded-xl bg-surface-2/60 px-4 py-3 text-[1rem] font-medium">
          Harbourfront Residence
        </div>
        <div className="mt-4 text-[0.66rem] uppercase tracking-[0.14em] text-muted">Categories</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {chips.map((c) => (
            <span key={c} className="rounded-full bg-surface-2/70 px-3 py-1.5 text-[0.8rem]">
              {c}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-surface-2/60 p-1.5 pl-4">
          <span className="flex-1 truncate text-[0.8rem] text-muted">atelo.studio/c/harbourfront</span>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[0.76rem] font-medium text-white">
            <Copy className="size-3.5" /> Copy
          </span>
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="mx-auto w-[220px] rounded-[30px] bg-ink p-2.5 shadow-float">
        <div className="rounded-[22px] bg-surface p-6 text-center">
          <div className="mx-auto grid size-10 place-items-center rounded-full bg-accent/12 text-accent">
            <Heart className="size-5" />
          </div>
          <div className="mt-3 text-[1.05rem] font-semibold leading-tight">
            Let&apos;s pick your finishes
          </div>
          <div className="mt-1 text-[0.78rem] text-muted">For the Merrins</div>
          <div className="mt-5 rounded-full bg-accent py-2.5 text-[0.82rem] font-medium text-white">
            Begin →
          </div>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="mx-auto w-[240px]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] shadow-float">
          <div className="h-full w-full" style={{ background: "#8C9184" }} />
          <span className="absolute right-3 top-3 rounded-lg border-2 border-white px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Love
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
            <div className="text-[1.05rem] font-semibold text-white">Sage Stone</div>
            <div className="text-[0.75rem] text-white/80">Textured render</div>
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-surface text-muted shadow-soft">
            <X className="size-5" />
          </span>
          <span className="grid size-13 place-items-center rounded-full bg-accent text-white shadow-float">
            <Plus className="size-6" />
          </span>
          <span className="grid size-11 place-items-center rounded-full bg-surface text-muted shadow-soft">
            <Heart className="size-5" />
          </span>
        </div>
      </div>
    );
  }
  const b = SAMPLE_BRIEF;
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-float">
      <div className="flex items-center justify-between">
        <div className="text-[0.66rem] uppercase tracking-[0.14em] text-muted">Finish report</div>
        <span className="inline-flex items-center gap-1 rounded-full bg-ink px-2.5 py-1 text-[0.62rem] font-medium text-white">
          <Check className="size-3" /> Ready
        </span>
      </div>
      <div className="mt-2 text-[1.5rem] font-semibold tracking-[-0.02em]">{b.style}</div>
      <div className="mt-3 flex gap-1.5">
        {b.palette.map((c) => (
          <span key={c.name} className="size-6 rounded-full ring-1 ring-black/5" style={{ background: c.hex }} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {b.selections
          .filter((s) => s.kind === "photo")
          .slice(0, 3)
          .map((s) => (
            <div key={s.category} className="overflow-hidden rounded-lg bg-surface-2/40">
              <div className="aspect-[5/4] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt={s.title} className="h-full w-full object-cover" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

/** Chronicle-style scroll-active section: a sticky visual that crossfades as
 *  the matching step scrolls into the middle of the viewport. */
export function Showcase() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.i);
            if (!Number.isNaN(i)) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="how" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <div className="max-w-[46ch]">
        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          From first idea to client-ready.
        </h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
          The whole discovery phase, in one calm flow.
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="order-1 lg:order-none">
          <div className="lg:sticky lg:top-24">
            <div className="panel relative flex h-[360px] items-center justify-center overflow-hidden rounded-[30px] p-6 sm:h-[440px] lg:h-[500px]">
              <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full glow-warm opacity-70 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 size-64 rounded-full glow-cool opacity-50 blur-3xl" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0 flex items-center justify-center p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                >
                  <div className="w-full max-w-[360px]">
                    <StepVisual step={active} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              data-i={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              className={cn(
                "rounded-2xl p-6 transition-all duration-300 lg:flex lg:min-h-[42vh] lg:flex-col lg:justify-center",
                active === i ? "bg-surface shadow-soft" : "opacity-45",
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-[0.8rem] font-semibold transition-colors",
                    active === i ? "bg-accent text-white" : "bg-ink/10 text-muted",
                  )}
                >
                  {i + 1}
                </span>
                <h3 className="text-[1.3rem] font-semibold tracking-[-0.01em]">{s.title}</h3>
              </div>
              <p className="mt-2 pl-10 text-[0.98rem] leading-relaxed text-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
