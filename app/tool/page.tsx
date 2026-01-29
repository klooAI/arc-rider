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

  const MAX_FILE_SIZE = 200 * 1024 * 1024;

  const validateFile = useCallback((f: File): string | null => {
    const name = f.name.toLowerCase();
    if (![".pdf", ".docx", ".epub"].some((ext) => name.endsWith(ext))) {
      return "Please upload a PDF, DOCX, or EPUB file.";
    }
    if (f.size > MAX_FILE_SIZE) {
      return "File too large. Maximum size is 50MB.";
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

      // Get suggested search topics based on the book
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
        // Ignore suggestion errors
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to process document");
    } finally {
      setExtracting(false);
      setEmbedding(false);
    }
  }

  async function handleSearch() {
    if (!document?.ready || !query.trim()) return;

    setSearching(true);
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

      setResults(data.groups || []);
      setTotalMatches(data.totalMatches || 0);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Search failed");
    } finally {
      setSearching(false);
    }
  }

  async function handleSummarize() {
    if (!results.length) return;

    setSummarizing(true);
    setSummary("");
    setError(null);

    try {
      const topTexts = results.slice(0, 8).map((r) => r.sampleText);
      const res = await fetch("/v2/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texts: topTexts, query: query.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Summary failed");

      setSummary(data.summary || "");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate summary");
    } finally {
      setSummarizing(false);
    }
  }

  function formatPageRange(group: PageGroup): string {
    const label = document?.docType === "epub" ? "Chapter" : "Page";
    if (group.startPage === group.endPage) {
      return `${label} ${group.startPage}`;
    }
    return `${label}s ${group.startPage}–${group.endPage}`;
  }

  async function handleDirectSummary() {
    if (!document?.ready) return;

    setDirectSummarizing(true);
    setSummary("");
    setError(null);

    try {
      let textsToSummarize: string[] = [];

      if (directSummaryMode === "full") {
        textsToSummarize = document.chunks.slice(0, 50);
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
      if (!res.ok) throw new Error(data.error || "Summary failed");

      setSummary(data.summary || "");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate summary");
    } finally {
      setDirectSummarizing(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white" data-testid="title">
              ArcRider
            </h1>
            <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full">
              V2
            </span>
          </div>
          <p className="text-slate-400 text-lg">
            Focus on the things that matter.
          </p>
          <a
            href="/v1"
            className="mt-3 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition"
          >
            Use V1 (slower)
          </a>
        </header>

        <div
          className={`relative p-8 rounded-2xl border-2 border-dashed transition-all duration-300 ${
            isDragging
              ? "border-violet-400 bg-violet-500/10"
              : document?.ready
              ? "border-emerald-400/50 bg-emerald-500/5"
              : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="upload-zone"
        >
          <div className="flex flex-col items-center gap-5">
            {document?.ready ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full text-sm font-medium mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Indexed & Ready
                </div>
                <p className="font-semibold text-white text-lg break-all line-clamp-2 max-w-full">{document.fileName}</p>
                <p className="text-sm text-slate-400 mt-1">
                  {document.totalPages} pages • {document.chunks.length} searchable sections
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="font-medium text-white mb-1">
                    {file ? file.name : "Upload your material"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "PDF, DOCX, or EPUB • Max 200MB"}
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
                    className="px-5 py-2.5 font-medium text-slate-300 bg-slate-700 border border-slate-600 rounded-xl hover:bg-slate-600 transition"
                    data-testid="button-browse"
                  >
                    Browse files
                  </button>

                  {file && (
                    <button
                      onClick={processDocument}
                      disabled={extracting || embedding}
                      className="px-5 py-2.5 font-medium text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 transition shadow-lg shadow-violet-500/25"
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
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                  <span>{progress.step}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="w-full max-w-sm p-4 bg-red-500/10 border border-red-500/30 rounded-xl" data-testid="error-message">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        </div>

        {document?.ready && (
          <div className="mt-8 space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-6">
              <label className="block text-lg font-semibold text-white mb-4">
                What are you looking for?
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={suggestedTopics ? `e.g., ${suggestedTopics}` : "e.g., key themes, main arguments, practical tips..."}
                  className="flex-1 px-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
                  data-testid="input-query"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !query.trim()}
                  className="px-6 py-3.5 font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-emerald-500/25 whitespace-nowrap"
                  data-testid="button-search"
                >
                  {searching ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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

            {results.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-700">
                  <button
                    onClick={() => setShowResults(!showResults)}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold text-sm flex-shrink-0">
                      {results.length}
                    </span>
                    <span className="text-white font-semibold text-sm sm:text-base">
                      Relevant sections found
                    </span>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${showResults ? "rotate-180" : ""}`}
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
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-lg hover:from-violet-400 hover:to-fuchsia-400 disabled:opacity-50 transition whitespace-nowrap self-start sm:self-auto"
                    data-testid="button-summarize"
                  >
                    {summarizing ? "Summarizing..." : "Summarize these"}
                  </button>
                </div>

                {showResults && (
                  <div className="divide-y divide-slate-700/50">
                    {results.map((group, idx) => (
                      <div
                        key={`${group.startPage}-${idx}`}
                        className="p-5 hover:bg-slate-700/20 transition"
                        data-testid={`result-item-${idx}`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {formatPageRange(group)}
                          </h3>
                          <span className="flex-shrink-0 px-3 py-1 text-sm font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            {group.score}%
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">
                          {group.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {summary && (
              <div className="space-y-6">
                {(() => {
                  const lines = summary.split("\n").filter(Boolean);
                  const tldrIdx = lines.findIndex(l => l.toLowerCase().includes("tl;dr") || l.toLowerCase().includes("tldr"));
                  const summaryIdx = lines.findIndex(l => l.toLowerCase().match(/^#+?\s*(summary|detailed)/i));
                  
                  const tldrLines = tldrIdx !== -1 
                    ? lines.slice(tldrIdx + 1, summaryIdx !== -1 ? summaryIdx : undefined).filter(l => l.trim().startsWith("-") || l.trim().startsWith("•") || l.trim().match(/^\d+\./))
                    : [];
                  
                  const summaryLines = summaryIdx !== -1 
                    ? lines.slice(summaryIdx + 1)
                    : (tldrIdx === -1 ? lines : []);

                  return (
                    <>
                      {tldrLines.length > 0 && (
                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/30 p-6">
                          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            TL;DR
                          </h3>
                          <ul className="space-y-3">
                            {tldrLines.map((line, i) => {
                              const text = line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "").trim();
                              const parts = text.split(/\*\*(.+?)\*\*/g);
                              return (
                                <li key={i} className="flex items-start gap-3">
                                  <span className="mt-2 w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                                  <span className="text-slate-200 leading-relaxed">
                                    {parts.map((part, j) => 
                                      j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
                                    )}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {summaryLines.length > 0 && (
                        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 p-6">
                          <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                              <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            Detailed Summary
                          </h3>
                          <div className="space-y-4">
                            {summaryLines.map((line, i) => {
                              const isBullet = line.trim().startsWith("-") || line.trim().startsWith("•") || line.trim().match(/^\d+\./);
                              const text = line.replace(/^[-•]\s*/, "").replace(/^\d+\.\s*/, "").trim();
                              const parts = text.split(/\*\*(.+?)\*\*/g);
                              const renderText = parts.map((part, j) => 
                                j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
                              );
                              
                              if (isBullet) {
                                return (
                                  <div key={i} className="flex items-start gap-3 pl-2">
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                    <span className="text-slate-300 leading-relaxed">{renderText}</span>
                                  </div>
                                );
                              }
                              return (
                                <p key={i} className="text-slate-300 leading-relaxed">
                                  {renderText}
                                </p>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {tldrLines.length === 0 && summaryLines.length === 0 && (
                        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 p-6">
                          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Summary
                          </h3>
                          <div className="space-y-3">
                            {lines.map((line, i) => {
                              const parts = line.split(/\*\*(.+?)\*\*/g);
                              return (
                                <p key={i} className="text-slate-300 leading-relaxed">
                                  {parts.map((part, j) => 
                                    j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
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
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-slate-400">No relevant sections found. Try different search terms.</p>
              </div>
            )}

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur rounded-2xl border border-slate-700/50 p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/30">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold text-white">
                  Or summarize directly
                </h2>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="directMode"
                      checked={directSummaryMode === "full"}
                      onChange={() => setDirectSummaryMode("full")}
                      className="w-4 h-4 text-violet-500 bg-slate-700 border-slate-600 focus:ring-violet-500 focus:ring-offset-slate-800 accent-violet-500"
                    />
                    <span className="text-slate-300 group-hover:text-white transition">Entire document</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="directMode"
                      checked={directSummaryMode === "range"}
                      onChange={() => setDirectSummaryMode("range")}
                      className="w-4 h-4 text-violet-500 bg-slate-700 border-slate-600 focus:ring-violet-500 focus:ring-offset-slate-800 accent-violet-500"
                    />
                    <span className="text-slate-300 group-hover:text-white transition">Page range</span>
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
                        className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                      <span className="text-slate-500 text-sm">to</span>
                      <input
                        type="number"
                        min="1"
                        max={document?.totalPages || 999}
                        value={pageEnd}
                        onChange={(e) => setPageEnd(e.target.value)}
                        placeholder="To"
                        className="w-20 px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-lg text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDirectSummary}
                  disabled={directSummarizing || summarizing}
                  className="px-5 py-2.5 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg shadow-violet-500/20"
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

        {document?.ready && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setFile(null);
                setDocument(null);
                setResults([]);
                setSummary("");
                setQuery("");
              }}
              className="text-sm text-slate-500 hover:text-slate-300 transition"
              data-testid="button-reset"
            >
              Upload a different document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
