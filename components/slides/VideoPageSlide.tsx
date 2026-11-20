"use client";

import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { asset } from "@/lib/asset";
import type { Chapter, VideoPage } from "@/lib/types";
import { useParallax, useSlide } from "../deck/DeckContext";
import PhotoLightbox from "../PhotoLightbox";
import { ClipViewer } from "./CoverClips";
import TapedPrint from "./TapedPrint";
import Motes from "./Motes";

const ease = [0.22, 1, 0.36, 1] as const;
const STAR = "M0 -10 C1.2 -2.4 2.4 -1.2 10 0 C2.4 1.2 1.2 2.4 0 10 C-1.2 2.4 -2.4 1.2 -10 0 C-2.4 -1.2 -1.2 -2.4 0 -10Z";

/** Gold stars twinkling around the video (fixed spots, relative to it). */
const stars = [
  { left: "-12%", top: "6%", size: 16, delay: 0 },
  { left: "106%", top: "14%", size: 12, delay: 0.9 },
  { left: "-9%", top: "58%", size: 10, delay: 1.7 },
  { left: "103%", top: "70%", size: 17, delay: 0.4 },
  { left: "46%", top: "-6%", size: 11, delay: 2.2 },
  { left: "20%", top: "102%", size: 9, delay: 1.2 },
];

/**
 * A page of its own for one clip: the video large in a gold frame, glowing
 * over a blurred copy of itself, with a title and a handwritten line.
 * It plays silently on a loop while the page is on screen; tap to enlarge.
 */
export default function VideoPageSlide({ chapter, page }: { chapter: Chapter; page: VideoPage }) {
  const { seen, near, isActive, reduce } = useSlide();
  const ref = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const [photoOpen, setPhotoOpen] = useState<number | null>(null);
  const photos = page.photos ?? [];
  const glowX = useParallax(0.35);
  const videoX = useParallax(0.14);
  const textX = useParallax(-0.12);
  const words = page.title.split(" ");
  const { clip } = page;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [isActive, near]);

  const item = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: seen ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 1.1, delay, ease },
  });

  return (
    <div className="grain relative isolate h-full overflow-hidden bg-night text-paper">
      {/* The still, deeply blurred: soft white-and-gold light filling the page. */}
      <motion.div aria-hidden style={{ x: glowX }} className="absolute inset-y-0 -inset-x-[30%] -z-30">
        <motion.img
          src={asset(clip.poster)}
          alt=""
          initial={{ scale: 1.3, opacity: 0 }}
          animate={seen ? { scale: 1.15, opacity: 0.55 } : undefined}
          transition={{ duration: 2.6, ease }}
          className="size-full object-cover blur-3xl"
        />
      </motion.div>
      <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,rgb(48_30_38/0.35),rgb(31_27_26/0.9)_75%)]" />
      <Motes />

      <div className="relative mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-7 px-6 pt-16 pb-28 [@media(min-aspect-ratio:1/1)]:flex-row-reverse [@media(min-aspect-ratio:1/1)]:gap-16 [@media(min-aspect-ratio:1/1)]:pb-20 lg:gap-24">
        {/* The video, in a gold frame. */}
        <motion.div style={{ x: videoX }} className="relative shrink-0">
          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 8, scale: 0.92 }}
            animate={seen ? { opacity: 1, y: 0, rotate: 2, scale: 1 } : undefined}
            transition={{ duration: 1.6, delay: 0.2, ease }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* A soft halo breathing behind the frame. */}
              <motion.span
                aria-hidden
                animate={reduce ? undefined : { opacity: [0.4, 0.85, 0.4], scale: [0.96, 1.05, 0.96] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -inset-[16%] -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(243_220_166/0.45),rgb(246_207_224/0.25)_55%,transparent)] blur-2xl"
              />
              {stars.map((s, i) => (
                <svg
                  key={i}
                  aria-hidden
                  viewBox="-10 -10 20 20"
                  className="pointer-events-none absolute animate-twinkle"
                  style={{
                    left: s.left,
                    top: s.top,
                    width: s.size,
                    height: s.size,
                    animationDelay: `${s.delay}s`,
                    filter: "drop-shadow(0 0 6px rgb(240 210 150 / 0.9))",
                  }}
                >
                  <path d={STAR} fill="#f7e7bd" />
                </svg>
              ))}

              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label={`Open video: ${clip.title}`}
                className="group relative block"
              >
                <span className="block animate-sheen bg-[linear-gradient(110deg,#c9a25e_0%,#f7e7bd_22%,#d4ad69_45%,#fff3d1_60%,#c9a25e_80%,#f7e7bd_100%)] bg-[length:200%_auto] p-[3px] shadow-[0_40px_90px_-30px_rgb(255_120_190/0.55),0_20px_40px_-20px_rgb(0_0_0/0.7)]">
                  <span className="block bg-[#fbf7f1] p-1.5 pb-0 sm:p-2 sm:pb-0">
                    <span className="relative block h-[42dvh] [@media(max-height:760px)]:h-[38dvh] aspect-[9/16] overflow-hidden bg-night [@media(min-aspect-ratio:1/1)]:h-[68dvh]">
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
                        className="absolute inset-0 size-full scale-[1.03] object-cover"
                      />
                      <span
                        aria-hidden
                        className="absolute right-2 bottom-2 grid size-8 place-items-center rounded-full bg-night/55 text-paper opacity-80 backdrop-blur-sm transition-opacity group-hover:opacity-100"
                      >
                        <Expand className="size-4" />
                      </span>
                    </span>
                    <span className="flex items-center gap-2 px-1 py-2 sm:py-2.5">
                      <span aria-hidden className="relative flex size-1.5 shrink-0">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#d4ad69] opacity-70" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-[#c9a25e]" />
                      </span>
                      <span className="truncate font-hand text-lg leading-none text-ink sm:text-xl">{clip.title}</span>
                    </span>
                  </span>
                </span>
              </button>
              <span aria-hidden className="absolute -top-2.5 -left-4 z-10 h-5 w-16 -rotate-[28deg] bg-[#e8c98f]/60 backdrop-blur-[1px] sm:h-6 sm:w-20" />

              {/* Tall screens: the photos tucked either side of the video. */}
              {photos.slice(0, 2).map((photo, i) => (
                <div
                  key={photo.image}
                  className={`absolute z-20 w-[25vw] max-w-[110px] [@media(min-aspect-ratio:1/1)]:hidden ${
                    i === 0 ? "top-[14%] -left-[34%]" : "top-[48%] -right-[34%]"
                  }`}
                >
                  <TapedPrint photo={photo} tilt={i ? 6 : -6} delay={1.6 + i * 0.3} aspect="aspect-[3/4]" position={photo.position} onOpen={() => setPhotoOpen(i)} />
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* The words */}
        <motion.div style={{ x: textX }} className="max-w-xl text-center [@media(min-aspect-ratio:1/1)]:text-left">
          {page.eyebrow && (
            <motion.p {...item(0.4)} className="text-[0.66rem] font-medium uppercase tracking-[0.32em] text-[#e8c98f]">
              Chapter {chapter.number} · {page.eyebrow}
            </motion.p>
          )}
          <h2 className="mt-3 font-serif text-[2.4rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            {words.map((word, i) => (
              <span key={i} className="inline-block overflow-hidden pb-1.5 align-bottom">
                <motion.span
                  className={`inline-block ${i === words.length - 1 ? "gold-sheen italic" : "pr-[0.22em]"}`}
                  initial={{ y: "110%" }}
                  animate={seen ? { y: 0 } : undefined}
                  transition={{ duration: 1.1, delay: 0.6 + i * 0.12, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>
          {page.titleAm && (
            <motion.p {...item(1.1)} lang="am" className="mt-2 font-amharic text-lg text-[#f3d9cf]/90 sm:text-2xl">
              {page.titleAm}
            </motion.p>
          )}
          <motion.div
            {...item(1.2)}
            aria-hidden
            className="mt-4 flex items-center justify-center gap-3 [@media(min-aspect-ratio:1/1)]:justify-start"
          >
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#e8c98f]/80" />
            <span className="size-1.5 rotate-45 bg-[#f3dca6] shadow-[0_0_10px_rgb(243_220_166/0.9)]" />
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#e8c98f]/80" />
          </motion.div>
          {page.note && (
            <motion.p {...item(1.4)} className="mt-4 font-hand text-[1.5rem] leading-snug text-[#f3d9cf] sm:text-3xl">
              {page.note}
            </motion.p>
          )}
          {/* Wide screens: the photos in a row under the words. */}
          {photos.length > 0 && (
            <div className="mt-9 hidden items-start gap-6 pl-2 [@media(min-aspect-ratio:1/1)]:flex">
              {photos.map((photo, i) => (
                <div key={photo.image} className="w-[10vw] max-w-[170px] min-w-[120px]">
                  <TapedPrint photo={photo} tilt={i % 2 ? 5 : -5} delay={1.7 + i * 0.3} aspect="aspect-[3/4]" position={photo.position} onOpen={() => setPhotoOpen(i)} />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <ClipViewer clip={open ? clip : null} onClose={close} />
      {photos.length > 0 && (
        <PhotoLightbox
          memories={photos.map((photo, i) => ({
            id: `${chapter.id}-video-photo-${i}`,
            chapter: chapter.id,
            title: photo.title,
            date: page.eyebrow ?? "",
            image: photo.image,
            caption: photo.caption,
            category: "special",
            alt: photo.alt,
          }))}
          index={photoOpen}
          onClose={() => setPhotoOpen(null)}
          onNavigate={setPhotoOpen}
        />
      )}
    </div>
  );
}
