import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { getAccount } from "@/lib/actions/projects";
import { BuyCredits, PlanControls } from "@/components/app/account-ui";

export const metadata = { title: "Credits & plan" };

const PRO_PERKS = [
  "Unlimited boards",
  "Custom studio branding",
  "No Atelo footer on client links",
  "Priority support",
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-soft">
      <div className="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted">
        {label}
      </div>
      <div className="mt-1 text-[1.7rem] font-semibold tracking-[-0.02em]">{value}</div>
    </div>
  );
}

export default async function CreditsPage() {
  const account = await getAccount();
  const plan = account?.plan ?? "free";
  const pro = plan === "pro";
  const credits = account?.credits ?? 1;
  const boardCount = account?.boardCount ?? 0;
  const remaining = account?.remaining ?? Math.max(0, credits - boardCount);

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[0.85rem] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> All boards
      </Link>
      <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.02em]">Credits &amp; plan</h1>
      <p className="mt-1 max-w-[56ch] text-[0.95rem] text-muted">
        Boards are pay-as-you-go. Buy credits and expense them straight to the
        client, or go Pro for unlimited boards.
      </p>

      {/* current status */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Plan" value={pro ? "Pro" : "Free"} />
        <Stat label="Boards in use" value={`${boardCount}`} />
        <Stat label={pro ? "Board slots" : "Slots left"} value={pro ? "∞" : `${remaining}`} />
      </div>

      {/* buy credits */}
      {!pro && (
        <section className="mt-12">
          <h2 className="text-[1.3rem] font-semibold tracking-[-0.01em]">Buy board credits</h2>
          <p className="mt-1 text-[0.92rem] text-muted">
            Each credit unlocks one more active board. They never expire.
          </p>
          <div className="mt-5">
            <BuyCredits />
          </div>
        </section>
      )}

      {/* plan */}
      <section className="mt-12">
        <h2 className="text-[1.3rem] font-semibold tracking-[-0.01em]">
          {pro ? "You're on Pro" : "Go unlimited with Pro"}
        </h2>
        <div className="mt-4 overflow-hidden rounded-card border border-line bg-surface shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-6">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[2.2rem] font-semibold tracking-[-0.03em]">$39</span>
                <span className="text-[0.9rem] text-muted">per month</span>
              </div>
              <p className="mt-1 text-[0.9rem] text-muted">
                For studios running selections every week.
              </p>
            </div>
            <PlanControls plan={plan} />
          </div>
          <ul className="grid gap-x-8 gap-y-3 p-6 sm:grid-cols-2">
            {PRO_PERKS.map((perk) => (
              <li key={perk} className="flex items-center gap-2.5 text-[0.92rem]">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {perk}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <p className="mt-8 text-[0.8rem] text-faint">
        Demo billing — no card is charged. Credits and plan changes apply to your
        account immediately.
      </p>
    </>
  );
}
