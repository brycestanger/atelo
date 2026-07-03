"use client";

/**
 * ATELO — client-side dominant-colour extraction.
 *
 * The colour-analysis engine (lib/analysis.ts) reads taste from hex values.
 * Colour swatches carry a hex already; PHOTOS the architect uploads don't.
 * This samples a representative hex from any image on a tiny canvas so the
 * *same* instant, no-key analysis works on anything — uploaded countertops,
 * tile, lighting — not just colour fields.
 *
 * Saturation-weighted so we pick the finish's actual colour (the marble's warm
 * vein, the brass) rather than a blown-out white background, but with a neutral
 * floor so a genuinely tonal photo still resolves to its stone grey.
 */

const SAMPLE = 48; // downscaled grid — plenty for a dominant read, ~2k pixels

function toHex(r: number, g: number, b: number): string {
  const h = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

function sample(img: CanvasImageSource): string | null {
  if (typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE;
  canvas.height = SAMPLE;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
    const { data } = ctx.getImageData(0, 0, SAMPLE, SAMPLE);

    // Frequency × saturation buckets → the colour that actually carries the image.
    const buckets = new Map<
      string,
      { r: number; g: number; b: number; w: number; n: number }
    >();
    let avgR = 0;
    let avgG = 0;
    let avgB = 0;
    let count = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 125) continue; // skip transparent
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      avgR += r;
      avgG += g;
      avgB += b;
      count++;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const sat = max === 0 ? 0 : (max - min) / max;
      const weight = 0.12 + sat * sat; // chromatic pixels dominate; neutrals still count

      const key = `${r >> 5}-${g >> 5}-${b >> 5}`;
      const e = buckets.get(key);
      if (e) {
        e.r += r;
        e.g += g;
        e.b += b;
        e.w += weight;
        e.n++;
      } else {
        buckets.set(key, { r, g, b, w: weight, n: 1 });
      }
    }

    if (!count) return null;

    let best: { r: number; g: number; b: number; w: number; n: number } | null = null;
    for (const e of buckets.values()) if (!best || e.w > best.w) best = e;
    if (best) return toHex(best.r / best.n, best.g / best.n, best.b / best.n);
    return toHex(avgR / count, avgG / count, avgB / count);
  } catch {
    return null; // tainted canvas (CORS) — caller falls back gracefully
  }
}

/** Sample a colour from an already-loaded <img> element. */
export function dominantHexFromImage(el: HTMLImageElement): string | null {
  if (!el.naturalWidth) return null;
  return sample(el);
}

/** Sample a colour from a File (a fresh upload) — resolves null if it can't decode. */
export function dominantHexFromFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const hex = sample(img);
      URL.revokeObjectURL(url);
      resolve(hex);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

/** Sample a colour from a remote image URL (needs CORS — Unsplash + Supabase allow it). */
export function dominantHexFromUrl(src: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(sample(img));
    img.onerror = () => resolve(null);
    img.src = src;
  });
}
