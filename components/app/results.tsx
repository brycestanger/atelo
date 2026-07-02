"use client";

import { useState } from "react";
import { Download, Link2, Check } from "lucide-react";
import type { Brief } from "@/lib/types";
import { Button, Tag } from "@/components/ui";

export function ProjectActions({ projectId }: { projectId: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const url = `${window.location.origin}/c/${projectId}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <div className="flex items-center gap-2 print:hidden">
      <Button variant="ghost" onClick={copy}>
        {copied ? (
          <>
            <Check className="size-4" /> Copied
          </>
        ) : (
          <>
            <Link2 className="size-4" /> Copy client link
          </>
        )}
      </Button>
      <Button variant="accent" onClick={() => window.print()}>
        <Download className="size-4" /> Export PDF
      </Button>
    </div>
  );
}

export function BentoResults({ brief }: { brief: Brief }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-6">
      {/* Dominant style — the headline finding */}
      <article className="flex flex-col rounded-card border border-line bg-surface p-7 md:col-span-4 md:row-span-2">
        <div className="flex items-center justify-between">
          <Tag dot>DOMINANT STYLE</Tag>
          <span className="font-mono text-[0.72rem] tracking-[0.06em] text-accent tnum">
            {Math.round(brief.confidence * 100)}% confidence
          </span>
        </div>
        <h2 className="mt-4 text-[clamp(1.8rem,3.5vw,2.7rem)] font-semibold leading-[1.03] tracking-[-0.03em]">
          {brief.style}
        </h2>
        <p className="mt-4 max-w-[56ch] text-[1rem] leading-relaxed text-muted">
          {brief.summary}
        </p>
        <div className="mt-auto flex flex-wrap gap-2 pt-7">
          {brief.themes.map((t) => (
            <span
              key={t}
              className="rounded-full border border-line px-3 py-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </article>

      {/* Material mix */}
      <article className="rounded-card border border-line bg-surface p-6 md:col-span-2 md:row-span-2">
        <Tag dot>MATERIAL MIX</Tag>
        <div className="mt-5 space-y-3.5">
          {brief.materials.map((m, i) => (
            <div key={m.name}>
              <div className="flex items-center justify-between text-[0.82rem]">
                <span>{m.name}</span>
                <span className="font-mono text-muted tnum">{m.pct}%</span>
              </div>
              <div className="mt-1.5 h-[6px] overflow-hidden rounded-full bg-ink/[0.07]">
                <span
                  className="block h-full rounded-full"
                  style={{
                    width: `${m.pct}%`,
                    background:
                      i === 0 ? "var(--color-accent)" : "var(--color-ink)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Palette */}
      <article className="rounded-card border border-line bg-surface p-6 md:col-span-2">
        <Tag dot>PALETTE</Tag>
        <div className="mt-4 space-y-2.5">
          {brief.palette.map((c) => (
            <div key={c.name} className="flex items-center gap-3">
              <span
                className="size-7 shrink-0 rounded-md border border-line"
                style={{ background: c.hex }}
              />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[0.85rem]">{c.name}</span>
                <span className="font-mono text-[0.68rem] uppercase text-muted">
                  {c.hex}
                </span>
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Ultimate winners */}
      <article className="rounded-card border border-line bg-surface p-6 md:col-span-4">
        <div className="flex items-center justify-between">
          <Tag dot>ULTIMATE WINNERS</Tag>
          <span className="font-mono text-[0.66rem] uppercase tracking-[0.1em] text-muted">
            1 per category
          </span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {brief.winners.map((w) => (
            <figure
              key={w.id}
              className="overflow-hidden rounded-lg border border-line bg-bg"
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.src}
                  alt={w.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="p-3">
                <div className="text-[0.82rem] font-medium leading-tight">
                  {w.title}
                </div>
                <div className="mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.1em] text-muted">
                  {w.meta}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </article>
    </div>
  );
}
