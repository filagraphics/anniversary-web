const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefix a path from `public/` with the configured base path so media keeps
 * working when the site is deployed under a sub-path (e.g. GitHub Pages).
 */
export function asset(path: string): string {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
