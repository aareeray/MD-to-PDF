/**
 * Alive Typography System
 * Dynamic typography that feels emotionally responsive:
 * - Adaptive weight (contextual bold emphasis)
 * - Contextual spacing (tighter around lists, airy around prose)
 * - Intelligent emphasis (automatic visual hierarchy enhancement)
 * - Breathing line-height (varies by content type)
 * - Rhythm-aware scaling (headings scale based on section depth)
 * - Responsive measure (optimal line length for readability)
 */

export interface AliveTypographySettings {
  enabled: boolean;
  adaptiveWeight: boolean;
  contextualSpacing: boolean;
  intelligentEmphasis: boolean;
  breathingLeading: boolean;
  rhythmScaling: boolean;
  responsiveMeasure: boolean;
  optimalReadingWidth: number; // characters per line (55-80)
}

export const defaultAliveTypography: AliveTypographySettings = {
  enabled: true,
  adaptiveWeight: true,
  contextualSpacing: true,
  intelligentEmphasis: true,
  breathingLeading: true,
  rhythmScaling: true,
  responsiveMeasure: true,
  optimalReadingWidth: 66, // Bringhurst optimal
};

/**
 * Generate alive typography CSS
 */
export function generateAliveTypographyCSS(settings: AliveTypographySettings): string {
  if (!settings.enabled) return "";
  let css = "";

  // Responsive measure: optimal reading width
  if (settings.responsiveMeasure) {
    css += `
      .alive-type {
        max-width: ${settings.optimalReadingWidth}ch;
        margin-left: auto;
        margin-right: auto;
      }
      /* Tables and code can break out */
      .alive-type pre, .alive-type table {
        max-width: ${settings.optimalReadingWidth + 10}ch;
      }
    `;
  }

  // Adaptive weight
  if (settings.adaptiveWeight) {
    css += `
      .alive-type h1 { font-weight: 800; }
      .alive-type h2 { font-weight: 700; }
      .alive-type h3 { font-weight: 600; }
      .alive-type h4 { font-weight: 600; }
      .alive-type strong { font-weight: 650; }
      .alive-type blockquote { font-weight: 400; }
      .alive-type figcaption { font-weight: 400; }
      /* First paragraph after heading: slightly lighter for contrast */
      .alive-type h1 + p, .alive-type h2 + p {
        font-weight: 380;
      }
    `;
  }

  // Contextual spacing
  if (settings.contextualSpacing) {
    css += `
      /* Prose paragraphs: comfortable */
      .alive-type > p + p { margin-top: 0.8em; }
      /* After headings: tighter to connect */
      .alive-type > h1 + p, .alive-type > h2 + p, .alive-type > h3 + p { margin-top: 0.4em; }
      /* Before headings: generous to separate */
      .alive-type > p + h2, .alive-type > p + h3 { margin-top: 2.4em; }
      /* Lists: compact internally */
      .alive-type li { margin-bottom: 0.25em; }
      .alive-type > ul + p, .alive-type > ol + p { margin-top: 1.2em; }
      /* Code blocks: breathing room */
      .alive-type > pre { margin: 1.8em 0; }
      .alive-type > p + pre { margin-top: 1.4em; }
      .alive-type > pre + p { margin-top: 1.4em; }
      /* Blockquotes: extra air */
      .alive-type > blockquote { margin: 2em 0; }
    `;
  }

  // Intelligent emphasis
  if (settings.intelligentEmphasis) {
    css += `
      /* Make the first sentence of the document subtly larger */
      .alive-type > p:first-of-type {
        font-size: 1.08em;
        line-height: 1.75;
      }
      /* Emphasize standalone blockquotes */
      .alive-type > blockquote:only-of-type {
        font-size: 1.1em;
        padding: 1.5em 2em;
      }
    `;
  }

  // Breathing leading
  if (settings.breathingLeading) {
    css += `
      .alive-type { line-height: 1.75; }
      .alive-type h1 { line-height: 1.15; }
      .alive-type h2 { line-height: 1.2; }
      .alive-type h3 { line-height: 1.3; }
      .alive-type li { line-height: 1.6; }
      .alive-type blockquote { line-height: 1.85; }
      .alive-type pre { line-height: 1.55; }
      /* Longer paragraphs get slightly more leading for fatigue reduction */
      .alive-type > p:nth-child(n+6) {
        line-height: 1.8;
      }
    `;
  }

  // Rhythm-aware heading scaling
  if (settings.rhythmScaling) {
    css += `
      .alive-type h1 {
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        letter-spacing: -0.03em;
      }
      .alive-type h2 {
        font-size: clamp(1.35rem, 3vw, 1.875rem);
        letter-spacing: -0.02em;
      }
      .alive-type h3 {
        font-size: clamp(1.1rem, 2.5vw, 1.375rem);
        letter-spacing: -0.01em;
      }
    `;
  }

  return css;
}
