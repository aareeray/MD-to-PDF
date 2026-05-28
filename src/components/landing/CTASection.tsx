"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="relative p-12 sm:p-16 rounded-3xl glass-strong border border-[var(--border)] overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <Sparkles size={32} className="text-violet-400 mx-auto mb-6 animate-pulse-glow" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Ready to create something{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
                beautiful
              </span>
              ?
            </h2>
            <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-xl mx-auto">
              Start writing in Markdown and export stunning PDFs — all from your browser, completely free.
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-lg shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-premium hover:scale-105 active:scale-95 group"
            >
              <span>Open Editor</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            Built with precision. Powered by modern web technologies.
          </p>
          <p className="text-xs text-[var(--muted-foreground)] mt-2 opacity-50">
            MarkFlow &copy; {new Date().getFullYear()}. All processing happens in your browser.
          </p>
        </div>
      </div>
    </section>
  );
}
