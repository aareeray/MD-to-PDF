"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Download,
  Settings2,
  PanelLeftClose,
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
} from "lucide-react";
import { MarkdownEditor } from "@/components/editor/MarkdownEditor";
import { MarkdownPreview } from "@/components/preview/MarkdownPreview";
import { ExportPanel } from "@/components/pdf/ExportPanel";
import { FontPanel } from "@/components/ui/FontPanel";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { KeyboardShortcutsModal } from "@/components/ui/KeyboardShortcutsModal";
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
import Link from "next/link";

type ViewMode = "split" | "editor" | "preview";

export default function EditorPage() {
  const [editorState, setEditorState] = useState<EditorState>({
    content: sampleMarkdown,
    fileName: "document.md",
    isDirty: false,
    lastSaved: null,
  });
  const [fontSettings, setFontSettings] = useState<FontSettings>(defaultFontSettings);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(defaultExportSettings);
  const [viewMode, setViewMode] = useState<ViewMode>("split");
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [showFontPanel, setShowFontPanel] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        const newState = {
          ...editorState,
          isDirty: false,
          lastSaved: new Date(),
        };
        saveEditorState(newState);
        setEditorState(newState);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [editorState]);

  // Save font/export settings
  useEffect(() => {
    saveFontSettings(fontSettings);
  }, [fontSettings]);

  useEffect(() => {
    saveExportSettings(exportSettings);
  }, [exportSettings]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        const newState = { ...editorState, isDirty: false, lastSaved: new Date() };
        saveEditorState(newState);
        setEditorState(newState);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        setShowExportPanel(!showExportPanel);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        setViewMode(viewMode === "split" ? "editor" : "split");
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        setIsZenMode(!isZenMode);
      }
      if (e.key === "?" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
      if (e.key === "Escape") {
        setIsZenMode(false);
        setShowExportPanel(false);
        setShowFontPanel(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [editorState, showExportPanel, viewMode, isZenMode, showShortcuts]);

  const handleContentChange = useCallback((value: string) => {
    setEditorState((prev) => ({ ...prev, content: value, isDirty: true }));
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".md")) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const content = ev.target?.result as string;
        setEditorState({
          content,
          fileName: file.name,
          isDirty: true,
          lastSaved: null,
        });
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
        setEditorState({
          content,
          fileName: file.name,
          isDirty: true,
          lastSaved: null,
        });
      };
      reader.readAsText(file);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const copyMarkdown = useCallback(() => {
    navigator.clipboard.writeText(editorState.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [editorState.content]);

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

            <span className="text-sm text-[var(--muted-foreground)] font-mono">
              {editorState.fileName}
            </span>
            {editorState.isDirty && (
              <span className="w-2 h-2 rounded-full bg-amber-400" title="Unsaved changes" />
            )}
            {editorState.lastSaved && !editorState.isDirty && (
              <span className="text-xs text-[var(--muted-foreground)]">
                <Save size={12} className="inline mr-1" />
                Saved
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* View mode toggles */}
            <div className="hidden sm:flex items-center gap-0.5 p-1 rounded-lg bg-[var(--muted)]">
              <button
                onClick={() => setViewMode("editor")}
                className={`p-1.5 rounded-md text-xs transition-premium ${
                  viewMode === "editor"
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
                title="Editor only"
              >
                <Code2 size={14} />
              </button>
              <button
                onClick={() => setViewMode("split")}
                className={`p-1.5 rounded-md text-xs transition-premium ${
                  viewMode === "split"
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
                title="Split view"
              >
                <PanelLeftOpen size={14} />
              </button>
              <button
                onClick={() => setViewMode("preview")}
                className={`p-1.5 rounded-md text-xs transition-premium ${
                  viewMode === "preview"
                    ? "bg-[var(--card)] shadow-sm text-[var(--foreground)]"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
                title="Preview only"
              >
                <Eye size={14} />
              </button>
            </div>

            <div className="h-6 w-px bg-[var(--border)] mx-1 hidden sm:block" />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
              title="Upload .md file"
            >
              <Upload size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={copyMarkdown}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
              title="Copy markdown"
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>

            <button
              onClick={() => setShowFontPanel(!showFontPanel)}
              className={`p-2 rounded-lg transition-premium ${
                showFontPanel
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
              }`}
              title="Font settings"
            >
              <Settings2 size={16} />
            </button>

            <button
              onClick={() => setIsZenMode(true)}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
              title="Zen mode (Ctrl+Shift+F)"
            >
              <Maximize2 size={16} />
            </button>

            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-premium"
              title="Keyboard shortcuts"
            >
              <Keyboard size={16} />
            </button>

            <ThemeToggle />

            <div className="h-6 w-px bg-[var(--border)] mx-1" />

            <button
              onClick={() => setShowExportPanel(!showExportPanel)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white text-sm font-semibold shadow-lg hover:shadow-blue-500/25 transition-premium hover:scale-105 active:scale-95"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Zen mode exit button */}
      {isZenMode && (
        <button
          onClick={() => setIsZenMode(false)}
          className="fixed top-4 right-4 z-50 p-2 rounded-lg glass opacity-30 hover:opacity-100 transition-premium"
          title="Exit zen mode (Esc)"
        >
          <Minimize2 size={16} />
        </button>
      )}

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Editor */}
        {(viewMode === "split" || viewMode === "editor") && (
          <div
            className={`${
              viewMode === "split" ? "w-1/2 border-r border-[var(--border)]" : "w-full"
            } h-full overflow-hidden flex flex-col`}
          >
            {!isZenMode && (
              <div className="h-9 border-b border-[var(--border)] bg-[var(--muted)] flex items-center px-4 shrink-0">
                <Code2 size={12} className="text-[var(--muted-foreground)] mr-2" />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">
                  Markdown
                </span>
              </div>
            )}
            <div className="flex-1 overflow-hidden">
              <MarkdownEditor
                value={editorState.content}
                onChange={handleContentChange}
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {(viewMode === "split" || viewMode === "preview") && (
          <div
            className={`${
              viewMode === "split" ? "w-1/2" : "w-full"
            } h-full overflow-hidden flex flex-col`}
          >
            {!isZenMode && (
              <div className="h-9 border-b border-[var(--border)] bg-[var(--muted)] flex items-center px-4 shrink-0">
                <Eye size={12} className="text-[var(--muted-foreground)] mr-2" />
                <span className="text-xs text-[var(--muted-foreground)] font-medium">
                  Preview
                </span>
              </div>
            )}
            <div className="flex-1 overflow-y-auto bg-[var(--card)]">
              <MarkdownPreview
                content={editorState.content}
                fontSettings={fontSettings}
                id="markdown-preview"
              />
            </div>
          </div>
        )}

        {/* Font settings panel */}
        {showFontPanel && (
          <FontPanel
            fontSettings={fontSettings}
            onFontSettingsChange={setFontSettings}
            onClose={() => setShowFontPanel(false)}
          />
        )}

        {/* Export panel */}
        {showExportPanel && (
          <ExportPanel
            content={editorState.content}
            fontSettings={fontSettings}
            exportSettings={exportSettings}
            onExportSettingsChange={(settings) => {
              setExportSettings(settings);
              saveExportSettings(settings);
            }}
            onClose={() => setShowExportPanel(false)}
          />
        )}
      </div>

      {/* Keyboard shortcuts modal */}
      {showShortcuts && (
        <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />
      )}
    </div>
  );
}
