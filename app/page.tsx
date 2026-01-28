// app/page.tsx
"use client";

import React, { useState, useCallback, useRef } from "react";

type RelevanceResult = {
  page: number;
  score: number;
  reason?: string;
};

type DocType = "pdf" | "docx" | "epub" | null;

// Loading bar with animated progress
function LoadingBar({ label }: { label: string }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 3 + Math.random() * 5;
      if (value < 92) {
        setProgress(value);
      } else {
        setProgress(92);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      setProgress(100);
    };
  }, []);

  return (
    <div className="mt-3 w-full" data-testid="loading-bar">
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1.5">
        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
        <span>{label}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Score badge with color coding
function ScoreBadge({ score }: { score: number }) {
  const rounded = Math.round(score);
  let colorClass = "bg-gray-100 text-gray-700 border-gray-300";
  
  if (rounded >= 90) {
    colorClass = "bg-green-50 text-green-700 border-green-300";
  } else if (rounded >= 70) {
    colorClass = "bg-blue-50 text-blue-700 border-blue-300";
  } else if (rounded >= 50) {
    colorClass = "bg-yellow-50 text-yellow-700 border-yellow-300";
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${colorClass}`}>
      {rounded}%
    </span>
  );
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocType>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [text, setText] = useState("");
  const [pages, setPages] = useState<string[]>([]);
  const [chapters, setChapters] = useState<string[]>([]);

  const [loadingExtract, setLoadingExtract] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [interest, setInterest] = useState("");
  const [relevanceLoading, setRelevanceLoading] = useState(false);
  const [rankings, setRankings] = useState<RelevanceResult[]>([]);

  const [summaryMode, setSummaryMode] = useState<"full" | "pages">("full");
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryRelevantLoading, setSummaryRelevantLoading] = useState(false);
  const [summary, setSummary] = useState("");

  const [showRelevant, setShowRelevant] = useState(true);
  const [showSummaryPanel, setShowSummaryPanel] = useState(true);
  const [summaryFromRelevant, setSummaryFromRelevant] = useState(false);

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // File validation
  const validateFile = useCallback((f: File): string | null => {
    const name = f.name.toLowerCase();
    const validTypes = [".pdf", ".docx", ".epub"];
    
    if (!validTypes.some(ext => name.endsWith(ext))) {
      return "Please upload a PDF, DOCX, or EPUB file.";
    }
    
    if (f.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 50MB.";
    }
    
    return null;
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((f: File | null) => {
    if (!f) return;
    
    const validationError = validateFile(f);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFile(f);
    setError(null);
    setText("");
    setPages([]);
    setChapters([]);
    setRankings([]);
    setSummary("");

    const name = f.name.toLowerCase();
    if (name.endsWith(".pdf")) setDocType("pdf");
    else if (name.endsWith(".docx")) setDocType("docx");
    else if (name.endsWith(".epub")) setDocType("epub");
    else setDocType(null);
  }, [validateFile]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }, [handleFileSelect]);

  // Extract document
  async function handleExtract() {
    if (!file) return;

    setLoadingExtract(true);
    setError(null);
    setText("");
    setPages([]);
    setChapters([]);
    setRankings([]);
    setSummary("");

    try {
      const name = file.name.toLowerCase();
      const isPdf = name.endsWith(".pdf");
      const isDocx = name.endsWith(".docx");
      const isEpub = name.endsWith(".epub");

      const endpoint = isPdf
        ? "/api/extract"
        : isDocx
        ? "/api/extract-docx"
        : "/api/extract-epub";

      const currentType: DocType = isPdf ? "pdf" : isDocx ? "docx" : "epub";
      setDocType(currentType);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to extract document.");

      setText(data.text || "");
      const docPages = Array.isArray(data.pages) ? data.pages : [];
      setPages(docPages);

      if (Array.isArray(data.chapters)) {
        setChapters(data.chapters);
      } else {
        setChapters([]);
      }

      const total = docPages.length || 1;
      setStartPage(1);
      setEndPage(total);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Document extraction failed.");
    } finally {
      setLoadingExtract(false);
    }
  }

  // Relevance scoring
  async function handleRelevance() {
    if (!pages.length) {
      setError("Extract the document first.");
      return;
    }
    if (!interest.trim()) {
      setError("Tell us what you're looking for.");
      return;
    }

    setError(null);
    setRelevanceLoading(true);
    setRankings([]);

    try {
      const res = await fetch("/api/relevance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interest, pages }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze document.");

      const rawRankings: any[] = Array.isArray(data.rankings) ? data.rankings : [];

      const normalised: RelevanceResult[] = rawRankings.map((r) => {
        const rawScore = r.score;
        const numericScore = typeof rawScore === "number" ? rawScore : Number(rawScore) || 0;
        const safeScore = Number.isNaN(numericScore) ? 0 : numericScore;

        return {
          page: r.page,
          score: safeScore,
          reason: r.reason,
        };
      });

      // Filter to show only relevant results (score >= 40 per spec)
      const filteredRankings = normalised
        .filter((r) => r.score >= 40 && r.reason && r.reason.trim().length > 0)
        .sort((a, b) => b.score - a.score);

      setRankings(filteredRankings);
      setShowRelevant(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error analyzing document.");
    } finally {
      setRelevanceLoading(false);
    }
  }

  // Summary (full / page range)
  async function handleSummary() {
    if (!pages.length) {
      setError("Extract the document first.");
      return;
    }

    setSummaryFromRelevant(false);
    setSummary("");
    setSummaryLoading(true);
    setError(null);

    try {
      let body: any;

      if (summaryMode === "full") {
        body = { mode: "full", docPages: pages };
      } else {
        const total = pages.length;
        const start = Math.max(1, Math.min(startPage, total));
        const end = Math.max(start, Math.min(endPage, total));
        const range = pages.slice(start - 1, end);
        body = { mode: "pages", selectedPages: range };
      }

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate summary.");

      setSummary(data.summary || "");
      setShowSummaryPanel(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error generating summary.");
    } finally {
      setSummaryLoading(false);
    }
  }

  // Summary (relevant sections only) - IMPROVED: passes user interest
  async function handleSummaryRelevant() {
    if (!pages.length) {
      setError("Extract the document first.");
      return;
    }
    if (!rankings.length) {
      setError("Find relevant sections first.");
      return;
    }

    setSummaryFromRelevant(true);
    setSummary("");
    setSummaryRelevantLoading(true);
    setError(null);

    try {
      // Get top scoring pages (score >= 50)
      const top = rankings
        .filter((r) => r.score >= 50)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      const selectedPages = top.map((r) => pages[r.page - 1]).filter(Boolean);

      if (!selectedPages.length) {
        throw new Error("No sections with high enough relevance to summarize. Try a different search term.");
      }

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "pages",
          selectedPages,
          interest: interest.trim(), // Pass user's interest for focused summary
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to summarize.");

      setSummary(data.summary || "");
      setShowSummaryPanel(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error summarizing relevant sections.");
    } finally {
      setSummaryRelevantLoading(false);
    }
  }

  const totalPages = pages.length;

  // Group consecutive pages for cleaner display
  type RelevanceGroup = {
    startPage: number;
    endPage: number;
    topScore: number;
    topReason?: string;
  };

  const groupedRankings: RelevanceGroup[] = (() => {
    if (!rankings.length) return [];

    const byPage = rankings.slice().sort((a, b) => a.page - b.page);
    const groups: RelevanceGroup[] = [];
    let current: RelevanceGroup | null = null;

    for (const r of byPage) {
      if (!current) {
        current = {
          startPage: r.page,
          endPage: r.page,
          topScore: r.score,
          topReason: r.reason,
        };
        continue;
      }

      if (r.page === current.endPage + 1) {
        current.endPage = r.page;
        if (r.score > current.topScore) {
          current.topScore = r.score;
          current.topReason = r.reason;
        }
      } else {
        groups.push(current);
        current = {
          startPage: r.page,
          endPage: r.page,
          topScore: r.score,
          topReason: r.reason,
        };
      }
    }

    if (current) groups.push(current);
    return groups.sort((a, b) => b.topScore - a.topScore);
  })();

  // Format page/chapter range label - always show chapter number for EPUBs
  function formatRangeLabel(group: RelevanceGroup): string {
    if (docType === "epub") {
      const startIdx = group.startPage - 1;
      const startTitle = chapters[startIdx]?.trim() || "";

      if (group.startPage === group.endPage) {
        // Single chapter: "Chapter 12: Title" or just "Chapter 12"
        return startTitle 
          ? `Chapter ${group.startPage}: ${startTitle}`
          : `Chapter ${group.startPage}`;
      }
      // Range of chapters: "Chapters 12-15"
      return `Chapters ${group.startPage}–${group.endPage}`;
    }

    if (group.startPage === group.endPage) {
      return `Page ${group.startPage}`;
    }
    return `Pages ${group.startPage}–${group.endPage}`;
  }

  // Parse summary markdown
  const summaryBlocks = summary
    .split("\n")
    .map((rawLine) => {
      const line = rawLine.trim();
      if (!line) return null;

      const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      if (/^#+\s*/.test(line)) {
        return { type: "heading" as const, html: boldProcessed.replace(/^#+\s*/, "") };
      }
      if (/^[-*]\s+/.test(line)) {
        return { type: "bullet" as const, html: boldProcessed.replace(/^[-*]\s+/, "") };
      }
      return { type: "paragraph" as const, html: boldProcessed };
    })
    .filter(Boolean) as { type: "heading" | "bullet" | "paragraph"; html: string }[];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2 tracking-tight" data-testid="title">
          ArcRider
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
          Focus on the things that matter.
        </p>
        <a 
          href="/v2" 
          className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition"
        >
          ✨ Try V2 with lightning-fast embeddings →
        </a>
      </div>

      {/* Upload Section */}
      <div
        className={`w-full max-w-xl p-6 rounded-2xl shadow-sm border-2 border-dashed transition-all duration-200 mb-8 ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : file
            ? "border-green-300 bg-green-50"
            : "border-gray-300 bg-white hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-testid="upload-zone"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 mb-1">
              {file ? file.name : "Drop your document here"}
            </p>
            <p className="text-xs text-gray-500">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(1)} MB • ${docType?.toUpperCase()}`
                : "PDF, DOCX, or EPUB • Max 50MB"}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.epub"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
            className="hidden"
            data-testid="file-input"
          />

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              data-testid="button-browse"
            >
              Browse files
            </button>

            {file && (
              <button
                onClick={handleExtract}
                disabled={loadingExtract}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                data-testid="button-extract"
              >
                {loadingExtract ? "Extracting..." : "Extract text"}
              </button>
            )}
          </div>

          {loadingExtract && <LoadingBar label="Reading your document..." />}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2 w-full" data-testid="error-message">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl space-y-6">
        {/* Success Banner */}
        {text && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3 flex items-center gap-2" data-testid="success-banner">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>
              {docType === "epub"
                ? `Extracted ${pages.length} chapter${pages.length === 1 ? "" : "s"}`
                : `Extracted ${pages.length} page${pages.length === 1 ? "" : "s"}`}
            </span>
          </div>
        )}

        {/* Analysis Panel */}
        {pages.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-8">
            {/* Relevance Section */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                What are you looking for?
              </h2>

              <textarea
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                placeholder="e.g., saving money, buying a house, career advancement, managing stress..."
                data-testid="input-interest"
              />

              <button
                onClick={handleRelevance}
                disabled={relevanceLoading || !interest.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                data-testid="button-find-relevant"
              >
                {relevanceLoading ? "Analyzing..." : `Find relevant ${docType === "epub" ? "chapters" : "sections"}`}
              </button>

              {relevanceLoading && (
                <LoadingBar label={`Scanning ${docType === "epub" ? "chapters" : "pages"} for your topic...`} />
              )}

              {/* Results */}
              {groupedRankings.length > 0 && (
                <div className="space-y-3 mt-4" data-testid="relevance-results">
                  <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {groupedRankings.length}
                      </span>
                      <span className="font-medium text-gray-900">
                        Relevant {docType === "epub" ? "chapters" : "sections"} found
                      </span>
                    </div>

                    <button
                      onClick={() => setShowRelevant((prev) => !prev)}
                      className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                      data-testid="button-toggle-results"
                    >
                      {showRelevant ? "Hide" : "Show"}
                      <span className={`transition-transform ${showRelevant ? "rotate-180" : ""}`}>▲</span>
                    </button>
                  </div>

                  {showRelevant && (
                    <>
                      <div className="space-y-2">
                        {groupedRankings.map((group, idx) => (
                          <div
                            key={`${group.startPage}-${group.endPage}-${idx}`}
                            className="border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50 transition"
                            data-testid={`result-item-${idx}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 mb-1">
                                  {formatRangeLabel(group)}
                                </p>
                                {group.topReason && (
                                  <p className="text-sm text-gray-600 leading-relaxed">
                                    {group.topReason}
                                  </p>
                                )}
                              </div>
                              <ScoreBadge score={group.topScore} />
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleSummaryRelevant}
                        disabled={summaryRelevantLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-sm font-medium disabled:opacity-50 transition"
                        data-testid="button-summarize-relevant"
                      >
                        {summaryRelevantLoading ? "Summarizing..." : "Summarize these sections"}
                      </button>

                      {summaryRelevantLoading && !summary && (
                        <LoadingBar label="Creating a focused summary..." />
                      )}
                    </>
                  )}
                </div>
              )}

              {!relevanceLoading && rankings.length === 0 && interest.trim() && pages.length > 0 && (
                <p className="text-sm text-gray-500 italic">
                  No highly relevant sections found. Try different search terms.
                </p>
              )}
            </section>

            {/* Summary Section */}
            <section className="space-y-4 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Or summarize directly
              </h2>

              <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="summaryMode"
                    value="full"
                    checked={summaryMode === "full"}
                    onChange={() => setSummaryMode("full")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  Entire document
                </label>

                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="radio"
                    name="summaryMode"
                    value="pages"
                    checked={summaryMode === "pages"}
                    onChange={() => setSummaryMode("pages")}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  {docType === "epub" ? "Selected chapters" : "Page range"}
                </label>
              </div>

              {summaryMode === "pages" && (
                <div className="flex gap-4 items-center flex-wrap">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">From</label>
                    <input
                      type="number"
                      value={startPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) => setStartPage(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20"
                      data-testid="input-start-page"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">to</label>
                    <input
                      type="number"
                      value={endPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) => setEndPage(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-20"
                      data-testid="input-end-page"
                    />
                  </div>
                  <span className="text-xs text-gray-500">of {totalPages}</span>
                </div>
              )}

              <button
                onClick={handleSummary}
                disabled={summaryLoading}
                className="bg-gray-900 hover:bg-gray-800 text-white py-2.5 px-5 rounded-xl text-sm font-medium disabled:opacity-50 transition"
                data-testid="button-summarize"
              >
                {summaryLoading ? "Summarizing..." : "Generate summary"}
              </button>

              {summaryLoading && <LoadingBar label="Generating summary..." />}

              {/* Summary Output */}
              {summary && (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl overflow-hidden" data-testid="summary-output">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-200">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      {summaryFromRelevant
                        ? `Summary • ${docType === "epub" ? "Relevant chapters" : "Relevant sections"}`
                        : summaryMode === "full"
                        ? "Summary • Full document"
                        : `Summary • ${docType === "epub" ? "Chapters" : "Pages"} ${startPage}–${endPage}`}
                    </span>
                    <button
                      onClick={() => setShowSummaryPanel((prev) => !prev)}
                      className="text-xs text-gray-600 hover:text-gray-900"
                    >
                      {showSummaryPanel ? "Collapse" : "Expand"}
                    </button>
                  </div>

                  {showSummaryPanel && (
                    <div className="p-4 max-h-[50vh] overflow-auto space-y-3 text-sm">
                      {summaryBlocks.map((block, idx) => {
                        if (block.type === "heading") {
                          return (
                            <p
                              key={idx}
                              className="mt-3 text-sm font-bold text-gray-900 uppercase tracking-wide"
                              dangerouslySetInnerHTML={{ __html: block.html }}
                            />
                          );
                        }
                        if (block.type === "bullet") {
                          return (
                            <div key={idx} className="flex items-start gap-2 text-gray-700">
                              <span className="mt-1 text-blue-600">•</span>
                              <span className="leading-relaxed" dangerouslySetInnerHTML={{ __html: block.html }} />
                            </div>
                          );
                        }
                        return (
                          <p key={idx} className="leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: block.html }} />
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
