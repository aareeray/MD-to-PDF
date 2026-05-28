/**
 * Document Cover Generator
 * Generates beautiful first pages/title pages automatically.
 */

export type CoverStyle =
  | "editorial"
  | "technical"
  | "ebook"
  | "research"
  | "minimal"
  | "gradient"
  | "dark"
  | "none";

export interface CoverSettings {
  style: CoverStyle;
  title: string;
  subtitle: string;
  author: string;
  date: string;
  organization: string;
  showLogo: boolean;
}

export const defaultCoverSettings: CoverSettings = {
  style: "none",
  title: "",
  subtitle: "",
  author: "",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  organization: "",
  showLogo: false,
};

const coverStyles: Record<CoverStyle, (settings: CoverSettings) => string> = {
  none: () => "",

  editorial: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 4rem 3rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      page-break-after: always;
      break-after: page;
    ">
      <div style="max-width: 500px;">
        ${s.organization ? `<p style="font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; opacity: 0.8; margin-bottom: 2rem;">${s.organization}</p>` : ""}
        <h1 style="font-size: 3rem; font-weight: 800; line-height: 1.1; margin: 0 0 1rem; letter-spacing: -0.02em; text-shadow: 0 2px 20px rgba(0,0,0,0.2);">${s.title || "Untitled Document"}</h1>
        ${s.subtitle ? `<p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 2rem; font-weight: 300;">${s.subtitle}</p>` : ""}
        <div style="width: 60px; height: 3px; background: rgba(255,255,255,0.5); margin: 2rem auto;"></div>
        ${s.author ? `<p style="font-size: 1rem; opacity: 0.8; margin-top: 1.5rem;">${s.author}</p>` : ""}
        ${s.date ? `<p style="font-size: 0.85rem; opacity: 0.6; margin-top: 0.5rem;">${s.date}</p>` : ""}
      </div>
    </div>
  `,

  technical: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 4rem 3.5rem;
      background: #ffffff;
      border-top: 8px solid #3b82f6;
      page-break-after: always;
      break-after: page;
    ">
      <div>
        ${s.organization ? `<p style="font-size: 0.8rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 3rem;">${s.organization}</p>` : ""}
      </div>
      <div>
        <h1 style="font-size: 2.5rem; font-weight: 700; color: #111827; line-height: 1.2; margin: 0 0 1rem; letter-spacing: -0.02em;">${s.title || "Technical Document"}</h1>
        ${s.subtitle ? `<p style="font-size: 1.1rem; color: #6b7280; margin-bottom: 1rem;">${s.subtitle}</p>` : ""}
        <div style="width: 80px; height: 4px; background: #3b82f6; margin: 2rem 0;"></div>
      </div>
      <div style="border-top: 1px solid #e5e7eb; padding-top: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end;">
          <div>
            ${s.author ? `<p style="font-size: 0.9rem; color: #374151; font-weight: 500;">${s.author}</p>` : ""}
            ${s.date ? `<p style="font-size: 0.8rem; color: #9ca3af;">${s.date}</p>` : ""}
          </div>
          <p style="font-size: 0.7rem; color: #d1d5db;">v1.0</p>
        </div>
      </div>
    </div>
  `,

  ebook: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 5rem 3rem;
      background: #1a1a2e;
      color: #ffffff;
      page-break-after: always;
      break-after: page;
    ">
      <div style="max-width: 400px;">
        <div style="width: 80px; height: 2px; background: linear-gradient(90deg, #a78bfa, #6366f1); margin: 0 auto 3rem;"></div>
        <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 2.75rem; font-weight: 700; line-height: 1.2; margin: 0 0 1.5rem;">${s.title || "Untitled"}</h1>
        ${s.subtitle ? `<p style="font-size: 1.1rem; color: #a78bfa; margin-bottom: 2rem; font-style: italic;">${s.subtitle}</p>` : ""}
        <div style="width: 40px; height: 1px; background: rgba(255,255,255,0.3); margin: 2.5rem auto;"></div>
        ${s.author ? `<p style="font-size: 1rem; color: #e2e8f0; letter-spacing: 0.1em; margin-top: 1rem;">${s.author}</p>` : ""}
        ${s.organization ? `<p style="font-size: 0.8rem; color: #94a3b8; margin-top: 0.5rem;">${s.organization}</p>` : ""}
      </div>
    </div>
  `,

  research: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 5rem 4rem;
      background: #ffffff;
      text-align: center;
      page-break-after: always;
      break-after: page;
    ">
      ${s.organization ? `<p style="font-size: 0.9rem; color: #666; margin-bottom: 3rem; text-transform: uppercase; letter-spacing: 0.1em;">${s.organization}</p>` : ""}
      <h1 style="font-family: 'Times New Roman', serif; font-size: 1.75rem; font-weight: bold; line-height: 1.4; margin: 0 0 2rem; max-width: 80%; margin-left: auto; margin-right: auto;">${s.title || "Research Paper"}</h1>
      ${s.subtitle ? `<p style="font-size: 1rem; color: #444; margin-bottom: 2rem; font-style: italic;">${s.subtitle}</p>` : ""}
      <div style="margin: 2.5rem 0;">
        ${s.author ? `<p style="font-size: 1rem; margin-bottom: 0.25rem;">${s.author}</p>` : ""}
        ${s.date ? `<p style="font-size: 0.9rem; color: #666;">${s.date}</p>` : ""}
      </div>
      <div style="border-top: 1px solid #ccc; max-width: 200px; margin: 2rem auto 0;"></div>
    </div>
  `,

  minimal: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 5rem 4rem;
      background: #fefefe;
      page-break-after: always;
      break-after: page;
    ">
      <h1 style="font-size: 2.5rem; font-weight: 300; color: #1a1a1a; line-height: 1.3; margin: 0 0 1rem; letter-spacing: -0.01em;">${s.title || "Document"}</h1>
      ${s.subtitle ? `<p style="font-size: 1rem; color: #888; margin-bottom: 2rem;">${s.subtitle}</p>` : ""}
      <div style="display: flex; gap: 2rem; color: #aaa; font-size: 0.8rem; margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;">
        ${s.author ? `<span>${s.author}</span>` : ""}
        ${s.date ? `<span>${s.date}</span>` : ""}
      </div>
    </div>
  `,

  gradient: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 4rem;
      background: linear-gradient(160deg, #0093E9 0%, #80D0C7 50%, #FBAB7E 100%);
      color: white;
      page-break-after: always;
      break-after: page;
    ">
      <div style="background: rgba(0,0,0,0.15); backdrop-filter: blur(10px); border-radius: 24px; padding: 3rem 4rem; max-width: 500px;">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin: 0 0 1rem; line-height: 1.15;">${s.title || "Document"}</h1>
        ${s.subtitle ? `<p style="font-size: 1.1rem; opacity: 0.9; margin-bottom: 1.5rem;">${s.subtitle}</p>` : ""}
        ${s.author ? `<p style="font-size: 0.9rem; opacity: 0.7; margin-top: 1.5rem;">by ${s.author}</p>` : ""}
        ${s.date ? `<p style="font-size: 0.8rem; opacity: 0.5;">${s.date}</p>` : ""}
      </div>
    </div>
  `,

  dark: (s) => `
    <div style="
      height: 100%;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      padding: 4rem;
      background: #0a0a1a;
      color: #ffffff;
      page-break-after: always;
      break-after: page;
    ">
      <div style="max-width: 450px;">
        <div style="width: 60px; height: 3px; background: linear-gradient(90deg, #00ff88, #00bfff); margin: 0 auto 2rem;"></div>
        <h1 style="font-size: 2.5rem; font-weight: 700; margin: 0 0 1rem; background: linear-gradient(135deg, #00ff88, #00bfff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${s.title || "Document"}</h1>
        ${s.subtitle ? `<p style="font-size: 1rem; color: #94a3b8; margin-bottom: 2rem;">${s.subtitle}</p>` : ""}
        <div style="width: 40px; height: 1px; background: rgba(255,255,255,0.2); margin: 2rem auto;"></div>
        ${s.author ? `<p style="color: #64748b; font-size: 0.9rem;">${s.author}</p>` : ""}
        ${s.date ? `<p style="color: #475569; font-size: 0.8rem; margin-top: 0.5rem;">${s.date}</p>` : ""}
      </div>
    </div>
  `,
};

/**
 * Generate cover page HTML
 */
export function generateCoverHTML(settings: CoverSettings): string {
  const generator = coverStyles[settings.style];
  if (!generator) return "";
  return generator(settings);
}
