"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button, Dot, Tag, Wordmark } from "@/components/ui";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Product", href: "#product" },
  { label: "How it works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
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
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-[0.86rem] text-muted transition-colors hover:text-ink"
            >
              {n.label}
            </a>
          ))}
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

const FOOTER_COLS = [
  {
    head: "Product",
    links: ["Overview", "How it works", "Pricing", "Changelog"],
  },
  {
    head: "Studio",
    links: ["Manifesto", "Mass timber", "Careers", "Contact"],
  },
  {
    head: "Legal",
    links: ["Privacy", "Terms", "Security", "DPA"],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-ink-bg text-ink-text">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        {/* the big closing statement — antinomy's inverted fold */}
        <div className="flex flex-col gap-8 border-b border-ink-line py-20 md:flex-row md:items-end md:justify-between md:py-28">
          <div>
            <Tag dark className="text-ink-muted">
              <Dot /> READY WHEN YOU ARE
            </Tag>
            <h2 className="mt-5 max-w-[14ch] text-[clamp(2.6rem,7vw,5.5rem)] font-semibold leading-[0.94] tracking-[-0.03em]">
              Start with a
              <br />
              swipe<span className="text-accent">.</span>
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-ink-muted md:text-right">
              Your first board is free. Send it to a client tonight and read the
              finish report tomorrow.
            </p>
            <div className="flex items-center gap-3">
              <Button href="/dashboard" variant="accent" size="lg">
                Create a board
                <ArrowUpRight className="size-4" />
              </Button>
              <Button href="/c/kerrisdale-kitchen" variant="ghost-dark" size="lg">
                See a client demo
              </Button>
            </div>
          </div>
        </div>

        {/* link columns */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-3 md:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Wordmark dark />
            <p className="mt-4 max-w-[30ch] text-[0.9rem] leading-relaxed text-ink-muted">
              Finish selection as a swipe. One link, a client-ready report — built
              for architects and interior designers.
            </p>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.head}>
              <div className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-muted">
                {col.head}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-[0.9rem] text-ink-text/80 transition-colors hover:text-accent"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* metadata baseline */}
        <div className="flex flex-col gap-3 border-t border-ink-line py-8 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Atelo — Digital Creative Studio</span>
          <span>Amsterdam · Vancouver</span>
        </div>
      </div>
    </footer>
  );
}
