import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No DOCX file uploaded." }, { status: 400 });
    }

    const blob = file as Blob;
    const MAX_SIZE = 100 * 1024 * 1024;
    if (blob.size > MAX_SIZE) {
      return NextResponse.json({ error: "This file is too large. Please upload a file under 100MB." }, { status: 400 });
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await mammoth.extractRawText({ buffer });
    const fullText = result.value || "";
    const chunks = smartChunk(fullText, 800);

    return NextResponse.json({ 
      chunks,
      pageMap: chunks.map((_, i) => i + 1),
      totalPages: chunks.length,
      docType: "docx"
    });
  } catch (err: any) {
    console.error("DOCX extract error:", err);
    return NextResponse.json({ error: err?.message || "Failed to extract DOCX." }, { status: 500 });
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
