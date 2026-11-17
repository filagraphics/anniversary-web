"use client";

import { motion } from "framer-motion";
import { Expand, Film, Play, VideoOff } from "lucide-react";
import { useRef, useState } from "react";
import { asset } from "@/lib/asset";
import type { VideoMemory } from "@/lib/types";
import SafeImage from "./ui/SafeImage";

type Props = {
  video: VideoMemory;
  tone?: "light" | "dark";
  size?: "default" | "large";
};

/**
 * Poster + play button. The <video> element is only mounted after the
 * visitor presses play, so nothing downloads or plays on its own.
 */
export default function VideoCard({ video, tone = "light", size = "default" }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const dark = tone === "dark";
  const unavailable = failed || video.placeholder;

  const fullscreen = () => {
    const el = videoRef.current as
      | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
      | null;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => el.webkitEnterFullscreen?.());
    else el.webkitEnterFullscreen?.(); // iOS Safari
  };

  return (
    <figure className="group">
      <div
        className={`relative aspect-video overflow-hidden rounded-xl bg-night shadow-soft ring-1 ${
          dark ? "ring-paper/10" : "ring-ink/5"
        } ${size === "large" ? "sm:rounded-2xl" : ""}`}
      >
        {unavailable ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream p-6 text-center text-mocha-deep">
            {video.placeholder ? <Film aria-hidden className="size-8" /> : <VideoOff aria-hidden className="size-8" />}
            <p className="font-serif text-lg text-ink">
              {video.placeholder ? "Video placeholder" : "This video couldn’t be loaded"}
            </p>
            <p className="max-w-xs text-xs">
              Add an .mp4 file to <code>public/videos/</code> and update <code>data/videos.ts</code>.
            </p>
          </div>
        ) : started ? (
          <video
            ref={videoRef}
            src={asset(video.src)}
            poster={asset(video.poster)}
            controls
            autoPlay
            playsInline
            preload="metadata"
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full bg-night object-contain"
            aria-label={video.title}
          >
            Your browser does not support HTML video.
          </video>
        ) : (
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="absolute inset-0 size-full text-paper"
            aria-label={`Play video: ${video.title}`}
          >
            <SafeImage
              src={video.poster}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              fallbackClassName="absolute inset-0 size-full !bg-night/90 !text-paper/60"
            />
            <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-night/20" />
            <motion.span
              aria-hidden
              whileHover={{ scale: 1.06 }}
              className={`absolute top-1/2 left-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-paper/50 bg-paper/15 backdrop-blur-md transition-colors group-hover:bg-paper/30 ${
                size === "large" ? "size-20" : "size-16"
              }`}
            >
              <Play className="ml-1 size-6 fill-paper" />
            </motion.span>
            <span className="absolute bottom-4 left-4 text-[0.65rem] uppercase tracking-[0.25em] text-paper/85">
              Press play
            </span>
          </button>
        )}

        {started && !unavailable && (
          <button
            type="button"
            onClick={fullscreen}
            className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-night/60 text-paper backdrop-blur transition-colors hover:bg-night/80"
            aria-label="Watch full screen"
          >
            <Expand className="size-4" />
          </button>
        )}
      </div>

      <figcaption className="px-1 pt-4">
        <p className={`text-[0.68rem] uppercase tracking-[0.2em] ${dark ? "text-rose" : "text-mocha-deep"}`}>
          {video.date}
        </p>
        <h4 className={`mt-1 font-serif leading-snug ${size === "large" ? "text-2xl sm:text-3xl" : "text-xl"} ${dark ? "text-paper" : "text-ink"}`}>
          {video.title}
        </h4>
        <p className={`mt-1 font-hand text-xl leading-snug ${dark ? "text-paper/70" : "text-mocha-deep"}`}>
          {video.caption}
        </p>
      </figcaption>
    </figure>
  );
}
