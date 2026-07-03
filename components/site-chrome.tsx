"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Github } from "lucide-react";
import { Button, Dot, Wordmark } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Atelo home">
          <Wordmark />
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
          {NAV.map((n) =>
            n.href.includes("#") ? (
              <a
                key={n.href}
                href={n.href}
                className="text-[0.86rem] text-muted transition-colors hover:text-ink"
              >
                {n.label}
              </a>
            ) : (
              <Link
                key={n.href}
                href={n.href}
                className="text-[0.86rem] text-muted transition-colors hover:text-ink"
              >
                {n.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-[0.86rem] text-muted transition-colors hover:text-ink sm:inline"
          >
            Log in
          </Link>
          <Button href="/dashboard" size="sm" variant="primary">
            Start building
          </Button>
        </div>
      </div>
    </header>
  );
}

type FooterLinkT = { label: string; href: string; external?: boolean };

const FOOTER_COLS: { head: string; links: FooterLinkT[] }[] = [
  {
    head: "Product",
    links: [
      { label: "Overview", href: "/#product" },
      { label: "How it works", href: "/#how" },
      { label: "Pricing", href: "/#pricing" },
      {
        label: "Changelog",
        href: "https://github.com/brycestanger/atelo/commits/initial-build",
        external: true,
      },
    ],
  },
  {
    head: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "mailto:bandrewstanger@gmail.com", external: true },
    ],
  },
  {
    head: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
    ],
  },
];

function FooterLink({ link }: { link: FooterLinkT }) {
  const cls =
    "group inline-flex items-center gap-1 text-[0.92rem] text-ink/80 transition-colors hover:text-accent";
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {link.label}
        <ArrowUpRight className="size-3.5 text-faint transition-colors group-hover:text-accent" />
      </a>
    );
  }
  if (link.href.includes("#")) {
    return (
      <a href={link.href} className={cls}>
        {link.label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-bg text-ink">
      {/* soft warm glow so the closing line keeps presence without a dark block */}
      <div className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute left-1/2 top-[-24%] size-[640px] -translate-x-1/2 rounded-full glow-warm opacity-50 blur-[120px]" />
        <div className="absolute right-[8%] top-[10%] size-[360px] rounded-full glow-cool opacity-40 blur-[100px]" />
      </div>
      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* the big closing statement — kept, the line worth keeping */}
        <div className="flex flex-col gap-8 border-b border-line py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-muted">
              <Dot /> Ready when you are
            </span>
            <h2 className="mt-5 max-w-[14ch] text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.03em]">
              Start with a
              <br />
              swipe<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-5 md:items-end">
            <p className="max-w-[32ch] text-[0.98rem] leading-relaxed text-muted md:text-right">
              Your first board is free. Send it to a client tonight and read the
              finish report tomorrow.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/dashboard" variant="accent" size="lg">
                Create a board
                <ArrowUpRight className="size-4" />
              </Button>
              <Button href="/c/kerrisdale-kitchen" variant="ghost" size="lg">
                See a client demo
              </Button>
            </div>
          </div>
        </div>

        {/* brand + link columns */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-16 sm:grid-cols-3 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Wordmark />
            <p className="mt-4 max-w-[32ch] text-[0.92rem] leading-relaxed text-muted">
              Finish selection as a swipe. One link, a client-ready report — built
              for the way architecture and interior studios actually work.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.head}>
              <div className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted">
                {col.head}
              </div>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink link={l} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* baseline */}
        <div className="flex flex-col gap-4 border-t border-line py-8 text-[0.82rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Atelo</span>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/brycestanger/atelo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              <Github className="size-4" /> GitHub
            </a>
            <span>
              Designed &amp; built by{" "}
              <Link
                href="/about"
                className="font-medium text-ink underline-offset-4 transition-colors hover:text-accent hover:underline"
              >
                Bryce Stanger
              </Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
