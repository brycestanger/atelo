import Link from "next/link";
import { Wordmark } from "@/components/ui";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-ink-bg text-ink-text">
      <header className="flex items-center justify-between border-b border-ink-line px-5 py-4">
        <Link href="/" aria-label="Atelo">
          <Wordmark dark />
        </Link>
        <span className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-muted">
          Powered by Atelo
        </span>
      </header>
      {children}
    </div>
  );
}
