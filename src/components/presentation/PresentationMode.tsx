"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseSlides, getPresentationCSS, Slide } from "@/lib/presentationMode";

interface PresentationModeProps {
  content: string;
  onExit: () => void;
}

export function PresentationView({ content, onExit }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = useMemo(() => parseSlides(content), [content]);

  const goNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        goNext();
      }
      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goPrev();
      }
      if (e.key === "Escape") {
        onExit();
      }
      // Number keys for quick jump
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= slides.length) {
        setCurrentSlide(num - 1);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, onExit, slides.length]);

  // Touch/click navigation
  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).closest(".presentation-container")?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x > rect.width * 0.6) goNext();
    else if (x < rect.width * 0.4) goPrev();
  };

  const progress = slides.length > 1 ? ((currentSlide) / (slides.length - 1)) * 100 : 100;

  return (
    <div className="presentation-container" onClick={handleClick}>
      <style dangerouslySetInnerHTML={{ __html: getPresentationCSS() }} />

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`slide ${
            index === currentSlide ? "active" : index < currentSlide ? "prev" : ""
          } ${slide.type === "title" ? "slide-title" : "slide-content"}`}
        >
          {slide.type === "title" ? (
            <>
              <h1>{slide.heading}</h1>
              {slide.content && (
                <div className="subtitle">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {slide.content}
                  </ReactMarkdown>
                </div>
              )}
            </>
          ) : (
            <>
              {slide.heading && <h2>{slide.heading}</h2>}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {slide.content}
              </ReactMarkdown>
            </>
          )}
        </div>
      ))}

      {/* Progress bar */}
      <div className="slide-progress" style={{ width: `${progress}%` }} />

      {/* Slide counter */}
      <div className="slide-counter">
        {currentSlide + 1} / {slides.length}
      </div>

      {/* Navigation */}
      <div className="slide-nav">
        <button onClick={(e) => { e.stopPropagation(); goPrev(); }} disabled={currentSlide === 0}>
          <ChevronLeft size={16} />
        </button>
        <button onClick={(e) => { e.stopPropagation(); goNext(); }} disabled={currentSlide === slides.length - 1}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Exit button */}
      <button className="slide-exit" onClick={(e) => { e.stopPropagation(); onExit(); }}>
        <X size={16} />
      </button>
    </div>
  );
}
