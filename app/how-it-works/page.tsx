"use client";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-6">
            Read Less. Learn More.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            You don't have time to read everything. ArcRider finds the parts that actually matter to you - so you can skip the rest without missing anything important.
          </p>
        </header>

        <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            Built for Busy Minds
          </h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            If you've ever felt overwhelmed by a long document, struggled to focus on reading, or wished you could just "get to the good parts" - this is for you.
          </p>
          <p className="text-slate-300 leading-relaxed">
            <strong className="text-white">Especially helpful if you have ADHD:</strong> Instead of forcing yourself through hundreds of pages (knowing you'll zone out halfway through), tell ArcRider what you actually care about. It finds those sections instantly, so you can hyperfocus on the parts that matter and skip the rest guilt-free.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          How It Works
        </h2>

        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Drop Your Document
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Upload any PDF, Word doc, or ebook. That 400-page textbook? The lengthy report your boss sent? The self-help book collecting dust? Bring it.
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
                <h3 className="text-xl font-semibold text-white mb-3">
                  Tell It What You Care About
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Just type what you're looking for in plain English. "How to save money" or "dealing with difficult people" or "the main argument of chapter 3". No special syntax. No keywords. Just say it like you'd ask a friend.
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
                <h3 className="text-xl font-semibold text-white mb-3">
                  Get the Pages That Matter
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  ArcRider shows you exactly which pages to read and <em>why</em> they're relevant. No more skimming. No more "I think it was somewhere in chapter 5". Just the specific pages with the information you need.
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
                <h3 className="text-xl font-semibold text-white mb-3">
                  Get the Summary (Optional)
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Want the key points without reading at all? Hit summarize. You'll get a quick TL;DR plus a detailed breakdown - focused specifically on what you asked about, not generic "here's the book" summaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Why This Actually Works
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400">
                It Understands Meaning, Not Just Words
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Search for "making more money" and it finds sections about salary negotiation, side hustles, and investment strategies - even if those exact words aren't used.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400">
                Page Numbers You Can Trust
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Every result tells you exactly where to look. Open your PDF, go to that page, and the information is right there. No hunting.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400">
                Summaries That Answer YOUR Questions
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Not generic summaries. Summaries built around what you specifically wanted to know. Ask about "leadership tips" and that's what you get.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-emerald-400">
                Works in Seconds
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Upload, search, done. What would take you hours of reading happens in under a minute.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
          >
            Try It Now - It's Free
          </a>
          <p className="mt-4 text-slate-500 text-sm">
            No signup required. Just upload and search.
          </p>
        </div>
      </div>
    </div>
  );
}
