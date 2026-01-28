import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { texts, query } = await req.json();

    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "No texts to summarize" }, { status: 400 });
    }

    const combinedText = texts.slice(0, 10).join("\n\n---\n\n");
    const truncated = combinedText.slice(0, 12000);

    const systemPrompt = query
      ? `You are an expert at summarizing documents. The user is specifically interested in: "${query}". 
         Focus your summary on information relevant to their interest. Be concise but comprehensive.
         Use bullet points for key takeaways. Write in plain language.`
      : `You are an expert at summarizing documents. Be concise but comprehensive.
         Use bullet points for key takeaways. Write in plain language.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 1500,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Please summarize the following relevant sections from a document:\n\n${truncated}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ summary });
  } catch (err: any) {
    console.error("Summary error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate summary" }, { status: 500 });
  }
}
