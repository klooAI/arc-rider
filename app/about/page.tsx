"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered Document Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Find What Matters.<br />
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Skip What Doesn't.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            ArcRider uses AI to surface the most relevant parts of any document based on what you're actually looking for.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8 hover:border-slate-600/50 transition">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-5 border border-blue-500/20">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">For Students</h3>
            <p className="text-slate-400 leading-relaxed">
              Extract key concepts from textbooks and research papers. Get to the insights faster without reading cover to cover.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8 hover:border-slate-600/50 transition">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-5 border border-emerald-500/20">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">For Professionals</h3>
            <p className="text-slate-400 leading-relaxed">
              Navigate reports, whitepapers, and documentation with precision. Find answers in seconds instead of hours.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8 hover:border-slate-600/50 transition">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-5 border border-amber-500/20">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">For Curious Minds</h3>
            <p className="text-slate-400 leading-relaxed">
              Explore books and documents on your own terms. Dive deep into topics that interest you without the filler.
            </p>
          </div>

          <div className="bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 p-8 hover:border-slate-600/50 transition">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center mb-5 border border-violet-500/20">
              <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">For ADHD Brains</h3>
            <p className="text-slate-400 leading-relaxed">
              Hyperfocus on what interests you. Skip the rest guilt-free. Get quick wins instead of overwhelming commitments.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 rounded-3xl border border-violet-500/20 p-10 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-3">
              Semantic Search, Not Keyword Matching
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              ArcRider understands meaning. Search for "how to save money" and find sections about budgeting, frugality, and financial planning—even if those exact words aren't used.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <span className="text-2xl">📄</span>
              </div>
              <h4 className="font-medium text-white mb-1">PDF</h4>
              <p className="text-sm text-slate-500">Books, reports, papers</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <span className="text-2xl">📝</span>
              </div>
              <h4 className="font-medium text-white mb-1">DOCX</h4>
              <p className="text-sm text-slate-500">Word documents</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/80 flex items-center justify-center mx-auto mb-4 border border-slate-700">
                <span className="text-2xl">📚</span>
              </div>
              <h4 className="font-medium text-white mb-1">EPUB</h4>
              <p className="text-sm text-slate-500">E-books</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-xl shadow-violet-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Get Started Free
          </a>
          <p className="mt-4 text-slate-500 text-sm">
            No account required
          </p>
        </div>
      </div>
    </div>
  );
}
