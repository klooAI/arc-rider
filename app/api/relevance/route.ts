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

// FAST MODE → tighter compression
function compressPage(txt: string, maxChars = 600): string {
  if (!txt) return "";
  let out = txt.replace(/\s+/g, " ").trim();
  if (out.length > maxChars) out = out.slice(0, maxChars);
  return out;
}

// FAST MODE → bigger batches
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

    if (!interest || !Array.isArray(pages)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const pageObjects = pages.map((text: string, idx: number) => ({
      page: idx + 1,
      text: compressPage(text || ""),
    }));

    const rubric = `
Use this relevance scoring system:

90–100 = strong direct match
70–89 = indirect meaningful match
40–69 = weak / tangential match
0–39  = not relevant

Base everything strictly on the provided text.
`.trim();

    const systemPrompt = `
You return ONLY valid JSON:

{
  "rankings": [
    { "page": number, "score": number, "reason": "short reason" }
  ]
}
`.trim();

    const allRankings: RelevanceResult[] = [];

    // FAST MODE: large batches
    const batches = chunkArray(pageObjects, 40);

    for (const batch of batches) {
      const userPayload = {
        topic: interest,
        rubric,
        pages: batch,
      };

      let content: string | null = null;

      // ---------- PRIMARY MODEL: GPT-5.1 (FAST MODE) ----------
      try {
        const completion = await client.chat.completions.create({
          model: "gpt-5.1",
          reasoning_effort: "none", // ⚡ FASTEST MODE
          max_completion_tokens: 2000,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            {
              role: "user",
              content:
                "Score each page using the rubric. Return ONLY the JSON.\n\n" +
                JSON.stringify(userPayload),
            },
          ],
        });

        content = completion.choices[0]?.message?.content ?? null;
      } catch (err) {
        console.error("gpt-5.1 fast call failed, falling back:", err);
        content = null;
      }

      // ---------- FALLBACK: gpt-4o-mini (stable, fast) ----------
      if (!content) {
        try {
          console.error(
            "gpt-5.1 returned empty. Using gpt-4o-mini fallback for this batch."
          );

          const fallback = await client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0,
            max_tokens: 1000,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: systemPrompt },
              {
                role: "user",
                content:
                  "Score each page using the rubric. Return ONLY the JSON.\n\n" +
                  JSON.stringify(userPayload),
              },
            ],
          });

          content = fallback.choices[0]?.message?.content ?? null;
        } catch (fallbackErr) {
          console.error("Fallback model failed:", fallbackErr);
          return NextResponse.json(
            { error: "Relevance failed (both models)." },
            { status: 500 }
          );
        }
      }

      if (!content) {
        return NextResponse.json(
          { error: "Relevance model returned no content." },
          { status: 500 }
        );
      }

      // ---------- PARSE ----------
      let parsed: { rankings?: any[] };
      try {
        parsed = JSON.parse(content);
      } catch (err) {
        console.error("JSON parse failure:", content);
        return NextResponse.json(
          { error: "Failed to parse relevance output." },
          { status: 500 }
        );
      }

      const rawRankings = Array.isArray(parsed.rankings)
        ? parsed.rankings
        : [];

      const rankings: RelevanceResult[] = rawRankings.map((r, idx) => {
        const page =
          typeof r.page === "number"
            ? r.page
            : batch[idx]?.page ?? idx + 1;

        const numericScore = Number(r.score);
        const safeScore = Number.isNaN(numericScore)
          ? 0
          : numericScore;

        return {
          page,
          score: safeScore,
          reason: r.reason?.trim?.() || "",
        };
      });

      allRankings.push(...rankings);
    }

    return NextResponse.json({ rankings: allRankings });
  } catch (err: any) {
    console.error("Relevance route error:", err);
    return NextResponse.json(
      { error: err?.message || "Server error." },
      { status: 500 }
    );
  }
}
