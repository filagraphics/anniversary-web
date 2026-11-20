"use client";

import { motion } from "framer-motion";
import { Music2, Pause } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { music } from "@/data/messages";
import { asset } from "@/lib/asset";

/** Events that count as a user gesture, so the browser lets sound play. */
const GESTURES = ["pointerdown", "pointerup", "touchend", "keydown", "click"] as const;

/**
 * Background music, on a loop. It starts as soon as the page opens; browsers
 * that block sound until the visitor interacts start it on the first tap,
 * click or key press instead. Once paused with the button it stays paused.
 */
export default function MusicPlayer({ tone = "light" }: { tone?: "light" | "dark" }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  /** Set once the visitor pauses the music themselves: no more auto-starting. */
  const pausedByUser = useRef(false);
  const dark = tone === "dark";

  // Start on open, or on the first gesture if the browser blocks autoplay.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;

    const stop = () => GESTURES.forEach((g) => window.removeEventListener(g, start, true));
    const start = (e?: Event) => {
      // A tap on the music button is handled by the button itself.
      if (e?.target instanceof Node && buttonRef.current?.contains(e.target)) return;
      if (pausedByUser.current || !audio.paused) return stop();
      audio.play().then(stop, () => {}); // still blocked: wait for the next gesture
    };

    GESTURES.forEach((g) => window.addEventListener(g, start, true));
    start();
    return stop;
  }, []);

  // Pause the music whenever a video with sound starts, so they never overlap.
  // (The silent looping clips on the covers don't count.)
  useEffect(() => {
    const onPlay = (e: Event) => {
      if (e.target instanceof HTMLVideoElement && !e.target.muted) audioRef.current?.pause();
    };
    document.addEventListener("play", onPlay, true);
    return () => document.removeEventListener("play", onPlay, true);
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      pausedByUser.current = false;
      audio.volume = 0.5;
      try {
        await audio.play();
      } catch {
        setError(true);
      }
    } else {
      pausedByUser.current = true;
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
        autoPlay
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setError(true)}
      />
      <button
        ref={buttonRef}
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
