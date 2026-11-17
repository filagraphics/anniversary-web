/**
 * Split a chapter's photos into scrapbook pages of 2–4 prints.
 * Groups of three, and a lonely last photo joins the previous page.
 */
export function chunkIntoSpreads<T>(items: T[]): T[][] {
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += 3) pages.push(items.slice(i, i + 3));
  if (pages.length > 1 && pages[pages.length - 1].length === 1) {
    pages[pages.length - 2].push(...pages.pop()!);
  }
  return pages;
}
