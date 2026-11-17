"use client";

import { motion } from "framer-motion";
import { Music2, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { music } from "@/data/messages";
import { asset } from "@/lib/asset";

/**
 * A small, optional music toggle. Never autoplays; the state lives only in
 * memory, so it resets when the page is closed or reloaded.
 */
export default function MusicPlayer({ tone = "light" }: { tone?: "light" | "dark" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const dark = tone === "dark";

  // Pause the music whenever a video starts, so they never overlap.
  useEffect(() => {
    const onPlay = (e: Event) => {
      if (e.target instanceof HTMLVideoElement) audioRef.current?.pause();
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = 0.5;
      try {
        await audio.play();
      } catch {
        setError(true);
      }
    } else {
      audio.pause();
    }
  };

  if (error) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={asset(music.src)}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? "Pause background music" : "Play background music"}
        className={`flex h-11 items-center gap-2.5 rounded-full border pr-3.5 pl-2 backdrop-blur-md transition-colors duration-500 ${
          dark ? "border-paper/25 bg-night/30 text-paper hover:bg-night/50" : "border-ink/15 bg-paper/70 text-ink hover:bg-white"
        }`}
      >
        <span
          className={`grid size-7 place-items-center rounded-full transition-colors duration-500 ${
            dark ? "bg-paper text-ink" : "bg-ink text-paper"
          }`}
        >
          {playing ? <Pause aria-hidden className="size-3.5" /> : <Music2 aria-hidden className="size-3.5" />}
        </span>
        <span aria-hidden className="flex h-4 items-end gap-[3px]">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              className={`w-[3px] rounded-full ${dark ? "bg-[#f3d9cf]" : "bg-rose-deep"}`}
              animate={playing ? { height: ["30%", "100%", "45%", "80%", "30%"] } : { height: "30%" }}
              transition={playing ? { duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" } : { duration: 0.3 }}
            />
          ))}
        </span>
      </button>
    </>
  );
}
