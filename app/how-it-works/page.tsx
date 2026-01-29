"use client";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            How ArcRider Works
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Skip the fluff. Find exactly what you need in any document using AI-powered semantic search.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Upload Your Document
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Drop any PDF, DOCX, or EPUB file (up to 50MB). ArcRider extracts all the text and breaks it into searchable sections, tracking page numbers so you always know where to find things.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Tell Us What You Care About
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Type what you're interested in - "investment strategies", "time management tips", "character development". ArcRider uses AI to understand the meaning behind your words, not just match keywords.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Get Relevant Sections with Page Numbers
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  ArcRider finds and groups the most relevant pages, tells you exactly why each section matters to your interest, and shows you the page ranges so you can jump right to the source material.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">4</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Generate Focused Summaries
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Get AI-generated summaries that focus specifically on what you care about. The TL;DR gives you quick bullet points, while the detailed summary dives deeper into the key insights and actionable takeaways.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 p-8">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Why Semantic Search?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Understands Meaning
              </h3>
              <p className="text-slate-300 text-sm">
                Search for "saving money" and find sections about budgeting, frugality, and financial planning - even if those exact words aren't used.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Finds Related Concepts
              </h3>
              <p className="text-slate-300 text-sm">
                The AI connects related ideas, so you won't miss relevant content just because the author used different terminology.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Ranks by Relevance
              </h3>
              <p className="text-slate-300 text-sm">
                Results are scored by how relevant they are to your interest, so the most important sections appear first.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Explains Why
              </h3>
              <p className="text-slate-300 text-sm">
                Each result includes an AI-generated explanation of why that section is relevant to what you're looking for.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Try ArcRider Now
          </a>
        </div>
      </div>
    </div>
  );
}
