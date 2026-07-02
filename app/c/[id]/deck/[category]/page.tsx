import { SwipeDeck } from "@/components/app/swipe";
import { CATEGORIES, precedentsByCategory } from "@/lib/mock-data";
import { getBoard, startSession } from "@/lib/actions/projects";
import type { Precedent } from "@/lib/types";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const { id, category } = await params;
  const board = await getBoard(id);

  let categoryName: string;
  let precedents: Precedent[];
  let nextHref = `/c/${id}/compare/${category}`;
  let sessionId: string | undefined;

  if (board) {
    const cat =
      board.categories.find((c) => c.id === category) ?? board.categories[0];
    categoryName = cat?.name ?? "Finishes";
    precedents = cat?.options ?? [];
    const sid = await startSession(board.id);
    if (sid && cat) {
      sessionId = sid;
      nextHref = `/c/${id}/compare/${cat.id}?s=${sid}&p=${board.id}`;
    }
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
