import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export const runtime = "nodejs";

function htmlToText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No EPUB file uploaded." }, { status: 400 });
    }

    const blob = file as Blob;
    const MAX_SIZE = 50 * 1024 * 1024;
    if (blob.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 50MB." }, { status: 400 });
    }

    const arrayBuffer = await blob.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const containerXml = await zip.file("META-INF/container.xml")?.async("string");
    if (!containerXml) {
      return NextResponse.json({ error: "Invalid EPUB: missing container.xml" }, { status: 400 });
    }

    const opfMatch = containerXml.match(/full-path="([^"]+)"/);
    if (!opfMatch) {
      return NextResponse.json({ error: "Invalid EPUB: cannot find content path" }, { status: 400 });
    }

    const opfPath = opfMatch[1];
    const opfDir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
    const opfContent = await zip.file(opfPath)?.async("string");
    if (!opfContent) {
      return NextResponse.json({ error: "Invalid EPUB: cannot read content file" }, { status: 400 });
    }

    const manifest: Record<string, string> = {};
    const manifestRegex = /<item[^>]+id="([^"]+)"[^>]+href="([^"]+)"[^>]*>/gi;
    let match;
    while ((match = manifestRegex.exec(opfContent)) !== null) {
      manifest[match[1]] = match[2];
    }

    const manifestRegex2 = /<item[^>]+href="([^"]+)"[^>]+id="([^"]+)"[^>]*>/gi;
    while ((match = manifestRegex2.exec(opfContent)) !== null) {
      manifest[match[2]] = match[1];
    }

    const spineItems: string[] = [];
    const spineRegex = /<itemref[^>]+idref="([^"]+)"[^>]*>/gi;
    while ((match = spineRegex.exec(opfContent)) !== null) {
      spineItems.push(match[1]);
    }

    if (spineItems.length === 0) {
      return NextResponse.json({ error: "Invalid EPUB: no readable content" }, { status: 400 });
    }

    const allText: string[] = [];

    for (const itemId of spineItems) {
      const href = manifest[itemId];
      if (!href) continue;

      const fullPath = href.startsWith("/") ? href.slice(1) : opfDir + href;
      try {
        const content = await zip.file(fullPath)?.async("string");
        if (content) {
          const plainText = htmlToText(content);
          if (plainText.length > 100) {
            allText.push(plainText);
          }
        }
      } catch {}
    }

    const combinedText = allText.join("\n\n");
    const chunks = smartChunk(combinedText, 800);

    return NextResponse.json({ chunks });
  } catch (err: any) {
    console.error("EPUB extract error:", err);
    return NextResponse.json({ error: err?.message || "Failed to extract EPUB." }, { status: 500 });
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
