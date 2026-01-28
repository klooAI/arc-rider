// app/api/relevance/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type RelevanceResult = {
  page: number;
  score: number;
  reason?: string;
};

// Compress page text while preserving meaning - more generous limit for semantic understanding
function compressPage(txt: string, maxChars = 1500): string {
  if (!txt) return "";
  let out = txt.replace(/\s+/g, " ").trim();
  if (out.length > maxChars) {
    // Try to cut at a sentence boundary
    const truncated = out.slice(0, maxChars);
    const lastPeriod = truncated.lastIndexOf(". ");
    if (lastPeriod > maxChars * 0.7) {
      out = truncated.slice(0, lastPeriod + 1);
    } else {
      out = truncated + "...";
    }
  }
  return out;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const { interest, pages } = await req.json();

    if (!interest || typeof interest !== "string" || !interest.trim()) {
      return NextResponse.json(
        { error: "Please describe what you're looking for." },
        { status: 400 }
      );
    }

    if (!Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { error: "No pages to analyze. Please extract a document first." },
        { status: 400 }
      );
    }

    const pageObjects = pages.map((text: string, idx: number) => ({
      page: idx + 1,
      text: compressPage(text || ""),
    }));

    // Enhanced prompt for semantic understanding (critical requirement from spec)
    const systemPrompt = `You are an expert document analyst. Your task is to score how relevant each page/section is to a user's topic of interest.

CRITICAL: Use SEMANTIC understanding, not keyword matching.
- "Buying a house" matches content about mortgages, deposits, property ownership, first-home buyers, home loans
- "Getting promoted" matches content about career progression, performance reviews, leadership development
- "Saving money" matches content about budgeting, spending habits, expense tracking, financial discipline

SCORING RUBRIC (be strict and consistent):
90-100: Strong direct match - The page directly addresses the user's topic with substantial, actionable content
70-89: Indirect meaningful match - The page discusses related concepts that would help understand the topic
40-69: Weak/tangential match - Brief mentions or loosely related content
0-39: Not relevant - No meaningful connection to the topic

For each relevant page (score >= 40), provide a ONE SENTENCE reason explaining WHY it's relevant to the user's specific interest. Be specific, not generic.

Return ONLY valid JSON in this exact format:
{
  "rankings": [
    { "page": 1, "score": 85, "reason": "Explains the psychology of impulse spending and how to build awareness around triggers." },
    { "page": 3, "score": 42, "reason": "Brief mention of budget categories in a broader discussion of financial planning." }
  ]
}

Include ALL pages in your response, even those with score 0.`;

    // Process in batches of 20 pages - run ALL batches in PARALLEL for speed
    const batches = chunkArray(pageObjects, 20);

    // Process all batches concurrently
    const batchPromises = batches.map(async (batch) => {
      const userPayload = {
        userInterest: interest,
        pages: batch.map(p => ({ page: p.page, content: p.text })),
      };

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `User is interested in: "${interest}"

Analyze each page and score its relevance to this topic. Remember to use semantic understanding - match concepts, not just keywords.

${JSON.stringify(userPayload.pages, null, 2)}`,
          },
        ],
      });

      const content = completion.choices[0]?.message?.content ?? null;
      if (!content) {
        throw new Error("No response from analysis");
      }

      const parsed = JSON.parse(content);
      const rawRankings = Array.isArray(parsed.rankings) ? parsed.rankings : [];

      return rawRankings.map((r: any, idx: number) => {
        const page = typeof r.page === "number" ? r.page : batch[idx]?.page ?? idx + 1;
        const numericScore = Number(r.score);
        const safeScore = Number.isNaN(numericScore) ? 0 : Math.max(0, Math.min(100, numericScore));

        return {
          page,
          score: safeScore,
          reason: typeof r.reason === "string" ? r.reason.trim() : "",
        };
      });
    });

    let allRankings: RelevanceResult[];
    try {
      const batchResults = await Promise.all(batchPromises);
      allRankings = batchResults.flat();
    } catch (err) {
      console.error("GPT-4o-mini call failed:", err);
      return NextResponse.json(
        { error: "Failed to analyze document. Please try again." },
        { status: 500 }
      );
    }

    // Sort by score descending
    allRankings.sort((a, b) => b.score - a.score);

    return NextResponse.json({ rankings: allRankings });
  } catch (err: any) {
    console.error("Relevance route error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to analyze document." },
      { status: 500 }
    );
  }
}
