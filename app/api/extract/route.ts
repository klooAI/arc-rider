// app/api/extract/route.ts
import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs"; // ensure Node runtime

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

    // Blob -> Uint8Array for unpdf
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // Keep pages separate so relevance can work per page
    // When mergePages: false, extractText returns { totalPages: number; text: string[] }
    // The 'text' property IS the array of page texts (no separate 'pages' property)
    const { text } = await extractText(uint8, {
      mergePages: false,
    });

    // text is guaranteed to be string[] when mergePages: false
    const pages = text.map((p) => p.trim());
    const fullText = pages.join("\n\n").trim();

    return NextResponse.json({
      text: fullText || "(No text found in PDF)",
      pages,
    });
  } catch (err) {
    console.error("PDF extract error:", err);

    const message =
      err instanceof Error
        ? err.message
        : "Failed to extract text from the PDF.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
