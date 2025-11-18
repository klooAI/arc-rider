// app/page.tsx
"use client";

import React, { useState } from "react";

type RelevanceResult = {
  page: number;
  score: number;
  reason?: string;
};

type DocType = "pdf" | "docx" | "epub" | null;

// Simple visual loading bar (non-progressive, just shows activity)
function LoadingBar({ label }: { label: string }) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let value = 0;

    const interval = setInterval(() => {
      value += 5 + Math.random() * 8;

      if (value < 90) {
        setProgress(value);
      } else {
        setProgress(90);
        clearInterval(interval);
      }
    }, 250);

    return () => {
      clearInterval(interval);
      setProgress(100);
    };
  }, []);

  return (
    <div className="mt-2 w-full">
      <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
        <span className="inline-flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse" />
        <span>{label}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-[#2563EB] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocType>(null);

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

  // ✅ NEW STATE (minimal fix)
  const [summaryFromRelevant, setSummaryFromRelevant] = useState(false);

  // ---------- EXTRACT ----------
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
      const name = file.name?.toLowerCase() ?? "";
      const isPdf = name.endsWith(".pdf");
      const isDocx = name.endsWith(".docx");
      const isEpub = name.endsWith(".epub");

      if (!isPdf && !isDocx && !isEpub) {
        throw new Error(
          "Unsupported file type. Please upload a PDF, DOCX, or EPUB file."
        );
      }

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

  // ---------- RELEVANCE ----------
  async function handleRelevance() {
    if (!pages.length) {
      setError("Extract the document first.");
      return;
    }
    if (!interest.trim()) {
      setError("Tell ArcRider what you're looking for.");
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
      if (!res.ok) throw new Error(data.error || "Failed relevance scan");

      const rawRankings: any[] = Array.isArray(data.rankings)
        ? data.rankings
        : [];

      const normalised: RelevanceResult[] = rawRankings.map((r) => {
        const rawScore = r.score;
        const numericScore =
          typeof rawScore === "number"
            ? rawScore
            : rawScore == null
            ? 0
            : Number(rawScore);

        const safeScore = Number.isNaN(numericScore) ? 0 : numericScore;

        return {
          page: r.page,
          score: safeScore,
          reason: r.reason,
        } as RelevanceResult;
      });

      const filteredRankings = normalised
        .filter(
          (r) =>
            (r.score ?? 0) >= 25 &&
            typeof r.reason === "string" &&
            r.reason.trim().length > 0
        )
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));

      setRankings(filteredRankings);
      setShowRelevant(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error computing relevance.");
    } finally {
      setRelevanceLoading(false);
    }
  }

  // ---------- SUMMARY (full / page range) ----------
  async function handleSummary() {
    if (!pages.length) {
      setError("Extract the document first.");
      return;
    }

    // ✅ Reset because this is a normal summary
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

  // ---------- SUMMARY (relevant only) ----------
  async function handleSummaryRelevant() {
    if (!pages.length) {
      setError("Extract the document first.");
      return;
    }
    if (!rankings.length) {
      setError("Run 'Find relevant pages/chapters' first.");
      return;
    }

    // ✅ Mark that the summary came from relevance
    setSummaryFromRelevant(true);

    setSummary("");
    setSummaryRelevantLoading(true);
    setError(null);

    try {
      const top = rankings
        .filter((r) => typeof r.score === "number" && r.score >= 50)
        .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
        .slice(0, 8);

      const selectedPages = top
        .map((r) => pages[r.page - 1])
        .filter(Boolean);

      if (!selectedPages.length) {
        throw new Error(
          "No sections with a relevance score of 50 or higher to summarise."
        );
      }

      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "pages",
          selectedPages,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to summarise relevant sections.");

      setSummary(data.summary || "");
      setShowSummaryPanel(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error summarising relevant sections.");
    } finally {
      setSummaryRelevantLoading(false);
    }
  }

  const totalPages = pages.length;

  // --------- Derive smart, short label ----------
  function getInterestLabel(raw: string): string {
    const text = raw.trim();
    if (!text) return "";

    const lower = text.toLowerCase();
    const labels: string[] = [];

    function theme(matches: string[], label: string) {
      if (matches.some((m) => lower.includes(m))) labels.push(label);
    }

    theme(
      ["home loan", "mortgage", "buy a home", "buying a home", "house deposit", "property"],
      "homeownership"
    );
    theme(
      ["debt", "loan", "loans", "credit card", "owe money"],
      "debt management"
    );
    theme(
      ["save", "savings", "budget", "budgeting", "spending", "expenses"],
      "saving and budgeting"
    );
    theme(
      ["invest", "investing", "portfolio", "stocks", "shares", "etf"],
      "investing"
    );
    theme(
      ["retirement", "superannuation", "super ", "pension"],
      "retirement planning"
    );
    theme(
      ["career", "promotion", "job", "role", "interview", "cv", "resume"],
      "career development"
    );
    theme(
      ["study", "exam", "assignment", "university", "uni", "school"],
      "study and exams"
    );
    theme(
      ["mental health", "anxiety", "stress", "burnout"],
      "mental health"
    );
    theme(
      ["relationship", "dating", "partner", "marriage"],
      "relationships"
    );

    if (labels.length > 0) {
      let phrase = "";
      if (labels.length === 1) {
        phrase = labels[0];
      } else if (labels.length === 2) {
        phrase = `${labels[0]} and ${labels[1]}`;
      } else {
        phrase = `${labels[0]}, ${labels[1]} and more`;
      }

      return phrase.charAt(0).toUpperCase() + phrase.slice(1);
    }

    let candidate = text;

    candidate = candidate.replace(/^how to\s+/i, "");
    candidate = candidate.replace(/^i want to\s+/i, "");
    candidate = candidate.replace(/^i'm looking for\s+/i, "");
    candidate = candidate.replace(/^i am looking for\s+/i, "");
    candidate = candidate.replace(/^looking for\s+/i, "");
    candidate = candidate.replace(/^help me with\s+/i, "");

    const andIndex = candidate.toLowerCase().indexOf(" and ");
    const stopPuncIndex = candidate.search(/[.?!]/);

    let cutIndex = -1;
    if (andIndex !== -1) cutIndex = andIndex;
    if (stopPuncIndex !== -1 && (cutIndex === -1 || stopPuncIndex < cutIndex)) {
      cutIndex = stopPuncIndex;
    }

    if (cutIndex !== -1) {
      candidate = candidate.slice(0, cutIndex);
    }

    candidate = candidate.trim();

    if (candidate.length > 80) {
      candidate = candidate.slice(0, 77).trim() + "...";
    }

    if (candidate.split(" ").length > 14) {
      return "";
    }

    const lowerCand = candidate.toLowerCase();
    return lowerCand.charAt(0).toUpperCase() + lowerCand.slice(1);
  }

  const interestLabel = getInterestLabel(interest);

  // ---------- GROUP RANKINGS ----------
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
          topScore: r.score ?? 0,
          topReason: r.reason,
        };
        continue;
      }

      if (r.page === current.endPage + 1) {
        current.endPage = r.page;
        if ((r.score ?? 0) > current.topScore) {
          current.topScore = r.score ?? 0;
          current.topReason = r.reason;
        }
      } else {
        groups.push(current);
        current = {
          startPage: r.page,
          endPage: r.page,
          topScore: r.score ?? 0,
          topReason: r.reason,
        };
      }
    }

    if (current) groups.push(current);

    return groups.sort((a, b) => (b.topScore ?? 0) - (a.topScore ?? 0));
  })();

  // ---------- RANGE LABEL ----------
  function formatRangeLabel(group: RelevanceGroup): string {
    if (docType === "epub") {
      const startIdx = group.startPage - 1;
      const endIdx = group.endPage - 1;

      const startTitle =
        typeof chapters[startIdx] === "string"
          ? chapters[startIdx].trim()
          : "";
      const endTitle =
        typeof chapters[endIdx] === "string"
          ? chapters[endIdx].trim()
          : "";

      if (group.startPage === group.endPage) {
        if (startTitle) return startTitle;
        return `Chapter ${group.startPage}`;
      }

      if (startTitle && endTitle && startTitle !== endTitle) {
        return `${startTitle} – ${endTitle}`;
      }
      if (startTitle) return `${startTitle} (to chapter ${group.endPage})`;
      return `Chapters ${group.startPage}–${group.endPage}`;
    }

    if (group.startPage === group.endPage) {
      return `Page ${group.startPage}`;
    }
    return `Pages ${group.startPage}–${group.endPage}`;
  }

  // ---------- CLEAN SUMMARY FORMATTER ----------
  const summaryBlocks =
    summary
      .split("\n")
      .map((rawLine) => {
        const line = rawLine.trim();
        if (!line) return null;

        const boldProcessed = line.replace(
          /\*\*(.*?)\*\*/g,
          "<strong>$1</strong>"
        );

        if (/^#+\s*/.test(line)) {
          return {
            type: "heading" as const,
            html: boldProcessed.replace(/^#+\s*/, ""),
          };
        }

        if (/^[-*]\s+/.test(line)) {
          return {
            type: "bullet" as const,
            html: boldProcessed.replace(/^[-*]\s+/, ""),
          };
        }

        return {
          type: "paragraph" as const,
          html: boldProcessed,
        };
      })
      .filter(Boolean) as {
      type: "heading" | "bullet" | "paragraph";
      html: string;
    }[];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#1F2937] px-6 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-[#2563EB] mb-2 tracking-tight">
        ArcRider
      </h1>
      <p className="text-base md:text-lg text-gray-600 max-w-2xl text-center mb-10">
        Focus on the things that matter.
      </p>

      {/* Upload */}
      <div className="bg-white w-full max-w-xl p-6 rounded-xl shadow-md border border-gray-200 flex flex-col gap-4 mb-10">
        <label className="text-sm font-medium text-gray-700">
          What are you reading? (PDF / DOCX / EPUB)
        </label>

        <input
          type="file"
          accept=".pdf,.docx,.epub"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            setError(null);
            setText("");
            setPages([]);
            setChapters([]);
            setRankings([]);
            setSummary("");
            setDocType(null);

            if (f?.name) {
              const name = f.name.toLowerCase();
              if (name.endsWith(".pdf")) setDocType("pdf");
              else if (name.endsWith(".docx")) setDocType("docx");
              else if (name.endsWith(".epub")) setDocType("epub");
            }
          }}
          className="border border-gray-300 p-2 rounded-md text-sm bg-white"
        />

        <button
          onClick={handleExtract}
          disabled={!file || loadingExtract}
          className="bg-[#2563EB] hover:bg-[#1E4FCB] text-white py-2 rounded-md text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingExtract ? "Extracting text..." : "Extract text from file"}
        </button>

        {loadingExtract && <LoadingBar label="Extracting book..." />}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md p-2">
            {error}
          </p>
        )}
      </div>

      {/* Main */}
      <div className="w-full max-w-4xl space-y-8">
        {text && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-md px-4 py-3 shadow-sm">
            {docType === "epub"
              ? `✅ Text extracted successfully from ${pages.length} chapter${
                  pages.length === 1 ? "" : "s"
                }.`
              : `✅ Text extracted successfully from ${pages.length} page${
                  pages.length === 1 ? "" : "s"
                }.`}
          </div>
        )}

        {/* Relevance + Summary */}
        {pages.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-sm space-y-6">
            {/* RELEVANCE SECTION */}
            <section className="space-y-4">
              <h2 className="text-lg font-semibold">
                {docType === "epub"
                  ? "Find relevant chapters"
                  : "Find relevant sections"}
              </h2>

              <textarea
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="What are you interested in?"
              />

              <button
                onClick={handleRelevance}
                disabled={relevanceLoading}
                className="bg-[#059669] hover:bg-[#047857] text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {relevanceLoading
                  ? docType === "epub"
                    ? "Scanning chapters..."
                    : "Scanning pages..."
                  : docType === "epub"
                  ? "Find relevant chapters"
                  : "Find relevant pages"}
              </button>

              {relevanceLoading && (
                <LoadingBar
                  label={
                    docType === "epub"
                      ? "Scanning chapters for matches..."
                      : "Scanning pages for matches..."
                  }
                />
              )}

              {groupedRankings.length > 0 && (
                <div className="space-y-3 mt-3">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB]/10 text-[11px] font-semibold text-[#2563EB]">
                        {groupedRankings.length}
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[11px] uppercase tracking-wide text-gray-500">
                          {docType === "epub"
                            ? "Relevant chapters"
                            : "Relevant page ranges"}
                        </span>
                        <span className="font-semibold text-[#111827] text-sm">
                          {interestLabel
                            ? `For information related to ${interestLabel}, you should check out:`
                            : `You should check out these sections:`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowRelevant((prev) => !prev)}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <span>{showRelevant ? "Hide list" : "Show list"}</span>
                      <span
                        className={`text-xs transition-transform duration-150 ${
                          showRelevant ? "rotate-180" : ""
                        }`}
                      >
                        ⌃
                      </span>
                    </button>
                  </div>

                  {showRelevant && (
                    <>
                      <div className="space-y-2">
                        {groupedRankings.map((group) => (
                          <div
                            key={`${group.startPage}-${group.endPage}-${group.topScore}`}
                            className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col gap-1"
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-[#111827]">
                                {formatRangeLabel(group)}
                              </p>
                              <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-700 border border-gray-300">
                                Score {Math.round(group.topScore)}
                              </span>
                            </div>
                            {group.topReason && (
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {group.topReason}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleSummaryRelevant}
                          disabled={summaryRelevantLoading}
                          className="bg-[#2563EB] hover:bg-[#1E4FCB] text-white py-2 px-4 rounded-md disabled:opacity-50 text-sm"
                        >
                          {summaryRelevantLoading
                            ? "Summarising..."
                            : docType === "epub"
                            ? "What's The Gist?"
                            : "What's The Gist?"}
                        </button>
                      </div>

                      {summaryRelevantLoading && !summary && (
                        <LoadingBar label="Summarising the most relevant sections..." />
                      )}
                    </>
                  )}
                </div>
              )}
            </section>

            {/* SUMMARY SECTION */}
            <section className="space-y-4 pt-6 border-t">
              <h2 className="text-lg font-semibold">Summarise the document</h2>

              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="summaryMode"
                    value="full"
                    checked={summaryMode === "full"}
                    onChange={() => setSummaryMode("full")}
                  />
                  Entire document
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="summaryMode"
                    value="pages"
                    checked={summaryMode === "pages"}
                    onChange={() => setSummaryMode("pages")}
                  />
                  {docType === "epub"
                    ? "Selected chapters"
                    : "Selected page range"}
                </label>

                <button
                  onClick={handleSummary}
                  disabled={summaryLoading}
                  className="ml-auto bg-[#2563EB] hover:bg-[#1E4FCB] text-white py-2 px-4 rounded-md disabled:opacity-50"
                >
                  {summaryLoading ? "Summarising..." : "Summarise"}
                </button>
              </div>

              {summaryLoading && !relevanceLoading && (
                <LoadingBar label="Summarising your selection..." />
              )}

              {summaryMode === "pages" && (
                <div className="flex gap-4 items-end flex-wrap">
                  <div>
                    <label className="text-xs">
                      {docType === "epub" ? "Start chapter" : "Start page"}
                    </label>
                    <input
                      type="number"
                      value={startPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) => setStartPage(Number(e.target.value))}
                      className="border border-gray-300 rounded p-2 text-sm w-24"
                    />
                  </div>

                  <div>
                    <label className="text-xs">
                      {docType === "epub" ? "End chapter" : "End page"}
                    </label>
                    <input
                      type="number"
                      value={endPage}
                      min={1}
                      max={totalPages}
                      onChange={(e) => setEndPage(Number(e.target.value))}
                      className="border border-gray-300 rounded p-2 text-sm w-24"
                    />
                  </div>
                </div>
              )}

              {summary && (
                <div className="mt-4 bg-gray-50 border border-gray-200 p-4 rounded-lg text-sm max-h-[40vh] overflow-auto space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    
                    {/* ✅ FIXED LABEL HERE */}
                    <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200">
                      {summaryFromRelevant
                        ? docType === "epub"
                          ? "Relevant chapters"
                          : "Relevant sections"
                        : summaryMode === "full"
                        ? "Entire document"
                        : docType === "epub"
                        ? "Selected chapters"
                        : "Selected pages"}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setShowSummaryPanel((prev) => !prev)
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <span>
                        {showSummaryPanel ? "Hide summary" : "Show summary"}
                      </span>
                      <span
                        className={`text-xs transition-transform duration-150 ${
                          showSummaryPanel ? "rotate-180" : ""
                        }`}
                      >
                        ⌃
                      </span>
                    </button>
                  </div>

                  {showSummaryPanel && (
                    <div className="space-y-2">
                      {summaryBlocks.map((block, idx) => {
                        if (block.type === "heading") {
                          return (
                            <p
                              key={idx}
                              className="mt-2 text-[13px] font-semibold text-gray-800 uppercase tracking-wide"
                              dangerouslySetInnerHTML={{ __html: block.html }}
                            />
                          );
                        }

                        if (block.type === "bullet") {
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-2 text-gray-700"
                            >
                              <span className="mt-[3px] text-xs">•</span>
                              <span
                                className="leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: block.html }}
                              />
                            </div>
                          );
                        }

                        return (
                          <p
                            key={idx}
                            className="leading-relaxed text-gray-700"
                            dangerouslySetInnerHTML={{ __html: block.html }}
                          />
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
