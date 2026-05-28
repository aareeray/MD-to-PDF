"use client";

import {
  FileText,
  Zap,
  Type,
  Palette,
  Layout,
  Download,
  Code2,
  Globe,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Live Preview",
    description: "Real-time split-screen rendering. See your document come alive as you type.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Instant Export",
    description: "Generate professional PDFs in milliseconds with perfect formatting.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Type,
    title: "Custom Fonts",
    description: "Upload your own fonts or choose from premium presets like Inter and Poppins.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Palette,
    title: "Beautiful Themes",
    description: "From Developer Docs to Luxury Editorial — 7 professional export styles.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Layout,
    title: "Smart Pagination",
    description: "Automatic page breaks, headers, footers, and page numbers — all configurable.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Download,
    title: "Multiple Formats",
    description: "A4, Letter, portrait or landscape. Print-ready high-DPI output.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Code2,
    title: "Full Markdown",
    description: "GFM tables, math equations, mermaid diagrams, code highlighting, and more.",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
  {
    icon: Globe,
    title: "Works Offline",
    description: "Auto-saves locally. Your documents are always available, even without internet.",
    color: "text-teal-400",
    bg: "bg-teal-500/10",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Everything happens in your browser. No data leaves your device.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Everything you need for{" "}
            <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
              perfect documents
            </span>
          </h2>
          <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            A complete toolkit for creating professional PDFs from Markdown. No compromises on quality.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] transition-premium hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-1"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-premium`}
              >
                <feature.icon size={22} className={feature.color} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
