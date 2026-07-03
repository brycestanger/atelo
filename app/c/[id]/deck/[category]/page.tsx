import { SwipeDeck } from "@/components/app/swipe";
import { CATEGORIES, precedentsByCategory } from "@/lib/mock-data";
import { getBoard, startSession } from "@/lib/actions/projects";
import type { Precedent } from "@/lib/types";

export default async function DeckPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; category: string }>;
  searchParams: Promise<{ s?: string; p?: string }>;
}) {
  const { id, category } = await params;
  const { s, p } = await searchParams;
  const board = await getBoard(id);

  let categoryName: string;
  let precedents: Precedent[];
  let nextHref = `/c/${id}/complete`;
  let sessionId = s;

  if (board) {
    const cats = board.categories;
    const idx = Math.max(0, cats.findIndex((c) => c.id === category));
    const cat = cats[idx] ?? cats[0];
    categoryName = cat?.name ?? "Finishes";
    precedents = cat?.options ?? [];
    // one session for the whole board — start it on the first category, then thread it.
    if (!sessionId) {
      const sid = await startSession(board.id);
      sessionId = sid ?? undefined;
    }
    const q = sessionId ? `?s=${sessionId}&p=${board.id}` : "";
    // no showdown — straight to the next category, then the finish line
    const next = cats[idx + 1];
    nextHref = next ? `/c/${id}/deck/${next.id}${q}` : `/c/${id}/complete${q}`;
  } else {
    const cat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
    categoryName = cat.name;
    precedents = precedentsByCategory(cat.id);
  }

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-5 py-8">
      <SwipeDeck
        categoryName={categoryName}
        precedents={precedents}
        nextHref={nextHref}
        sessionId={sessionId}
      />
    </div>
  );
}
