import { ClientSummary } from "@/components/app/client-summary";

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; p?: string }>;
}) {
  const { s, p } = await searchParams;
  return <ClientSummary s={s} p={p} />;
}
