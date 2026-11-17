"use client";

import { motion } from "framer-motion";
import { sections } from "@/data/messages";
import { videos } from "@/data/videos";
import { useSlide } from "../deck/DeckContext";
import VideoCard from "../VideoCard";

const ease = [0.22, 1, 0.36, 1] as const;

/** Moments in motion: a little film festival of three. */
export default function VideosSlide() {
  const { seen } = useSlide();
  const copy = sections.videos;

  return (
    <div className="relative h-full bg-cream text-ink">
      {/* Film-strip perforations along the edges. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-[radial-gradient(circle,rgb(48_42_40/0.12)_3px,transparent_3.5px)] bg-[length:22px_16px]" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-[radial-gradient(circle,rgb(48_42_40/0.12)_3px,transparent_3.5px)] bg-[length:22px_16px]" />

      <div className="no-scrollbar h-full overflow-y-auto overscroll-y-contain [mask-image:linear-gradient(to_bottom,black_calc(100%-7.5rem),transparent_calc(100%-4rem))] px-5 pt-14 pb-32 sm:px-10 sm:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={seen ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.9, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-mocha-deep">{copy.eyebrow}</p>
          <h2 className="mt-3 font-serif text-[2.2rem] leading-[1.05] tracking-tight sm:text-5xl">{copy.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg">{copy.intro}</p>
        </motion.div>

        {videos.length === 0 ? (
          <p className="mx-auto mt-12 max-w-md text-center text-mocha-deep">
            No videos yet. Add some to <code>data/videos.ts</code>.
          </p>
        ) : (
          <div className="mx-auto mt-10 grid max-w-6xl gap-10 sm:mt-14 md:grid-cols-3 md:gap-7">
            {videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                animate={seen ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 1, delay: 0.2 + i * 0.15, ease }}
                className={i === 1 ? "md:translate-y-8" : ""}
              >
                <VideoCard video={video} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
