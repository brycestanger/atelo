import { SwipeDeck } from "@/components/app/swipe";
import { CATEGORIES, precedentsByCategory } from "@/lib/mock-data";

export default async function DeckPage({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const { id, category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
  const precedents = precedentsByCategory(cat.id);

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center px-5 py-8">
      <SwipeDeck
        categoryName={cat.name}
        precedents={precedents}
        nextHref={`/c/${id}/compare/${cat.id}`}
      />
    </div>
  );
}
