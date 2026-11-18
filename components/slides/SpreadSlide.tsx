"use client";

import { motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { collageLayout, type CollageFrame } from "@/lib/collage";
import type { Chapter, Memory } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import PhotoLightbox from "../PhotoLightbox";
import SafeImage from "../ui/SafeImage";

const ease = [0.22, 1, 0.36, 1] as const;
const tilts = [-2.2, 1.8, -1.2, 2.4, -1.6, 1.2, -2];
const depths = [0.05, 0.16, 0.1, 0.22, 0.13, 0.19, 0.08];
const tapes = ["-rotate-6", "rotate-3", "-rotate-2", "rotate-6"];

/** Print proportions for phones and for larger screens. */
const frames: Record<"small" | "large", CollageFrame> = {
  small: { pad: 5, caption: 26, gap: 12 },
  large: { pad: 9, caption: 36, gap: 22 },
};

const surfaces = {
  paper: "paper-texture text-ink",
  light: "bg-white text-ink",
  dark: "grain bg-night text-paper",
} as const;

type Props = {
  chapter: Chapter;
  /** Photos on this spread. */
  memories: Memory[];
  /** All photos of the chapter, so the lightbox can browse the whole chapter. */
  chapterMemories: Memory[];
  spread: number;
  spreads: number;
};

function Print({
  memory,
  i,
  dark,
  width,
  height,
  frame,
  onOpen,
}: {
  memory: Memory;
  i: number;
  dark: boolean;
  width: number;
  height: number;
  frame: CollageFrame;
  onOpen: () => void;
}) {
  const { seen, near } = useSlide();
  const x = useParallax(depths[i % depths.length]);
  const tilt = tilts[i % tilts.length];

  return (
    <motion.div
      style={{ x, width, height }}
      initial={{ opacity: 0, y: 50, rotate: tilt * 3, scale: 0.94 }}
      animate={seen ? { opacity: 1, y: 0, rotate: tilt, scale: 1 } : undefined}
      whileHover={{ rotate: 0, scale: 1.015, transition: { duration: 0.4 } }}
      transition={{ duration: 1.1, delay: 0.15 + i * 0.13, ease }}
      className="relative shrink-0"
    >
      {/* A strip of tape holding the print to the page. */}
      <span
        aria-hidden
        className={`absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 sm:h-6 sm:w-20 ${tapes[i % 4]} ${
          dark ? "bg-paper/25" : "bg-rose/35"
        } backdrop-blur-[1px]`}
      />
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open photo: ${memory.title}`}
        style={{ padding: frame.pad, paddingBottom: 0 }}
        className={`group flex size-full flex-col shadow-lift ${dark ? "bg-[#f4efe8]" : "bg-white"}`}
      >
        <span className="relative block min-h-0 w-full flex-1 overflow-hidden bg-cream">
          <SafeImage
            src={memory.thumbnail ?? memory.image}
            alt={memory.alt ?? memory.title}
            loading={near ? "eager" : "lazy"}
            draggable={false}
            style={{ objectPosition: memory.position }}
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.05]"
            fallbackClassName="absolute inset-0 size-full"
          />
          <span
            aria-hidden
            className="absolute top-2 right-2 grid size-8 place-items-center rounded-full bg-paper/85 text-ink opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <Maximize2 className="size-3.5" />
          </span>
        </span>
        <span
          style={{ height: frame.caption }}
          className="flex w-full shrink-0 items-center justify-between gap-2 px-1 text-left text-ink"
        >
          <span
            className={`truncate font-hand leading-none ${
              frame === frames.large ? (width < 210 ? "text-xl" : "text-2xl") : width < 115 ? "text-[0.7rem]" : width < 170 ? "text-[0.8rem]" : "text-[1.05rem]"
            }`}
          >
            {memory.title}
          </span>
          {width > 300 && (
            <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.18em] text-mocha-deep">{memory.date}</span>
          )}
        </span>
      </button>
    </motion.div>
  );
}

/** How far the small prints on a hero page tuck under each other, px (negative = apart). */
const HERO_OVERLAP = 30;
const HERO_APART = -12;
/** Room kept for the heading on a hero page, px. */
const HERO_HEADING = 210;

/**
 * Hero page sizes: the first photo as one big print on the left; the others
 * share one row on the right, under the heading, slightly overlapping.
 */
function heroLayout(aspects: number[], boxW: number, boxH: number, { pad, caption, gap }: CollageFrame) {
  const gutter = gap * 2.5;
  const [a0, ...rest] = aspects;

  let heroPhotoH = boxH - pad - caption;
  let heroW = a0 * heroPhotoH + 2 * pad;
  if (heroW > boxW * 0.46) {
    heroW = boxW * 0.46;
    heroPhotoH = (heroW - 2 * pad) / a0;
  }

  const k = rest.length;
  const sideW = boxW - heroW - gutter;
  const sumA = rest.reduce((s, a) => s + a, 0);
  const byHeight = boxH - HERO_HEADING - pad - caption - 16;
  const fit = (overlap: number) =>
    Math.max(0, Math.min((sideW + overlap * (k - 1) - 2 * pad * k) / sumA, byHeight));
  // Narrow prints don't overlap, so their captions stay readable.
  let overlap = HERO_OVERLAP;
  let ph = fit(overlap);
  if (Math.min(...rest.map((a) => a * ph)) < 200) {
    overlap = HERO_APART;
    ph = fit(overlap);
  }

  return {
    kind: "wide" as const,
    gutter,
    overlap,
    hero: { width: heroW, height: heroPhotoH + pad + caption },
    side: rest.map((a) => ({ width: a * ph + 2 * pad, height: ph + pad + caption })),
  };
}

/** Room kept for the heading on a tall hero page (with / without its note), px. */
const TALL_HEADING = { note: 128, plain: 72 };

/**
 * Hero page on tall screens (phones): heading on top, the first photo as a big
 * print in the middle, the others side by side in one row underneath.
 */
function heroLayoutTall(aspects: number[], boxW: number, boxH: number, { pad, caption, gap }: CollageFrame) {
  const [a0, ...rest] = aspects;
  const showNote = boxH >= 600;
  const heading = showNote ? TALL_HEADING.note : TALL_HEADING.plain;
  const room = boxH - heading;

  // Small row: fill the width, but never take more than about a third of the room.
  const k = rest.length;
  const sumA = rest.reduce((s, a) => s + a, 0);
  const rowGap = gap * 0.75;
  const ph = Math.max(0, Math.min((boxW - 2 * pad * k - rowGap * (k - 1)) / sumA, room * 0.3 - pad - caption));
  const smallH = ph + pad + caption;

  // Hero: whatever height is left, capped by the width.
  let heroPhotoH = room - smallH - gap * 2 - pad - caption;
  let heroW = a0 * heroPhotoH + 2 * pad;
  if (heroW > boxW * 0.86) {
    heroW = boxW * 0.86;
    heroPhotoH = (heroW - 2 * pad) / a0;
  }

  return {
    kind: "tall" as const,
    showNote,
    rowGap,
    hero: { width: heroW, height: Math.max(0, heroPhotoH) + pad + caption },
    side: rest.map((a) => ({ width: a * ph + 2 * pad, height: smallH })),
  };
}

/**
 * A scrapbook page: whole photos (never cropped) taped down as prints, packed
 * into a collage that fills the screen, each with its own parallax depth.
 */
export default function SpreadSlide({ chapter, memories, chapterMemories, spread, spreads }: Props) {
  const { seen } = useSlide();
  const [open, setOpen] = useState<number | null>(null);
  const dark = chapter.theme === "dark";
  const ghostX = useParallax(-0.4);

  // Measure the free area and pack the prints into it.
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const frame = box.w >= 640 ? frames.large : frames.small;
  const rows = useMemo(
    () =>
      collageLayout(
        memories.map((m) => (m.width && m.height ? m.width / m.height : 4 / 3)),
        Math.min(box.w, 1180),
        box.h,
        frame,
      ),
    [memories, box.w, box.h, frame],
  );

  // Pages with a heading become a hero page: side by side on wide screens,
  // stacked on tall ones.
  const page = chapter.spreadPages?.[spread];
  const heroW = Math.min(box.w, 1440);
  const hero = useMemo(() => {
    if (!page || memories.length < 2 || memories.length > 5 || box.w <= 0 || box.h <= 0) return null;
    const aspects = memories.map((m) => (m.width && m.height ? m.width / m.height : 4 / 3));
    return heroW / box.h >= 1.25
      ? heroLayout(aspects, heroW, box.h, frame)
      : heroLayoutTall(aspects, Math.min(box.w, 560), box.h, frame);
  }, [page, memories, heroW, box.w, box.h, frame]);

  const openMemory = (memory: Memory) => setOpen(chapterMemories.findIndex((m) => m.id === memory.id));
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: seen ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1, delay, ease },
  });

  return (
    <div className={`relative isolate h-full ${surfaces[chapter.theme]}`}>
      <motion.span
        aria-hidden
        style={{ x: ghostX }}
        className={`pointer-events-none absolute right-[-0.05em] bottom-[-0.2em] -z-10 font-serif text-[46vh] leading-none italic select-none ${
          dark ? "text-paper/[0.04]" : "text-mocha/[0.07]"
        }`}
      >
        {chapter.number}
      </motion.span>

      <motion.header
        initial={{ opacity: 0 }}
        animate={seen ? { opacity: 1 } : undefined}
        transition={{ duration: 1 }}
        className="absolute inset-x-5 top-5 flex items-baseline justify-between gap-4 sm:inset-x-10 sm:top-7"
      >
        <h2 className={`truncate text-[0.66rem] font-medium uppercase tracking-[0.3em] ${dark ? "text-rose" : "text-mocha-deep"}`}>
          <span className="hidden sm:inline">Chapter </span>
          {chapter.number} <span className="opacity-50">·</span> {chapter.title}
          {chapter.titleAm && (
            <span lang="am" className="ml-2 hidden font-amharic normal-case tracking-normal opacity-70 md:inline">
              {chapter.titleAm}
            </span>
          )}
        </h2>
        <span className={`shrink-0 font-hand text-xl ${dark ? "text-paper/60" : "text-mocha-deep"}`}>
          page {spread} of {spreads}
        </span>
      </motion.header>

      <div
        ref={boxRef}
        style={{ gap: frame.gap }}
        className="absolute inset-x-5 top-16 bottom-[6.5rem] flex flex-col items-center justify-center sm:inset-x-10 sm:top-20 sm:bottom-32"
      >
        {hero && page ? (
          (() => {
            const wide = hero.kind === "wide";
            const heading = (
              <div className={`flex flex-col ${wide ? "items-start" : "items-center text-center"}`}>
                {page.eyebrow && (
                  <motion.p
                    {...fade(0.3)}
                    className={`font-medium uppercase ${wide ? "text-[0.7rem] tracking-[0.32em]" : "text-[0.6rem] tracking-[0.28em]"} ${
                      dark ? "text-rose" : "text-rose-deep"
                    }`}
                  >
                    {page.eyebrow}
                  </motion.p>
                )}
                <motion.h3
                  {...fade(0.4)}
                  className={`font-serif leading-[1.05] tracking-tight ${wide ? "mt-3 text-5xl xl:text-6xl" : "mt-1.5 text-[2rem]"}`}
                >
                  {page.title}
                </motion.h3>
                {page.titleAm && (
                  <motion.p
                    {...fade(0.45)}
                    lang="am"
                    className={`font-amharic ${wide ? "mt-2 text-xl" : "mt-1 text-base"} ${dark ? "text-paper/70" : "text-mocha-deep"}`}
                  >
                    {page.titleAm}
                  </motion.p>
                )}
                {page.note && (wide || hero.showNote) && (
                  <motion.p
                    {...fade(0.5)}
                    className={`font-hand leading-snug ${wide ? "mt-3 max-w-md text-2xl" : "mt-1.5 max-w-[19rem] text-lg"} ${
                      dark ? "text-[#f3d9cf]" : "text-mocha-deep"
                    }`}
                  >
                    {page.note}
                  </motion.p>
                )}
              </div>
            );
            const heroPrint = (
              <Print
                memory={memories[0]}
                i={0}
                dark={dark}
                width={hero.hero.width}
                height={hero.hero.height}
                frame={frame}
                onOpen={() => openMemory(memories[0])}
              />
            );
            const smallPrints = memories.slice(1).map((memory, j) => (
              <div
                key={memory.id}
                style={{ marginLeft: j ? (wide ? -hero.overlap : hero.rowGap) : 0 }}
                className="relative hover:z-20"
              >
                <Print
                  memory={memory}
                  i={j + 1}
                  dark={dark}
                  width={hero.side[j].width}
                  height={hero.side[j].height}
                  frame={frame}
                  onOpen={() => openMemory(memory)}
                />
              </div>
            ));

            return wide ? (
              <div style={{ gap: hero.gutter }} className="flex items-center justify-center">
                {heroPrint}
                <div className="flex flex-col items-start">
                  {heading}
                  <div className="mt-8 flex items-start pl-2">{smallPrints}</div>
                </div>
              </div>
            ) : (
              <div style={{ gap: frame.gap }} className="flex h-full flex-col items-center justify-between">
                {heading}
                {heroPrint}
                <div className="flex items-start justify-center">{smallPrints}</div>
              </div>
            );
          })()
        ) : rows.map((row, r) => (
          <div key={r} style={{ gap: frame.gap }} className="flex items-start justify-center">
            {row.map((cell) => {
              const memory = memories[cell.index];
              const order = rows.slice(0, r).reduce((s, rr) => s + rr.length, 0) + row.indexOf(cell);
              return (
                <Print
                  key={memory.id}
                  memory={memory}
                  i={order}
                  dark={dark}
                  width={cell.width}
                  height={cell.height}
                  frame={frame}
                  onOpen={() => setOpen(chapterMemories.findIndex((m) => m.id === memory.id))}
                />
              );
            })}
          </div>
        ))}
      </div>

      <PhotoLightbox memories={chapterMemories} index={open} onClose={() => setOpen(null)} onNavigate={setOpen} />
    </div>
  );
}
