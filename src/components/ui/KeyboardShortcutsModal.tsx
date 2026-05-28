"use client";

import { X, Keyboard } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "S"], description: "Save document" },
  { keys: ["Ctrl", "E"], description: "Toggle export panel" },
  { keys: ["Ctrl", "B"], description: "Toggle split view" },
  { keys: ["Ctrl", "Shift", "F"], description: "Toggle zen mode" },
  { keys: ["Ctrl", "?"], description: "Show keyboard shortcuts" },
  { keys: ["Esc"], description: "Close panels / Exit zen mode" },
];

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

export function KeyboardShortcutsModal({ onClose }: KeyboardShortcutsModalProps) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <Keyboard size={18} className="text-[var(--primary)]" />
            <span className="font-semibold">Keyboard Shortcuts</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          {shortcuts.map((shortcut) => (
            <div
              key={shortcut.description}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-[var(--muted-foreground)]">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="px-2 py-1 rounded-md bg-[var(--muted)] border border-[var(--border)] text-xs font-mono font-medium"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
