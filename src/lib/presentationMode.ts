/**
 * Presentation Mode
 * Converts markdown into cinematic fullscreen slides.
 * Splits content at H1/H2/--- boundaries into individual slides with
 * smooth transitions and keynote-style typography.
 */

export interface Slide {
  id: number;
  type: "title" | "content" | "quote" | "code" | "image" | "split";
  heading?: string;
  content: string;
  rawMarkdown: string;
}

/**
 * Parse markdown into presentation slides
 * Split rules:
 * - H1 creates a new title slide
 * - H2 creates a new content slide
 * - --- creates a manual slide break
 */
export function parseSlides(markdown: string): Slide[] {
  const lines = markdown.split("\n");
  const slides: Slide[] = [];
  let currentSlide: { heading?: string; lines: string[] } = { lines: [] };
  let slideId = 0;

  const pushSlide = () => {
    const raw = currentSlide.lines.join("\n").trim();
    if (raw || currentSlide.heading) {
      const type = detectSlideType(currentSlide.heading, raw);
      slides.push({
        id: slideId++,
        type,
        heading: currentSlide.heading,
        content: raw,
        rawMarkdown: (currentSlide.heading ? `# ${currentSlide.heading}\n\n` : "") + raw,
      });
    }
    currentSlide = { lines: [] };
  };

  for (const line of lines) {
    // H1 → new title slide
    if (/^#\s+/.test(line)) {
      pushSlide();
      currentSlide.heading = line.replace(/^#\s+/, "");
    }
    // H2 → new content slide
    else if (/^##\s+/.test(line)) {
      pushSlide();
      currentSlide.heading = line.replace(/^##\s+/, "");
    }
    // --- → manual break
    else if (/^---+$/.test(line.trim())) {
      pushSlide();
    }
    else {
      currentSlide.lines.push(line);
    }
  }

  pushSlide();

  // If no slides were created, make one from entire content
  if (slides.length === 0 && markdown.trim()) {
    slides.push({
      id: 0,
      type: "content",
      content: markdown.trim(),
      rawMarkdown: markdown.trim(),
    });
  }

  return slides;
}

function detectSlideType(heading: string | undefined, content: string): Slide["type"] {
  // Title slide: heading with minimal or no content
  if (heading && content.length < 100) return "title";
  // Quote slide: primarily blockquotes
  if (/^>\s/m.test(content) && content.split("\n").filter(l => l.startsWith(">")).length > content.split("\n").length * 0.5) return "quote";
  // Code slide: primarily code
  if (/```/.test(content)) return "code";
  // Image slide: has images
  if (/!\[.*?\]\(.*?\)/.test(content)) return "image";
  // Content slide (default)
  return "content";
}

/**
 * Get slide transition CSS class names
 */
export function getSlideTransition(direction: "next" | "prev"): string {
  return direction === "next" ? "slide-enter-next" : "slide-enter-prev";
}

/**
 * Generate presentation CSS
 */
export function getPresentationCSS(): string {
  return `
    .presentation-container {
      position: fixed;
      inset: 0;
      z-index: 10000;
      background: #0a0a1a;
      overflow: hidden;
    }

    .slide {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 4rem 8rem;
      opacity: 0;
      transform: translateX(100px);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .slide.active {
      opacity: 1;
      transform: translateX(0);
    }

    .slide.prev {
      opacity: 0;
      transform: translateX(-100px);
    }

    .slide-title {
      text-align: center;
    }

    .slide-title h1 {
      font-size: 4rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1.5rem;
    }

    .slide-title .subtitle {
      font-size: 1.5rem;
      color: #64748b;
      font-weight: 300;
      max-width: 600px;
    }

    .slide-content {
      max-width: 900px;
      width: 100%;
    }

    .slide-content h2 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 2rem;
      letter-spacing: -0.02em;
    }

    .slide-content p {
      font-size: 1.4rem;
      line-height: 1.8;
      color: #cbd5e1;
      margin-bottom: 1rem;
    }

    .slide-content ul, .slide-content ol {
      font-size: 1.3rem;
      color: #cbd5e1;
      padding-left: 2rem;
    }

    .slide-content li {
      margin-bottom: 0.75rem;
      line-height: 1.6;
    }

    .slide-content code {
      background: rgba(99, 102, 241, 0.15);
      color: #a5b4fc;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .slide-content pre {
      background: #1e1e3a;
      border: 1px solid #2d2d5e;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      font-size: 1.1rem;
      overflow-x: auto;
      margin: 1.5rem 0;
      width: 100%;
    }

    .slide-content pre code {
      background: none;
      color: #e2e8f0;
      padding: 0;
    }

    .slide-content blockquote {
      border-left: 4px solid #6366f1;
      padding: 1rem 2rem;
      font-size: 1.6rem;
      font-style: italic;
      color: #94a3b8;
      margin: 2rem 0;
    }

    .slide-content img {
      max-width: 100%;
      max-height: 60vh;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    .slide-counter {
      position: fixed;
      bottom: 2rem;
      right: 3rem;
      font-size: 0.85rem;
      color: #475569;
      font-family: monospace;
      z-index: 10001;
    }

    .slide-progress {
      position: fixed;
      bottom: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      transition: width 0.4s ease-out;
      z-index: 10001;
    }

    .slide-nav {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.5rem;
      z-index: 10001;
    }

    .slide-nav button {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #334155;
      background: #1e293b;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .slide-nav button:hover {
      background: #334155;
      color: #ffffff;
    }

    .slide-exit {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 10001;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      border: 1px solid #334155;
      background: #1e293b;
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      opacity: 0.5;
    }

    .slide-exit:hover {
      opacity: 1;
      background: #334155;
      color: #ffffff;
    }

    @media (max-width: 768px) {
      .slide { padding: 2rem 1.5rem; }
      .slide-title h1 { font-size: 2.5rem; }
      .slide-content h2 { font-size: 1.75rem; }
      .slide-content p { font-size: 1.1rem; }
    }
  `;
}
