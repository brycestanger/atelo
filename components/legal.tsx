import Link from "next/link";
import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { Dot } from "@/components/ui";

export type LegalSection = { heading: string; body: string[] };

/** Shared prose shell for the Privacy / Terms / Security pages. */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-[720px] px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <span className="inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-muted">
          <Dot /> Legal
        </span>
        <h1 className="mt-5 text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          {title}
        </h1>
        <p className="mt-4 text-[0.88rem] text-faint">Last updated {updated}</p>
        <p className="mt-8 text-[1.1rem] leading-relaxed text-ink/90">{intro}</p>

        <div className="mt-12 space-y-10">
          {sections.map((s, i) => (
            <section key={s.heading}>
              <h2 className="text-[1.3rem] font-semibold tracking-[-0.015em]">
                <span className="text-faint">{i + 1}.</span> {s.heading}
              </h2>
              {s.body.map((p, j) => (
                <p key={j} className="mt-3 text-[1rem] leading-relaxed text-muted">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-surface p-6 shadow-soft">
          <p className="text-[0.95rem] leading-relaxed text-muted">
            Questions about this page? Email{" "}
            <a
              href="mailto:bandrewstanger@gmail.com"
              className="font-medium text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              bandrewstanger@gmail.com
            </a>
            .
          </p>
        </div>

        <div className="mt-8 text-[0.9rem]">
          <Link
            href="/"
            className="text-muted underline-offset-4 transition-colors hover:text-accent hover:underline"
          >
            ← Back to home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
