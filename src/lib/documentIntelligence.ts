/**
 * Document Intelligence System
 * Detects document type from markdown content and suggests appropriate themes/layouts.
 */

export type DocumentType =
  | "resume"
  | "blog"
  | "research-paper"
  | "meeting-notes"
  | "documentation"
  | "ebook"
  | "letter"
  | "general";

export interface DocumentAnalysis {
  type: DocumentType;
  confidence: number; // 0-1
  suggestedTheme: string;
  suggestedFonts: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
  };
  features: string[];
  description: string;
}

// Pattern matchers for different document types
const patterns: Record<DocumentType, { keywords: RegExp[]; structural: (content: string) => number }> = {
  resume: {
    keywords: [
      /\b(experience|education|skills|work history|employment|objective|summary)\b/gi,
      /\b(responsibilities|achievements|certifications|references)\b/gi,
      /\b(proficient|familiar with|years? of experience)\b/gi,
      /\b(bachelor|master|phd|degree|university|college)\b/gi,
      /\b(contact|email|phone|linkedin|portfolio)\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      const lines = content.split("\n");
      // Resumes tend to have many H2 section headers
      const h2Count = lines.filter(l => /^##\s/.test(l)).length;
      if (h2Count >= 3 && h2Count <= 10) score += 0.3;
      // Short bullet points
      const bulletLines = lines.filter(l => /^[-*]\s/.test(l.trim()));
      if (bulletLines.length > 5) score += 0.2;
      // Date patterns
      const datePattern = /\b(20\d{2}|19\d{2})\s*[-–]\s*(20\d{2}|present|current)\b/gi;
      if (datePattern.test(content)) score += 0.3;
      // Email/phone patterns
      if (/[\w.-]+@[\w.-]+\.\w+/.test(content)) score += 0.1;
      if (/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(content)) score += 0.1;
      return Math.min(score, 1);
    },
  },
  blog: {
    keywords: [
      /\b(introduction|conclusion|in this (article|post|tutorial))\b/gi,
      /\b(let's|we'll|you'll|you can|in this section)\b/gi,
      /\b(tl;dr|tldr|summary|takeaways|key points)\b/gi,
      /\b(subscribe|follow|share|comments?|read more)\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      const lines = content.split("\n");
      // Blog posts tend to have one H1 and several H2s
      const h1Count = lines.filter(l => /^#\s/.test(l)).length;
      const h2Count = lines.filter(l => /^##\s/.test(l)).length;
      if (h1Count === 1 && h2Count >= 2) score += 0.3;
      // Longer paragraphs
      const paragraphs = content.split(/\n\n+/).filter(p => p.length > 100);
      if (paragraphs.length >= 3) score += 0.3;
      // Code blocks suggest tutorial/technical blog
      const codeBlocks = (content.match(/```/g) || []).length / 2;
      if (codeBlocks >= 1 && codeBlocks <= 5) score += 0.2;
      // Links/images
      if (/!\[.*\]\(.*\)/.test(content)) score += 0.1;
      if (/\[.*\]\(http/.test(content)) score += 0.1;
      return Math.min(score, 1);
    },
  },
  "research-paper": {
    keywords: [
      /\b(abstract|methodology|results|discussion|conclusion|references|bibliography)\b/gi,
      /\b(hypothesis|experiment|data|analysis|findings|literature review)\b/gi,
      /\b(figure \d|table \d|equation \d|et al\.?|ibid)\b/gi,
      /\b(furthermore|moreover|however|nevertheless|consequently)\b/gi,
      /\b(p\s*[<>=]\s*0\.\d+|n\s*=\s*\d+|CI|confidence interval)\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      // Academic structure: Abstract, Introduction, Methods, Results, Discussion
      if (/^#+\s*(abstract)/mi.test(content)) score += 0.3;
      if (/^#+\s*(method|methodology)/mi.test(content)) score += 0.2;
      if (/^#+\s*(results?|findings)/mi.test(content)) score += 0.2;
      if (/^#+\s*(discussion|conclusion)/mi.test(content)) score += 0.2;
      // Citations
      if (/\[\d+\]|\(\w+,?\s*\d{4}\)/.test(content)) score += 0.2;
      // Math/equations
      if (/\$\$[\s\S]+\$\$|\$[^$]+\$/.test(content)) score += 0.1;
      return Math.min(score, 1);
    },
  },
  "meeting-notes": {
    keywords: [
      /\b(attendees|participants|agenda|action items|minutes|meeting)\b/gi,
      /\b(discussed|agreed|decided|assigned|follow[\s-]?up|next steps)\b/gi,
      /\b(deadline|due date|by (monday|tuesday|wednesday|thursday|friday))\b/gi,
      /\b(Q[1-4]|sprint|standup|retro|kickoff)\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      const lines = content.split("\n");
      // Task list items
      const taskItems = lines.filter(l => /^[-*]\s*\[[ x]\]/.test(l.trim()));
      if (taskItems.length >= 3) score += 0.3;
      // Date in title
      if (/\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/.test(lines[0] || "")) score += 0.2;
      // Short document
      if (content.length < 3000) score += 0.1;
      // Names mentioned
      if (/@\w+/.test(content)) score += 0.2;
      // Time references
      if (/\d{1,2}:\d{2}/.test(content)) score += 0.2;
      return Math.min(score, 1);
    },
  },
  documentation: {
    keywords: [
      /\b(installation|setup|configuration|getting started|api|usage)\b/gi,
      /\b(prerequisites|requirements|dependencies|compatibility)\b/gi,
      /\b(example|syntax|parameters|returns|throws|deprecated)\b/gi,
      /\b(npm|yarn|pip|cargo|docker|kubectl)\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      // Many code blocks
      const codeBlocks = (content.match(/```/g) || []).length / 2;
      if (codeBlocks >= 3) score += 0.3;
      // Headings hierarchy
      const lines = content.split("\n");
      const headingLevels = new Set(
        lines.filter(l => /^#{1,4}\s/.test(l)).map(l => (l.match(/^#+/) || [""])[0].length)
      );
      if (headingLevels.size >= 3) score += 0.2;
      // Inline code references
      const inlineCode = (content.match(/`[^`]+`/g) || []).length;
      if (inlineCode >= 10) score += 0.2;
      // Tables
      if (/\|.*\|.*\|/.test(content)) score += 0.15;
      // Warning/note callouts
      if (/>\s*(note|warning|tip|important)/i.test(content)) score += 0.15;
      return Math.min(score, 1);
    },
  },
  ebook: {
    keywords: [
      /\b(chapter|prologue|epilogue|foreword|preface|appendix)\b/gi,
      /\b(part (one|two|three|i|ii|iii|iv|v))\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      // Long content
      if (content.length > 10000) score += 0.3;
      // Chapter-like headings
      const chapterHeadings = (content.match(/^#\s+(chapter|part)\s+/gmi) || []).length;
      if (chapterHeadings >= 2) score += 0.4;
      // Long flowing text
      const paragraphs = content.split(/\n\n+/).filter(p => p.length > 200);
      if (paragraphs.length >= 5) score += 0.2;
      // Horizontal rules as section breaks
      const hrCount = (content.match(/^---+$/gm) || []).length;
      if (hrCount >= 3) score += 0.1;
      return Math.min(score, 1);
    },
  },
  letter: {
    keywords: [
      /\b(dear|sincerely|regards|yours (truly|faithfully))\b/gi,
      /\b(to whom it may concern|I am writing to)\b/gi,
    ],
    structural: (content: string) => {
      let score = 0;
      const lines = content.split("\n").filter(l => l.trim());
      // Short document
      if (lines.length < 50 && content.length < 3000) score += 0.2;
      // Salutation at start
      if (/^(dear|to whom)/i.test(lines[0]?.trim() || "")) score += 0.4;
      // Sign-off at end
      const lastLines = lines.slice(-5).join(" ");
      if (/sincerely|regards|faithfully|best/i.test(lastLines)) score += 0.3;
      return Math.min(score, 1);
    },
  },
  general: {
    keywords: [],
    structural: () => 0.1,
  },
};

const themeMapping: Record<DocumentType, string> = {
  resume: "resume",
  blog: "luxury-editorial",
  "research-paper": "research-paper",
  "meeting-notes": "minimal-clean",
  documentation: "developer-docs",
  ebook: "ebook",
  letter: "minimal-clean",
  general: "minimal-clean",
};

const fontMapping: Record<DocumentType, { headingFont: string; bodyFont: string; codeFont: string }> = {
  resume: { headingFont: "Inter", bodyFont: "Inter", codeFont: "JetBrains Mono" },
  blog: { headingFont: "Playfair Display", bodyFont: "Inter", codeFont: "Fira Code" },
  "research-paper": { headingFont: "Georgia", bodyFont: "Georgia", codeFont: "JetBrains Mono" },
  "meeting-notes": { headingFont: "Inter", bodyFont: "Inter", codeFont: "JetBrains Mono" },
  documentation: { headingFont: "IBM Plex Sans", bodyFont: "IBM Plex Sans", codeFont: "JetBrains Mono" },
  ebook: { headingFont: "Playfair Display", bodyFont: "Georgia", codeFont: "Fira Code" },
  letter: { headingFont: "Inter", bodyFont: "Inter", codeFont: "JetBrains Mono" },
  general: { headingFont: "Inter", bodyFont: "Inter", codeFont: "JetBrains Mono" },
};

const descriptions: Record<DocumentType, string> = {
  resume: "Professional resume/CV detected. Applying compact layout with emphasis on hierarchy.",
  blog: "Blog article detected. Applying editorial typography for engaging reading.",
  "research-paper": "Academic paper detected. Applying formal formatting with proper citation style.",
  "meeting-notes": "Meeting notes detected. Applying structured layout with action item highlighting.",
  documentation: "Technical documentation detected. Applying developer-friendly theme with code emphasis.",
  ebook: "Long-form content detected. Applying book-style layout with chapter formatting.",
  letter: "Letter/correspondence detected. Applying formal letter layout.",
  general: "General document. Using clean minimal theme.",
};

export function analyzeDocument(content: string): DocumentAnalysis {
  const results: { type: DocumentType; score: number }[] = [];

  for (const [docType, pattern] of Object.entries(patterns)) {
    if (docType === "general") continue;
    
    let keywordScore = 0;
    for (const regex of pattern.keywords) {
      const matches = content.match(regex);
      if (matches) {
        keywordScore += Math.min(matches.length * 0.1, 0.3);
      }
    }
    keywordScore = Math.min(keywordScore, 0.5);

    const structuralScore = pattern.structural(content);
    const totalScore = keywordScore * 0.4 + structuralScore * 0.6;

    results.push({ type: docType as DocumentType, score: totalScore });
  }

  // Sort by score
  results.sort((a, b) => b.score - a.score);

  const best = results[0];
  const detectedType = best.score > 0.25 ? best.type : "general";
  const confidence = best.score > 0.25 ? Math.min(best.score, 0.95) : 0.1;

  const features: string[] = [];
  if (/```/.test(content)) features.push("Code blocks");
  if (/\|.*\|/.test(content)) features.push("Tables");
  if (/\$.*\$/.test(content)) features.push("Math equations");
  if (/!\[/.test(content)) features.push("Images");
  if (/^[-*]\s*\[[ x]\]/m.test(content)) features.push("Task lists");
  if (/^>/.test(content)) features.push("Blockquotes");
  if (/```mermaid/i.test(content)) features.push("Diagrams");

  return {
    type: detectedType,
    confidence,
    suggestedTheme: themeMapping[detectedType],
    suggestedFonts: fontMapping[detectedType],
    features,
    description: descriptions[detectedType],
  };
}
