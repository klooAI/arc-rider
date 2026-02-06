"use client";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="max-w-[800px] mx-auto px-5 sm:px-8 py-20">
        <header className="text-center mb-20">
          <p className="text-sm font-medium tracking-wide uppercase text-sage mb-6">
            Simple 4-Step Process
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-bone mb-6 leading-[1.15] tracking-tight">
            From Document to Insight<br />
            <span className="text-iris">In Under a Minute</span>
          </h1>
          <p className="text-lg text-ash max-w-2xl mx-auto leading-relaxed">
            Upload any document, tell us what you&apos;re looking for, and get exactly the pages and summaries you need.
          </p>
        </header>

        <div className="relative">
          <div className="absolute left-5 md:left-8 top-0 bottom-0 w-px bg-border hidden md:block" />

          <div className="space-y-6">
            <div className="relative flex gap-6 md:gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center z-10">
                  <span className="text-lg font-bold text-iris">1</span>
                </div>
              </div>
              <div className="flex-1 bg-graphite border border-border rounded-xl p-7">
                <div className="md:hidden w-8 h-8 rounded-md bg-elevated border border-border flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-iris">1</span>
                </div>
                <h3 className="text-lg font-semibold text-bone mb-2">
                  Upload Your Document
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-4">
                  Drag and drop any PDF, Word document, or ebook. We support files up to 100MB, which covers most books and documents you&apos;ll ever need.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-md bg-elevated border border-border text-dusk text-xs font-medium">PDF</span>
                  <span className="px-3 py-1 rounded-md bg-elevated border border-border text-dusk text-xs font-medium">DOCX</span>
                  <span className="px-3 py-1 rounded-md bg-elevated border border-border text-dusk text-xs font-medium">EPUB</span>
                </div>
              </div>
            </div>

            <div className="relative flex gap-6 md:gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center z-10">
                  <span className="text-lg font-bold text-iris">2</span>
                </div>
              </div>
              <div className="flex-1 bg-graphite border border-border rounded-xl p-7">
                <div className="md:hidden w-8 h-8 rounded-md bg-elevated border border-border flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-iris">2</span>
                </div>
                <h3 className="text-lg font-semibold text-bone mb-2">
                  Describe What You Need
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-4">
                  Type what you&apos;re looking for in plain language. Our AI understands context and meaning, not just keywords.
                </p>
                <div className="bg-elevated rounded-lg p-4 border border-border">
                  <p className="text-dusk text-xs mb-2 font-medium">Example searches:</p>
                  <div className="space-y-1.5">
                    <p className="text-ash text-sm">&ldquo;practical tips for managing anxiety&rdquo;</p>
                    <p className="text-ash text-sm">&ldquo;the author&apos;s main argument about climate policy&rdquo;</p>
                    <p className="text-ash text-sm">&ldquo;investment strategies for beginners&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex gap-6 md:gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center z-10">
                  <span className="text-lg font-bold text-iris">3</span>
                </div>
              </div>
              <div className="flex-1 bg-graphite border border-border rounded-xl p-7">
                <div className="md:hidden w-8 h-8 rounded-md bg-elevated border border-border flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-iris">3</span>
                </div>
                <h3 className="text-lg font-semibold text-bone mb-2">
                  Get Precise Results
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-4">
                  Receive a ranked list of relevant sections with exact page numbers and AI-generated explanations of why each matters. Optionally, generate a focused summary.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <div className="text-iris text-sm font-medium mb-1">Page Numbers</div>
                    <p className="text-dusk text-xs">Know exactly where to look</p>
                  </div>
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <div className="text-iris text-sm font-medium mb-1">Relevance Scores</div>
                    <p className="text-dusk text-xs">Most important first</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex gap-6 md:gap-8">
              <div className="hidden md:flex flex-col items-center">
                <div className="w-12 h-12 rounded-lg bg-elevated border border-border flex items-center justify-center z-10">
                  <span className="text-lg font-bold text-iris">4</span>
                </div>
              </div>
              <div className="flex-1 bg-graphite border border-border rounded-xl p-7">
                <div className="md:hidden w-8 h-8 rounded-md bg-elevated border border-border flex items-center justify-center mb-4">
                  <span className="text-sm font-bold text-iris">4</span>
                </div>
                <h3 className="text-lg font-semibold text-bone mb-2">
                  Get AI Summaries
                </h3>
                <p className="text-sm text-ash leading-relaxed mb-4">
                  Want the key points without reading? Generate focused summaries tailored to your specific interest. Get a quick TL;DR plus a detailed breakdown of the most important insights.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <div className="text-iris text-sm font-medium mb-1">TL;DR</div>
                    <p className="text-dusk text-xs">Quick bullet points</p>
                  </div>
                  <div className="bg-elevated rounded-lg p-4 border border-border">
                    <div className="text-iris text-sm font-medium mb-1">Detailed Summary</div>
                    <p className="text-dusk text-xs">In-depth analysis</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 bg-graphite border border-iris/15 rounded-xl p-8 sm:p-10">
          <h2 className="font-serif text-2xl font-bold text-bone mb-8 text-center tracking-tight">
            Why It Works
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/30 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-bone mb-1">Semantic Understanding</h4>
                <p className="text-sm text-ash leading-relaxed">
                  Finds related concepts even when different words are used. Search &ldquo;productivity&rdquo; and find sections on time management, focus, and efficiency.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/30 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-bone mb-1">Lightning Fast</h4>
                <p className="text-sm text-ash leading-relaxed">
                  Results in seconds. What would take hours of reading happens almost instantly.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/30 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-bone mb-1">Focused Summaries</h4>
                <p className="text-sm text-ash leading-relaxed">
                  AI summaries tailored to your specific question, not generic overviews of the entire document.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1 rounded-full bg-iris/30 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-bone mb-1">Verifiable Results</h4>
                <p className="text-sm text-ash leading-relaxed">
                  Every result includes page numbers so you can go directly to the source and verify.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <a
            href="/"
            className="inline-block px-8 py-3.5 text-base font-semibold text-ink bg-ember rounded-lg hover:bg-ember-hover active:scale-[0.98] transition-all"
          >
            Try It Now
          </a>
          <p className="mt-4 text-dusk text-sm">
            Free to use &middot; No account required
          </p>
        </div>
      </div>
    </div>
  );
}
