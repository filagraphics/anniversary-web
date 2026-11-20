"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { hero } from "@/data/messages";
import { asset } from "@/lib/asset";
import { useParallax, useSlide } from "../deck/DeckContext";
import Motes from "./Motes";
import { ease } from "@/lib/motion";
import GoldDivider from "../ui/GoldDivider";

const words = hero.title.split(" ");

/** Small gold corner flourishes for the page frame. */
function Corner({ className }: { className: string }) {
  return (
    <span aria-hidden className={`absolute size-5 border-[#e8c98f]/70 sm:size-7 ${className}`}>
      <span className="absolute size-1.5 rotate-45 bg-[#f3dca6] shadow-[0_0_8px_rgb(243_220_166/0.9)]" />
    </span>
  );
}

/**
 * The cover of the book: the "Great moments" photo as the whole page.
 * Phones: the photo fills the top of the screen, words underneath.
 * Wide screens: the photo, sharp and full height, on the right, melting into
 * a blurred glow of itself that fills the rest of the page behind the words.
 */
export default function IntroSlide() {
  const { next } = useSlide();
  const glowX = useParallax(0.4);
  const photoX = useParallax(0.18);
  const textX = useParallax(-0.12);

  return (
    <div className="grain relative isolate h-full overflow-hidden bg-night text-paper">
      {/* The photo, deeply blurred: the ambient light of the page (wide screens). */}
      <motion.div aria-hidden style={{ x: glowX }} className="absolute inset-y-0 -inset-x-[40%] -z-30">
        <motion.img
          src={asset(hero.imageBlur)}
          alt=""
          initial={{ scale: 1.35, opacity: 0 }}
          animate={{ scale: 1.15, opacity: 1 }}
          transition={{ duration: 3, ease }}
          className="size-full object-cover"
        />
      </motion.div>

      {/* The photo itself, sharp. Top of the screen on phones; full height on the right on wide screens. */}
      <motion.div
        style={{ x: photoX }}
        className="absolute inset-x-0 top-0 -z-20 h-[66%] [mask-image:linear-gradient(to_bottom,black_70%,transparent)] [@media(min-aspect-ratio:1/1)]:bottom-0 [@media(min-aspect-ratio:1/1)]:left-auto [@media(min-aspect-ratio:1/1)]:h-full [@media(min-aspect-ratio:1/1)]:aspect-[1154/1280] [@media(min-aspect-ratio:1/1)]:max-w-[64vw] [@media(min-aspect-ratio:1/1)]:[mask-image:linear-gradient(to_right,transparent,black_30%),linear-gradient(to_bottom,black_80%,transparent)] [@media(min-aspect-ratio:1/1)]:[mask-composite:intersect]"
      >
        <motion.img
          src={asset(hero.image)}
          alt={hero.imageAlt}
          fetchPriority="high"
          initial={{ scale: 1.14, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3.2, ease }}
          className="size-full object-cover object-[46%_22%]"
        />
        {/* A pink neon bloom around the sign. */}
        <motion.span
          aria-hidden
          animate={{ opacity: [0.35, 0.6, 0.35] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute top-[2%] left-[10%] h-[30%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_190_230/0.55),transparent)] mix-blend-screen blur-2xl"
        />
      </motion.div>

      {/* Shade so the words stay readable: from the bottom on phones, from the left on wide screens. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/55 via-45% to-night/10 [@media(min-aspect-ratio:1/1)]:bg-gradient-to-r [@media(min-aspect-ratio:1/1)]:from-night/90 [@media(min-aspect-ratio:1/1)]:via-night/45 [@media(min-aspect-ratio:1/1)]:via-50% [@media(min-aspect-ratio:1/1)]:to-transparent"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgb(31_27_26/0.55))]" />
      <Motes />

      {/* A thin frame around the page with gold corners. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, delay: 0.6, ease }}
        className="pointer-events-none absolute inset-3 border border-paper/15 sm:inset-5"
      >
        <Corner className="-top-px -left-px border-t border-l [&>span]:-top-[3px] [&>span]:-left-[3px]" />
        <Corner className="-top-px -right-px border-t border-r [&>span]:-top-[3px] [&>span]:-right-[3px]" />
        <Corner className="-bottom-px -left-px border-b border-l [&>span]:-bottom-[3px] [&>span]:-left-[3px]" />
        <Corner className="-right-px -bottom-px border-r border-b [&>span]:-right-[3px] [&>span]:-bottom-[3px]" />
      </motion.div>


      {/* The words */}
      <div
        className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-7 pb-32 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:pb-24 sm:px-12 [@media(min-aspect-ratio:1/1)]:justify-center [@media(min-aspect-ratio:1/1)]:pb-20 lg:px-16"
      >
        <motion.div style={{ x: textX }} className="max-w-xl text-center [@media(min-aspect-ratio:1/1)]:max-w-[34rem] [@media(min-aspect-ratio:1/1)]:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease }}
            className="mb-5 hidden text-[0.66rem] font-medium uppercase leading-relaxed tracking-[0.3em] text-paper/80 sm:block"
          >
            {hero.eyebrow}
          </motion.p>

          <h1 className="font-serif text-[2.9rem] [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:text-[2.35rem] leading-[0.98] tracking-tight drop-shadow-[0_4px_24px_rgb(0_0_0/0.45)] sm:text-6xl lg:text-[5.2rem]">
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

          {/* A little gold divider. */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.5, ease }}
            aria-hidden
            className="mt-4 flex items-center justify-center gap-3 [@media(min-aspect-ratio:1/1)]:justify-start"
          >
            <GoldDivider />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.9 }}
            className="mt-4 font-hand text-[1.6rem] leading-tight text-paper/95 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:mt-2 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:text-[1.3rem] sm:text-3xl"
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.1, ease }}
            className="mt-4 hidden max-w-md text-base leading-relaxed text-paper/80 [@media(min-aspect-ratio:1/1)]:md:block"
          >
            {hero.supporting}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.3, ease }}
            className="mt-6 flex flex-col items-center gap-3 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:mt-4 sm:mt-8 [@media(min-aspect-ratio:1/1)]:items-start"
          >
            <button
              type="button"
              onClick={next}
              className="group inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/40 bg-night/30 px-5 py-3 text-[0.82rem] tracking-wide whitespace-nowrap text-paper backdrop-blur-md transition-colors duration-300 hover:bg-paper hover:text-ink sm:gap-3 sm:px-6 sm:text-sm"
            >
              {hero.cta}
              <span aria-hidden className="hidden opacity-40 min-[380px]:inline">·</span>
              <span lang="am" className="hidden font-amharic min-[380px]:inline">{hero.ctaAm}</span>
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <span className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-paper/60 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:hidden">
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
