/**
 * AI Writing Enhancements
 * Client-side writing tools: TOC generator, markdown fixer, text-to-markdown converter,
 * formatting improvements.
 */

/**
 * Generate a Table of Contents from markdown headings
 */
export function generateTableOfContents(markdown: string): string {
  const lines = markdown.split("\n");
  const headings: { level: number; text: string; slug: string }[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*_`~\[\]]/g, "").trim();
      const slug = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      headings.push({ level, text, slug });
    }
  }

  if (headings.length === 0) return "";

  const minLevel = Math.min(...headings.map(h => h.level));

  const tocLines = headings.map(h => {
    const indent = "  ".repeat(h.level - minLevel);
    return `${indent}- [${h.text}](#${h.slug})`;
  });

  return `## Table of Contents\n\n${tocLines.join("\n")}\n\n---\n\n`;
}

/**
 * Fix common markdown issues
 */
export function fixMarkdown(markdown: string): string {
  let fixed = markdown;

  // Fix missing blank lines before headings
  fixed = fixed.replace(/([^\n])\n(#{1,6}\s)/g, "$1\n\n$2");

  // Fix missing blank lines after headings
  fixed = fixed.replace(/(#{1,6}\s.+)\n([^#\n])/g, "$1\n\n$2");

  // Fix inconsistent list markers (convert * to -)
  fixed = fixed.replace(/^\*\s/gm, "- ");

  // Fix trailing spaces
  fixed = fixed.replace(/[ \t]+$/gm, "");

  // Fix multiple consecutive blank lines (max 2)
  fixed = fixed.replace(/\n{4,}/g, "\n\n\n");

  // Fix missing space after # in headings
  fixed = fixed.replace(/^(#{1,6})([^\s#])/gm, "$1 $2");

  // Fix unbalanced code fences
  const codeBlockCount = (fixed.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    fixed += "\n```";
  }

  // Ensure file ends with newline
  if (!fixed.endsWith("\n")) {
    fixed += "\n";
  }

  return fixed;
}

/**
 * Convert plain text to basic markdown formatting
 */
export function textToMarkdown(text: string): string {
  const lines = text.split("\n");
  const result: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === "") {
      if (inList) {
        inList = false;
        result.push("");
      }
      result.push("");
      continue;
    }

    // Detect headings (short lines followed by content, or ALL CAPS)
    if (
      trimmed.length < 60 &&
      trimmed === trimmed.toUpperCase() &&
      /[A-Z]/.test(trimmed) &&
      !trimmed.startsWith("-") &&
      !trimmed.startsWith("*")
    ) {
      result.push(`## ${trimmed.charAt(0) + trimmed.slice(1).toLowerCase()}`);
      result.push("");
      continue;
    }

    // Detect numbered lists
    if (/^\d+[\.\)]\s/.test(trimmed)) {
      result.push(trimmed.replace(/^(\d+)[\.\)]\s/, "$1. "));
      inList = true;
      continue;
    }

    // Detect bullet lists
    if (/^[-•●]\s/.test(trimmed)) {
      result.push(`- ${trimmed.replace(/^[-•●]\s/, "")}`);
      inList = true;
      continue;
    }

    // Regular paragraphs
    result.push(trimmed);
  }

  return result.join("\n");
}

/**
 * Summarize sections by extracting first sentences
 */
export function summarizeSections(markdown: string): string {
  const sections: { heading: string; summary: string }[] = [];
  const lines = markdown.split("\n");
  let currentHeading = "";
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      if (currentHeading && currentContent.length > 0) {
        const firstSentence = currentContent
          .join(" ")
          .replace(/\s+/g, " ")
          .trim()
          .split(/[.!?]/)
          [0];
        if (firstSentence && firstSentence.length > 10) {
          sections.push({ heading: currentHeading, summary: firstSentence + "." });
        }
      }
      currentHeading = headingMatch[2];
      currentContent = [];
    } else if (line.trim() && !line.startsWith("```") && !line.startsWith("-") && !line.startsWith("|")) {
      currentContent.push(line.trim());
    }
  }

  // Handle last section
  if (currentHeading && currentContent.length > 0) {
    const firstSentence = currentContent.join(" ").replace(/\s+/g, " ").trim().split(/[.!?]/)[0];
    if (firstSentence && firstSentence.length > 10) {
      sections.push({ heading: currentHeading, summary: firstSentence + "." });
    }
  }

  if (sections.length === 0) return "No sections found to summarize.";

  return `## Summary\n\n${sections.map(s => `**${s.heading}:** ${s.summary}`).join("\n\n")}`;
}

/**
 * Get word count and reading time
 */
export function getDocumentStats(markdown: string): {
  wordCount: number;
  charCount: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number;
  headingCount: number;
  codeBlockCount: number;
  linkCount: number;
  imageCount: number;
} {
  // Remove code blocks for accurate word count
  const withoutCode = markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`]+`/g, "");
  const words = withoutCode.split(/\s+/).filter(w => w.length > 0);
  const sentences = withoutCode.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = markdown.split(/\n\n+/).filter(p => p.trim().length > 0);
  const headings = (markdown.match(/^#{1,6}\s/gm) || []).length;
  const codeBlocks = (markdown.match(/```/g) || []).length / 2;
  const links = (markdown.match(/\[.*?\]\(.*?\)/g) || []).length;
  const images = (markdown.match(/!\[.*?\]\(.*?\)/g) || []).length;

  return {
    wordCount: words.length,
    charCount: markdown.length,
    sentenceCount: sentences.length,
    paragraphCount: paragraphs.length,
    readingTime: Math.max(1, Math.ceil(words.length / 200)),
    headingCount: headings,
    codeBlockCount: Math.floor(codeBlocks),
    linkCount: links,
    imageCount: images,
  };
}

/**
 * Format markdown for consistent style
 */
export function formatMarkdown(markdown: string): string {
  let formatted = fixMarkdown(markdown);

  // Normalize heading style (remove closing hashes)
  formatted = formatted.replace(/^(#{1,6}\s.+?)\s*#+\s*$/gm, "$1");

  // Ensure consistent emphasis (* instead of _)
  // Only for simple cases to avoid breaking things
  formatted = formatted.replace(/(?<![\\*_])_([^_\n]+)_(?![\\*_])/g, "*$1*");
  formatted = formatted.replace(/(?<![\\*_])__([^_\n]+)__(?![\\*_])/g, "**$1**");

  return formatted;
}
