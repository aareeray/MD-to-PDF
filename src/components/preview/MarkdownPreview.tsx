"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { FontSettings } from "@/lib/editorStore";

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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
