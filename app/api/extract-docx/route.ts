// app/api/extract-docx/route.ts
import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No DOCX file uploaded." },
        { status: 400 }
      );
    }

    const blob = file as Blob;
    
    // Check file size (max 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (blob.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use mammoth to extract the raw text
    const result = await mammoth.extractRawText({ buffer });
    const fullText = (result.value || "").trim();

    if (!fullText) {
      return NextResponse.json(
        { error: "No text content found in DOCX file." },
        { status: 400 }
      );
    }

    // Split into "pages" by paragraph breaks or fixed size for consistency
    // Try to split on double newlines first (paragraph breaks)
    let pages: string[] = [];
    const paragraphs = fullText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length > 10) {
      // If we have many paragraphs, group them into logical chunks
      const targetChunkSize = 2500; // chars per "page"
      let currentChunk = "";
      
      for (const para of paragraphs) {
        if (currentChunk.length + para.length > targetChunkSize && currentChunk.length > 500) {
          pages.push(currentChunk.trim());
          currentChunk = para;
        } else {
          currentChunk += (currentChunk ? "\n\n" : "") + para;
        }
      }
      
      if (currentChunk.trim()) {
        pages.push(currentChunk.trim());
      }
    } else {
      // Few paragraphs - just chunk by character count
      const chunkSize = 2500;
      for (let i = 0; i < fullText.length; i += chunkSize) {
        const chunk = fullText.slice(i, i + chunkSize).trim();
        if (chunk.length > 0) {
          pages.push(chunk);
        }
      }
    }

    if (pages.length === 0) {
      pages = [fullText];
    }

    return NextResponse.json({
      text: fullText,
      pages,
    });
  } catch (err) {
    console.error("DOCX extract error:", err);
    
    const message = err instanceof Error ? err.message : "Failed to extract DOCX file.";
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
