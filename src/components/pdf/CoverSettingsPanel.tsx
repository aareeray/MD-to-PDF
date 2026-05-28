"use client";

import { X, BookOpen } from "lucide-react";
import { CoverSettings, CoverStyle } from "@/lib/coverGenerator";

const coverOptions: { id: CoverStyle; name: string; desc: string }[] = [
  { id: "none", name: "No Cover", desc: "Start directly with content" },
  { id: "editorial", name: "Editorial", desc: "Gradient magazine cover" },
  { id: "technical", name: "Technical", desc: "Clean engineering style" },
  { id: "ebook", name: "eBook", desc: "Dark elegant book cover" },
  { id: "research", name: "Research", desc: "Academic paper cover" },
  { id: "minimal", name: "Minimal", desc: "Ultra-minimal design" },
  { id: "gradient", name: "Gradient", desc: "Colorful glassmorphism" },
  { id: "dark", name: "Dark Neon", desc: "Cyberpunk style" },
];

interface CoverSettingsPanelProps {
  coverSettings: CoverSettings;
  onCoverSettingsChange: (settings: CoverSettings) => void;
  onClose: () => void;
}

export function CoverSettingsPanel({
  coverSettings,
  onCoverSettingsChange,
  onClose,
}: CoverSettingsPanelProps) {
  const update = (partial: Partial<CoverSettings>) => {
    onCoverSettingsChange({ ...coverSettings, ...partial });
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen size={16} className="text-blue-400" />
          <span className="font-semibold text-sm">Document Cover</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Cover style selection */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Cover Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {coverOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => update({ style: option.id })}
                className={`p-2.5 rounded-lg border text-left transition-premium ${
                  coverSettings.style === option.id
                    ? "border-[var(--primary)] bg-blue-500/5"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="text-xs font-medium block">{option.name}</span>
                <span className="text-[10px] text-[var(--muted-foreground)]">{option.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {coverSettings.style !== "none" && (
          <>
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Title
              </label>
              <input
                type="text"
                value={coverSettings.title}
                onChange={(e) => update({ title: e.target.value })}
                placeholder="Document Title"
                className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
              />
            </div>

            {/* Subtitle */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Subtitle
              </label>
              <input
                type="text"
                value={coverSettings.subtitle}
                onChange={(e) => update({ subtitle: e.target.value })}
                placeholder="Optional subtitle"
                className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
              />
            </div>

            {/* Author */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Author
              </label>
              <input
                type="text"
                value={coverSettings.author}
                onChange={(e) => update({ author: e.target.value })}
                placeholder="Author name"
                className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Organization
              </label>
              <input
                type="text"
                value={coverSettings.organization}
                onChange={(e) => update({ organization: e.target.value })}
                placeholder="Company or institution"
                className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Date
              </label>
              <input
                type="text"
                value={coverSettings.date}
                onChange={(e) => update({ date: e.target.value })}
                placeholder="May 2026"
                className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
