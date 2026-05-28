/**
 * Print Simulation Mode
 * Preview documents as real physical paper with:
 * - Realistic page shadows
 * - Page curvature effect
 * - Paper texture overlay
 * - Binding/spine visualization
 * - Ambient lighting simulation
 * - Page stack depth
 */

export type BindingStyle = "none" | "stapled" | "perfect" | "spiral" | "saddle-stitch";
export type PaperType = "white" | "cream" | "recycled" | "glossy" | "matte-heavy";

export interface PrintSimulationSettings {
  enabled: boolean;
  showShadows: boolean;
  showCurvature: boolean;
  showTexture: boolean;
  showBinding: boolean;
  showPageStack: boolean;
  showLighting: boolean;
  bindingStyle: BindingStyle;
  paperType: PaperType;
  lightAngle: number; // 0-360 degrees
  elevation: number; // 0-1, how "lifted" the paper appears
}

export const defaultPrintSimSettings: PrintSimulationSettings = {
  enabled: false,
  showShadows: true,
  showCurvature: true,
  showTexture: true,
  showBinding: true,
  showPageStack: true,
  showLighting: true,
  bindingStyle: "perfect",
  paperType: "white",
  lightAngle: 315,
  elevation: 0.6,
};

const paperColors: Record<PaperType, { bg: string; tint: string }> = {
  white: { bg: "#ffffff", tint: "rgba(0,0,0,0)" },
  cream: { bg: "#fdf8f0", tint: "rgba(139,119,80,0.03)" },
  recycled: { bg: "#f5f0e8", tint: "rgba(100,80,50,0.04)" },
  glossy: { bg: "#ffffff", tint: "rgba(255,255,255,0.05)" },
  "matte-heavy": { bg: "#fafafa", tint: "rgba(0,0,0,0.02)" },
};

/**
 * Generate CSS for print simulation mode
 */
export function generatePrintSimCSS(settings: PrintSimulationSettings): string {
  if (!settings.enabled) return "";

  const paper = paperColors[settings.paperType];
  const lightX = Math.cos(settings.lightAngle * Math.PI / 180);
  const lightY = Math.sin(settings.lightAngle * Math.PI / 180);
  const shadowX = -lightX * 15 * settings.elevation;
  const shadowY = -lightY * 15 * settings.elevation;
  const shadowBlur = 30 + settings.elevation * 40;

  let css = `
    /* Print simulation container */
    .print-sim-container {
      background: #e8e8e8;
      padding: 3rem;
      min-height: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
    }

    .dark .print-sim-container {
      background: #1a1a2e;
    }

    .print-sim-page {
      position: relative;
      background: ${paper.bg};
      width: 210mm;
      min-height: 297mm;
      max-width: 100%;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
  `;

  // Realistic shadows
  if (settings.showShadows) {
    css += `
      .print-sim-page {
        box-shadow:
          ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${0.08 * settings.elevation}),
          ${shadowX * 0.5}px ${shadowY * 0.5}px ${shadowBlur * 0.4}px rgba(0,0,0,${0.12 * settings.elevation}),
          0 1px 3px rgba(0,0,0,0.05),
          0 0 0 1px rgba(0,0,0,0.03);
      }
      .print-sim-page:hover {
        transform: translateY(-2px);
        box-shadow:
          ${shadowX * 1.2}px ${shadowY * 1.2}px ${shadowBlur * 1.3}px rgba(0,0,0,${0.1 * settings.elevation}),
          ${shadowX * 0.6}px ${shadowY * 0.6}px ${shadowBlur * 0.5}px rgba(0,0,0,${0.15 * settings.elevation}),
          0 2px 6px rgba(0,0,0,0.06),
          0 0 0 1px rgba(0,0,0,0.02);
      }
    `;
  }

  // Page curvature
  if (settings.showCurvature) {
    css += `
      .print-sim-page::before {
        content: '';
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(
          90deg,
          rgba(0,0,0,0.02) 0%,
          transparent 3%,
          transparent 97%,
          rgba(0,0,0,0.015) 100%
        );
        border-radius: 1px;
        z-index: 2;
      }
      /* Subtle inner curve highlight */
      .print-sim-page::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 100%;
        pointer-events: none;
        background: linear-gradient(
          180deg,
          rgba(255,255,255,0.3) 0%,
          transparent 2%,
          transparent 98%,
          rgba(0,0,0,0.02) 100%
        );
        z-index: 2;
      }
    `;
  }

  // Paper texture
  if (settings.showTexture) {
    css += `
      .print-sim-texture {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 1;
        opacity: ${settings.paperType === "recycled" ? 0.06 : settings.paperType === "cream" ? 0.04 : 0.025};
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${settings.paperType === "glossy" ? "0.3" : "0.7"}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E");
        mix-blend-mode: multiply;
      }
    `;
  }

  // Binding visualization
  if (settings.showBinding) {
    const bindingCSS: Record<BindingStyle, string> = {
      none: "",
      stapled: `
        .print-sim-binding {
          position: absolute;
          left: -2px;
          top: 25%;
          width: 4px;
          height: 8px;
          background: linear-gradient(180deg, #c0c0c0, #888);
          border-radius: 1px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .print-sim-binding::after {
          content: '';
          position: absolute;
          left: 0;
          top: 200%;
          width: 4px;
          height: 8px;
          background: linear-gradient(180deg, #c0c0c0, #888);
          border-radius: 1px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
      `,
      perfect: `
        .print-sim-binding {
          position: absolute;
          left: -6px;
          top: 0;
          bottom: 0;
          width: 6px;
          background: linear-gradient(90deg, #2d2d2d 0%, #4a4a4a 40%, #3d3d3d 100%);
          border-radius: 2px 0 0 2px;
          box-shadow: -2px 0 4px rgba(0,0,0,0.2);
        }
      `,
      spiral: `
        .print-sim-binding {
          position: absolute;
          left: -10px;
          top: 5%;
          bottom: 5%;
          width: 10px;
          background: repeating-linear-gradient(
            180deg,
            transparent 0px,
            transparent 8px,
            #666 8px,
            #666 10px,
            #888 10px,
            #888 18px,
            #666 18px,
            #666 20px
          );
          border-radius: 5px 0 0 5px;
        }
      `,
      "saddle-stitch": `
        .print-sim-binding {
          position: absolute;
          left: 50%;
          top: -3px;
          transform: translateX(-50%);
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent 20%, #888 20%, #888 20.5%, transparent 20.5%, transparent 50%, #888 50%, #888 50.5%, transparent 50.5%, transparent 80%, #888 80%, #888 80.5%, transparent 80.5%);
        }
      `,
    };
    css += bindingCSS[settings.bindingStyle] || "";
  }

  // Page stack
  if (settings.showPageStack) {
    css += `
      .print-sim-stack {
        position: absolute;
        inset: 2px;
        background: ${paper.bg};
        border: 1px solid rgba(0,0,0,0.04);
        z-index: -1;
        transform: translate(2px, 2px);
      }
      .print-sim-stack::before {
        content: '';
        position: absolute;
        inset: 0;
        background: ${paper.bg};
        border: 1px solid rgba(0,0,0,0.03);
        transform: translate(2px, 2px);
        z-index: -1;
      }
    `;
  }

  // Lighting simulation
  if (settings.showLighting) {
    css += `
      .print-sim-lighting {
        position: absolute;
        inset: 0;
        pointer-events: none;
        z-index: 3;
        background: radial-gradient(
          ellipse at ${50 + lightX * 30}% ${50 + lightY * 30}%,
          rgba(255,255,255,${0.03 * settings.elevation}) 0%,
          transparent 60%
        );
      }
    `;
  }

  return css;
}

/**
 * Load/save print simulation settings
 */
export function loadPrintSimSettings(): PrintSimulationSettings {
  if (typeof window === "undefined") return defaultPrintSimSettings;
  try {
    const stored = localStorage.getItem("markflow-print-sim");
    return stored ? JSON.parse(stored) : defaultPrintSimSettings;
  } catch {
    return defaultPrintSimSettings;
  }
}

export function savePrintSimSettings(settings: PrintSimulationSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("markflow-print-sim", JSON.stringify(settings));
}
