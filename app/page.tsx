import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { SwipeDeckMock, BriefPreview } from "@/components/product-mock";
import { Button, Dot, Reveal, Tag } from "@/components/ui";
import { img } from "@/lib/mock-data";

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main className="overflow-clip">
        <Hero />
        <ProofBand />
        <Features />
        <HowItWorks />
        <Synthesis />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */
function Hero() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <Reveal>
            <Tag dot className="mb-6">
              SIGNAL OVER NOISE
            </Tag>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-[clamp(2.5rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
              Turn client swipes into a build-ready brief
              <span className="text-accent">.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[46ch] text-[1.05rem] leading-relaxed text-muted">
              Atelo retires the endless Pinterest board. Your client pins what
              they love, compares favourites head-to-head, and Atelo synthesizes
              a structured brief — materials, palette, and style — weighted by
              what they actually chose.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href="/dashboard" size="lg" variant="primary">
                Start building
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Button>
              <Button href="/c/harbourfront-residence" size="lg" variant="ghost">
                See a client demo
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-faint">
              Free first board · No card required · Made for studios
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="flex justify-center lg:justify-end">
          <SwipeDeckMock />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Proof band */
const PROOF = [
  "Free first board",
  "5-minute client flow",
  "Structured JSON, not vibes",
  "≈ $0.05 per brief",
  "Branded PDF export",
];

function ProofBand() {
  return (
    <section className="border-y border-line bg-surface/60">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 sm:px-8">
        {PROOF.map((p, i) => (
          <span key={p} className="flex items-center gap-8">
            {i > 0 && <Dot className="size-[0.3rem] bg-line" />}
            <span className="font-mono text-[0.74rem] uppercase tracking-[0.12em] text-muted">
              {p}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Features */
function Features() {
  return (
    <section id="product" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <Reveal className="max-w-[42ch]">
        <Tag dot className="mb-5">
          THE WORKFLOW
        </Tag>
        <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          One tool for the fuzzy front-end of every project.
        </h2>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
          From the first mood-check to the presentation-ready brief — Atelo holds
          the whole discovery phase, so nothing gets lost in a group chat.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
        {/* Big cell — swipe deck imagery */}
        <Reveal className="md:col-span-4 md:row-span-2">
          <article className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-card border border-line bg-ink-bg p-7 text-ink-text">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img("photo-1715760374522-a609a0c2f65e", 1200)}
              alt="Stacked cross-laminated timber volumes at dusk"
              className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <div className="relative">
              <Tag dark className="text-ink-muted">
                <Dot /> PHASE 01 — EXPLORE
              </Tag>
              <h3 className="mt-3 max-w-[18ch] text-[1.6rem] font-semibold leading-tight tracking-[-0.02em]">
                A swipe deck your client can finish on the bus home.
              </h3>
              <p className="mt-2 max-w-[44ch] text-[0.95rem] leading-relaxed text-white/70">
                Curated precedents, full-screen. Right to like, left to pass, and
                a tap to pin the ones that truly land.
              </p>
            </div>
          </article>
        </Reveal>

        <FeatureCell
          label="PHASE 02 — RESOLVE"
          title="The compare showdown"
          body="Pinned favourites are pitted head-to-head until one winner survives per category."
        >
          <BracketMotif />
        </FeatureCell>

        <FeatureCell
          label="WEIGHTING"
          title="Winners count more"
          body="Absolute favourites are weighted heavily; likes give the AI broad context."
        >
          <div className="flex items-end gap-1.5">
            {[30, 52, 74, 100, 62].map((h, i) => (
              <span
                key={i}
                className={`w-5 rounded-t-sm ${i === 3 ? "bg-accent" : "bg-ink/15"}`}
                style={{ height: `${h * 0.5}px` }}
              />
            ))}
          </div>
        </FeatureCell>

        <FeatureCell
          className="md:col-span-3"
          label="PHASE 04 — DELIVER"
          title="Bento results & branded PDF"
          body="A dashboard of materials, palette, and the client's ultimate winners — exportable, on your firm's letterhead."
        >
          <div className="flex flex-wrap gap-1.5">
            {["#B8895A", "#EDE8DF", "#211D1A", "#FF4F00", "#6B6F73"].map((c) => (
              <span
                key={c}
                className="size-6 rounded-full border border-line"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </FeatureCell>

        <FeatureCell
          className="md:col-span-3"
          label="YOUR STUDIO"
          title="Your brand, not ours"
          body="Custom firm branding on Pro. On free boards, a tasteful watermark does your marketing for you."
        >
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">
            Powered by Atelo →
          </span>
        </FeatureCell>
      </div>
    </section>
  );
}

function FeatureCell({
  label,
  title,
  body,
  children,
  className = "",
}: {
  label: string;
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`md:col-span-2 ${className}`}>
      <article className="flex h-full min-h-[220px] flex-col justify-between rounded-card border border-line bg-surface p-6">
        <div>
          <Tag dot>{label}</Tag>
          <h3 className="mt-3 text-[1.22rem] font-semibold leading-snug tracking-[-0.01em]">
            {title}
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{body}</p>
        </div>
        <div className="mt-6">{children}</div>
      </article>
    </Reveal>
  );
}

function BracketMotif() {
  return (
    <div className="flex items-center gap-2 font-mono text-[0.7rem] text-muted">
      <div className="flex flex-col gap-1">
        <span className="rounded border border-line px-2 py-0.5">A2</span>
        <span className="rounded border border-line px-2 py-0.5">A5</span>
      </div>
      <div className="h-8 w-4 rounded-r border-y border-r border-line" />
      <span className="rounded-full border border-accent px-2 py-0.5 text-accent">
        A2
      </span>
    </div>
  );
}

/* ------------------------------------------------------------ How it works */
const STEPS = [
  {
    n: "01",
    title: "Load precedents",
    body: "Drop curated images into categories — Exterior Massing, Interior Finishes, whatever the project needs. Generate a client link.",
  },
  {
    n: "02",
    title: "Client swipes",
    body: "They open the link on their phone. No login. They like, pass, and pin — the whole deck takes about five minutes.",
  },
  {
    n: "03",
    title: "Favourites face off",
    body: "Pinned images enter a tournament. A/B, tap the winner, repeat — until one precedent stands per category.",
  },
  {
    n: "04",
    title: "Atelo synthesizes",
    body: "Winners (weighted) and likes (context) go to the AI. You get a structured brief in seconds — ready to present.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 border-y border-line bg-surface/50">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
        <Reveal className="max-w-[46ch]">
          <Tag dot className="mb-5">
            THE FUNNEL
          </Tag>
          <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Broad exploration, narrowed to one decision.
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <li className="flex h-full flex-col bg-bg p-7">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[1.6rem] font-medium tracking-tight text-accent tnum">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 translate-y-[-4px] bg-line" />
                </div>
                <h3 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">
                  {s.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Synthesis */
const BRIEF_JSON: { k: string; v: string; t: "str" | "num" | "arr" }[] = [
  { k: "style", v: '"Warm Tectonic Minimalism"', t: "str" },
  { k: "confidence", v: "0.92", t: "num" },
  { k: "typology", v: '"Single-family · West Coast"', t: "str" },
  { k: "materials", v: "[ clt 38 · concrete 22 · travertine 14 … ]", t: "arr" },
  { k: "palette", v: "[ #B8895A · #EDE8DF · #211D1A · #FF4F00 ]", t: "arr" },
  { k: "themes", v: "[ exposed structure · warm minimalism … ]", t: "arr" },
];

function Synthesis() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <Tag dot className="mb-5">
            PHASE 03 — SYNTHESIZE
          </Tag>
          <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Structured output, not a vibe.
          </h2>
          <p className="mt-5 max-w-[48ch] text-[1.02rem] leading-relaxed text-muted">
            Atelo asks Gemini for a strict JSON schema — so every brief comes back
            in the same shape: named materials with estimated percentages, a
            resolved palette, dominant themes, and a confidence score. Present it,
            export it, or drop it straight into your spec.
          </p>
          <div className="mt-8">
            <Button href="/dashboard/project/harbourfront-residence" variant="ghost">
              View a full brief
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="grid gap-4">
            <div className="overflow-hidden rounded-card border border-ink-line bg-ink-bg p-6 font-mono text-[0.82rem] leading-relaxed text-ink-muted">
              <div className="mb-3 flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-white/20" />
                <span className="size-2.5 rounded-full bg-accent" />
                <span className="ml-2 text-[0.7rem] uppercase tracking-[0.14em] text-ink-muted">
                  brief.json
                </span>
              </div>
              <div className="text-ink-muted">{"{"}</div>
              {BRIEF_JSON.map((row) => (
                <div key={row.k} className="pl-4">
                  <span className="text-accent">&quot;{row.k}&quot;</span>
                  <span className="text-ink-muted">: </span>
                  <span
                    className={
                      row.t === "num"
                        ? "text-ink-text"
                        : row.t === "arr"
                          ? "text-ink-muted"
                          : "text-ink-text"
                    }
                  >
                    {row.v}
                  </span>
                  <span className="text-ink-muted">,</span>
                </div>
              ))}
              <div className="text-ink-muted">{"}"}</div>
            </div>
            <BriefPreview className="max-w-none" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- Pricing */
const TIERS = [
  {
    name: "Free",
    price: "$0",
    unit: "one board",
    note: "For your first client, or a test drive.",
    features: [
      "1 active board",
      "Full swipe + compare flow",
      "AI-synthesized brief",
      "“Powered by Atelo” watermark",
    ],
    cta: "Start free",
    href: "/dashboard",
    featured: false,
  },
  {
    name: "Board Credits",
    price: "$9",
    unit: "per board",
    note: "Buy a few, expense them to the client. They never expire.",
    features: [
      "Everything in Free",
      "No watermark",
      "Branded PDF export",
      "Credits never expire",
      "Volume pricing from $9–12",
    ],
    cta: "Buy credits",
    href: "/dashboard",
    featured: true,
  },
  {
    name: "Pro",
    price: "$39",
    unit: "per month",
    note: "For studios running discovery every week.",
    features: [
      "Unlimited boards",
      "Custom firm branding",
      "Team seats",
      "Priority support",
    ],
    cta: "Go Pro",
    href: "/dashboard",
    featured: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <Reveal className="max-w-[46ch]">
        <Tag dot className="mb-5">
          PRICING
        </Tag>
        <h2 className="text-[clamp(2rem,4vw,3.1rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Pay per project. Never per seat you don&apos;t use.
        </h2>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
          Boutique studios hate subscription fatigue. So the core of Atelo is a
          credit you buy once and expense to the invoice.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <article
              className={`flex h-full flex-col rounded-card border p-7 ${
                t.featured
                  ? "border-accent bg-surface"
                  : "border-line bg-surface/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-muted">
                  {t.name}
                </span>
                {t.featured && (
                  <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-[var(--color-on-accent)]">
                    Most popular
                  </span>
                )}
              </div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.03em]">
                  {t.price}
                </span>
                <span className="text-[0.9rem] text-muted">{t.unit}</span>
              </div>
              <p className="mt-3 min-h-[42px] text-[0.9rem] leading-relaxed text-muted">
                {t.note}
              </p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[0.9rem]">
                    <Dot className="mt-[0.5em] size-[0.35rem] shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-2">
                <Button
                  href={t.href}
                  variant={t.featured ? "accent" : "ghost"}
                  className="w-full"
                >
                  {t.cta}
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
