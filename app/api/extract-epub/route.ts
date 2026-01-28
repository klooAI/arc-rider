// app/api/extract-epub/route.ts
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export const runtime = "nodejs";

// Strip HTML tags and decode entities
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

// Extract title from HTML content
function extractTitle(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) return htmlToText(titleMatch[1]);
  
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) return htmlToText(h1Match[1]);
  
  const h2Match = html.match(/<h2[^>]*>([^<]+)<\/h2>/i);
  if (h2Match) return htmlToText(h2Match[1]);
  
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No EPUB file uploaded." },
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
    
    // Load the EPUB as a ZIP file
    const zip = await JSZip.loadAsync(arrayBuffer);

    // Find and parse container.xml to get the OPF file path
    const containerXml = await zip.file("META-INF/container.xml")?.async("string");
    if (!containerXml) {
      return NextResponse.json(
        { error: "Invalid EPUB file: missing container.xml" },
        { status: 400 }
      );
    }

    // Extract OPF path
    const opfMatch = containerXml.match(/full-path="([^"]+)"/);
    if (!opfMatch) {
      return NextResponse.json(
        { error: "Invalid EPUB file: cannot find content path" },
        { status: 400 }
      );
    }

    const opfPath = opfMatch[1];
    const opfDir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
    
    // Read and parse the OPF file
    const opfContent = await zip.file(opfPath)?.async("string");
    if (!opfContent) {
      return NextResponse.json(
        { error: "Invalid EPUB file: cannot read content file" },
        { status: 400 }
      );
    }

    // Extract manifest items (maps id to href)
    const manifest: Record<string, string> = {};
    const manifestRegex = /<item[^>]+id="([^"]+)"[^>]+href="([^"]+)"[^>]*>/gi;
    let match;
    while ((match = manifestRegex.exec(opfContent)) !== null) {
      manifest[match[1]] = match[2];
    }

    // Also try alternate order (href before id)
    const manifestRegex2 = /<item[^>]+href="([^"]+)"[^>]+id="([^"]+)"[^>]*>/gi;
    while ((match = manifestRegex2.exec(opfContent)) !== null) {
      manifest[match[2]] = match[1];
    }

    // Extract spine order
    const spineItems: string[] = [];
    const spineRegex = /<itemref[^>]+idref="([^"]+)"[^>]*>/gi;
    while ((match = spineRegex.exec(opfContent)) !== null) {
      spineItems.push(match[1]);
    }

    if (spineItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid EPUB file: no readable content found" },
        { status: 400 }
      );
    }

    const chapters: string[] = [];
    const chapterTitles: string[] = [];

    // Read each spine item in order
    for (const itemId of spineItems) {
      const href = manifest[itemId];
      if (!href) continue;

      // Handle relative paths
      const fullPath = href.startsWith("/") ? href.slice(1) : opfDir + href;
      
      try {
        const content = await zip.file(fullPath)?.async("string");
        if (!content) continue;

        const plainText = htmlToText(content);
        
        // Only include chapters with substantial content
        if (plainText.length > 100) {
          chapters.push(plainText);
          
          const title = extractTitle(content) || `Chapter ${chapters.length}`;
          chapterTitles.push(title);
        }
      } catch (err) {
        console.warn(`Failed to read ${fullPath}:`, err);
      }
    }

    if (chapters.length === 0) {
      return NextResponse.json(
        { error: "No readable content found in EPUB file." },
        { status: 400 }
      );
    }

    const fullText = chapters.join("\n\n");

    return NextResponse.json({
      text: fullText,
      pages: chapters,
      chapters: chapterTitles,
    });
  } catch (err) {
    console.error("EPUB extract error:", err);
    
    const message = err instanceof Error ? err.message : "Failed to extract EPUB file.";
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
