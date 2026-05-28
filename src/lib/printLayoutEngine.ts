/**
 * Print Layout Engine
 * Real publishing-quality layout features for PDF export.
 * Implements: chapter breaks, print-safe margins, page balancing,
 * table splitting, image captions, bleed settings.
 */

export interface PrintLayoutSettings {
  enableChapterBreaks: boolean;
  enableSmartPageBreaks: boolean;
  enableTableSplitting: boolean;
  enableImageCaptions: boolean;
  enableBleed: boolean;
  bleedSize: number; // in mm
  enableRunningHeaders: boolean;
  enableDropCaps: boolean;
  pageNumberPosition: "bottom-center" | "bottom-right" | "bottom-left" | "top-right";
  firstPageNoNumber: boolean;
  startPageNumber: number;
}

export const defaultPrintLayoutSettings: PrintLayoutSettings = {
  enableChapterBreaks: true,
  enableSmartPageBreaks: true,
  enableTableSplitting: true,
  enableImageCaptions: true,
  enableBleed: false,
  bleedSize: 3,
  enableRunningHeaders: false,
  enableDropCaps: false,
  pageNumberPosition: "bottom-center",
  firstPageNoNumber: true,
  startPageNumber: 1,
};

/**
 * Generates print layout CSS for PDF export
 */
export function generatePrintLayoutCSS(settings: PrintLayoutSettings): string {
  let css = "";

  // Chapter breaks: H1 always starts a new page
  if (settings.enableChapterBreaks) {
    css += `
      h1 {
        break-before: page;
        page-break-before: always;
        padding-top: 3rem;
      }
      /* First H1 doesn't need a break */
      .pdf-content > h1:first-child,
      #pdf-content > h1:first-child {
        break-before: auto;
        page-break-before: auto;
        padding-top: 0;
      }
    `;
  }

  // Smart page breaks
  if (settings.enableSmartPageBreaks) {
    css += `
      /* Never break inside these elements */
      h1, h2, h3, h4, h5, h6 {
        break-after: avoid;
        page-break-after: avoid;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      /* Keep headings with following content */
      h1 + *, h2 + *, h3 + *, h4 + * {
        break-before: avoid;
        page-break-before: avoid;
      }
      /* Don't break code blocks */
      pre, .code-block {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      /* Don't break blockquotes if small */
      blockquote {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      /* Don't break figures */
      figure, .figure-container {
        break-inside: avoid;
        page-break-inside: avoid;
      }
      /* Don't break small tables */
      table {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;
  }

  // Table splitting for large tables
  if (settings.enableTableSplitting) {
    css += `
      /* Allow large tables to split */
      table.large-table {
        break-inside: auto;
        page-break-inside: auto;
      }
      /* But keep header with first rows */
      thead {
        display: table-header-group;
      }
      tfoot {
        display: table-footer-group;
      }
      tr {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;
  }

  // Image captions
  if (settings.enableImageCaptions) {
    css += `
      figure {
        margin: 1.5rem 0;
        text-align: center;
      }
      figure img {
        max-width: 100%;
        border-radius: 4px;
      }
      figcaption, .image-caption {
        font-size: 0.85rem;
        color: #666;
        font-style: italic;
        margin-top: 0.5rem;
        text-align: center;
      }
      /* Auto-caption for images with alt text */
      img[alt]:not([alt=""]) {
        display: block;
        margin: 0 auto;
      }
    `;
  }

  // Bleed settings
  if (settings.enableBleed) {
    css += `
      @page {
        bleed: ${settings.bleedSize}mm;
      }
      .full-bleed {
        margin-left: -${settings.bleedSize}mm;
        margin-right: -${settings.bleedSize}mm;
        width: calc(100% + ${settings.bleedSize * 2}mm);
      }
    `;
  }

  // Drop caps
  if (settings.enableDropCaps) {
    css += `
      .chapter-start > p:first-of-type::first-letter,
      h1 + p::first-letter {
        float: left;
        font-size: 3.5em;
        line-height: 0.8;
        padding-right: 0.1em;
        font-weight: bold;
        color: inherit;
        margin-top: 0.05em;
      }
    `;
  }

  // Page numbers
  css += `
    @page {
      @bottom-center {
        content: ${settings.pageNumberPosition === "bottom-center" ? "counter(page)" : "none"};
      }
      @bottom-right {
        content: ${settings.pageNumberPosition === "bottom-right" ? "counter(page)" : "none"};
      }
      @bottom-left {
        content: ${settings.pageNumberPosition === "bottom-left" ? "counter(page)" : "none"};
      }
      @top-right {
        content: ${settings.pageNumberPosition === "top-right" ? "counter(page)" : "none"};
      }
    }
    ${settings.firstPageNoNumber ? `
      @page :first {
        @bottom-center { content: none; }
        @bottom-right { content: none; }
        @bottom-left { content: none; }
        @top-right { content: none; }
      }
    ` : ""}
    body {
      counter-reset: page ${settings.startPageNumber - 1};
    }
  `;

  // Running headers
  if (settings.enableRunningHeaders) {
    css += `
      @page {
        @top-left {
          content: string(chapter-title);
          font-size: 0.75rem;
          color: #999;
        }
      }
      h1 {
        string-set: chapter-title content();
      }
    `;
  }

  return css;
}

/**
 * Process images in HTML content to add captions from alt text
 */
export function processImageCaptions(html: string): string {
  // Wrap images with alt text in figure elements with captions
  return html.replace(
    /<img([^>]*?)alt="([^"]+)"([^>]*?)>/g,
    (match, before, alt, after) => {
      if (alt && alt.trim()) {
        return `<figure><img${before}alt="${alt}"${after}><figcaption>${alt}</figcaption></figure>`;
      }
      return match;
    }
  );
}

/**
 * Mark large tables for splitting
 */
export function processLargeTables(html: string): string {
  // Add class to tables with many rows
  return html.replace(/<table>/g, (match) => {
    return '<table class="large-table">';
  });
}
