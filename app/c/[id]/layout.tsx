import Link from "next/link";
import { Wordmark } from "@/components/ui";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg text-ink">
      <header className="flex items-center justify-between border-b border-line bg-surface/70 px-5 py-4 backdrop-blur-sm">
        <Link href="/" aria-label="Atelo">
          <Wordmark />
        </Link>
        <span className="text-[0.78rem] text-muted">Powered by Atelo</span>
      </header>
      {children}
    </div>
  );
}
