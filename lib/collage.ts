/**
 * Justified "collage" layout: whole photos (never cropped), packed into rows
 * that fill a box as fully as possible. Rows with fewer photos come out taller,
 * which gives a natural mix of big and small prints.
 *
 * Every way of splitting the photos into consecutive rows is tried
 * (2^(n-1) options, fine for a scrapbook page) and the best-filling one wins.
 */

/** Width ÷ height of a photo, from its stored size (4:3 when unknown). */
export function aspectOf(photo: { width?: number; height?: number }): number {
  return photo.width && photo.height ? photo.width / photo.height : 4 / 3;
}

export type CollageFrame = {
  /** Border around the photo inside the print, px. */
  pad: number;
  /** Height of the caption strip under the photo, px. */
  caption: number;
  /** Space between prints and between rows, px. */
  gap: number;
};

export type CollageCell = { index: number; width: number; height: number };
export type CollageRow = CollageCell[];

function permutations(n: number): number[][] {
  const out: number[][] = [];
  const walk = (prefix: number[], rest: number[]) => {
    if (!rest.length) out.push(prefix);
    rest.forEach((v, i) => walk([...prefix, v], [...rest.slice(0, i), ...rest.slice(i + 1)]));
  };
  walk([], Array.from({ length: n }, (_, i) => i));
  return out;
}

/** Layout for photos in a fixed order (see `collageLayout`). */
function bestRows(
  order: number[],
  aspects: number[],
  boxW: number,
  boxH: number,
  { pad, caption, gap }: CollageFrame,
): { score: number; rows: CollageRow[] } | null {
  const n = order.length;
  let best: { score: number; rows: CollageRow[] } | null = null;

  for (let mask = 0; mask < 1 << (n - 1); mask++) {
    // Split into rows: bit i set => break after photo i.
    const groups: number[][] = [[]];
    for (let i = 0; i < n; i++) {
      groups[groups.length - 1].push(order[i]);
      if (i < n - 1 && mask & (1 << i)) groups.push([]);
    }

    // Image height of each row when the row spans the full width.
    const heights = groups.map((g) => {
      const sumA = g.reduce((s, i) => s + aspects[i], 0);
      return (boxW - g.length * 2 * pad - (g.length - 1) * gap) / sumA;
    });
    if (heights.some((h) => h <= 0)) continue;

    // Shrink everything uniformly if the rows are taller than the box.
    const fixed = groups.length * (pad + caption) + (groups.length - 1) * gap;
    const room = boxH - fixed;
    if (room <= 0) continue;
    const scale = Math.min(1, room / heights.reduce((s, h) => s + h, 0));
    const hs = heights.map((h) => h * scale);

    // Score: share of the box covered by photo, minus lopsided rows and tiny
    // prints, plus a nudge to keep the first photo among the biggest.
    const photoArea = groups.reduce((s, g, r) => s + g.reduce((t, i) => t + aspects[i] * hs[r] ** 2, 0), 0);
    const coverage = photoArea / (boxW * boxH);
    const imbalance = Math.max(...hs) / Math.min(...hs);
    const tiny = hs.some((h) => h < boxH * 0.13) ? 0.25 : 0;
    const firstRow = groups.findIndex((g) => g.includes(0));
    const featured = hs[firstRow] >= Math.max(...hs) * 0.95 ? 0.03 : 0;
    const score = coverage - 0.12 * Math.max(0, imbalance - 1.35) - tiny + featured;

    if (!best || score > best.score) {
      best = {
        score,
        rows: groups.map((g, r) => g.map((i) => ({ index: i, width: aspects[i] * hs[r] + 2 * pad, height: hs[r] + pad + caption }))),
      };
    }
  }
  return best;
}

export function collageLayout(aspects: number[], boxW: number, boxH: number, frame: CollageFrame): CollageRow[] {
  const n = aspects.length;
  if (!n || boxW <= 0 || boxH <= 0) return [];
  let best: { score: number; rows: CollageRow[] } | null = null;
  // Photos may be re-ordered on the page to find the most balanced collage
  // (the lightbox keeps the original order).
  for (const order of n <= 7 ? permutations(n) : [Array.from({ length: n }, (_, i) => i)]) {
    const candidate = bestRows(order, aspects, boxW, boxH, frame);
    if (candidate && (!best || candidate.score > best.score)) best = candidate;
  }
  return best?.rows ?? [];
}
