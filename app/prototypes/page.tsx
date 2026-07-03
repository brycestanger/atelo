import Link from "next/link";
import { HookDeck, HookFlow, HookReel } from "@/components/landing/hooks";
import { Wordmark } from "@/components/ui";

export const metadata = { title: "Hook prototypes" };

const PROTOS = [
  { n: 1, name: "The Deck", desc: "Swatches fling away like the real swipe — literal, on-brand, kinetic.", C: HookDeck },
  { n: 2, name: "The Flow", desc: "One field morphs smoothly through the whole palette. Calm and premium.", C: HookFlow },
  { n: 3, name: "The Reel", desc: "Colour columns scroll past a focus band, like a living palette picker.", C: HookReel },
];

export default function PrototypesPage() {
  return (
    <div className="min-h-screen bg-bg px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Wordmark />
          </Link>
          <span className="text-[0.85rem] text-muted">Hero hook · pick one</span>
        </div>
        <h1 className="mt-10 text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.03em]">
          Three hooks. Which catches you?
        </h1>
        <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-relaxed text-muted">
          Each is a live take on &ldquo;swiping through colours&rdquo; for the hero.
          Tell me the number and I&apos;ll drop it in.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {PROTOS.map((p) => {
            const Comp = p.C;
            return (
              <div key={p.n} className="flex flex-col">
                <div className="panel rounded-[30px] p-6">
                  <Comp />
                </div>
                <div className="mt-5">
                  <div className="flex items-center gap-2">
                    <span className="grid size-6 place-items-center rounded-full bg-accent text-[0.75rem] font-semibold text-white">
                      {p.n}
                    </span>
                    <h2 className="text-[1.2rem] font-semibold">{p.name}</h2>
                  </div>
                  <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
