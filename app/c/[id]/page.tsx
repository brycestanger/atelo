import { ArrowRight, Heart, X, Plus } from "lucide-react";
import { Button, Dot } from "@/components/ui";
import { ResetLikes } from "@/components/app/client-summary";
import { CATEGORIES, PROJECTS } from "@/lib/mock-data";
import { getBoard } from "@/lib/actions/projects";

const TUTORIAL = [
  { icon: Heart, title: "Swipe right to love", body: "Anything that speaks to you. Don't overthink it." },
  { icon: X, title: "Swipe left to pass", body: "Not your taste? Send it on." },
  { icon: Plus, title: "Tap + for an instant favourite", body: "The ones you adore — they carry extra weight." },
];

export default async function ClientWelcome({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const board = await getBoard(id);
  const mock = PROJECTS.find((p) => p.id === id);

  const clientName = board?.client ?? mock?.client ?? null;
  const projectName = board?.name ?? mock?.name ?? null;
  const firstCat = board?.categories[0];
  const firstHref =
    board && firstCat
      ? `/c/${id}/deck/${firstCat.id}`
      : `/c/${id}/deck/${CATEGORIES[0].id}`;
  const firstName = firstCat?.name ?? CATEGORIES[0].name;
  const catCount = board?.categories.length ?? CATEGORIES.length;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-57px)] max-w-[560px] flex-col justify-center px-5 py-12">
      {/* fresh start for the liked-colours buffer */}
      <ResetLikes />
      <span className="inline-flex w-fit items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[0.8rem] text-muted shadow-soft">
        <Dot /> {clientName ? `For ${clientName}` : "A quick taste check"}
      </span>
      <h1 className="mt-5 text-[clamp(2.2rem,7vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
        Let&apos;s pick your
        <br />
        finishes<span className="text-accent">.</span>
      </h1>
      <p className="mt-5 max-w-[46ch] text-[1.02rem] leading-relaxed text-muted">
        {projectName ? `${projectName} starts with your taste. ` : "This starts with your taste. "}
        Swipe through a few options — about five minutes — and Atelo reads your
        colour profile while your designer shapes everything around it.
      </p>

      <div className="mt-9 space-y-3">
        {TUTORIAL.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.title}
              className="flex items-center gap-4 rounded-card bg-surface p-4 shadow-soft"
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
        <Button href={firstHref} variant="accent" size="lg">
          Begin — {firstName}
          <ArrowRight className="size-4" />
        </Button>
        <span className="text-[0.85rem] text-muted">{catCount} categories</span>
      </div>
    </div>
  );
}
