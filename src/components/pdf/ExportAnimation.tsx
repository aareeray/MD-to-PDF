"use client";

import { useEffect, useState } from "react";
import { FileText, Sparkles, Check } from "lucide-react";

interface ExportAnimationProps {
  isExporting: boolean;
  progress: number; // 0-100
  isComplete: boolean;
  onAnimationEnd?: () => void;
}

export function ExportAnimation({
  isExporting,
  progress,
  isComplete,
  onAnimationEnd,
}: ExportAnimationProps) {
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        setShowComplete(true);
        setTimeout(() => {
          onAnimationEnd?.();
        }, 1500);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowComplete(false);
    }
  }, [isComplete, onAnimationEnd]);

  if (!isExporting && !isComplete) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md animate-fade-in" />

      {/* Main animation container */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-slide-up">
        {/* Floating pages */}
        <div className="relative w-48 h-64">
          {/* Background pages */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transform rotate-[-6deg] translate-x-2 translate-y-2 opacity-40"
            style={{ animation: "floatPage 3s ease-in-out infinite" }}
          />
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transform rotate-[-3deg] translate-x-1 translate-y-1 opacity-60"
            style={{ animation: "floatPage 3s ease-in-out infinite 0.2s" }}
          />
          
          {/* Main page */}
          <div
            className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            style={{ animation: "floatPage 3s ease-in-out infinite 0.4s" }}
          >
            {/* Content lines */}
            <div className="p-5 space-y-2.5">
              <div className="h-3 w-2/3 bg-gray-800 dark:bg-gray-200 rounded animate-pulse" />
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded mt-4" style={{ animationDelay: "0.1s" }} />
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded" style={{ animationDelay: "0.2s" }} />
              <div className="h-1.5 w-4/5 bg-gray-200 dark:bg-gray-700 rounded" style={{ animationDelay: "0.3s" }} />
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded" style={{ animationDelay: "0.4s" }} />
              <div className="h-2.5 w-1/2 bg-gray-700 dark:bg-gray-300 rounded mt-4" />
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded mt-3" />
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-1.5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="mt-3 p-2 rounded bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                <div className="h-1.5 w-full bg-blue-200 dark:bg-blue-900 rounded" />
                <div className="h-1.5 w-3/5 bg-blue-200 dark:bg-blue-900 rounded mt-1.5" />
              </div>
            </div>

            {/* Progress sweep */}
            {!isComplete && (
              <div
                className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"
                style={{
                  height: `${progress}%`,
                  transition: "height 0.3s ease-out",
                }}
              />
            )}

            {/* Complete overlay */}
            {showComplete && (
              <div className="absolute inset-0 bg-green-500/10 flex items-center justify-center animate-fade-in">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
                  <Check size={32} className="text-white" strokeWidth={3} />
                </div>
              </div>
            )}
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-blue-500/10 rounded-2xl blur-2xl animate-pulse-glow" />
        </div>

        {/* Progress ring */}
        {!isComplete && (
          <div className="relative">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 28}`}
                strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                className="transition-all duration-300 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold">{Math.round(progress)}%</span>
            </div>
          </div>
        )}

        {/* Status text */}
        <div className="text-center">
          {!isComplete ? (
            <>
              <div className="flex items-center gap-2 text-lg font-semibold">
                <Sparkles size={18} className="text-blue-400 animate-pulse" />
                <span>Generating PDF</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                {progress < 30
                  ? "Rendering typography..."
                  : progress < 60
                  ? "Applying layout engine..."
                  : progress < 90
                  ? "Finalizing pages..."
                  : "Almost done..."}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-lg font-semibold text-green-500">
                <Check size={18} />
                <span>PDF Generated!</span>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Your document is ready to download
              </p>
            </>
          )}
        </div>
      </div>

      {/* Floating sparkle particles */}
      {!isComplete && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animation: `sparkleFloat ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes floatPage {
          0%, 100% { transform: translateY(0px) rotate(var(--rotation, 0deg)); }
          50% { transform: translateY(-8px) rotate(var(--rotation, 0deg)); }
        }
        @keyframes sparkleFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0; }
          25% { opacity: 0.8; }
          50% { transform: translateY(-30px) scale(1.5); opacity: 0.4; }
          100% { transform: translateY(-60px) scale(0.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
