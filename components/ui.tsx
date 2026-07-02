"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------- Dot */
/** The brand atom: a pin / signal / toad spot. */
export function Dot({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-block size-[0.5em] rounded-full bg-accent align-middle", className)}
    />
  );
}

/* ----------------------------------------------------------- Wordmark */
export function Wordmark({
  className,
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-semibold tracking-[0.22em] text-[0.95rem] uppercase select-none",
        dark ? "text-ink-text" : "text-ink",
        className,
      )}
    >
      ATELO
      <Dot className="ml-[0.28em] size-[0.28em] translate-y-[-0.05em]" />
    </span>
  );
}

/* ------------------------------------------------------------- Button */
type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "accent" | "ghost" | "ghost-dark";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
};

const BTN_BASE =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,color,border-color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

const BTN_SIZE = {
  sm: "h-9 px-4 text-[0.82rem]",
  md: "h-11 px-5 text-[0.9rem]",
  lg: "h-13 px-7 text-[0.95rem]",
} as const;

const BTN_VARIANT = {
  primary: "bg-ink text-white hover:bg-ink/90",
  accent: "bg-accent text-[var(--color-on-accent)] hover:bg-accent-press",
  ghost: "border border-line text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
  "ghost-dark": "border border-ink-line text-ink-text hover:bg-white/5",
} as const;

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  onClick,
  type = "button",
}: ButtonProps) {
  const cls = cn(BTN_BASE, BTN_SIZE[size], BTN_VARIANT[variant], className);
  if (href) {
    const internal = href.startsWith("/");
    if (internal) {
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- Tag */
/** Small technical mono label, optionally with a leading dot. */
export function Tag({
  children,
  dot = false,
  dark = false,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em]",
        dark ? "text-ink-muted" : "text-muted",
        className,
      )}
    >
      {dot && <Dot className="size-[0.4rem]" />}
      {children}
    </span>
  );
}

/* --------------------------------------------------------- Live clock */
/** Antinomy-style local clock in mono. Hydration-safe. */
export function LiveClock({
  label = "LOCAL",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={cn("font-mono text-[0.7rem] tracking-[0.1em] tnum", className)}>
      {label} {time ?? "--:--:--"}
    </span>
  );
}

/* ------------------------------------------------------------ Reveal */
/** Scroll-driven fade + rise via pure CSS (see `.reveal` in globals.css).
 *  Visible by default — never gates content on JS or an observer firing. */
export function Reveal({
  children,
  className,
}: {
  children: ReactNode;
  /** kept for call-site ergonomics; timing is handled by the CSS timeline */
  delay?: number;
  y?: number;
  className?: string;
}) {
  return <div className={cn("reveal", className)}>{children}</div>;
}
