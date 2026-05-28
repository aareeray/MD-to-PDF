/**
 * AI Layout Composer
 * Dynamically redesigns layouts based on content density and type.
 * Analyzes content structure and produces optimal layout configurations.
 */

export type LayoutStyle =
  | "magazine"
  | "literary"
  | "grid-technical"
  | "cinematic"
  | "compact-data"
  | "narrative";

export interface LayoutAnalysis {
  style: LayoutStyle;
  confidence: number;
  description: string;
  adjustments: LayoutAdjustments;
}

export interface LayoutAdjustments {
  fontSize: number;          // base font size in rem
  lineHeight: number;        // line height multiplier
  paragraphSpacing: number;  // rem
  headingScale: number;      // multiplier for heading sizes
  maxWidth: string;          // content max width
  columnCount: number;       // 1 or 2
  imageStyle: "inline" | "full-width" | "float";
  codeStyle: "compact" | "expanded" | "terminal";
  blockquoteStyle: "minimal" | "editorial" | "accent";
  listStyle: "tight" | "spaced" | "card";
}

/**
 * Analyze content and compose optimal layout
 */
export function composeLayout(content: string): LayoutAnalysis {
  const lines = content.split("\n");
  const wordCount = content.split(/\s+/).length;
  const codeBlockCount = (content.match(/```/g) || []).length / 2;
  const headingCount = lines.filter(l => /^#{1,6}\s/.test(l)).length;
  const listItemCount = lines.filter(l => /^\s*[-*+]\s|^\s*\d+\.\s/.test(l)).length;
  const blockquoteCount = lines.filter(l => /^>\s/.test(l)).length;
  const tableCount = (content.match(/\|.*\|.*\|/g) || []).length;
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const avgParagraphLength = content.split(/\n\n+/).reduce((sum, p) => sum + p.length, 0) / Math.max(content.split(/\n\n+/).length, 1);

  // Scoring for different layout styles
  const scores: Record<LayoutStyle, number> = {
    magazine: 0,
    literary: 0,
    "grid-technical": 0,
    cinematic: 0,
    "compact-data": 0,
    narrative: 0,
  };

  // Code-heavy → technical grid
  if (codeBlockCount >= 3) scores["grid-technical"] += 0.4;
  if (codeBlockCount >= 5) scores["grid-technical"] += 0.2;

  // Long paragraphs → literary/narrative
  if (avgParagraphLength > 300) scores.literary += 0.3;
  if (avgParagraphLength > 500) scores.literary += 0.2;

  // Many images → magazine
  if (imageCount >= 2) scores.magazine += 0.3;
  if (imageCount >= 4) scores.magazine += 0.2;

  // Short content with headings → cinematic
  if (wordCount < 500 && headingCount >= 2) scores.cinematic += 0.3;
  if (blockquoteCount >= 2) scores.cinematic += 0.2;

  // Tables + lists → compact data
  if (tableCount >= 2) scores["compact-data"] += 0.3;
  if (listItemCount > 15) scores["compact-data"] += 0.2;

  // Long flowing text → narrative
  if (wordCount > 2000 && codeBlockCount < 2) scores.narrative += 0.3;
  if (avgParagraphLength > 200 && avgParagraphLength < 400) scores.narrative += 0.2;

  // Many headings with moderate content → magazine
  if (headingCount >= 5 && imageCount >= 1) scores.magazine += 0.2;

  // Find best style
  const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const [bestStyle, bestScore] = sorted[0];
  const style = (bestScore > 0.2 ? bestStyle : "narrative") as LayoutStyle;

  return {
    style,
    confidence: Math.min(bestScore + 0.3, 0.95),
    description: getLayoutDescription(style),
    adjustments: getLayoutAdjustments(style, { wordCount, codeBlockCount, avgParagraphLength }),
  };
}

function getLayoutDescription(style: LayoutStyle): string {
  const descriptions: Record<LayoutStyle, string> = {
    magazine: "Magazine layout with generous imagery and visual hierarchy",
    literary: "Literary layout with elegant spacing and reading rhythm",
    "grid-technical": "Technical grid with emphasized code blocks and structured data",
    cinematic: "Cinematic layout with dramatic spacing and bold typography",
    "compact-data": "Compact data layout optimized for tables and lists",
    narrative: "Narrative layout with flowing paragraphs and comfortable reading",
  };
  return descriptions[style];
}

function getLayoutAdjustments(
  style: LayoutStyle,
  metrics: { wordCount: number; codeBlockCount: number; avgParagraphLength: number }
): LayoutAdjustments {
  const layouts: Record<LayoutStyle, LayoutAdjustments> = {
    magazine: {
      fontSize: 1.05,
      lineHeight: 1.7,
      paragraphSpacing: 1.2,
      headingScale: 1.3,
      maxWidth: "780px",
      columnCount: 1,
      imageStyle: "full-width",
      codeStyle: "expanded",
      blockquoteStyle: "editorial",
      listStyle: "card",
    },
    literary: {
      fontSize: 1.1,
      lineHeight: 2.0,
      paragraphSpacing: 1.5,
      headingScale: 1.1,
      maxWidth: "640px",
      columnCount: 1,
      imageStyle: "inline",
      codeStyle: "compact",
      blockquoteStyle: "editorial",
      listStyle: "spaced",
    },
    "grid-technical": {
      fontSize: 0.9,
      lineHeight: 1.6,
      paragraphSpacing: 0.8,
      headingScale: 1.0,
      maxWidth: "820px",
      columnCount: 1,
      imageStyle: "inline",
      codeStyle: "terminal",
      blockquoteStyle: "accent",
      listStyle: "tight",
    },
    cinematic: {
      fontSize: 1.15,
      lineHeight: 1.8,
      paragraphSpacing: 1.8,
      headingScale: 1.5,
      maxWidth: "700px",
      columnCount: 1,
      imageStyle: "full-width",
      codeStyle: "expanded",
      blockquoteStyle: "editorial",
      listStyle: "spaced",
    },
    "compact-data": {
      fontSize: 0.85,
      lineHeight: 1.5,
      paragraphSpacing: 0.6,
      headingScale: 0.9,
      maxWidth: "900px",
      columnCount: 1,
      imageStyle: "inline",
      codeStyle: "compact",
      blockquoteStyle: "minimal",
      listStyle: "tight",
    },
    narrative: {
      fontSize: 1.0,
      lineHeight: 1.8,
      paragraphSpacing: 1.0,
      headingScale: 1.15,
      maxWidth: "720px",
      columnCount: 1,
      imageStyle: "inline",
      codeStyle: "expanded",
      blockquoteStyle: "minimal",
      listStyle: "spaced",
    },
  };

  return layouts[style];
}

/**
 * Generate CSS from layout adjustments
 */
export function generateLayoutCSS(adjustments: LayoutAdjustments): string {
  return `
    .document-body {
      font-size: ${adjustments.fontSize}rem;
      line-height: ${adjustments.lineHeight};
      max-width: ${adjustments.maxWidth};
      margin: 0 auto;
    }
    .document-body p { margin-bottom: ${adjustments.paragraphSpacing}rem; }
    .document-body h1 { font-size: ${2.5 * adjustments.headingScale}rem; }
    .document-body h2 { font-size: ${1.875 * adjustments.headingScale}rem; }
    .document-body h3 { font-size: ${1.375 * adjustments.headingScale}rem; }
    ${adjustments.imageStyle === 'full-width' ? '.document-body img { width: 100%; border-radius: 8px; margin: 1.5rem 0; }' : ''}
    ${adjustments.codeStyle === 'terminal' ? '.document-body pre { border-radius: 8px; border: 1px solid #333; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }' : ''}
    ${adjustments.codeStyle === 'terminal' ? '.document-body pre::before { content: "●  ●  ●"; display: block; margin-bottom: 0.75rem; font-size: 0.6rem; color: #666; letter-spacing: 0.3em; }' : ''}
    ${adjustments.blockquoteStyle === 'editorial' ? '.document-body blockquote { font-size: 1.15em; font-style: italic; border-left-width: 4px; padding: 1rem 1.5rem; }' : ''}
    ${adjustments.listStyle === 'card' ? '.document-body li { padding: 0.5rem 0; border-bottom: 1px solid rgba(0,0,0,0.05); }' : ''}
  `;
}
