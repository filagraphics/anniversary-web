"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { asset } from "@/lib/asset";
import type { Chapter, Memory } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import PhotoLightbox from "../PhotoLightbox";
import TapedPrint from "./TapedPrint";

const ease = [0.22, 1, 0.36, 1] as const;

/** Where companion prints sit on wide screens: right of the photo, then left. */
const companionSpots = [
  "[@media(min-aspect-ratio:1/1)]:top-[38%] [@media(min-aspect-ratio:1/1)]:right-[6%]",
  "[@media(min-aspect-ratio:1/1)]:top-[22%] [@media(min-aspect-ratio:1/1)]:left-[6%]",
];

/**
 * A single, very special photograph on its own page. The first time you
 * arrive, it slowly "develops" like an instant photo.
 */
export default function FeaturedPhotoSlide({
  chapter,
  memory,
  chapterMemories,
}: {
  chapter: Chapter;
  memory: Memory;
  chapterMemories: Memory[];
}) {
  const { seen, near, reduce } = useSlide();
  const [open, setOpen] = useState<number | null>(null);
  const [companionOpen, setCompanionOpen] = useState<number | null>(null);
  const companionX = useParallax(0.3);
  const companions = memory.companions ?? [];
  const [developed, setDeveloped] = useState(false);
  const [failed, setFailed] = useState(false);
  const printX = useParallax(0.18);
  const noteX = useParallax(-0.25);
  const dark = chapter.theme === "dark";

  return (
    <div
      className={`relative isolate flex h-full flex-col items-center justify-center gap-5 px-5 pt-10 pb-28 sm:gap-7 ${
        dark ? "grain bg-night text-paper" : "paper-texture text-ink"
      }`}
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : undefined}
        transition={{ duration: 1 }}
        className={`text-[0.66rem] font-medium uppercase tracking-[0.3em] ${dark ? "text-rose" : "text-mocha-deep"}`}
      >
        Chapter {chapter.number} · <span lang="am" className="font-amharic tracking-[0.12em]">ምዕራፍ {chapter.number}</span>
      </motion.p>

      {/* The print */}
      <motion.div style={{ x: printX }}>
        <motion.div
          initial={{ opacity: 0, y: 60, rotate: 6, scale: 0.92 }}
          animate={seen ? { opacity: 1, y: 0, rotate: -1.8, scale: 1 } : undefined}
          transition={{ duration: 1.4, ease }}
          whileHover={{ rotate: 0, scale: 1.01 }}
          className="relative"
        >
          <span aria-hidden className="absolute -top-3 -left-5 z-10 h-6 w-24 -rotate-[32deg] bg-rose/40" />
          <span aria-hidden className="absolute -top-3 -right-5 z-10 h-6 w-24 rotate-[32deg] bg-rose/40" />
          <button
            type="button"
            onClick={() => setOpen(0)}
            aria-label={`Open photo: ${memory.title}`}
            className="group block bg-[#fdfaf5] p-2.5 pb-14 shadow-[0_30px_70px_-25px_rgb(48_42_40/0.55)] sm:p-4 sm:pb-20"
          >
            <span className="relative block aspect-[4/3] w-[min(84vw,calc(46dvh*4/3))] overflow-hidden bg-[#e9e2d6] md:w-[min(62vw,calc(54dvh*4/3))]">
              {failed ? (
                <span className="absolute inset-0 grid place-items-center text-sm text-mocha-deep">Photo unavailable</span>
              ) : (
                <motion.img
                  src={asset(memory.image)}
                  alt={memory.alt ?? memory.title}
                  loading={near ? "eager" : "lazy"}
                  draggable={false}
                  onError={() => setFailed(true)}
                  initial={
                    reduce
                      ? false
                      : { filter: "grayscale(1) brightness(1.9) contrast(0.35) blur(6px)", opacity: 0.35 }
                  }
                  animate={seen ? { filter: "grayscale(0) brightness(1) contrast(1) blur(0px)", opacity: 1 } : undefined}
                  transition={{ duration: 4.2, delay: 0.9, ease: "easeOut" }}
                  onAnimationComplete={() => seen && setDeveloped(true)}
                  className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.03]"
                />
              )}
              <AnimatePresence>
                {seen && !developed && !reduce && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-night/45 px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-paper/90 backdrop-blur-sm"
                  >
                    developing…
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                aria-hidden
                className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              >
                <Maximize2 className="size-3.5" />
              </span>
            </span>
            {/* Handwriting on the white strip at the bottom of the print. */}
            <span className="absolute inset-x-4 bottom-2.5 flex items-baseline justify-between gap-3 sm:inset-x-6 sm:bottom-5">
              <motion.span
                initial={{ opacity: 0 }}
                animate={seen ? { opacity: 1 } : undefined}
                transition={{ duration: 1.2, delay: 2.4 }}
                className="font-hand text-2xl leading-none text-ink sm:text-4xl"
              >
                {memory.title}
              </motion.span>
              {memory.titleAm && (
                <motion.span
                  lang="am"
                  initial={{ opacity: 0 }}
                  animate={seen ? { opacity: 1 } : undefined}
                  transition={{ duration: 1.2, delay: 3 }}
                  className="font-amharic text-sm text-rose-deep sm:text-lg"
                >
                  {memory.titleAm}
                </motion.span>
              )}
            </span>
          </button>
        </motion.div>
      </motion.div>

      <motion.p
        style={{ x: noteX }}
        initial={{ opacity: 0, y: 10 }}
        animate={seen ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, delay: 3.4, ease }}
        className={`max-w-md text-center font-hand text-[1.6rem] leading-snug sm:text-3xl ${dark ? "text-paper/80" : "text-mocha-deep"}`}
      >
        {memory.caption}
      </motion.p>

      {/* Small companion prints: in a row below the words on phones, either side of the photo on wide screens. */}
      {companions.length > 0 && (
        <div className="flex items-start justify-center gap-5 [@media(max-aspect-ratio:1/1)_and_(max-height:680px)]:hidden [@media(min-aspect-ratio:1/1)]:contents">
          {companions.map((photo, i) => (
            <motion.div
              key={photo.image}
              style={{ x: companionX }}
              className={`relative w-[30vw] max-w-[130px] [@media(min-aspect-ratio:1/1)]:absolute [@media(min-aspect-ratio:1/1)]:w-[15vw] [@media(min-aspect-ratio:1/1)]:max-w-[240px] [@media(min-aspect-ratio:1/1)]:min-w-[150px] ${companionSpots[i % companionSpots.length]}`}
            >
              <TapedPrint photo={photo} tilt={i % 2 ? -5 : 5} delay={2.6 + i * 0.3} position={photo.position} onOpen={() => setCompanionOpen(i)} />
            </motion.div>
          ))}
        </div>
      )}

      <PhotoLightbox memories={chapterMemories} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
      {companions.length > 0 && (
        <PhotoLightbox
          memories={companions.map((photo, i) => ({
            id: `${memory.id}-companion-${i}`,
            chapter: memory.chapter,
            title: photo.title,
            date: memory.date,
            image: photo.image,
            caption: photo.caption,
            category: memory.category,
            alt: photo.alt,
          }))}
          index={companionOpen}
          onClose={() => setCompanionOpen(null)}
          onNavigate={setCompanionOpen}
        />
      )}
    </div>
  );
}
