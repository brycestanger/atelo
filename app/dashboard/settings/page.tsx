import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAccount } from "@/lib/actions/projects";
import { signOut } from "@/lib/actions/auth";
import { StudioNameForm } from "@/components/app/account-ui";
import { Button } from "@/components/ui";

export const metadata = { title: "Settings" };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line py-4 last:border-0">
      <span className="text-[0.85rem] text-muted">{label}</span>
      <div className="text-[0.92rem] font-medium">{children}</div>
    </div>
  );
}

export default async function SettingsPage() {
  const account = await getAccount();
  const pro = account?.plan === "pro";
  const remaining = account?.remaining;

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[0.85rem] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> All boards
      </Link>
      <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.02em]">Settings</h1>
      <p className="mt-1 text-[0.95rem] text-muted">
        Your studio profile and account.
      </p>

      <div className="mt-8 max-w-[640px] space-y-8">
        {/* Studio */}
        <section className="rounded-card border border-line bg-surface p-6 shadow-soft">
          <h2 className="text-[1.05rem] font-semibold">Studio</h2>
          <p className="mt-1 text-[0.85rem] text-muted">
            Shown on client reports and the dashboard.
          </p>
          <div className="mt-5">
            <StudioNameForm initial={account?.studioName ?? ""} />
          </div>
        </section>

        {/* Account */}
        <section className="rounded-card border border-line bg-surface p-6 shadow-soft">
          <h2 className="text-[1.05rem] font-semibold">Account</h2>
          <div className="mt-3">
            <Row label="Email">{account?.email ?? "—"}</Row>
            <Row label="Plan">{pro ? "Pro · Unlimited boards" : "Free"}</Row>
            {!pro && (
              <Row label="Board slots left">
                {remaining ?? 0} of {account?.credits ?? 1}
              </Row>
            )}
          </div>
          <div className="mt-5">
            <Button href="/dashboard/credits" variant="ghost">
              Manage credits &amp; plan <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>

        {/* Sign out */}
        <section className="rounded-card border border-line bg-surface p-6 shadow-soft">
          <h2 className="text-[1.05rem] font-semibold">Session</h2>
          <p className="mt-1 text-[0.85rem] text-muted">
            Sign out of your Atelo dashboard on this device.
          </p>
          <form action={signOut} className="mt-4">
            <button
              type="submit"
              className="rounded-full border border-line bg-surface px-5 py-2.5 text-[0.88rem] font-medium text-muted transition-colors hover:border-ink/30 hover:text-ink"
            >
              Sign out
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
