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
        className={`${inter.className} bg-[#F9FAFB] text-[#1F2937] min-h-screen`}
      >
        <div className="min-h-screen flex flex-col">
          {/* Top navigation */}
          <header className="w-full border-b border-[#1D4ED8]/10 bg-[#2563EB] text-white shadow-sm">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-[11px] font-semibold text-[#2563EB]">
                  AR
                </div>
                <span className="text-sm sm:text-base font-semibold tracking-tight">
                  ArcRider
                </span>
              </div>

              {/* Right side – placeholder for now */}
              <div className="hidden sm:flex items-center gap-4 text-xs text-blue-100/90">
                <button className="border-b border-transparent hover:border-[#059669] hover:text-white transition-colors">
                  About
                </button>
                <button className="border-b border-transparent hover:border-[#059669] hover:text-white transition-colors">
                  How it works
                </button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Footer */}
          <footer className="border-t border-[#E5E7EB] bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-[11px] text-[#6B7280]">
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
