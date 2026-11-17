"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Respect the visitor's "reduce motion" preference across all animations. */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
