"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  X,
  Upload,
  Link2,
  Palette,
} from "lucide-react";
import { Button, Tag } from "@/components/ui";
import { cn } from "@/lib/utils";
import { createClient as browserClient } from "@/lib/supabase/client";
import { createBoard, saveOptions, type NewOption } from "@/lib/actions/projects";
import { dominantHexFromFile } from "@/lib/colour";
import type { CategoryKind } from "@/lib/types";

const STEP_LABELS = ["Project", "Categories", "Options", "Share"];
const inputCls =
  "h-11 w-full rounded-full bg-surface px-4 text-[0.92rem] shadow-soft outline-none transition-shadow placeholder:text-faint focus:ring-2 focus:ring-accent/30";

function rid() {
  return Math.random().toString(36).slice(2, 9);
}

type Opt = {
  id: string;
  title: string;
  kind: CategoryKind;
  file?: File;
  url?: string;
  color?: string;
};
type Cat = { key: string; name: string; kind: CategoryKind; options: Opt[] };

const DEFAULT_CATS: Cat[] = [
  { key: rid(), name: "Exterior Colour", kind: "swatch", options: [] },
  { key: rid(), name: "Countertops", kind: "photo", options: [] },
  { key: rid(), name: "Lighting", kind: "photo", options: [] },
  { key: rid(), name: "Tile & Stone", kind: "photo", options: [] },
  { key: rid(), name: "Fixtures", kind: "photo", options: [] },
];

export default function NewBoardPage() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [cats, setCats] = useState<Cat[]>(DEFAULT_CATS);
  const [active, setActive] = useState(0);
  const [draftCat, setDraftCat] = useState("");
  const [newColor, setNewColor] = useState("#8C9184");
  const [newColorName, setNewColorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const canNext = step === 0 ? name.trim().length > 0 : cats.length > 0;

  function patchCat(i: number, patch: Partial<Cat>) {
    setCats((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }
  function addCat() {
    const v = draftCat.trim();
    if (!v) return;
    setCats((cs) => [...cs, { key: rid(), name: v, kind: "photo", options: [] }]);
    setDraftCat("");
  }
  function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    const catIdx = active;
    const opts: Opt[] = Array.from(files).map((f) => ({
      id: rid(),
      title: f.name.replace(/\.[a-z0-9]+$/i, ""),
      kind: "photo" as const,
      file: f,
      url: URL.createObjectURL(f),
    }));
    patchCat(catIdx, { options: [...cats[catIdx].options, ...opts] });
    // Sample a representative colour from each photo so uploaded finishes feed
    // the colour-analysis engine just like swatches — the AI read works on anything.
    opts.forEach((o) => {
      if (!o.file) return;
      void dominantHexFromFile(o.file).then((hex) => {
        if (!hex) return;
        setCats((cs) =>
          cs.map((c, idx) =>
            idx === catIdx
              ? {
                  ...c,
                  options: c.options.map((op) =>
                    op.id === o.id ? { ...op, color: hex } : op,
                  ),
                }
              : c,
          ),
        );
      });
    });
  }
  function addSwatch() {
    const opt: Opt = {
      id: rid(),
      title: newColorName.trim() || newColor.toUpperCase(),
      kind: "swatch",
      color: newColor,
    };
    patchCat(active, { options: [...cats[active].options, opt] });
    setNewColorName("");
  }
  function removeOpt(catIdx: number, optId: string) {
    patchCat(catIdx, { options: cats[catIdx].options.filter((o) => o.id !== optId) });
  }

  async function finish() {
    setSaving(true);
    const res = await createBoard({
      name: name || "New project",
      client,
      categories: cats.map((c) => ({ name: c.name, kind: c.kind })),
    });

    // Demo mode / not signed in — skip persistence, still show a link.
    if (!res.ok) {
      setSaving(false);
      const slug = (name || "new-board").toLowerCase().replace(/[^a-z0-9]+/g, "-");
      setLink(`${window.location.origin}/c/${slug}`);
      setStep(3);
      return;
    }

    const supabase = browserClient();
    const toSave: NewOption[] = [];
    for (let ci = 0; ci < cats.length; ci++) {
      const created = res.categories[ci];
      if (!created) continue;
      for (const o of cats[ci].options) {
        if (o.kind === "swatch") {
          toSave.push({ categoryId: created.id, title: o.title, kind: "swatch", color: o.color });
        } else if (o.file && supabase) {
          const safe = o.file.name.replace(/[^a-zA-Z0-9.]/g, "_");
          const path = `${res.projectId}/${rid()}-${safe}`;
          const up = await supabase.storage.from("options").upload(path, o.file);
          if (!up.error) {
            toSave.push({
              categoryId: created.id,
              title: o.title,
              kind: "photo",
              imagePath: path,
              color: o.color, // sampled dominant colour → feeds the finish report's analysis
            });
          }
        }
      }
    }
    if (toSave.length) await saveOptions(toSave);

    setSaving(false);
    setLink(`${window.location.origin}/c/${res.slug}`);
    setStep(3);
  }

  function copy() {
    if (!link) return;
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }

  const cat = cats[active];

  return (
    <>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-[0.85rem] text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="size-3.5" /> All boards
      </Link>
      <h1 className="mt-4 text-[2rem] font-semibold tracking-[-0.02em]">New board</h1>
      <p className="mt-1 text-[0.92rem] text-muted">
        Add your products, sort them into categories, then send the link.
      </p>

      <ol className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {STEP_LABELS.map((l, idx) => (
          <li key={l} className="flex items-center gap-2">
            <span
              className={cn(
                "grid size-6 place-items-center rounded-full text-[0.7rem]",
                idx < step
                  ? "bg-ink text-white"
                  : idx === step
                    ? "bg-accent text-white"
                    : "bg-surface text-faint shadow-soft",
              )}
            >
              {idx < step ? <Check className="size-3.5" /> : idx + 1}
            </span>
            <span className={cn("text-[0.85rem]", idx === step ? "font-medium text-ink" : "text-muted")}>
              {l}
            </span>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-card bg-surface p-6 shadow-soft sm:p-8">
        {/* Step 0 — project */}
        {step === 0 && (
          <div className="max-w-[440px] space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-[0.8rem] font-medium text-muted">Project name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Kerrisdale Kitchen" className={inputCls} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-[0.8rem] font-medium text-muted">Client (optional)</span>
              <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="The Laurents" className={inputCls} />
            </label>
          </div>
        )}

        {/* Step 1 — categories */}
        {step === 1 && (
          <div className="max-w-[640px] space-y-3">
            {cats.map((c, i) => (
              <div key={c.key} className="flex items-center gap-3 rounded-xl bg-surface-2/50 p-2.5 pl-4">
                <input
                  value={c.name}
                  onChange={(e) => patchCat(i, { name: e.target.value })}
                  className="flex-1 bg-transparent text-[0.95rem] font-medium outline-none"
                />
                <div className="flex rounded-full bg-surface p-0.5 shadow-soft">
                  {(["photo", "swatch"] as CategoryKind[]).map((kind) => (
                    <button
                      key={kind}
                      onClick={() => patchCat(i, { kind })}
                      className={cn(
                        "rounded-full px-3 py-1 text-[0.75rem] font-medium transition-colors",
                        c.kind === kind ? "bg-ink text-white" : "text-muted",
                      )}
                    >
                      {kind === "photo" ? "Photo" : "Colour"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCats((cs) => cs.filter((_, idx) => idx !== i))}
                  aria-label="Remove category"
                  className="grid size-8 place-items-center rounded-full text-faint transition-colors hover:text-accent"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <input
                value={draftCat}
                onChange={(e) => setDraftCat(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCat();
                  }
                }}
                placeholder="Add a category — Sinks, Flooring, Hardware…"
                className={inputCls}
              />
              <Button onClick={addCat} variant="ghost">
                <Plus className="size-4" /> Add
              </Button>
            </div>
          </div>
        )}

        {/* Step 2 — options */}
        {step === 2 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {cats.map((c, i) => (
                <button
                  key={c.key}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-[0.82rem] transition-colors",
                    active === i ? "bg-ink text-white" : "bg-surface-2/60 text-muted hover:text-ink",
                  )}
                >
                  {c.name}
                  <span className="ml-1.5 text-[0.72rem] opacity-70">{c.options.length}</span>
                </button>
              ))}
            </div>

            <div className="mt-5">
              {cat?.kind === "photo" ? (
                <>
                  <label className="flex cursor-pointer items-center justify-center rounded-card bg-surface-2/40 py-10 text-center transition-colors hover:bg-surface-2/70">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => addPhotos(e.target.files)}
                    />
                    <div>
                      <Upload className="mx-auto size-6 text-muted" strokeWidth={1.8} />
                      <p className="mt-2 text-[0.9rem] text-muted">
                        Drop product photos for <span className="font-medium text-ink">{cat.name}</span>, or{" "}
                        <span className="text-accent">browse</span>
                      </p>
                    </div>
                  </label>
                  {cat.options.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {cat.options.map((o) => (
                        <div key={o.id} className="group relative overflow-hidden rounded-xl bg-surface shadow-soft">
                          <div className="aspect-square overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={o.url} alt={o.title} className="h-full w-full object-cover" />
                          </div>
                          <button
                            onClick={() => removeOpt(active, o.id)}
                            className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="block">
                      <span className="mb-1.5 block text-[0.8rem] font-medium text-muted">Colour</span>
                      <input
                        type="color"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        className="h-11 w-16 cursor-pointer rounded-lg bg-surface shadow-soft"
                      />
                    </label>
                    <label className="block flex-1">
                      <span className="mb-1.5 block text-[0.8rem] font-medium text-muted">Name</span>
                      <input
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSwatch())}
                        placeholder="Sage Stone"
                        className={inputCls}
                      />
                    </label>
                    <Button onClick={addSwatch} variant="ghost">
                      <Palette className="size-4" /> Add
                    </Button>
                  </div>
                  {cat.options.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
                      {cat.options.map((o) => (
                        <div key={o.id} className="group relative overflow-hidden rounded-xl bg-surface shadow-soft">
                          <div className="h-16 w-full" style={{ background: o.color }} />
                          <div className="truncate p-2 text-[0.72rem] font-medium">{o.title}</div>
                          <button
                            onClick={() => removeOpt(active, o.id)}
                            className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 3 — share */}
        {step === 3 && (
          <div className="max-w-[520px]">
            <Tag dot>CLIENT LINK</Tag>
            <p className="mt-3 text-[0.95rem] text-muted">
              Send this to your client. No login required on their end.
            </p>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-surface-2/60 p-1.5 pl-4">
              <span className="flex-1 truncate text-[0.82rem]">{link}</span>
              <Button onClick={copy} variant={copied ? "accent" : "primary"} size="sm">
                {copied ? <><Check className="size-4" /> Copied</> : <><Link2 className="size-4" /> Copy</>}
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {link && (
                <Button href={link.replace(window.location.origin, "")} variant="ghost">
                  Preview client view
                </Button>
              )}
              <Button href="/dashboard" variant="accent">
                Done — go to dashboard
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
          {step < 2 ? (
            <Button
              onClick={() => canNext && setStep((s) => s + 1)}
              variant="primary"
              className={canNext ? "" : "pointer-events-none opacity-40"}
            >
              Continue <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              onClick={finish}
              variant="primary"
              className={saving ? "pointer-events-none opacity-60" : ""}
            >
              {saving ? "Creating…" : "Create board"} <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      )}
    </>
  );
}
