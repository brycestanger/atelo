# ATELO

**Signal over noise. AI-synthesized design briefs from client swipes.**

Atelo is a B2B SaaS workflow tool for architects, interior designers, and
mass-timber studios. It replaces the chaotic "send me a Pinterest board" phase of
client onboarding with a gamified, mobile-first swiping experience — then an AI
synthesizes the client's choices into a structured, presentation-ready brief.

Named after *Atelopus*, the Harlequin Toad: pitch-black, blazing orange spots, and
it strikes only its exact target. Filter the noise; find the signal.

---

## The flow

```
Architect                         Client (no login)                 AI            Architect
──────────                        ─────────────────                 ──            ──────────
load precedents  ──link──▶  swipe (like/pass/pin)  ▶  showdown  ▶  synthesize  ▶  bento brief + PDF
```

0. **Setup** — create a board, load curated precedents into categories, share a link.
1. **Explore** — the client swipes a full-screen deck: right = like, left = pass, `+` = pin.
2. **Resolve** — pinned favourites face off head-to-head until one winner per category.
3. **Synthesize** — winners (weighted) + likes (context) → a strict JSON brief.
4. **Deliver** — a bento results dashboard + branded PDF export.

## Two visual worlds

- **Light world** (marketing + architect command center) — off-white, editorial,
  Swiss restraint, inspired by [antinomy.studio](https://antinomy.studio).
- **Dark world** (client swipe + compare) — pitch black, one orange, immersive.
  The toad: black body, orange spots.

## Stack

- **Next.js 15** (App Router) · **React 19** · **Tailwind CSS v4** (OKLCH tokens)
- **Archivo** + **Geist Mono** (self-hosted via `next/font`)
- **Framer Motion** for the swipe physics and scroll motion
- Designed for: **Supabase** (Postgres + magic-link + storage), **Gemini 1.5 Flash**
  (native JSON), **Lemon Squeezy** (merchant of record), **Vercel** hosting — a $0 dev footprint.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Supabase / Gemini / Lemon Squeezy keys (optional for the demo)
npm run dev                   # http://localhost:3000
```

Everything runs on realistic mock data out of the box — the full funnel is clickable
without any keys. Wire the env vars to make it live.

## Routes

| Zone | Route | |
|---|---|---|
| Marketing | `/` · `/login` | landing + auth |
| Architect | `/dashboard` | board grid |
| | `/dashboard/new` | setup wizard |
| | `/dashboard/project/[id]` | bento results + PDF export |
| Client | `/c/[id]` | welcome + tutorial |
| | `/c/[id]/deck/[category]` | swipe deck |
| | `/c/[id]/compare/[category]` | showdown |
| | `/c/[id]/complete` | handoff |
| API | `/api/analyze` | Gemini synthesis (stubbed) |

Try the client demo: [`/c/harbourfront-residence`](http://localhost:3000/c/harbourfront-residence).

## Monetization

Pay-per-project credits, not subscription fatigue. Free: 1 board (watermarked, a
viral loop). Credits: $9–12/board, never expire, expensable. Pro: $39/mo unlimited
with custom branding.

## Design system

See [`DESIGN.md`](./DESIGN.md) for the full token system, type scale, motion rules,
and the "dot" brand device. See [`PRODUCT.md`](./PRODUCT.md) for the product spec.

---

*Made in Vancouver, for the way studios actually work.*
