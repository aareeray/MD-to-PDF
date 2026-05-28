"use client";

import { useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { useTheme } from "@/components/ui/ThemeProvider";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "var(--card)",
  },
  ".cm-gutters": {
    backgroundColor: "var(--muted)",
    borderRight: "1px solid var(--border)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "var(--muted)",
  },
  ".cm-activeLine": {
    backgroundColor: "rgba(59, 130, 246, 0.04)",
  },
});

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();

  const handleChange = useCallback(
    (val: string) => {
      onChange(val);
    },
    [onChange]
  );

  return (
    <div className="h-full overflow-hidden">
      <CodeMirror
        value={value}
        onChange={handleChange}
        extensions={[
          markdown({ base: markdownLanguage }),
          EditorView.lineWrapping,
        ]}
        theme={resolvedTheme === "dark" ? oneDark : lightTheme}
        height="100%"
        className="h-full text-sm"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: false,
          indentOnInput: true,
        }}
      />
    </div>
  );
}
