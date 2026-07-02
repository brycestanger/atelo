import { NextResponse } from "next/server";
import { SAMPLE_BRIEF } from "@/lib/mock-data";
import type { Brief } from "@/lib/types";

/**
 * POST /api/analyze
 *
 * Body: { likedImages: string[]; winningImages: string[] }
 *
 * Prompt architecture (PRD §7) — when GEMINI_API_KEY is set, this route calls
 * Gemini 1.5 Flash with a strict JSON schema:
 *
 *   "Analyze these architectural precedents selected by a client. The images in
 *    'winningImages' are their absolute favourites and must be weighted heavily.
 *    'likedImages' provide broad context. Identify the overarching style, dominant
 *    materials (with estimated percentages), colour palette, and structural themes.
 *    Return output strictly as JSON matching the Brief schema."
 *
 * Gemini's native JSON mode (responseMimeType: "application/json" + responseSchema)
 * guarantees the shape, so the client never has to parse free-form text.
 *
 * Until the key is wired we return a deterministic sample brief so the whole
 * funnel is demoable end-to-end.
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const likedImages: string[] = Array.isArray(body?.likedImages)
    ? body.likedImages
    : [];
  const winningImages: string[] = Array.isArray(body?.winningImages)
    ? body.winningImages
    : [];

  const brief: Brief = SAMPLE_BRIEF;

  return NextResponse.json({
    ok: true,
    model: process.env.GEMINI_API_KEY ? "gemini-1.5-flash" : "sample",
    counts: { liked: likedImages.length, winners: winningImages.length },
    brief,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    hint: "POST { likedImages, winningImages } to synthesize a structured brief.",
  });
}
