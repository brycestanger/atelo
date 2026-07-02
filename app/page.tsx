import { ArrowRight, ArrowUpRight, Link2, Sparkles } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { HeroCanvas, TestSwipe, ReportPreview } from "@/components/product-mock";
import { Button, Dot, Reveal } from "@/components/ui";
import { CATEGORIES } from "@/lib/mock-data";

export default function LandingPage() {
  return (
    <>
      <SiteNav />
      <main className="overflow-clip">
        <Hero />
        <ProofBand />
        <TryIt />
        <HowItWorks />
        <Features />
        <ReportSection />
        <Pricing />
      </main>
      <SiteFooter />
    </>
  );
}

/* ------------------------------------------------------------------ Hero */
function Hero() {
  return (
    <section className="relative mx-auto max-w-[1200px] px-5 pb-10 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-[820px] text-center">
        <Reveal>
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.8rem] text-muted shadow-soft">
            <Dot /> For architects &amp; interior designers
          </span>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.03em]">
            Your client picks the finishes.
            <br className="hidden sm:block" /> You get the report
            <span className="text-accent">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-[54ch] text-[1.08rem] leading-relaxed text-muted">
            Send one link. Your client swipes through colours, countertops, lighting
            and fixtures on their phone — about five minutes — and Atelo hands you a
            client-ready finish report to send right back.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/dashboard" size="lg" variant="primary">
              Start free
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Button>
            <Button href="/dashboard/project/kerrisdale-kitchen" size="lg" variant="ghost">
              See a live report
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.24}>
          <p className="mt-5 text-[0.85rem] text-faint">
            Free first board · No card required · No login for your client
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mx-auto mt-14 max-w-[1000px]">
        <HeroCanvas />
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------- Proof band */
const PROOF = [
  "Architecture",
  "Interiors",
  "Kitchen & bath",
  "New builds",
  "Renovations",
];

function ProofBand() {
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 py-6 sm:px-8">
        <span className="text-[0.85rem] text-faint">Built for the way studios work —</span>
        {PROOF.map((p) => (
          <span key={p} className="flex items-center gap-8">
            <span className="text-[0.9rem] font-medium text-muted">{p}</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- Try it */
function TryIt() {
  return (
    <section id="try" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto]">
        <Reveal className="max-w-[46ch]">
          <span className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-accent">
            <Sparkles className="size-4" /> Try it right now
          </span>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            This is the whole client experience.
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            Go ahead — swipe through a few exterior colours. Love it, or pass. Your
            client does exactly this, on their phone, for every category you set up.
            No account, no learning curve, no ten-tab email thread.
          </p>
          <div className="mt-7">
            <Button href="/c/kerrisdale-kitchen" variant="ghost">
              Open the full client demo
              <ArrowUpRight className="size-4" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.08} className="justify-self-center">
          <TestSwipe />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ How it works */
const STEPS = [
  {
    n: "01",
    title: "Set up the board",
    body: "Name the project, add the categories you care about, and drop in your options — photos or colour swatches.",
  },
  {
    n: "02",
    title: "Send one link",
    body: "Text or email a single link. No login, no app to install — it just opens on your client's phone.",
  },
  {
    n: "03",
    title: "They swipe",
    body: "Colours, countertops, lighting, tile, fixtures. Favourites face off head-to-head until one wins each category.",
  },
  {
    n: "04",
    title: "Get the report",
    body: "A client-ready finish report lands on your dashboard — palette, picks, and takeaways. Export to PDF and send.",
  },
];

function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 border-y border-line bg-surface/50">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="max-w-[44ch]">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            From first idea to client-ready, in an afternoon.
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-card border border-line bg-surface p-6 shadow-soft">
                <span className="text-[1.5rem] font-semibold tracking-tight text-accent tnum">
                  {s.n}
                </span>
                <h3 className="mt-4 text-[1.12rem] font-semibold tracking-[-0.01em]">
                  {s.title}
                </h3>
                <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Features */
function Features() {
  return (
    <section id="product" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <Reveal className="max-w-[42ch]">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Everything the fuzzy front-end needs.
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
        <Reveal className="md:col-span-4 md:row-span-2">
          <article className="flex h-full min-h-[320px] flex-col justify-between rounded-card border border-line bg-surface p-7 shadow-soft">
            <div>
              <h3 className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em]">
                Any finish, any category
              </h3>
              <p className="mt-2 max-w-[46ch] text-[0.95rem] leading-relaxed text-muted">
                Colours as swatches, everything else as photos. Set up the categories
                that matter for this project — and only those.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-line bg-surface-2 px-3.5 py-1.5 text-[0.85rem]"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </article>
        </Reveal>

        <FeatureCell
          title="One link, no login"
          body="Your client opens it on their phone and starts. Nothing to install, nothing to sign up for."
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1.5 font-medium text-muted">
            <Link2 className="size-4 text-accent" /> atelo.studio/c/…
          </span>
        </FeatureCell>

        <FeatureCell
          title="Favourites face off"
          body="Pinned picks are pitted head-to-head until one clear winner survives per category."
        >
          <div className="flex items-center gap-2 text-[0.8rem] text-muted">
            <span className="rounded-lg border border-line px-2.5 py-1">Sage</span>
            <span className="text-faint">vs</span>
            <span className="rounded-lg border border-accent px-2.5 py-1 text-accent">Clay</span>
          </div>
        </FeatureCell>

        <FeatureCell
          className="md:col-span-3"
          title="A report, not a spreadsheet"
          body="You get a clean, client-ready document — palette, selected finishes, and what it all means. Export to PDF and send."
        >
          <div className="flex -space-x-2">
            {["#8C9184", "#E9E3D6", "#A9793F", "#26241F", "#B26B47"].map((c) => (
              <span
                key={c}
                className="size-7 rounded-full ring-2 ring-surface"
                style={{ background: c }}
              />
            ))}
          </div>
        </FeatureCell>

        <FeatureCell
          className="md:col-span-3"
          title="Your studio, front and centre"
          body="Custom branding on Pro. On the free tier, a tasteful footer quietly markets you to every client."
        >
          <span className="text-[0.85rem] text-muted">Prepared by your studio</span>
        </FeatureCell>
      </div>
    </section>
  );
}

function FeatureCell({
  title,
  body,
  children,
  className = "",
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`md:col-span-2 ${className}`}>
      <article className="flex h-full min-h-[200px] flex-col justify-between rounded-card border border-line bg-surface p-6 shadow-soft">
        <div>
          <h3 className="text-[1.18rem] font-semibold leading-snug tracking-[-0.01em]">
            {title}
          </h3>
          <p className="mt-2 text-[0.92rem] leading-relaxed text-muted">{body}</p>
        </div>
        <div className="mt-6">{children}</div>
      </article>
    </Reveal>
  );
}

/* ----------------------------------------------------------- Report section */
function ReportSection() {
  return (
    <section className="border-y border-line bg-surface/50">
      <div className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-28">
        <Reveal className="mx-auto max-w-[52ch] text-center">
          <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
            Send a report, not a guessing game.
          </h2>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">
            Nobody wants to read about the process. They want the answer — laid out,
            on-brand, and ready to present. Here&apos;s what lands on your dashboard.
          </p>
        </Reveal>
        <Reveal delay={0.08} className="mx-auto mt-12 max-w-[960px]">
          <ReportPreview />
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
    <section id="pricing" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-24 sm:px-8 sm:py-28">
      <Reveal className="max-w-[46ch]">
        <h2 className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Pay per project. Never per seat you don&apos;t use.
        </h2>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-muted">
          Boutique studios hate subscription fatigue — so the core of Atelo is a
          credit you buy once and expense to the invoice.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.06}>
            <article
              className={`flex h-full flex-col rounded-card border p-7 ${
                t.featured
                  ? "border-accent bg-surface shadow-float"
                  : "border-line bg-surface shadow-soft"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[0.85rem] font-medium text-muted">{t.name}</span>
                {t.featured && (
                  <span className="rounded-full bg-accent px-2.5 py-1 text-[0.66rem] font-medium uppercase tracking-[0.08em] text-white">
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
                    <span className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-accent" />
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
