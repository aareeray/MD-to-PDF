"use client";

import { Check } from "lucide-react";

const exportStyles = [
  "Developer Docs",
  "eBook",
  "Research Paper",
  "Resume",
  "Minimal Clean",
  "Luxury Editorial",
  "Dark Cyberpunk",
];

export function PreviewSection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side — export styles */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Professional export{" "}
              <span className="bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent">
                style presets
              </span>
            </h2>
            <p className="text-[var(--muted-foreground)] text-lg mb-8 leading-relaxed">
              Choose from beautifully crafted presets designed for different use cases. 
              Each style is optimized for typography, spacing, and visual hierarchy.
            </p>

            <div className="space-y-3">
              {exportStyles.map((style) => (
                <div
                  key={style}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] transition-premium group"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-violet-500/30 transition-premium">
                    <Check size={14} className="text-blue-400" />
                  </div>
                  <span className="font-medium text-sm">{style}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right side — mock PDF preview */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[var(--border)] bg-white dark:bg-gray-900 p-8 aspect-[3/4] max-w-sm mx-auto">
              {/* PDF mock content */}
              <div className="space-y-4">
                <div className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-8 w-3/4 bg-gray-900 dark:bg-gray-100 rounded" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mt-6" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-2 w-4/5 bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-2 w-3/5 bg-gray-100 dark:bg-gray-800 rounded" />

                <div className="h-6 w-1/2 bg-gray-800 dark:bg-gray-200 rounded mt-8" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mt-4" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded" />
                <div className="h-2 w-2/3 bg-gray-100 dark:bg-gray-800 rounded" />

                <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="h-2 w-full bg-blue-200 dark:bg-blue-900 rounded" />
                  <div className="h-2 w-4/5 bg-blue-200 dark:bg-blue-900 rounded mt-2" />
                  <div className="h-2 w-3/5 bg-blue-200 dark:bg-blue-900 rounded mt-2" />
                </div>

                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mt-6" />
                <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded" />
              </div>

              {/* Page number */}
              <div className="absolute bottom-4 right-6 text-xs text-gray-400 font-mono">1</div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
