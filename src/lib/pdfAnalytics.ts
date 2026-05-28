/**
 * PDF Analytics
 * Post-analysis of document quality:
 * - Readability score (Flesch-Kincaid)
 * - Typography quality
 * - Structure analysis
 * - Visual balance score
 * - Estimated reading time
 */

export interface PDFAnalytics {
  readabilityScore: number; // 0-100 (Flesch reading ease)
  readabilityGrade: string; // "Very Easy", "Easy", etc.
  typographyScore: number; // 0-100
  structureScore: number; // 0-100
  visualBalanceScore: number; // 0-100
  overallQuality: number; // 0-100
  metrics: AnalyticsMetrics;
  breakdown: AnalyticsBreakdown[];
}

export interface AnalyticsMetrics {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
  readingTimeMinutes: number;
  headingsRatio: number; // headings per 500 words
  contentDensity: number; // characters per paragraph
  codeToTextRatio: number;
}

export interface AnalyticsBreakdown {
  category: string;
  score: number;
  label: string;
  suggestion?: string;
}

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word: string): number {
  word = word.toLowerCase().trim();
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  word = word.replace(/^y/, "");
  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

/**
 * Calculate Flesch Reading Ease score
 */
function fleschReadingEase(words: number, sentences: number, syllables: number): number {
  if (sentences === 0 || words === 0) return 50;
  const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
  return Math.max(0, Math.min(100, Math.round(score)));
}

function getReadabilityGrade(score: number): string {
  if (score >= 90) return "Very Easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly Easy";
  if (score >= 60) return "Standard";
  if (score >= 50) return "Fairly Difficult";
  if (score >= 30) return "Difficult";
  return "Very Difficult";
}

/**
 * Analyze document and produce comprehensive analytics
 */
export function analyzeDocument(content: string): PDFAnalytics {
  // Strip markdown syntax for text analysis
  const plainText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]+`/g, "word")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]+/g, "")
    .replace(/^[-*+]\s/gm, "")
    .replace(/^\d+\.\s/gm, "")
    .replace(/^>\s/gm, "")
    .replace(/\|.*\|/g, "")
    .replace(/---+/g, "")
    .trim();

  const words = plainText.split(/\s+/).filter(w => w.length > 0);
  const sentences = plainText.split(/[.!?]+/).filter(s => s.trim().length > 5);
  const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  const codeContent = (content.match(/```[\s\S]*?```/g) || []).join("");
  const lines = content.split("\n");

  const wordCount = words.length;
  const sentenceCount = Math.max(sentences.length, 1);
  const paragraphCount = Math.max(paragraphs.length, 1);
  const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Metrics
  const avgWordsPerSentence = wordCount / sentenceCount;
  const avgSyllablesPerWord = totalSyllables / Math.max(wordCount, 1);
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const headingsRatio = (headings / Math.max(wordCount, 1)) * 500;
  const contentDensity = plainText.length / paragraphCount;
  const codeToTextRatio = codeContent.length / Math.max(content.length, 1);

  // Readability score
  const readabilityScore = fleschReadingEase(wordCount, sentenceCount, totalSyllables);
  const readabilityGrade = getReadabilityGrade(readabilityScore);

  // Typography score
  let typographyScore = 70;
  // Penalize very long sentences
  if (avgWordsPerSentence > 25) typographyScore -= 10;
  if (avgWordsPerSentence < 8) typographyScore -= 5;
  // Reward good heading structure
  if (headingsRatio >= 0.5 && headingsRatio <= 3) typographyScore += 15;
  // Check heading hierarchy
  let hasSkippedLevels = false;
  let lastLevel = 0;
  lines.forEach(line => {
    const m = line.match(/^(#{1,6})\s/);
    if (m) {
      const level = m[1].length;
      if (lastLevel > 0 && level > lastLevel + 1) hasSkippedLevels = true;
      lastLevel = level;
    }
  });
  if (hasSkippedLevels) typographyScore -= 10;
  // Reward variety in paragraph length
  const paragraphLengths = paragraphs.map(p => p.length);
  const lengthVariance = paragraphLengths.length > 1
    ? Math.sqrt(paragraphLengths.reduce((s, l) => s + Math.pow(l - contentDensity, 2), 0) / paragraphLengths.length)
    : 0;
  if (lengthVariance > 100) typographyScore += 10; // Good variety
  typographyScore = Math.max(0, Math.min(100, typographyScore));

  // Structure score
  let structureScore = 60;
  if (headings >= 2) structureScore += 15;
  if (headings >= 4) structureScore += 5;
  if (lines.some(l => /^#\s/.test(l))) structureScore += 10; // Has H1
  if ((content.match(/^[-*+]\s/gm) || []).length > 0) structureScore += 5; // Has lists
  if (/\|.*\|/.test(content)) structureScore += 5; // Has tables
  if (wordCount > 100) structureScore += 5;
  structureScore = Math.max(0, Math.min(100, structureScore));

  // Visual balance score
  let visualBalanceScore = 65;
  // Good code-to-text ratio
  if (codeToTextRatio > 0.05 && codeToTextRatio < 0.5) visualBalanceScore += 10;
  // Has blockquotes for visual breaks
  if (/^>/m.test(content)) visualBalanceScore += 5;
  // Has images
  if (/!\[/.test(content)) visualBalanceScore += 10;
  // Has horizontal rules for section breaks
  if (/^---+$/m.test(content)) visualBalanceScore += 5;
  // Not too dense
  if (contentDensity > 100 && contentDensity < 800) visualBalanceScore += 10;
  visualBalanceScore = Math.max(0, Math.min(100, visualBalanceScore));

  // Overall quality
  const overallQuality = Math.round(
    readabilityScore * 0.25 +
    typographyScore * 0.25 +
    structureScore * 0.3 +
    visualBalanceScore * 0.2
  );

  // Breakdown
  const breakdown: AnalyticsBreakdown[] = [
    {
      category: "Readability",
      score: readabilityScore,
      label: readabilityGrade,
      suggestion: readabilityScore < 50 ? "Simplify sentences and use shorter words" : undefined,
    },
    {
      category: "Typography",
      score: typographyScore,
      label: typographyScore >= 80 ? "Excellent" : typographyScore >= 60 ? "Good" : "Needs work",
      suggestion: hasSkippedLevels ? "Fix heading hierarchy (don't skip levels)" : undefined,
    },
    {
      category: "Structure",
      score: structureScore,
      label: structureScore >= 80 ? "Well-structured" : structureScore >= 60 ? "Adequate" : "Weak",
      suggestion: headings < 2 ? "Add more headings to organize content" : undefined,
    },
    {
      category: "Visual Balance",
      score: visualBalanceScore,
      label: visualBalanceScore >= 80 ? "Balanced" : visualBalanceScore >= 60 ? "Fair" : "Imbalanced",
      suggestion: visualBalanceScore < 60 ? "Add visual breaks (images, blockquotes, rules)" : undefined,
    },
  ];

  return {
    readabilityScore,
    readabilityGrade,
    typographyScore,
    structureScore,
    visualBalanceScore,
    overallQuality,
    metrics: {
      wordCount,
      sentenceCount,
      paragraphCount,
      avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
      avgSyllablesPerWord: Math.round(avgSyllablesPerWord * 100) / 100,
      readingTimeMinutes,
      headingsRatio: Math.round(headingsRatio * 10) / 10,
      contentDensity: Math.round(contentDensity),
      codeToTextRatio: Math.round(codeToTextRatio * 100) / 100,
    },
    breakdown,
  };
}
