"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8 py-20">
        <header className="text-center mb-20">
          <p className="text-sm font-medium tracking-wide uppercase text-iris mb-6">
            AI-Powered Document Intelligence
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bone mb-6 leading-[1.15] tracking-tight">
            Find What Matters.<br />
            <span className="text-iris">Skip What Doesn&apos;t.</span>
          </h1>
          <p className="text-lg text-ash max-w-2xl mx-auto leading-relaxed">
            ArcRider uses AI to surface the most relevant parts of any document based on what you&apos;re actually looking for.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-5 mb-20">
          <div className="bg-graphite border border-border rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-iris/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-iris" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-bone mb-2">For Students</h3>
            <p className="text-sm text-ash leading-relaxed">
              Extract key concepts from textbooks and research papers. Get to the insights faster without reading cover to cover.
            </p>
          </div>

          <div className="bg-graphite border border-border rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-bone mb-2">For Professionals</h3>
            <p className="text-sm text-ash leading-relaxed">
              Navigate reports, whitepapers, and documentation with precision. Find answers in seconds instead of hours.
            </p>
          </div>

          <div className="bg-graphite border border-border rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-ember/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-bone mb-2">For Curious Minds</h3>
            <p className="text-sm text-ash leading-relaxed">
              Explore books and documents on your own terms. Dive deep into topics that interest you without the filler.
            </p>
          </div>

          <div className="bg-graphite border border-border rounded-xl p-7">
            <div className="w-10 h-10 rounded-lg bg-iris/10 flex items-center justify-center mb-5">
              <svg className="w-5 h-5 text-iris" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-bone mb-2">For Neurodivergent Readers</h3>
            <p className="text-sm text-ash leading-relaxed">
              Inspired by ADHD, ArcRider helps you hyperfocus on what interests you. Skip the rest guilt-free. Get quick wins instead of overwhelming commitments.
            </p>
          </div>
        </div>

        <div className="bg-graphite border border-iris/15 rounded-xl p-8 sm:p-10 mb-20">
          <div className="text-center mb-10">
            <h2 className="font-serif text-2xl font-bold text-bone mb-3 tracking-tight">
              Semantic Search, Not Keyword Matching
            </h2>
            <p className="text-sm text-ash max-w-2xl mx-auto leading-relaxed">
              ArcRider understands meaning. Search for &ldquo;how to save money&rdquo; and find sections about budgeting, frugality, and financial planning, even if those exact words aren&apos;t used.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">&#128196;</span>
              </div>
              <h4 className="text-sm font-medium text-bone mb-0.5">PDF</h4>
              <p className="text-xs text-dusk">Books, reports, papers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">&#128221;</span>
              </div>
              <h4 className="text-sm font-medium text-bone mb-0.5">DOCX</h4>
              <p className="text-xs text-dusk">Word documents</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center mx-auto mb-3">
                <span className="text-lg">&#128218;</span>
              </div>
              <h4 className="text-sm font-medium text-bone mb-0.5">EPUB</h4>
              <p className="text-xs text-dusk">E-books</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/"
            className="inline-block px-8 py-3.5 text-base font-semibold text-ink bg-ember rounded-lg hover:bg-ember-hover active:scale-[0.98] transition-all"
          >
            Get Started Free
          </a>
          <p className="mt-4 text-dusk text-sm">
            No account required
          </p>
        </div>
      </div>
    </div>
  );
}
