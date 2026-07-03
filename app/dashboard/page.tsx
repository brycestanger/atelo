import { ProjectsBoard } from "@/components/app/dashboard-ui";
import { Button } from "@/components/ui";
import { PROJECTS } from "@/lib/mock-data";
import { listMyBoards } from "@/lib/actions/projects";

export const metadata = { title: "Boards" };

export default async function DashboardPage() {
  const real = await listMyBoards(); // null in demo / not signed in
  const projects = real ?? PROJECTS;
  const ready = projects.filter((p) => p.status === "ready").length;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[2rem] font-semibold tracking-[-0.02em]">Boards</h1>
          <p className="mt-1 text-[0.92rem] text-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
            {ready} ready to present
          </p>
        </div>
        <Button href="/dashboard/new" variant="primary">
          New board
        </Button>
      </header>
      <div className="mt-8">
        <ProjectsBoard projects={projects} />
      </div>
    </>
  );
}
