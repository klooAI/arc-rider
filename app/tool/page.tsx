"use client";

import React, { useState, useCallback, useRef } from "react";

type PageGroup = {
  startPage: number;
  endPage: number;
  score: number;
  description: string;
  sampleText: string;
};

type DocumentState = {
  fileName: string;
  chunks: string[];
  pageMap: number[];
  embeddings: number[][];
  docType: "pdf" | "docx" | "epub";
  totalPages: number;
  ready: boolean;
};

export default function V2Page() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [document, setDocument] = useState<DocumentState | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [embedding, setEmbedding] = useState(false);
  const [progress, setProgress] = useState({ step: "", percent: 0 });
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [queryInterpretation, setQueryInterpretation] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<PageGroup[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [showResults, setShowResults] = useState(true);

  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const [directSummaryMode, setDirectSummaryMode] = useState<"full" | "range">("full");
  const [pageStart, setPageStart] = useState("");
  const [pageEnd, setPageEnd] = useState("");
  const [directSummarizing, setDirectSummarizing] = useState(false);
  
  const [suggestedTopics, setSuggestedTopics] = useState("");

  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const validateFile = useCallback((f: File): string | null => {
    const name = f.name.toLowerCase();
    if (![".pdf", ".docx", ".epub"].some((ext) => name.endsWith(ext))) {
      return "Please upload a PDF, DOCX, or EPUB file.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "This file is too large. Please upload a file under 100MB.";
    }
    return null;
  }, []);

  const handleFileSelect = useCallback(
    (f: File | null) => {
      if (!f) return;
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setFile(f);
      setError(null);
      setDocument(null);
      setResults([]);
      setSummary("");
      setSuggestedTopics("");
    },
    [validateFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFileSelect(f);
    },
    [handleFileSelect]
  );

  async function processDocument() {
    if (!file) return;

    setExtracting(true);
    setEmbedding(false);
    setError(null);
    setDocument(null);
    setResults([]);
    setSummary("");
    setProgress({ step: "Extracting text...", percent: 15 });

    try {
      const name = file.name.toLowerCase();
      const endpoint = name.endsWith(".pdf")
        ? "/v2/api/extract"
        : name.endsWith(".docx")
        ? "/v2/api/extract-docx"
        : "/v2/api/extract-epub";

      const formData = new FormData();
      formData.append("file", file);

      const extractRes = await fetch(endpoint, { method: "POST", body: formData });
      const extractData = await extractRes.json();
      if (!extractRes.ok) throw new Error(extractData.error || "Extraction failed");

      const chunks: string[] = extractData.chunks || [];
      const pageMap: number[] = extractData.pageMap || chunks.map((_, i) => i + 1);
      const totalPages: number = extractData.totalPages || chunks.length;
      const docType = name.endsWith(".pdf") ? "pdf" : name.endsWith(".docx") ? "docx" : "epub";

      if (!chunks.length) throw new Error("No content found in document");

      setProgress({ step: "Building semantic index...", percent: 50 });
      setExtracting(false);
      setEmbedding(true);

      const embeddingRes = await fetch("/v2/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunks }),
      });
      const embeddingData = await embeddingRes.json();
      if (!embeddingRes.ok) throw new Error(embeddingData.error || "Indexing failed");

      setProgress({ step: "Ready to search!", percent: 100 });

      setDocument({
        fileName: file.name,
        chunks,
        pageMap,
        embeddings: embeddingData.embeddings,
        docType,
        totalPages,
        ready: true,
      });

      try {
        const suggestRes = await fetch("/v2/api/suggest-topics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            fileName: file.name, 
            sampleText: chunks.slice(0, 5).join("\n\n") 
          }),
        });
        const suggestData = await suggestRes.json();
        if (suggestData.suggestions) {
          setSuggestedTopics(suggestData.suggestions);
        }
      } catch {
      }
    } catch (err: any) {
      console.error("Document processing error:", err);
      const msg = (err?.message || "").toLowerCase();
      if (msg.includes("no content") || msg.includes("empty")) {
        setError("We couldn't find any readable text in this document. ArcRider works with text-based PDFs, books, and papers.");
      } else if (msg.includes("extraction") || msg.includes("extract") || msg.includes("parse")) {
        setError("We had trouble reading this document. Please make sure it's not corrupted or password-protected.");
      } else if (msg.includes("index") || msg.includes("embedding") || msg.includes("rate") || msg.includes("limit")) {
        setError("We're experiencing high demand. Please try again in a moment.");
      } else if (msg.includes("timeout") || msg.includes("network") || msg.includes("fetch")) {
        setError("The connection timed out. Please check your internet and try again.");
      } else if (msg.includes("too large") || msg.includes("size")) {
        setError("This document is too large to process. Try a smaller file.");
      } else {
        setError("We had trouble processing this document. Please try a different file.");
      }
    } finally {
      setExtracting(false);
      setEmbedding(false);
    }
  }

  async function handleSearch() {
    if (!document?.ready || !query.trim()) return;

    setSearching(true);
    setSubmittedQuery(query.trim());
    setQueryInterpretation("");
    setResults([]);
    setSummary("");
    setError(null);
    setShowResults(true);

    try {
      const res = await fetch("/v2/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          chunks: document.chunks,
          embeddings: document.embeddings,
          pageMap: document.pageMap,
          docType: document.docType,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Search failed");

      const groups = data.groups || [];
      setResults(groups);
      setTotalMatches(data.totalMatches || 0);
      setQueryInterpretation(data.interpretation || query.trim());
      
      if (groups.length === 0) {
        setError("We couldn't find sections related to that in this document.");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError("We ran into a temporary issue while searching. Please try again.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSummarize() {
    if (!results.length) return;

    setSummarizing(true);
    setSummary("");
    setError(null);
    setShowResults(false);

    try {
      const topTexts = results.slice(0, 8).map((r) => r.sampleText);
      const res = await fetch("/v2/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: topTexts, query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Preview generation issue");

      setSummary(data.summary || "");
    } catch (err: any) {
      console.error("Summary error:", err);
      setError("We couldn't generate a quick overview right now.");
    } finally {
      setSummarizing(false);
    }
  }

  function formatPageRange(group: PageGroup): string {
    const label = document?.docType === "epub" ? "Chapter" : "Page";
    if (group.startPage === group.endPage) {
      return `${label} ${group.startPage}`;
    }
    return `${label}s ${group.startPage}\u2013${group.endPage}`;
  }

  async function handleDirectSummary() {
    if (!document?.ready) return;

    setDirectSummarizing(true);
    setSummary("");
    setError(null);

    try {
      let textsToSummarize: string[] = [];

      if (directSummaryMode === "full") {
        const chunks = document.chunks;
        const totalChunks = chunks.length;
        
        if (totalChunks <= 25) {
          textsToSummarize = chunks;
        } else {
          const zones = [
            { start: 0, end: 0.10 },
            { start: 0.10, end: 0.30 },
            { start: 0.30, end: 0.60 },
            { start: 0.60, end: 0.90 },
            { start: 0.90, end: 1.0 },
          ];
          
          const chunksPerZone = 5;
          const sampledChunks: string[] = [];
          
          for (const zone of zones) {
            const zoneStart = Math.floor(totalChunks * zone.start);
            const zoneEnd = Math.floor(totalChunks * zone.end);
            const zoneChunks = chunks.slice(zoneStart, zoneEnd);
            
            if (zoneChunks.length <= chunksPerZone) {
              sampledChunks.push(...zoneChunks);
            } else {
              const step = Math.floor(zoneChunks.length / chunksPerZone);
              for (let i = 0; i < chunksPerZone; i++) {
                sampledChunks.push(zoneChunks[i * step]);
              }
            }
          }
          
          textsToSummarize = sampledChunks.slice(0, 25);
        }
      } else {
        const start = parseInt(pageStart) || 1;
        const end = parseInt(pageEnd) || start;
        
        if (start < 1 || end < start || start > document.totalPages) {
          throw new Error(`Please enter valid page numbers between 1 and ${document.totalPages}`);
        }

        textsToSummarize = document.chunks.filter((_, idx) => {
          const page = document.pageMap[idx];
          return page >= start && page <= end;
        });

        if (textsToSummarize.length === 0) {
          throw new Error("No content found in the specified page range");
        }
      }

      const res = await fetch("/v2/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: textsToSummarize }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Preview generation issue");

      setSummary(data.summary || "");
    } catch (err: any) {
      console.error("Direct summary error:", err);
      setError("We couldn't generate a quick overview right now.");
    } finally {
      setDirectSummarizing(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-[680px] mx-auto px-5 sm:px-8 py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <h1 className="font-serif text-2xl font-bold text-bone tracking-tight" data-testid="title">
              ArcRider
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-iris/15 text-iris rounded">
              V2
            </span>
          </div>
          <p className="text-ash text-base">
            Focus on the things that matter.
          </p>
          <a
            href="/v1"
            className="mt-2 inline-flex items-center gap-1 text-xs text-dusk hover:text-ash transition-colors"
          >
            Use V1 (slower)
          </a>
        </header>

        <div
          className={`relative p-8 rounded-xl border transition-all duration-200 ${
            isDragging
              ? "border-iris bg-iris/5"
              : document?.ready
              ? "border-sage/40 bg-sage/5"
              : "border-border bg-graphite hover:border-ash/30"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="upload-zone"
        >
          <div className="flex flex-col items-center gap-5">
            {document?.ready ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-sage/10 border border-sage/20 text-sage rounded text-xs font-medium mb-3">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Indexed &amp; Ready
                </div>
                <p className="font-semibold text-bone text-lg break-all line-clamp-2 max-w-full">{document.fileName}</p>
                <p className="text-xs text-ash mt-1">
                  {document.totalPages} pages &middot; {document.chunks.length} searchable sections
                </p>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-lg bg-elevated border border-border flex items-center justify-center">
                  <svg className="w-7 h-7 text-dusk" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium text-bone mb-1">
                    {file ? file.name : "Upload your material"}
                  </p>
                  <p className="text-xs text-dusk">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "PDF, DOCX, or EPUB \u00b7 Max 100MB"}
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.epub,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/epub+zip"
                  onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                  className="hidden"
                  data-testid="file-input"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 text-sm font-medium text-ash bg-elevated border border-border rounded-lg hover:text-bone hover:border-ash/30 active:scale-[0.98] transition-all"
                    data-testid="button-browse"
                  >
                    Browse files
                  </button>

                  {file && (
                    <button
                      onClick={processDocument}
                      disabled={extracting || embedding}
                      className="px-5 py-2.5 text-sm font-medium text-ink bg-ember rounded-lg hover:bg-ember-hover disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
                      data-testid="button-process"
                    >
                      {extracting ? "Reading document..." : embedding ? "Preparing..." : "Upload Document"}
                    </button>
                  )}
                </div>
              </>
            )}

            {(extracting || embedding) && (
              <div className="w-full max-w-sm mt-2">
                <div className="flex items-center gap-2 text-xs text-ash mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-iris animate-pulse" />
                  <span>{progress.step}</span>
                </div>
                <div className="w-full bg-elevated rounded-full h-1 overflow-hidden">
                  <div
                    className="h-full bg-iris transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="w-full max-w-sm p-4 bg-coral/5 border border-coral/20 rounded-lg" data-testid="error-message">
                <p className="text-sm text-coral">{error}</p>
              </div>
            )}
          </div>
        </div>

        {document?.ready && (
          <div className="mt-8 space-y-5">
            <div className="bg-graphite rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-semibold text-bone">
                  What are you looking for?
                </label>
                <button
                  onClick={() => {
                    setDocument(null);
                    setFile(null);
                    setResults([]);
                    setSummary("");
                    setQuery("");
                    setError(null);
                  }}
                  className="text-xs text-dusk hover:text-iris transition-colors"
                  data-testid="button-change-document"
                >
                  Change document
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={suggestedTopics ? `e.g., ${suggestedTopics}` : "e.g., key themes, main arguments, practical tips..."}
                  className="flex-1 px-4 py-3 bg-elevated border border-border rounded-lg text-bone text-sm placeholder:text-dusk focus:outline-none focus:ring-2 focus:ring-iris/50 focus:border-iris/50 transition"
                  data-testid="input-query"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !query.trim()}
                  className="px-5 py-3 text-sm font-semibold text-ink bg-ember rounded-lg hover:bg-ember-hover disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all whitespace-nowrap"
                  data-testid="button-search"
                >
                  {searching ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Find relevant sections"
                  )}
                </button>
              </div>
            </div>

            {(searching || results.length > 0) && submittedQuery && (
              <div className="flex items-start gap-2.5 px-4 py-3 bg-elevated border border-border rounded-lg text-sm">
                <svg className="w-4 h-4 text-iris flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-ash">
                  {searching ? (
                    `Searching for "${submittedQuery}"...`
                  ) : (
                    <>
                      <span className="font-semibold text-bone">Exploring:</span>{" "}
                      {queryInterpretation || submittedQuery}
                    </>
                  )}
                </span>
              </div>
            )}

            {results.length > 0 && (
              <div className="bg-graphite rounded-xl border border-border overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-border">
                  <button
                    onClick={() => setShowResults(!showResults)}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-md bg-sage/10 text-sage font-bold text-xs flex-shrink-0">
                      {results.length}
                    </span>
                    <span className="text-bone font-semibold text-sm">
                      Relevant sections found
                    </span>
                    <svg
                      className={`w-4 h-4 text-dusk transition-transform flex-shrink-0 ${showResults ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleSummarize}
                    disabled={summarizing}
                    className="px-4 py-2 text-xs font-semibold text-bone bg-iris/15 border border-iris/20 rounded-lg hover:bg-iris/25 disabled:opacity-40 transition-all whitespace-nowrap self-start sm:self-auto"
                    data-testid="button-summarize"
                  >
                    {summarizing ? "Summarizing..." : "Summarize these"}
                  </button>
                </div>

                {showResults && (
                  <div className="divide-y divide-border">
                    {results.map((group, idx) => (
                      <div
                        key={`${group.startPage}-${idx}`}
                        className="p-5 hover:bg-elevated/50 transition-colors"
                        data-testid={`result-item-${idx}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-base font-bold text-bone">
                            {formatPageRange(group)}
                          </h3>
                          <span className="flex-shrink-0 px-2.5 py-0.5 text-xs font-bold rounded bg-sage/10 text-sage border border-sage/20">
                            {group.score}%
                          </span>
                        </div>
                        <p className="text-sm text-ash leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {summary && (
              <div className="space-y-5">
                {(() => {
                  const lines = summary.split("\n").filter(Boolean);
                  const tldrIdx = lines.findIndex(l => l.toLowerCase().includes("tl;dr") || l.toLowerCase().includes("tldr"));
                  const summaryIdx = lines.findIndex(l => l.toLowerCase().match(/^#+?\s*(summary|detailed)/i));
                  
                  const tldrLines = tldrIdx !== -1 
                    ? lines.slice(tldrIdx + 1, summaryIdx !== -1 ? summaryIdx : undefined).filter(l => l.trim().startsWith("-") || l.trim().startsWith("\u2022") || l.trim().match(/^\d+\./))
                    : [];
                  
                  const summaryLines = summaryIdx !== -1 
                    ? lines.slice(summaryIdx + 1)
                    : (tldrIdx === -1 ? lines : []);

                  return (
                    <>
                      {tldrLines.length > 0 && (
                        <div className="bg-graphite rounded-xl border border-sage/20 p-6">
                          <h3 className="text-base font-bold text-bone mb-4 flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                            TL;DR
                          </h3>
                          <ul className="space-y-3">
                            {tldrLines.map((line, i) => {
                              const text = line.replace(/^[-\u2022]\s*/, "").replace(/^\d+\.\s*/, "").trim();
                              const parts = text.split(/\*\*(.+?)\*\*/g);
                              return (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-sage/60 flex-shrink-0" />
                                  <span className="text-sm text-ash leading-relaxed">
                                    {parts.map((part, j) => 
                                      j % 2 === 1 ? <strong key={j} className="text-bone font-semibold">{part}</strong> : part
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {summaryLines.length > 0 && (
                        <div className="bg-graphite rounded-xl border border-iris/20 p-6">
                          <h3 className="text-base font-bold text-bone mb-4 flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-iris" />
                            Detailed Summary
                          </h3>
                          <div className="space-y-3">
                            {summaryLines.map((line, i) => {
                              const isBullet = line.trim().startsWith("-") || line.trim().startsWith("\u2022") || line.trim().match(/^\d+\./);
                              const text = line.replace(/^[-\u2022]\s*/, "").replace(/^\d+\.\s*/, "").trim();
                              const parts = text.split(/\*\*(.+?)\*\*/g);
                              const renderText = parts.map((part, j) => 
                                j % 2 === 1 ? <strong key={j} className="text-bone font-semibold">{part}</strong> : part
                              );
                              
                              if (isBullet) {
                                return (
                                  <div key={i} className="flex items-start gap-3 pl-1">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-iris/50 flex-shrink-0" />
                                    <span className="text-sm text-ash leading-relaxed">{renderText}</span>
                                  </div>
                                );
                              }
                              return (
                                <p key={i} className="text-sm text-ash leading-relaxed">
                                  {renderText}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {tldrLines.length === 0 && summaryLines.length === 0 && (
                        <div className="bg-graphite rounded-xl border border-iris/20 p-6">
                          <h3 className="text-base font-bold text-bone mb-4 flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-iris" />
                            Summary
                          </h3>
                          <div className="space-y-3">
                            {lines.map((line, i) => {
                              const parts = line.split(/\*\*(.+?)\*\*/g);
                              return (
                                <p key={i} className="text-sm text-ash leading-relaxed">
                                  {parts.map((part, j) => 
                                    j % 2 === 1 ? <strong key={j} className="text-bone font-semibold">{part}</strong> : part
                                  )}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}

            {!searching && results.length === 0 && query && (
              <div className="text-center py-12">
                <div className="w-14 h-14 mx-auto mb-4 rounded-lg bg-elevated border border-border flex items-center justify-center">
                  <svg className="w-7 h-7 text-dusk" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-sm text-ash">No relevant sections found. Try different search terms.</p>
              </div>
            )}

            <div className="bg-graphite rounded-xl border border-border p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-iris" />
                <h2 className="text-base font-semibold text-bone">
                  Or summarize directly
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-5">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="directMode"
                      checked={directSummaryMode === "full"}
                      onChange={() => setDirectSummaryMode("full")}
                      className="w-4 h-4 text-iris bg-elevated border-border focus:ring-iris accent-iris"
                    />
                    <span className="text-sm text-ash group-hover:text-bone transition-colors">Entire document</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="directMode"
                      checked={directSummaryMode === "range"}
                      onChange={() => setDirectSummaryMode("range")}
                      className="w-4 h-4 text-iris bg-elevated border-border focus:ring-iris accent-iris"
                    />
                    <span className="text-sm text-ash group-hover:text-bone transition-colors">Page range</span>
                  </label>

                  {directSummaryMode === "range" && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max={document?.totalPages || 999}
                        value={pageStart}
                        onChange={(e) => setPageStart(e.target.value)}
                        placeholder="From"
                        className="w-20 px-3 py-2 bg-elevated border border-border rounded-lg text-bone text-sm placeholder:text-dusk focus:outline-none focus:ring-2 focus:ring-iris/50 focus:border-iris/50"
                      />
                      <span className="text-dusk text-xs">to</span>
                      <input
                        type="number"
                        min="1"
                        max={document?.totalPages || 999}
                        value={pageEnd}
                        onChange={(e) => setPageEnd(e.target.value)}
                        placeholder="To"
                        className="w-20 px-3 py-2 bg-elevated border border-border rounded-lg text-bone text-sm placeholder:text-dusk focus:outline-none focus:ring-2 focus:ring-iris/50 focus:border-iris/50"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDirectSummary}
                  disabled={directSummarizing || summarizing}
                  className="px-5 py-2.5 text-sm font-semibold text-bone bg-iris/15 border border-iris/20 rounded-lg hover:bg-iris/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  data-testid="button-direct-summary"
                >
                  {directSummarizing ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    "Generate summary"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
