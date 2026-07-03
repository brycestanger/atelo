/**
 * ATELO colour-analysis engine — the "AI summary".
 *
 * Takes the colours a client liked while swiping and returns a ColourProfile:
 * a persona, a plain-language read of their taste (family, warmth, value,
 * saturation, neutral share), the standout palette, and a few colours to
 * explore next. Pure + deterministic, so the report renders instantly with no
 * loading spinner — swap in a live model later for extra prose if wanted.
 */
import type { ColourProfile, PaletteSwatch } from "@/lib/types";

export type LikedColour = { hex: string; name?: string; category?: string };

/* ------------------------------------------------------------ colour maths */
type HSL = { h: number; s: number; l: number };

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const raw = hex.trim().replace(/^#/, "");
  const s = raw.length === 3 ? raw.split("").map((c) => c + c).join("") : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return {
    r: parseInt(s.slice(0, 2), 16),
    g: parseInt(s.slice(2, 4), 16),
    b: parseInt(s.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): HSL {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  let h = 0;
  if (d !== 0) {
    if (max === r) h = (((g - b) / d) % 6 + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}

function hexToHsl(hex: string): HSL | null {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

/** circular mean for hues (degrees) */
function meanHue(hues: number[]): number {
  if (!hues.length) return 0;
  let x = 0;
  let y = 0;
  for (const h of hues) {
    x += Math.cos((h * Math.PI) / 180);
    y += Math.sin((h * Math.PI) / 180);
  }
  let a = (Math.atan2(y, x) * 180) / Math.PI;
  if (a < 0) a += 360;
  return a;
}

/* --------------------------------------------------------------- families */
function familyOf(h: number): string {
  if (h >= 345 || h < 16) return "red";
  if (h < 45) return "terracotta";
  if (h < 68) return "ochre";
  if (h < 160) return "green";
  if (h < 195) return "teal";
  if (h < 255) return "blue";
  if (h < 300) return "purple";
  return "pink";
}

const FAMILY_LABEL: Record<string, string> = {
  red: "red & oxide",
  terracotta: "terracotta & clay",
  ochre: "ochre & gold",
  green: "green",
  teal: "teal",
  blue: "blue",
  purple: "plum & purple",
  pink: "pink & plaster",
  neutral: "tonal neutrals",
};

/** short-name a swatch for palettes that arrive without a name */
function describeSwatch(hsl: HSL): string {
  if (hsl.s < 0.12) {
    if (hsl.l > 0.8) return "Off-white";
    if (hsl.l < 0.28) return "Near-black";
    return hsl.l < 0.5 ? "Charcoal" : "Warm grey";
  }
  const tone = hsl.l < 0.35 ? "Deep " : hsl.l > 0.7 ? "Soft " : "";
  const fam = FAMILY_LABEL[familyOf(hsl.h)].split(" ")[0];
  return `${tone}${fam.charAt(0).toUpperCase()}${fam.slice(1)}`;
}

/* --------------------------------------------------------------- personas */
const PERSONA: Record<string, { light: string; mid: string; dark: string }> = {
  green: { light: "The Sage Naturalist", mid: "The Botanist", dark: "The Forest Modernist" },
  teal: { light: "The Sea Glass", mid: "The Verdigris", dark: "The Deep Peacock" },
  blue: { light: "The Coastal Calm", mid: "The Blue Hour", dark: "The Deep Harbour" },
  terracotta: { light: "The Soft Plaster", mid: "The Warm Traditionalist", dark: "The Spice Route" },
  ochre: { light: "The Golden Hour", mid: "The Gilded Modern", dark: "The Amber Room" },
  red: { light: "The Blush Romantic", mid: "The Bold Romantic", dark: "The Oxblood Classic" },
  purple: { light: "The Lilac Dreamer", mid: "The Velvet Hour", dark: "The Aubergine" },
  pink: { light: "The Plaster Pink", mid: "The Rose Modern", dark: "The Dusk Rose" },
  neutral: { light: "The Quiet Minimalist", mid: "The Tonal Purist", dark: "The Shadow Play" },
};

function neutralFallback(): ColourProfile {
  return {
    headline: "A clean, tonal starting point.",
    persona: "The Quiet Minimalist",
    family: "Tonal neutrals",
    familyHex: "#8C9184",
    temperature: "balanced",
    value: "mid",
    saturation: "muted",
    neutralRatio: 1,
    description:
      "Not enough picks yet to read a strong direction — but the instinct so far is restrained and tonal. Swipe a few more and the palette will sharpen.",
    traits: ["Restrained", "Tonal", "Open"],
    palette: [{ name: "Warm grey", hex: "#8C9184" }],
    suggestions: [
      { name: "Warm off-white", hex: "#EAE6DE", why: "A soft ground to build on." },
      { name: "Deep charcoal", hex: "#33363B", why: "One anchor for contrast." },
    ],
  };
}

/* ------------------------------------------------------------- the engine */
export function analyzeColours(liked: LikedColour[]): ColourProfile {
  const parsed = liked
    .map((x) => ({ ...x, hsl: hexToHsl(x.hex) }))
    .filter((x): x is LikedColour & { hsl: HSL } => x.hsl !== null);

  if (parsed.length === 0) return neutralFallback();

  const NEUTRAL_S = 0.12;
  const chromatic = parsed.filter((p) => p.hsl.s >= NEUTRAL_S);
  const neutrals = parsed.filter((p) => p.hsl.s < NEUTRAL_S);
  const neutralRatio = neutrals.length / parsed.length;

  // dominant chromatic family
  const counts: Record<string, number> = {};
  for (const c of chromatic) {
    const k = familyOf(c.hsl.h);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const topFamily = ranked[0]?.[0];
  const dominantShare = topFamily ? counts[topFamily] / Math.max(1, chromatic.length) : 0;
  const neutralDominant = !topFamily || neutralRatio >= 0.62;
  const familyKey = neutralDominant ? "neutral" : (topFamily as string);

  const avgL = mean(parsed.map((p) => p.hsl.l));
  const avgS = chromatic.length ? mean(chromatic.map((p) => p.hsl.s)) : 0;
  const value: ColourProfile["value"] = avgL > 0.6 ? "light" : avgL < 0.4 ? "dark" : "mid";
  const saturation: ColourProfile["saturation"] =
    avgS < 0.28 ? "muted" : avgS > 0.52 ? "vivid" : "balanced";

  const warm = chromatic.filter((c) => c.hsl.h < 70 || c.hsl.h >= 330).length;
  const cool = chromatic.filter((c) => c.hsl.h >= 130 && c.hsl.h < 300).length;
  const temperature: ColourProfile["temperature"] =
    warm > cool * 1.4 ? "warm" : cool > warm * 1.4 ? "cool" : "balanced";

  // representative hex for the dominant family
  const inFamily = chromatic.filter((c) => familyOf(c.hsl.h) === familyKey);
  const familyHex = inFamily.length
    ? hslToHex(
        meanHue(inFamily.map((c) => c.hsl.h)),
        Math.max(0.25, mean(inFamily.map((c) => c.hsl.s))),
        Math.min(0.55, Math.max(0.3, mean(inFamily.map((c) => c.hsl.l)))),
      )
    : neutrals.length
      ? neutrals[0].hex.toUpperCase()
      : "#8C9184";

  // palette — dedupe, order by frequency then vividness
  const byHex = new Map<string, { hex: string; name?: string; count: number; hsl: HSL }>();
  for (const p of parsed) {
    const key = p.hex.toUpperCase();
    const e = byHex.get(key);
    if (e) e.count += 1;
    else byHex.set(key, { hex: key, name: p.name, count: 1, hsl: p.hsl });
  }
  const palette: PaletteSwatch[] = [...byHex.values()]
    .sort((a, b) => b.count - a.count || b.hsl.s - a.hsl.s)
    .slice(0, 6)
    .map((e) => ({ name: e.name || describeSwatch(e.hsl), hex: e.hex }));

  const famLabel = FAMILY_LABEL[familyKey];
  const famWord = famLabel.split(" ")[0];
  const valueWord = value === "dark" ? "deep" : value === "light" ? "soft" : "balanced";
  const tempWord = temperature === "warm" ? "warm" : temperature === "cool" ? "cool" : "even";

  const headline = neutralDominant
    ? `You lean quiet, ${valueWord} and tonal.`
    : `You lean ${valueWord}, ${tempWord} ${famWord}.`;

  const persona = (PERSONA[familyKey] ?? PERSONA.neutral)[value];

  const suggestions = buildSuggestions(familyKey, familyHex, value, temperature, neutralDominant);

  const description = buildDescription({
    famLabel,
    value,
    saturation,
    temperature,
    neutralRatio,
    neutralDominant,
    suggestion: suggestions[0],
  });

  const traits = buildTraits(value, saturation, temperature, neutralRatio, neutralDominant, famWord);

  void dominantShare; // available for a confidence read at the call site

  return {
    headline,
    persona,
    family: capitalise(famLabel),
    familyHex,
    temperature,
    value,
    saturation,
    neutralRatio,
    description,
    traits,
    palette,
    suggestions,
  };
}

/** confidence 0..1 from how consistent the picks are — used by buildReport */
export function analysisConfidence(liked: LikedColour[]): number {
  const parsed = liked.map((x) => hexToHsl(x.hex)).filter((h): h is HSL => h !== null);
  if (!parsed.length) return 0.6;
  const chromatic = parsed.filter((h) => h.s >= 0.12);
  const counts: Record<string, number> = {};
  for (const h of chromatic) counts[familyOf(h.h)] = (counts[familyOf(h.h)] ?? 0) + 1;
  const top = Math.max(0, ...Object.values(counts));
  const share = chromatic.length ? top / chromatic.length : 0;
  return Math.min(0.98, 0.58 + share * 0.3 + Math.min(parsed.length, 12) / 60);
}

/* ------------------------------------------------------------- copy helpers */
function capitalise(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function buildTraits(
  value: ColourProfile["value"],
  saturation: ColourProfile["saturation"],
  temperature: ColourProfile["temperature"],
  neutralRatio: number,
  neutralDominant: boolean,
  famWord: string,
): string[] {
  const t: string[] = [];
  t.push(value === "dark" ? "Deep" : value === "light" ? "Light & airy" : "Mid-toned");
  t.push(saturation === "muted" ? "Muted" : saturation === "vivid" ? "Saturated" : "Balanced");
  t.push(temperature === "warm" ? "Warm" : temperature === "cool" ? "Cool" : "Temperate");
  if (!neutralDominant) t.push(`${capitalise(famWord)}-forward`);
  if (neutralRatio >= 0.3) t.push("Neutral-anchored");
  return t.slice(0, 4);
}

function buildDescription(o: {
  famLabel: string;
  value: ColourProfile["value"];
  saturation: ColourProfile["saturation"];
  temperature: ColourProfile["temperature"];
  neutralRatio: number;
  neutralDominant: boolean;
  suggestion?: { name: string; hex: string; why: string };
}): string {
  const valuePhrase =
    o.value === "dark"
      ? "deep and grounding"
      : o.value === "light"
        ? "soft and airy"
        : "comfortable mid-tones";
  const tempPhrase =
    o.temperature === "warm"
      ? "There's real warmth running through them"
      : o.temperature === "cool"
        ? "They read cool and composed"
        : "They sit in an easy warm–cool balance";
  const first = o.neutralDominant
    ? `Your picks stay restrained and tonal — ${valuePhrase}, mostly ${o.saturation}.`
    : `Your picks cluster around ${o.famLabel} — ${valuePhrase}, mostly ${o.saturation}.`;
  const anchor = o.neutralRatio >= 0.3 && !o.neutralDominant ? ", anchored by a good share of neutrals" : "";
  const second = `${tempPhrase}${anchor}.`;
  const third = o.suggestion
    ? ` To round it out, try ${o.suggestion.name.toLowerCase()} — ${o.suggestion.why.toLowerCase()}`
    : "";
  return `${first} ${second}${third}`;
}

function buildSuggestions(
  familyKey: string,
  familyHex: string,
  value: ColourProfile["value"],
  temperature: ColourProfile["temperature"],
  neutralDominant: boolean,
): { name: string; hex: string; why: string }[] {
  const hsl = hexToHsl(familyHex) ?? { h: 100, s: 0.2, l: 0.45 };
  const out: { name: string; hex: string; why: string }[] = [];

  if (neutralDominant) {
    out.push(
      { name: "Warm off-white", hex: "#EBE6DD", why: "A soft ground that keeps things calm." },
      { name: "Olive-grey", hex: "#6E7167", why: "A tonal step up with a hint of colour." },
      { name: "Ink charcoal", hex: "#2E3136", why: "One deep anchor for contrast." },
    );
    return out;
  }

  // tonal sibling — shift lightness opposite to the current lean
  const siblingL = value === "dark" ? Math.min(0.72, hsl.l + 0.28) : Math.max(0.24, hsl.l - 0.26);
  out.push({
    name:
      value === "dark"
        ? `A lighter ${FAMILY_LABEL[familyKey].split(" ")[0]}`
        : `A deeper ${FAMILY_LABEL[familyKey].split(" ")[0]}`,
    hex: hslToHex(hsl.h, Math.max(0.18, hsl.s * 0.9), siblingL),
    why:
      value === "dark"
        ? "Lifts the palette without leaving the family."
        : "Adds depth and grounds the scheme.",
  });

  // complementary accent
  const compHue = (hsl.h + 165) % 360;
  out.push({
    name: `${capitalise(FAMILY_LABEL[familyOf(compHue)].split(" ")[0])} accent`,
    hex: hslToHex(compHue, 0.42, 0.5),
    why: "A considered opposite for a single accent moment.",
  });

  // grounding neutral tuned to temperature
  out.push(
    temperature === "warm"
      ? { name: "Warm greige", hex: "#CDC3B4", why: "Keeps the warmth but calms the room." }
      : { name: "Cool stone grey", hex: "#B9BCBD", why: "A quiet neutral that lets the colour lead." },
  );

  return out;
}
