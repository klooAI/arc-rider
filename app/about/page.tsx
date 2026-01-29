"use client";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-6">
            Stop Reading Everything.<br />Start Finding What Matters.
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            ArcRider is for people who have too much to read and not enough time to read it.
          </p>
        </header>

        <div className="space-y-8">
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              The Problem We Solve
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              You bought a book everyone recommended. Downloaded a 200-page report for work. Got assigned a textbook chapter. Now it's sitting there, unread, because who has time to get through all of that?
            </p>
            <p className="text-slate-300 leading-relaxed">
              The truth is: you probably don't need to read all of it. You need the parts relevant to your question, your project, your life. The rest is filler.
            </p>
          </div>

          <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-2xl border border-violet-500/30 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Perfect For ADHD Brains
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Let's be real: traditional reading doesn't work for everyone. If you have ADHD, you know the struggle - starting a book with enthusiasm, losing focus by page 20, feeling guilty about the pile of "I'll finish this later" documents.
            </p>
            <p className="text-slate-300 leading-relaxed mb-4">
              <strong className="text-white">ArcRider flips the script.</strong> Instead of forcing yourself through content hoping to find the good parts, you tell us what you're looking for and we show you exactly where it is.
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>No more "I'll read this later" guilt - get the key points now</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Hyperfocus on the parts that actually interest you</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Skip the boring bits without missing important information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 mt-1">✓</span>
                <span>Get quick wins instead of overwhelming commitments</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Who This Is For
            </h2>
            <div className="space-y-4 text-slate-300">
              <p>
                <strong className="text-white">Students</strong> who need to extract key information from textbooks and research papers without reading cover to cover.
              </p>
              <p>
                <strong className="text-white">Professionals</strong> drowning in reports, whitepapers, and documentation who need answers fast.
              </p>
              <p>
                <strong className="text-white">Readers with ADHD</strong> who want to actually finish learning from the books they buy.
              </p>
              <p>
                <strong className="text-white">Anyone</strong> who's ever thought "I wish I could just skip to the part I need."
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              This isn't Ctrl+F. We don't just match keywords - we understand what you're looking for, even when you use different words than the author.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Search for "how to be more confident" and we'll find sections about self-esteem, assertiveness, body language, and overcoming imposter syndrome. The AI connects the dots so you don't miss relevant content.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-2xl border border-slate-700 p-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Works With Your Documents
            </h2>
            <div className="grid grid-cols-3 gap-4 text-center mt-6">
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-3xl mb-2">📄</div>
                <div className="text-white font-medium">PDF</div>
                <div className="text-slate-400 text-sm">Books, reports, papers</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-white font-medium">DOCX</div>
                <div className="text-slate-400 text-sm">Word documents</div>
              </div>
              <div className="bg-slate-900/50 rounded-xl p-4">
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
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition shadow-lg shadow-violet-500/25"
          >
            Try It Now - It's Free
          </a>
          <p className="mt-4 text-slate-500 text-sm">
            No signup required. Just upload a document and start searching.
          </p>
        </div>
      </div>
    </div>
  );
}
