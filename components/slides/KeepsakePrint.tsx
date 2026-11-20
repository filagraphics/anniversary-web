"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ChapterId, Keepsake } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import PhotoLightbox from "../PhotoLightbox";
import SafeImage from "../ui/SafeImage";
import { ease } from "@/lib/motion";

/**
 * A small treasured print (e.g. the first flower), taped at an angle onto a
 * chapter cover. Phones: top corner. Wide screens: between the title and the photo.
 */
const placements = {
  /** Phones: top-right corner. Wide screens: between the title and the photo. */
  seam: "top-14 right-4 w-[27vw] max-w-[150px] [@media(min-aspect-ratio:1/1)]:top-[7%] [@media(min-aspect-ratio:1/1)]:right-auto [@media(min-aspect-ratio:1/1)]:left-[max(47%,680px)] [@media(min-aspect-ratio:1/1)]:w-[11.5vw] [@media(min-aspect-ratio:1/1)]:max-w-[210px] [@media(min-aspect-ratio:1/1)]:min-w-[130px]",
  /** Top-right corner everywhere (for covers whose text sits on the right). */
  corner:
    "top-11 right-3 w-[19vw] max-w-[88px] [@media(min-aspect-ratio:1/1)]:right-[6%] [@media(min-aspect-ratio:1/1)]:max-w-[185px] " +
    // taller wide screens
    "[@media(min-aspect-ratio:1/1)_and_(min-height:800px)]:top-[3%] [@media(min-aspect-ratio:1/1)_and_(min-height:800px)]:w-[8vw] [@media(min-aspect-ratio:1/1)_and_(min-height:800px)]:min-w-[110px] " +
    // shorter wide screens (laptops): a little smaller and higher
    "[@media(min-aspect-ratio:1/1)_and_(max-height:799px)]:top-[3%] [@media(min-aspect-ratio:1/1)_and_(max-height:799px)]:w-[8vw] [@media(min-aspect-ratio:1/1)_and_(max-height:799px)]:min-w-[105px]",
  /** For covers that already carry clips: mid-left on phones, low in the seam on wide screens. */
  low:
    "top-[29%] right-3 w-[21vw] max-w-[100px] [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:top-[27%] [@media(max-aspect-ratio:1/1)_and_(max-height:760px)]:w-[18vw] [@media(min-aspect-ratio:1/1)]:top-auto [@media(min-aspect-ratio:1/1)]:right-auto [@media(min-aspect-ratio:1/1)]:bottom-[13%] [@media(min-aspect-ratio:1/1)]:left-[max(47%,690px)] [@media(min-aspect-ratio:1/1)]:w-[10vw] [@media(min-aspect-ratio:1/1)]:max-w-[180px] [@media(min-aspect-ratio:1/1)]:min-w-[115px]",
} as const;

export default function KeepsakePrint({
  keepsake,
  chapter,
  placement = "seam",
}: {
  keepsake: Keepsake;
  chapter: ChapterId;
  placement?: keyof typeof placements;
}) {
  const { seen, near } = useSlide();
  const [open, setOpen] = useState<number | null>(null);
  const x = useParallax(-0.08);
  const shortHide =
    placement === "corner"
      ? "[@media(min-aspect-ratio:1/1)_and_(max-height:799px)]:hidden [@media(max-aspect-ratio:1/1)]:hidden"
      : placement === "low"
        ? "[@media(max-aspect-ratio:1/1)]:hidden" // phones: just the photo and its name
        : "";

  return (
    <>
      <motion.div
        style={{ x }}
        className={`absolute z-10 ${placements[placement]}`}
      >
        <motion.button
          type="button"
          onClick={() => setOpen(0)}
          aria-label={`Open photo: ${keepsake.title}`}
          initial={{ opacity: 0, y: -40, rotate: -18, scale: 1.1 }}
          animate={seen ? { opacity: 1, y: 0, rotate: -7, scale: 1 } : undefined}
          whileHover={{ rotate: -2, scale: 1.05 }}
          transition={{ duration: 1.3, delay: 1.1, ease }}
          className="group relative block w-full bg-[#fbf7f1] p-1.5 pb-0 text-left text-ink shadow-[0_24px_50px_-18px_rgb(201_60_110/0.55),0_10px_24px_-10px_rgb(0_0_0/0.6)] sm:p-2 sm:pb-0"
        >
          {/* Washi tape and a tiny pressed-petal stamp. */}
          <span aria-hidden className="absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 rotate-[8deg] bg-rose/50 sm:w-16" />
          <span
            aria-hidden
            className="absolute -right-2 -bottom-2 z-10 grid size-7 place-items-center rounded-full bg-[#9e2a3a] text-[0.7rem] text-paper shadow-md sm:size-8"
          >
            ✿
          </span>

          <span className="relative block aspect-[3/4] overflow-hidden bg-cream">
            <SafeImage
              src={keepsake.thumbnail ?? keepsake.image}
              alt={keepsake.alt}
              loading={near ? "eager" : "lazy"}
              draggable={false}
              className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
              fallbackClassName="absolute inset-0 size-full"
            />
          </span>
          <span className="block px-0.5 pt-1.5 pb-2 leading-tight sm:pt-2 sm:pb-2.5">
            <span className="block font-hand text-[1.05rem] leading-none sm:text-xl">{keepsake.title}</span>
            {keepsake.titleAm && (
              <span lang="am" className={`mt-1 block font-amharic text-[0.6rem] text-rose-deep sm:text-xs ${shortHide}`}>
                {keepsake.titleAm}
              </span>
            )}
            {keepsake.note && (
              <span className={`mt-1.5 block border-t border-dashed border-rose/40 pt-1.5 font-hand text-[0.85rem] leading-[1.1] text-rose-deep sm:text-base ${shortHide}`}>
                {keepsake.note}
              </span>
            )}
            {keepsake.noteAm && (
              <span lang="am" className="mt-0.5 block font-amharic text-[0.55rem] leading-snug text-rose-deep/90 sm:text-[0.65rem]">
                {keepsake.noteAm}
              </span>
            )}
            <span lang="am" className={`mt-1 block font-amharic text-[0.55rem] tracking-wide text-mocha-deep sm:text-[0.66rem] ${placement === "low" ? shortHide : ""}`}>
              {keepsake.date}
            </span>
          </span>
        </motion.button>
      </motion.div>

      <PhotoLightbox
        memories={[
          {
            id: `${chapter}-keepsake`,
            chapter,
            title: keepsake.title,
            titleAm: keepsake.titleAm,
            date: keepsake.date,
            image: keepsake.image,
            caption: keepsake.caption,
            category: "special",
            alt: keepsake.alt,
          },
        ]}
        index={open}
        onClose={() => setOpen(null)}
        onNavigate={setOpen}
      />
    </>
  );
}
