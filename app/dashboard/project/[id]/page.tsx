import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FinishReport, ProjectActions } from "@/components/app/results";
import { StatusBadge } from "@/components/app/dashboard-ui";
import { PROJECTS, SAMPLE_BRIEF } from "@/lib/mock-data";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  const name = project?.name ?? "Finish report";

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
          {project && (
            <div className="mb-2">
              <StatusBadge status={project.status} />
            </div>
          )}
          <h1 className="text-[2rem] font-semibold tracking-[-0.02em]">{name}</h1>
          <p className="mt-1 text-[0.92rem] text-muted">
            {project?.client && project.client !== "—"
              ? `Client · ${project.client}`
              : "Built from your client's swipes and showdown"}
          </p>
        </div>
        <ProjectActions projectId={id} />
      </header>

      <div className="mt-8">
        <FinishReport
          brief={SAMPLE_BRIEF}
          project={name}
          client={project?.client}
        />
      </div>
    </>
  );
}
