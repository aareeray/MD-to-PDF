import { ExportSettings, FontSettings } from "./editorStore";

export interface PDFExportOptions {
  content: string;
  fontSettings: FontSettings;
  exportSettings: ExportSettings;
}

// Theme CSS for different export styles
const themeStyles: Record<string, string> = {
  "minimal-clean": `
    body { font-family: 'Inter', -apple-system, sans-serif; color: #1a1a2e; line-height: 1.8; }
    h1, h2, h3 { color: #111827; letter-spacing: -0.02em; }
    h1 { font-size: 2.25rem; font-weight: 800; margin: 2rem 0 1rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    h2 { font-size: 1.75rem; font-weight: 700; margin: 1.75rem 0 0.75rem; }
    h3 { font-size: 1.375rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
    blockquote { border-left: 4px solid #3b82f6; padding: 0.75rem 1.25rem; margin: 1.25rem 0; background: #f8fafc; border-radius: 0 8px 8px 0; }
    code { background: #f1f5f9; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.875em; }
    pre { background: #1e293b; color: #e2e8f0; padding: 1.25rem; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; padding: 0; color: inherit; }
    table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; }
    th { background: #f8fafc; font-weight: 600; text-align: left; padding: 0.75rem 1rem; border-bottom: 2px solid #e5e7eb; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #e5e7eb; }
    a { color: #3b82f6; text-decoration: none; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
    img { max-width: 100%; border-radius: 8px; }
  `,
  "developer-docs": `
    body { font-family: 'IBM Plex Sans', -apple-system, sans-serif; color: #24292f; line-height: 1.7; }
    h1, h2, h3 { font-weight: 700; }
    h1 { font-size: 2rem; margin: 1.5rem 0 1rem; padding-bottom: 0.3rem; border-bottom: 1px solid #d0d7de; }
    h2 { font-size: 1.5rem; margin: 1.5rem 0 0.75rem; padding-bottom: 0.3rem; border-bottom: 1px solid #d0d7de; }
    h3 { font-size: 1.25rem; margin: 1.25rem 0 0.5rem; }
    blockquote { border-left: 3px solid #0969da; padding: 0.5rem 1rem; margin: 1rem 0; background: #ddf4ff; border-radius: 0 6px 6px 0; }
    code { background: #eff1f3; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.85em; font-family: 'JetBrains Mono', monospace; }
    pre { background: #0d1117; color: #c9d1d9; padding: 1rem; border-radius: 6px; font-size: 0.85rem; overflow-x: auto; }
    pre code { background: none; padding: 0; color: inherit; }
    table { width: 100%; border-collapse: collapse; margin: 1rem 0; border: 1px solid #d0d7de; }
    th { background: #f6f8fa; font-weight: 600; padding: 0.5rem 0.75rem; border: 1px solid #d0d7de; }
    td { padding: 0.5rem 0.75rem; border: 1px solid #d0d7de; }
    a { color: #0969da; }
    hr { border: none; border-top: 1px solid #d0d7de; margin: 1.5rem 0; }
  `,
  "ebook": `
    body { font-family: 'Georgia', 'Times New Roman', serif; color: #2d3748; line-height: 1.9; font-size: 1.05rem; }
    h1, h2, h3 { font-family: 'Playfair Display', serif; color: #1a202c; }
    h1 { font-size: 2.5rem; font-weight: 700; margin: 2.5rem 0 1.25rem; text-align: center; }
    h2 { font-size: 1.875rem; font-weight: 600; margin: 2rem 0 1rem; }
    h3 { font-size: 1.375rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
    blockquote { border-left: 3px solid #805ad5; padding: 1rem 1.5rem; margin: 1.5rem 0; font-style: italic; color: #4a5568; }
    code { background: #edf2f7; padding: 0.15rem 0.35rem; border-radius: 3px; font-size: 0.85em; }
    pre { background: #2d3748; color: #e2e8f0; padding: 1.25rem; border-radius: 4px; }
    pre code { background: none; padding: 0; color: inherit; }
    p { text-indent: 0; margin-bottom: 1rem; }
    a { color: #805ad5; }
    hr { border: none; text-align: center; margin: 2rem 0; }
    hr::before { content: '***'; letter-spacing: 0.5em; color: #a0aec0; }
  `,
  "research-paper": `
    body { font-family: 'Times New Roman', 'Georgia', serif; color: #000000; line-height: 2; font-size: 12pt; }
    h1 { font-size: 16pt; font-weight: bold; margin: 24pt 0 12pt; text-align: center; }
    h2 { font-size: 14pt; font-weight: bold; margin: 18pt 0 6pt; }
    h3 { font-size: 12pt; font-weight: bold; margin: 12pt 0 6pt; }
    blockquote { margin: 12pt 40pt; font-style: italic; }
    code { font-family: 'Courier New', monospace; font-size: 10pt; }
    pre { font-family: 'Courier New', monospace; font-size: 10pt; padding: 12pt; background: #f5f5f5; border: 1px solid #ddd; }
    pre code { background: none; padding: 0; }
    table { width: 100%; border-collapse: collapse; margin: 12pt 0; }
    th, td { border: 1px solid #000; padding: 6pt 8pt; text-align: left; }
    th { font-weight: bold; background: #f5f5f5; }
    a { color: #000; text-decoration: underline; }
    p { text-align: justify; margin-bottom: 12pt; }
  `,
  "resume": `
    body { font-family: 'Inter', -apple-system, sans-serif; color: #1f2937; line-height: 1.5; font-size: 0.9rem; }
    h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.25rem; color: #111827; letter-spacing: -0.02em; }
    h2 { font-size: 1rem; font-weight: 700; margin: 1.25rem 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em; color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 0.25rem; }
    h3 { font-size: 0.95rem; font-weight: 600; margin: 0.75rem 0 0.25rem; }
    p { margin-bottom: 0.5rem; }
    ul { padding-left: 1.25rem; margin: 0.25rem 0; }
    li { margin-bottom: 0.25rem; }
    code { font-size: 0.8em; }
    a { color: #3b82f6; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 1rem 0; }
  `,
  "luxury-editorial": `
    body { font-family: 'Playfair Display', Georgia, serif; color: #1a1a1a; line-height: 1.9; }
    h1, h2, h3 { font-weight: 700; letter-spacing: -0.02em; }
    h1 { font-size: 2.75rem; margin: 2rem 0 1rem; }
    h2 { font-size: 2rem; margin: 1.75rem 0 0.75rem; }
    h3 { font-size: 1.5rem; margin: 1.5rem 0 0.5rem; }
    p { font-family: 'Inter', sans-serif; }
    blockquote { border-left: 4px solid #b8860b; padding: 1rem 1.5rem; margin: 1.5rem 0; background: #fffef5; font-style: italic; }
    code { font-family: 'Fira Code', monospace; background: #f7f7f7; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.85em; }
    pre { background: #1a1a2e; color: #e8e8e8; padding: 1.5rem; border-radius: 4px; }
    pre code { background: none; padding: 0; color: inherit; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th { background: #f9f9f9; font-weight: 600; padding: 0.75rem 1rem; border-bottom: 2px solid #e0e0e0; text-align: left; }
    td { padding: 0.75rem 1rem; border-bottom: 1px solid #eee; }
    a { color: #b8860b; }
    hr { border: none; border-top: 1px solid #ddd; margin: 2.5rem 0; }
  `,
  "dark-cyberpunk": `
    body { font-family: 'JetBrains Mono', 'Fira Code', monospace; color: #e0e0e0; line-height: 1.7; background: #0a0a1a; }
    h1, h2, h3 { color: #00ff88; text-shadow: 0 0 10px rgba(0,255,136,0.3); }
    h1 { font-size: 2.25rem; font-weight: 700; margin: 2rem 0 1rem; border-bottom: 2px solid #00ff88; padding-bottom: 0.5rem; }
    h2 { font-size: 1.75rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
    h3 { font-size: 1.375rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
    blockquote { border-left: 4px solid #ff00ff; padding: 0.75rem 1.25rem; margin: 1.25rem 0; background: rgba(255,0,255,0.05); border-radius: 0 4px 4px 0; color: #c0c0c0; }
    code { background: rgba(0,255,136,0.1); color: #00ff88; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
    pre { background: #0d0d2b; border: 1px solid #1a1a4e; color: #e0e0e0; padding: 1.25rem; border-radius: 4px; }
    pre code { background: none; padding: 0; color: inherit; }
    table { width: 100%; border-collapse: collapse; margin: 1.25rem 0; border: 1px solid #1a1a4e; }
    th { background: #0d0d2b; color: #00ff88; font-weight: 600; padding: 0.75rem 1rem; border: 1px solid #1a1a4e; }
    td { padding: 0.75rem 1rem; border: 1px solid #1a1a4e; }
    a { color: #00bfff; text-shadow: 0 0 5px rgba(0,191,255,0.3); }
    hr { border: none; border-top: 1px solid #1a1a4e; margin: 2rem 0; }
  `,
};

export function getThemeCSS(themeName: string): string {
  return themeStyles[themeName] || themeStyles["minimal-clean"];
}

export function getPageDimensions(settings: ExportSettings) {
  const sizes = {
    a4: { width: 210, height: 297 },
    letter: { width: 216, height: 279 },
  };

  const size = sizes[settings.pageSize];
  if (settings.orientation === "landscape") {
    return { width: size.height, height: size.width };
  }
  return size;
}

export async function exportToPDF(options: PDFExportOptions): Promise<void> {
  const { content, fontSettings, exportSettings } = options;

  // Dynamically import html2pdf.js (browser-only)
  const html2pdf = (await import("html2pdf.js")).default;

  // Create a temporary container for rendering
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = exportSettings.orientation === "landscape" ? "279mm" : "210mm";
  document.body.appendChild(container);

  // Import and render markdown
  const { marked } = await import("marked");
  
  // Configure marked
  marked.setOptions({
    gfm: true,
    breaks: false,
  });

  const htmlContent = await marked.parse(content);
  const themeCSS = getThemeCSS(exportSettings.theme);
  const isDarkTheme = exportSettings.theme === "dark-cyberpunk";

  const fullHTML = `
    <div id="pdf-content" style="
      padding: ${exportSettings.margins.top}px ${exportSettings.margins.right}px ${exportSettings.margins.bottom}px ${exportSettings.margins.left}px;
      ${isDarkTheme ? 'background: #0a0a1a;' : 'background: white;'}
    ">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ${themeCSS}
        body, #pdf-content { 
          font-family: '${fontSettings.bodyFont}', -apple-system, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: '${fontSettings.headingFont}', -apple-system, sans-serif;
        }
        code, pre {
          font-family: '${fontSettings.codeFont}', 'Courier New', monospace;
        }
        ${exportSettings.showWatermark ? `
          #pdf-content::before {
            content: '${exportSettings.watermarkText}';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 6rem;
            color: rgba(0,0,0,0.03);
            font-weight: bold;
            pointer-events: none;
            z-index: 1000;
          }
        ` : ''}
      </style>
      ${exportSettings.showHeader ? `<div style="text-align: center; font-size: 0.75rem; color: #999; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">${exportSettings.headerText || exportSettings.title || ''}</div>` : ''}
      ${htmlContent}
      ${exportSettings.showFooter ? `<div style="text-align: center; font-size: 0.75rem; color: #999; margin-top: 2rem; padding-top: 0.5rem; border-top: 1px solid #eee;">${exportSettings.footerText || ''}</div>` : ''}
    </div>
  `;

  container.innerHTML = fullHTML;

  const dimensions = getPageDimensions(exportSettings);
  const filename = exportSettings.title
    ? `${exportSettings.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`
    : "document.pdf";

  const opt = {
    margin: 0,
    filename,
    image: { type: "jpeg" as const, quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: isDarkTheme ? "#0a0a1a" : "#ffffff",
    },
    jsPDF: {
      unit: "mm" as const,
      format: [dimensions.width, dimensions.height] as [number, number],
      orientation: exportSettings.orientation,
    },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] as const },
  };

  try {
    await html2pdf().set(opt).from(container).save();
  } finally {
    document.body.removeChild(container);
  }
}
