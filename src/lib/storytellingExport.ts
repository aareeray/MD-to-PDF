/**
 * Storytelling Export Layouts
 * Cinematic narrative layouts for PDFs that feel like experiences:
 * - Dramatic opening pages with oversized typography
 * - Section transitions (full-bleed dividers)
 * - Pacing control (varying whitespace)
 * - Full-bleed moments
 * - Oversized pull quotes
 */

export type StorytellingStyle = "none" | "cinematic" | "magazine" | "memoir" | "manifesto" | "portfolio";

export interface StorytellingSettings {
  style: StorytellingStyle;
  dramaticOpening: boolean;
  fullBleedImages: boolean;
  oversizedQuotes: boolean;
  sectionTransitions: boolean;
  pacingControl: boolean; // vary whitespace for rhythm
  dropCapsChapters: boolean;
}

export const defaultStorytellingSettings: StorytellingSettings = {
  style: "none",
  dramaticOpening: true,
  fullBleedImages: true,
  oversizedQuotes: true,
  sectionTransitions: true,
  pacingControl: true,
  dropCapsChapters: true,
};

/**
 * Generate storytelling CSS for export
 */
export function generateStorytellingCSS(settings: StorytellingSettings): string {
  if (settings.style === "none") return "";

  const styles: Record<StorytellingStyle, string> = {
    none: "",
    cinematic: `
      /* Cinematic: bold, dramatic, wide margins, high contrast */
      .document-body { padding: 60px 80px; }
      
      /* Dramatic opening: first heading is massive */
      ${settings.dramaticOpening ? `
        .document-body > h1:first-of-type {
          font-size: 4rem;
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.0;
          margin-bottom: 2rem;
          padding-top: 4rem;
          padding-bottom: 2rem;
          border-bottom: 4px solid currentColor;
        }
        .document-body > h1:first-of-type + p {
          font-size: 1.3rem;
          line-height: 1.7;
          color: #555;
          margin-bottom: 3rem;
        }
      ` : ''}

      /* Section transitions */
      ${settings.sectionTransitions ? `
        .document-body > h2 {
          page-break-before: always;
          padding-top: 6rem;
          margin-top: 0;
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .document-body > h2::before {
          content: '';
          display: block;
          width: 60px;
          height: 4px;
          background: currentColor;
          margin-bottom: 1.5rem;
        }
      ` : ''}

      /* Oversized quotes */
      ${settings.oversizedQuotes ? `
        .document-body > blockquote {
          font-size: 1.6rem;
          line-height: 1.5;
          font-style: italic;
          padding: 2rem 0;
          margin: 3rem 0;
          border-left: none;
          border-top: 2px solid rgba(0,0,0,0.1);
          border-bottom: 2px solid rgba(0,0,0,0.1);
          text-align: center;
          background: none;
        }
      ` : ''}

      /* Full-bleed images */
      ${settings.fullBleedImages ? `
        .document-body > p > img,
        .document-body > figure > img {
          width: calc(100% + 160px);
          margin-left: -80px;
          margin-right: -80px;
          max-width: none;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }
      ` : ''}

      /* Drop caps */
      ${settings.dropCapsChapters ? `
        .document-body > h1 + p::first-letter,
        .document-body > h2 + p::first-letter {
          float: left;
          font-size: 4.5em;
          line-height: 0.8;
          padding-right: 0.1em;
          font-weight: 700;
          margin-top: 0.05em;
        }
      ` : ''}

      /* Pacing: extra whitespace between major sections */
      ${settings.pacingControl ? `
        .document-body > h1 { margin-top: 5rem; }
        .document-body > hr {
          margin: 4rem 0;
          border: none;
          text-align: center;
        }
        .document-body > hr::before {
          content: '•  •  •';
          color: rgba(0,0,0,0.3);
          letter-spacing: 0.5em;
        }
      ` : ''}
    `,
    magazine: `
      .document-body { padding: 50px 60px; }
      ${settings.dramaticOpening ? `
        .document-body > h1:first-of-type {
          font-size: 3.5rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          line-height: 1.05;
          margin-bottom: 1rem;
          padding-top: 3rem;
        }
      ` : ''}
      ${settings.oversizedQuotes ? `
        .document-body > blockquote {
          font-size: 1.4rem;
          border-left: 6px solid currentColor;
          padding: 1.5rem 2rem;
          margin: 2.5rem 0;
          font-weight: 500;
        }
      ` : ''}
      ${settings.fullBleedImages ? `
        .document-body > p > img {
          width: calc(100% + 120px);
          margin-left: -60px;
          max-width: none;
        }
      ` : ''}
      ${settings.sectionTransitions ? `
        .document-body > h2 {
          font-size: 2rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding-top: 3rem;
          border-top: 1px solid rgba(0,0,0,0.1);
          margin-top: 3rem;
        }
      ` : ''}
    `,
    memoir: `
      .document-body { padding: 60px 70px; font-family: Georgia, serif; }
      ${settings.dramaticOpening ? `
        .document-body > h1:first-of-type {
          font-size: 3rem;
          font-weight: 400;
          font-style: italic;
          letter-spacing: -0.01em;
          text-align: center;
          margin-bottom: 2rem;
          padding: 4rem 0 2rem;
        }
      ` : ''}
      ${settings.dropCapsChapters ? `
        .document-body > h1 + p::first-letter,
        .document-body > h2 + p::first-letter {
          float: left;
          font-size: 5em;
          line-height: 0.75;
          padding-right: 0.12em;
          font-weight: 400;
          font-style: italic;
        }
      ` : ''}
      ${settings.oversizedQuotes ? `
        .document-body > blockquote {
          font-size: 1.4rem;
          text-align: center;
          border: none;
          padding: 2rem;
          margin: 3rem 1rem;
          font-style: italic;
          color: #555;
        }
      ` : ''}
      ${settings.pacingControl ? `
        .document-body > hr { margin: 3rem 0; border: none; text-align: center; }
        .document-body > hr::before { content: '✦'; color: #999; font-size: 1.2rem; }
      ` : ''}
    `,
    manifesto: `
      .document-body { padding: 60px 60px; }
      ${settings.dramaticOpening ? `
        .document-body > h1:first-of-type {
          font-size: 4.5rem;
          font-weight: 900;
          letter-spacing: -0.05em;
          line-height: 0.95;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          padding-top: 3rem;
        }
      ` : ''}
      ${settings.oversizedQuotes ? `
        .document-body > blockquote {
          font-size: 2rem;
          font-weight: 800;
          line-height: 1.3;
          border-left: 8px solid currentColor;
          padding: 1rem 2rem;
          margin: 2.5rem 0;
          background: none;
        }
      ` : ''}
      ${settings.sectionTransitions ? `
        .document-body > h2 {
          font-size: 2.5rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          padding-top: 4rem;
          margin-top: 2rem;
        }
      ` : ''}
    `,
    portfolio: `
      .document-body { padding: 50px 50px; }
      ${settings.dramaticOpening ? `
        .document-body > h1:first-of-type {
          font-size: 2.5rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-align: center;
          margin-bottom: 0.5rem;
          padding-top: 5rem;
          padding-bottom: 2rem;
        }
        .document-body > h1:first-of-type + p {
          text-align: center;
          color: #888;
          font-size: 1.1rem;
          margin-bottom: 4rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }
      ` : ''}
      ${settings.fullBleedImages ? `
        .document-body > p > img {
          width: calc(100% + 100px);
          margin-left: -50px;
          max-width: none;
          border-radius: 8px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
      ` : ''}
      ${settings.sectionTransitions ? `
        .document-body > h2 {
          font-size: 1.5rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding-top: 3rem;
          margin-top: 3rem;
          border-top: 1px solid #eee;
        }
      ` : ''}
    `,
  };

  return styles[settings.style] || "";
}
