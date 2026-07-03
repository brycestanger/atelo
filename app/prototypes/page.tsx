import Link from "next/link";
import { HookDeck, HookDeckBuild, HookReelBig } from "@/components/landing/hooks";
import { Wordmark } from "@/components/ui";

export const metadata = { title: "Hook prototypes" };

function ProtoCard({
  tag,
  name,
  desc,
  children,
}: {
  tag: string;
  name: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <div className="panel flex items-center justify-center rounded-[30px] p-6 sm:p-10">
        {children}
      </div>
      <div className="mt-5">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-accent text-[0.75rem] font-semibold text-white">
            {tag}
          </span>
          <h2 className="text-[1.2rem] font-semibold">{name}</h2>
        </div>
        <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{desc}</p>
      </div>
    </div>
  );
}

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
          Two takes on the deck.
        </h1>
        <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-relaxed text-muted">
          The deck is live in the hero. Here are two flavours — tell me which you
          prefer (or I&apos;ll blend them).
        </p>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <ProtoCard
            tag="A"
            name="The Deck — Fling"
            desc="Cards fly off left and right with love / pass, straight from the real swipe. Kinetic and on-brand."
          >
            <HookDeck />
          </ProtoCard>
          <ProtoCard
            tag="B"
            name="The Deck — Build"
            desc="Each pick flies up and drops into a palette that builds beneath it — you watch the report take shape."
          >
            <HookDeckBuild />
          </ProtoCard>
        </div>

        <div className="mt-24">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-full bg-ink text-[0.72rem] font-semibold text-white">
              R
            </span>
            <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.02em]">
              The Reel — in the back pocket
            </h2>
          </div>
          <p className="mt-3 max-w-[56ch] text-[1.02rem] leading-relaxed text-muted">
            Full-bleed on white, five columns drifting past soft fades top and bottom.
            Click anywhere to lock your line in orange.
          </p>
          <div className="mt-8">
            <HookReelBig />
          </div>
        </div>
      </div>
    </div>
  );
}
