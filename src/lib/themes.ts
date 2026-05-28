/**
 * Themes Marketplace
 * Extended theme system with 15+ themes, import/export, and theme metadata.
 */

export interface ThemeMetadata {
  id: string;
  name: string;
  description: string;
  category: "professional" | "creative" | "academic" | "developer" | "minimal" | "dark";
  author: string;
  previewColors: string[]; // 3-4 representative colors
  isBuiltIn: boolean;
}

export interface CustomTheme extends ThemeMetadata {
  css: string;
}

// All theme metadata
export const themeRegistry: ThemeMetadata[] = [
  // Professional
  { id: "minimal-clean", name: "Minimal Clean", description: "Simple and elegant for everyday documents", category: "minimal", author: "MarkFlow", previewColors: ["#1a1a2e", "#3b82f6", "#f8fafc", "#e5e7eb"], isBuiltIn: true },
  { id: "developer-docs", name: "Developer Docs", description: "GitHub-style technical documentation", category: "developer", author: "MarkFlow", previewColors: ["#24292f", "#0969da", "#f6f8fa", "#d0d7de"], isBuiltIn: true },
  { id: "ebook", name: "eBook", description: "Book-style formatting for long content", category: "creative", author: "MarkFlow", previewColors: ["#2d3748", "#805ad5", "#ffffff", "#edf2f7"], isBuiltIn: true },
  { id: "research-paper", name: "Research Paper", description: "Academic formatting with proper structure", category: "academic", author: "MarkFlow", previewColors: ["#000000", "#000000", "#ffffff", "#f5f5f5"], isBuiltIn: true },
  { id: "resume", name: "Resume", description: "Professional CV layout", category: "professional", author: "MarkFlow", previewColors: ["#1f2937", "#3b82f6", "#ffffff", "#f1f5f9"], isBuiltIn: true },
  { id: "luxury-editorial", name: "Luxury Editorial", description: "Premium magazine-style typography", category: "creative", author: "MarkFlow", previewColors: ["#1a1a1a", "#b8860b", "#ffffff", "#f9f9f9"], isBuiltIn: true },
  { id: "dark-cyberpunk", name: "Dark Cyberpunk", description: "Neon-themed dark mode design", category: "dark", author: "MarkFlow", previewColors: ["#0a0a1a", "#00ff88", "#ff00ff", "#1a1a4e"], isBuiltIn: true },
  // New themes
  { id: "apple-notes", name: "Apple Notes", description: "Clean, minimal like Apple's design language", category: "minimal", author: "MarkFlow", previewColors: ["#1d1d1f", "#007aff", "#ffffff", "#f5f5f7"], isBuiltIn: true },
  { id: "newspaper", name: "Newspaper", description: "Classic broadsheet newspaper typography", category: "creative", author: "MarkFlow", previewColors: ["#1a1a1a", "#333333", "#fffff8", "#e8e8e0"], isBuiltIn: true },
  { id: "kindle", name: "Kindle", description: "E-reader optimized for readability", category: "minimal", author: "MarkFlow", previewColors: ["#1a1a1a", "#333333", "#f7f4e9", "#d4c9a8"], isBuiltIn: true },
  { id: "minimal-japanese", name: "Minimal Japanese", description: "Zen-inspired minimal design with generous whitespace", category: "minimal", author: "MarkFlow", previewColors: ["#2c2c2c", "#c0392b", "#fefefe", "#f0ebe3"], isBuiltIn: true },
  { id: "brutalist", name: "Brutalist Docs", description: "Raw, bold, unapologetic design", category: "creative", author: "MarkFlow", previewColors: ["#000000", "#ff0000", "#ffffff", "#000000"], isBuiltIn: true },
  { id: "notion-style", name: "Notion Style", description: "Clean Notion-inspired documentation", category: "professional", author: "MarkFlow", previewColors: ["#37352f", "#2383e2", "#ffffff", "#f7f6f3"], isBuiltIn: true },
  { id: "github-readme", name: "GitHub README", description: "Authentic GitHub markdown rendering", category: "developer", author: "MarkFlow", previewColors: ["#1f2328", "#1f6feb", "#ffffff", "#f6f8fa"], isBuiltIn: true },
  { id: "academic-journal", name: "Academic Journal", description: "Two-column journal article style", category: "academic", author: "MarkFlow", previewColors: ["#000000", "#1a365d", "#ffffff", "#edf2f7"], isBuiltIn: true },
];

// Extended theme CSS
export const extendedThemeStyles: Record<string, string> = {
  "apple-notes": `
    body { font-family: -apple-system, 'SF Pro Text', 'Helvetica Neue', sans-serif; color: #1d1d1f; line-height: 1.65; font-size: 1rem; }
    h1 { font-size: 2rem; font-weight: 700; margin: 1.75rem 0 0.75rem; color: #1d1d1f; }
    h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.5rem; color: #1d1d1f; }
    h3 { font-size: 1.17rem; font-weight: 600; margin: 1.25rem 0 0.5rem; color: #1d1d1f; }
    blockquote { border-left: 3px solid #007aff; padding: 0.5rem 1rem; margin: 1rem 0; background: #f5f5f7; border-radius: 0 8px 8px 0; }
    code { background: #f5f5f7; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #e73c3e; }
    pre { background: #1d1d1f; color: #f5f5f7; padding: 1rem; border-radius: 10px; font-size: 0.85rem; }
    pre code { background: none; color: inherit; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th { background: #f5f5f7; font-weight: 600; padding: 0.6rem 0.75rem; border-bottom: 1px solid #d2d2d7; text-align: left; }
    td { padding: 0.6rem 0.75rem; border-bottom: 1px solid #e8e8ed; }
    a { color: #007aff; text-decoration: none; }
    hr { border: none; border-top: 1px solid #d2d2d7; margin: 1.5rem 0; }
    ul, ol { padding-left: 1.5rem; }
    li { margin-bottom: 0.3rem; }
  `,
  "newspaper": `
    body { font-family: 'Georgia', 'Times New Roman', serif; color: #1a1a1a; line-height: 1.6; font-size: 0.95rem; column-count: 1; }
    h1 { font-family: 'Playfair Display', 'Georgia', serif; font-size: 2.75rem; font-weight: 900; margin: 0 0 0.5rem; line-height: 1.1; letter-spacing: -0.03em; border-bottom: 4px double #1a1a1a; padding-bottom: 0.5rem; }
    h2 { font-family: 'Playfair Display', 'Georgia', serif; font-size: 1.5rem; font-weight: 700; margin: 1.5rem 0 0.5rem; border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; }
    h3 { font-size: 1.15rem; font-weight: 700; margin: 1.25rem 0 0.4rem; font-style: italic; }
    p { text-align: justify; hyphens: auto; margin-bottom: 0.8rem; }
    blockquote { font-style: italic; font-size: 1.2rem; border-left: none; padding: 0.5rem 1.5rem; margin: 1.5rem 0; text-align: center; color: #444; }
    code { font-family: 'Courier New', monospace; font-size: 0.85em; background: #f0f0f0; padding: 0.1rem 0.3rem; }
    pre { background: #f8f8f0; border: 1px solid #ddd; padding: 0.75rem; font-size: 0.8rem; }
    pre code { background: none; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th { border-top: 2px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; padding: 0.5rem; text-align: left; font-weight: 700; }
    td { border-bottom: 1px solid #ddd; padding: 0.4rem 0.5rem; }
    hr { border: none; border-top: 1px solid #999; margin: 1.5rem 0; }
    a { color: #1a1a1a; text-decoration: underline; }
  `,
  "kindle": `
    body { font-family: 'Bookerly', 'Georgia', 'Palatino', serif; color: #1a1a1a; line-height: 1.8; font-size: 1.05rem; background: #f7f4e9; }
    h1 { font-size: 2rem; font-weight: 700; margin: 2rem 0 1rem; text-align: center; }
    h2 { font-size: 1.5rem; font-weight: 600; margin: 1.75rem 0 0.75rem; }
    h3 { font-size: 1.2rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
    blockquote { border-left: 3px solid #999; padding: 0.5rem 1rem; margin: 1rem 1.5rem; font-style: italic; color: #444; }
    code { font-family: 'Courier', monospace; font-size: 0.9em; background: #ede9d8; padding: 0.1rem 0.3rem; border-radius: 2px; }
    pre { background: #ede9d8; padding: 1rem; border-radius: 3px; font-size: 0.85rem; overflow-x: auto; }
    pre code { background: none; }
    p { text-indent: 1.5rem; margin-bottom: 0; }
    p:first-of-type, h1 + p, h2 + p, h3 + p, blockquote + p, pre + p, hr + p { text-indent: 0; }
    a { color: #1a1a1a; text-decoration: underline; }
    hr { border: none; text-align: center; margin: 2rem 0; }
    hr::before { content: '* * *'; letter-spacing: 1em; color: #999; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
    th, td { padding: 0.5rem; border: 1px solid #ccc; }
    th { background: #ede9d8; font-weight: 600; }
  `,
  "minimal-japanese": `
    body { font-family: 'Inter', -apple-system, sans-serif; color: #2c2c2c; line-height: 2; font-size: 0.95rem; }
    h1 { font-size: 1.75rem; font-weight: 300; margin: 3rem 0 1.5rem; letter-spacing: 0.05em; border-bottom: 1px solid #e0d5c7; padding-bottom: 0.75rem; }
    h2 { font-size: 1.3rem; font-weight: 400; margin: 2.5rem 0 1rem; letter-spacing: 0.03em; color: #c0392b; }
    h3 { font-size: 1.1rem; font-weight: 500; margin: 2rem 0 0.75rem; }
    blockquote { border-left: 2px solid #c0392b; padding: 0.5rem 1.5rem; margin: 1.5rem 0; color: #555; font-style: normal; }
    code { font-size: 0.85em; background: #f5f0e8; padding: 0.15rem 0.4rem; border-radius: 2px; }
    pre { background: #2c2c2c; color: #f0ebe3; padding: 1.5rem; border-radius: 2px; font-size: 0.8rem; }
    pre code { background: none; color: inherit; }
    p { margin-bottom: 1.5rem; }
    table { width: 100%; border-collapse: collapse; margin: 2rem 0; }
    th { font-weight: 500; padding: 0.75rem; border-bottom: 2px solid #2c2c2c; text-align: left; }
    td { padding: 0.75rem; border-bottom: 1px solid #e0d5c7; }
    a { color: #c0392b; text-decoration: none; border-bottom: 1px solid currentColor; }
    hr { border: none; border-top: 1px solid #e0d5c7; margin: 3rem 0; }
    ul, ol { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
  `,
  "brutalist": `
    body { font-family: 'Courier New', 'Courier', monospace; color: #000; line-height: 1.5; font-size: 0.95rem; }
    h1 { font-size: 3rem; font-weight: 900; margin: 2rem 0 1rem; text-transform: uppercase; letter-spacing: -0.02em; border-bottom: 4px solid #000; }
    h2 { font-size: 1.75rem; font-weight: 900; margin: 2rem 0 0.75rem; text-transform: uppercase; background: #000; color: #fff; padding: 0.3rem 0.6rem; display: inline-block; }
    h3 { font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 0.5rem; text-transform: uppercase; border-left: 4px solid #ff0000; padding-left: 0.75rem; }
    blockquote { border: 3px solid #000; padding: 1rem; margin: 1.5rem 0; background: #ff0; font-weight: 700; }
    code { background: #000; color: #0f0; padding: 0.2rem 0.4rem; font-size: 0.9em; }
    pre { background: #000; color: #0f0; padding: 1.5rem; border: 3px solid #000; font-size: 0.85rem; }
    pre code { background: none; color: inherit; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; border: 3px solid #000; }
    th { background: #000; color: #fff; padding: 0.5rem 0.75rem; text-align: left; text-transform: uppercase; font-weight: 900; }
    td { padding: 0.5rem 0.75rem; border: 1px solid #000; }
    a { color: #ff0000; font-weight: 700; text-decoration: underline; }
    hr { border: none; border-top: 4px solid #000; margin: 2rem 0; }
    strong { background: #ff0; padding: 0 0.2rem; }
  `,
  "notion-style": `
    body { font-family: -apple-system, 'Segoe UI', sans-serif; color: #37352f; line-height: 1.7; font-size: 1rem; }
    h1 { font-size: 2.5rem; font-weight: 700; margin: 2rem 0 0.25rem; line-height: 1.2; }
    h2 { font-size: 1.875rem; font-weight: 600; margin: 1.75rem 0 0.25rem; }
    h3 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.25rem; }
    blockquote { border-left: 3px solid #000; padding: 0.1rem 1rem; margin: 0.5rem 0; }
    code { background: rgba(135,131,120,0.15); padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.875em; color: #eb5757; font-family: 'SFMono-Regular', 'Consolas', monospace; }
    pre { background: #f7f6f3; padding: 1.25rem; border-radius: 4px; font-size: 0.85rem; overflow-x: auto; }
    pre code { background: none; color: #37352f; }
    table { width: 100%; border-collapse: collapse; margin: 0.5rem 0; }
    th { font-weight: 600; padding: 0.5rem 0.6rem; border: 1px solid #e9e9e7; background: #f7f6f3; text-align: left; }
    td { padding: 0.5rem 0.6rem; border: 1px solid #e9e9e7; }
    a { color: #37352f; text-decoration: underline; text-underline-offset: 3px; }
    hr { border: none; border-top: 1px solid #e9e9e7; margin: 0.75rem 0; }
    ul, ol { padding-left: 1.75rem; }
    li { margin-bottom: 0.15rem; }
    p { margin-bottom: 0.5rem; }
  `,
  "github-readme": `
    body { font-family: -apple-system, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; color: #1f2328; line-height: 1.5; font-size: 16px; max-width: 1012px; }
    h1 { font-size: 2em; font-weight: 600; margin: 24px 0 16px; padding-bottom: 0.3em; border-bottom: 1px solid #d1d9e0; }
    h2 { font-size: 1.5em; font-weight: 600; margin: 24px 0 16px; padding-bottom: 0.3em; border-bottom: 1px solid #d1d9e0; }
    h3 { font-size: 1.25em; font-weight: 600; margin: 24px 0 16px; }
    blockquote { border-left: 3px solid #d1d9e0; padding: 0 1rem; margin: 0 0 16px; color: #656d76; }
    code { background: rgba(175,184,193,0.2); padding: 0.2em 0.4em; border-radius: 6px; font-size: 85%; font-family: ui-monospace, 'SFMono-Regular', monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; font-size: 85%; overflow-x: auto; border: 1px solid #d1d9e0; }
    pre code { background: none; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 0 0 16px; }
    th { font-weight: 600; padding: 6px 13px; border: 1px solid #d1d9e0; background: #f6f8fa; }
    td { padding: 6px 13px; border: 1px solid #d1d9e0; }
    a { color: #1f6feb; text-decoration: none; }
    hr { border: none; height: 4px; background: #d1d9e0; margin: 24px 0; border-radius: 2px; }
    ul, ol { padding-left: 2em; margin-bottom: 16px; }
    li + li { margin-top: 0.25em; }
    p { margin-bottom: 16px; }
    img { max-width: 100%; }
  `,
  "academic-journal": `
    body { font-family: 'Times New Roman', Georgia, serif; color: #000; line-height: 1.5; font-size: 10pt; }
    h1 { font-size: 14pt; font-weight: bold; margin: 24pt 0 6pt; text-align: center; }
    h2 { font-size: 12pt; font-weight: bold; margin: 12pt 0 6pt; }
    h3 { font-size: 11pt; font-weight: bold; font-style: italic; margin: 10pt 0 4pt; }
    p { text-align: justify; margin-bottom: 6pt; text-indent: 1.5em; }
    p:first-of-type, h1 + p, h2 + p, h3 + p { text-indent: 0; }
    blockquote { margin: 10pt 30pt; font-size: 9pt; }
    code { font-family: 'Courier New', monospace; font-size: 9pt; }
    pre { font-family: 'Courier New', monospace; font-size: 9pt; padding: 8pt; background: #f5f5f5; border: 0.5pt solid #ccc; }
    pre code { background: none; }
    table { width: 100%; border-collapse: collapse; margin: 10pt 0; font-size: 9pt; }
    th { border-top: 1.5pt solid #000; border-bottom: 0.5pt solid #000; padding: 4pt 6pt; text-align: left; font-weight: bold; }
    td { padding: 3pt 6pt; border-bottom: 0.5pt solid #ccc; }
    tr:last-child td { border-bottom: 1.5pt solid #000; }
    a { color: #000; text-decoration: none; }
    hr { border: none; border-top: 0.5pt solid #000; margin: 12pt 0; }
    ul, ol { padding-left: 2em; margin: 6pt 0; }
    li { margin-bottom: 2pt; }
  `,
};

/**
 * Export a theme as JSON for sharing
 */
export function exportTheme(theme: CustomTheme): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Import a theme from JSON
 */
export function importTheme(json: string): CustomTheme | null {
  try {
    const theme = JSON.parse(json) as CustomTheme;
    if (theme.id && theme.name && theme.css) {
      theme.isBuiltIn = false;
      return theme;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Load custom themes from localStorage
 */
export function loadCustomThemes(): CustomTheme[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("markflow-custom-themes");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save custom themes to localStorage
 */
export function saveCustomThemes(themes: CustomTheme[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("markflow-custom-themes", JSON.stringify(themes));
}
