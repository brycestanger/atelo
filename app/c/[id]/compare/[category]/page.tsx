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

  let categoryName: string;
  let contenders: Precedent[];
  let categoryId = category;

  if (board) {
    const cat =
      board.categories.find((c) => c.id === category) ?? board.categories[0];
    categoryName = cat?.name ?? "Finishes";
    contenders = (cat?.options ?? []).slice(0, 4);
    categoryId = cat?.id ?? category;
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
        nextHref={`/c/${id}/complete`}
        sessionId={sessionId}
        projectId={projectId}
        categoryId={categoryId}
      />
    </div>
  );
}
