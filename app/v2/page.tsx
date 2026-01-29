"use client";

import React, { useState, useCallback, useRef } from "react";

type SearchResult = {
  chunkIndex: number;
  score: number;
  text: string;
  page: number;
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
  const [results, setResults] = useState<SearchResult[]>([]);
  const [streamingResults, setStreamingResults] = useState<SearchResult[]>([]);

  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);

  const MAX_FILE_SIZE = 50 * 1024 * 1024;

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
    setProgress({ step: "Extracting text...", percent: 10 });

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

      setProgress({ step: "Creating semantic index...", percent: 40 });
      setExtracting(false);
      setEmbedding(true);

      const embeddingRes = await fetch("/v2/api/embeddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chunks }),
      });
      const embeddingData = await embeddingRes.json();
      if (!embeddingRes.ok) throw new Error(embeddingData.error || "Embedding failed");

      setProgress({ step: "Ready!", percent: 100 });

      setDocument({
        fileName: file.name,
        chunks,
        pageMap,
        embeddings: embeddingData.embeddings,
        docType,
        totalPages,
        ready: true,
      });
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
    setStreamingResults([]);
    setSummary("");
    setError(null);

    try {
      const res = await fetch("/v2/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: query.trim(),
          chunks: document.chunks,
          embeddings: document.embeddings,
          pageMap: document.pageMap,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Search failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";
      const accumulated: SearchResult[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.result) {
                accumulated.push(data.result);
                setStreamingResults([...accumulated]);
              }
              if (data.done) {
                setResults(accumulated);
              }
            } catch {}
          }
        }
      }

      if (accumulated.length === 0) {
        setResults([]);
      }
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
      const topTexts = results.slice(0, 10).map((r) => r.text);
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

  const displayResults = searching ? streamingResults : results;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 px-4 sm:px-6 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2" data-testid="title">
            ArcRider V2
          </h1>
          <p className="text-lg text-gray-600">
            Lightning-fast semantic search powered by embeddings
          </p>
          <a href="/" className="text-sm text-blue-500 hover:underline mt-2 inline-block">
            ← Back to V1
          </a>
        </header>

        <div
          className={`p-8 rounded-2xl border-2 border-dashed transition-all ${
            isDragging
              ? "border-blue-500 bg-blue-50/50"
              : document?.ready
              ? "border-green-300 bg-green-50/50"
              : "border-gray-300 bg-white/80 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          data-testid="upload-zone"
        >
          <div className="flex flex-col items-center gap-4">
            {document?.ready ? (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Ready to search
                </div>
                <p className="font-medium text-gray-800">{document.fileName}</p>
                <p className="text-sm text-gray-500">
                  {document.chunks.length} sections indexed
                </p>
              </div>
            ) : (
              <>
                <div className="text-center">
                  <p className="font-medium text-gray-700 mb-1">
                    {file ? file.name : "Drop your document here"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
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
                    className="px-5 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition shadow-sm"
                    data-testid="button-browse"
                  >
                    Browse files
                  </button>

                  {file && !document?.ready && (
                    <button
                      onClick={processDocument}
                      disabled={extracting || embedding}
                      className="px-5 py-2.5 font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition shadow-sm"
                      data-testid="button-process"
                    >
                      {extracting
                        ? "Extracting..."
                        : embedding
                        ? "Indexing..."
                        : "Process document"}
                    </button>
                  )}
                </div>
              </>
            )}

            {(extracting || embedding) && (
              <div className="w-full max-w-md mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                  <span>{progress.step}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${progress.percent}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 w-full max-w-md" data-testid="error-message">
                {error}
              </p>
            )}
          </div>
        </div>

        {document?.ready && (
          <div className="mt-8 space-y-6">
            <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                What are you looking for?
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="e.g., saving money, networking tips, dealing with failure..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  data-testid="input-query"
                />
                <button
                  onClick={handleSearch}
                  disabled={searching || !query.trim()}
                  className="px-6 py-3 font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 transition shadow-sm"
                  data-testid="button-search"
                >
                  {searching ? "Searching..." : "Search"}
                </button>
              </div>

              {searching && (
                <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Finding relevant sections...
                </p>
              )}
            </div>

            {displayResults.length > 0 && (
              <div className="bg-white/80 backdrop-blur rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {displayResults.length} relevant section
                    {displayResults.length !== 1 ? "s" : ""} found
                  </h3>
                  {results.length > 0 && (
                    <button
                      onClick={handleSummarize}
                      disabled={summarizing}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition"
                      data-testid="button-summarize"
                    >
                      {summarizing ? "Summarizing..." : "Summarize these"}
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {displayResults.map((result, idx) => (
                    <div
                      key={`${result.chunkIndex}-${idx}`}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition"
                      data-testid={`result-item-${idx}`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <span className="text-sm font-semibold text-gray-900">
                          {document?.docType === "epub" ? `Chapter ${result.page}` : `Page ${result.page}`}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            result.score >= 0.8
                              ? "bg-green-100 text-green-700"
                              : result.score >= 0.6
                              ? "bg-blue-100 text-blue-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {Math.round(result.score * 100)}% match
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                        {result.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summary && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-200 p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  Summary
                </h3>
                <div className="prose prose-sm text-gray-700 max-w-none">
                  {summary.split("\n").map((line, i) => (
                    <p key={i} className="mb-2">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {!searching && results.length === 0 && query && (
              <p className="text-center text-gray-500 py-8">
                No relevant sections found. Try different search terms.
              </p>
            )}
          </div>
        )}

        {document?.ready && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setFile(null);
                setDocument(null);
                setResults([]);
                setSummary("");
                setQuery("");
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
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
