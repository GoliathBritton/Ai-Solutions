import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import MetisAILogo from "@/components/MetisAILogo";
import AuthHeader from "@/components/AuthHeader";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetisAI Console",
  description: "MetisAI — Quantum Diffused LLM Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <header className="w-full border-b border-black/[.08] dark:border-white/[.1]">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
              <MetisAILogo size={40} tagline="Quantum Diffused LLM" />
              <nav className="hidden sm:flex items-center gap-6 text-sm opacity-80">
                <a href="#" className="hover:opacity-100">Dashboard</a>
                <a href="#" className="hover:opacity-100">Models</a>
                <a href="#" className="hover:opacity-100">Tokenizer</a>
                <a href="#" className="hover:opacity-100">Usage</a>
              </nav>
              <AuthHeader />
            </div>
          </header>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
