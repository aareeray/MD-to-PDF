"use client";

import { useState } from "react";
import {
  X,
  Download,
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ExportSettings, FontSettings } from "@/lib/editorStore";
import { exportToPDF } from "@/lib/pdfExport";

const themes = [
  { id: "minimal-clean", name: "Minimal Clean", desc: "Simple and elegant" },
  { id: "developer-docs", name: "Developer Docs", desc: "GitHub-style documentation" },
  { id: "ebook", name: "eBook", desc: "Book-style formatting" },
  { id: "research-paper", name: "Research Paper", desc: "Academic style" },
  { id: "resume", name: "Resume", desc: "Professional CV" },
  { id: "luxury-editorial", name: "Luxury Editorial", desc: "Premium magazine style" },
  { id: "dark-cyberpunk", name: "Dark Cyberpunk", desc: "Neon-themed dark" },
];

interface ExportPanelProps {
  content: string;
  fontSettings: FontSettings;
  exportSettings: ExportSettings;
  onExportSettingsChange: (settings: ExportSettings) => void;
  onClose: () => void;
}

export function ExportPanel({
  content,
  fontSettings,
  exportSettings,
  onExportSettingsChange,
  onClose,
}: ExportPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportToPDF({ content, fontSettings, exportSettings });
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const updateSettings = (partial: Partial<ExportSettings>) => {
    onExportSettingsChange({ ...exportSettings, ...partial });
  };

  return (
    <div className="absolute top-0 right-0 bottom-0 w-96 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Download size={16} className="text-[var(--primary)]" />
          <span className="font-semibold text-sm">Export to PDF</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Theme selection */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Export Style
          </label>
          <div className="grid grid-cols-1 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => updateSettings({ theme: theme.id })}
                className={`p-3 rounded-xl border text-left transition-premium ${
                  exportSettings.theme === theme.id
                    ? "border-[var(--primary)] bg-blue-500/5"
                    : "border-[var(--border)] hover:border-[var(--primary)]"
                }`}
              >
                <span className="text-sm font-medium block">{theme.name}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {theme.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Page settings */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Page Size
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSettings({ pageSize: "a4" })}
              className={`p-2.5 rounded-lg border text-sm font-medium transition-premium ${
                exportSettings.pageSize === "a4"
                  ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
              }`}
            >
              A4
            </button>
            <button
              onClick={() => updateSettings({ pageSize: "letter" })}
              className={`p-2.5 rounded-lg border text-sm font-medium transition-premium ${
                exportSettings.pageSize === "letter"
                  ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
              }`}
            >
              Letter
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Orientation
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateSettings({ orientation: "portrait" })}
              className={`p-2.5 rounded-lg border text-sm font-medium transition-premium ${
                exportSettings.orientation === "portrait"
                  ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
              }`}
            >
              Portrait
            </button>
            <button
              onClick={() => updateSettings({ orientation: "landscape" })}
              className={`p-2.5 rounded-lg border text-sm font-medium transition-premium ${
                exportSettings.orientation === "landscape"
                  ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--primary)]"
              }`}
            >
              Landscape
            </button>
          </div>
        </div>

        {/* Document metadata */}
        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Document Title
          </label>
          <input
            type="text"
            value={exportSettings.title}
            onChange={(e) => updateSettings({ title: e.target.value })}
            placeholder="My Document"
            className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 block">
            Author
          </label>
          <input
            type="text"
            value={exportSettings.author}
            onChange={(e) => updateSettings({ author: e.target.value })}
            placeholder="Author name"
            className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
          />
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <span className="text-sm">Page numbers</span>
            <input
              type="checkbox"
              checked={exportSettings.showPageNumbers}
              onChange={(e) => updateSettings({ showPageNumbers: e.target.checked })}
              className="accent-blue-500 w-4 h-4"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm">Header</span>
            <input
              type="checkbox"
              checked={exportSettings.showHeader}
              onChange={(e) => updateSettings({ showHeader: e.target.checked })}
              className="accent-blue-500 w-4 h-4"
            />
          </label>
          {exportSettings.showHeader && (
            <input
              type="text"
              value={exportSettings.headerText}
              onChange={(e) => updateSettings({ headerText: e.target.value })}
              placeholder="Header text..."
              className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
            />
          )}
          <label className="flex items-center justify-between">
            <span className="text-sm">Footer</span>
            <input
              type="checkbox"
              checked={exportSettings.showFooter}
              onChange={(e) => updateSettings({ showFooter: e.target.checked })}
              className="accent-blue-500 w-4 h-4"
            />
          </label>
          {exportSettings.showFooter && (
            <input
              type="text"
              value={exportSettings.footerText}
              onChange={(e) => updateSettings({ footerText: e.target.value })}
              placeholder="Footer text..."
              className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
            />
          )}
          <label className="flex items-center justify-between">
            <span className="text-sm">Watermark</span>
            <input
              type="checkbox"
              checked={exportSettings.showWatermark}
              onChange={(e) => updateSettings({ showWatermark: e.target.checked })}
              className="accent-blue-500 w-4 h-4"
            />
          </label>
          {exportSettings.showWatermark && (
            <input
              type="text"
              value={exportSettings.watermarkText}
              onChange={(e) => updateSettings({ watermarkText: e.target.value })}
              placeholder="DRAFT"
              className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
            />
          )}
        </div>

        {/* Advanced margin settings */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-premium"
          >
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Advanced Settings
          </button>
          {showAdvanced && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">Top (px)</label>
                <input
                  type="number"
                  value={exportSettings.margins.top}
                  onChange={(e) =>
                    updateSettings({
                      margins: { ...exportSettings.margins, top: +e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">Bottom (px)</label>
                <input
                  type="number"
                  value={exportSettings.margins.bottom}
                  onChange={(e) =>
                    updateSettings({
                      margins: { ...exportSettings.margins, bottom: +e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">Left (px)</label>
                <input
                  type="number"
                  value={exportSettings.margins.left}
                  onChange={(e) =>
                    updateSettings({
                      margins: { ...exportSettings.margins, left: +e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)]">Right (px)</label>
                <input
                  type="number"
                  value={exportSettings.margins.right}
                  onChange={(e) =>
                    updateSettings({
                      margins: { ...exportSettings.margins, right: +e.target.value },
                    })
                  }
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm mt-1"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export button */}
      <div className="p-4 border-t border-[var(--border)] shrink-0">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-premium hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isExporting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileText size={18} />
              Export PDF
            </>
          )}
        </button>
      </div>
    </div>
  );
}
