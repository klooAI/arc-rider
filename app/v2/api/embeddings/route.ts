import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { chunks } = await req.json();

    if (!Array.isArray(chunks) || chunks.length === 0) {
      return NextResponse.json({ error: "No chunks to embed" }, { status: 400 });
    }

    const batchSize = 100;
    const allEmbeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const truncatedBatch = batch.map((chunk: string) => chunk.slice(0, 6000));

      const response = await client.embeddings.create({
        model: "text-embedding-3-small",
        input: truncatedBatch,
      });

      const batchEmbeddings = response.data.map(d => d.embedding);
      allEmbeddings.push(...batchEmbeddings);
    }

    return NextResponse.json({ embeddings: allEmbeddings });
  } catch (err: any) {
    console.error("Embeddings error:", err);
    return NextResponse.json({ error: err?.message || "Failed to create embeddings" }, { status: 500 });
  }
}
