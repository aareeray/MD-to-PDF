/**
 * Emotional Export Ritual
 * When export completes, create a cinematic moment:
 * - Document materializing from particles
 * - Soft light sweep across the page
 * - Elegant success state with typing animation
 * - Time capsule metadata embedding
 * - Personal touch: writing stats & mood
 */

export interface ExportRitualState {
  phase: "idle" | "preparing" | "rendering" | "materializing" | "complete";
  progress: number;
  message: string;
  subMessage: string;
}

export const exportPhases: Record<string, { message: string; subMessage: string }> = {
  preparing: {
    message: "Preparing your document",
    subMessage: "Analyzing structure and typography...",
  },
  rendering: {
    message: "Crafting beautiful pages",
    subMessage: "Applying layout engine and typographic rules...",
  },
  materializing: {
    message: "Materializing your creation",
    subMessage: "Embedding fonts and finalizing quality...",
  },
  complete: {
    message: "Your document is ready",
    subMessage: "A beautiful creation, ready to share with the world.",
  },
};

/**
 * Get ritual phase based on progress percentage
 */
export function getRitualPhase(progress: number): ExportRitualState {
  if (progress < 15) {
    return { phase: "preparing", progress, ...exportPhases.preparing };
  }
  if (progress < 70) {
    return { phase: "rendering", progress, ...exportPhases.rendering };
  }
  if (progress < 95) {
    return { phase: "materializing", progress, ...exportPhases.materializing };
  }
  return { phase: "complete", progress: 100, ...exportPhases.complete };
}

/**
 * Generate time capsule metadata for exported documents
 */
export interface TimeCapsuleMetadata {
  exportDate: string;
  exportTime: string;
  wordCount: number;
  readingTime: number;
  writingDuration: string;
  revisions: number;
  mood: string; // Detected from content
  version: string;
}

export function generateTimeCapsule(
  content: string,
  sessionStart: Date | null
): TimeCapsuleMetadata {
  const now = new Date();
  const words = content.split(/\s+/).filter(w => w.length > 0).length;

  // Detect "mood" from content characteristics
  const mood = detectContentMood(content);

  // Calculate writing duration
  let writingDuration = "Unknown";
  if (sessionStart) {
    const durationMs = now.getTime() - sessionStart.getTime();
    const minutes = Math.floor(durationMs / 60000);
    if (minutes < 60) {
      writingDuration = `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMins = minutes % 60;
      writingDuration = `${hours}h ${remainingMins}m`;
    }
  }

  return {
    exportDate: now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    exportTime: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    wordCount: words,
    readingTime: Math.max(1, Math.ceil(words / 200)),
    writingDuration,
    revisions: 1,
    mood,
    version: "1.0",
  };
}

function detectContentMood(content: string): string {
  const lower = content.toLowerCase();

  // Simple keyword-based mood detection
  if (/\b(excited|amazing|incredible|breakthrough)\b/.test(lower)) return "Enthusiastic";
  if (/\b(research|hypothesis|methodology|analysis)\b/.test(lower)) return "Analytical";
  if (/\b(chapter|story|once upon|adventure)\b/.test(lower)) return "Creative";
  if (/\b(meeting|agenda|action items|deadline)\b/.test(lower)) return "Focused";
  if (/\b(reflect|journey|grateful|growth)\b/.test(lower)) return "Reflective";
  if (/\b(install|configure|api|function|deploy)\b/.test(lower)) return "Technical";

  // Fallback based on structure
  const codeRatio = (content.match(/```/g) || []).length / 2;
  if (codeRatio > 3) return "Technical";

  const avgSentenceLen = content.length / Math.max((content.match(/[.!?]/g) || []).length, 1);
  if (avgSentenceLen > 150) return "Contemplative";
  if (avgSentenceLen < 50) return "Energetic";

  return "Thoughtful";
}

/**
 * CSS for the emotional export ritual animation
 */
export function getExportRitualCSS(): string {
  return `
    /* Light sweep effect */
    @keyframes lightSweep {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .light-sweep {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,0.1) 45%,
        rgba(255,255,255,0.3) 50%,
        rgba(255,255,255,0.1) 55%,
        transparent 100%
      );
      background-size: 200% 100%;
      animation: lightSweep 2s ease-in-out;
      pointer-events: none;
    }

    /* Particle materialization */
    @keyframes particleMaterialize {
      0% { opacity: 0; transform: scale(0.8) translateY(10px); filter: blur(4px); }
      50% { opacity: 0.5; filter: blur(2px); }
      100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
    }

    .materialize-effect {
      animation: particleMaterialize 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Soft glow pulse on completion */
    @keyframes completionGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
      50% { box-shadow: 0 0 40px 10px rgba(34, 197, 94, 0.1); }
    }

    .completion-glow {
      animation: completionGlow 2s ease-in-out;
    }

    /* Typing animation for completion message */
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }

    .typewriter-text {
      overflow: hidden;
      white-space: nowrap;
      animation: typewriter 1.5s steps(40, end) forwards;
    }
  `;
}
