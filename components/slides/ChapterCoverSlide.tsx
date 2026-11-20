"use client";

import { motion } from "framer-motion";
import { Gem } from "lucide-react";
import { asset } from "@/lib/asset";
import type { Chapter } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";
import CoverClips from "./CoverClips";
import { CoverSparkles, PhotoGlint } from "./CoverSparkle";
import KeepsakePrint from "./KeepsakePrint";
import { ease } from "@/lib/motion";
import GoldDivider from "../ui/GoldDivider";

/** Where the words sit, so each chapter opening can feel different. */
const layouts = {
  left: {
    wrap: "items-end justify-start text-left",
    block: "",
    chips: "",
    overlay: "bg-gradient-to-t from-night/90 via-night/30 to-night/10 md:bg-gradient-to-tr",
    numeral: "top-[4%] right-[4%] text-[42vh]",
  },
  right: {
    wrap: "items-end justify-start text-left md:justify-end md:text-right",
    block: "md:ml-auto md:max-w-md",
    chips: "md:justify-end",
    overlay: "bg-gradient-to-t from-night/90 via-night/30 to-night/10 md:bg-gradient-to-tl md:from-night/85 md:via-night/25 md:to-transparent",
    numeral: "bottom-[3%] left-[3%] text-[34vh]",
  },
  topRight: {
    wrap: "items-end justify-start text-left md:items-start md:justify-end md:pt-24 md:text-right",
    block: "md:ml-auto",
    chips: "md:justify-end",
    overlay: "bg-gradient-to-t from-night/85 via-night/30 to-night/40 md:bg-gradient-to-bl md:from-night/80 md:via-night/30 md:to-night/10",
    numeral: "top-[6%] left-[4%] text-[38vh]",
  },
  center: {
    wrap: "items-end justify-center text-center md:items-center",
    block: "mx-auto",
    chips: "justify-center",
    overlay: "bg-night/55",
    numeral: "top-[4%] left-1/2 -translate-x-1/2 text-[40vh]",
  },
} as const;

const defaultLayout = { paper: "left", light: "topRight", dark: "center" } as const;

export default function ChapterCoverSlide({ chapter }: { chapter: Chapter }) {
  const { seen, near } = useSlide();
  const imageX = useParallax(0.22);
  const numeralX = useParallax(-0.45);
  const panelX = useParallax(0.1);

  // Photos whose shape fights the screen get a blurred copy plus a sharp panel:
  // portrait photos -> side panel on wide screens; wide photos -> band on tall screens.
  const shape = chapter.coverBlur ? (chapter.coverShape ?? "portrait") : null;
  const layoutKey = chapter.coverAlign ?? defaultLayout[chapter.theme];
  const layout = layouts[layoutKey];
  const celebrate = chapter.celebrate;
  const glint = celebrate?.glint;
  /** Wide covers also drop the tags on shorter laptop screens. */
  const chipsShort = shape === "wide" ? "[@media(min-aspect-ratio:1/1)_and_(max-height:799px)]:hidden" : "";

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: seen ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease },
  });

  return (
    <div className="grain relative isolate h-full overflow-hidden bg-night text-paper">
      {/* Full-bleed background: sharp photo, or its blurred glow where the shape doesn't fit. */}
      <motion.div
        aria-hidden
        style={{ x: imageX }}
        className={`absolute inset-y-0 -inset-x-[22%] -z-20 ${
          shape === "portrait" ? `[@media(max-aspect-ratio:1/1)]:bottom-[14%] [@media(max-aspect-ratio:1/1)]:[mask-image:linear-gradient(to_bottom,black_78%,transparent)]` : ""
        }`}
      >
        <motion.div
          className="relative size-full"
          initial={{ scale: 1.12 }}
          animate={seen ? { scale: 1 } : undefined}
          transition={{ duration: 2.4, ease }}
        >
          {shape === "wide" ? (
            <SafeImage
              src={chapter.coverBlur!}
              alt=""
              loading={near ? "eager" : "lazy"}
              className="size-full object-cover"
              fallbackClassName="size-full !bg-night"
            />
          ) : shape ? (
            <>
              <picture>
                <source media="(min-aspect-ratio: 1/1)" srcSet={asset(chapter.coverBlur!)} />
                <img
                  src={asset(chapter.cover)}
                  alt=""
                  loading={near ? "eager" : "lazy"}
                  className="size-full object-cover"
                  style={{ objectPosition: chapter.coverPosition }}
                />
              </picture>
              {/* Tall screens show the sharp photo here, so the glint goes here too. */}
              {glint && (
                <div className="absolute inset-0 hidden [@media(max-aspect-ratio:1/1)]:block">
                  <PhotoGlint {...glint} />
                </div>
              )}
            </>
          ) : (
            <SafeImage
              src={chapter.cover}
              alt=""
              loading={near ? "eager" : "lazy"}
              className="size-full object-cover"
              style={{ objectPosition: chapter.coverPosition }}
              fallbackClassName="size-full !bg-night"
            />
          )}
        </motion.div>
      </motion.div>

      {/* Wide screens + portrait photo: the sharp photo as a side panel, melting into its glow. */}
      {shape === "portrait" && (
        <motion.div
          aria-hidden
          style={{ x: panelX }}
          initial={{ opacity: 0 }}
          animate={seen ? { opacity: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.2 }}
          className={`pointer-events-none absolute inset-y-0 -z-10 hidden w-[54vw] max-w-[820px] [@media(min-aspect-ratio:1/1)]:block ${
            layoutKey === "topRight" || layoutKey === "right"
              ? "left-0 [mask-image:linear-gradient(to_left,transparent,black_28%,black_92%,transparent)]"
              : "right-0 [mask-image:linear-gradient(to_right,transparent,black_28%,black_92%,transparent)]"
          }`}
        >
          <SafeImage
            src={chapter.cover}
            alt=""
            loading={near ? "eager" : "lazy"}
            className="size-full object-cover"
            style={{ objectPosition: chapter.coverPosition }}
            fallbackClassName="size-full !bg-transparent"
          />
          {glint && <PhotoGlint {...glint} />}
        </motion.div>
      )}

      {/* Wide screens + wide photo: a large sharp panel beside the words, fading into its glow. */}
      {shape === "wide" && (
        <motion.div
          aria-hidden
          style={{ x: panelX }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={seen ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.2, ease }}
          className={`pointer-events-none absolute top-[2%] bottom-[2%] -z-10 hidden w-[78vw] [mask-composite:intersect] [@media(min-aspect-ratio:1/1)]:block ${
            layoutKey === "right"
              ? "left-0 [mask-image:linear-gradient(to_left,transparent,black_18%),linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
              : "right-0 [mask-image:linear-gradient(to_right,transparent,black_18%),linear-gradient(to_bottom,transparent,black_8%,black_92%,transparent)]"
          }`}
        >
          <SafeImage
            src={chapter.cover}
            alt=""
            loading={near ? "eager" : "lazy"}
            className="size-full object-cover"
            style={{ objectPosition: chapter.coverPosition }}
            fallbackClassName="size-full !bg-transparent"
          />
        </motion.div>
      )}

      {/* Tall screens + wide photo: the sharp photo as a band across the top. */}
      {shape === "wide" && (
        <motion.div
          aria-hidden
          style={{ x: panelX }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={seen ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.6, delay: 0.2, ease }}
          className={`pointer-events-none absolute inset-x-0 top-[16%] -z-10 hidden h-[36%] [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_82%,transparent)] [@media(max-aspect-ratio:1/1)]:block`}
        >
          <SafeImage
            src={chapter.cover}
            alt=""
            loading={near ? "eager" : "lazy"}
            className="size-full object-cover"
            style={{ objectPosition: chapter.coverPosition }}
            fallbackClassName="size-full !bg-transparent"
          />
        </motion.div>
      )}

      <div aria-hidden className={`absolute inset-0 -z-10 ${layout.overlay}`} />

      {celebrate && <CoverSparkles />}

      {/* Oversized chapter numeral drifting at a different speed. */}
      <motion.span
        aria-hidden
        style={{ x: numeralX }}
        className={`pointer-events-none absolute font-serif leading-none text-transparent italic select-none [-webkit-text-stroke:1px_rgb(248_245_240/0.35)] ${layout.numeral}`}
      >
        {chapter.number}
      </motion.span>

      {chapter.coverClips && (
        <CoverClips
          clips={chapter.coverClips}
          photo={shape === "portrait" && (layoutKey === "topRight" || layoutKey === "right") ? "left" : "right"}
        />
      )}

      {chapter.keepsake && (
        <KeepsakePrint
          keepsake={chapter.keepsake}
          chapter={chapter.id}
          placement={chapter.coverClips ? "low" : layoutKey === "right" ? "corner" : "seam"}
        />
      )}

      <div className={`relative flex h-full px-6 pt-16 pb-32 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:pb-[6.5rem] [@media(max-aspect-ratio:1/1)_and_(max-height:700px)]:pb-24 sm:px-12 sm:pb-36 lg:px-20 ${layout.wrap}`}>
        <div className={`max-w-xl ${layout.block}`}>
          {celebrate && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={seen ? { opacity: 1, scale: 1 } : undefined}
              transition={{ duration: 1.2, delay: 0.05, ease }}
              className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-[#e8c98f]/55 bg-night/35 px-4 py-1.5 shadow-[0_0_28px_-6px_rgb(232_201_143/0.55)] backdrop-blur-sm"
            >
              <Gem className="size-4 text-[#f3dca6]" strokeWidth={1.6} aria-hidden />
              <span className="gold-sheen font-serif text-base italic tracking-wide sm:text-lg">{celebrate.badge}</span>
              {celebrate.badgeAm && (
                <>
                  <span aria-hidden className="text-[#e8c98f]/60">·</span>
                  <span lang="am" className="gold-sheen font-amharic text-sm sm:text-base">
                    {celebrate.badgeAm}
                  </span>
                </>
              )}
            </motion.p>
          )}
          <motion.p {...item(0.2)} className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-paper/80">
            Chapter {chapter.number} · <span lang="am" className="font-amharic tracking-[0.12em]">ምዕራፍ {chapter.number}</span>
            {chapter.period && <> · {chapter.period}</>}
          </motion.p>
          <motion.h2 {...item(0.35)} className="mt-3 font-serif text-[2.6rem] [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:text-[2.15rem] [@media(max-aspect-ratio:1/1)_and_(max-height:700px)]:text-[1.85rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {chapter.title}
          </motion.h2>
          {chapter.titleAm && (
            <motion.p {...item(0.45)} lang="am" className="mt-2 font-amharic text-lg text-[#f3d9cf]/90 sm:text-2xl">
              {chapter.titleAm}
            </motion.p>
          )}
          {celebrate && (
            <motion.div {...item(0.5)} aria-hidden className={`mt-4 flex items-center gap-3 ${layoutKey === "center" ? "justify-center" : ""}`}>
              <GoldDivider />
            </motion.div>
          )}
          <motion.p
            {...item(0.55)}
            className={`mt-4 font-hand text-[1.65rem] leading-snug [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:mt-2.5 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:text-[1.35rem] [@media(max-aspect-ratio:1/1)_and_(max-height:700px)]:text-[1.15rem] sm:text-3xl ${celebrate ? "gold-sheen" : "text-[#f3d9cf]"}`}
          >
            “{chapter.caption}”
          </motion.p>
          <motion.p
            {...item(0.75)}
            className={`mt-4 hidden text-[0.95rem] leading-relaxed text-paper/80 sm:text-base ${
              shape === "wide"
                ? "" // the photo needs the room: description stays on other pages
                : shape === "portrait"
                  ? `[@media(min-aspect-ratio:1/1)]:block`
                  : "[@media(min-height:720px)]:block"
            }`}
          >
            {chapter.description}
          </motion.p>
          <motion.ul
            {...item(0.9)}
            className={`mt-5 flex flex-wrap gap-2 [@media(max-aspect-ratio:1/1)]:mt-4 [@media(max-aspect-ratio:1/1)]:gap-1.5 ${layout.chips} ${chipsShort}`}
            aria-label="In this chapter"
          >
            {chapter.highlights.map((h) => (
              <li key={h} className="rounded-full border border-paper/25 bg-night/20 px-3 py-1 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:px-2.5 [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:py-0.5 text-[0.7rem] [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:text-[0.64rem] tracking-wide text-paper/85 backdrop-blur-sm">
                {h}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
