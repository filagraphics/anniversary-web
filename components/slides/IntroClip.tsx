"use client";

import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import type { CoverClip } from "@/lib/types";
import { useSlide } from "../deck/DeckContext";
import { ClipViewer } from "./CoverClips";

const ease = [0.22, 1, 0.36, 1] as const;
const STAR = "M0 -10 C1.2 -2.4 2.4 -1.2 10 0 C2.4 1.2 1.2 2.4 0 10 C-1.2 2.4 -2.4 1.2 -10 0 C-2.4 -1.2 -1.2 -2.4 0 -10Z";

/** Little gold stars twinkling around the clip (fixed spots, relative to it). */
const stars = [
  { left: "-14%", top: "8%", size: 14, delay: 0 },
  { left: "104%", top: "18%", size: 11, delay: 0.9 },
  { left: "-10%", top: "62%", size: 9, delay: 1.7 },
  { left: "100%", top: "74%", size: 15, delay: 0.4 },
  { left: "44%", top: "-9%", size: 10, delay: 2.2 },
];

/**
 * The cover clip: a gold-framed video print tucked against the corner of the
 * cover photo. It glows, floats and twinkles, and plays silently on a loop
 * while the cover is on screen. Tap to see it large.
 */
export default function IntroClip({ clip }: { clip: CoverClip }) {
  const { isActive, reduce } = useSlide();
  const ref = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [isActive]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 40, y: 30, rotate: 18, scale: 0.85 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: -6, scale: 1 }}
        transition={{ duration: 1.6, delay: 1.2, ease }}
        className="absolute -right-[12%] -bottom-[9%] z-20 w-[34%] min-w-[96px] md:-right-[15%] md:-bottom-[8%] md:w-[42%] md:max-w-[250px]"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          {/* A soft pink-gold halo breathing behind the print. */}
          <motion.span
            aria-hidden
            animate={reduce ? undefined : { opacity: [0.45, 0.9, 0.45], scale: [0.95, 1.06, 0.95] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute -inset-[22%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(243_220_166/0.55),rgb(246_207_224/0.3)_55%,transparent)] blur-xl"
          />

          {stars.map((s, i) => (
            <svg
              key={i}
              aria-hidden
              viewBox="-10 -10 20 20"
              className="pointer-events-none absolute animate-twinkle"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                filter: "drop-shadow(0 0 6px rgb(240 210 150 / 0.9))",
              }}
            >
              <path d={STAR} fill="#f7e7bd" />
            </svg>
          ))}

          <motion.button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={`Open video: ${clip.title}`}
            whileHover={{ rotate: 4, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="group relative block w-full text-left"
          >
            {/* Gold frame with a slow travelling sheen. */}
            <span className="block animate-sheen bg-[linear-gradient(110deg,#c9a25e_0%,#f7e7bd_22%,#d4ad69_45%,#fff3d1_60%,#c9a25e_80%,#f7e7bd_100%)] bg-[length:200%_auto] p-[3px] shadow-[0_30px_60px_-20px_rgb(255_120_190/0.6),0_14px_28px_-12px_rgb(0_0_0/0.7)]">
              <span className="block bg-[#fbf7f1] p-1 pb-0 sm:p-1.5 sm:pb-0">
                <span className="relative block aspect-[9/16] overflow-hidden bg-night">
                  <video
                    ref={ref}
                    src={asset(clip.src)}
                    poster={asset(clip.poster)}
                    muted
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    aria-hidden
                    className="absolute inset-0 size-full scale-[1.03] object-cover"
                  />
                  <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/25 via-transparent to-transparent" />
                  <span
                    aria-hidden
                    className="absolute right-1 bottom-1 grid size-6 place-items-center rounded-full bg-night/55 text-paper opacity-80 backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:size-7"
                  >
                    <Expand className="size-3 sm:size-3.5" />
                  </span>
                </span>
                <span className="flex items-center gap-1 px-0.5 py-1.5 sm:gap-1.5 sm:py-2">
                  <span aria-hidden className="relative flex size-1.5 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#d4ad69] opacity-70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-[#c9a25e]" />
                  </span>
                  <span className="truncate font-hand text-[0.74rem] leading-none text-ink sm:text-lg lg:text-xl">{clip.title}</span>
                </span>
              </span>
            </span>
          </motion.button>

          {/* A strip of gold tape across the top corner. */}
          <span aria-hidden className="absolute -top-2 -left-3 z-10 h-4 w-12 -rotate-[28deg] bg-[#e8c98f]/60 backdrop-blur-[1px] sm:h-5 sm:w-16" />
        </motion.div>
      </motion.div>

      <ClipViewer clip={open ? clip : null} onClose={close} />
    </>
  );
}
