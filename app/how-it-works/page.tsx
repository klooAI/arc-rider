"use client";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Simple 4-Step Process
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            From Document to Insight<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">In Under a Minute</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload any document, tell us what you're looking for, and get exactly the pages and summaries you need.
          </p>
        </header>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-fuchsia-500/50 to-transparent hidden md:block" />

          <div className="space-y-12">
            <div className="relative flex gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
              </div>
              <div className="flex-1 bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8">
                <div className="md:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Upload Your Document
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Drag and drop any PDF, Word document, or ebook. We support files up to 200MB, which covers most books and documents you'll ever need.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm">PDF</span>
                  <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm">DOCX</span>
                  <span className="px-3 py-1 rounded-full bg-slate-700/50 text-slate-300 text-sm">EPUB</span>
                </div>
              </div>
            </div>

            <div className="relative flex gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
              </div>
              <div className="flex-1 bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8">
                <div className="md:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Describe What You Need
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Type what you're looking for in plain language. Our AI understands context and meaning, not just keywords.
                </p>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-500 text-sm mb-2">Example searches:</p>
                  <div className="space-y-2">
                    <p className="text-slate-300 text-sm">"practical tips for managing anxiety"</p>
                    <p className="text-slate-300 text-sm">"the author's main argument about climate policy"</p>
                    <p className="text-slate-300 text-sm">"investment strategies for beginners"</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
              </div>
              <div className="flex-1 bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8">
                <div className="md:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Get Precise Results
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Receive a ranked list of relevant sections with exact page numbers and AI-generated explanations of why each matters. Optionally, generate a focused summary.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-emerald-400 font-medium mb-1">Page Numbers</div>
                    <p className="text-slate-500 text-sm">Know exactly where to look</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-emerald-400 font-medium mb-1">Relevance Scores</div>
                    <p className="text-slate-500 text-sm">Most important first</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
              </div>
              <div className="flex-1 bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8">
                <div className="md:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4">
                  <span className="text-lg font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Get AI Summaries
                </h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Want the key points without reading? Generate focused summaries tailored to your specific interest. Get a quick TL;DR plus a detailed breakdown of the most important insights.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-emerald-400 font-medium mb-1">TL;DR</div>
                    <p className="text-slate-500 text-sm">Quick bullet points</p>
                  </div>
                  <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="text-emerald-400 font-medium mb-1">Detailed Summary</div>
                    <p className="text-slate-500 text-sm">In-depth analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl border border-violet-500/20 p-10">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Why It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Semantic Understanding</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Finds related concepts even when different words are used. Search "productivity" and find sections on time management, focus, and efficiency.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Lightning Fast</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Results in seconds. What would take hours of reading happens almost instantly.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Focused Summaries</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  AI summaries tailored to your specific question, not generic overviews of the entire document.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 border border-emerald-500/20">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Verifiable Results</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Every result includes page numbers so you can go directly to the source and verify.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-xl shadow-violet-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Try It Now
          </a>
          <p className="mt-4 text-slate-500 text-sm">
            Free to use · No account required
          </p>
        </div>
      </div>
    </div>
  );
}
