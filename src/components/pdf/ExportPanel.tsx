"use client";

import { useState, useCallback } from "react";
import {
  X,
  Download,
  FileText,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Type,
  Printer,
  FileCode,
  Image as ImageIcon,
} from "lucide-react";
import { ExportSettings, FontSettings } from "@/lib/editorStore";
import { exportToPDF, exportToHTML } from "@/lib/pdfExport";
import { ExportAnimation } from "./ExportAnimation";
import { TypographySettings, defaultTypographySettings } from "@/lib/typographyEngine";
import { PrintLayoutSettings, defaultPrintLayoutSettings } from "@/lib/printLayoutEngine";
import { CoverSettings, defaultCoverSettings } from "@/lib/coverGenerator";
import { themeRegistry } from "@/lib/themes";

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
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [showPrintLayout, setShowPrintLayout] = useState(false);
  const [showCover, setShowCover] = useState(false);
  const [typographySettings, setTypographySettings] = useState<TypographySettings>(defaultTypographySettings);
  const [printLayoutSettings, setPrintLayoutSettings] = useState<PrintLayoutSettings>(defaultPrintLayoutSettings);
  const [coverSettings, setCoverSettings] = useState<CoverSettings>(defaultCoverSettings);

  const handleExport = async (format: "pdf" | "html" = "pdf") => {
    if (format === "html") {
      const html = await exportToHTML({ content, fontSettings, exportSettings });
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportSettings.title || "document"}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);
    try {
      await exportToPDF({
        content,
        fontSettings,
        exportSettings,
        typographySettings,
        printLayoutSettings,
        coverSettings,
        onProgress: (progress) => setExportProgress(progress),
      });
      setExportComplete(true);
    } catch (error) {
      console.error("Export failed:", error);
      setIsExporting(false);
      alert("Export failed. Please try again.");
    }
  };

  const handleAnimationEnd = useCallback(() => {
    setIsExporting(false);
    setExportComplete(false);
    setExportProgress(0);
  }, []);

  const updateSettings = (partial: Partial<ExportSettings>) => {
    onExportSettingsChange({ ...exportSettings, ...partial });
  };

  const themes = themeRegistry;

  return (
    <>
      {/* Export animation overlay */}
      <ExportAnimation
        isExporting={isExporting}
        progress={exportProgress}
        isComplete={exportComplete}
        onAnimationEnd={handleAnimationEnd}
      />

      <div className="absolute top-0 right-0 bottom-0 w-96 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-[var(--primary)]" />
            <span className="font-semibold text-sm">Export Document</span>
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
              Export Style ({themes.length} themes)
            </label>
            <div className="grid grid-cols-1 gap-1.5 max-h-56 overflow-y-auto pr-1">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ theme: theme.id })}
                  className={`p-2.5 rounded-lg border text-left transition-premium flex items-center gap-3 ${
                    exportSettings.theme === theme.id
                      ? "border-[var(--primary)] bg-blue-500/5"
                      : "border-[var(--border)] hover:border-[var(--primary)]"
                  }`}
                >
                  <div className="flex gap-0.5 shrink-0">
                    {theme.previewColors.slice(0, 3).map((color, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 rounded-full border border-white/20"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium block truncate">{theme.name}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)] truncate block">{theme.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Page settings */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Page Size
              </label>
              <div className="flex gap-1">
                {(["a4", "letter"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateSettings({ pageSize: size })}
                    className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-premium ${
                      exportSettings.pageSize === size
                        ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {size.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-1.5 block">
                Orientation
              </label>
              <div className="flex gap-1">
                {(["portrait", "landscape"] as const).map((ori) => (
                  <button
                    key={ori}
                    onClick={() => updateSettings({ orientation: ori })}
                    className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-premium capitalize ${
                      exportSettings.orientation === ori
                        ? "border-[var(--primary)] bg-blue-500/5 text-[var(--primary)]"
                        : "border-[var(--border)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    {ori.slice(0, 4)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Document metadata */}
          <div className="space-y-2">
            <input
              type="text"
              value={exportSettings.title}
              onChange={(e) => updateSettings({ title: e.target.value })}
              placeholder="Document title"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
            />
            <input
              type="text"
              value={exportSettings.author}
              onChange={(e) => updateSettings({ author: e.target.value })}
              placeholder="Author name"
              className="w-full p-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm focus:border-[var(--primary)] outline-none transition-premium"
            />
          </div>

          {/* Cover Page */}
          <div>
            <button
              onClick={() => setShowCover(!showCover)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-premium w-full"
            >
              <BookOpen size={14} />
              <span>Cover Page</span>
              {showCover ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
            </button>
            {showCover && (
              <div className="mt-3 space-y-2">
                <select
                  value={coverSettings.style}
                  onChange={(e) => setCoverSettings({ ...coverSettings, style: e.target.value as CoverSettings["style"] })}
                  className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm"
                >
                  <option value="none">No cover page</option>
                  <option value="editorial">Editorial (gradient)</option>
                  <option value="technical">Technical (clean)</option>
                  <option value="ebook">eBook (dark elegant)</option>
                  <option value="research">Research (academic)</option>
                  <option value="minimal">Minimal</option>
                  <option value="gradient">Gradient (colorful)</option>
                  <option value="dark">Dark Neon</option>
                </select>
                {coverSettings.style !== "none" && (
                  <div className="space-y-1.5">
                    <input type="text" value={coverSettings.title} onChange={(e) => setCoverSettings({ ...coverSettings, title: e.target.value })} placeholder="Cover title" className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
                    <input type="text" value={coverSettings.subtitle} onChange={(e) => setCoverSettings({ ...coverSettings, subtitle: e.target.value })} placeholder="Subtitle" className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
                    <input type="text" value={coverSettings.author} onChange={(e) => setCoverSettings({ ...coverSettings, author: e.target.value })} placeholder="Author" className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
                    <input type="text" value={coverSettings.organization} onChange={(e) => setCoverSettings({ ...coverSettings, organization: e.target.value })} placeholder="Organization" className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Typography Engine */}
          <div>
            <button
              onClick={() => setShowTypography(!showTypography)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-premium w-full"
            >
              <Type size={14} />
              <span>Typography Engine</span>
              {showTypography ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
            </button>
            {showTypography && (
              <div className="mt-3 space-y-2.5">
                {[
                  { key: "enableOpticalSizing", label: "Optical font sizing" },
                  { key: "enableSmartLineHeight", label: "Smart line-height" },
                  { key: "enableWidowOrphanPrevention", label: "Widow/orphan prevention" },
                  { key: "enableHangingPunctuation", label: "Hanging punctuation" },
                  { key: "enableAdaptiveSpacing", label: "Adaptive spacing" },
                  { key: "enableSmartQuotes", label: "Smart quotes" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between text-xs">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={typographySettings[key as keyof TypographySettings] as boolean}
                      onChange={(e) => setTypographySettings({ ...typographySettings, [key]: e.target.checked })}
                      className="accent-blue-500 w-3.5 h-3.5"
                    />
                  </label>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[10px] text-[var(--muted-foreground)]">Paragraph</label>
                    <select value={typographySettings.paragraphSpacing} onChange={(e) => setTypographySettings({ ...typographySettings, paragraphSpacing: e.target.value as TypographySettings["paragraphSpacing"] })} className="w-full p-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-xs mt-0.5">
                      <option value="tight">Tight</option>
                      <option value="normal">Normal</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[var(--muted-foreground)]">Headings</label>
                    <select value={typographySettings.headingScale} onChange={(e) => setTypographySettings({ ...typographySettings, headingScale: e.target.value as TypographySettings["headingScale"] })} className="w-full p-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-xs mt-0.5">
                      <option value="compact">Compact</option>
                      <option value="normal">Normal</option>
                      <option value="dramatic">Dramatic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Print Layout */}
          <div>
            <button
              onClick={() => setShowPrintLayout(!showPrintLayout)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] transition-premium w-full"
            >
              <Printer size={14} />
              <span>Print Layout</span>
              {showPrintLayout ? <ChevronUp size={14} className="ml-auto" /> : <ChevronDown size={14} className="ml-auto" />}
            </button>
            {showPrintLayout && (
              <div className="mt-3 space-y-2.5">
                {[
                  { key: "enableChapterBreaks", label: "Chapter breaks (H1 → new page)" },
                  { key: "enableSmartPageBreaks", label: "Smart page breaks" },
                  { key: "enableTableSplitting", label: "Table splitting" },
                  { key: "enableImageCaptions", label: "Image captions from alt text" },
                  { key: "enableDropCaps", label: "Drop caps" },
                  { key: "enableRunningHeaders", label: "Running headers" },
                  { key: "firstPageNoNumber", label: "No number on first page" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between text-xs">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={printLayoutSettings[key as keyof PrintLayoutSettings] as boolean}
                      onChange={(e) => setPrintLayoutSettings({ ...printLayoutSettings, [key]: e.target.checked })}
                      className="accent-blue-500 w-3.5 h-3.5"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-2.5">
            <label className="flex items-center justify-between text-sm">
              <span>Page numbers</span>
              <input type="checkbox" checked={exportSettings.showPageNumbers} onChange={(e) => updateSettings({ showPageNumbers: e.target.checked })} className="accent-blue-500 w-4 h-4" />
            </label>
            <label className="flex items-center justify-between text-sm">
              <span>Header</span>
              <input type="checkbox" checked={exportSettings.showHeader} onChange={(e) => updateSettings({ showHeader: e.target.checked })} className="accent-blue-500 w-4 h-4" />
            </label>
            {exportSettings.showHeader && (
              <input type="text" value={exportSettings.headerText} onChange={(e) => updateSettings({ headerText: e.target.value })} placeholder="Header text..." className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
            )}
            <label className="flex items-center justify-between text-sm">
              <span>Footer</span>
              <input type="checkbox" checked={exportSettings.showFooter} onChange={(e) => updateSettings({ showFooter: e.target.checked })} className="accent-blue-500 w-4 h-4" />
            </label>
            {exportSettings.showFooter && (
              <input type="text" value={exportSettings.footerText} onChange={(e) => updateSettings({ footerText: e.target.value })} placeholder="Footer text..." className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
            )}
            <label className="flex items-center justify-between text-sm">
              <span>Watermark</span>
              <input type="checkbox" checked={exportSettings.showWatermark} onChange={(e) => updateSettings({ showWatermark: e.target.checked })} className="accent-blue-500 w-4 h-4" />
            </label>
            {exportSettings.showWatermark && (
              <input type="text" value={exportSettings.watermarkText} onChange={(e) => updateSettings({ watermarkText: e.target.value })} placeholder="DRAFT" className="w-full p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] text-xs" />
            )}
          </div>

          {/* Advanced margins */}
          <div>
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-premium">
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              Margins
            </button>
            {showAdvanced && (
              <div className="mt-2 grid grid-cols-4 gap-1.5">
                {(["top", "bottom", "left", "right"] as const).map((side) => (
                  <div key={side}>
                    <label className="text-[10px] text-[var(--muted-foreground)] capitalize">{side}</label>
                    <input type="number" value={exportSettings.margins[side]} onChange={(e) => updateSettings({ margins: { ...exportSettings.margins, [side]: +e.target.value } })} className="w-full p-1.5 rounded border border-[var(--border)] bg-[var(--background)] text-xs mt-0.5" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Export buttons */}
        <div className="p-4 border-t border-[var(--border)] shrink-0 space-y-2">
          <button
            onClick={() => handleExport("pdf")}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-blue-500/25 transition-premium hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText size={16} />
            Export PDF
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleExport("html")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:border-[var(--primary)] transition-premium"
            >
              <FileCode size={12} />
              HTML
            </button>
            <button
              onClick={() => {
                const blob = new Blob([content], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${exportSettings.title || "document"}.md`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-medium hover:border-[var(--primary)] transition-premium"
            >
              <FileText size={12} />
              Markdown
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
