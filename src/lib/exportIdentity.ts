/**
 * Export Identity System
 * Creates an unmistakable visual signature for every exported document.
 * People should recognize MarkFlow PDFs by FEEL, not by logo.
 *
 * Signature elements:
 * - Distinctive typography rhythm (golden ratio spacing)
 * - Signature edge glow (subtle gradient border)
 * - Iconic code block styling (unique rounded + glow)
 * - Elegant page transitions (chapter opening whitespace)
 * - Personal creator mark (footer signature)
 * - Unique heading accent lines
 */

export interface ExportIdentitySettings {
  enabled: boolean;
  signatureSpacing: boolean;      // Golden ratio paragraph rhythm
  edgeGlow: boolean;              // Subtle gradient edge on pages
  iconicCodeBlocks: boolean;      // MarkFlow-signature code styling
  accentHeadings: boolean;        // Thin accent line under headings
  creatorMark: boolean;           // Personal footer signature
  creatorName: string;
  creatorTagline: string;
  signatureSeal: "none" | "minimal" | "monogram" | "stamp";
  sealInitials: string;
}

export const defaultExportIdentity: ExportIdentitySettings = {
  enabled: true,
  signatureSpacing: true,
  edgeGlow: true,
  iconicCodeBlocks: true,
  accentHeadings: true,
  creatorMark: false,
  creatorName: "",
  creatorTagline: "",
  signatureSeal: "none",
  sealInitials: "",
};

/**
 * Generate the MarkFlow signature CSS
 */
export function generateExportIdentityCSS(settings: ExportIdentitySettings): string {
  if (!settings.enabled) return "";
  let css = "";

  // Signature spacing: Golden Ratio rhythm (1.618)
  if (settings.signatureSpacing) {
    css += `
      .markflow-signature p { margin-bottom: 1.05rem; }
      .markflow-signature h1 { margin-top: 2.618rem; margin-bottom: 0.618rem; }
      .markflow-signature h2 { margin-top: 1.618rem; margin-bottom: 0.382rem; }
      .markflow-signature h3 { margin-top: 1.272rem; margin-bottom: 0.309rem; }
      .markflow-signature li { margin-bottom: 0.309rem; }
      .markflow-signature blockquote { margin: 1.618rem 0; }
      .markflow-signature pre { margin: 1.272rem 0; }
    `;
  }

  // Edge glow: subtle gradient border
  if (settings.edgeGlow) {
    css += `
      .markflow-signature {
        position: relative;
      }
      .markflow-signature::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        width: 3px;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(99, 102, 241, 0.15) 20%,
          rgba(139, 92, 246, 0.25) 50%,
          rgba(99, 102, 241, 0.15) 80%,
          transparent 100%
        );
        border-radius: 2px;
      }
    `;
  }

  // Iconic code blocks
  if (settings.iconicCodeBlocks) {
    css += `
      .markflow-signature pre {
        border-radius: 12px;
        border: 1px solid rgba(99, 102, 241, 0.1);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(99, 102, 241, 0.05);
        padding: 1.5rem;
        position: relative;
        overflow: hidden;
      }
      .markflow-signature pre::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 80px;
        height: 80px;
        background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.04), transparent 70%);
        pointer-events: none;
      }
    `;
  }

  // Accent headings: thin line accent
  if (settings.accentHeadings) {
    css += `
      .markflow-signature h2 {
        position: relative;
        padding-bottom: 0.5rem;
      }
      .markflow-signature h2::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 40px;
        height: 2px;
        background: linear-gradient(90deg, rgba(99, 102, 241, 0.6), rgba(139, 92, 246, 0.3));
        border-radius: 1px;
      }
    `;
  }

  return css;
}

/**
 * Generate creator mark HTML for PDF footer
 */
export function generateCreatorMark(settings: ExportIdentitySettings): string {
  if (!settings.creatorMark || !settings.creatorName) return "";

  const sealHTML = generateSeal(settings);

  return `
    <div class="markflow-creator-mark" style="
      margin-top: 4rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.75rem;
      color: #94a3b8;
    ">
      <div>
        <div style="font-weight: 500; color: #64748b;">${settings.creatorName}</div>
        ${settings.creatorTagline ? `<div style="margin-top: 2px; font-style: italic;">${settings.creatorTagline}</div>` : ""}
      </div>
      ${sealHTML}
    </div>
  `;
}

function generateSeal(settings: ExportIdentitySettings): string {
  if (settings.signatureSeal === "none") return "";
  const initials = settings.sealInitials || settings.creatorName.slice(0, 2).toUpperCase();

  switch (settings.signatureSeal) {
    case "minimal":
      return `<div style="width: 24px; height: 24px; border-radius: 50%; border: 1.5px solid #94a3b8; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: 600; color: #64748b;">${initials}</div>`;
    case "monogram":
      return `<div style="width: 32px; height: 32px; border-radius: 4px; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: white; letter-spacing: 0.05em;">${initials}</div>`;
    case "stamp":
      return `<div style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #6366f1; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #6366f1; transform: rotate(-5deg); letter-spacing: 0.05em;">${initials}</div>`;
    default:
      return "";
  }
}
