"use client";

import { useTransform, type MotionValue } from "framer-motion";
import { createContext, useContext, useState } from "react";

export type SlideTone = "light" | "dark";

export type SlideMeta = {
  id: string;
  tone: SlideTone;
  label: string;
  group: string;
};

type DeckState = {
  active: number;
  total: number;
  reduce: boolean;
  go: (index: number) => void;
  next: () => void;
  prev: () => void;
  /** Horizontal scroll position of the deck, in px. */
  scrollX: MotionValue<number>;
  /** Width of one slide, in px. */
  width: MotionValue<number>;
};

export const DeckContext = createContext<DeckState | null>(null);
export const SlideIndexContext = createContext(0);

export function useDeck() {
  const ctx = useContext(DeckContext);
  if (!ctx) throw new Error("useDeck must be used inside <Deck>");
  return ctx;
}

/**
 * Everything a slide needs to animate itself:
 * - `progress`: -1 when the slide waits on the right, 0 when centred, 1 when it has left.
 * - `isActive` / `seen` (has been active at least once) / `near` (active or a neighbour).
 */
export function useSlide() {
  const deck = useDeck();
  const index = useContext(SlideIndexContext);
  const progress = useTransform(() => {
    const w = deck.width.get() || 1;
    return (deck.scrollX.get() - index * w) / w;
  });
  const isActive = deck.active === index;
  const [seen, setSeen] = useState(isActive);
  if (isActive && !seen) setSeen(true);
  return { ...deck, index, progress, isActive, seen, near: Math.abs(deck.active - index) <= 1 };
}

/** Horizontal parallax offset (px) for an element on the current slide. */
export function useParallax(depth: number) {
  const { progress, width, reduce } = useSlide();
  return useTransform(() => (reduce ? 0 : progress.get() * width.get() * depth));
}
