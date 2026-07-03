import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  ClientLinkBar,
  FinishReport,
  ProjectActions,
  ProjectManageBar,
} from "@/components/app/results";
import { StatusBadge } from "@/components/app/dashboard-ui";
import { PROJECTS, SAMPLE_BRIEF } from "@/lib/mock-data";
import { buildReport, getBoard } from "@/lib/actions/projects";
import type { ProjectStatus } from "@/lib/types";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const board = await getBoard(id); // real board by slug (null in demo mode)
  const mock = PROJECTS.find((p) => p.id === id);

  const name = board?.name ?? mock?.name ?? "Finish report";
  const client = board?.client ?? mock?.client ?? undefined;
  const status = (board?.status ?? mock?.status ?? "ready") as ProjectStatus;
  const brief = (board ? await buildReport(board.id) : null) ?? SAMPLE_BRIEF;

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[0.85rem] text-muted transition-colors hover:text-ink print:hidden"
      >
        <ArrowLeft className="size-3.5" /> All boards
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2">
            <StatusBadge status={status} />
          </div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.02em]">{name}</h1>
          <p className="mt-1 text-[0.92rem] text-muted">
            {client && client !== "—"
              ? `Client · ${client}`
              : "Built from your client's swipes"}
          </p>
        </div>
        <ProjectActions projectId={id} />
      </header>

      <div className="mt-6 space-y-3">
        <ClientLinkBar slug={board?.slug ?? id} />
        {board && <ProjectManageBar slug={board.slug} due={board.due ?? undefined} />}
      </div>

      <div className="mt-8">
        <FinishReport brief={brief} project={name} client={client ?? undefined} />
      </div>
    </>
  );
}
