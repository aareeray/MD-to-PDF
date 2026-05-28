/**
 * Creative Confidence System
 * Makes users feel like better creators. The greatest achievement:
 * "I look more professional than I actually am."
 *
 * Features:
 * - Instant Beauty: automatically transforms ugly markdown into stunning output
 * - Smart defaults that always look premium
 * - Auto-enhancement suggestions
 * - Quality uplift scoring (before/after)
 * - Professional polish detection and auto-correction
 */

export interface ConfidenceScore {
  before: number;  // Raw document quality (0-100)
  after: number;   // Enhanced document quality (0-100)
  uplift: number;  // Percentage improvement
  enhancements: string[];
}

/**
 * Calculate how much MarkFlow improves a document's perceived quality
 */
export function calculateConfidenceScore(content: string): ConfidenceScore {
  const enhancements: string[] = [];
  let before = 50; // Start at average
  let after = 50;

  const lines = content.split("\n");
  const wordCount = content.split(/\s+/).length;
  const headings = lines.filter(l => /^#{1,6}\s/.test(l)).length;
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  const hasLists = /^[-*+]\s/m.test(content);
  const hasBlockquotes = /^>/m.test(content);
  const hasTables = /\|.*\|/.test(content);

  // Assess raw quality
  if (headings === 0) before -= 10;
  if (wordCount < 50) before -= 10;
  if (!hasLists && !hasTables) before -= 5;
  if (headings >= 2) before += 5;

  // MarkFlow enhancements (what we automatically apply)
  after = before;

  // Typography enhancement
  after += 15;
  enhancements.push("Professional typography applied");

  // Smart spacing
  after += 10;
  enhancements.push("Optimized paragraph rhythm");

  // Code block styling
  if (codeBlocks > 0) {
    after += 8;
    enhancements.push("Syntax-highlighted code blocks");
  }

  // Table formatting
  if (hasTables) {
    after += 7;
    enhancements.push("Professional table layout");
  }

  // Visual hierarchy
  if (headings >= 2) {
    after += 8;
    enhancements.push("Clear visual hierarchy");
  }

  // Blockquote styling
  if (hasBlockquotes) {
    after += 5;
    enhancements.push("Elegant pull quotes");
  }

  // PDF-specific enhancements
  after += 12;
  enhancements.push("Print-ready pagination");
  enhancements.push("Embedded font rendering");

  // Cap at 100
  after = Math.min(100, after);
  before = Math.max(10, before);

  const uplift = Math.round(((after - before) / before) * 100);

  return { before, after, uplift, enhancements };
}

/**
 * Generate "Instant Beauty" CSS - makes any content look premium with zero effort
 */
export function generateInstantBeautyCSS(): string {
  return `
    /* Instant Beauty: Zero-effort premium appearance */
    .instant-beauty {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1f2937;
      line-height: 1.75;
      font-size: 1rem;
      max-width: 680px;
      margin: 0 auto;
      padding: 3rem;
      font-feature-settings: "kern" 1, "liga" 1;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    .instant-beauty h1, .instant-beauty h2, .instant-beauty h3 {
      font-weight: 700;
      color: #111827;
      letter-spacing: -0.02em;
    }

    .instant-beauty h1 { font-size: 2.25rem; margin: 2.5rem 0 1rem; line-height: 1.15; }
    .instant-beauty h2 { font-size: 1.625rem; margin: 2rem 0 0.75rem; line-height: 1.25; }
    .instant-beauty h3 { font-size: 1.25rem; margin: 1.5rem 0 0.5rem; line-height: 1.35; }

    .instant-beauty p { margin-bottom: 1rem; }
    .instant-beauty strong { font-weight: 600; color: #111827; }

    .instant-beauty a { color: #4f46e5; text-decoration: underline; text-underline-offset: 2px; }

    .instant-beauty blockquote {
      border-left: 3px solid #6366f1;
      padding: 0.75rem 1.5rem;
      margin: 1.5rem 0;
      background: #f5f3ff;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #4b5563;
    }

    .instant-beauty pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1.25rem 1.5rem;
      border-radius: 10px;
      font-size: 0.875rem;
      line-height: 1.6;
      overflow-x: auto;
      margin: 1.5rem 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .instant-beauty code:not(pre code) {
      background: #f1f5f9;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.875em;
      border: 1px solid #e2e8f0;
    }

    .instant-beauty table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .instant-beauty th {
      background: #f8fafc;
      font-weight: 600;
      text-align: left;
      padding: 0.75rem 1rem;
      border-bottom: 2px solid #e5e7eb;
    }

    .instant-beauty td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .instant-beauty img {
      max-width: 100%;
      border-radius: 8px;
      margin: 1.5rem 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }

    .instant-beauty hr {
      border: none;
      border-top: 1px solid #e5e7eb;
      margin: 2.5rem 0;
    }

    .instant-beauty ul, .instant-beauty ol {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .instant-beauty li { margin-bottom: 0.375rem; line-height: 1.65; }
    .instant-beauty li::marker { color: #6366f1; }
  `;
}

/**
 * Generate "Design for Silence" CSS - luxury through subtraction
 */
export function generateSilenceCSS(): string {
  return `
    /* Design for Silence: luxury through subtraction */
    .silence-mode {
      --silence-transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .silence-mode .toolbar-chrome {
      transition: opacity var(--silence-transition);
    }

    .silence-mode:not(:hover) .toolbar-chrome {
      opacity: 0.4;
    }

    .silence-mode .panel-chrome {
      border-color: transparent;
      transition: border-color var(--silence-transition);
    }

    .silence-mode .panel-chrome:hover {
      border-color: var(--border);
    }

    /* Restrained animations - nothing moves unless needed */
    .silence-mode * {
      animation-duration: 0s !important;
    }

    .silence-mode:hover * {
      animation-duration: unset !important;
    }

    /* Maximum negative space */
    .silence-mode .markdown-preview {
      padding: 4rem 5rem;
    }

    /* Ultra-quiet scrollbar */
    .silence-mode ::-webkit-scrollbar-thumb {
      background: transparent;
    }

    .silence-mode:hover ::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.1);
    }
  `;
}
