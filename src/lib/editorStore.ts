import { sampleMarkdown } from "./sampleMarkdown";

export interface EditorState {
  content: string;
  fileName: string;
  isDirty: boolean;
  lastSaved: Date | null;
}

export interface FontSettings {
  headingFont: string;
  bodyFont: string;
  codeFont: string;
}

export interface ExportSettings {
  pageSize: "a4" | "letter";
  orientation: "portrait" | "landscape";
  theme: string;
  showPageNumbers: boolean;
  showHeader: boolean;
  showFooter: boolean;
  headerText: string;
  footerText: string;
  showWatermark: boolean;
  watermarkText: string;
  author: string;
  title: string;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

const STORAGE_KEY = "markflow-editor-state";
const FONT_STORAGE_KEY = "markflow-font-settings";
const EXPORT_STORAGE_KEY = "markflow-export-settings";

export const defaultFontSettings: FontSettings = {
  headingFont: "Inter",
  bodyFont: "Inter",
  codeFont: "JetBrains Mono",
};

export const defaultExportSettings: ExportSettings = {
  pageSize: "a4",
  orientation: "portrait",
  theme: "minimal-clean",
  showPageNumbers: true,
  showHeader: false,
  showFooter: false,
  headerText: "",
  footerText: "",
  showWatermark: false,
  watermarkText: "DRAFT",
  author: "",
  title: "",
  margins: { top: 40, bottom: 40, left: 50, right: 50 },
};

export function loadEditorState(): EditorState {
  if (typeof window === "undefined") {
    return { content: sampleMarkdown, fileName: "document.md", isDirty: false, lastSaved: null };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastSaved: parsed.lastSaved ? new Date(parsed.lastSaved) : null,
      };
    }
  } catch {}
  return { content: sampleMarkdown, fileName: "document.md", isDirty: false, lastSaved: null };
}

export function saveEditorState(state: EditorState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function loadFontSettings(): FontSettings {
  if (typeof window === "undefined") return defaultFontSettings;
  try {
    const stored = localStorage.getItem(FONT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultFontSettings;
}

export function saveFontSettings(settings: FontSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadExportSettings(): ExportSettings {
  if (typeof window === "undefined") return defaultExportSettings;
  try {
    const stored = localStorage.getItem(EXPORT_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultExportSettings;
}

export function saveExportSettings(settings: ExportSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXPORT_STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}
