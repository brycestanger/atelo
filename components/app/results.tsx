"use client";

import { useState } from "react";
import { Download, Link2, Check } from "lucide-react";
import type { Brief } from "@/lib/types";
import { Button } from "@/components/ui";

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

/** The client-ready finish report — one document you can send as-is. */
export function FinishReport({
  brief,
  project,
  client,
}: {
  brief: Brief;
  project: string;
  client?: string;
}) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface shadow-soft">
      {/* letterhead */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-7 py-5">
        <div>
          <div className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            Finish Report
          </div>
          <div className="mt-0.5 text-[1.05rem] font-semibold">
            {project}
            {client && client !== "—" ? (
              <span className="font-normal text-muted"> · for {client}</span>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1.5 text-[0.85rem] font-medium">
            <span className="size-2 rounded-full bg-accent" /> Atelo
          </div>
          <div className="mt-0.5 text-[0.72rem] text-muted">Prepared June 2026</div>
        </div>
      </div>

      {/* direction + palette */}
      <div className="grid gap-8 border-b border-line p-7 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
              Direction
            </span>
            <span className="text-[0.72rem] font-medium text-accent tnum">
              {Math.round(brief.confidence * 100)}% aligned
            </span>
          </div>
          <h2 className="mt-2 text-[clamp(1.9rem,3.5vw,2.7rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            {brief.style}
          </h2>
          <p className="mt-4 max-w-[52ch] text-[1rem] leading-relaxed text-muted">
            {brief.summary}
          </p>
          <ul className="mt-6 space-y-2">
            {brief.notes.map((n) => (
              <li key={n} className="flex items-start gap-2.5 text-[0.9rem]">
                <span className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-accent" />
                {n}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            Palette
          </div>
          <div className="mt-3 space-y-2">
            {brief.palette.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-3 rounded-xl border border-line bg-surface-2 p-2.5"
              >
                <span
                  className="size-9 shrink-0 rounded-lg ring-1 ring-line"
                  style={{ background: c.hex }}
                />
                <div className="flex flex-1 items-center justify-between">
                  <span className="text-[0.88rem] font-medium">{c.name}</span>
                  <span className="text-[0.72rem] uppercase text-muted">{c.hex}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* selected finishes */}
      <div className="p-7">
        <div className="flex items-center justify-between">
          <div className="text-[0.68rem] uppercase tracking-[0.16em] text-muted">
            Selected finishes
          </div>
          <div className="text-[0.72rem] text-muted">one winner per category</div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {brief.selections.map((s) => (
            <figure
              key={s.category}
              className="overflow-hidden rounded-xl border border-line bg-surface"
            >
              <div className="aspect-square overflow-hidden">
                {s.kind === "swatch" ? (
                  <div className="h-full w-full" style={{ background: s.color }} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.src} alt={s.title} className="h-full w-full object-cover" />
                )}
              </div>
              <figcaption className="p-3">
                <div className="text-[0.6rem] uppercase tracking-[0.1em] text-muted">
                  {s.category}
                </div>
                <div className="mt-0.5 truncate text-[0.85rem] font-medium">{s.title}</div>
                <div className="mt-0.5 truncate text-[0.72rem] text-muted">{s.note}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
