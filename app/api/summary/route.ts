// app/api/summary/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

type SummaryBody =
  | { mode: "full"; docPages: string[]; interest?: string }
  | { mode: "pages"; selectedPages: string[]; interest?: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<SummaryBody>;

    let pages: string[] = [];
    const interest = typeof body.interest === "string" ? body.interest.trim() : "";

    if (body.mode === "full") {
      if (!Array.isArray(body.docPages) || body.docPages.length === 0) {
        return NextResponse.json(
          { error: "No pages to summarize. Please extract a document first." },
          { status: 400 }
        );
      }
      pages = body.docPages;
    } else if (body.mode === "pages") {
      if (!Array.isArray(body.selectedPages) || body.selectedPages.length === 0) {
        return NextResponse.json(
          { error: "No pages selected for summary." },
          { status: 400 }
        );
      }
      pages = body.selectedPages;
    } else {
      return NextResponse.json(
        { error: "Invalid summary mode." },
        { status: 400 }
      );
    }

    const joined = pages.join("\n\n---\n\n");
    
    // Character limit to avoid token overflow
    const maxChars = 80000;
    const truncatedContent = joined.length > maxChars 
      ? joined.slice(0, maxChars) + "\n\n[Content truncated due to length...]"
      : joined;

    // Build a focused prompt based on whether user has an interest
    let prompt: string;
    
    if (interest) {
      prompt = `You are summarizing specific sections of a document that are relevant to the user's interest.

USER'S INTEREST: "${interest}"

INSTRUCTIONS:
1. Start with a "TL;DR" section containing 3-6 bullet points that directly address what the user cares about
2. Follow with a detailed "Summary" section
3. Focus specifically on content related to "${interest}" - extract insights, advice, key concepts, and actionable information
4. Write in clear, modern English - avoid jargon and filler
5. Be concise but comprehensive - capture the meaning and practical value
6. If the content discusses related topics (e.g., if interest is "saving money" include content about budgeting, spending habits, etc.)

CONTENT TO SUMMARIZE:

${truncatedContent}`;
    } else {
      prompt = `You are summarizing a document or selection of pages.

INSTRUCTIONS:
1. Start with a "TL;DR" section containing 3-8 bullet points capturing the main ideas
2. Follow with a detailed "Summary" section
3. Focus on core ideas, main arguments, key events, and important insights
4. Write in clear, modern English - avoid flowery language or filler
5. Don't just give a plot synopsis - capture the meaning and concepts
6. The summary should be comprehensive but digestible

CONTENT TO SUMMARIZE:

${truncatedContent}`;
    }

    const res = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const summary = res.choices[0]?.message?.content || "";

    if (!summary.trim()) {
      return NextResponse.json(
        { error: "Failed to generate summary. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Summary API error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to generate summary." },
      { status: 500 }
    );
  }
}
