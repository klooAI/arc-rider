// app/api/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type SummaryBody =
  | { mode: "full"; docPages: string[] }
  | { mode: "pages"; selectedPages: string[] };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SummaryBody>;

    let pages: string[] = [];

    if (body.mode === "full") {
      if (!Array.isArray(body.docPages) || body.docPages.length === 0) {
        return NextResponse.json(
          { error: "docPages must be a non-empty array when mode is 'full'." },
          { status: 400 }
        );
      }
      pages = body.docPages;
    } else if (body.mode === "pages") {
      if (
        !Array.isArray(body.selectedPages) ||
        body.selectedPages.length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "selectedPages must be a non-empty array when mode is 'pages'.",
          },
          { status: 400 }
        );
      }
      pages = body.selectedPages;
    } else {
      return NextResponse.json(
        { error: "Invalid mode. Expected 'full' or 'pages'." },
        { status: 400 }
      );
    }

    const joined = pages.join("\n\n");

    const prompt = `
You will summarise book / document content.

RULES:
- At the top, output a section titled "TL;DR" with 3–8 short bullet points.
- After that, output a section titled "Summary".
- The full summary must be equivalent to **no more than ~20 pages** of text.
- Focus on the core ideas, main arguments, key events, and important insights.
- Write in clear, modern, easy-to-understand English.
- Avoid flowery language or filler.
- Do NOT just give a plot synopsis; capture the *meaning* and *concepts*.

Text to summarise:

${joined}
`.trim();

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.35,
    });

    const summary = res.choices[0]?.message?.content || "";

    return NextResponse.json({ summary });
  } catch (err) {
    console.error("Summary API error:", err);
    return NextResponse.json(
      { error: "Failed to generate summary." },
      { status: 500 }
    );
  }
}
