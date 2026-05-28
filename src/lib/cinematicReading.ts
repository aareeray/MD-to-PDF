/**
 * Cinematic Reading System
 * Makes reading a PDF feel directed like cinema:
 * - Pacing through whitespace timing
 * - Visual tension via typography scale contrast
 * - Section reveals (dramatic chapter openings)
 * - Rhythm variation (alternating dense/airy sections)
 * - Breathing line-height (context-aware leading)
 * - Narrative motion through progressive disclosure
 */

export interface CinematicSettings {
  enabled: boolean;
  dramaticPacing: boolean;       // Extra whitespace between major ideas
  typographicTension: boolean;   // High contrast heading sizes
  sectionReveals: boolean;       // Chapter opens with generous space
  rhythmVariation: boolean;      // Alternating spacing for visual interest
  breathingLineHeight: boolean;  // Context-aware leading
  narrativeMotion: boolean;      // Progressive content density
}

export const defaultCinematicSettings: CinematicSettings = {
  enabled: false,
  dramaticPacing: true,
  typographicTension: true,
  sectionReveals: true,
  rhythmVariation: true,
  breathingLineHeight: true,
  narrativeMotion: true,
};

/**
 * Generate cinematic reading CSS
 */
export function generateCinematicCSS(settings: CinematicSettings): string {
  if (!settings.enabled) return "";
  let css = "";

  // Dramatic pacing: generous whitespace at narrative breaks
  if (settings.dramaticPacing) {
    css += `
      .cinematic-doc > hr {
        margin: 5rem 0;
        border: none;
        height: 0;
      }
      .cinematic-doc > hr::before {
        content: '';
        display: block;
      }
      .cinematic-doc > blockquote {
        margin: 3rem 0;
        padding: 2rem 2.5rem;
      }
    `;
  }

  // Typographic tension: extreme scale contrast
  if (settings.typographicTension) {
    css += `
      .cinematic-doc h1 {
        font-size: 3.5rem;
        font-weight: 900;
        letter-spacing: -0.04em;
        line-height: 1.05;
      }
      .cinematic-doc h2 {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: -0.025em;
      }
      .cinematic-doc h3 {
        font-size: 1.15rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 0.85rem;
        color: #6b7280;
      }
      .cinematic-doc p {
        font-size: 1.05rem;
      }
    `;
  }

  // Section reveals: generous opening space for new sections
  if (settings.sectionReveals) {
    css += `
      .cinematic-doc > h1 {
        padding-top: 6rem;
        margin-bottom: 1.5rem;
      }
      .cinematic-doc > h1:first-child {
        padding-top: 4rem;
      }
      .cinematic-doc > h2 {
        padding-top: 4rem;
        margin-bottom: 1rem;
      }
      /* First paragraph after heading gets special treatment */
      .cinematic-doc > h1 + p,
      .cinematic-doc > h2 + p {
        font-size: 1.15rem;
        line-height: 1.85;
        color: #374151;
      }
    `;
  }

  // Rhythm variation
  if (settings.rhythmVariation) {
    css += `
      /* Alternate paragraph spacing for visual rhythm */
      .cinematic-doc > p:nth-child(odd) {
        margin-bottom: 1.1rem;
      }
      .cinematic-doc > p:nth-child(even) {
        margin-bottom: 0.9rem;
      }
      /* Lists get tighter spacing */
      .cinematic-doc > ul, .cinematic-doc > ol {
        margin: 0.75rem 0 1.5rem;
      }
      /* Images get dramatic breathing room */
      .cinematic-doc img {
        margin: 3rem 0;
      }
    `;
  }

  // Breathing line-height
  if (settings.breathingLineHeight) {
    css += `
      .cinematic-doc p { line-height: 1.85; }
      .cinematic-doc li { line-height: 1.7; }
      .cinematic-doc blockquote { line-height: 1.9; }
      .cinematic-doc pre code { line-height: 1.6; }
      /* Shorter paragraphs get more breathing room */
      .cinematic-doc > p:only-child,
      .cinematic-doc > blockquote + p {
        line-height: 2.0;
      }
    `;
  }

  // Narrative motion: progressive density
  if (settings.narrativeMotion) {
    css += `
      /* First section is airy (inviting) */
      .cinematic-doc > *:nth-child(-n+5) {
        letter-spacing: 0.005em;
      }
      /* Middle content is standard */
      .cinematic-doc > *:nth-child(n+6):nth-child(-n+15) {
        letter-spacing: 0;
      }
      /* End sections close in (conclusion gravity) */
      .cinematic-doc > *:nth-last-child(-n+4) {
        letter-spacing: -0.005em;
      }
    `;
  }

  return css;
}
