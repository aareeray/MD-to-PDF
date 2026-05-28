/**
 * Flow State UX System
 * Design for uninterrupted focus:
 * - Auto-fade UI chrome after inactivity
 * - Focus paragraph highlighting
 * - Intelligent toolbar hiding
 * - Smooth caret tracking
 * - Distraction-free writing mode
 */

export interface FlowStateSettings {
  enabled: boolean;
  autoFadeToolbar: boolean;
  autoFadeDelay: number; // seconds before UI fades
  focusParagraph: boolean; // highlight current paragraph
  dimInactiveContent: boolean; // dim non-focused content
  smoothScrolling: boolean;
  typewriterMode: boolean; // keep cursor vertically centered
  focusIntensity: number; // 0-1, how much to dim non-focused
}

export const defaultFlowStateSettings: FlowStateSettings = {
  enabled: false,
  autoFadeToolbar: true,
  autoFadeDelay: 5,
  focusParagraph: true,
  dimInactiveContent: true,
  smoothScrolling: true,
  typewriterMode: false,
  focusIntensity: 0.4,
};

/**
 * Generate CSS for flow state mode
 */
export function generateFlowStateCSS(settings: FlowStateSettings): string {
  if (!settings.enabled) return "";

  let css = "";

  // Auto-fade toolbar
  if (settings.autoFadeToolbar) {
    css += `
      .flow-state-active .toolbar-autofade {
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      .flow-state-active .toolbar-autofade.faded {
        opacity: 0.1;
        transform: translateY(-4px);
      }
      .flow-state-active .toolbar-autofade.faded:hover {
        opacity: 1;
        transform: translateY(0);
      }
    `;
  }

  // Focus paragraph highlighting
  if (settings.focusParagraph) {
    css += `
      .flow-state-active .cm-editor .cm-line {
        transition: opacity 0.3s ease;
      }
      .flow-state-active.paragraph-focus .cm-editor .cm-line {
        opacity: ${settings.focusIntensity};
      }
      .flow-state-active.paragraph-focus .cm-editor .cm-activeLine {
        opacity: 1;
      }
      /* Also dim lines near active for gradient effect */
      .flow-state-active.paragraph-focus .cm-editor .cm-activeLine + .cm-line {
        opacity: ${Math.min(settings.focusIntensity + 0.3, 0.9)};
      }
    `;
  }

  // Dim inactive preview content
  if (settings.dimInactiveContent) {
    css += `
      .flow-state-active .markdown-preview > * {
        transition: opacity 0.4s ease;
        opacity: ${settings.focusIntensity + 0.2};
      }
      .flow-state-active .markdown-preview > *:hover {
        opacity: 1;
      }
    `;
  }

  // Typewriter mode (vertical centering)
  if (settings.typewriterMode) {
    css += `
      .flow-state-active .cm-editor .cm-scroller {
        padding-top: 40vh;
        padding-bottom: 40vh;
      }
      .flow-state-active .cm-editor .cm-activeLine {
        position: relative;
      }
    `;
  }

  // Smooth scroll override
  if (settings.smoothScrolling) {
    css += `
      .flow-state-active * {
        scroll-behavior: smooth;
      }
    `;
  }

  // General flow state aesthetics
  css += `
    .flow-state-active {
      transition: all 0.5s ease;
    }
    .flow-state-active .panel-border {
      border-color: transparent;
      transition: border-color 0.5s ease;
    }
    .flow-state-active .panel-border:hover {
      border-color: var(--border);
    }
  `;

  return css;
}

/**
 * Load/save flow state settings
 */
export function loadFlowStateSettings(): FlowStateSettings {
  if (typeof window === "undefined") return defaultFlowStateSettings;
  try {
    const stored = localStorage.getItem("markflow-flow-state");
    return stored ? JSON.parse(stored) : defaultFlowStateSettings;
  } catch {
    return defaultFlowStateSettings;
  }
}

export function saveFlowStateSettings(settings: FlowStateSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("markflow-flow-state", JSON.stringify(settings));
}
