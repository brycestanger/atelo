import { Check } from "lucide-react";
import { Button } from "@/components/ui";

export default function CompletePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[520px] flex-col items-center justify-center px-5 py-12 text-center">
      <div className="grid size-16 place-items-center rounded-full border border-accent text-accent">
        <Check className="size-7" strokeWidth={2} />
      </div>
      <h1 className="mt-7 text-[clamp(2rem,7vw,3rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
        That&apos;s your signal<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-[42ch] text-[1.02rem] leading-relaxed text-ink-muted">
        Your picks are in. Atelo is synthesizing them into a structured brief for
        your architect right now — you don&apos;t need to do anything else.
      </p>
      <div className="mt-9 flex flex-col items-center gap-4">
        <Button href="/" variant="ghost-dark" size="lg">
          Learn about Atelo
        </Button>
        <span className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-muted">
          Powered by Atelo
        </span>
      </div>
    </div>
  );
}
