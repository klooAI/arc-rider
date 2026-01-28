import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "No PDF file uploaded." }, { status: 400 });
    }

    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    const { text } = await extractText(uint8, { mergePages: false });
    const pages = text.map((p) => p.trim()).filter((p) => p.length > 0);

    if (pages.length === 0) {
      return NextResponse.json({ error: "No readable text found in PDF." }, { status: 400 });
    }

    const fullText = pages.join("\n\n");
    const chunks = smartChunk(fullText, 800);

    return NextResponse.json({ chunks });
  } catch (err: any) {
    console.error("PDF extract error:", err);
    return NextResponse.json({ error: err?.message || "Failed to extract PDF." }, { status: 500 });
  }
}

function smartChunk(text: string, targetSize: number): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 50);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    const cleaned = para.replace(/\s+/g, " ").trim();
    if (!cleaned) continue;

    if (current.length + cleaned.length > targetSize && current.length > 100) {
      chunks.push(current.trim());
      current = cleaned;
    } else {
      current += (current ? "\n\n" : "") + cleaned;
    }
  }

  if (current.trim().length > 50) {
    chunks.push(current.trim());
  }

  return chunks;
}
