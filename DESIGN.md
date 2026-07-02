# ATELO — DESIGN.md

The design contract. Grounded in the live inspection of antinomy.studio + the
Linear / Chronicle selling patterns. Read before touching UI.

## Reference lock
- **Antinomy** (the north star): pure black on white, `ABC Diatype` at weight **400**
  with tight tracking (~-0.04em), restrained ~34px headings, colossal whitespace,
  hairline rules, tiny mono-ish captions, a live local clock, one dramatic inverted
  closing fold. The magic is composition + restraint, not big type.
- **Linear / Chronicle** (the sell): big honest product visuals, benefit-first
  copy, bento feature grids, testimonial + logo trust strip, one strong closing CTA.

## Two visual worlds (art direction per surface — deliberate)
- **Light world** — marketing + architect command center. Off-white, editorial,
  Swiss restraint. This is Antinomy.
- **Dark world** — the client swipe deck + compare. Pitch black, cards float, orange
  is the only color. This is the *toad*: black body, orange spots. Immersive, tactile,
  game-like.

## Color (OKLCH, semantic names — never `--paper`/`--cream`/`--bone`)
A near-neutral off-white, NOT warm cream (cream is the 2026 AI tell). Warmth lives in
the accent, not the background. Strategy: restrained monochrome base + one *committed*
loud International Orange + drenched inverted folds for drama.

| token            | oklch                     | hex approx | use |
|------------------|---------------------------|------------|-----|
| `--bg`           | `oklch(.969 .003 83)`     | `#F5F5F2`  | light base |
| `--surface`      | `oklch(.986 .002 83)`     | `#FCFBFA`  | faint elevation |
| `--ink`          | `oklch(.205 .006 75)`     | `#1A1815`  | text / near-black |
| `--muted`        | `oklch(.455 .008 75)`     | `#615D57`  | secondary text (≥4.5:1 on bg) |
| `--faint`        | `oklch(.62 .006 75)`      | `#918C84`  | decorative meta only, never body |
| `--line`         | `oklch(.205 .006 75 /.14)`| —          | hairlines |
| `--accent`       | `oklch(.678 .231 38)`     | `#FF4F00`  | International Orange — the pop |
| `--accent-press` | `oklch(.62 .225 38)`      | `#E24700`  | active/hover |
| `--ink-bg`       | `oklch(.17 .006 285)`     | `#101114`  | dark world base |
| `--ink-surface`  | `oklch(.205 .006 285)`    | `#16171B`  | dark cards (#111216 family) |

- On orange, text is **near-black** (`--ink`), not white — bolder, more Swiss. Verify ≥4.5:1.
- Body text on `--bg` uses `--ink`; secondary uses `--muted` (verified), never `--faint`.

## Type (all via next/font/google, self-hosted, zero layout shift)
- **Archivo** — display + headings + UI + body. One family, weight/width contrast does
  the work (400 body, 500 UI, 600–700 display). Architectural grotesque; keeps Antinomy's
  Swiss neutrality without being ABC Diatype (paid) or a reflex-reject font.
- **Archivo Expanded** — the `ATELO` wordmark + a few monumental display moments only.
- **Geist Mono** — tags, technical captions, index numbers, live clock, metadata, and the
  AI JSON output. Mono is *earned* here (the product literally emits JSON), not costume.

Rules: display letter-spacing floor **-0.03em** (never tighter than -0.04em). Hero clamp
max ≤ 6rem. Body measure 65–75ch. `text-wrap: balance` on h1–h3, `pretty` on prose.

## The dot (brand device)
A single filled circle = a pin / a signal / a toad spot. Small, orange, deliberate.
It marks the wordmark, live states, the `+PIN` action, active nav, list bullets. It is a
*system*, not decoration — so it's allowed where a generic dot wouldn't be.

## Motion
Framer Motion. Ease-out expo/quart, no bounce/elastic. Swipe cards = crisp 60fps physics
(drag + rotate + throw). One orchestrated page-load on the hero; per-section reveals only
where they fit. Every animation has a `prefers-reduced-motion` crossfade/instant fallback.

## Bans respected (from impeccable)
No warm-cream bg · no eyebrow/`01·` scaffolding on every section (only the real funnel
sequence is numbered) · hairline borders, no ghost-card shadow pairs · card radius ≤16px ·
no gradient text · no decorative grid backgrounds · no sketchy SVG · verified contrast ·
ship real product imagery (built UI mocks), never colored-block placeholders.
