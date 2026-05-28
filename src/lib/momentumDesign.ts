/**
 * Momentum Design System
 * Removes emotional friction. Every action flows without cognitive interruption.
 * No harsh transitions. No heavy modals. No mechanical friction. Only continuity.
 *
 * Also implements:
 * - Musical rhythm (tempo, silence, crescendo, restraint, release)
 * - Document Presence (sections feel weighted, quotes breathe, titles command space)
 * - Interface Disappearance (highest form: only thought, flow, creation remain)
 * - Time-as-Design (UI adapts to time of day and session duration)
 * - Creative Memory (remembers emotional patterns)
 */

export interface MomentumSettings {
  enabled: boolean;
  fluidTransitions: boolean;
  musicalRhythm: boolean;
  documentPresence: boolean;
  interfaceAbsence: boolean;
  timeAwareness: boolean;
  sessionTracking: boolean;
}

export const defaultMomentumSettings: MomentumSettings = {
  enabled: true,
  fluidTransitions: true,
  musicalRhythm: true,
  documentPresence: true,
  interfaceAbsence: false,
  timeAwareness: true,
  sessionTracking: true,
};

export function generateMomentumCSS(settings: MomentumSettings): string {
  if (!settings.enabled) return "";
  let css = "";

  if (settings.fluidTransitions) {
    css += `
      .momentum-active * { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
      .momentum-active .panel-transition { transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
      .momentum-active button { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
      @keyframes momentumReveal { from { opacity: 0; transform: translateY(8px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      .momentum-active .modal-enter { animation: momentumReveal 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    `;
  }

  if (settings.musicalRhythm) {
    css += `
      .momentum-active .btn-fast { transition-duration: 0.15s; }
      @keyframes crescendoBuild { 0% { transform: scale(0.95); opacity: 0.5; } 70% { transform: scale(1.02); opacity: 0.9; } 100% { transform: scale(1); opacity: 1; } }
      .momentum-active .crescendo { animation: crescendoBuild 0.8s ease-out forwards; }
      @keyframes releaseFloat { 0% { transform: translateY(0); } 50% { transform: translateY(-4px); } 100% { transform: translateY(0); } }
      .momentum-active .release { animation: releaseFloat 0.6s ease-out forwards; }
    `;
  }

  if (settings.documentPresence) {
    css += `
      .presence-doc h1 { position: relative; }
      .presence-doc h1::before { content: ''; position: absolute; left: -2rem; top: 50%; transform: translateY(-50%); width: 4px; height: 60%; background: linear-gradient(180deg, var(--primary), transparent); border-radius: 2px; opacity: 0.3; }
      .presence-doc blockquote { position: relative; }
      .presence-doc blockquote::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: var(--primary); border-radius: 1.5px; opacity: 0.4; animation: presencePulse 4s ease-in-out infinite; }
      @keyframes presencePulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
      .presence-doc pre { box-shadow: 0 8px 32px rgba(0,0,0,0.06); border-bottom: 3px solid rgba(99,102,241,0.1); }
    `;
  }

  if (settings.interfaceAbsence) {
    css += `
      .absence-active .chrome-element { transition: opacity 2s ease; }
      .absence-active.deep-focus .chrome-element { opacity: 0.05; }
      .absence-active.deep-focus .chrome-element:hover { opacity: 1; transition: opacity 0.3s ease; }
    `;
  }

  return css;
}

export function getTimeAwareCSS(): string {
  if (typeof window === "undefined") return "";
  const hour = new Date().getHours();
  if (hour >= 22 || hour < 5) return `.time-aware .markdown-preview { filter: contrast(0.97) brightness(0.98); } .time-aware .cm-editor { filter: brightness(0.97); }`;
  if (hour >= 17 && hour < 20) return `.time-aware { --time-warmth: rgba(251, 146, 60, 0.02); }`;
  return "";
}

export function getSessionAwareCSS(sessionMinutes: number): string {
  if (sessionMinutes < 30) return "";
  if (sessionMinutes < 60) return `.session-aware .toolbar-chrome { opacity: 0.85; }`;
  if (sessionMinutes < 120) return `.session-aware .toolbar-chrome { opacity: 0.7; } .session-aware .border-element { opacity: 0.6; }`;
  return `.session-aware .toolbar-chrome { opacity: 0.5; } .session-aware .border-element { opacity: 0.4; }`;
}

export interface CreativeMemory {
  preferredWritingHours: number[];
  averageSessionLength: number;
  preferredTheme: string;
  preferredFonts: { heading: string; body: string };
  documentMoods: string[];
  totalWordsWritten: number;
  totalExports: number;
  firstUseDate: string;
}

export function loadCreativeMemory(): CreativeMemory {
  if (typeof window === "undefined") return getDefaultMemory();
  try { const s = localStorage.getItem("markflow-creative-memory"); return s ? JSON.parse(s) : getDefaultMemory(); } catch { return getDefaultMemory(); }
}

export function saveCreativeMemory(memory: CreativeMemory): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("markflow-creative-memory", JSON.stringify(memory));
}

export function updateMemoryOnExport(memory: CreativeMemory, wordCount: number, mood: string): CreativeMemory {
  return { ...memory, totalExports: memory.totalExports + 1, totalWordsWritten: memory.totalWordsWritten + wordCount, documentMoods: [...memory.documentMoods.slice(-9), mood], preferredWritingHours: [...memory.preferredWritingHours.slice(-19), new Date().getHours()] };
}

function getDefaultMemory(): CreativeMemory {
  return { preferredWritingHours: [], averageSessionLength: 0, preferredTheme: "minimal-clean", preferredFonts: { heading: "Inter", body: "Inter" }, documentMoods: [], totalWordsWritten: 0, totalExports: 0, firstUseDate: new Date().toISOString().split("T")[0] };
}
