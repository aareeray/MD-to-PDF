"use client";

import Link from "next/link";
import { FileText, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-premium">
              <FileText size={18} className="text-white" />
            </div>
            <Sparkles
              size={12}
              className="absolute -top-1 -right-1 text-violet-400 animate-pulse-glow"
            />
          </div>
          <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
            MarkFlow
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
          >
            Home
          </Link>
          <Link
            href="/editor"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
          >
            Editor
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/editor"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-premium hover:scale-105 active:scale-95"
          >
            <Sparkles size={14} />
            Start Writing
          </Link>
        </div>
      </div>
    </header>
  );
}
