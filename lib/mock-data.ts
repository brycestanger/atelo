import type { Brief, Category, Precedent, Project } from "@/lib/types";
import { CATALOG } from "@/lib/catalog";

const U = "https://images.unsplash.com/";

/** Build a sized Unsplash URL from a verified photo path. */
export function img(id: string, w = 900) {
  return `${U}${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/* Photo paths verified live from Unsplash search results — they resolve. */
export const CATEGORIES: Category[] = [
  { id: "exterior-colour", name: "Exterior Colour", kind: "swatch", count: 8 },
  { id: "countertops", name: "Countertops", kind: "photo", count: 14 },
  { id: "lighting", name: "Lighting", kind: "photo", count: 12 },
  { id: "tile", name: "Tile & Stone", kind: "photo", count: 16 },
  { id: "fixtures", name: "Fixtures", kind: "photo", count: 10 },
];

export const PRECEDENTS: Precedent[] = [
  // Exterior colour — swatches
  { id: "x1", categoryId: "exterior-colour", kind: "swatch", color: "#3B3E43", title: "Charcoal Slate", meta: "Matte · fibre cement" },
  { id: "x2", categoryId: "exterior-colour", kind: "swatch", color: "#8C9184", title: "Sage Stone", meta: "Textured render" },
  { id: "x3", categoryId: "exterior-colour", kind: "swatch", color: "#B26B47", title: "Warm Clay", meta: "Lime render" },
  { id: "x4", categoryId: "exterior-colour", kind: "swatch", color: "#E9E3D6", title: "Bone", meta: "Smooth stucco" },
  { id: "x5", categoryId: "exterior-colour", kind: "swatch", color: "#33423B", title: "Deep Forest", meta: "Timber stain" },
  { id: "x6", categoryId: "exterior-colour", kind: "swatch", color: "#4A4E54", title: "Graphite", meta: "Standing-seam metal" },
  { id: "x7", categoryId: "exterior-colour", kind: "swatch", color: "#9E4B3B", title: "Oxide Red", meta: "Through-body brick" },
  { id: "x8", categoryId: "exterior-colour", kind: "swatch", color: "#CBB99B", title: "Sand", meta: "Lime wash" },

  // Countertops
  { id: "co1", categoryId: "countertops", kind: "photo", src: img("photo-1541123437800-1bb1317badc2"), title: "Honed Carrara", meta: "Marble · soft matte" },
  { id: "co2", categoryId: "countertops", kind: "photo", src: img("photo-1610276099118-c929abaaa80a"), title: "Calacatta Gold", meta: "Marble · polished" },
  { id: "co3", categoryId: "countertops", kind: "photo", src: img("photo-1609766856939-5b5a934af3d5"), title: "Soapstone", meta: "Soft matte" },
  { id: "co4", categoryId: "countertops", kind: "photo", src: img("photo-1611095210561-67f0832b1ca3"), title: "Leathered Granite", meta: "Textured black" },
  { id: "co5", categoryId: "countertops", kind: "photo", src: img("photo-1616596612351-5a7ae04e2840"), title: "Quartz White", meta: "Engineered" },
  { id: "co6", categoryId: "countertops", kind: "photo", src: img("photo-1543503103-f94a0036ed9d"), title: "Butcher Block", meta: "White oak" },

  // Lighting
  { id: "li1", categoryId: "lighting", kind: "photo", src: img("photo-1540932239986-30128078f3c5"), title: "Opal Globe", meta: "Pendant · warm" },
  { id: "li2", categoryId: "lighting", kind: "photo", src: img("photo-1606170033648-5d55a3edf314"), title: "Brass Cone", meta: "Pendant · brass" },
  { id: "li3", categoryId: "lighting", kind: "photo", src: img("photo-1537739670075-76f02633de02"), title: "Linear Bar", meta: "LED · dimmable" },
  { id: "li4", categoryId: "lighting", kind: "photo", src: img("photo-1718221621618-e477ce33485a"), title: "Paper Lantern", meta: "Diffused glow" },
  { id: "li5", categoryId: "lighting", kind: "photo", src: img("photo-1758612798971-a8adb6cba7eb"), title: "Sculptural", meta: "Statement piece" },

  // Tile & Stone
  { id: "ti1", categoryId: "tile", kind: "photo", src: img("photo-1575255597430-eba71bc85bc9"), title: "Zellige White", meta: "Handmade · gloss" },
  { id: "ti2", categoryId: "tile", kind: "photo", src: img("photo-1614598632980-35ee54daa5b9"), title: "Terracotta", meta: "Matte clay" },
  { id: "ti3", categoryId: "tile", kind: "photo", src: img("photo-1580398562556-d33329a0f29b"), title: "Marble Herringbone", meta: "Honed" },
  { id: "ti4", categoryId: "tile", kind: "photo", src: img("photo-1615470144970-202c76387ba3"), title: "Encaustic", meta: "Patterned" },
  { id: "ti5", categoryId: "tile", kind: "photo", src: img("photo-1550820946-1c6f7b8e2030"), title: "Micro-cement", meta: "Seamless matte" },

  // Fixtures
  { id: "fi1", categoryId: "fixtures", kind: "photo", src: img("photo-1542020186-c952a6c4045a"), title: "Matte Black Tap", meta: "Brassware" },
  { id: "fi2", categoryId: "fixtures", kind: "photo", src: img("photo-1659455299116-af958bd906ab"), title: "Aged Brass", meta: "Warm mixer" },
  { id: "fi3", categoryId: "fixtures", kind: "photo", src: img("photo-1542855368-ca6ea825bca2"), title: "Brushed Nickel", meta: "Soft sheen" },
  { id: "fi4", categoryId: "fixtures", kind: "photo", src: img("photo-1613849925387-6e7f31f0cf40"), title: "Stone Basin", meta: "Vessel" },
  { id: "fi5", categoryId: "fixtures", kind: "photo", src: img("photo-1623111771733-d3ab4d26ce41"), title: "Wall-mount", meta: "Minimal spout" },
];

/** A diverse spread of real catalogue paint colours as swipeable swatches. */
export function catalogSwatches(limit = 28): Precedent[] {
  const paints = CATALOG.filter((c) => c.category === "paint" && c.hex);
  const step = Math.max(1, Math.floor(paints.length / limit));
  const picked: Precedent[] = [];
  for (let i = 0; i < paints.length && picked.length < limit; i += step) {
    const c = paints[i];
    picked.push({
      id: `cat-${c.id}`,
      categoryId: "exterior-colour",
      kind: "swatch",
      color: c.hex,
      title: c.name,
      meta: `${c.brand}${c.finish ? ` · ${c.finish}` : ""}`,
    });
  }
  return picked;
}

export function precedentsByCategory(categoryId: string): Precedent[] {
  // the colour category pulls from the real product catalogue
  if (categoryId === "exterior-colour") return catalogSwatches(28);
  return PRECEDENTS.filter((p) => p.categoryId === categoryId);
}

/** The little test deck on the landing page: exterior colour swatches. */
export const TEST_DECK = precedentsByCategory("exterior-colour");

export const PROJECTS: Project[] = [
  {
    id: "kerrisdale-kitchen",
    name: "Kerrisdale Kitchen",
    client: "The Laurents",
    status: "ready",
    updated: "Ready · Jun 28",
    categories: CATEGORIES,
    swipeProgress: 1,
  },
  {
    id: "west-end-refresh",
    name: "West End Condo Refresh",
    client: "M. Osei",
    status: "swiping",
    updated: "Client swiping · 2h ago",
    categories: CATEGORIES.slice(0, 4),
    swipeProgress: 0.6,
  },
  {
    id: "point-grey-build",
    name: "Point Grey New Build",
    client: "Harlow Group",
    status: "awaiting-client",
    updated: "Link sent · Jun 30",
    categories: CATEGORIES,
    swipeProgress: 0,
  },
  {
    id: "yaletown-loft",
    name: "Yaletown Loft",
    client: "K. Barnes",
    status: "synthesizing",
    updated: "Building report · just now",
    categories: CATEGORIES.slice(0, 3),
    swipeProgress: 1,
  },
  {
    id: "dunbar-bathroom",
    name: "Dunbar Bathroom",
    client: "—",
    status: "draft",
    updated: "Draft · Jun 24",
    categories: [],
    swipeProgress: 0,
  },
];

export const SAMPLE_BRIEF: Brief = {
  style: "Warm Contemporary",
  confidence: 0.94,
  summary:
    "Your client leans warm and tactile at every turn — a soft sage exterior, honed marble counters, aged-brass lighting, and matte-black fixtures. Nothing cold or high-gloss; each pick favours texture and warmth. This palette holds together across every room.",
  palette: [
    { name: "Sage Stone", hex: "#8C9184" },
    { name: "Bone", hex: "#E9E3D6" },
    { name: "Honed Marble", hex: "#D9D3C7" },
    { name: "Aged Brass", hex: "#A9793F" },
    { name: "Matte Black", hex: "#26241F" },
  ],
  selections: [
    { category: "Exterior Colour", title: "Sage Stone", kind: "swatch", color: "#8C9184", note: "Textured render, low-sheen" },
    { category: "Countertops", title: "Honed Carrara", kind: "photo", src: img("photo-1541123437800-1bb1317badc2"), note: "Matte marble, soft veining" },
    { category: "Lighting", title: "Brass Cone Pendant", kind: "photo", src: img("photo-1606170033648-5d55a3edf314"), note: "Warm brass, dimmable" },
    { category: "Tile & Stone", title: "Zellige White", kind: "photo", src: img("photo-1575255597430-eba71bc85bc9"), note: "Handmade gloss, backsplash" },
    { category: "Fixtures", title: "Matte Black Tap", kind: "photo", src: img("photo-1542020186-c952a6c4045a"), note: "Brassware, matte finish" },
  ],
  notes: [
    "Warm over cool at every turn",
    "Texture preferred to high gloss",
    "Metal accents: brass + matte black, never chrome",
    "One palette that reads across all rooms",
  ],
};
