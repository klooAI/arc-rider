import { NextRequest, NextResponse } from "next/server";
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

type PageGroup = {
  startPage: number;
  endPage: number;
  pages: number[];
  texts: string[];
  avgScore: number;
  description?: string;
};

function groupConsecutivePages(
  results: { page: number; text: string; score: number }[]
): PageGroup[] {
  if (results.length === 0) return [];

  const sorted = [...results].sort((a, b) => a.page - b.page);
  const groups: PageGroup[] = [];
  
  let currentGroup: PageGroup = {
    startPage: sorted[0].page,
    endPage: sorted[0].page,
    pages: [sorted[0].page],
    texts: [sorted[0].text],
    avgScore: sorted[0].score,
  };

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    const prevPage = sorted[i - 1].page;

    if (item.page <= prevPage + 2) {
      currentGroup.endPage = item.page;
      if (!currentGroup.pages.includes(item.page)) {
        currentGroup.pages.push(item.page);
      }
      currentGroup.texts.push(item.text);
      currentGroup.avgScore = 
        (currentGroup.avgScore * (currentGroup.texts.length - 1) + item.score) / 
        currentGroup.texts.length;
    } else {
      groups.push(currentGroup);
      currentGroup = {
        startPage: item.page,
        endPage: item.page,
        pages: [item.page],
        texts: [item.text],
        avgScore: item.score,
      };
    }
  }
  groups.push(currentGroup);

  return groups.sort((a, b) => b.avgScore - a.avgScore);
}

export async function POST(req: NextRequest) {
  try {
    const { query, chunks, embeddings, pageMap, docType } = await req.json();

    if (!query || !Array.isArray(chunks) || !Array.isArray(embeddings)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pages: number[] = pageMap || chunks.map((_, i) => i + 1);

    // Expand the query with related concepts for better semantic matching
    const isShortQuery = query.trim().split(/\s+/).length <= 2;
    const expansionRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 150,
      messages: [
        {
          role: "system",
          content: isShortQuery
            ? "The user is searching for a topic in a book. Expand this short query into a comprehensive description (80-120 words) that captures ALL related concepts, themes, situations, emotions, and scenarios. Include explicit and implicit meanings, related activities, consequences, and contextual uses. Be thorough."
            : "Expand the user's search query into a rich description that includes synonyms and related concepts. Output a single paragraph (50-80 words) that captures the full semantic meaning. Do not use bullet points.",
        },
        {
          role: "user",
          content: query,
        },
      ],
    });
    const expandedQuery = expansionRes.choices[0]?.message?.content || query;
    
    // Generate interpretation based on the expanded query to show what we actually searched for
    const interpretationRes = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 40,
      messages: [
        {
          role: "system",
          content: "Summarize what topics this expanded search covers in a single natural phrase. Start with 'pages about' or 'sections covering'. Be comprehensive but concise (8-12 words). Example: 'pages about intimacy, sexual encounters, desire, and physical relationships'.",
        },
        {
          role: "user",
          content: expandedQuery,
        },
      ],
    });
    const queryInterpretation = interpretationRes.choices[0]?.message?.content?.trim() || query;

    const queryRes = await client.embeddings.create({
      model: "text-embedding-3-small",
      input: expandedQuery.slice(0, 6000),
    });
    const queryEmbedding = queryRes.data[0].embedding;

    const scored = chunks.map((text: string, idx: number) => ({
      page: pages[idx],
      text,
      score: cosineSimilarity(queryEmbedding, embeddings[idx]),
    }));

    // Sort by score and take results above threshold OR top results if none meet threshold
    const sortedScores = [...scored].sort((a, b) => b.score - a.score);
    const threshold = isShortQuery ? 0.20 : 0.22;
    let relevant = sortedScores.filter((r) => r.score > threshold);
    
    // If no results above threshold, show top 5 with lower confidence
    const showingLowerConfidence = relevant.length === 0 && sortedScores.length > 0;
    if (showingLowerConfidence) {
      relevant = sortedScores.slice(0, 5).filter((r) => r.score > 0.15);
    }
    
    if (relevant.length === 0) {
      return NextResponse.json({ groups: [] });
    }

    const groups = groupConsecutivePages(relevant);
    const topGroups = groups.slice(0, 10);

    const descriptionsPromises = topGroups.map(async (group) => {
      const sampleText = group.texts.slice(0, 3).join("\n\n").slice(0, 2000);
      
      try {
        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          temperature: 0.3,
          max_tokens: 100,
          messages: [
            {
              role: "system",
              content: `You are analyzing document sections for relevance to a user's interest. Write a single, concise sentence (max 25 words) explaining HOW this section relates to "${query}". Be specific about what the section covers. Do not start with "This section".`,
            },
            {
              role: "user",
              content: sampleText,
            },
          ],
        });
        return completion.choices[0]?.message?.content?.trim() || "";
      } catch {
        return "";
      }
    });

    const descriptions = await Promise.all(descriptionsPromises);

    const enrichedGroups = topGroups.map((group, idx) => ({
      startPage: group.startPage,
      endPage: group.endPage,
      score: showingLowerConfidence 
        ? Math.min(Math.round(group.avgScore * 100 + 20), 60)
        : Math.min(Math.round(group.avgScore * 100 + 40), 95),
      description: descriptions[idx] || "Relevant content found.",
      sampleText: group.texts[0]?.slice(0, 300) || "",
    }));

    return NextResponse.json({ 
      groups: enrichedGroups,
      totalMatches: relevant.length,
      docType: docType || "pdf",
      lowerConfidence: showingLowerConfidence,
      interpretation: queryInterpretation
    });
  } catch (err: any) {
    console.error("Analyze error:", err);
    return NextResponse.json({ error: err?.message || "Analysis failed" }, { status: 500 });
  }
}
