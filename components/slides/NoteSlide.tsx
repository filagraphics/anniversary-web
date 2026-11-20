"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { ease } from "@/lib/motion";
import { useParallax, useSlide } from "../deck/DeckContext";
import GoldDivider from "../ui/GoldDivider";
import SafeImage from "../ui/SafeImage";
import Star from "../ui/Star";
import Motes from "./Motes";

/**
 * A quiet, handwritten page between chapters and the rest of the book.
 * The photo fills the page, drifting slowly, its neon glowing. The note sits
 * over a soft shade: on the left on wide screens, at the top on phones, so
 * the words never cover faces.
 */
export default function NoteSlide({
  eyebrow,
  note,
  image,
  position,
}: {
  eyebrow: string;
  note: string;
  image: string;
  /** CSS object-position for the photo, to keep faces in view. */
  position?: string;
}) {
  const { seen, near, reduce } = useSlide();
  const glowX = useParallax(0.08);
  const textX = useParallax(-0.1);
  const words = note.split(" ");
  const objectPosition = position ?? "50% 55%";
  /** Wide screens: shift the picture so the two of you sit right of the words. */
  const wideObjectPosition = "50% 55%";

  return (
    <div className="grain relative isolate h-full overflow-hidden bg-night text-paper">
      {/* The photo fills the whole page, drifting slowly. */}
      <motion.div aria-hidden style={{ x: glowX }} className="absolute inset-0 -z-30 [@media(min-aspect-ratio:1/1)]:-left-[6%] [@media(min-aspect-ratio:1/1)]:-right-[34%]">
        <motion.div
          className="size-full origin-[60%_45%] [@media(min-aspect-ratio:1/1)]:origin-[48%_40%]"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={seen ? { opacity: 1, scale: [1, 1.05, 1] } : undefined}
          transition={{ opacity: { duration: 2 }, scale: { duration: 24, repeat: Infinity, ease: "easeInOut" } }}
        >
          <SafeImage
            src={image}
            alt=""
            loading={near ? "eager" : "lazy"}
            style={{ "--pos": objectPosition, "--pos-wide": wideObjectPosition } as CSSProperties}
            className="size-full object-cover object-[var(--pos)] [@media(min-aspect-ratio:1/1)]:object-[var(--pos-wide)]"
            fallbackClassName="size-full !bg-night"
          />
        </motion.div>
        {/* The neon sign breathing a soft pink glow. */}
        <motion.span
          animate={reduce ? undefined : { opacity: [0.25, 0.6, 0.25] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-[22%] left-[5%] h-[26%] w-[90%] [@media(min-aspect-ratio:1/1)]:top-[18%] [@media(min-aspect-ratio:1/1)]:left-[34%] [@media(min-aspect-ratio:1/1)]:h-[38%] [@media(min-aspect-ratio:1/1)]:w-[42%] rounded-full bg-[radial-gradient(closest-side,rgb(255_200_235/0.6),transparent)] mix-blend-screen blur-2xl"
        />
      </motion.div>
      {/* Shade behind the words (top on phones, left on wide screens), and a soft vignette. */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-gradient-to-b from-night/90 via-night/60 via-35% to-transparent to-60% [@media(min-aspect-ratio:1/1)]:bg-gradient-to-r [@media(min-aspect-ratio:1/1)]:via-night/55 [@media(min-aspect-ratio:1/1)]:via-40% [@media(min-aspect-ratio:1/1)]:to-65%" />
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_55%_70%,transparent_40%,rgb(31_27_26/0.5))] [@media(min-aspect-ratio:1/1)]:bg-[radial-gradient(ellipse_at_65%_55%,transparent_45%,rgb(31_27_26/0.55))]" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-20 h-1/4 bg-gradient-to-t from-night/70 to-transparent" />
      {/* Twinkles scattered over the picture. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {[
          ["left-[58%] top-[14%]", 14, 0],
          ["left-[86%] top-[24%]", 10, 1.1],
          ["left-[48%] top-[62%]", 9, 2.2],
          ["left-[92%] top-[70%]", 13, 0.6],
          ["left-[72%] top-[8%]", 8, 1.8],
        ].map(([pos, size, delay], n) => (
          <Star key={n} delay={delay as number} className={pos as string} style={{ width: size as number, height: size as number }} />
        ))}
      </div>

      <Motes />

      {/* The words */}
      <div
        className="relative mx-auto flex h-full max-w-6xl flex-col items-center px-6 pt-16 pb-24 text-center [@media(min-aspect-ratio:1/1)]:justify-center [@media(min-aspect-ratio:1/1)]:items-start [@media(min-aspect-ratio:1/1)]:px-12 [@media(min-aspect-ratio:1/1)]:pt-0 [@media(min-aspect-ratio:1/1)]:text-left lg:px-16"
      >
        <motion.div style={{ x: textX }} className="relative max-w-xl [@media(min-aspect-ratio:1/1)]:max-w-[38%]">
          <Star delay={0} className="-top-6 -left-2 hidden size-4 [@media(min-aspect-ratio:1/1)]:block" />
          <Star delay={1.3} className="-right-4 -bottom-4 hidden size-3 [@media(min-aspect-ratio:1/1)]:block" />
          <motion.p
            initial={{ opacity: 0 }}
            animate={seen ? { opacity: 1 } : undefined}
            transition={{ duration: 1 }}
            className="text-[0.66rem] uppercase tracking-[0.32em] text-rose"
          >
            {eyebrow}
          </motion.p>
          <motion.div
            aria-hidden
            initial={{ opacity: 0, scaleX: 0 }}
            animate={seen ? { opacity: 1, scaleX: 1 } : undefined}
            transition={{ duration: 1.2, delay: 0.3, ease }}
            className="mt-4 flex items-center justify-center gap-3 [@media(min-aspect-ratio:1/1)]:origin-left [@media(min-aspect-ratio:1/1)]:justify-start"
          >
            <GoldDivider />
          </motion.div>
          <p
            className="mt-5 font-hand text-[1.8rem] leading-[1.2] text-paper/95 sm:text-4xl [@media(min-aspect-ratio:1/1)]:mt-6 [@media(min-aspect-ratio:1/1)]:text-4xl lg:text-5xl"
          >
            {words.map((word, i) => (
              <motion.span
                key={i}
                className="inline-block pr-[0.25em]"
                initial={{ opacity: 0, y: 8, filter: "blur(6px)" }}
                animate={seen ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.09 }}
              >
                {word}
              </motion.span>
            ))}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
