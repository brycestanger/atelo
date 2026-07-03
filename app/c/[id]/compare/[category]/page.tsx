import { CompareArena } from "@/components/app/compare";
import { CATEGORIES, precedentsByCategory } from "@/lib/mock-data";
import { getBoard } from "@/lib/actions/projects";
import type { Precedent } from "@/lib/types";

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; category: string }>;
  searchParams: Promise<{ s?: string; p?: string }>;
}) {
  const { id, category } = await params;
  const { s: sessionId, p: projectId } = await searchParams;
  const board = await getBoard(id);
  const q = sessionId && projectId ? `?s=${sessionId}&p=${projectId}` : "";

  let categoryName: string;
  let contenders: Precedent[];
  let categoryId = category;
  let nextHref = `/c/${id}/complete`;
  let finalStep = true;

  if (board) {
    const idx = board.categories.findIndex((c) => c.id === category);
    const cat = board.categories[idx] ?? board.categories[0];
    categoryName = cat?.name ?? "Finishes";
    contenders = (cat?.options ?? []).slice(0, 4);
    categoryId = cat?.id ?? category;
    const next = board.categories[idx + 1];
    if (next) {
      nextHref = `/c/${id}/deck/${next.id}${q}`;
      finalStep = false;
    } else {
      nextHref = `/c/${id}/complete${q}`;
    }
  } else {
    const cat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
    categoryName = cat.name;
    contenders = precedentsByCategory(cat.id).slice(0, 4);
  }

  return (
    <div className="px-5">
      <CompareArena
        categoryName={categoryName}
        contenders={contenders}
        nextHref={nextHref}
        sessionId={sessionId}
        projectId={projectId}
        categoryId={categoryId}
        finalStep={finalStep}
      />
    </div>
  );
}
