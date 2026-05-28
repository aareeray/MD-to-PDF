/**
 * Adaptive Intelligence
 * The interface morphs based on content context:
 * - Coding → terminal aesthetics
 * - Poetry → airy minimalism
 * - Academic → structured precision
 * - Presentation → bold typography
 */

export type AdaptiveContext = "code" | "poetry" | "academic" | "presentation" | "narrative" | "data" | "neutral";

export interface AdaptiveState {
  context: AdaptiveContext;
  confidence: number;
  uiAdjustments: UIAdjustments;
}

export interface UIAdjustments {
  editorBackground: string;
  previewPadding: string;
  accentColor: string;
  fontSizeAdjust: number;
  monoContent: boolean;
}


const contextProfiles: Record<AdaptiveContext, UIAdjustments> = {
  code: {
    editorBackground: "var(--muted)",
    previewPadding: "1.5rem",
    accentColor: "#22c55e",
    fontSizeAdjust: -1,
    monoContent: true,
  },
  poetry: {
    editorBackground: "var(--card)",
    previewPadding: "4rem 6rem",
    accentColor: "#a78bfa",
    fontSizeAdjust: 2,
    monoContent: false,
  },
  academic: {
    editorBackground: "var(--card)",
    previewPadding: "2rem 3rem",
    accentColor: "#1d4ed8",
    fontSizeAdjust: 0,
    monoContent: false,
  },
  presentation: {
    editorBackground: "var(--card)",
    previewPadding: "3rem",
    accentColor: "#f59e0b",
    fontSizeAdjust: 1,
    monoContent: false,
  },
  narrative: {
    editorBackground: "var(--card)",
    previewPadding: "2.5rem 4rem",
    accentColor: "#6366f1",
    fontSizeAdjust: 1,
    monoContent: false,
  },
  data: {
    editorBackground: "var(--muted)",
    previewPadding: "1.5rem 2rem",
    accentColor: "#06b6d4",
    fontSizeAdjust: -1,
    monoContent: false,
  },
  neutral: {
    editorBackground: "var(--card)",
    previewPadding: "2rem",
    accentColor: "var(--primary)",
    fontSizeAdjust: 0,
    monoContent: false,
  },
};


/**
 * Detect content context and return adaptive UI state
 */
export function detectAdaptiveContext(content: string): AdaptiveState {
  const lines = content.split("\n");
  const codeLines = (content.match(/```/g) || []).length / 2;
  const totalLines = lines.length;
  const wordCount = content.split(/\s+/).length;
  const avgLineLen = content.length / Math.max(totalLines, 1);
  const headingCount = lines.filter(l => /^#{1,6}\s/.test(l)).length;
  const tableLines = lines.filter(l => /\|.*\|/.test(l)).length;
  const listLines = lines.filter(l => /^\s*[-*+]\s|^\s*\d+\.\s/.test(l)).length;

  // Code context: heavy code blocks
  if (codeLines >= 3 || (codeLines >= 2 && codeLines / Math.max(headingCount, 1) > 1)) {
    return { context: "code", confidence: 0.8, uiAdjustments: contextProfiles.code };
  }

  // Poetry: short lines, few headings, artistic feel
  if (avgLineLen < 40 && headingCount <= 2 && wordCount < 500 && codeLines === 0) {
    return { context: "poetry", confidence: 0.6, uiAdjustments: contextProfiles.poetry };
  }

  // Academic: formal language patterns
  if (/\b(abstract|methodology|conclusion|hypothesis|findings)\b/i.test(content) && headingCount >= 3) {
    return { context: "academic", confidence: 0.7, uiAdjustments: contextProfiles.academic };
  }

  // Data: heavy tables and lists
  if (tableLines > 5 || (listLines > 15 && tableLines > 2)) {
    return { context: "data", confidence: 0.7, uiAdjustments: contextProfiles.data };
  }

  // Presentation: short sections, many headings
  if (headingCount >= 5 && wordCount / headingCount < 100) {
    return { context: "presentation", confidence: 0.6, uiAdjustments: contextProfiles.presentation };
  }

  // Narrative: long flowing text
  if (wordCount > 1000 && codeLines < 2 && avgLineLen > 60) {
    return { context: "narrative", confidence: 0.6, uiAdjustments: contextProfiles.narrative };
  }

  return { context: "neutral", confidence: 0.3, uiAdjustments: contextProfiles.neutral };
}

/**
 * Generate adaptive CSS based on detected context
 */
export function generateAdaptiveCSS(state: AdaptiveState): string {
  const adj = state.uiAdjustments;
  if (state.context === "neutral") return "";

  return `
    .adaptive-editor {
      background: ${adj.editorBackground};
      transition: background 0.5s ease;
    }
    .adaptive-preview .markdown-preview {
      padding: ${adj.previewPadding};
      transition: padding 0.5s ease;
    }
    .adaptive-accent {
      --adaptive-accent: ${adj.accentColor};
    }
    ${adj.monoContent ? `.adaptive-editor .cm-editor { font-family: 'JetBrains Mono', monospace !important; }` : ''}
    ${adj.fontSizeAdjust !== 0 ? `.adaptive-preview .markdown-preview { font-size: ${1 + adj.fontSizeAdjust * 0.05}rem; }` : ''}
  `;
}
