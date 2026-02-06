"use client";

import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <section className="pt-24 pb-28 sm:pt-32 sm:pb-36">
        <div className="max-w-[720px] mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm font-medium tracking-wide uppercase text-iris mb-8">
            AI-Powered Reading Companion
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-[3.5rem] font-bold text-bone mb-6 leading-[1.15] tracking-tight">
            Find what matters{" "}
            <span className="text-iris">
              in any book
            </span>
          </h1>

          <p className="text-lg text-ash max-w-xl mx-auto mb-12 leading-relaxed">
            Upload any book and instantly find the parts that actually matter to you.
            Skip the fluff, dive into what sparks your curiosity.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="px-8 py-3.5 text-base font-semibold text-ink bg-ember rounded-lg hover:bg-ember-hover active:scale-[0.98] transition-all"
            >
              Try it free
            </a>
            <a
              href="/how-it-works"
              className="px-8 py-3.5 text-base font-semibold text-bone border border-border rounded-lg hover:border-ash hover:bg-graphite active:scale-[0.98] transition-all"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 border-t border-border-subtle">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bone mb-4 tracking-tight">
              Start with what&apos;s relevant to you.
            </h2>
            <p className="text-lg text-ash max-w-2xl mx-auto leading-relaxed">
              You bought the book. You want to learn. But 300 pages feels impossible when only 20 pages actually matter to you right now.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-6 bg-graphite border border-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-bone mb-2">Time drain</h3>
              <p className="text-sm text-ash leading-relaxed">Hours spent reading chapters that aren&apos;t relevant to what you actually want to learn.</p>
            </div>

            <div className="p-6 bg-graphite border border-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-ember/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-bone mb-2">Lost interest</h3>
              <p className="text-sm text-ash leading-relaxed">Your excitement fades before you reach the good parts. The book joins the unfinished pile.</p>
            </div>

            <div className="p-6 bg-graphite border border-border rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-iris/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-iris" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-bone mb-2">ADHD brain</h3>
              <p className="text-sm text-ash leading-relaxed">Your mind craves the interesting stuff. Linear reading fights against how your brain naturally works.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 border-t border-border-subtle">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bone mb-4 tracking-tight">
              Read smarter, not harder
            </h2>
            <p className="text-lg text-ash max-w-2xl mx-auto leading-relaxed">
              ArcRider uses AI to understand meaning, not just keywords. Tell it what you&apos;re curious about and it finds exactly those sections.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/40 flex-shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-bone mb-1.5">Semantic search</h3>
                <p className="text-sm text-ash leading-relaxed">Search with keywords, themes, emotions, or abstract concepts. The AI understands meaning, so you&apos;ll find relevant sections even when the exact words don&apos;t appear.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/40 flex-shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-bone mb-1.5">Page-level precision</h3>
                <p className="text-sm text-ash leading-relaxed">Get exact page numbers. Open your book, flip to that page, and start reading what matters.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/40 flex-shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-bone mb-1.5">AI summaries</h3>
                <p className="text-sm text-ash leading-relaxed">Get quick summaries of the relevant sections so you know if it&apos;s worth diving deeper.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/40 flex-shrink-0" />
              <div>
                <h3 className="text-base font-semibold text-bone mb-1.5">Zero guilt</h3>
                <p className="text-sm text-ash leading-relaxed">Finally, permission to skip what doesn&apos;t serve you. Read books your way.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 border-t border-border-subtle">
        <div className="max-w-[720px] mx-auto px-5 sm:px-8">
          <div className="bg-graphite border border-iris/20 rounded-xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full bg-iris" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bone tracking-tight">
                Built for ADHD brains
              </h2>
            </div>

            <p className="text-base text-ash mb-8 leading-relaxed">
              We get it. Your brain wants to hyperfocus on the interesting parts, not trudge through 50 pages of setup. ArcRider lets you follow your curiosity instead of fighting it.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 text-sm text-ash">
                <span className="w-1.5 h-1.5 bg-iris rounded-full flex-shrink-0" />
                Jump straight to what sparks your interest
              </div>
              <div className="flex items-center gap-3 text-sm text-ash">
                <span className="w-1.5 h-1.5 bg-iris rounded-full flex-shrink-0" />
                Quick wins to build momentum
              </div>
              <div className="flex items-center gap-3 text-sm text-ash">
                <span className="w-1.5 h-1.5 bg-iris rounded-full flex-shrink-0" />
                Skip without guilt
              </div>
              <div className="flex items-center gap-3 text-sm text-ash">
                <span className="w-1.5 h-1.5 bg-iris rounded-full flex-shrink-0" />
                Finish more books, finally
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24 border-t border-border-subtle bg-graphite/50">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bone mb-4 tracking-tight">
              Three steps to focused reading
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-elevated border border-border flex items-center justify-center text-lg font-bold text-iris mb-5">
                1
              </div>
              <h3 className="text-lg font-semibold text-bone mb-2">Upload</h3>
              <p className="text-sm text-ash leading-relaxed">Drop your PDF, EPUB, or DOCX. We support books up to 100MB.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-elevated border border-border flex items-center justify-center text-lg font-bold text-iris mb-5">
                2
              </div>
              <h3 className="text-lg font-semibold text-bone mb-2">Search</h3>
              <p className="text-sm text-ash leading-relaxed">Tell us what you&apos;re looking for. The AI finds semantically relevant sections.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto rounded-lg bg-elevated border border-border flex items-center justify-center text-lg font-bold text-iris mb-5">
                3
              </div>
              <h3 className="text-lg font-semibold text-bone mb-2">Read</h3>
              <p className="text-sm text-ash leading-relaxed">Get page numbers and summaries. Open your book and dive in.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="max-w-[600px] mx-auto px-5 sm:px-8 text-center">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bone mb-5 tracking-tight">
            Ready to read differently?
          </h2>
          <p className="text-lg text-ash mb-10 leading-relaxed">
            Upload your first book and discover what&apos;s been waiting for you.
          </p>
          <a
            href="/"
            className="inline-block px-10 py-4 text-base font-semibold text-ink bg-ember rounded-lg hover:bg-ember-hover active:scale-[0.98] transition-all"
          >
            Get started free
          </a>
        </div>
      </section>
    </div>
  );
}
