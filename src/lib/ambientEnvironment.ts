/**
 * Ambient Environment System
 * Creates a calm, intelligent writing space with depth-based lighting,
 * ambient gradients, floating layers, breathing animations, and cinematic transitions.
 */

export type AmbientMode = "default" | "deep-focus" | "warm-studio" | "midnight" | "aurora" | "zen";

export interface AmbientConfig {
  id: AmbientMode;
  name: string;
  description: string;
  gradient: string;
  accentGlow: string;
  particleColor: string;
  breathingSpeed: number; // seconds
  depthLayers: number;
}

export const ambientModes: Record<AmbientMode, AmbientConfig> = {
  default: {
    id: "default",
    name: "Default",
    description: "Clean minimal environment",
    gradient: "transparent",
    accentGlow: "rgba(59, 130, 246, 0.05)",
    particleColor: "rgba(59, 130, 246, 0.3)",
    breathingSpeed: 8,
    depthLayers: 0,
  },
  "deep-focus": {
    id: "deep-focus",
    name: "Deep Focus",
    description: "Dark immersive concentration space",
    gradient: "radial-gradient(ellipse at 50% 0%, rgba(15, 23, 42, 0.8) 0%, rgba(2, 6, 23, 0.95) 70%)",
    accentGlow: "rgba(99, 102, 241, 0.08)",
    particleColor: "rgba(99, 102, 241, 0.4)",
    breathingSpeed: 10,
    depthLayers: 2,
  },
  "warm-studio": {
    id: "warm-studio",
    name: "Warm Studio",
    description: "Cozy publishing studio atmosphere",
    gradient: "radial-gradient(ellipse at 30% 20%, rgba(251, 191, 36, 0.04) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(239, 68, 68, 0.03) 0%, transparent 50%)",
    accentGlow: "rgba(251, 191, 36, 0.06)",
    particleColor: "rgba(251, 191, 36, 0.3)",
    breathingSpeed: 12,
    depthLayers: 1,
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Serene night writing session",
    gradient: "radial-gradient(ellipse at 50% 50%, rgba(30, 58, 138, 0.1) 0%, transparent 60%)",
    accentGlow: "rgba(96, 165, 250, 0.06)",
    particleColor: "rgba(147, 197, 253, 0.3)",
    breathingSpeed: 14,
    depthLayers: 3,
  },
  aurora: {
    id: "aurora",
    name: "Aurora",
    description: "Ethereal northern lights glow",
    gradient: "radial-gradient(ellipse at 20% 30%, rgba(52, 211, 153, 0.05) 0%, transparent 40%), radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 40%)",
    accentGlow: "rgba(52, 211, 153, 0.06)",
    particleColor: "rgba(52, 211, 153, 0.3)",
    breathingSpeed: 16,
    depthLayers: 2,
  },
  zen: {
    id: "zen",
    name: "Zen",
    description: "Minimal calm presence",
    gradient: "radial-gradient(ellipse at 50% 50%, rgba(148, 163, 184, 0.03) 0%, transparent 70%)",
    accentGlow: "rgba(148, 163, 184, 0.04)",
    particleColor: "rgba(148, 163, 184, 0.2)",
    breathingSpeed: 20,
    depthLayers: 0,
  },
};

/**
 * Generate ambient environment CSS
 */
export function generateAmbientCSS(mode: AmbientMode): string {
  const config = ambientModes[mode];
  if (mode === "default") return "";

  return `
    /* Ambient background layer */
    .ambient-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      background: ${config.gradient};
      animation: ambientBreathe ${config.breathingSpeed}s ease-in-out infinite;
    }

    /* Accent glow orbs */
    .ambient-layer::before {
      content: '';
      position: absolute;
      top: 20%;
      left: 15%;
      width: 40vw;
      height: 40vw;
      border-radius: 50%;
      background: ${config.accentGlow};
      filter: blur(80px);
      animation: ambientFloat ${config.breathingSpeed * 1.5}s ease-in-out infinite;
    }

    .ambient-layer::after {
      content: '';
      position: absolute;
      bottom: 20%;
      right: 15%;
      width: 35vw;
      height: 35vw;
      border-radius: 50%;
      background: ${config.accentGlow};
      filter: blur(100px);
      animation: ambientFloat ${config.breathingSpeed * 1.3}s ease-in-out infinite reverse;
    }

    @keyframes ambientBreathe {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }

    @keyframes ambientFloat {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(2%, -3%) scale(1.05); }
      66% { transform: translate(-2%, 2%) scale(0.95); }
    }

    /* Depth layers - floating document shadows */
    ${config.depthLayers >= 1 ? `
      .editor-depth-shadow {
        box-shadow: 
          0 0 0 1px rgba(255,255,255,0.02),
          0 20px 60px -10px rgba(0,0,0,0.3),
          0 40px 100px -20px rgba(0,0,0,0.2);
      }
    ` : ''}

    ${config.depthLayers >= 2 ? `
      .preview-depth-shadow {
        box-shadow:
          0 0 0 1px rgba(255,255,255,0.02),
          0 10px 40px -5px rgba(0,0,0,0.2),
          0 30px 80px -15px rgba(0,0,0,0.15);
      }
    ` : ''}

    /* Cinematic panel transitions */
    .panel-cinematic-enter {
      animation: cinematicSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes cinematicSlideIn {
      from {
        opacity: 0;
        transform: translateX(20px) scale(0.98);
        filter: blur(4px);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
        filter: blur(0);
      }
    }

    /* Breathing border for focused elements */
    .breathing-focus {
      animation: breathingBorder ${config.breathingSpeed * 0.5}s ease-in-out infinite;
    }

    @keyframes breathingBorder {
      0%, 100% { border-color: rgba(99, 102, 241, 0.1); }
      50% { border-color: rgba(99, 102, 241, 0.25); }
    }
  `;
}
