"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui";
import { buyCredits, setPlan, updateStudioName } from "@/lib/actions/projects";
import type { Plan } from "@/lib/types";

const PACKS = [
  { n: 1, price: "$9", note: "One board" },
  { n: 3, price: "$24", note: "Save $3" },
  { n: 10, price: "$70", note: "Best value" },
];

/** Mock credit purchase — raises the studio's board allowance. Wire to a real
 *  payment webhook before launch; here it just adds credits. */
export function BuyCredits() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [bought, setBought] = useState<number | null>(null);

  function buy(n: number) {
    start(async () => {
      await buyCredits(n);
      setBought(n);
      router.refresh();
      setTimeout(() => setBought(null), 1800);
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {PACKS.map((p) => (
        <button
          key={p.n}
          onClick={() => buy(p.n)}
          disabled={pending}
          className="flex flex-col items-start rounded-card border border-line bg-surface p-5 text-left shadow-soft transition-all hover:border-accent/50 hover:shadow-float disabled:opacity-60"
        >
          <div className="font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
            {p.note}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-[-0.02em]">
            +{p.n}{" "}
            <span className="text-[0.9rem] font-normal text-muted">
              board{p.n > 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-1 text-[0.95rem] text-muted">{p.price}</div>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[0.85rem] font-medium text-accent">
            {bought === p.n ? (
              <>
                <Check className="size-4" /> Added
              </>
            ) : (
              "Buy credits"
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/** Switch between Free and Pro (mock — Pro grants unlimited boards). */
export function PlanControls({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function change(next: Plan) {
    start(async () => {
      await setPlan(next);
      router.refresh();
    });
  }

  if (plan === "pro") {
    return (
      <Button
        variant="ghost"
        onClick={() => change("free")}
        className={pending ? "pointer-events-none opacity-60" : ""}
      >
        Switch back to Free
      </Button>
    );
  }
  return (
    <Button
      variant="accent"
      onClick={() => change("pro")}
      className={pending ? "pointer-events-none opacity-60" : ""}
    >
      Upgrade to Pro
    </Button>
  );
}

/** Edit the studio's display name (shown on reports + the dashboard). */
export function StudioNameForm({ initial }: { initial: string }) {
  const router = useRouter();
  const [name, setName] = useState(initial);
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);
  const dirty = name.trim() !== initial.trim();

  function save() {
    if (!dirty) return;
    start(async () => {
      await updateStudioName(name);
      setSaved(true);
      router.refresh();
      setTimeout(() => setSaved(false), 1800);
    });
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="block flex-1">
        <span className="mb-1.5 block text-[0.8rem] font-medium text-muted">Studio name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && save()}
          placeholder="Your studio"
          className="h-11 w-full rounded-full bg-surface px-4 text-[0.92rem] shadow-soft outline-none transition-shadow placeholder:text-faint focus:ring-2 focus:ring-accent/30"
        />
      </label>
      <Button
        variant={saved ? "accent" : "primary"}
        onClick={save}
        className={!dirty || pending ? "pointer-events-none opacity-50" : ""}
      >
        {saved ? (
          <>
            <Check className="size-4" /> Saved
          </>
        ) : (
          "Save"
        )}
      </Button>
    </div>
  );
}
