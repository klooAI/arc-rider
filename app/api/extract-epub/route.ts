// app/api/relevance/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type RelevanceRequest = {
  interest: string;
  pages: string[];   // pages or chapters
  offset?: number;   // in case you ever slice pages server-side
};

type RelevanceResult = {
  page: number;
  score: number;
  reason?: string;
};

// --- Helpers ---

function compressForEmbedding(txt: string): string {
  if (!txt) return "";
  let cleaned = txt.replace(/\s+/g, " ").trim();
  const MAX_CHARS = 4000;
  if (cleaned.length > MAX_CHARS) {
    cleaned = cleaned.slice(0, MAX_CHARS);
  }
  return cleaned;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    dot += x * y;
    normA += x * x;
    normB += y * y;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// --- POST handler ---

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RelevanceRequest;

    const interest = (body.interest || "").trim();
    const pages = Array.isArray(body.pages) ? body.pages : [];
    const offset = typeof body.offset === "number" ? body.offset : 0;

    if (!interest) {
      return NextResponse.json(
        { error: "Missing 'interest' in request body." },
        { status: 400 }
      );
    }

    if (!pages.length) {
      return NextResponse.json(
        { error: "Missing 'pages' array in request body." },
        { status: 400 }
      );
    }

    // 1) Prepare text for embeddings
    const cleanedPages = pages.map((p) => compressForEmbedding(p || ""));

    const embeddingInput = [interest, ...cleanedPages];

    // 2) Get embeddings for query + each page
    const embRes = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: embeddingInput,
    });

    const vectors = embRes.data.map((d) => d.embedding);
    const queryEmbedding = vectors[0];
    const pageEmbeddings = vectors.slice(1);

    // 3) Score each page by cosine similarity -> 0–100
    const scored: RelevanceResult[] = pageEmbeddings.map((emb, idx) => {
      const sim = cosineSimilarity(queryEmbedding, emb);
      // sim is roughly [-1, 1]; turn into [0, 100]
      const normScore = ((sim + 1) / 2) * 100;
      const score = Math.max(0, Math.min(100, normScore));
      return {
        page: idx + 1 + offset,
        score,
      };
    });

    // 4) Decide which pages are “worth showing” at all
    const topForReasons = scored
      .slice()
      .filter((r) => r.score >= 25) // rough relevance cutoff
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 24); // we only ask for reasons for the best few

    let reasonsByPage: Record<number, string> = {};

    if (topForReasons.length > 0) {
      const reasonPayload = topForReasons.map((r) => ({
        page: r.page,
        score: Math.round(r.score),
        text: cleanedPages[r.page - 1 - offset] || "",
      }));

      const completion = await client.chat.completions.create({
        model: "gpt-4.1-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `
You write very short, clear reasons why a given page from a document
is relevant to a user's question. One sentence per page. No fluff.
Return JSON like:
{ "reasons": [ { "page": number, "reason": string }, ... ] }.
          `.trim(),
          },
          {
            role: "user",
            content: `
User question:
${interest}

Here are some candidate pages with their scores and text.
For each, write ONE short sentence explaining why this page would help answer the user's question.

${JSON.stringify(reasonPayload, null, 2)}
          `.trim(),
          },
        ],
      });

      const raw = completion.choices?.[0]?.message?.content ?? "{}";
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.reasons)) {
          for (const r of parsed.reasons) {
            const p = Number(r.page);
            if (!Number.isNaN(p) && typeof r.reason === "string") {
              reasonsByPage[p] = r.reason.trim();
            }
          }
        }
      } catch (err) {
        console.error("Failed to parse reasons JSON:", err, raw);
      }
    }

    // 5) Final rankings: keep only reasonably relevant pages
    const rankings: RelevanceResult[] = scored
      .filter((r) => r.score >= 25) // this matches your frontend filter
      .map((r) => ({
        page: r.page,
        score: r.score,
        reason: reasonsByPage[r.page],
      }))
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

    return NextResponse.json({ rankings });
  } catch (err: any) {
    console.error("Error in /api/relevance:", err);
    return NextResponse.json(
      { error: err?.message || "Failed relevance scan." },
      { status: 500 }
    );
  }
}
