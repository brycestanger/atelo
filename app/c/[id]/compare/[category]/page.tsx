import { CompareArena } from "@/components/app/compare";
import { CATEGORIES, precedentsByCategory } from "@/lib/mock-data";

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const { id, category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0];
  const contenders = precedentsByCategory(cat.id).slice(0, 4);

  return (
    <div className="px-5">
      <CompareArena
        categoryName={cat.name}
        contenders={contenders}
        nextHref={`/c/${id}/complete`}
      />
    </div>
  );
}
