"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Plus, X, Upload, Link2 } from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { createProject } from "@/lib/actions/projects";
import { PRECEDENTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Project", "Categories", "Options", "Share"];
const THUMBS = PRECEDENTS.filter((p) => p.kind === "photo")
  .slice(0, 6)
  .map((p) => p.src as string);
const inputCls =
  "h-11 w-full rounded-full border border-line bg-bg px-4 text-[0.92rem] outline-none transition-colors placeholder:text-faint focus:border-ink/40";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[0.66rem] uppercase tracking-[0.12em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function NewBoardPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [cats, setCats] = useState<string[]>([
    "Exterior Colour",
    "Countertops",
    "Lighting",
    "Tile & Stone",
    "Fixtures",
  ]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function finish() {
    setSaving(true);
    const res = await createProject({
      name: name || "New project",
      client,
      categories: cats.map((c) => ({
        name: c,
        kind: /colou?r/i.test(c) ? "swatch" : "photo",
      })),
    });
    setSaving(false);
    // Wired to Supabase when configured; otherwise falls back to the demo board.
    router.push(res.ok ? `/dashboard/project/${res.slug}` : "/dashboard");
  }

  const slug =
    (name || "new-board")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "new-board";
  const link =
    typeof window !== "undefined"
      ? `${window.location.origin}/c/${slug}`
      : `/c/${slug}`;

  const canNext =
    step === 0 ? name.trim().length > 0 : step === 1 ? cats.length > 0 : true;

  function addCat() {
    const v = draft.trim();
    if (v && !cats.includes(v)) setCats((c) => [...c, v]);
    setDraft("");
  }
  function copy() {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> All boards
      </Link>
      <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.02em]">New board</h1>
      <p className="mt-1 text-[0.92rem] text-muted">
        Set it up, then send the link to your client.
      </p>

      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {STEP_LABELS.map((l, idx) => (
          <li key={l} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full font-mono text-[0.7rem]",
                idx < step
                  ? "bg-ink text-white"
                  : idx === step
                    ? "bg-accent text-[var(--color-on-accent)]"
                    : "border border-line text-faint",
              )}
            >
              {idx < step ? <Check className="size-3.5" /> : idx + 1}
            </span>
            <span
              className={cn(
                "text-[0.85rem]",
                idx === step ? "font-medium text-ink" : "text-muted",
              )}
            >
              {l}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-card border border-line bg-surface p-6 sm:p-8">
        {step === 0 && (
          <div className="max-w-[440px] space-y-5">
            <Field label="Project name">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Harbourfront Residence"
                className={inputCls}
              />
            </Field>
            <Field label="Client (optional)">
              <input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="K. Merrin"
                className={inputCls}
              />
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="max-w-[520px]">
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-3 py-1.5 text-[0.85rem]"
                >
                  {c}
                  <button
                    onClick={() => setCats((x) => x.filter((y) => y !== c))}
                    aria-label={`Remove ${c}`}
                    className="text-faint transition-colors hover:text-accent"
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCat();
                  }
                }}
                placeholder="Add a category…"
                className={inputCls}
              />
              <Button onClick={addCat} variant="ghost">
                <Plus className="size-4" /> Add
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-center rounded-card border border-dashed border-line py-10 text-center">
              <div>
                <Upload className="mx-auto size-6 text-muted" strokeWidth={1.8} />
                <p className="mt-2 text-[0.9rem] text-muted">
                  Drag precedents here, or <span className="text-accent">browse</span>
                </p>
                <p className="mt-1 font-mono text-[0.64rem] uppercase tracking-[0.1em] text-faint">
                  JPG / PNG · up to 40 per category
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {THUMBS.map((t, i) => (
                <div
                  key={i}
                  className="aspect-square overflow-hidden rounded-lg border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-[520px]">
            <Tag dot>CLIENT LINK</Tag>
            <p className="mt-3 text-[0.95rem] text-muted">
              Send this to your client. No login required on their end.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-bg p-1.5 pl-4">
              <span className="flex-1 truncate font-mono text-[0.82rem]">{link}</span>
              <Button
                onClick={copy}
                variant={copied ? "accent" : "primary"}
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="size-4" /> Copied
                  </>
                ) : (
                  <>
                    <Link2 className="size-4" /> Copy
                  </>
                )}
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href={`/c/${slug}`} variant="ghost">
                Preview client view
              </Button>
              <Button
                onClick={finish}
                variant="accent"
                className={saving ? "pointer-events-none opacity-60" : ""}
              >
                {saving ? "Creating…" : "Done — go to board"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {step < 3 && (
        <div className="mt-6 flex items-center justify-between">
          <Button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            variant="ghost"
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>
          <Button
            onClick={() => setStep((s) => s + 1)}
            variant="primary"
            className={canNext ? "" : "pointer-events-none opacity-40"}
          >
            Continue <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </>
  );
}
