/**
 * Split a chapter's photos into scrapbook pages of 2–7 prints.
 *
 * Photos with a `spread` number are pinned to that page (in order, max
 * MAX_PINNED per page). The rest are grouped in threes after them, and a lonely last photo
 * joins the previous page.
 */
/** Pinned pages hold up to this many prints (layouts exist for 1–7). */
export const MAX_PINNED = 7;

export function chunkIntoSpreads<T extends { spread?: number }>(items: T[]): T[][] {
  const pinned = new Map<number, T[]>();
  const rest: T[] = [];
  for (const item of items) {
    if (item.spread) {
      if (!pinned.has(item.spread)) pinned.set(item.spread, []);
      pinned.get(item.spread)!.push(item);
    } else {
      rest.push(item);
    }
  }

  const pages: T[][] = [];
  for (const [, group] of [...pinned.entries()].sort((a, b) => a[0] - b[0])) {
    for (let i = 0; i < group.length; i += MAX_PINNED) pages.push(group.slice(i, i + MAX_PINNED));
  }

  const auto: T[][] = [];
  for (let i = 0; i < rest.length; i += 3) auto.push(rest.slice(i, i + 3));
  if (auto.length > 1 && auto[auto.length - 1].length === 1) {
    auto[auto.length - 2].push(...auto.pop()!);
  }
  return [...pages, ...auto];
}
