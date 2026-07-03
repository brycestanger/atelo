/** ATELO domain types — finish selection, see PRODUCT.md. */

export type ProjectStatus =
  | "draft"
  | "awaiting-client"
  | "swiping"
  | "synthesizing"
  | "ready";

/** Photo categories show images; swatch categories show colour fields. */
export type CategoryKind = "photo" | "swatch";

export type Category = {
  id: string;
  name: string;
  kind: CategoryKind;
  /** number of options the designer loaded */
  count: number;
};

export type Precedent = {
  id: string;
  categoryId: string;
  title: string;
  /** short finish spec, e.g. "Honed marble · soft veining" */
  meta: string;
  kind: CategoryKind;
  /** photo url (kind: photo) */
  src?: string;
  /** hex colour (kind: swatch) */
  color?: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  updated: string;
  categories: Category[];
  /** 0..1 — how far the client has moved through the deck */
  swipeProgress: number;
};

export type PaletteSwatch = { name: string; hex: string };

/** Output of the colour-analysis engine (lib/analysis.ts) — the "AI summary". */
export type ColourProfile = {
  /** e.g. "You lean deep, cool green." */
  headline: string;
  /** short evocative label, e.g. "The Forest Modernist" */
  persona: string;
  /** dominant hue family label, e.g. "Green" */
  family: string;
  /** representative hex of the dominant family */
  familyHex: string;
  temperature: "warm" | "cool" | "balanced";
  value: "light" | "mid" | "dark";
  saturation: "muted" | "balanced" | "vivid";
  /** 0..1 share of near-neutral picks */
  neutralRatio: number;
  /** 2–3 sentence prose summary */
  description: string;
  /** short descriptor chips */
  traits: string[];
  /** the standout liked colours, deduped */
  palette: PaletteSwatch[];
  /** complementary / adjacent colours to explore next */
  suggestions: { name: string; hex: string; why: string }[];
};

/** One resolved pick per category — the heart of the client report. */
export type Selection = {
  category: string;
  title: string;
  kind: CategoryKind;
  src?: string;
  color?: string;
  note: string;
};

/** The client-ready finish report (results, not process). */
export type Brief = {
  style: string;
  confidence: number;
  summary: string;
  palette: PaletteSwatch[];
  selections: Selection[];
  notes: string[];
  /** colour-preference analysis — the automatic summary (see lib/analysis.ts) */
  profile?: ColourProfile;
};
