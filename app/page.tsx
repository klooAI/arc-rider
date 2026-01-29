"use client";

import React from "react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            AI-Powered Reading Companion
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Find what matters{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
              in any book
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any book and instantly find the parts that actually matter to you. 
            Skip the fluff, dive into what sparks your curiosity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tool"
              className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
            >
              Try it free
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 text-lg font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Start with what's relevant to you.
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              You bought the book. You want to learn. But 300 pages feels impossible when only 20 pages actually matter to you right now.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Time drain</h3>
              <p className="text-slate-400">Hours spent reading chapters that aren't relevant to what you actually want to learn.</p>
            </div>
            
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lost interest</h3>
              <p className="text-slate-400">Your excitement fades before you reach the good parts. The book joins the unfinished pile.</p>
            </div>
            
            <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">ADHD brain</h3>
              <p className="text-slate-400">Your mind craves the interesting stuff. Linear reading fights against how your brain naturally works.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Read smarter, not harder
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              ArcRider uses AI to understand meaning, not just keywords. Tell it what you're curious about and it finds exactly those sections.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Semantic search</h3>
                <p className="text-slate-400">Search with keywords, themes, emotions, or abstract concepts. The AI understands meaning, so you'll find relevant sections even when the exact words don't appear.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Page-level precision</h3>
                <p className="text-slate-400">Get exact page numbers. Open your book, flip to that page, and start reading what matters.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">AI summaries</h3>
                <p className="text-slate-400">Get quick summaries of the relevant sections so you know if it's worth diving deeper.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Zero guilt</h3>
                <p className="text-slate-400">Finally, permission to skip what doesn't serve you. Read books your way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADHD Section */}
      <section className="py-20 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-3xl p-8 sm:p-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Built for ADHD brains
              </h2>
            </div>
            
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              We get it. Your brain wants to hyperfocus on the interesting parts, not trudge through 50 pages of setup. ArcRider lets you follow your curiosity instead of fighting it.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="w-2 h-2 bg-violet-400 rounded-full" />
                Jump straight to what sparks your interest
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="w-2 h-2 bg-violet-400 rounded-full" />
                Quick wins to build momentum
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="w-2 h-2 bg-violet-400 rounded-full" />
                Skip without guilt
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="w-2 h-2 bg-violet-400 rounded-full" />
                Finish more books, finally
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-slate-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Three steps to focused reading
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Upload</h3>
              <p className="text-slate-400">Drop your PDF, EPUB, or DOCX. We support books up to 200MB.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Search</h3>
              <p className="text-slate-400">Tell us what you're looking for. The AI finds semantically relevant sections.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Read</h3>
              <p className="text-slate-400">Get page numbers and summaries. Open your book and dive in.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to read differently?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Upload your first book and discover what's been waiting for you.
          </p>
          <a
            href="/tool"
            className="inline-block px-10 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
          >
            Get started free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} ArcRider. Focus your reading.
        </div>
      </footer>
    </div>
  );
}
