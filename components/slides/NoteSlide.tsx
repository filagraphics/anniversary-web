"use client";

import { motion } from "framer-motion";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";
import Motes from "./Motes";

/** A quiet, handwritten page between chapters and the rest of the book. */
export default function NoteSlide({ eyebrow, note, image }: { eyebrow: string; note: string; image: string }) {
  const { seen, near } = useSlide();
  const imageX = useParallax(0.3);
  const words = note.split(" ");

  return (
    <div className="grain relative isolate flex h-full items-center justify-center bg-night px-6 pb-20 text-paper">
      <motion.div aria-hidden style={{ x: imageX }} className="absolute inset-y-0 -inset-x-[30%] -z-20 opacity-45">
        <SafeImage src={image} alt="" loading={near ? "eager" : "lazy"} className="size-full object-cover" fallbackClassName="size-full !bg-night" />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-night/70 via-night/50 to-night/90" />
      <Motes />

      <div className="max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={seen ? { opacity: 1 } : undefined}
          transition={{ duration: 1 }}
          className="text-[0.66rem] uppercase tracking-[0.32em] text-rose"
        >
          {eyebrow}
        </motion.p>
        <p className="mt-8 font-hand text-[2.3rem] leading-[1.2] text-paper/95 sm:text-5xl lg:text-6xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block pr-[0.25em]"
              initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={seen ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.09 }}
            >
              {word}
            </motion.span>
          ))}
        </p>
      </div>
    </div>
  );
}
