"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { closing, site } from "@/data/messages";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";
import Motes from "./Motes";
import { ease } from "@/lib/motion";
import Star from "../ui/Star";

/** The last page of the book. */
export default function ClosingSlide({ image }: { image: string }) {
  const { seen, go, near } = useSlide();
  const imageX = useParallax(0.3);

  return (
    <div className="grain relative isolate flex h-full flex-col items-center justify-center bg-night px-6 pb-24 text-center text-paper">
      <motion.div aria-hidden style={{ x: imageX }} className="absolute inset-y-0 -inset-x-[30%] -z-20">
        <motion.div
          className="size-full"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={seen ? { opacity: 0.4, scale: 1 } : undefined}
          transition={{ duration: 3, ease }}
        >
          <SafeImage src={image} alt="" loading={near ? "eager" : "lazy"} className="size-full object-cover" fallbackClassName="size-full !bg-night" />
        </motion.div>
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(31_27_26/0.3)_0%,rgb(31_27_26/0.9)_80%)]" />
      <Motes />

      <motion.span
        aria-hidden
        initial={{ opacity: 0, scale: 0.6 }}
        animate={seen ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 1.2, delay: 0.3 }}
        className="font-serif text-2xl text-rose"
      >
        ✦
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={seen ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.4, delay: 0.5, ease }}
        className="mt-6 max-w-3xl font-serif text-[2.3rem] leading-[1.1] italic sm:text-6xl [@media(max-height:760px)]:mt-3 [@media(max-height:760px)]:sm:text-5xl"
      >
        {closing.line}
      </motion.h2>

      {/* An empty glass frame, waiting: the night sea shows through it. */}
      <motion.figure
        initial={{ opacity: 0, y: 30, rotate: 8, scale: 0.94 }}
        animate={seen ? { opacity: 1, y: 0, rotate: -2.5, scale: 1 } : undefined}
        transition={{ duration: 1.6, delay: 1.1, ease }}
        className="relative mt-10 [@media(max-height:760px)]:mt-6 w-[44vw] max-w-[210px] [@media(max-height:820px)]:max-w-[165px] [@media(max-height:740px)]:max-w-[140px]"
      >
        {/* Soft golden halo. */}
        <motion.span
          aria-hidden
          animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -inset-[20%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(243_220_166/0.28),transparent)] blur-2xl"
        />
        {/* Twinkles on the corners. */}
        {[
          "-top-2 -left-2",
          "-top-3 -right-1.5",
          "-bottom-2 -left-1.5",
          "-right-2 -bottom-3",
        ].map((pos, k) => (
          <Star key={k} delay={k * 0.7} className={`z-20 size-3.5 ${pos}`} />
        ))}
        <span aria-hidden className="absolute -top-2.5 left-1/2 z-10 h-4 w-14 -translate-x-1/2 -rotate-[4deg] bg-[#e8c98f]/45 backdrop-blur-[2px]" />

        {/* Thin shimmering gold border around a clear window. */}
        <span className="relative block p-[1.5px] shadow-[0_0_40px_-8px_rgb(243_220_166/0.45)]">
          {/* The gold border: a gradient masked down to just its edge, so the window stays clear. */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 animate-sheen bg-[linear-gradient(110deg,#c9a25e_0%,#f7e7bd_22%,#d4ad69_45%,#fff3d1_60%,#c9a25e_80%,#f7e7bd_100%)] bg-[length:200%_auto] p-[1.5px]"
            style={{
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            }}
          />
          <span className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-[linear-gradient(160deg,rgb(255_255_255/0.10),rgb(255_255_255/0.02)_45%,rgb(243_220_166/0.08))] backdrop-blur-[1.5px]">
            <span aria-hidden className="absolute inset-2.5 border border-dashed border-[#e8c98f]/45" />
            {/* A slow light sweep across the glass. */}
            <motion.span
              aria-hidden
              initial={{ x: "-130%" }}
              animate={{ x: ["-130%", "130%"] }}
              transition={{ duration: 2.6, delay: 2.4, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            />
            <motion.svg
              aria-hidden
              viewBox="0 0 48 32"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 text-[#f3dca6] drop-shadow-[0_0_10px_rgb(243_220_166/0.8)] sm:w-14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="18" cy="17" r="10" />
              <circle cx="30" cy="17" r="10" />
              <path d="M30 4.5l2.5-3 2.5 3-2.5 2.5z" fill="currentColor" />
            </motion.svg>
          </span>
        </span>
        <figcaption className="gold-sheen mt-3 font-hand text-xl leading-none sm:text-2xl">{closing.frameNote}</figcaption>
      </motion.figure>
      <motion.div
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 1.8 }}
        className="mt-10 flex flex-col items-center gap-6 [@media(max-height:760px)]:mt-6 [@media(max-height:760px)]:gap-4"
      >
        <button
          type="button"
          onClick={() => go(0)}
          className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-paper/35 bg-paper/10 px-7 text-sm tracking-wide backdrop-blur-sm transition-colors hover:bg-paper hover:text-ink"
        >
          <RotateCcw aria-hidden className="size-4 transition-transform duration-500 group-hover:-rotate-180" />
          Turn back to the first page
        </button>
        <div className="text-xs text-paper/50">
          <p className="font-serif text-sm text-paper/70 italic">{site.title}</p>
          <p className="mt-1">{closing.note}</p>
        </div>
      </motion.div>
    </div>
  );
}
