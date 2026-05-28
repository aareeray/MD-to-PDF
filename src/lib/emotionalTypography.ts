/**
 * Emotional Typography Modes
 * Like Spotify moods — but for documents.
 * Each mode changes spacing, rhythm, font pairing, shadows, contrast, and page composition.
 */

export type EmotionalMode =
  | "calm"
  | "academic"
  | "futuristic"
  | "minimal"
  | "noir"
  | "luxury"
  | "cybernetic"
  | "storybook";

export interface EmotionalModeConfig {
  id: EmotionalMode;
  name: string;
  description: string;
  icon: string;
  colors: { primary: string; accent: string; bg: string; text: string };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
    lineHeight: number;
    letterSpacing: string;
    paragraphSpacing: number;
    headingWeight: number;
  };
  visual: {
    borderRadius: string;
    shadow: string;
    contrast: "low" | "medium" | "high";
    texture: string;
  };
}

export const emotionalModes: Record<EmotionalMode, EmotionalModeConfig> = {
  calm: {
    id: "calm",
    name: "Calm",
    description: "Soft, serene, gentle on the eyes. Perfect for mindful reading.",
    icon: "🌿",
    colors: { primary: "#6b9080", accent: "#a4c3b2", bg: "#f6fff8", text: "#2d3436" },
    typography: {
      headingFont: "Georgia",
      bodyFont: "Georgia",
      codeFont: "JetBrains Mono",
      lineHeight: 2.0,
      letterSpacing: "0.01em",
      paragraphSpacing: 1.5,
      headingWeight: 500,
    },
    visual: {
      borderRadius: "12px",
      shadow: "0 2px 20px rgba(107,144,128,0.08)",
      contrast: "low",
      texture: "none",
    },
  },
  academic: {
    id: "academic",
    name: "Academic",
    description: "Structured, formal, authoritative. Ideal for papers and theses.",
    icon: "🎓",
    colors: { primary: "#1a365d", accent: "#2a4365", bg: "#ffffff", text: "#1a202c" },
    typography: {
      headingFont: "Georgia",
      bodyFont: "Times New Roman",
      codeFont: "Courier New",
      lineHeight: 1.8,
      letterSpacing: "0",
      paragraphSpacing: 1.2,
      headingWeight: 700,
    },
    visual: {
      borderRadius: "0",
      shadow: "none",
      contrast: "high",
      texture: "none",
    },
  },
  futuristic: {
    id: "futuristic",
    name: "Futuristic",
    description: "Sharp, geometric, forward-looking. For cutting-edge content.",
    icon: "🚀",
    colors: { primary: "#00d4ff", accent: "#7c3aed", bg: "#0f0f23", text: "#e2e8f0" },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      codeFont: "JetBrains Mono",
      lineHeight: 1.65,
      letterSpacing: "-0.01em",
      paragraphSpacing: 1.0,
      headingWeight: 800,
    },
    visual: {
      borderRadius: "4px",
      shadow: "0 0 30px rgba(0,212,255,0.1)",
      contrast: "high",
      texture: "grid",
    },
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description: "Pure, clean, nothing extra. Maximum content focus.",
    icon: "◻️",
    colors: { primary: "#000000", accent: "#666666", bg: "#ffffff", text: "#1a1a1a" },
    typography: {
      headingFont: "Inter",
      bodyFont: "Inter",
      codeFont: "SF Mono",
      lineHeight: 1.7,
      letterSpacing: "-0.01em",
      paragraphSpacing: 1.0,
      headingWeight: 600,
    },
    visual: {
      borderRadius: "2px",
      shadow: "none",
      contrast: "medium",
      texture: "none",
    },
  },
  noir: {
    id: "noir",
    name: "Noir",
    description: "Dark, moody, cinematic. For dramatic storytelling.",
    icon: "🌑",
    colors: { primary: "#f5f5f5", accent: "#dc2626", bg: "#0a0a0a", text: "#d4d4d4" },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Georgia",
      codeFont: "Fira Code",
      lineHeight: 1.85,
      letterSpacing: "0.005em",
      paragraphSpacing: 1.3,
      headingWeight: 700,
    },
    visual: {
      borderRadius: "0",
      shadow: "0 4px 40px rgba(0,0,0,0.5)",
      contrast: "high",
      texture: "grain",
    },
  },
  luxury: {
    id: "luxury",
    name: "Luxury",
    description: "Opulent, refined, editorial. For premium content.",
    icon: "✨",
    colors: { primary: "#b8860b", accent: "#8b6914", bg: "#fffef5", text: "#1a1a1a" },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Inter",
      codeFont: "Fira Code",
      lineHeight: 1.9,
      letterSpacing: "0.01em",
      paragraphSpacing: 1.4,
      headingWeight: 700,
    },
    visual: {
      borderRadius: "8px",
      shadow: "0 8px 40px rgba(184,134,11,0.08)",
      contrast: "medium",
      texture: "linen",
    },
  },
  cybernetic: {
    id: "cybernetic",
    name: "Cybernetic",
    description: "Machine-like, precise, data-driven. For technical minds.",
    icon: "🤖",
    colors: { primary: "#00ff88", accent: "#ff00ff", bg: "#0d0d1a", text: "#c0ffd0" },
    typography: {
      headingFont: "JetBrains Mono",
      bodyFont: "IBM Plex Sans",
      codeFont: "JetBrains Mono",
      lineHeight: 1.6,
      letterSpacing: "-0.02em",
      paragraphSpacing: 0.8,
      headingWeight: 700,
    },
    visual: {
      borderRadius: "2px",
      shadow: "0 0 20px rgba(0,255,136,0.1), inset 0 0 20px rgba(0,255,136,0.02)",
      contrast: "high",
      texture: "scanlines",
    },
  },
  storybook: {
    id: "storybook",
    name: "Storybook",
    description: "Whimsical, warm, narrative. For creative writing.",
    icon: "📖",
    colors: { primary: "#8b4513", accent: "#d4a373", bg: "#fefae0", text: "#3d2914" },
    typography: {
      headingFont: "Playfair Display",
      bodyFont: "Georgia",
      codeFont: "Courier New",
      lineHeight: 2.0,
      letterSpacing: "0.005em",
      paragraphSpacing: 1.5,
      headingWeight: 600,
    },
    visual: {
      borderRadius: "16px",
      shadow: "0 4px 20px rgba(139,69,19,0.1)",
      contrast: "low",
      texture: "paper",
    },
  },
};

/**
 * Generate CSS for an emotional typography mode
 */
export function generateEmotionalCSS(mode: EmotionalMode): string {
  const config = emotionalModes[mode];
  const { colors, typography, visual } = config;

  return `
    body {
      font-family: '${typography.bodyFont}', serif;
      color: ${colors.text};
      background: ${colors.bg};
      line-height: ${typography.lineHeight};
      letter-spacing: ${typography.letterSpacing};
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: '${typography.headingFont}', serif;
      font-weight: ${typography.headingWeight};
      color: ${colors.text};
    }
    h1 { font-size: 2.5rem; margin: ${typography.paragraphSpacing * 2}rem 0 ${typography.paragraphSpacing * 0.75}rem; }
    h2 { font-size: 1.875rem; margin: ${typography.paragraphSpacing * 1.5}rem 0 ${typography.paragraphSpacing * 0.5}rem; }
    h3 { font-size: 1.375rem; margin: ${typography.paragraphSpacing * 1.25}rem 0 ${typography.paragraphSpacing * 0.4}rem; }
    p { margin-bottom: ${typography.paragraphSpacing}rem; }
    code, pre { font-family: '${typography.codeFont}', monospace; }
    pre {
      border-radius: ${visual.borderRadius};
      ${visual.shadow !== 'none' ? `box-shadow: ${visual.shadow};` : ''}
    }
    blockquote {
      border-left: 3px solid ${colors.primary};
      padding: 0.75rem 1.25rem;
      margin: 1.25rem 0;
      border-radius: 0 ${visual.borderRadius} ${visual.borderRadius} 0;
    }
    a { color: ${colors.primary}; }
    table { border-radius: ${visual.borderRadius}; overflow: hidden; }
    th { background: ${colors.primary}10; }
    code:not(pre code) {
      background: ${colors.primary}10;
      border-radius: ${visual.borderRadius === '0' ? '2px' : '4px'};
      padding: 0.15rem 0.4rem;
    }
    hr { border-color: ${colors.accent}40; }
    ${visual.texture === 'grain' ? `body::before { content: ''; position: fixed; inset: 0; opacity: 0.03; background: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); pointer-events: none; z-index: 9999; }` : ''}
    ${visual.texture === 'scanlines' ? `body::before { content: ''; position: fixed; inset: 0; opacity: 0.03; background: repeating-linear-gradient(0deg, transparent, transparent 1px, ${colors.primary} 1px, ${colors.primary} 2px); pointer-events: none; z-index: 9999; }` : ''}
  `;
}

/**
 * Get all modes as array for UI rendering
 */
export function getAllModes(): EmotionalModeConfig[] {
  return Object.values(emotionalModes);
}
