import type { CSSProperties } from "react";

/** The star outline, in a -10…10 viewBox. */
export const STAR_PATH = "M0 -10 C1.2 -2.4 2.4 -1.2 10 0 C2.4 1.2 1.2 2.4 0 10 C-1.2 2.4 -2.4 1.2 -10 0 C-2.4 -1.2 -1.2 -2.4 0 -10Z";

/** A four-pointed gold star that twinkles. Position and size it with `className` / `style`. */
export default function Star({
  className = "",
  style,
  delay = 0,
  color = "#f7e7bd",
}: {
  className?: string;
  style?: CSSProperties;
  /** Animation delay, in seconds, so stars don't twinkle in sync. */
  delay?: number;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="-10 -10 20 20"
      className={`pointer-events-none absolute animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s`, filter: "drop-shadow(0 0 6px rgb(240 210 150 / 0.9))", ...style }}
    >
      <path d={STAR_PATH} fill={color} />
    </svg>
  );
}
