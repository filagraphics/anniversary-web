"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/data/messages";
import { asset } from "@/lib/asset";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";
import IntroClip from "./IntroClip";
import Motes from "./Motes";

const ease = [0.22, 1, 0.36, 1] as const;
const words = hero.title.split(" ");

/** The cover of the book: your photo as a taped print, glowing on its own colours. */
export default function IntroSlide() {
  const { next } = useSlide();
  const glowX = useParallax(0.4);
  const printX = useParallax(0.22);
  const textX = useParallax(-0.12);

  return (
    <div className="grain relative isolate h-full overflow-hidden bg-night text-paper">
      {/* The same photo, deeply blurred, becomes the ambient light of the page. */}
      <motion.div aria-hidden style={{ x: glowX }} className="absolute inset-y-0 -inset-x-[40%] -z-20">
        <motion.img
          src={asset(hero.imageBlur)}
          alt=""
          initial={{ scale: 1.35, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ duration: 3, ease }}
          className="size-full object-cover"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_60%_40%,rgb(48_28_36/0.35)_0%,rgb(31_27_26/0.82)_70%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-night/40 via-transparent to-night/80" />
      <Motes />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-6 px-6 pt-8 pb-28 md:flex-row-reverse md:gap-14 md:pb-24 lg:gap-20">
        {/* The print */}
        <motion.div style={{ x: printX }} className="relative shrink-0">
          <motion.figure
            initial={{ opacity: 0, y: -40, rotate: -9, scale: 1.08 }}
            animate={{ opacity: 1, y: 0, rotate: 2.5, scale: 1 }}
            transition={{ duration: 1.6, delay: 0.3, ease }}
            whileHover={{ rotate: 0, scale: 1.015 }}
            className="relative bg-[#fbf7f1] p-2 pb-0 shadow-[0_40px_90px_-30px_rgb(255_120_190/0.55),0_20px_40px_-20px_rgb(0_0_0/0.6)] sm:p-3 sm:pb-0"
          >
            <span aria-hidden className="absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 bg-rose/45 backdrop-blur-[1px]" />
            <span aria-hidden className="absolute -right-4 -bottom-2 z-10 hidden h-6 w-16 rotate-[38deg] bg-rose/35 sm:block" />
            <SafeImage
              src={hero.image}
              alt={hero.imageAlt}
              fetchPriority="high"
              className="block h-[29dvh] w-auto max-w-[78vw] object-cover [@media(min-height:760px)]:h-[34dvh] [@media(min-height:860px)]:h-[38dvh] md:h-[62dvh] md:max-w-[42vw] [@media(min-height:760px)]:md:h-[62dvh]"
              fallbackClassName="h-[40dvh] w-[70vw] md:h-[62dvh] md:w-[34vw]"
            />
            <figcaption className="flex items-baseline justify-between px-1 py-2 text-ink sm:py-3">
              <span className="font-hand text-xl leading-none sm:text-2xl">{hero.imageNote}</span>
              <span className="font-amharic text-xs text-mocha-deep sm:text-sm">{hero.ctaAm}</span>
            </figcaption>
          </motion.figure>
          {hero.video && <IntroClip clip={hero.video} />}
        </motion.div>

        {/* The words */}
        <motion.div style={{ x: textX }} className="max-w-xl text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="mb-5 hidden text-[0.66rem] font-medium uppercase leading-relaxed tracking-[0.3em] text-paper/75 sm:block"
          >
            {hero.eyebrow}
          </motion.p>

          <h1 className="font-serif text-[2.7rem] leading-[0.98] tracking-tight sm:text-6xl lg:text-[5.2rem]">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1.5 align-bottom">
                <motion.span
                  className={`inline-block ${i === words.length - 1 ? "italic text-[#f6cfe0]" : "pr-[0.22em]"}`}
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.8 + i * 0.12, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.9 }}
            className="mt-4 sm:mt-6"
          >
            <p className="font-hand text-[1.6rem] leading-tight text-paper/90 sm:text-3xl">{hero.subtitle}</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.1, ease }}
            className="mt-5 hidden max-w-md text-base leading-relaxed text-paper/75 md:block"
          >
            {hero.supporting}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.3, ease }}
            className="mt-6 flex flex-col items-center gap-3 sm:mt-8 md:items-start"
          >
            <button
              type="button"
              onClick={next}
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/40 bg-paper/10 px-5 py-3 text-[0.82rem] tracking-wide whitespace-nowrap sm:gap-3 sm:px-6 sm:text-sm text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-paper hover:text-ink"
            >
              {hero.cta}
              <span aria-hidden className="hidden opacity-40 min-[380px]:inline">·</span>
              <span lang="am" className="hidden font-amharic min-[380px]:inline">{hero.ctaAm}</span>
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <span className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-paper/55">
              Swipe to turn the page
              <span aria-hidden className="relative h-px w-10 overflow-hidden bg-paper/25">
                <motion.span
                  className="absolute inset-y-0 left-0 w-1/2 bg-paper"
                  animate={{ x: ["-100%", "220%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
