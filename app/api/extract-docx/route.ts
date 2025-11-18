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

    // Read the uploaded DOCX into a Buffer
    const blob = file as Blob;
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

    // Fake "pages" by chunking text so your existing UI still works
    const chunkSize = 2000; // chars per page-ish
    const pages: string[] = [];
    for (let i = 0; i < fullText.length; i += chunkSize) {
      pages.push(fullText.slice(i, i + chunkSize));
    }

    return NextResponse.json(
      {
        text: fullText,
        pages,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("DOCX extract error:", err);
    return NextResponse.json(
      { error: "Failed to extract DOCX file." },
      { status: 500 }
    );
  }
}
