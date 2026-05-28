"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, FileDown, Type, Palette } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background mesh gradient */}
      <div className="absolute inset-0 gradient-mesh" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-400/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-slide-up">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-sm font-medium text-[var(--muted-foreground)]">
            Premium Document Generation
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Turn Markdown Into{" "}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
            Beautiful Documents
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl md:text-2xl text-[var(--muted-foreground)] max-w-3xl mx-auto mb-10 leading-relaxed animate-slide-up" style={{ animationDelay: "0.2s" }}>
          Professional PDF exports with perfect typography, custom fonts, and elegant layouts. 
          Create stunning documents in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <Link
            href="/editor"
            className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold text-lg shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-premium hover:scale-105 active:scale-95 flex items-center gap-3"
          >
            <span>Start Creating</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 rounded-2xl glass font-semibold text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
          >
            See Features
          </a>
        </div>

        {/* Floating preview cards */}
        <div className="relative max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <div className="relative rounded-2xl overflow-hidden glass-strong shadow-2xl border border-[var(--border)]">
            {/* Mock editor UI */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-[var(--muted-foreground)] ml-2 font-mono">document.md</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-[var(--border)]">
              {/* Editor side */}
              <div className="p-6 text-left font-mono text-sm leading-relaxed text-[var(--muted-foreground)]">
                <p className="text-blue-400"># Getting Started</p>
                <p className="mt-2">Welcome to **MarkFlow**, the premium</p>
                <p>markdown converter for professionals.</p>
                <p className="mt-2 text-green-400">## Features</p>
                <p className="mt-1">- Perfect typography</p>
                <p>- Custom font support</p>
                <p>- Elegant page layouts</p>
                <p className="mt-2 text-violet-400">{"> Quality is not an act, it is a habit."}</p>
              </div>
              {/* Preview side */}
              <div className="p-6 text-left">
                <h3 className="text-2xl font-bold mb-3">Getting Started</h3>
                <p className="text-[var(--muted-foreground)] mb-3">
                  Welcome to <strong>MarkFlow</strong>, the premium markdown converter for professionals.
                </p>
                <h4 className="text-lg font-semibold text-green-500 mb-2">Features</h4>
                <ul className="space-y-1 text-[var(--muted-foreground)] text-sm ml-4">
                  <li className="list-disc">Perfect typography</li>
                  <li className="list-disc">Custom font support</li>
                  <li className="list-disc">Elegant page layouts</li>
                </ul>
                <blockquote className="mt-3 pl-4 border-l-4 border-violet-400 text-[var(--muted-foreground)] italic text-sm">
                  Quality is not an act, it is a habit.
                </blockquote>
              </div>
            </div>
          </div>

          {/* Floating badges around the preview */}
          <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-lg glass text-xs font-semibold flex items-center gap-1.5 animate-float shadow-lg">
            <FileDown size={12} className="text-blue-400" />
            PDF Ready
          </div>
          <div className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-lg glass text-xs font-semibold flex items-center gap-1.5 animate-float shadow-lg" style={{ animationDelay: "1s" }}>
            <Type size={12} className="text-violet-400" />
            Custom Fonts
          </div>
          <div className="absolute top-1/2 -right-6 px-3 py-1.5 rounded-lg glass text-xs font-semibold flex items-center gap-1.5 animate-float shadow-lg" style={{ animationDelay: "3s" }}>
            <Palette size={12} className="text-emerald-400" />
            7 Themes
          </div>
        </div>
      </div>
    </section>
  );
}
