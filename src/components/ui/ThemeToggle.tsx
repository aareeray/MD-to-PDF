"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Array<"light" | "dark" | "system"> = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className="relative p-2.5 rounded-xl glass transition-premium hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
      title={`Current: ${theme}`}
    >
      {theme === "light" && <Sun size={18} className="text-amber-500" />}
      {theme === "dark" && <Moon size={18} className="text-blue-400" />}
      {theme === "system" && <Monitor size={18} className="text-[var(--muted-foreground)]" />}
    </button>
  );
}
