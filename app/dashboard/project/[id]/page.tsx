import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BentoResults, ProjectActions } from "@/components/app/results";
import { StatusBadge } from "@/components/app/dashboard-ui";
import { PROJECTS, SAMPLE_BRIEF } from "@/lib/mock-data";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECTS.find((p) => p.id === id);
  const name = project?.name ?? "Synthesized brief";

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink print:hidden"
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
              : "Synthesized from the client's swipes and showdown"}
          </p>
        </div>
        <ProjectActions projectId={id} />
      </header>

      <div className="mt-8">
        <BentoResults brief={SAMPLE_BRIEF} />
      </div>
    </>
  );
}
