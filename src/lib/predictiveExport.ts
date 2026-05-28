/**
 * Predictive Export Engine
 * Before exporting, analyze and predict potential issues:
 * - Estimated page count
 * - Overflow warnings
 * - Typography issues
 * - Color contrast problems
 * - Print readiness assessment
 */

export interface PredictiveAnalysis {
  estimatedPages: number;
  readinessScore: number; // 0-100
  issues: ExportIssue[];
  suggestions: string[];
  metadata: {
    wordCount: number;
    imageCount: number;
    tableCount: number;
    codeBlockCount: number;
    estimatedPrintTime: string;
  };
}

export interface ExportIssue {
  type: "warning" | "error" | "info";
  category: "overflow" | "typography" | "contrast" | "layout" | "content";
  message: string;
  suggestion?: string;
  line?: number;
}

/**
 * Run predictive analysis on markdown content before export
 */
export function analyzePredictive(
  content: string,
  theme: string,
  pageSize: "a4" | "letter"
): PredictiveAnalysis {
  const issues: ExportIssue[] = [];
  const suggestions: string[] = [];
  const lines = content.split("\n");

  // Word & element counts
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
  const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const tableCount = (content.match(/\|.*\|.*\|/g) || []).length;
  const codeBlockCount = Math.floor((content.match(/```/g) || []).length / 2);

  // Estimate pages (roughly 300 words per page for A4 with standard margins)
  const wordsPerPage = pageSize === "a4" ? 300 : 280;
  const codePageEquivalent = codeBlockCount * 0.3;
  const tablePageEquivalent = tableCount * 0.15;
  const imagePageEquivalent = imageCount * 0.25;
  const estimatedPages = Math.max(
    1,
    Math.ceil(wordCount / wordsPerPage + codePageEquivalent + tablePageEquivalent + imagePageEquivalent)
  );

  // Check for overflow issues
  lines.forEach((line, idx) => {
    // Very long lines that might overflow
    if (line.length > 200 && !line.startsWith("```") && !line.startsWith("|")) {
      issues.push({
        type: "warning",
        category: "overflow",
        message: `Line ${idx + 1} is very long (${line.length} chars) and may overflow in PDF`,
        suggestion: "Consider breaking this line into shorter paragraphs",
        line: idx + 1,
      });
    }

    // Very long code lines
    if (/^\s{4,}/.test(line) && line.length > 100) {
      issues.push({
        type: "info",
        category: "overflow",
        message: `Code at line ${idx + 1} may overflow the page width`,
        line: idx + 1,
      });
    }
  });

  // Typography issues
  const h1Count = lines.filter(l => /^#\s/.test(l)).length;
  const h2Count = lines.filter(l => /^##\s/.test(l)).length;
  const h3Count = lines.filter(l => /^###\s/.test(l)).length;

  if (h1Count === 0) {
    issues.push({
      type: "info",
      category: "typography",
      message: "No H1 heading found — consider adding a main title",
      suggestion: "Add a # Title at the beginning for proper document structure",
    });
  }

  if (h1Count > 3) {
    issues.push({
      type: "warning",
      category: "typography",
      message: `Multiple H1 headings (${h1Count}) found — consider using H2 for sections`,
      suggestion: "Use a single H1 for the document title, H2 for major sections",
    });
  }

  if (h2Count > 0 && h3Count > h2Count * 4) {
    issues.push({
      type: "info",
      category: "typography",
      message: "Deep heading nesting detected — may affect readability",
    });
  }

  // Check for inconsistent heading levels (skipping levels)
  let lastHeadingLevel = 0;
  lines.forEach((line, idx) => {
    const match = line.match(/^(#{1,6})\s/);
    if (match) {
      const level = match[1].length;
      if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
        issues.push({
          type: "warning",
          category: "typography",
          message: `Heading level skipped at line ${idx + 1} (H${lastHeadingLevel} → H${level})`,
          suggestion: `Consider using H${lastHeadingLevel + 1} instead`,
          line: idx + 1,
        });
      }
      lastHeadingLevel = level;
    }
  });

  // Contrast issues for dark themes
  if (theme === "dark-cyberpunk" || theme === "noir") {
    issues.push({
      type: "info",
      category: "contrast",
      message: "Dark theme selected — ensure text contrast meets WCAG 2.1 AA standards",
      suggestion: "Dark themes work best for screen viewing; consider a light theme for printing",
    });
  }

  // Layout issues
  // Check for very large tables
  const tableLines = content.match(/\|.*\|/g) || [];
  if (tableLines.some(l => l.split("|").length > 8)) {
    issues.push({
      type: "warning",
      category: "layout",
      message: "Wide table detected — may overflow page margins",
      suggestion: "Consider landscape orientation or reducing columns",
    });
  }

  // Content warnings
  if (wordCount < 50) {
    issues.push({
      type: "info",
      category: "content",
      message: "Very short document — PDF may appear sparse",
      suggestion: "Consider adding more content or using compact margins",
    });
  }

  if (wordCount > 10000) {
    suggestions.push("Consider enabling chapter breaks for better pagination");
  }

  if (codeBlockCount > 5) {
    suggestions.push("Developer Docs theme recommended for code-heavy documents");
  }

  if (imageCount > 3) {
    suggestions.push("Consider using full-width image layout for visual-heavy content");
  }

  if (estimatedPages > 20) {
    suggestions.push("Enable Table of Contents for long documents");
    suggestions.push("Consider enabling running headers for easier navigation");
  }

  // Calculate readiness score
  const errorCount = issues.filter(i => i.type === "error").length;
  const warningCount = issues.filter(i => i.type === "warning").length;
  const readinessScore = Math.max(0, Math.min(100, 100 - (errorCount * 20) - (warningCount * 5)));

  // Estimate print time
  const estimatedPrintTime = estimatedPages <= 5 ? "< 1 second" :
    estimatedPages <= 20 ? "1-3 seconds" :
    estimatedPages <= 50 ? "3-8 seconds" : "8-15 seconds";

  return {
    estimatedPages,
    readinessScore,
    issues,
    suggestions,
    metadata: {
      wordCount,
      imageCount,
      tableCount,
      codeBlockCount,
      estimatedPrintTime,
    },
  };
}
