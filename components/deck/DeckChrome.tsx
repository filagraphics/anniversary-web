"use client";

import { motion, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MusicPlayer from "../MusicPlayer";
import { useDeck, type SlideMeta } from "./DeckContext";

/** The quiet controls floating over every slide: music, progress, previous / next. */
export default function DeckChrome({ slides }: { slides: SlideMeta[] }) {
  const { active, total, go, next, prev, scrollX, width } = useDeck();
  const current = slides[active] ?? slides[0];
  const dark = current.tone === "dark";
  const progress = useTransform(() => {
    const w = width.get() || 1;
    return Math.min(1, Math.max(0, scrollX.get() / (w * Math.max(1, total - 1))));
  });

  const button = `grid size-11 place-items-center rounded-full border backdrop-blur-md transition-colors duration-500 disabled:pointer-events-none disabled:opacity-0 ${
    dark
      ? "border-paper/25 bg-night/30 text-paper hover:bg-paper hover:text-ink"
      : "border-ink/15 bg-paper/70 text-ink hover:bg-ink hover:text-paper"
  }`;

  return (
    <>
      {/* Thin progress line along the top edge. */}
      <motion.div
        aria-hidden
        style={{ scaleX: progress }}
        className={`fixed inset-x-0 top-0 z-50 h-[2px] origin-left transition-colors duration-500 ${dark ? "bg-[#f3d9cf]/80" : "bg-rose-deep/70"}`}
      />

      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] transition-colors duration-500 sm:gap-6 sm:px-8 sm:pb-6 ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        <div className="pointer-events-auto">
          <MusicPlayer tone={current.tone} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
          <p aria-live="polite" className="max-w-full truncate text-[0.6rem] uppercase tracking-[0.28em] opacity-80 sm:text-[0.65rem]">
            <span className="tabular-nums">
              {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </p>
          {/* Desktop: one tick per page, grouped by chapter. */}
          <div className="pointer-events-auto hidden items-center sm:flex">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to page ${i + 1}: ${slide.label}`}
                aria-current={i === active ? "step" : undefined}
                className={`group grid h-6 place-items-center px-[3px] ${i > 0 && slides[i - 1].group !== slide.group ? "ml-2.5" : ""}`}
              >
                <span
                  className={`block h-[3px] rounded-full bg-current transition-all duration-500 ${
                    i === active ? "w-7 opacity-100" : "w-2.5 opacity-30 group-hover:opacity-70"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button type="button" onClick={prev} disabled={active === 0} aria-label="Previous page" className={button}>
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={next}
            disabled={active === total - 1}
            aria-label="Next page"
            className={`${button} relative`}
          >
            {active === 0 && (
              <span aria-hidden className="absolute inset-0 animate-ping rounded-full border border-current opacity-40" />
            )}
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>
    </>
  );
}
