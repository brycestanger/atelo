import { ArrowRight, Heart, X, Plus } from "lucide-react";
import { Button, Dot } from "@/components/ui";
import { CATEGORIES, PROJECTS } from "@/lib/mock-data";

const TUTORIAL = [
  {
    icon: Heart,
    title: "Swipe right to love",
    body: "Anything that speaks to you. Don't overthink it.",
  },
  {
    icon: X,
    title: "Swipe left to pass",
    body: "Not your taste? Send it on.",
  },
  {
    icon: Plus,
    title: "Tap + to pin a favourite",
    body: "The ones you adore. They face off later.",
  },
];

export default async function ClientWelcome({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  const first = CATEGORIES[0];

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[560px] flex-col justify-center px-5 py-12">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.8rem] text-muted shadow-soft">
        <Dot /> {project?.client ? `For ${project.client}` : "A quick taste check"}
      </span>
      <h1 className="mt-5 text-[clamp(2.2rem,7vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
        Let&apos;s pick your
        <br />
        finishes<span className="text-accent">.</span>
      </h1>
      <p className="mt-5 max-w-[46ch] text-[1.02rem] leading-relaxed text-muted">
        {project?.name
          ? `${project.name} starts with your taste. `
          : "This starts with your taste. "}
        Swipe through a few options — about five minutes — and your designer shapes
        everything around what you choose.
      </p>

      <div className="mt-9 space-y-3">
        {TUTORIAL.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.title}
              className="flex items-center gap-4 rounded-card border border-line bg-surface p-4 shadow-soft"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                <Icon className="size-4" strokeWidth={2} />
              </span>
              <div>
                <div className="text-[0.95rem] font-medium">{t.title}</div>
                <div className="text-[0.85rem] text-muted">{t.body}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-9 flex items-center gap-4">
        <Button href={`/c/${id}/deck/${first.id}`} variant="accent" size="lg">
          Begin — {first.name}
          <ArrowRight className="size-4" />
        </Button>
        <span className="text-[0.85rem] text-muted">{CATEGORIES.length} categories</span>
      </div>
    </div>
  );
}
