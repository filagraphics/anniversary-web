"use client";

import { motion } from "framer-motion";
import type { Chapter } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";

const ease = [0.22, 1, 0.36, 1] as const;

/** Composition per chapter, so each opening feels different. */
const layouts = {
  paper: { wrap: "items-end justify-start text-left", block: "", chips: "" },
  light: {
    wrap: "items-end justify-start text-left md:items-start md:justify-end md:pt-24 md:text-right",
    block: "md:ml-auto",
    chips: "md:justify-end",
  },
  dark: { wrap: "items-end justify-center text-center md:items-center", block: "mx-auto", chips: "justify-center" },
} as const;

export default function ChapterCoverSlide({ chapter }: { chapter: Chapter }) {
  const { seen, near } = useSlide();
  const imageX = useParallax(0.22);
  const numeralX = useParallax(-0.45);
  const layout = layouts[chapter.theme];

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: seen ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease },
  });

  return (
    <div className="grain relative isolate h-full overflow-hidden bg-night text-paper">
      <motion.div aria-hidden style={{ x: imageX }} className="absolute inset-y-0 -inset-x-[22%] -z-20">
        <motion.div
          className="size-full"
          initial={{ scale: 1.12 }}
          animate={seen ? { scale: 1 } : undefined}
          transition={{ duration: 2.4, ease }}
        >
          <SafeImage
            src={chapter.cover}
            alt=""
            loading={near ? "eager" : "lazy"}
            className="size-full object-cover"
            fallbackClassName="size-full !bg-night"
          />
        </motion.div>
      </motion.div>
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 ${
          chapter.theme === "light"
            ? "bg-gradient-to-t from-night/85 via-night/30 to-night/40 md:bg-gradient-to-bl md:from-night/80 md:via-night/30 md:to-night/10"
            : chapter.theme === "dark"
              ? "bg-night/55"
              : "bg-gradient-to-t from-night/90 via-night/30 to-night/10 md:bg-gradient-to-tr"
        }`}
      />

      {/* Oversized chapter numeral drifting at a different speed. */}
      <motion.span
        aria-hidden
        style={{ x: numeralX }}
        className={`pointer-events-none absolute font-serif leading-none text-transparent italic select-none [-webkit-text-stroke:1px_rgb(248_245_240/0.35)] ${
          chapter.theme === "light"
            ? "top-[6%] left-[4%] text-[38vh]"
            : chapter.theme === "dark"
              ? "top-[4%] left-1/2 -translate-x-1/2 text-[40vh]"
              : "top-[4%] right-[4%] text-[42vh]"
        }`}
      >
        {chapter.number}
      </motion.span>

      <div className={`relative flex h-full px-6 pt-16 pb-32 sm:px-12 sm:pb-36 lg:px-20 ${layout.wrap}`}>
        <div className={`max-w-xl ${layout.block}`}>
          <motion.p {...item(0.2)} className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-paper/80">
            Chapter {chapter.number} · <span lang="am" className="font-amharic tracking-[0.12em]">ምዕራፍ {chapter.number}</span> ·{" "}
            {chapter.period}
          </motion.p>
          <motion.h2 {...item(0.35)} className="mt-3 font-serif text-[2.6rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {chapter.title}
          </motion.h2>
          {chapter.titleAm && (
            <motion.p {...item(0.45)} lang="am" className="mt-2 font-amharic text-lg text-[#f3d9cf]/90 sm:text-2xl">
              {chapter.titleAm}
            </motion.p>
          )}
          <motion.p {...item(0.55)} className="mt-4 font-hand text-[1.65rem] leading-snug text-[#f3d9cf] sm:text-3xl">
            “{chapter.caption}”
          </motion.p>
          <motion.p
            {...item(0.75)}
            className="mt-4 hidden text-[0.95rem] leading-relaxed text-paper/80 [@media(min-height:720px)]:block sm:text-base"
          >
            {chapter.description}
          </motion.p>
          <motion.ul {...item(0.9)} className={`mt-5 flex flex-wrap gap-2 ${layout.chips}`} aria-label="In this chapter">
            {chapter.highlights.map((h) => (
              <li key={h} className="rounded-full border border-paper/25 bg-night/20 px-3 py-1 text-[0.7rem] tracking-wide text-paper/85 backdrop-blur-sm">
                {h}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
