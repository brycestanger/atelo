import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { Button, Dot } from "@/components/ui";

export const metadata = { title: "About" };

const SCHOOLS = [
  { school: "University of Bath", note: "Architecture" },
  { school: "TU Delft", note: "Architecture" },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="overflow-clip">
        {/* Intro */}
        <section className="relative px-5 pb-6 pt-32 sm:px-8 sm:pt-40">
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-[-8%] size-[520px] -translate-x-1/2 rounded-full glow-warm opacity-60 blur-[110px]" />
          </div>
          <div className="mx-auto max-w-[1100px]">
            <span className="inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-muted">
              <Dot /> Who&apos;s behind Atelo
            </span>
            <h1 className="mt-5 max-w-[18ch] text-[clamp(2.5rem,6vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
              Made for architects, by one in the making<span className="text-accent">.</span>
            </h1>
          </div>
        </section>

        {/* Portrait + story */}
        <section className="px-5 py-12 sm:px-8 sm:py-16">
          <div className="mx-auto grid max-w-[1100px] items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <figure className="lg:sticky lg:top-24">
              <div
                role="img"
                aria-label="Bryce Stanger, founder of Atelo"
                className="relative aspect-[3/4] w-full overflow-hidden rounded-[30px] bg-surface-2 bg-cover bg-center shadow-float"
                style={{ backgroundImage: "url('/about-portrait.jpg')" }}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/[0.06] to-transparent" />
              </div>
              <figcaption className="mt-4 text-[0.85rem] text-faint">
                Bryce Stanger — architecture student &amp; founder of Atelo.
              </figcaption>
            </figure>

            <div className="max-w-[54ch]">
              <div className="space-y-5 text-[1.12rem] leading-relaxed text-ink/90">
                <p>
                  I&apos;m Bryce — an architecture student who studied at the{" "}
                  <strong className="font-medium">University of Bath</strong> and{" "}
                  <strong className="font-medium">TU Delft</strong>. Somewhere between
                  studio crits and material libraries, I kept hitting the same wall.
                </p>
                <p>
                  Finish selection is one of the most important conversations a designer
                  has with a client — and it almost always happens over messy email
                  threads, blurry screenshots, and half-remembered preferences. The
                  taste is there; the tools aren&apos;t.
                </p>
                <p>
                  Atelo is my answer. It turns finish selection into something a client
                  can actually enjoy — a swipe — and hands the designer a clear,
                  client-ready report at the end. No accounts for the client, no
                  spreadsheet archaeology for you.
                </p>
                <p>
                  I&apos;m building for the people I studied alongside: architects and
                  interior designers who sweat the details and are tired of software
                  that doesn&apos;t keep up. If that&apos;s you, I&apos;d genuinely love
                  to hear what you think.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                {SCHOOLS.map((e) => (
                  <div
                    key={e.school}
                    className="rounded-2xl bg-surface px-5 py-3 shadow-soft"
                  >
                    <div className="text-[0.95rem] font-medium">{e.school}</div>
                    <div className="text-[0.8rem] text-muted">{e.note}</div>
                  </div>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Button href="/dashboard" size="lg" variant="accent">
                  Try Atelo free
                  <ArrowRight className="size-4" />
                </Button>
                <Button href="mailto:bandrewstanger@gmail.com" size="lg" variant="ghost">
                  Get in touch
                  <ArrowUpRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
