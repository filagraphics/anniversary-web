"use client";

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import type { Chapter, Memory } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import PhotoLightbox from "../PhotoLightbox";
import SafeImage from "../ui/SafeImage";

const ease = [0.22, 1, 0.36, 1] as const;
const areas = ["a", "b", "c", "d"];
const tilts = [-2.2, 1.8, -1.2, 2.4];
const depths = [0.05, 0.16, 0.1, 0.22];
const tapes = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6"];

const surfaces = {
  paper: "paper-texture text-ink",
  light: "bg-white text-ink",
  dark: "grain bg-night text-paper",
} as const;

type Props = {
  chapter: Chapter;
  /** Photos on this spread. */
  memories: Memory[];
  /** All photos of the chapter, so the lightbox can browse the whole chapter. */
  chapterMemories: Memory[];
  spread: number;
  spreads: number;
};

function Print({
  memory,
  i,
  dark,
  onOpen,
}: {
  memory: Memory;
  i: number;
  dark: boolean;
  onOpen: () => void;
}) {
  const { seen, near } = useSlide();
  const x = useParallax(depths[i % 4]);
  const tilt = tilts[i % 4];

  return (
    <motion.div
      style={{ x, gridArea: areas[i] }}
      initial={{ opacity: 0, y: 50, rotate: tilt * 3, scale: 0.94 }}
      animate={seen ? { opacity: 1, y: 0, rotate: tilt, scale: 1 } : undefined}
      whileHover={{ rotate: 0, scale: 1.015, transition: { duration: 0.4 } }}
      transition={{ duration: 1.1, delay: 0.15 + i * 0.13, ease }}
      className="relative min-h-0 min-w-0"
    >
      {/* A strip of tape holding the print to the page. */}
      <span
        aria-hidden
        className={`absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 sm:h-6 sm:w-20 ${tapes[i % 4]} ${
          dark ? "bg-paper/25" : "bg-rose/35"
        } backdrop-blur-[1px]`}
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open photo: ${memory.title}`}
        className={`group flex size-full flex-col p-1.5 pb-0 shadow-lift sm:p-2.5 sm:pb-0 ${dark ? "bg-[#f4efe8]" : "bg-white"}`}
      >
        <span className="relative block min-h-0 w-full flex-1 overflow-hidden bg-cream">
          <SafeImage
            src={memory.thumbnail ?? memory.image}
            alt={memory.alt ?? memory.title}
            loading={near ? "eager" : "lazy"}
            draggable={false}
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
            fallbackClassName="absolute inset-0 size-full"
          />
          <span
            aria-hidden
            className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <Maximize2 className="size-3.5" />
          </span>
        </span>
        <span className="flex w-full items-baseline justify-between gap-2 px-1 py-1.5 text-left text-ink sm:py-2.5">
          <span className="truncate font-hand text-lg leading-none sm:text-2xl">{memory.title}</span>
          <span className="hidden shrink-0 text-[0.6rem] uppercase tracking-[0.18em] text-mocha-deep lg:inline">
            {memory.date}
          </span>
        </span>
      </button>
    </motion.div>
  );
}

/** A scrapbook page: two to four prints taped down, each with its own parallax depth. */
export default function SpreadSlide({ chapter, memories, chapterMemories, spread, spreads }: Props) {
  const { seen } = useSlide();
  const [open, setOpen] = useState<number | null>(null);
  const dark = chapter.theme === "dark";
  const ghostX = useParallax(-0.4);

  return (
    <div className={`relative isolate h-full ${surfaces[chapter.theme]}`}>
      <motion.span
        aria-hidden
        style={{ x: ghostX }}
        className={`pointer-events-none absolute right-[-0.05em] bottom-[-0.2em] -z-10 font-serif text-[46vh] leading-none italic select-none ${
          dark ? "text-paper/[0.04]" : "text-mocha/[0.07]"
        }`}
      >
        {chapter.number}
      </motion.span>

      <motion.header
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : undefined}
        transition={{ duration: 1 }}
        className="absolute inset-x-5 top-5 flex items-baseline justify-between gap-4 sm:inset-x-10 sm:top-7"
      >
        <h2 className={`truncate text-[0.66rem] font-medium uppercase tracking-[0.3em] ${dark ? "text-rose" : "text-mocha-deep"}`}>
          <span className="hidden sm:inline">Chapter </span>
          {chapter.number} <span className="opacity-50">·</span> {chapter.title}
          {chapter.titleAm && (
            <span lang="am" className="ml-2 hidden font-amharic normal-case tracking-normal opacity-70 md:inline">
              {chapter.titleAm}
            </span>
          )}
        </h2>
        <span className={`shrink-0 font-hand text-xl ${dark ? "text-paper/60" : "text-mocha-deep"}`}>
          page {spread} of {spreads}
        </span>
      </motion.header>

      <div className="absolute inset-x-5 top-16 bottom-[6.5rem] sm:inset-x-10 sm:top-20 sm:bottom-32">
        <div className={`spread spread-${memories.length} mx-auto max-w-6xl`}>
          {memories.map((memory, i) => (
            <Print
              key={memory.id}
              memory={memory}
              i={i}
              dark={dark}
              onOpen={() => setOpen(chapterMemories.findIndex((m) => m.id === memory.id))}
            />
          ))}
        </div>
      </div>

      <PhotoLightbox memories={chapterMemories} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </div>
  );
}
