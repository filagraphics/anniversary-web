"use client";

import { motion } from "framer-motion";
import type { Companion } from "@/lib/types";
import { useSlide } from "../deck/DeckContext";
import SafeImage from "../ui/SafeImage";
import { ease } from "@/lib/motion";

/** A small taped print with a handwritten label; tap to open it large. */
export default function TapedPrint({
  photo,
  tilt,
  delay,
  aspect = "aspect-[4/3]",
  position,
  onOpen,
}: {
  photo: Companion;
  /** Resting angle, in degrees. */
  tilt: number;
  /** When it drops in, in seconds. */
  delay: number;
  /** Tailwind aspect class for the photo window. */
  aspect?: string;
  /** CSS object-position, to keep faces in a cropped window. */
  position?: string;
  onOpen: () => void;
}) {
  const { seen, near } = useSlide();
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open photo: ${photo.title}`}
      initial={{ opacity: 0, y: -30, rotate: tilt * 3, scale: 1.08 }}
      animate={seen ? { opacity: 1, y: 0, rotate: tilt, scale: 1 } : undefined}
      whileHover={{ rotate: tilt / 4, scale: 1.04 }}
      transition={{ duration: 1.3, delay, ease }}
      className="group relative block w-full bg-[#fdfaf5] p-1.5 pb-0 text-left shadow-[0_24px_50px_-18px_rgb(48_42_40/0.55)] sm:p-2 sm:pb-0"
    >
      <span aria-hidden className="absolute -top-2.5 left-1/2 z-10 h-5 w-14 -translate-x-1/2 -rotate-[6deg] bg-rose/40 sm:w-16" />
      <span className={`relative block overflow-hidden bg-[#e9e2d6] ${aspect}`}>
        <SafeImage
          src={photo.thumbnail ?? photo.image}
          alt={photo.alt}
          loading={near ? "eager" : "lazy"}
          draggable={false}
          style={{ objectPosition: position }}
          className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
          fallbackClassName="absolute inset-0 size-full"
        />
      </span>
      <span className="block truncate px-0.5 py-1.5 font-hand text-sm leading-none text-ink sm:py-2 sm:text-xl">{photo.title}</span>
    </motion.button>
  );
}
