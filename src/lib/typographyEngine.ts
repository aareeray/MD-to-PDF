/**
 * Typography Engine
 * Professional typographic rules for premium PDF output.
 * Implements: optical sizing, smart line-height, widow/orphan prevention,
 * hanging punctuation, adaptive spacing, paragraph rhythm.
 */

export interface TypographySettings {
  enableOpticalSizing: boolean;
  enableSmartLineHeight: boolean;
  enableWidowOrphanPrevention: boolean;
  enableHangingPunctuation: boolean;
  enableAdaptiveSpacing: boolean;
  enableSmartQuotes: boolean;
  paragraphSpacing: "tight" | "normal" | "relaxed";
  headingScale: "compact" | "normal" | "dramatic";
}

export const defaultTypographySettings: TypographySettings = {
  enableOpticalSizing: true,
  enableSmartLineHeight: true,
  enableWidowOrphanPrevention: true,
  enableHangingPunctuation: true,
  enableAdaptiveSpacing: true,
  enableSmartQuotes: true,
  paragraphSpacing: "normal",
  headingScale: "normal",
};

// Smart line-height calculations based on font size and line length
function getOptimalLineHeight(fontSize: number, lineLength: number): number {
  // Golden ratio base: 1.618
  // Adjust based on line length (longer lines need more leading)
  const baseRatio = 1.5;
  const lengthFactor = Math.min(lineLength / 65, 1.3); // 65 chars is ideal
  return baseRatio * lengthFactor;
}

// Heading scale ratios
const headingScales = {
  compact: { h1: 2.0, h2: 1.6, h3: 1.3, h4: 1.1 },
  normal: { h1: 2.5, h2: 1.875, h3: 1.5, h4: 1.25 },
  dramatic: { h1: 3.5, h2: 2.25, h3: 1.75, h4: 1.375 },
};

// Paragraph spacing ratios
const spacingRatios = {
  tight: { paragraph: 0.75, heading: 1.25, section: 1.5 },
  normal: { paragraph: 1.0, heading: 1.75, section: 2.5 },
  relaxed: { paragraph: 1.5, heading: 2.25, section: 3.5 },
};

/**
 * Generates premium typography CSS based on settings
 */
export function generateTypographyCSS(settings: TypographySettings): string {
  const scale = headingScales[settings.headingScale];
  const spacing = spacingRatios[settings.paragraphSpacing];

  let css = "";

  // Optical font sizing
  if (settings.enableOpticalSizing) {
    css += `
      body {
        font-optical-sizing: auto;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
      }
    `;
  }

  // Smart line-height
  if (settings.enableSmartLineHeight) {
    css += `
      body { line-height: ${getOptimalLineHeight(16, 70)}; }
      h1 { line-height: 1.15; }
      h2 { line-height: 1.2; }
      h3 { line-height: 1.25; }
      h4 { line-height: 1.3; }
      li { line-height: 1.6; }
      blockquote { line-height: 1.7; }
      pre, code { line-height: 1.55; }
    `;
  }

  // Heading scale
  css += `
    h1 { font-size: ${scale.h1}rem; margin-top: ${spacing.section}rem; margin-bottom: ${spacing.heading * 0.5}rem; letter-spacing: -0.03em; }
    h2 { font-size: ${scale.h2}rem; margin-top: ${spacing.heading}rem; margin-bottom: ${spacing.heading * 0.4}rem; letter-spacing: -0.02em; }
    h3 { font-size: ${scale.h3}rem; margin-top: ${spacing.heading * 0.85}rem; margin-bottom: ${spacing.heading * 0.3}rem; letter-spacing: -0.01em; }
    h4 { font-size: ${scale.h4}rem; margin-top: ${spacing.heading * 0.7}rem; margin-bottom: ${spacing.heading * 0.25}rem; }
  `;

  // Paragraph spacing
  css += `
    p { margin-bottom: ${spacing.paragraph}rem; }
    p + p { margin-top: 0; }
    ul, ol { margin-bottom: ${spacing.paragraph}rem; }
  `;

  // Widow/orphan prevention
  if (settings.enableWidowOrphanPrevention) {
    css += `
      p, li, blockquote {
        orphans: 3;
        widows: 3;
      }
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid;
        page-break-after: avoid;
      }
      table, figure, pre {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;
  }

  // Hanging punctuation
  if (settings.enableHangingPunctuation) {
    css += `
      body {
        hanging-punctuation: first last;
      }
      blockquote {
        hanging-punctuation: first;
      }
    `;
  }

  // Adaptive spacing
  if (settings.enableAdaptiveSpacing) {
    css += `
      /* Reduce spacing when heading follows another heading */
      h1 + h2, h2 + h3, h3 + h4 {
        margin-top: ${spacing.heading * 0.3}rem;
      }
      /* Extra space before code blocks */
      p + pre, p + .code-block {
        margin-top: ${spacing.paragraph * 1.5}rem;
      }
      /* Space after code blocks */
      pre + p, .code-block + p {
        margin-top: ${spacing.paragraph * 1.5}rem;
      }
      /* Tighter spacing for list items */
      li > p {
        margin-bottom: ${spacing.paragraph * 0.5}rem;
      }
      /* Image spacing */
      img {
        margin-top: ${spacing.paragraph * 1.5}rem;
        margin-bottom: ${spacing.paragraph * 1.5}rem;
      }
      /* Table spacing */
      table {
        margin-top: ${spacing.paragraph * 1.5}rem;
        margin-bottom: ${spacing.paragraph * 1.5}rem;
      }
      /* Blockquote rhythm */
      blockquote {
        margin-top: ${spacing.paragraph * 1.25}rem;
        margin-bottom: ${spacing.paragraph * 1.25}rem;
      }
    `;
  }

  return css;
}

/**
 * Smart quotes transformation
 */
export function applySmartQuotes(text: string): string {
  // Opening double quotes
  let result = text.replace(/(^|[\s(\[{])"/g, "$1\u201C");
  // Closing double quotes
  result = result.replace(/"/g, "\u201D");
  // Opening single quotes
  result = result.replace(/(^|[\s(\[{])'/g, "$1\u2018");
  // Apostrophes and closing single quotes
  result = result.replace(/'/g, "\u2019");
  // Em dashes
  result = result.replace(/---/g, "\u2014");
  // En dashes
  result = result.replace(/--/g, "\u2013");
  // Ellipsis
  result = result.replace(/\.\.\./g, "\u2026");
  return result;
}

/**
 * Returns optimal font size based on content density
 */
export function getOptimalFontSize(content: string): number {
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 200) return 16; // Short docs — slightly larger
  if (wordCount < 1000) return 15;
  if (wordCount < 5000) return 14.5;
  return 14; // Long docs — slightly smaller for readability
}
