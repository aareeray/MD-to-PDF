"use client";

import { useState } from "react";
import {
  X,
  Wand2,
  List,
  WrapText,
  FileText,
  Sparkles,
  BarChart3,
  Check,
} from "lucide-react";
import {
  generateTableOfContents,
  fixMarkdown,
  textToMarkdown,
  summarizeSections,
  formatMarkdown,
  getDocumentStats,
} from "@/lib/writingTools";

interface WritingToolsPanelProps {
  content: string;
  onContentChange: (content: string) => void;
  onClose: () => void;
}

export function WritingToolsPanel({
  content,
  onContentChange,
  onClose,
}: WritingToolsPanelProps) {
  const [lastAction, setLastAction] = useState<string | null>(null);
  const stats = getDocumentStats(content);

  const tools = [
    {
      id: "toc",
      icon: List,
      name: "Generate TOC",
      description: "Insert table of contents from headings",
      action: () => {
        const toc = generateTableOfContents(content);
        if (toc) {
          onContentChange(toc + content);
          setLastAction("toc");
        }
      },
    },
    {
      id: "fix",
      icon: WrapText,
      name: "Fix Markdown",
      description: "Fix spacing, blank lines, and common issues",
      action: () => {
        onContentChange(fixMarkdown(content));
        setLastAction("fix");
      },
    },
    {
      id: "format",
      icon: Sparkles,
      name: "Format Document",
      description: "Normalize style and improve consistency",
      action: () => {
        onContentChange(formatMarkdown(content));
        setLastAction("format");
      },
    },
    {
      id: "text-to-md",
      icon: FileText,
      name: "Plain Text → Markdown",
      description: "Convert plain text into structured markdown",
      action: () => {
        onContentChange(textToMarkdown(content));
        setLastAction("text-to-md");
      },
    },
    {
      id: "summarize",
      icon: BarChart3,
      name: "Summarize Sections",
      description: "Generate a summary from section headings",
      action: () => {
        const summary = summarizeSections(content);
        onContentChange(content + "\n\n---\n\n" + summary);
        setLastAction("summarize");
      },
    },
  ];

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Wand2 size={16} className="text-violet-400" />
          <span className="font-semibold text-sm">Writing Tools</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium"
        >
          <X size={14} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Document stats */}
        <div className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
            Document Stats
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[var(--muted-foreground)]">Words:</span>{" "}
              <span className="font-semibold">{stats.wordCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">Reading:</span>{" "}
              <span className="font-semibold">{stats.readingTime} min</span>
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">Headings:</span>{" "}
              <span className="font-semibold">{stats.headingCount}</span>
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">Code blocks:</span>{" "}
              <span className="font-semibold">{stats.codeBlockCount}</span>
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">Paragraphs:</span>{" "}
              <span className="font-semibold">{stats.paragraphCount}</span>
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">Links:</span>{" "}
              <span className="font-semibold">{stats.linkCount}</span>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
            Quick Actions
          </h4>
          <div className="space-y-2">
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={tool.action}
                className="w-full flex items-start gap-3 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] bg-[var(--background)] transition-premium text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-premium">
                  <tool.icon size={14} className="text-violet-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{tool.name}</span>
                    {lastAction === tool.id && (
                      <Check size={12} className="text-green-500" />
                    )}
                  </div>
                  <span className="text-xs text-[var(--muted-foreground)]">
                    {tool.description}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Block syntax help */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2">
            Custom Blocks
          </h4>
          <div className="p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] space-y-2 font-mono text-xs">
            <p className="text-blue-400">:::info Title</p>
            <p className="text-[var(--muted-foreground)]">Content here</p>
            <p className="text-blue-400">:::</p>
            <div className="pt-2 border-t border-[var(--border)] text-[var(--muted-foreground)]">
              <p>Types: info, warning, tip, note, danger, success, timeline, aside</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
