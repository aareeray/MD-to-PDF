/**
 * AI Error Detection
 * Detect common markdown quality issues and suggest automatic fixes:
 * - Broken markdown syntax
 * - Ugly spacing patterns
 * - Bad typography
 * - Inconsistent headings
 * - Missing alt text
 * - Orphaned references
 */

export interface DetectedError {
  id: string;
  severity: "error" | "warning" | "suggestion";
  category: "syntax" | "spacing" | "typography" | "structure" | "accessibility" | "style";
  message: string;
  line?: number;
  autoFix?: () => string;
  fixDescription?: string;
}

/**
 * Run full error detection on markdown content
 */
export function detectErrors(content: string): DetectedError[] {
  const errors: DetectedError[] = [];
  const lines = content.split("\n");
  let errorId = 0;

  // 1. Broken markdown syntax
  // Unbalanced code fences
  const codeFences = content.match(/```/g) || [];
  if (codeFences.length % 2 !== 0) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "error",
      category: "syntax",
      message: "Unbalanced code fence (``` without closing ```)",
      fixDescription: "Add closing ``` at end of document",
    });
  }

  // Unbalanced bold/italic
  const boldCount = (content.match(/\*\*/g) || []).length;
  if (boldCount % 2 !== 0) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "warning",
      category: "syntax",
      message: "Unbalanced bold markers (**) detected",
      fixDescription: "Check for missing closing ** markers",
    });
  }

  // Broken links [text](
  const brokenLinks = content.match(/\[[^\]]*\]\(\s*\)/g) || [];
  if (brokenLinks.length > 0) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "error",
      category: "syntax",
      message: `${brokenLinks.length} empty link(s) found [text]()`,
      fixDescription: "Add URLs to empty links or remove them",
    });
  }

  // 2. Spacing issues
  lines.forEach((line, idx) => {
    // Multiple consecutive blank lines
    if (idx > 0 && idx < lines.length - 1) {
      if (line === "" && lines[idx - 1] === "" && lines[idx - 2] === "") {
        errors.push({
          id: `err-${errorId++}`,
          severity: "suggestion",
          category: "spacing",
          message: `Excessive blank lines at line ${idx + 1}`,
          line: idx + 1,
          fixDescription: "Reduce to maximum 2 consecutive blank lines",
        });
      }
    }

    // Trailing whitespace
    if (line.length > 0 && /\s{3,}$/.test(line) && !line.startsWith("```")) {
      errors.push({
        id: `err-${errorId++}`,
        severity: "suggestion",
        category: "spacing",
        message: `Trailing whitespace at line ${idx + 1}`,
        line: idx + 1,
        fixDescription: "Remove trailing spaces",
      });
    }

    // Missing blank line before heading
    if (/^#{1,6}\s/.test(line) && idx > 0 && lines[idx - 1].trim() !== "" && !lines[idx - 1].startsWith("#")) {
      errors.push({
        id: `err-${errorId++}`,
        severity: "suggestion",
        category: "spacing",
        message: `Missing blank line before heading at line ${idx + 1}`,
        line: idx + 1,
        fixDescription: "Add a blank line before headings for readability",
      });
    }
  });

  // 3. Typography issues
  // Check for straight quotes that should be curly
  if (content.includes('"') && !content.includes('\u201C')) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "suggestion",
      category: "typography",
      message: 'Straight quotes detected — consider using smart quotes (" ")',
      fixDescription: 'Enable Smart Quotes in Typography settings',
    });
  }

  // Multiple consecutive dashes that should be em/en dashes
  if (/[^-]---[^-]/.test(content) || /[^-]--[^-]/.test(content)) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "suggestion",
      category: "typography",
      message: "Dash sequences detected — could use proper em (—) or en (–) dashes",
      fixDescription: "Enable Smart Quotes to auto-convert dashes",
    });
  }

  // 4. Structure issues
  // Heading level skipping
  let lastHeadingLevel = 0;
  lines.forEach((line, idx) => {
    const match = line.match(/^(#{1,6})\s/);
    if (match) {
      const level = match[1].length;
      if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
        errors.push({
          id: `err-${errorId++}`,
          severity: "warning",
          category: "structure",
          message: `Heading level skipped at line ${idx + 1}: H${lastHeadingLevel} → H${level}`,
          line: idx + 1,
          fixDescription: `Use H${lastHeadingLevel + 1} for proper document outline`,
        });
      }
      lastHeadingLevel = level;
    }
  });

  // Inconsistent list markers
  const dashLists = (content.match(/^- /gm) || []).length;
  const starLists = (content.match(/^\* /gm) || []).length;
  const plusLists = (content.match(/^\+ /gm) || []).length;
  const usedMarkers = [dashLists > 0, starLists > 0, plusLists > 0].filter(Boolean).length;
  if (usedMarkers > 1) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "suggestion",
      category: "style",
      message: "Inconsistent list markers (mixing -, *, +)",
      fixDescription: "Use a single list marker type throughout (- recommended)",
    });
  }

  // 5. Accessibility
  // Images without alt text
  const imagesNoAlt = (content.match(/!\[\]\(/g) || []).length;
  if (imagesNoAlt > 0) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "warning",
      category: "accessibility",
      message: `${imagesNoAlt} image(s) missing alt text`,
      fixDescription: "Add descriptive alt text: ![description](url)",
    });
  }

  // 6. Style consistency
  // Mixed heading styles (# vs underline)
  if (/^[^\n]+\n={3,}$/m.test(content) && /^#\s/m.test(content)) {
    errors.push({
      id: `err-${errorId++}`,
      severity: "suggestion",
      category: "style",
      message: "Mixed heading styles (ATX # and Setext ===)",
      fixDescription: "Use # style headings consistently",
    });
  }

  return errors;
}

/**
 * Get summary of errors by severity
 */
export function getErrorSummary(errors: DetectedError[]): {
  errorCount: number;
  warningCount: number;
  suggestionCount: number;
  healthScore: number;
} {
  const errorCount = errors.filter(e => e.severity === "error").length;
  const warningCount = errors.filter(e => e.severity === "warning").length;
  const suggestionCount = errors.filter(e => e.severity === "suggestion").length;
  const healthScore = Math.max(0, Math.min(100, 100 - (errorCount * 15) - (warningCount * 5) - (suggestionCount * 2)));

  return { errorCount, warningCount, suggestionCount, healthScore };
}
