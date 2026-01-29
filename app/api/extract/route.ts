// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No PDF file uploaded." },
        { status: 400 }
      );
    }

    // Check file size (max 200MB)
    const MAX_SIZE = 200 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 200MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Extract text with pages separated
    const { text } = await extractText(uint8, {
      mergePages: false,
    });

    // text is string[] when mergePages: false
    const pages = text.map((p) => p.trim()).filter((p) => p.length > 0);
    
    if (pages.length === 0) {
      return NextResponse.json(
        { error: "No readable text found in PDF. The file may be image-based or corrupted." },
        { status: 400 }
      );
    }

    const fullText = pages.join("\n\n").trim();

    return NextResponse.json({
      text: fullText,
      pages,
    });
  } catch (err) {
    console.error("PDF extract error:", err);

    const message = err instanceof Error
      ? err.message
      : "Failed to extract text from PDF.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
