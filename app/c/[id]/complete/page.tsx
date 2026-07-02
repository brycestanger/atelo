import { Check } from "lucide-react";
import { Button } from "@/components/ui";

export default function CompletePage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[520px] flex-col items-center justify-center px-5 py-12 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-accent/12 text-accent">
        <Check className="size-7" strokeWidth={2} />
      </div>
      <h1 className="mt-7 text-[clamp(2rem,7vw,3rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
        All done<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-[42ch] text-[1.02rem] leading-relaxed text-muted">
        Your picks are in. Your designer is turning them into a finish report right
        now — nothing else needed from you.
      </p>
      <div className="mt-9 flex flex-col items-center gap-4">
        <Button href="/" variant="ghost" size="lg">
          Learn about Atelo
        </Button>
        <span className="text-[0.78rem] text-muted">Powered by Atelo</span>
      </div>
    </div>
  );
}
