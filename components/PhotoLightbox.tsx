"use client";

import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useIsClient } from "@/lib/useIsClient";
import { createPortal } from "react-dom";
import { asset } from "@/lib/asset";
import type { Memory } from "@/lib/types";
import SafeImage from "./ui/SafeImage";

type Props = {
  memories: Memory[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

export default function PhotoLightbox({ memories, index, onClose, onNavigate }: Props) {
  const isClient = useIsClient();
  const [direction, setDirection] = useState(0);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const memory = open ? memories[index] : null;
  const count = memories.length;

  const go = useCallback(
    (step: number) => {
      if (index === null || count < 2) return;
      setDirection(step);
      onNavigate((index + step + count) % count);
    },
    [index, count, onNavigate],
  );

  // Keyboard navigation, scroll lock, focus management.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        // Keep focus inside the dialog.
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.({ preventScroll: true });
    };
  }, [open, onClose, go]);

  // Preload neighbouring photographs for snappy navigation.
  useEffect(() => {
    if (index === null || count < 2) return;
    [index + 1, index - 1].forEach((i) => {
      const m = memories[(i + count) % count];
      const img = new Image();
      img.src = asset(m.image);
    });
  }, [index, count, memories]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) go(1);
    else if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) go(-1);
  };

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {memory && index !== null && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Photo ${index + 1} of ${count}: ${memory.title}`}
          className="fixed inset-0 z-[70] flex flex-col bg-night/95 text-paper backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6">
            <span className="text-xs tracking-[0.25em] text-paper/60" aria-live="polite">
              {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20"
              aria-label="Close photo viewer"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-2 sm:px-20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={memory.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 80, scale: 0.98 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d: number) => ({ opacity: 0, x: d * -80, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                drag={count > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={onDragEnd}
                className="flex size-full touch-pan-y items-center justify-center"
              >
                <SafeImage
                  src={memory.image}
                  alt={memory.alt ?? memory.title}
                  draggable={false}
                  className="max-h-full max-w-full rounded-lg object-contain shadow-2xl select-none"
                  fallbackClassName="aspect-[4/3] w-full max-w-2xl rounded-lg !bg-paper/10 !text-paper/70"
                />
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-3 hidden size-12 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20 sm:grid"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-3 hidden size-12 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20 sm:grid"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          <div className="shrink-0 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-2xl text-center"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.25em] text-rose">{memory.date}</p>
                <h3 className="mt-1 font-serif text-xl sm:text-2xl">{memory.title}</h3>
                <p className="mt-1 font-hand text-xl text-paper/75 sm:text-2xl">{memory.caption}</p>
              </motion.div>
            </AnimatePresence>

            {count > 1 && (
              <div className="mt-4 flex items-center justify-center gap-6 sm:hidden">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="grid size-12 place-items-center rounded-full bg-paper/10 active:bg-paper/25"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <span className="text-[0.65rem] uppercase tracking-[0.25em] text-paper/50">Swipe</span>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="grid size-12 place-items-center rounded-full bg-paper/10 active:bg-paper/25"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-6" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
