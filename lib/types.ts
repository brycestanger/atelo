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
};
