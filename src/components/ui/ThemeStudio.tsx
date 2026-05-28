"use client";

import { useState } from "react";
import { X, Palette, RotateCcw } from "lucide-react";

export interface ThemeStudioSettings {
  fontSize: number;        // 12-20
  lineHeight: number;      // 1.2-2.4
  paragraphSpacing: number; // 0.5-3.0
  headingScale: number;    // 0.8-2.0
  headingWeight: number;   // 300-900
  letterSpacing: number;   // -0.03 to 0.05
  maxWidth: number;        // 500-1000 (px)
  marginTop: number;       // 20-80
  marginBottom: number;    // 20-80
  marginSide: number;      // 20-100
  borderRadius: number;    // 0-20
  codeFontSize: number;    // 10-16
  blockquoteBorder: number; // 1-8
}

export const defaultStudioSettings: ThemeStudioSettings = {
  fontSize: 16,
  lineHeight: 1.7,
  paragraphSpacing: 1.0,
  headingScale: 1.2,
  headingWeight: 700,
  letterSpacing: 0,
  maxWidth: 720,
  marginTop: 40,
  marginBottom: 40,
  marginSide: 50,
  borderRadius: 8,
  codeFontSize: 14,
  blockquoteBorder: 4,
};

interface ThemeStudioProps {
  settings: ThemeStudioSettings;
  onChange: (settings: ThemeStudioSettings) => void;
  onClose: () => void;
}

interface SliderConfig {
  key: keyof ThemeStudioSettings;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
}

const sliders: SliderConfig[] = [
  { key: "fontSize", label: "Base Font Size", min: 12, max: 20, step: 0.5, unit: "px" },
  { key: "lineHeight", label: "Line Height", min: 1.2, max: 2.4, step: 0.05, unit: "" },
  { key: "paragraphSpacing", label: "Paragraph Spacing", min: 0.5, max: 3.0, step: 0.1, unit: "rem" },
  { key: "headingScale", label: "Heading Scale", min: 0.8, max: 2.0, step: 0.05, unit: "×" },
  { key: "headingWeight", label: "Heading Weight", min: 300, max: 900, step: 100, unit: "" },
  { key: "letterSpacing", label: "Letter Spacing", min: -0.03, max: 0.05, step: 0.005, unit: "em" },
  { key: "maxWidth", label: "Content Width", min: 500, max: 1000, step: 10, unit: "px" },
  { key: "marginTop", label: "Top Margin", min: 20, max: 80, step: 5, unit: "px" },
  { key: "marginBottom", label: "Bottom Margin", min: 20, max: 80, step: 5, unit: "px" },
  { key: "marginSide", label: "Side Margins", min: 20, max: 100, step: 5, unit: "px" },
  { key: "borderRadius", label: "Border Radius", min: 0, max: 20, step: 1, unit: "px" },
  { key: "codeFontSize", label: "Code Font Size", min: 10, max: 16, step: 0.5, unit: "px" },
  { key: "blockquoteBorder", label: "Quote Border Width", min: 1, max: 8, step: 1, unit: "px" },
];

export function ThemeStudio({ settings, onChange, onClose }: ThemeStudioProps) {
  const handleChange = (key: keyof ThemeStudioSettings, value: number) => {
    onChange({ ...settings, [key]: value });
  };

  const reset = () => onChange(defaultStudioSettings);

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-[var(--card)] border-l border-[var(--border)] shadow-2xl z-40 flex flex-col animate-fade-in">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-emerald-400" />
          <span className="font-semibold text-sm">Theme Studio</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={reset}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-premium"
            title="Reset to defaults"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-premium"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sliders.map((slider) => {
          const value = settings[slider.key];
          const percentage = ((value - slider.min) / (slider.max - slider.min)) * 100;

          return (
            <div key={slider.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-[var(--muted-foreground)]">
                  {slider.label}
                </label>
                <span className="text-[11px] font-mono text-[var(--primary)] bg-[var(--primary)]/5 px-1.5 py-0.5 rounded">
                  {typeof value === "number" ? (Number.isInteger(value) ? value : value.toFixed(slider.step < 0.01 ? 3 : slider.step < 0.1 ? 2 : 1)) : value}
                  {slider.unit}
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={value}
                  onChange={(e) => handleChange(slider.key, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[var(--muted)] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:w-3.5
                    [&::-webkit-slider-thumb]:h-3.5
                    [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-[var(--primary)]
                    [&::-webkit-slider-thumb]:shadow-md
                    [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:transition-transform
                    [&::-webkit-slider-thumb]:hover:scale-125
                    [&::-moz-range-thumb]:w-3.5
                    [&::-moz-range-thumb]:h-3.5
                    [&::-moz-range-thumb]:rounded-full
                    [&::-moz-range-thumb]:bg-[var(--primary)]
                    [&::-moz-range-thumb]:border-none
                    [&::-moz-range-thumb]:shadow-md
                  "
                  style={{
                    background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${percentage}%, var(--muted) ${percentage}%, var(--muted) 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live preview snippet */}
      <div className="p-4 border-t border-[var(--border)] shrink-0">
        <div
          className="p-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] overflow-hidden"
          style={{
            fontSize: `${settings.fontSize * 0.6}px`,
            lineHeight: settings.lineHeight,
            letterSpacing: `${settings.letterSpacing}em`,
          }}
        >
          <h4
            className="font-bold mb-1"
            style={{
              fontSize: `${settings.fontSize * 0.6 * settings.headingScale}px`,
              fontWeight: settings.headingWeight,
            }}
          >
            Preview Heading
          </h4>
          <p className="text-[var(--muted-foreground)]" style={{ marginBottom: `${settings.paragraphSpacing * 0.4}rem` }}>
            Body text with your settings applied. Adjust sliders to see changes live.
          </p>
          <div
            className="bg-[var(--background)] px-2 py-1 font-mono text-[var(--muted-foreground)]"
            style={{
              fontSize: `${settings.codeFontSize * 0.6}px`,
              borderRadius: `${settings.borderRadius * 0.5}px`,
            }}
          >
            code block
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Generate CSS from theme studio settings
 */
export function generateStudioCSS(settings: ThemeStudioSettings): string {
  return `
    .document-body, #pdf-content {
      font-size: ${settings.fontSize}px;
      line-height: ${settings.lineHeight};
      letter-spacing: ${settings.letterSpacing}em;
      max-width: ${settings.maxWidth}px;
      margin: 0 auto;
      padding: ${settings.marginTop}px ${settings.marginSide}px ${settings.marginBottom}px;
    }
    .document-body p, #pdf-content p { margin-bottom: ${settings.paragraphSpacing}rem; }
    .document-body h1, #pdf-content h1 { font-size: ${settings.fontSize * settings.headingScale * 1.8}px; font-weight: ${settings.headingWeight}; }
    .document-body h2, #pdf-content h2 { font-size: ${settings.fontSize * settings.headingScale * 1.4}px; font-weight: ${settings.headingWeight}; }
    .document-body h3, #pdf-content h3 { font-size: ${settings.fontSize * settings.headingScale * 1.15}px; font-weight: ${settings.headingWeight}; }
    .document-body pre, #pdf-content pre { font-size: ${settings.codeFontSize}px; border-radius: ${settings.borderRadius}px; }
    .document-body code, #pdf-content code { border-radius: ${Math.max(2, settings.borderRadius * 0.5)}px; }
    .document-body blockquote, #pdf-content blockquote { border-left-width: ${settings.blockquoteBorder}px; border-radius: 0 ${settings.borderRadius}px ${settings.borderRadius}px 0; }
    .document-body table, #pdf-content table { border-radius: ${settings.borderRadius}px; overflow: hidden; }
    .document-body img, #pdf-content img { border-radius: ${settings.borderRadius}px; }
  `;
}
