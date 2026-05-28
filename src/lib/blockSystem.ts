/**
 * Modular Block System
 * Custom content blocks: callouts, warnings, timelines, side notes, info boxes.
 * These are parsed from special markdown syntax and rendered as rich blocks.
 *
 * Syntax:
 * :::info
 * Content here
 * :::
 *
 * :::warning
 * Content here
 * :::
 *
 * :::tip
 * Content here
 * :::
 *
 * :::note
 * Content here
 * :::
 *
 * :::danger
 * Content here
 * :::
 *
 * :::timeline
 * - 2024: Event one
 * - 2025: Event two
 * :::
 *
 * :::aside
 * Side note content
 * :::
 */

export type BlockType = "info" | "warning" | "tip" | "note" | "danger" | "success" | "timeline" | "aside" | "quote-author";

interface Block {
  type: BlockType;
  title?: string;
  content: string;
}

const blockConfig: Record<BlockType, { icon: string; color: string; bgColor: string; borderColor: string; darkBgColor: string }> = {
  info: { icon: "ℹ️", color: "#2563eb", bgColor: "#eff6ff", borderColor: "#3b82f6", darkBgColor: "rgba(59,130,246,0.1)" },
  warning: { icon: "⚠️", color: "#d97706", bgColor: "#fffbeb", borderColor: "#f59e0b", darkBgColor: "rgba(245,158,11,0.1)" },
  tip: { icon: "💡", color: "#059669", bgColor: "#ecfdf5", borderColor: "#10b981", darkBgColor: "rgba(16,185,129,0.1)" },
  note: { icon: "📝", color: "#7c3aed", bgColor: "#f5f3ff", borderColor: "#8b5cf6", darkBgColor: "rgba(139,92,246,0.1)" },
  danger: { icon: "🚨", color: "#dc2626", bgColor: "#fef2f2", borderColor: "#ef4444", darkBgColor: "rgba(239,68,68,0.1)" },
  success: { icon: "✅", color: "#16a34a", bgColor: "#f0fdf4", borderColor: "#22c55e", darkBgColor: "rgba(34,197,94,0.1)" },
  timeline: { icon: "📅", color: "#6366f1", bgColor: "#eef2ff", borderColor: "#6366f1", darkBgColor: "rgba(99,102,241,0.1)" },
  aside: { icon: "💬", color: "#64748b", bgColor: "#f8fafc", borderColor: "#94a3b8", darkBgColor: "rgba(148,163,184,0.1)" },
  "quote-author": { icon: "💭", color: "#6b7280", bgColor: "#f9fafb", borderColor: "#9ca3af", darkBgColor: "rgba(156,163,175,0.1)" },
};

/**
 * Process custom block syntax in markdown content
 * Converts :::type ... ::: blocks into HTML
 */
export function processBlocks(markdown: string): string {
  const blockRegex = /:::(info|warning|tip|note|danger|success|timeline|aside|quote-author)(?:\s+(.+?))?\n([\s\S]*?):::/g;

  return markdown.replace(blockRegex, (_, type: BlockType, title: string | undefined, content: string) => {
    const config = blockConfig[type];
    const trimmedContent = content.trim();
    const titleText = title?.trim() || type.charAt(0).toUpperCase() + type.slice(1);

    if (type === "timeline") {
      return renderTimeline(trimmedContent, config);
    }

    return `<div class="custom-block custom-block-${type}" style="
      border-left: 4px solid ${config.borderColor};
      background: ${config.bgColor};
      padding: 1rem 1.25rem;
      margin: 1.25rem 0;
      border-radius: 0 8px 8px 0;
    ">
      <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-weight: 600; color: ${config.color}; font-size: 0.9rem;">
        <span>${config.icon}</span>
        <span>${titleText}</span>
      </div>
      <div style="color: #374151; font-size: 0.9rem; line-height: 1.6;">
        ${trimmedContent}
      </div>
    </div>`;
  });
}

function renderTimeline(content: string, config: typeof blockConfig.timeline): string {
  const items = content.split("\n").filter(l => l.trim().startsWith("-") || l.trim().startsWith("*"));
  const timelineItems = items.map(item => {
    const text = item.replace(/^[-*]\s*/, "").trim();
    const colonIndex = text.indexOf(":");
    const date = colonIndex > 0 ? text.substring(0, colonIndex).trim() : "";
    const description = colonIndex > 0 ? text.substring(colonIndex + 1).trim() : text;
    return { date, description };
  });

  const itemsHTML = timelineItems.map(item => `
    <div style="display: flex; gap: 1rem; margin-bottom: 1rem; position: relative; padding-left: 1.5rem;">
      <div style="position: absolute; left: 0; top: 0.4rem; width: 10px; height: 10px; border-radius: 50%; background: ${config.borderColor}; border: 2px solid white; box-shadow: 0 0 0 2px ${config.borderColor};"></div>
      <div>
        ${item.date ? `<span style="font-weight: 600; color: ${config.color}; font-size: 0.85rem;">${item.date}</span>` : ""}
        <p style="margin: 0.15rem 0 0; font-size: 0.9rem; color: #374151;">${item.description}</p>
      </div>
    </div>
  `).join("");

  return `<div class="custom-block custom-block-timeline" style="
    border-left: 2px solid ${config.borderColor};
    padding: 0.75rem 0 0.75rem 0;
    margin: 1.25rem 0 1.25rem 0.5rem;
  ">
    ${itemsHTML}
  </div>`;
}

/**
 * CSS for custom blocks (for preview rendering)
 */
export function getBlockCSS(): string {
  let css = "";
  for (const [type, config] of Object.entries(blockConfig)) {
    css += `
      .custom-block-${type} {
        border-left: 4px solid ${config.borderColor};
        background: ${config.bgColor};
        padding: 1rem 1.25rem;
        margin: 1.25rem 0;
        border-radius: 0 8px 8px 0;
      }
      .dark .custom-block-${type} {
        background: ${config.darkBgColor};
      }
    `;
  }
  return css;
}

/**
 * CSS for blocks in PDF export
 */
export function getBlockExportCSS(): string {
  let css = "";
  for (const [type, config] of Object.entries(blockConfig)) {
    css += `
      .custom-block-${type} {
        border-left: 4px solid ${config.borderColor};
        background: ${config.bgColor};
        padding: 1rem 1.25rem;
        margin: 1.25rem 0;
        border-radius: 0 8px 8px 0;
        break-inside: avoid;
        page-break-inside: avoid;
      }
    `;
  }
  return css;
}
