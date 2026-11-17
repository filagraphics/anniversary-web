"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { chapters } from "@/data/chapters";
import { sections } from "@/data/messages";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";

const ease = [0.22, 1, 0.36, 1] as const;

/** "Six years, three chapters" — the timeline, with a jump to each chapter. */
export default function JourneySlide({ targets }: { targets: Record<string, number> }) {
  const { seen, go, near } = useSlide();
  const ghostX = useParallax(-0.3);
  const copy = sections.journey;

  return (
    <div className="paper-texture relative h-full text-ink">
      <motion.span
        aria-hidden
        style={{ x: ghostX }}
        className="pointer-events-none absolute -bottom-[0.18em] -left-[0.04em] font-serif text-[42vh] leading-none text-mocha/[0.06] italic select-none"
      >
        six
      </motion.span>

      <div className="no-scrollbar relative h-full overflow-y-auto overscroll-y-contain [mask-image:linear-gradient(to_bottom,black_calc(100%-7.5rem),transparent_calc(100%-4rem))] px-5 pt-14 pb-32 sm:px-10 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={seen ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-mocha-deep">
            {copy.eyebrow} <span className="opacity-50">·</span>{" "}
            <span lang="am" className="font-amharic text-xs tracking-[0.1em]">{copy.eyebrowAm}</span>
          </p>
          <h2 className="mt-3 font-serif text-[2.2rem] leading-[1.05] tracking-tight sm:text-5xl">{copy.title}</h2>
          <p className="mt-4 hidden text-base leading-relaxed text-ink/70 min-[400px]:block sm:text-lg">{copy.intro}</p>
        </motion.div>

        <ol className="relative mx-auto mt-10 grid max-w-5xl gap-7 md:mt-14 md:grid-cols-3 md:gap-10">
          {/* The thread connecting the chapters. */}
          <motion.span
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={seen ? { scaleY: 1 } : undefined}
            transition={{ duration: 1.4, delay: 0.3, ease }}
            className="absolute top-3 bottom-3 left-[47px] w-px origin-top bg-rose/70 md:hidden"
          />
          <motion.span
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={seen ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.4, delay: 0.3, ease }}
            className="absolute top-[14px] right-[16%] left-[16%] hidden h-px origin-left bg-rose/70 md:block"
          />

          {chapters.map((chapter, i) => (
            <motion.li
              key={chapter.id}
              initial={{ opacity: 0, y: 28 }}
              animate={seen ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.9, delay: 0.35 + i * 0.15, ease }}
              className="relative grid grid-cols-[96px_1fr] items-center gap-4 md:block md:text-center"
            >
              <span aria-hidden className="absolute top-1/2 left-[40px] z-10 hidden md:static md:mx-auto md:mb-6 md:grid md:size-[29px] md:place-items-center md:rounded-full md:border md:border-rose/60 md:bg-paper">
                <span className="size-2.5 rounded-full bg-rose" />
              </span>
              <button
                type="button"
                onClick={() => go(targets[chapter.id])}
                className="group relative block overflow-hidden rounded-xl bg-white p-1.5 shadow-soft md:mx-auto md:mb-5 md:max-w-[250px] md:p-2"
                style={{ rotate: `${[-2, 1.5, -1][i % 3]}deg` }}
                aria-label={`Open chapter ${chapter.number}: ${chapter.title}`}
              >
                <SafeImage
                  src={chapter.timelineImage}
                  alt=""
                  loading={near ? "eager" : "lazy"}
                  className="aspect-square w-full rounded-md object-cover transition-transform duration-700 group-hover:scale-105 md:aspect-[4/3]"
                />
              </button>
              <div>
                <p className="text-[0.66rem] font-medium uppercase tracking-[0.26em] text-mocha-deep">
                  Chapter {chapter.number} · {chapter.period}
                </p>
                <h3 className="mt-1 font-serif text-[1.45rem] leading-tight sm:text-[1.7rem]">{chapter.milestone}</h3>
                {chapter.titleAm && (
                  <p lang="am" className="mt-0.5 font-amharic text-sm text-rose-deep">{chapter.titleAm}</p>
                )}
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70 md:mx-auto md:max-w-[260px] md:text-[0.95rem]">
                  {chapter.timelineNote}
                </p>
                <button
                  type="button"
                  onClick={() => go(targets[chapter.id])}
                  className="mt-1 inline-flex min-h-10 items-center gap-2 text-sm text-mocha-deep underline-offset-4 hover:text-ink hover:underline"
                >
                  Open chapter
                  <ArrowRight aria-hidden className="size-3.5" />
                </button>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
