"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  LayoutGrid,
  Plus,
  Coins,
  Settings,
  ArrowUpRight,
  Trash2,
  Lock,
} from "lucide-react";
import type { Account, Project, ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button, Dot, Wordmark } from "@/components/ui";
import { signOut } from "@/lib/actions/auth";
import { deleteBoard } from "@/lib/actions/projects";

/** ISO yyyy-mm-dd → "Jul 15" */
function fmtDue(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const NAV = [
  { label: "Boards", href: "/dashboard", icon: LayoutGrid },
  { label: "New board", href: "/dashboard/new", icon: Plus },
  { label: "Credits", href: "/dashboard/credits", icon: Coins },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar({ account }: { account?: Account | null }) {
  const path = usePathname();
  const pro = account?.plan === "pro";
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-line bg-surface/60 px-4 py-6 lg:flex">
      <Link href="/" className="px-2">
        <Wordmark />
      </Link>
      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {NAV.map((n) => {
          const active =
            n.href === "/dashboard"
              ? path === n.href
              : path.startsWith(n.href);
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-[0.9rem] transition-colors",
                active
                  ? "bg-ink/[0.06] font-medium text-ink"
                  : "text-muted hover:bg-ink/[0.03] hover:text-ink",
              )}
            >
              <Icon className="size-4" strokeWidth={1.9} />
              {n.label}
              {active && <Dot className="ml-auto size-[0.4rem]" />}
            </Link>
          );
        })}
      </nav>
      <div className="rounded-card border border-line bg-bg p-4">
        <div className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">
          {pro ? "Plan" : "Board credits"}
        </div>
        {pro ? (
          <div className="mt-1 text-[1.05rem] font-semibold">Pro · Unlimited</div>
        ) : (
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-2xl font-semibold tnum">{account?.remaining ?? 0}</span>
            <span className="text-[0.8rem] text-muted">
              of {account?.credits ?? 1} left
            </span>
          </div>
        )}
        <Button href="/dashboard/credits" variant="ghost" size="sm" className="mt-3 w-full">
          {pro ? "Manage plan" : "Buy more"}
        </Button>
      </div>
      <button
        onClick={() => signOut()}
        className="mt-3 w-full rounded-full px-3 py-2 text-[0.85rem] text-muted transition-colors hover:text-ink"
      >
        Sign out
      </button>
    </aside>
  );
}

export function MobileTopbar() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-bg/85 px-5 py-3 backdrop-blur-md lg:hidden">
      <Link href="/">
        <Wordmark />
      </Link>
      <Button href="/dashboard/new" size="sm">
        New board
      </Button>
    </div>
  );
}

const STATUS: Record<ProjectStatus, { label: string; text: string; dot: string }> = {
  draft: { label: "Draft", text: "text-faint", dot: "bg-faint" },
  "awaiting-client": {
    label: "Awaiting client",
    text: "text-muted",
    dot: "border border-muted",
  },
  swiping: { label: "Swiping", text: "text-accent", dot: "bg-accent animate-pulse" },
  synthesizing: { label: "Synthesizing", text: "text-accent", dot: "bg-accent" },
  ready: { label: "Ready", text: "text-ink", dot: "bg-ink" },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const s = STATUS[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em]",
        s.text,
      )}
    >
      <span className={cn("size-[0.45rem] rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

export function ProjectCard({
  p,
  onDelete,
  busy,
}: {
  p: Project;
  onDelete?: (slug: string) => void;
  busy?: boolean;
}) {
  const pct = Math.round(p.swipeProgress * 100);
  const precedents = p.categories.reduce((a, c) => a + c.count, 0);
  const when = p.updated.split("·").pop()?.trim();
  return (
    <Link
      href={`/dashboard/project/${p.id}`}
      className={cn(
        "group relative flex min-h-[220px] flex-col rounded-card border border-line bg-surface p-5 transition-all hover:border-ink/25",
        busy && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex items-center justify-between">
        <StatusBadge status={p.status} />
        <div className="flex items-center gap-0.5">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(p.id);
              }}
              aria-label={`Delete ${p.name}`}
              className="grid size-7 place-items-center rounded-full text-faint opacity-0 transition-all hover:bg-accent/10 hover:text-accent focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
          <ArrowUpRight className="size-4 text-faint transition-colors group-hover:text-ink" />
        </div>
      </div>
      <h3 className="mt-4 text-[1.15rem] font-semibold tracking-[-0.01em]">
        {p.name}
      </h3>
      <p className="mt-0.5 text-[0.85rem] text-muted">
        {p.client !== "—" ? p.client : "No client yet"}
      </p>

      <div className="flex-1" />

      <div className="mt-5">
        <div className="flex items-center justify-between font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">
          <span>Swipe progress</span>
          <span className="tnum">{pct}%</span>
        </div>
        <div className="mt-1.5 h-[5px] overflow-hidden rounded-full bg-ink/[0.07]">
          <span
            className="block h-full rounded-full bg-accent"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-muted">
        <span>
          {p.categories.length} cat · {precedents} imgs
        </span>
        <span>{p.due ? `Due ${fmtDue(p.due)}` : when}</span>
      </div>
    </Link>
  );
}

function NewBoardCard({ canCreate = true }: { canCreate?: boolean }) {
  if (!canCreate) {
    return (
      <Link
        href="/dashboard/credits"
        className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line px-4 text-center text-muted transition-colors hover:border-accent hover:text-accent"
      >
        <Lock className="size-6" strokeWidth={1.8} />
        <span className="font-mono text-[0.66rem] uppercase leading-relaxed tracking-[0.12em]">
          Out of board slots
          <br />
          Get more credits
        </span>
      </Link>
    );
  }
  return (
    <Link
      href="/dashboard/new"
      className="flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-card border border-dashed border-line text-muted transition-colors hover:border-accent hover:text-accent"
    >
      <Plus className="size-6" strokeWidth={1.8} />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em]">
        New board
      </span>
    </Link>
  );
}

const FILTERS = [
  { key: "all", label: "All" },
  { key: "awaiting-client", label: "Awaiting" },
  { key: "swiping", label: "In progress" },
  { key: "ready", label: "Ready" },
];

export function ProjectsBoard({
  projects,
  account,
}: {
  projects: Project[];
  account?: Account | null;
}) {
  const [f, setF] = useState("all");
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);

  function handleDelete(slug: string) {
    if (
      !window.confirm(
        "Delete this board? Its client link, every swipe, and the report are removed. This can't be undone.",
      )
    )
      return;
    setBusyId(slug);
    startTransition(async () => {
      await deleteBoard(slug);
      setBusyId(null);
      router.refresh();
    });
  }

  const shown =
    f === "all"
      ? projects
      : projects.filter(
          (p) =>
            p.status === f ||
            (f === "swiping" && p.status === "synthesizing"),
        );
  const canCreate = account ? account.canCreate : true;
  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-b border-line pb-3">
        {FILTERS.map((t) => (
          <button
            key={t.key}
            onClick={() => setF(t.key)}
            className={cn(
              "rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors",
              f === t.key ? "bg-ink text-white" : "text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div
        className="mt-6 grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))" }}
      >
        {shown.map((p) => (
          <ProjectCard key={p.id} p={p} onDelete={handleDelete} busy={busyId === p.id} />
        ))}
        {f === "all" && <NewBoardCard canCreate={canCreate} />}
      </div>
    </>
  );
}
