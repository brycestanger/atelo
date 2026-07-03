import { ArrowRight, Send, Sparkles, Smartphone, SquarePen } from "lucide-react";
import { ProjectsBoard } from "@/components/app/dashboard-ui";
import { Button, Dot } from "@/components/ui";
import { getAccount, listMyBoards } from "@/lib/actions/projects";

export const metadata = { title: "Boards" };

const FLOW = [
  {
    icon: SquarePen,
    title: "Set up a board",
    body: "Name the project, add the categories you care about — colours, countertops, lighting — and drop in the options.",
  },
  {
    icon: Send,
    title: "Send one link",
    body: "No login for your client. It opens on their phone and they're swiping in seconds.",
  },
  {
    icon: Smartphone,
    title: "They swipe — it goes in progress",
    body: "Love, pass, pin. You watch each board move from awaiting to swiping in real time.",
  },
  {
    icon: Sparkles,
    title: "You get the report",
    body: "Atelo reads their taste and hands you a client-ready finish report to send right back.",
  },
];

/** First-run intro for a signed-in studio with no boards yet — no mock clutter,
 *  just the workflow and one clear way to start. */
function Onboarding() {
  return (
    <div className="mx-auto max-w-[760px]">
      <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3.5 py-1.5 text-[0.8rem] text-muted shadow-soft">
        <Dot /> Welcome to your studio
      </span>
      <h1 className="mt-5 text-[clamp(2rem,5vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
        Let&apos;s set up your first board<span className="text-accent">.</span>
      </h1>
      <p className="mt-4 max-w-[52ch] text-[1.05rem] leading-relaxed text-muted">
        Every project runs the same calm loop — you build a board, your client
        swipes it on their phone, and it moves through <em className="not-italic text-ink">awaiting</em>,{" "}
        <em className="not-italic text-ink">in&nbsp;progress</em>, and{" "}
        <em className="not-italic text-ink">ready</em> right here as they go.
      </p>

      <div className="mt-9 grid gap-3 sm:grid-cols-2">
        {FLOW.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="rounded-card border border-line bg-surface p-5 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <div className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">
                  Step {i + 1}
                </div>
              </div>
              <h3 className="mt-3 text-[1.05rem] font-semibold tracking-[-0.01em]">
                {s.title}
              </h3>
              <p className="mt-1 text-[0.9rem] leading-relaxed text-muted">{s.body}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-3">
        <Button href="/dashboard/new" variant="accent" size="lg">
          Create your first board
          <ArrowRight className="size-4" />
        </Button>
        <Button href="/c/kerrisdale-kitchen" variant="ghost" size="lg">
          See a live example
        </Button>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const [real, account] = await Promise.all([listMyBoards(), getAccount()]);
  const projects = real ?? [];

  // No boards yet (new studio, or demo mode) → the intro, never mock clutter.
  if (projects.length === 0) {
    return <Onboarding />;
  }

  const ready = projects.filter((p) => p.status === "ready").length;
  const canCreate = account ? account.canCreate : true;
  const showSlots = account && account.plan !== "pro";
  const remaining = account?.remaining ?? 0;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.02em]">Boards</h1>
          <p className="mt-1 text-[0.92rem] text-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
            {ready} ready to present
            {showSlots
              ? ` · ${remaining} board ${remaining === 1 ? "slot" : "slots"} left`
              : ""}
          </p>
        </div>
        {canCreate ? (
          <Button href="/dashboard/new" variant="primary">
            New board
          </Button>
        ) : (
          <Button href="/dashboard/credits" variant="primary">
            Get a board slot
          </Button>
        )}
      </header>
      <div className="mt-8">
        <ProjectsBoard projects={projects} account={account} />
      </div>
    </>
  );
}
