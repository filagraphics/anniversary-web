"use client";

import { ImageOff } from "lucide-react";
import { useEffect, useRef, useState, type ImgHTMLAttributes } from "react";
import { asset } from "@/lib/asset";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  /** Shimmer while loading. */
  placeholder?: boolean;
  /** Classes for the wrapper shown when loading fails. */
  fallbackClassName?: string;
};

/**
 * <img> with a loading shimmer and a graceful fallback for missing files.
 * Plain <img> is used on purpose: the site is a static export.
 */
export default function SafeImage({
  src,
  alt = "",
  className = "",
  placeholder = true,
  fallbackClassName = "",
  onLoad,
  onError,
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setStatus("loading");
  }

  // The image may finish (or fail) before React hydrates, so check once mounted.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete) {
      setStatus(img.naturalWidth > 0 ? "loaded" : "error");
    }
  }, [src]);

  if (status === "error") {
    return (
      <div
        role="img"
        aria-label={alt ? `${alt} (image unavailable)` : "Image unavailable"}
        className={`flex flex-col items-center justify-center gap-2 bg-cream text-mocha-deep ${fallbackClassName || className}`}
      >
        <ImageOff aria-hidden className="size-6 opacity-70" />
        <span className="text-xs tracking-wide">Photo unavailable</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={asset(src)}
      alt={alt}
      decoding="async"
      className={`${className} ${placeholder && status === "loading" ? "shimmer" : ""} transition-opacity duration-700 ${status === "loaded" ? "opacity-100" : "opacity-90"}`}
      onLoad={(e) => {
        setStatus("loaded");
        onLoad?.(e);
      }}
      onError={(e) => {
        setStatus("error");
        onError?.(e);
      }}
      {...rest}
    />
  );
}
