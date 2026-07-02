/** ATELO domain types — see PRODUCT.md for the funnel these model. */

export type ProjectStatus =
  | "draft"
  | "awaiting-client"
  | "swiping"
  | "synthesizing"
  | "ready";

export type Category = {
  id: string;
  name: string;
  /** number of precedents the architect loaded into this category */
  count: number;
};

export type Precedent = {
  id: string;
  title: string;
  categoryId: string;
  /** image url */
  src: string;
  /** short technical caption, e.g. "CLT + glulam · exposed" */
  meta: string;
  location?: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  /** absolute, human-readable last-touched label */
  updated: string;
  categories: Category[];
  /** 0..1 — how far the client has moved through the deck */
  swipeProgress: number;
};

export type Material = { name: string; pct: number };

export type PaletteSwatch = { name: string; hex: string };

/** The structured brief the AI returns (Gemini native JSON). */
export type Brief = {
  style: string;
  confidence: number;
  summary: string;
  materials: Material[];
  palette: PaletteSwatch[];
  themes: string[];
  winners: Precedent[];
};
