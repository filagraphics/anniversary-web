import Star, { STAR_PATH } from "../ui/Star";

/** Gold celebration touches for a chapter cover: twinkling stars and a glint on one spot of the photo. */

// Fixed positions so server and client render identically.
const stars = [
  { left: "6%", top: "14%", size: 14, delay: 0 },
  { left: "22%", top: "8%", size: 9, delay: 1.1 },
  { left: "38%", top: "20%", size: 12, delay: 2.3 },
  { left: "12%", top: "42%", size: 8, delay: 0.6 },
  { left: "44%", top: "48%", size: 10, delay: 1.8 },
  { left: "58%", top: "10%", size: 11, delay: 3.0 },
  { left: "70%", top: "64%", size: 9, delay: 0.3 },
  { left: "88%", top: "18%", size: 13, delay: 2.0 },
  { left: "93%", top: "46%", size: 8, delay: 1.4 },
  { left: "80%", top: "84%", size: 10, delay: 2.7 },
];

/** Small gold stars twinkling across the cover. */
export function CoverSparkles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {stars.map((s, i) => (
        <Star
          key={i}
          delay={s.delay}
          color="#f3dca6"
          style={{ left: s.left, top: s.top, width: s.size, height: s.size }}
        />
      ))}
    </div>
  );
}

/**
 * A sparkle pinned to one point of the photo (e.g. the ring). Sits over an
 * `object-cover` image centred at 50% 50%, matching `xMidYMid slice`.
 */
export function PhotoGlint({ x, y, width, height }: { x: number; y: number; width: number; height: number }) {
  const r = Math.max(width, height) * 0.022;
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full"
    >
      <defs>
        <radialGradient id="glint-glow">
          <stop offset="0%" stopColor="#fff6dc" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f3dca6" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`translate(${x} ${y})`}>
        <circle r={r * 1.6} fill="url(#glint-glow)" className="animate-twinkle" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <g transform={`scale(${r / 10})`}>
          <path
            d={STAR_PATH}
            fill="#fffaf0"
            className="animate-twinkle"
            style={{ transformBox: "fill-box", transformOrigin: "center", animationDelay: "0.4s" }}
          />
        </g>
      </g>
    </svg>
  );
}
