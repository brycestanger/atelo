import { ArrowRight, Sparkles } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { TestSwipe, ReportPreview } from "@/components/product-mock";
import { HookHero } from "@/components/landing/hooks";
import { Showcase } from "@/components/landing/showcase";
import { Button, Dot } from "@/components/ui";

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main className="overflow-clip">
        <Hero />
        <Trust />
        <Showcase />
        <TryIt />
        <ReportShowcase />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */
function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12%] size-[620px] -translate-x-1/2 rounded-full glow-warm opacity-70 blur-[110px]" />
        <div className="absolute right-[6%] top-[24%] size-[380px] rounded-full glow-cool opacity-50 blur-[90px]" />
        <div className="absolute left-[4%] top-[42%] size-[300px] rounded-full glow-peach opacity-40 blur-[90px]" />
      </div>

      <div className="mx-auto grid max-w-[1200px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div>
          <div className="rise">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface/80 px-3.5 py-1.5 text-[0.85rem] font-medium text-muted shadow-soft backdrop-blur">
              <Dot /> Signal over noise
            </span>
          </div>
          <h1
            className="rise mt-6 text-[clamp(2.5rem,5.5vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.035em]"
            style={{ animationDelay: "0.06s" }}
          >
            Turn client swipes into a finished report
            <span className="text-accent">.</span>
          </h1>
          <p
            className="rise mt-6 max-w-[46ch] text-[1.1rem] leading-relaxed text-muted"
            style={{ animationDelay: "0.12s" }}
          >
            Send one link. Your client swipes through colours, countertops, lighting
            and fixtures on their phone — and Atelo hands you a client-ready report to
            send right back.
          </p>
          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.18s" }}
          >
            <Button href="/dashboard" size="lg" variant="accent">
              Start free
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
            <Button href="/c/kerrisdale-kitchen" size="lg" variant="ghost">
              Try a demo
            </Button>
          </div>
          <p className="rise mt-6 text-[0.85rem] text-faint" style={{ animationDelay: "0.24s" }}>
            Free first board · No card required · No login for your client
          </p>
        </div>

        <div className="rise" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full glow-warm opacity-40 blur-3xl" />
            <HookHero />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Trust strip */
const TRUST = ["Architecture", "Interiors", "Kitchen & bath", "New builds", "Renovations"];

function Trust() {
  return (
    <section className="mx-auto max-w-[1100px] px-5 pb-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <span className="text-[0.85rem] text-faint">Built for the way studios work —</span>
        {TRUST.map((t) => (
          <span key={t} className="text-[0.9rem] font-medium text-muted">
            {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Try it */
function TryIt() {
  return (
    <section
      id="product"
      className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20"
    >
      <div className="panel relative overflow-hidden rounded-[36px] p-8 shadow-soft sm:p-14">
        <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full glow-warm opacity-60 blur-3xl" />
        <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
          <div className="max-w-[46ch]">
            <span className="inline-flex items-center gap-2 text-[0.9rem] font-medium text-accent">
              <Sparkles className="size-4" /> Try it right now
            </span>
            <h2 className="mt-4 text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
              This is the whole client experience.
            </h2>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
              Go ahead — swipe a few exterior colours. Love it, or pass. Your client
              does exactly this, on their phone, for every category you set up. No
              account, no learning curve.
            </p>
            <div className="mt-7">
              <Button href="/c/kerrisdale-kitchen" variant="ghost">
                Open the full client demo <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
          <div className="justify-self-center">
            <TestSwipe />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- Report showcase */
function ReportShowcase() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-[52ch] text-center">
        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Send a report, not a guessing game.
        </h2>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
          Nobody wants to read about the process. They want the answer — laid out,
          on-brand, and ready to present.
        </p>
      </div>
      <div className="relative mx-auto mt-12 max-w-[1000px]">
        <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[44px] glow-cool opacity-40 blur-3xl" />
        <div className="panel rounded-[32px] p-4 shadow-float sm:p-8">
          <ReportPreview />
        </div>
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
      "Full swipe + showdown flow",
      "Client-ready finish report",
      "Tasteful Atelo footer",
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
      "No Atelo footer",
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
    note: "For studios running selections every week.",
    features: [
      "Unlimited boards",
      "Custom studio branding",
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
    <section
      id="pricing"
      className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-[46ch] text-center">
        <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Pay per project. Never per seat.
        </h2>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
          Boutique studios hate subscription fatigue — so the core of Atelo is a
          credit you buy once and expense to the invoice.
        </p>
      </div>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t) => (
          <article
            key={t.name}
            className={`relative flex h-full flex-col overflow-hidden rounded-[24px] p-7 ${
              t.featured ? "bg-surface shadow-float ring-2 ring-accent" : "bg-surface shadow-soft"
            }`}
          >
            {t.featured && (
              <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full glow-warm opacity-50 blur-3xl" />
            )}
            <div className="relative flex items-center justify-between">
              <span className="text-[0.85rem] font-medium text-muted">{t.name}</span>
              {t.featured && (
                <span className="rounded-full bg-accent px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.08em] text-white">
                  Most popular
                </span>
              )}
            </div>
            <div className="relative mt-6 flex items-baseline gap-2">
              <span className="text-[2.6rem] font-semibold leading-none tracking-[-0.03em]">
                {t.price}
              </span>
              <span className="text-[0.9rem] text-muted">{t.unit}</span>
            </div>
            <p className="relative mt-3 min-h-[42px] text-[0.9rem] leading-relaxed text-muted">
              {t.note}
            </p>
            <ul className="relative mt-6 space-y-3 border-t border-line pt-6">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[0.9rem]">
                  <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="relative mt-8 pt-2">
              <Button
                href={t.href}
                variant={t.featured ? "accent" : "ghost"}
                className="w-full"
              >
                {t.cta}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
