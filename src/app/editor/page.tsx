"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Download,
  Settings2,
  PanelLeftOpen,
  Eye,
  Code2,
  Maximize2,
  Minimize2,
  Upload,
  Save,
  Keyboard,
  Copy,
  Check,
  Wand2,
  Brain,
  Palette,
  Play,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/preview/MarkdownPreview";
import { ExportPanel } from "@/components/pdf/ExportPanel";
import { FontPanel } from "@/components/ui/FontPanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";
import { WritingToolsPanel } from "@/components/ui/WritingToolsPanel";
import { DocumentIntelligenceBanner } from "@/components/ui/DocumentIntelligenceBanner";
import { ThemeStudio, ThemeStudioSettings, defaultStudioSettings } from "@/components/ui/ThemeStudio";
import { PresentationView } from "@/components/presentation/PresentationMode";
import {
  EditorState,
  FontSettings,
  ExportSettings,
  loadEditorState,
  saveEditorState,
  loadFontSettings,
  saveFontSettings,
  loadExportSettings,
  saveExportSettings,
  defaultFontSettings,
  defaultExportSettings,
} from "@/lib/editorStore";
import { sampleMarkdown } from "@/lib/sampleMarkdown";
import { analyzeDocument, DocumentAnalysis } from "@/lib/documentIntelligence";
import { detectErrors, getErrorSummary } from "@/lib/aiErrorDetection";
import { analyzeDocument as analyzePdfDoc } from "@/lib/pdfAnalytics";
import Link from "next/link";

type ViewMode = "split" | "editor" | "preview";
type ActivePanel = null | "font" | "writing" | "export" | "studio" | "analytics";

export default function EditorPage() {
  const [editorState, setEditorState] = useState<EditorState>({
    content: sampleMarkdown,
    fileName: "document.md",
    isDirty: false,
    lastSaved: null,
  });
  const [fontSettings, setFontSettings] = useState<FontSettings>(defaultFontSettings);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(defaultExportSettings);
  const [studioSettings, setStudioSettings] = useState<ThemeStudioSettings>(defaultStudioSettings);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [documentAnalysis, setDocumentAnalysis] = useState<DocumentAnalysis | null>(null);
  const [showIntelligenceBanner, setShowIntelligenceBanner] = useState(true);
  const [errorSummary, setErrorSummary] = useState<{ errorCount: number; warningCount: number; healthScore: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analysisTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage
  useEffect(() => {
    setEditorState(loadEditorState());
    setFontSettings(loadFontSettings());
    setExportSettings(loadExportSettings());
  }, []);

  // Auto-save
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorState.isDirty) {
        const newState = { ...editorState, isDirty: false, lastSaved: new Date() };
        saveEditorState(newState);
        setEditorState(newState);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [editorState]);

  // Document Intelligence + Error Detection: analyze content when it changes
  useEffect(() => {
    if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current);
    analysisTimeoutRef.current = setTimeout(() => {
      const analysis = analyzeDocument(editorState.content);
      setDocumentAnalysis(analysis);
      setShowIntelligenceBanner(true);
      // Run error detection
      const errors = detectErrors(editorState.content);
      const summary = getErrorSummary(errors);
      setErrorSummary(summary);
    }, 2000);
    return () => { if (analysisTimeoutRef.current) clearTimeout(analysisTimeoutRef.current); };
  }, [editorState.content]);

  // Save settings
  useEffect(() => { saveFontSettings(fontSettings); }, [fontSettings]);
  useEffect(() => { saveExportSettings(exportSettings); }, [exportSettings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPresentationMode) return;
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const newState = { ...editorState, isDirty: false, lastSaved: new Date() };
        saveEditorState(newState);
        setEditorState(newState);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "e") { e.preventDefault(); togglePanel("export"); }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") { e.preventDefault(); setViewMode(viewMode === "split" ? "editor" : "split"); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "F") { e.preventDefault(); setIsZenMode(!isZenMode); }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "P") { e.preventDefault(); setIsPresentationMode(true); }
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setShowShortcuts(!showShortcuts); }
      if (e.key === "Escape") { setIsZenMode(false); setActivePanel(null); setShowShortcuts(false); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorState, activePanel, viewMode, isZenMode, showShortcuts, isPresentationMode]);

  const togglePanel = useCallback((panel: ActivePanel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
  }, []);

  const handleContentChange = useCallback((value: string) => {
    setEditorState((prev) => ({ ...prev, content: value, isDirty: true }));
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".md") || file.name.endsWith(".markdown") || file.name.endsWith(".txt"))) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setEditorState({ content, fileName: file.name, isDirty: true, lastSaved: null });
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".md") || file.type === "text/markdown" || file.type === "text/plain")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setEditorState({ content, fileName: file.name, isDirty: true, lastSaved: null });
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => { setIsDragging(false); }, []);

  const copyMarkdown = useCallback(() => {
    navigator.clipboard.writeText(editorState.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editorState.content]);

  const handleApplyIntelligence = useCallback(() => {
    if (documentAnalysis) {
      setExportSettings((prev) => ({ ...prev, theme: documentAnalysis.suggestedTheme }));
      setFontSettings(documentAnalysis.suggestedFonts);
    }
  }, [documentAnalysis]);

  // Presentation mode
  if (isPresentationMode) {
    return <PresentationView content={editorState.content} onExit={() => setIsPresentationMode(false)} />;
  }

  return (
    <div
      className={`h-screen flex flex-col bg-[var(--background)] ${isZenMode ? "zen-mode" : ""}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-blue-500/10 backdrop-blur-sm flex items-center justify-center border-4 border-dashed border-blue-500 rounded-xl m-4">
          <div className="text-center">
            <Upload size={48} className="text-blue-500 mx-auto mb-4" />
            <p className="text-xl font-semibold">Drop your Markdown file here</p>
            <p className="text-[var(--muted-foreground)]">.md files supported</p>
          </div>
        </div>
      )}

      {/* Top toolbar */}
      {!isZenMode && (
        <div className="h-14 border-b border-[var(--border)] bg-[var(--card)] flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 mr-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <FileText size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-violet-600 bg-clip-text text-transparent hidden sm:block">
                MarkFlow
              </span>
            </Link>
            <div className="h-6 w-px bg-[var(--border)]" />
            <span className="text-sm text-[var(--muted-foreground)] font-mono">{editorState.fileName}</span>
            {editorState.isDirty && <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />}
            {editorState.lastSaved && !editorState.isDirty && (
              <span className="text-xs text-[var(--muted-foreground)]"><Save size={12} className="inline mr-1" />Saved</span>
            )}
            {/* Error health indicator */}
            {errorSummary && errorSummary.healthScore < 100 && (
              <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${
                errorSummary.healthScore >= 80 ? "bg-green-500/10 text-green-500" :
                errorSummary.healthScore >= 50 ? "bg-amber-500/10 text-amber-500" :
                "bg-red-500/10 text-red-500"
              }`}>
                <AlertTriangle size={9} />
                {errorSummary.errorCount + errorSummary.warningCount} issues
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* View mode toggles */}
            <div className="hidden sm:flex items-center gap-0.5 p-1 rounded-lg bg-[var(--muted)]">
              {(["editor", "split", "preview"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`p-1.5 rounded-md text-xs transition-premium ${
                    viewMode === mode ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                  title={mode}
                >
                  {mode === "editor" ? <Code2 size={14} /> : mode === "split" ? <PanelLeftOpen size={14} /> : <Eye size={14} />}
                </button>
              ))}
            </div>

            <div className="h-6 w-px bg-[var(--border)] mx-1 hidden sm:block" />

            <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium" title="Upload .md file"><Upload size={16} /></button>
            <input ref={fileInputRef} type="file" accept=".md,.markdown,.txt" onChange={handleFileUpload} className="hidden" />

            <button onClick={copyMarkdown} className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium" title="Copy markdown">
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>

            <button onClick={() => togglePanel("writing")} className={`p-2 rounded-lg transition-premium ${activePanel === "writing" ? "bg-violet-500 text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"}`} title="Writing tools"><Wand2 size={16} /></button>
            <button onClick={() => togglePanel("font")} className={`p-2 rounded-lg transition-premium ${activePanel === "font" ? "bg-[var(--primary)] text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"}`} title="Font settings"><Settings2 size={16} /></button>
            <button onClick={() => togglePanel("studio")} className={`p-2 rounded-lg transition-premium ${activePanel === "studio" ? "bg-emerald-500 text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"}`} title="Theme Studio"><Palette size={16} /></button>
            <button onClick={() => togglePanel("analytics")} className={`hidden sm:block p-2 rounded-lg transition-premium ${activePanel === "analytics" ? "bg-cyan-500 text-white" : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"}`} title="PDF Analytics"><BarChart3 size={16} /></button>
            <button onClick={() => setIsPresentationMode(true)} className="hidden sm:block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium" title="Presentation mode (Ctrl+Shift+P)"><Play size={16} /></button>
            <button onClick={() => setIsZenMode(true)} className="hidden sm:block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium" title="Zen mode"><Maximize2 size={16} /></button>
            <button onClick={() => setShowShortcuts(true)} className="hidden lg:block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium" title="Shortcuts"><Keyboard size={16} /></button>
            <ThemeToggle />
            <div className="h-6 w-px bg-[var(--border)] mx-1" />
            <button onClick={() => togglePanel("export")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-premium hover:scale-105 active:scale-95">
              <Download size={14} /><span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      )}

      {/* Document Intelligence Banner */}
      {!isZenMode && showIntelligenceBanner && documentAnalysis && (
        <DocumentIntelligenceBanner analysis={documentAnalysis} onApplySuggestion={handleApplyIntelligence} onDismiss={() => setShowIntelligenceBanner(false)} />
      )}

      {/* Zen mode exit */}
      {isZenMode && (
        <button onClick={() => setIsZenMode(false)} className="fixed top-4 right-4 z-50 p-2 rounded-lg glass opacity-30 hover:opacity-100 transition-premium" title="Exit zen mode (Esc)"><Minimize2 size={16} /></button>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor */}
        {(viewMode === "split" || viewMode === "editor") && (
          <div className={`${viewMode === "split" ? "w-1/2 border-r border-[var(--border)]" : "w-full"} h-full overflow-hidden flex flex-col`}>
            {!isZenMode && (
              <div className="h-9 border-b border-[var(--border)] bg-[var(--muted)] flex items-center px-4 shrink-0">
                <Code2 size={12} className="text-[var(--muted-foreground)] mr-2" />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Markdown</span>
                {documentAnalysis && documentAnalysis.confidence > 0.3 && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-violet-400"><Brain size={10} />{documentAnalysis.type}</span>
                )}
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <MarkdownEditor value={editorState.content} onChange={handleContentChange} />
            </div>
          </div>
        )}

        {/* Preview */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div className={`${viewMode === "split" ? "w-1/2" : "w-full"} h-full overflow-hidden flex flex-col`}>
            {!isZenMode && (
              <div className="h-9 border-b border-[var(--border)] bg-[var(--muted)] flex items-center px-4 shrink-0">
                <Eye size={12} className="text-[var(--muted-foreground)] mr-2" />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">Preview</span>
                {documentAnalysis && documentAnalysis.features.length > 0 && (
                  <span className="ml-auto text-[10px] text-[var(--muted-foreground)]">{documentAnalysis.features.slice(0, 3).join(" · ")}</span>
                )}
              </div>
            )}
            <div className="flex-1 overflow-y-auto bg-[var(--card)]">
              <MarkdownPreview content={editorState.content} fontSettings={fontSettings} id="markdown-preview" />
            </div>
          </div>
        )}

        {/* Side Panels */}
        {activePanel === "font" && <FontPanel fontSettings={fontSettings} onFontSettingsChange={setFontSettings} onClose={() => setActivePanel(null)} />}
        {activePanel === "writing" && <WritingToolsPanel content={editorState.content} onContentChange={handleContentChange} onClose={() => setActivePanel(null)} />}
        {activePanel === "studio" && <ThemeStudio settings={studioSettings} onChange={setStudioSettings} onClose={() => setActivePanel(null)} />}
        {activePanel === "analytics" && <AnalyticsPanel content={editorState.content} onClose={() => setActivePanel(null)} />}
        {activePanel === "export" && (
          <ExportPanel
            content={editorState.content}
            fontSettings={fontSettings}
            exportSettings={exportSettings}
            onExportSettingsChange={(settings) => { setExportSettings(settings); saveExportSettings(settings); }}
            onClose={() => setActivePanel(null)}
          />
        )}
      </div>

      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}

/* Inline Analytics Panel Component */
function AnalyticsPanel({ content, onClose }: { content: string; onClose: () => void }) {
  const analytics = analyzePdfDoc(content);
  const errors = detectErrors(content);
  const summary = getErrorSummary(errors);

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-cyan-400" />
          <span className="font-semibold text-sm">Document Analytics</span>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium">
          <span className="text-sm">✕</span>
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Overall Score */}
        <div className="text-center p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-[var(--border)]">
          <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">{analytics.overallQuality}</div>
          <div className="text-xs text-[var(--muted-foreground)] mt-1">Quality Score</div>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          {analytics.breakdown.map((item) => (
            <div key={item.category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">{item.category}</span>
                <span className="text-xs text-[var(--muted-foreground)]">{item.score}/100</span>
              </div>
              <div className="h-1.5 rounded-full bg-[var(--muted)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.score >= 80 ? "bg-green-500" : item.score >= 60 ? "bg-amber-500" : "bg-red-500"
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>
              {item.suggestion && <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{item.suggestion}</p>}
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Metrics</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-[var(--muted)]"><span className="text-[var(--muted-foreground)]">Words:</span> <span className="font-semibold">{analytics.metrics.wordCount.toLocaleString()}</span></div>
            <div className="p-2 rounded-lg bg-[var(--muted)]"><span className="text-[var(--muted-foreground)]">Reading:</span> <span className="font-semibold">{analytics.metrics.readingTimeMinutes}min</span></div>
            <div className="p-2 rounded-lg bg-[var(--muted)]"><span className="text-[var(--muted-foreground)]">Sentences:</span> <span className="font-semibold">{analytics.metrics.sentenceCount}</span></div>
            <div className="p-2 rounded-lg bg-[var(--muted)]"><span className="text-[var(--muted-foreground)]">Avg words/sent:</span> <span className="font-semibold">{analytics.metrics.avgWordsPerSentence}</span></div>
          </div>
        </div>

        {/* Health */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Health Check</h4>
          <div className={`p-3 rounded-lg border ${summary.healthScore >= 80 ? "border-green-500/30 bg-green-500/5" : summary.healthScore >= 50 ? "border-amber-500/30 bg-amber-500/5" : "border-red-500/30 bg-red-500/5"}`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Score: {summary.healthScore}/100</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${summary.healthScore >= 80 ? "bg-green-500/20 text-green-500" : summary.healthScore >= 50 ? "bg-amber-500/20 text-amber-500" : "bg-red-500/20 text-red-500"}`}>
                {summary.healthScore >= 80 ? "Healthy" : summary.healthScore >= 50 ? "Fair" : "Needs attention"}
              </span>
            </div>
            <div className="flex gap-3 text-[10px] text-[var(--muted-foreground)]">
              {summary.errorCount > 0 && <span className="text-red-500">{summary.errorCount} errors</span>}
              {summary.warningCount > 0 && <span className="text-amber-500">{summary.warningCount} warnings</span>}
              {summary.errorCount === 0 && summary.warningCount === 0 && <span className="text-green-500">No issues found!</span>}
            </div>
          </div>
          {errors.length > 0 && (
            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
              {errors.slice(0, 8).map((err) => (
                <div key={err.id} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--muted)] text-[10px]">
                  <span className={`shrink-0 mt-0.5 ${err.severity === "error" ? "text-red-500" : err.severity === "warning" ? "text-amber-500" : "text-blue-400"}`}>
                    {err.severity === "error" ? "●" : err.severity === "warning" ? "▲" : "ℹ"}
                  </span>
                  <span className="text-[var(--muted-foreground)]">{err.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Readability */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">Readability</h4>
          <div className="text-center p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
            <div className="text-2xl font-bold">{analytics.readabilityScore}</div>
            <div className="text-xs text-[var(--muted-foreground)]">Flesch Score — {analytics.readabilityGrade}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
