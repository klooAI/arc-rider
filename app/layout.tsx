import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "600", "700"],
});

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
        className={`${inter.variable} ${sourceSerif.variable} font-sans bg-ink text-bone min-h-screen`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="w-full border-b border-border bg-ink/90 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
              <a href="/tool" className="flex items-center gap-2.5 group">
                <span className="text-base font-semibold tracking-tight text-bone group-hover:text-iris transition-colors">
                  ArcRider
                </span>
              </a>

              <nav className="flex items-center gap-6 text-sm text-ash">
                <a href="/about" className="hover:text-bone transition-colors">
                  About
                </a>
                <a href="/how-it-works" className="hover:text-bone transition-colors">
                  How it works
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border-subtle">
            <div className="max-w-[1080px] mx-auto px-5 sm:px-8 py-5 flex items-center justify-between text-xs text-dusk">
              <span>&copy; {new Date().getFullYear()} ArcRider</span>
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
