import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ArcRider",
  description:
    "AI-powered chapter discovery and summaries for your reading material.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-900 text-white min-h-screen`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Top navigation */}
          <header className="w-full border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md text-white sticky top-0 z-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2.5 hover:opacity-90 transition group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-violet-500/20">
                  AR
                </div>
                <span className="text-sm sm:text-base font-semibold tracking-tight">
                  ArcRider
                </span>
              </a>

              {/* Right side navigation */}
              <div className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
                <a href="/about" className="hover:text-white transition-colors">
                  About
                </a>
                <a href="/how-it-works" className="hover:text-white transition-colors">
                  How it works
                </a>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-800 bg-slate-900">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between text-xs text-slate-500">
              <span>© {new Date().getFullYear()} ArcRider</span>
              <span className="hidden sm:inline">
                Focus your reading. Let AI surface what matters.
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
