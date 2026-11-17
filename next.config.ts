import type { NextConfig } from "next";

/**
 * Static export configuration.
 *
 * `NEXT_PUBLIC_BASE_PATH` is only needed when the site is served from a
 * sub-path (e.g. GitHub Pages project sites: https://user.github.io/repo).
 * Leave it unset for Vercel, Nginx at the domain root, etc.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
