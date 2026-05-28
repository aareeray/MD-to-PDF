/**
 * Beautiful Page Textures
 * Subtle visual textures that add emotional depth to documents.
 * paper grain, matte, vintage ink, futuristic glass, linen, etc.
 */

export type PageTexture =
  | "none"
  | "paper-grain"
  | "matte"
  | "vintage-ink"
  | "linen"
  | "glass"
  | "parchment"
  | "watercolor";

export interface TextureConfig {
  id: PageTexture;
  name: string;
  description: string;
  opacity: number;
}

export const textureOptions: TextureConfig[] = [
  { id: "none", name: "None", description: "Clean, no texture", opacity: 0 },
  { id: "paper-grain", name: "Paper Grain", description: "Subtle paper fiber texture", opacity: 0.04 },
  { id: "matte", name: "Matte", description: "Soft matte surface finish", opacity: 0.03 },
  { id: "vintage-ink", name: "Vintage Ink", description: "Aged paper with ink bleed feel", opacity: 0.05 },
  { id: "linen", name: "Linen", description: "Woven fabric texture", opacity: 0.035 },
  { id: "glass", name: "Glass", description: "Futuristic frosted glass", opacity: 0.025 },
  { id: "parchment", name: "Parchment", description: "Old manuscript paper", opacity: 0.06 },
  { id: "watercolor", name: "Watercolor", description: "Soft watercolor paper grain", opacity: 0.04 },
];

/**
 * Generate CSS for page texture overlay
 */
export function generateTextureCSS(texture: PageTexture, opacity?: number): string {
  if (texture === "none") return "";

  const config = textureOptions.find(t => t.id === texture);
  const finalOpacity = opacity ?? config?.opacity ?? 0.04;

  const textureSVGs: Record<PageTexture, string> = {
    none: "",
    "paper-grain": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
    matte: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.5' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
    "vintage-ink": `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
    linen: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M0 30h60M30 0v60' stroke='%23000' stroke-width='0.5' opacity='0.5'/%3E%3C/svg%3E")`,
    glass: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.15' numOctaves='1' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
    parchment: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.3' numOctaves='6' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0.3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
    watercolor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.2' numOctaves='3' stitchTiles='stitch'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='150' height='150' filter='url(%23n)'/%3E%3C/svg%3E")`,
  };

  const backgroundImage = textureSVGs[texture];
  if (!backgroundImage) return "";

  return `
    .pdf-content::before, .document-body::before {
      content: '';
      position: absolute;
      inset: 0;
      opacity: ${finalOpacity};
      background-image: ${backgroundImage};
      pointer-events: none;
      z-index: 0;
      mix-blend-mode: multiply;
    }
    .pdf-content, .document-body {
      position: relative;
    }
    .pdf-content > *, .document-body > * {
      position: relative;
      z-index: 1;
    }
  `;
}
