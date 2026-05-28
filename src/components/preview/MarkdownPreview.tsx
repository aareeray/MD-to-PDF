"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { FontSettings } from "@/lib/editorStore";
import { processBlocks } from "@/lib/blockSystem";

interface MarkdownPreviewProps {
  content: string;
  fontSettings: FontSettings;
  className?: string;
  id?: string;
}

export function MarkdownPreview({
  content,
  fontSettings,
  className = "",
  id,
}: MarkdownPreviewProps) {
  // Process custom blocks (:::info, :::warning, etc.)
  const processedContent = useMemo(() => processBlocks(content), [content]);

  return (
    <div
      id={id}
      className={`markdown-preview p-8 ${className}`}
      style={{
        fontFamily: `'${fontSettings.bodyFont}', sans-serif`,
      }}
    >
      <style>{`
        .markdown-preview h1,
        .markdown-preview h2,
        .markdown-preview h3,
        .markdown-preview h4,
        .markdown-preview h5,
        .markdown-preview h6 {
          font-family: '${fontSettings.headingFont}', sans-serif;
        }
        .markdown-preview code,
        .markdown-preview pre {
          font-family: '${fontSettings.codeFont}', monospace;
        }
        .custom-block {
          margin: 1.25rem 0;
          padding: 1rem 1.25rem;
          border-radius: 0 8px 8px 0;
          break-inside: avoid;
        }
      `}</style>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeHighlight, rehypeKatex, rehypeRaw]}
        components={{
          input: ({ type, checked, ...props }) => {
            if (type === "checkbox") {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 accent-blue-500"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
          // Developer feature: code blocks with language labels
          pre: ({ children, ...props }) => {
            return (
              <pre {...props}>
                {children}
              </pre>
            );
          },
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !className;
            
            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            return (
              <div className="code-block-container rounded-lg overflow-hidden border border-[var(--border)] my-4">
                {match && (
                  <div className="flex items-center justify-between px-4 py-2 bg-[var(--muted)] border-b border-[var(--border)]">
                    <span className="text-[11px] font-mono text-[var(--muted-foreground)] font-medium">
                      {match[1]}
                    </span>
                    <button
                      onClick={() => {
                        const text = String(children).replace(/\n$/, "");
                        navigator.clipboard.writeText(text);
                      }}
                      className="text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2 py-0.5 rounded hover:bg-[var(--background)] transition-premium"
                    >
                      Copy
                    </button>
                  </div>
                )}
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            );
          },
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
