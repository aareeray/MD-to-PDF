/**
 * The Arrival Experience + Blank Page Experience
 * The moment the app opens should feel intentional — entering a creative sanctuary.
 * The empty editor is sacred: breathing cursor, subtle texture, inspiration prompts.
 */

export function getArrivalCSS(): string {
  return `
    @keyframes arrivalFadeIn { 0% { opacity: 0; filter: blur(8px); transform: scale(0.98); } 60% { opacity: 0.7; filter: blur(2px); } 100% { opacity: 1; filter: blur(0); transform: scale(1); } }
    @keyframes arrivalGradientPulse { 0% { opacity: 0; } 50% { opacity: 0.4; } 100% { opacity: 0.15; } }
    @keyframes arrivalTypoAwaken { 0% { opacity: 0; transform: translateY(12px); letter-spacing: 0.1em; } 100% { opacity: 1; transform: translateY(0); letter-spacing: normal; } }
    @keyframes arrivalCursorBreathe { 0%, 100% { opacity: 0.3; box-shadow: 0 0 0 0 rgba(99,102,241,0); } 50% { opacity: 1; box-shadow: 0 0 12px 2px rgba(99,102,241,0.15); } }
    .arrival-container { animation: arrivalFadeIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .arrival-gradient { position: fixed; inset: 0; pointer-events: none; z-index: 0; background: radial-gradient(ellipse at 50% 40%, rgba(99,102,241,0.06) 0%, transparent 60%); animation: arrivalGradientPulse 3s ease-out forwards; }
    .arrival-logo { animation: arrivalTypoAwaken 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; }
    .arrival-toolbar { animation: arrivalTypoAwaken 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both; }
    .arrival-editor { animation: arrivalFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both; }
    .arrival-preview { animation: arrivalFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.8s both; }
    .blank-page-active .cm-cursor { animation: arrivalCursorBreathe 2.5s ease-in-out infinite; border-left-width: 2px; border-color: rgba(99,102,241,0.8); }
    .blank-page-active .cm-editor { background: radial-gradient(ellipse at 50% 30%, rgba(99,102,241,0.015) 0%, transparent 50%); }
  `;
}

export const blankPagePrompts = [
  "Begin with a single thought...",
  "What would you like to create today?",
  "Every great document starts with one sentence.",
  "Start typing — the page is yours.",
  "Ideas become real when written down.",
  "Your words deserve beautiful form.",
  "Write freely. We'll make it shine.",
];

export function getSessionPrompt(): string {
  return blankPagePrompts[Math.floor(Date.now() / 86400000) % blankPagePrompts.length];
}

export function shouldShowArrival(): boolean {
  if (typeof window === "undefined") return false;
  const key = "markflow-arrival-shown";
  if (!sessionStorage.getItem(key)) { sessionStorage.setItem(key, "1"); return true; }
  return false;
}
