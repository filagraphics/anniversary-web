"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { closing, site } from "@/data/messages";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";
import Motes from "./Motes";

const ease = [0.22, 1, 0.36, 1] as const;

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
        className="mt-6 max-w-3xl font-serif text-[2.3rem] leading-[1.1] italic sm:text-6xl"
      >
        {closing.line}
      </motion.h2>
      <motion.p
        lang="am"
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : undefined}
        transition={{ duration: 1.4, delay: 1 }}
        className="mt-5 font-amharic text-lg text-[#f3d9cf] sm:text-2xl"
      >
        {closing.lineAm}
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : undefined}
        transition={{ duration: 1.2, delay: 1.4 }}
        className="mt-12 flex flex-col items-center gap-6"
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
