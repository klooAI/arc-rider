"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            About ArcRider
          </h1>
          <p className="text-xl text-slate-400">
            AI-powered document analysis that helps you focus on what matters.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              The Problem
            </h2>
            <p className="text-slate-300 leading-relaxed">
              You've got a 300-page book or a dense PDF report. You don't need to read the whole thing - you just want the parts relevant to your specific interest. Traditional search finds exact words, but what you really need is something that understands meaning.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Our Solution
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              ArcRider uses advanced AI to understand the semantic meaning of your documents. Tell it what you care about in natural language, and it finds the relevant sections - even when the author uses different words to describe the same concepts.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Every result comes with page numbers so you can verify and dive deeper, plus AI-generated explanations of why each section matters to your interest.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Two Versions
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full">
                  V2
                </span>
                <div>
                  <h3 className="font-medium text-white">Current Version</h3>
                  <p className="text-slate-400 text-sm">
                    Uses embeddings for lightning-fast search with high-quality AI explanations. Best for most users.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded-full">
                  V1
                </span>
                <div>
                  <h3 className="font-medium text-white">Classic Version</h3>
                  <p className="text-slate-400 text-sm">
                    Uses direct GPT-4 analysis for maximum accuracy. Takes longer but can be more precise for complex queries.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Supported Formats
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-white font-medium">PDF</div>
                <div className="text-slate-400 text-sm">Books, reports, papers</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-white font-medium">DOCX</div>
                <div className="text-slate-400 text-sm">Word documents</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-white font-medium">EPUB</div>
                <div className="text-slate-400 text-sm">E-books</div>
              </div>
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
