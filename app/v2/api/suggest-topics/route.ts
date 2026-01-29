import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, sampleText } = await req.json();

    if (!fileName && !sampleText) {
      return NextResponse.json({ error: "Missing fileName or sampleText" }, { status: 400 });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 60,
      messages: [
        {
          role: "system",
          content: "Based on the book title and sample text, suggest 3 short search topics (2-4 words each) that a reader might want to find in this book. Output only the topics separated by commas, nothing else. Be specific to this book's themes.",
        },
        {
          role: "user",
          content: `Book: ${fileName}\n\nSample: ${sampleText?.slice(0, 1500) || ""}`,
        },
      ],
    });

    const suggestions = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ suggestions });
  } catch (err: any) {
    console.error("Suggest topics error:", err);
    return NextResponse.json({ suggestions: "" });
  }
}
