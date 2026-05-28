/**
 * Thought Preservation System
 * Reframes document export as PRESERVING thought beautifully.
 * Creates archival-quality documents that feel timeless and collectible.
 *
 * Features:
 * - Archival metadata embedding
 * - Legacy typography presets (designed to look good in 10+ years)
 * - Timeless color palettes (never trendy, always elegant)
 * - Permanence-oriented layout (generous margins, clear hierarchy)
 * - Manuscript numbering system
 * - Creation story (when/where/how the document was made)
 */

export interface PreservationMetadata {
  creationDate: string;
  preservedAt: string;
  documentId: string;
  wordCount: number;
  readingTime: number;
  revisionNumber: number;
  creatorName: string;
  philosophy: string;
}

export interface PreservationSettings {
  enabled: boolean;
  archivalMode: boolean;         // Timeless typography
  manuscriptNumbering: boolean;  // Unique document ID
  creationStory: boolean;        // When/how metadata
  timelessPalette: boolean;      // Never-trendy colors
  permanenceLayout: boolean;     // Generous margins for longevity
  philosophyMark: boolean;       // Embed the brand philosophy
}

export const defaultPreservationSettings: PreservationSettings = {
  enabled: false,
  archivalMode: true,
  manuscriptNumbering: true,
  creationStory: true,
  timelessPalette: true,
  permanenceLayout: true,
  philosophyMark: true,
};

/**
 * Generate a unique manuscript ID
 */
export function generateManuscriptId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MF-${year}${month}${day}-${random}`;
}

/**
 * Generate preservation metadata
 */
export function generatePreservationMetadata(
  content: string,
  creatorName: string,
  revisionNumber: number = 1
): PreservationMetadata {
  const words = content.split(/\s+/).filter(w => w.length > 0).length;
  const now = new Date();

  return {
    creationDate: now.toISOString().split("T")[0],
    preservedAt: now.toLocaleString("en-US", {
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    }),
    documentId: generateManuscriptId(),
    wordCount: words,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    revisionNumber,
    creatorName,
    philosophy: "Words deserve architecture.",
  };
}

/**
 * Generate archival/timeless CSS
 */
export function generatePreservationCSS(settings: PreservationSettings): string {
  if (!settings.enabled) return "";
  let css = "";

  // Timeless palette: never trendy, always elegant
  if (settings.timelessPalette) {
    css += `
      .preserved-doc {
        color: #1f2937;
        --heading-color: #111827;
        --accent: #4338ca;
        --muted: #6b7280;
        --subtle-bg: #f9fafb;
        --border: #e5e7eb;
      }
      .preserved-doc h1, .preserved-doc h2, .preserved-doc h3 {
        color: var(--heading-color);
      }
      .preserved-doc a { color: var(--accent); }
      .preserved-doc blockquote { color: var(--muted); border-color: var(--accent); }
      .preserved-doc code:not(pre code) { background: var(--subtle-bg); border: 1px solid var(--border); }
    `;
  }

  // Archival typography: designed to look good forever
  if (settings.archivalMode) {
    css += `
      .preserved-doc {
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 11.5pt;
        line-height: 1.75;
        letter-spacing: 0.01em;
      }
      .preserved-doc h1 {
        font-family: 'Georgia', serif;
        font-size: 24pt;
        font-weight: 700;
        margin-top: 36pt;
        margin-bottom: 12pt;
        letter-spacing: -0.01em;
      }
      .preserved-doc h2 {
        font-size: 18pt;
        font-weight: 600;
        margin-top: 28pt;
        margin-bottom: 8pt;
      }
      .preserved-doc h3 {
        font-size: 13pt;
        font-weight: 600;
        margin-top: 20pt;
        margin-bottom: 6pt;
      }
    `;
  }

  // Permanence layout: generous margins
  if (settings.permanenceLayout) {
    css += `
      .preserved-doc {
        max-width: 38em;
        margin: 0 auto;
        padding: 60pt 72pt;
      }
      .preserved-doc p {
        margin-bottom: 0.75em;
        text-align: justify;
        hyphens: auto;
      }
    `;
  }

  return css;
}

/**
 * Generate creation story HTML for document colophon
 */
export function generateColophon(metadata: PreservationMetadata, settings: PreservationSettings): string {
  if (!settings.creationStory) return "";

  return `
    <div class="document-colophon" style="
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
      font-size: 0.7rem;
      color: #9ca3af;
      line-height: 1.6;
      page-break-before: always;
    ">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 0.5rem;">Colophon</div>
      </div>
      ${settings.manuscriptNumbering ? `<div>Document ID: <span style="font-family: monospace;">${metadata.documentId}</span></div>` : ""}
      <div>Preserved: ${metadata.preservedAt}</div>
      <div>${metadata.wordCount.toLocaleString()} words · ${metadata.readingTime} min read</div>
      ${metadata.creatorName ? `<div>Author: ${metadata.creatorName}</div>` : ""}
      <div>Revision: ${metadata.revisionNumber}</div>
      ${settings.philosophyMark ? `
        <div style="margin-top: 1.5rem; font-style: italic; text-align: center; color: #6b7280;">
          "${metadata.philosophy}"
        </div>
        <div style="text-align: center; margin-top: 0.5rem; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase;">
          Crafted with MarkFlow
        </div>
      ` : ""}
    </div>
  `;
}
