import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs";

type ChunkWithPage = {
  text: string;
  page: number;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No PDF file uploaded." }, { status: 400 });
    }

    const MAX_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 200MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const { text } = await extractText(uint8, { mergePages: false });
    const pages = text.map((p) => p.trim());

    if (pages.every(p => p.length === 0)) {
      return NextResponse.json({ error: "No readable text found in PDF." }, { status: 400 });
    }

    const chunksWithPages = smartChunkWithPages(pages, 800);

    return NextResponse.json({ 
      chunks: chunksWithPages.map(c => c.text),
      pageMap: chunksWithPages.map(c => c.page),
      totalPages: pages.length 
    });
  } catch (err: any) {
    console.error("PDF extract error:", err);
    return NextResponse.json({ error: err?.message || "Failed to extract PDF." }, { status: 500 });
  }
}

function smartChunkWithPages(pages: string[], targetSize: number): ChunkWithPage[] {
  const chunks: ChunkWithPage[] = [];

  for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
    const pageText = pages[pageIdx];
    if (!pageText || pageText.length < 50) continue;

    const pageNum = pageIdx + 1;
    const paragraphs = pageText.split(/\n\s*\n/).filter(p => p.trim().length > 30);

    let current = "";
    for (const para of paragraphs) {
      const cleaned = para.replace(/\s+/g, " ").trim();
      if (!cleaned) continue;

      if (current.length + cleaned.length > targetSize && current.length > 100) {
        chunks.push({ text: current.trim(), page: pageNum });
        current = cleaned;
      } else {
        current += (current ? "\n\n" : "") + cleaned;
      }
    }

    if (current.trim().length > 50) {
      chunks.push({ text: current.trim(), page: pageNum });
    }
  }

  return chunks;
}
