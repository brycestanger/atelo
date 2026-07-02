import type { Brief, Category, Precedent, Project } from "@/lib/types";

const U = "https://images.unsplash.com/";

/** Build a sized Unsplash URL from a verified photo path. */
export function img(id: string, w = 900) {
  return `${U}${id}?auto=format&fit=crop&w=${w}&q=80`;
}

/* Photo paths verified live from the Unsplash search DOM — they resolve. */
const EXT = [
  "photo-1715760374522-a609a0c2f65e",
  "photo-1593503739294-e5dc3afa8835",
  "photo-1754409410155-2079b647f00e",
  "photo-1627227117979-941ae684786a",
  "photo-1563874093519-ca5eda5cd776",
  "photo-1515713519566-6f9bf3b4a07a",
  "photo-1533541268314-af6680461b41",
];
const INT = [
  "photo-1711873316332-acb6930211e1",
  "photo-1646328410611-f28e81a96eb5",
  "photo-1651342489644-be11c7ee318d",
  "photo-1567016376408-0226e4d0c1ea",
  "photo-1483366774565-c783b9f70e2c",
  "photo-1542287343796-5bc81a6df440",
  "photo-1520529890308-f503006340b4",
];

export const CATEGORIES: Category[] = [
  { id: "exterior", name: "Exterior Massing", count: 24 },
  { id: "interior", name: "Interior Finishes", count: 31 },
  { id: "structure", name: "Structural Detail", count: 18 },
];

export const PRECEDENTS: Precedent[] = [
  { id: "e1", categoryId: "exterior", src: img(EXT[0]), title: "Stacked CLT volumes", meta: "CLT + glulam · exposed soffit", location: "Vancouver, BC" },
  { id: "e2", categoryId: "exterior", src: img(EXT[1]), title: "Charred cedar rainscreen", meta: "Shou sugi ban · vertical batten", location: "Portland, OR" },
  { id: "e3", categoryId: "exterior", src: img(EXT[2]), title: "Timber lattice canopy", meta: "Parametric glulam · daylight", location: "Oslo, NO" },
  { id: "e4", categoryId: "exterior", src: img(EXT[3]), title: "Board-formed concrete base", meta: "Concrete + timber upper", location: "Kyoto, JP" },
  { id: "e5", categoryId: "exterior", src: img(EXT[4]), title: "Cantilevered mass", meta: "Steel moment frame · timber clad", location: "Aspen, CO" },
  { id: "e6", categoryId: "exterior", src: img(EXT[5]), title: "Gabled timber pavilion", meta: "Exposed ridge beam", location: "Bregenz, AT" },
  { id: "e7", categoryId: "exterior", src: img(EXT[6]), title: "Slatted screen facade", meta: "Oak brise-soleil", location: "Melbourne, AU" },

  { id: "i1", categoryId: "interior", src: img(INT[0]), title: "Travertine + oak kitchen", meta: "Warm minimal · monolithic island", location: "—" },
  { id: "i2", categoryId: "interior", src: img(INT[1]), title: "Exposed soffit living", meta: "CLT ceiling · lime plaster", location: "—" },
  { id: "i3", categoryId: "interior", src: img(INT[2]), title: "Plaster + timber threshold", meta: "Tadelakt · white oak", location: "—" },
  { id: "i4", categoryId: "interior", src: img(INT[3]), title: "Sculptural stair void", meta: "Blackened steel · oak tread", location: "—" },
  { id: "i5", categoryId: "interior", src: img(INT[4]), title: "Daylit gallery hall", meta: "Microcement · clerestory", location: "—" },
  { id: "i6", categoryId: "interior", src: img(INT[5]), title: "Stone hearth wall", meta: "Split-face limestone", location: "—" },
  { id: "i7", categoryId: "interior", src: img(INT[6]), title: "Joinery-wrapped study", meta: "Full-height rift oak", location: "—" },
];

export function precedentsByCategory(categoryId: string): Precedent[] {
  return PRECEDENTS.filter((p) => p.categoryId === categoryId);
}

export const PROJECTS: Project[] = [
  {
    id: "harbourfront-residence",
    name: "Harbourfront Residence",
    client: "K. Merrin",
    status: "ready",
    updated: "Ready · Jun 28",
    categories: CATEGORIES,
    swipeProgress: 1,
  },
  {
    id: "gastown-loft",
    name: "Gastown Loft Conversion",
    client: "Foundry Dev Co.",
    status: "swiping",
    updated: "Client swiping · 2h ago",
    categories: CATEGORIES.slice(0, 2),
    swipeProgress: 0.58,
  },
  {
    id: "coastal-retreat",
    name: "Coastal Mass-Timber Retreat",
    client: "The Alderman Group",
    status: "awaiting-client",
    updated: "Link sent · Jun 30",
    categories: CATEGORIES,
    swipeProgress: 0,
  },
  {
    id: "mount-pleasant-studio",
    name: "Mount Pleasant Studio",
    client: "Rho & Partners",
    status: "synthesizing",
    updated: "Synthesizing · just now",
    categories: CATEGORIES.slice(0, 2),
    swipeProgress: 1,
  },
  {
    id: "cambie-infill",
    name: "Cambie Corridor Infill",
    client: "—",
    status: "draft",
    updated: "Draft · Jun 24",
    categories: [],
    swipeProgress: 0,
  },
];

export const SAMPLE_BRIEF: Brief = {
  style: "Warm Tectonic Minimalism",
  confidence: 0.92,
  summary:
    "The client consistently strikes toward exposed mass-timber structure softened by tactile, honest finishes. Massing is calm and orthogonal; warmth is carried by material, not ornament. Blackened metal appears as a precise accent, never a field.",
  materials: [
    { name: "Cross-laminated timber", pct: 38 },
    { name: "Board-formed concrete", pct: 22 },
    { name: "Travertine", pct: 14 },
    { name: "Blackened steel", pct: 12 },
    { name: "Rift white oak", pct: 9 },
    { name: "Glass", pct: 5 },
  ],
  palette: [
    { name: "Timber", hex: "#B8895A" },
    { name: "Bone", hex: "#EDE8DF" },
    { name: "Char", hex: "#211D1A" },
    { name: "Signal", hex: "#FF4F00" },
    { name: "Slate", hex: "#6B6F73" },
  ],
  themes: [
    "Exposed structure as ornament",
    "Warm minimalism",
    "Indoor–outdoor threshold",
    "Craft-forward joinery",
    "Daylight-driven massing",
  ],
  winners: [PRECEDENTS[0], PRECEDENTS[7], PRECEDENTS[10]],
};
