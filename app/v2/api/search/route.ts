import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function POST(req: NextRequest) {
  try {
    const { query, chunks, embeddings, pageMap } = await req.json();

    if (!query || typeof query !== "string") {
      return new Response(JSON.stringify({ error: "Query required" }), { status: 400 });
    }

    if (!Array.isArray(chunks) || !Array.isArray(embeddings)) {
      return new Response(JSON.stringify({ error: "Chunks and embeddings required" }), { status: 400 });
    }

    const pages: number[] = pageMap || chunks.map((_, i) => i + 1);

    const queryEmbeddingResponse = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: query.slice(0, 6000),
    });
    const queryEmbedding = queryEmbeddingResponse.data[0].embedding;

    const scored = chunks.map((text: string, idx: number) => ({
      chunkIndex: idx,
      text,
      score: cosineSimilarity(queryEmbedding, embeddings[idx]),
      page: pages[idx] || idx + 1,
    }));

    const topResults = scored
      .filter(r => r.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for (const result of topResults) {
          const data = JSON.stringify({ result });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          await new Promise(r => setTimeout(r, 30));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (err: any) {
    console.error("Search error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Search failed" }), { status: 500 });
  }
}
