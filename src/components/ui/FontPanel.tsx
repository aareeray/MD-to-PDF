"use client";

import { X, Type } from "lucide-react";
import { FontSettings } from "@/lib/editorStore";

const fontOptions = [
  { name: "Inter", category: "sans-serif" },
  { name: "Poppins", category: "sans-serif" },
  { name: "IBM Plex Sans", category: "sans-serif" },
  { name: "Playfair Display", category: "serif" },
  { name: "Georgia", category: "serif" },
  { name: "JetBrains Mono", category: "monospace" },
  { name: "Fira Code", category: "monospace" },
  { name: "SF Mono", category: "monospace" },
];

const presets = [
  {
    name: "Modern Minimal",
    headingFont: "Inter",
    bodyFont: "Inter",
    codeFont: "JetBrains Mono",
  },
  {
    name: "Classic Editorial",
    headingFont: "Playfair Display",
    bodyFont: "Georgia",
    codeFont: "Fira Code",
  },
  {
    name: "Developer",
    headingFont: "IBM Plex Sans",
    bodyFont: "IBM Plex Sans",
    codeFont: "JetBrains Mono",
  },
  {
    name: "Elegant",
    headingFont: "Poppins",
    bodyFont: "Inter",
    codeFont: "Fira Code",
  },
];

interface FontPanelProps {
  fontSettings: FontSettings;
  onFontSettingsChange: (settings: FontSettings) => void;
  onClose: () => void;
}

export function FontPanel({
  fontSettings,
  onFontSettingsChange,
  onClose,
}: FontPanelProps) {
  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Type size={16} className="text-[var(--primary)]" />
          <span className="font-semibold text-sm">Typography</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Presets */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Presets
          </label>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() =>
                  onFontSettingsChange({
                    headingFont: preset.headingFont,
                    bodyFont: preset.bodyFont,
                    codeFont: preset.codeFont,
                  })
                }
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-premium ${
                  fontSettings.headingFont === preset.headingFont &&
                  fontSettings.bodyFont === preset.bodyFont
                    ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)] text-[var(--muted-foreground)]"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Heading font */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Heading Font
          </label>
          <select
            value={fontSettings.headingFont}
            onChange={(e) =>
              onFontSettingsChange({ ...fontSettings, headingFont: e.target.value })
            }
            className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
          >
            {fontOptions
              .filter((f) => f.category !== "monospace")
              .map((font) => (
                <option key={font.name} value={font.name}>
                  {font.name}
                </option>
              ))}
          </select>
        </div>

        {/* Body font */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Body Font
          </label>
          <select
            value={fontSettings.bodyFont}
            onChange={(e) =>
              onFontSettingsChange({ ...fontSettings, bodyFont: e.target.value })
            }
            className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
          >
            {fontOptions
              .filter((f) => f.category !== "monospace")
              .map((font) => (
                <option key={font.name} value={font.name}>
                  {font.name}
                </option>
              ))}
          </select>
        </div>

        {/* Code font */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Code Font
          </label>
          <select
            value={fontSettings.codeFont}
            onChange={(e) =>
              onFontSettingsChange({ ...fontSettings, codeFont: e.target.value })
            }
            className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
          >
            {fontOptions
              .filter((f) => f.category === "monospace")
              .map((font) => (
                <option key={font.name} value={font.name}>
                  {font.name}
                </option>
              ))}
          </select>
        </div>

        {/* Preview */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Preview
          </label>
          <div className="p-4 rounded-lg border border-[var(--border)] bg-[var(--muted)]">
            <h4
              className="text-lg font-bold mb-1"
              style={{ fontFamily: `'${fontSettings.headingFont}', sans-serif` }}
            >
              Heading Text
            </h4>
            <p
              className="text-sm text-[var(--muted-foreground)] mb-2"
              style={{ fontFamily: `'${fontSettings.bodyFont}', sans-serif` }}
            >
              Body text with your selected font. This shows how your document will look.
            </p>
            <code
              className="text-xs bg-[var(--background)] px-2 py-1 rounded"
              style={{ fontFamily: `'${fontSettings.codeFont}', monospace` }}
            >
              const code = &quot;example&quot;;
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}
