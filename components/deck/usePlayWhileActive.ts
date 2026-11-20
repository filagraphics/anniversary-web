"use client";

import { useEffect, type RefObject } from "react";
import { useSlide } from "./DeckContext";

/**
 * Plays a silent, looping <video> while its page is on screen and pauses it
 * when the page is turned. Re-runs when the page comes near, which is when
 * the video's source is attached.
 */
export function usePlayWhileActive(ref: RefObject<HTMLVideoElement | null>) {
  const { isActive, near } = useSlide();
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // React doesn't always reflect `muted`, and autoplay needs it.
    if (isActive) v.play().catch(() => {});
    else v.pause();
  }, [ref, isActive, near]);
}
