"use client";

import { useState } from "react";
import { Brain, X, Sparkles, Check } from "lucide-react";
import { DocumentAnalysis } from "@/lib/documentIntelligence";

interface DocumentIntelligenceBannerProps {
  analysis: DocumentAnalysis | null;
  onApplySuggestion: () => void;
  onDismiss: () => void;
}

export function DocumentIntelligenceBanner({
  analysis,
  onApplySuggestion,
  onDismiss,
}: DocumentIntelligenceBannerProps) {
  const [applied, setApplied] = useState(false);

  if (!analysis || analysis.confidence < 0.3 || analysis.type === "general") {
    return null;
  }

  const handleApply = () => {
    onApplySuggestion();
    setApplied(true);
    setTimeout(() => onDismiss(), 1500);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-violet-500/10 to-blue-500/10 border-b border-[var(--border)] animate-slide-up">
      <Brain size={16} className="text-violet-400 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[var(--foreground)] truncate">
          <span className="font-semibold">Document Intelligence:</span>{" "}
          {analysis.description}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {!applied ? (
          <>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 text-white text-xs font-medium hover:opacity-90 transition-premium"
            >
              <Sparkles size={12} />
              Apply
            </button>
            <button
              onClick={onDismiss}
              className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-premium"
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <div className="flex items-center gap-1.5 text-green-500 text-xs font-medium">
            <Check size={14} />
            Applied!
          </div>
        )}
      </div>
    </div>
  );
}
