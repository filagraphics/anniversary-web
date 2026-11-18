"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { asset } from "@/lib/asset";
import type { CoverClip } from "@/lib/types";
import { useIsClient } from "@/lib/useIsClient";
import { useParallax, useSlide } from "../deck/DeckContext";

const ease = [0.22, 1, 0.36, 1] as const;

// Class names are written out in full so Tailwind can find them.
const size =
  "w-[23vw] max-w-[104px] [@media(min-aspect-ratio:1/1)]:w-[9.5vw] [@media(min-aspect-ratio:1/1)]:max-w-[175px] [@media(min-aspect-ratio:1/1)]:min-w-[112px]";

/**
 * Where each clip sits. Phones: one in each top corner, either side of the
 * photo. Wide screens: one at the seam between words and photo, one low on
 * the far edge of the photo. `photo` is the side the cover photo is on.
 */
const spots = {
  right: [
    {
      place: "top-14 left-3 [@media(min-aspect-ratio:1/1)]:top-[7%] [@media(min-aspect-ratio:1/1)]:left-[max(46%,690px)]",
      tilt: -6,
      tape: "rotate-[-6deg]",
      depth: -0.06,
    },
    {
      place: "top-16 right-3 [@media(min-aspect-ratio:1/1)]:top-auto [@media(min-aspect-ratio:1/1)]:bottom-[15%] [@media(min-aspect-ratio:1/1)]:right-[3.5%]",
      tilt: 5,
      tape: "rotate-[7deg]",
      depth: -0.12,
    },
  ],
  left: [
    {
      place: "top-14 left-3 [@media(min-aspect-ratio:1/1)]:top-auto [@media(min-aspect-ratio:1/1)]:bottom-[15%] [@media(min-aspect-ratio:1/1)]:left-[4%]",
      tilt: -5,
      tape: "rotate-[-7deg]",
      depth: 0.06,
    },
    {
      place: "top-16 right-3 [@media(min-aspect-ratio:1/1)]:top-[7%] [@media(min-aspect-ratio:1/1)]:right-auto [@media(min-aspect-ratio:1/1)]:left-[38%]",
      tilt: 6,
      tape: "rotate-[6deg]",
      depth: -0.06,
    },
  ],
} as const;

type Spot = (typeof spots)[keyof typeof spots][number];

function ClipPrint({ clip, i, spot, onOpen }: { clip: CoverClip; i: number; spot: Spot; onOpen: () => void }) {
  const { seen, near, isActive } = useSlide();
  const ref = useRef<HTMLVideoElement>(null);
  const x = useParallax(spot.depth);

  // Play while this page is on screen, pause when it isn't.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // React doesn't always reflect `muted`, and autoplay needs it.
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [isActive, near]);

  return (
    <motion.div style={{ x }} className={`absolute z-10 ${size} ${spot.place}`}>
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`Open video: ${clip.title}`}
        initial={{ opacity: 0, y: -36, rotate: spot.tilt * 3, scale: 1.08 }}
        animate={seen ? { opacity: 1, y: 0, rotate: spot.tilt, scale: 1 } : undefined}
        whileHover={{ rotate: 0, scale: 1.05 }}
        transition={{ duration: 1.3, delay: 1 + i * 0.25, ease }}
        className="group relative block w-full bg-[#fbf7f1] p-1 pb-0 text-left text-ink shadow-[0_24px_50px_-18px_rgb(232_201_143/0.45),0_10px_24px_-10px_rgb(0_0_0/0.7)] sm:p-1.5 sm:pb-0"
      >
        <span aria-hidden className={`absolute -top-2.5 left-1/2 z-10 h-5 w-12 -translate-x-1/2 bg-[#e8c98f]/55 sm:w-16 ${spot.tape}`} />
        <span className="relative block aspect-[464/848] overflow-hidden bg-night">
          <video
            ref={ref}
            src={near ? asset(clip.src) : undefined}
            poster={asset(clip.poster)}
            muted
            loop
            playsInline
            preload={near ? "auto" : "none"}
            disablePictureInPicture
            aria-hidden
            className="absolute inset-0 size-full object-cover"
          />
          <span
            aria-hidden
            className="absolute right-1 bottom-1 grid size-6 place-items-center rounded-full bg-night/55 text-paper backdrop-blur-sm transition-colors group-hover:bg-night/80 sm:size-7"
          >
            <Expand className="size-3 sm:size-3.5" />
          </span>
        </span>
        <span className="block truncate px-0.5 py-1.5 font-hand text-[0.8rem] leading-none sm:py-2 sm:text-lg">{clip.title}</span>
      </motion.button>
    </motion.div>
  );
}

/** Full-screen silent player, opened by tapping a clip. */
export function ClipViewer({ clip, onClose }: { clip: CoverClip | null; onClose: () => void }) {
  const isClient = useIsClient();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!clip) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep the deck from turning pages behind the player.
      if (e.key.startsWith("Arrow") || e.key === " ") e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => {
      window.removeEventListener("keydown", onKey, true);
      document.body.style.overflow = previous;
    };
  }, [clip, onClose]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {clip && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={clip.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center gap-4 bg-night/95 p-4 text-paper backdrop-blur-sm"
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-paper/10 transition-colors hover:bg-paper/20 sm:top-6 sm:right-6"
          >
            <X className="size-5" />
          </button>
          <video
            src={asset(clip.src)}
            poster={asset(clip.poster)}
            controls
            muted
            loop
            autoPlay
            playsInline
            disablePictureInPicture
            onClick={(e) => e.stopPropagation()}
            className="max-h-[82vh] max-w-full rounded-lg bg-night shadow-2xl"
          />
          <p className="font-hand text-2xl text-[#f3dca6]">{clip.title}</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default function CoverClips({ clips, photo = "right" }: { clips: CoverClip[]; photo?: keyof typeof spots }) {
  const [open, setOpen] = useState<CoverClip | null>(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <>
      {clips.slice(0, spots[photo].length).map((clip, i) => (
        <ClipPrint key={clip.src} clip={clip} i={i} spot={spots[photo][i]} onOpen={() => setOpen(clip)} />
      ))}
      <ClipViewer clip={open} onClose={close} />
    </>
  );
}
