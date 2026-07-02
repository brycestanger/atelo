# ATELO — PRODUCT.md

> Signal over noise. AI-synthesized design briefs from client swipes.

## What it is
A B2B SaaS workflow tool for architects, interior designers, and mass-timber
specialists. It replaces the chaotic "send me a Pinterest board" phase of client
onboarding with a gamified, mobile-first swiping experience. Clients swipe, pin,
and run head-to-head comparisons on architectural precedents; an AI (Gemini Flash)
synthesizes their choices into a structured, professional design brief.

## Who it's for
- **Primary:** principals, project managers, and interns at boutique + large
  architecture / interior firms who run the fuzzy front-end of client discovery.
- **Beachhead:** Vancouver mass-timber & parametric studios (technical early adopters).
- **The client** (secondary user): a developer / homeowner / business owner who
  receives a link and swipes on their phone. They never sign up.

## Register
Mixed. Two surfaces, two jobs:
- **Brand** (design IS the product): the marketing site. Sells the service like
  Linear / Chronicle, feels like an elite European studio like Antinomy.
- **Product** (design SERVES the product): the architect command center + the
  client swiping experience.

## The metaphor
ATELO = *Atelopus*, the Harlequin Toad. Sits perfectly still, filters the jungle's
noise, strikes its exact target. Pitch-black body, blazing high-contrast orange
spots. The product is: filter noise → find the exact signal. The orange dot is the
brand atom (a pin, a signal, a hit).

## The funnel (core flow)
0. **Setup** (architect): create project, upload curated precedents into categories,
   generate a client link.
1. **Explore** (client): full-screen swipe deck. Right = like, Left = pass, `+` = Pin.
2. **Resolve** (client): "showdown" — pinned items compete A/B until one winner per category.
3. **Synthesize** (AI): liked images = broad context, winners = heavily weighted →
   structured JSON brief (style, materials w/ %, palette, structural themes).
4. **Output** (architect): bento results dashboard + branded PDF export.

## Routes
- `/` landing · `/login`
- `/dashboard` · `/dashboard/new` · `/dashboard/project/[id]` (bento results)
- `/c/[id]` welcome+tutorial · `/c/[id]/deck/[category]` swipe · `/c/[id]/compare/[category]` · `/c/[id]/complete`
- `/api/analyze` (Gemini)

## Stack ($0 dev footprint)
Next.js (App Router) + React + Tailwind v4 · Vercel · Supabase (PG + magic-link) ·
Supabase Storage / R2 · Gemini 1.5 Flash (native JSON) · Framer Motion · Lemon Squeezy.

## Monetization
Pay-per-project credits. Free: 1 board (watermark = viral loop). Credits $9–12 (never
expire, expensable). Pro $39/mo (unlimited, custom branding).

## Status (this build)
Marketing site + full app shell with designed screens and realistic mock data.
Supabase / Gemini / Lemon Squeezy are scaffolded as typed stubs, not yet wired.
