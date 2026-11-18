export type ChapterId = "chapter-01" | "chapter-02" | "chapter-03";

/** Visual treatment for a chapter section. */
export type ChapterTheme = "paper" | "light" | "dark";

export interface Chapter {
  id: ChapterId;
  /** Displayed as the large chapter numeral, e.g. "01". */
  number: string;
  title: string;
  /** Optional Amharic title shown under the English one. */
  titleAm?: string;
  /** Short label used in the timeline, e.g. "The Beginning". */
  milestone: string;
  /** Placeholder period. Replace with your own years, e.g. "2019 – 2020". */
  period: string;
  /** Handwritten-style introductory caption. */
  caption: string;
  description: string;
  /** One-line summary used on the timeline. */
  timelineNote: string;
  cover: string;
  coverAlt: string;
  /**
   * For portrait cover photos: a pre-blurred copy. On wide screens the sharp
   * photo then sits on one side, glowing over its own blurred light.
   */
  coverBlur?: string;
  /**
   * Shape of the cover photo when `coverBlur` is set:
   * "portrait" (default) -> sharp side panel on wide screens;
   * "wide" -> sharp band across the top on tall screens (phones).
   */
  coverShape?: "portrait" | "wide";
  /** Where the cover text sits. Defaults by theme (paper: left, light: topRight, dark: center). */
  coverAlign?: "left" | "right" | "topRight" | "center";
  /** CSS object-position for the cover, e.g. "45% 50%", to keep faces in frame. */
  coverPosition?: string;
  /**
   * Optional celebration touches on the cover: a gold badge above the title,
   * twinkling stars, and a sparkle on one point of the photo (in its pixels).
   * The glint lines up when `coverPosition` is "50% 50%" (the default).
   */
  celebrate?: {
    badge: string;
    badgeAm?: string;
    glint?: { x: number; y: number; width: number; height: number };
  };
  /** Optional little keepsake print taped onto the chapter cover. */
  keepsake?: Keepsake;
  /**
   * Optional short clips taped onto the chapter cover as little "video prints".
   * They play silently on a loop while the cover is on screen; tap to enlarge.
   */
  coverClips?: CoverClip[];
  /** Small image used on the timeline. */
  timelineImage: string;
  theme: ChapterTheme;
  /** Little keywords shown under the chapter description. */
  highlights: string[];
  /** Optional handwritten note shown at the end of the chapter. */
  closingNote?: string;
  /**
   * Optional headings for scrapbook pages, keyed by page number (1 = first).
   * On wide screens a page with a heading becomes a "hero" page: its first
   * photo as one big print, the heading beside it, the rest fanned below.
   */
  spreadPages?: Record<number, SpreadPage>;
}

export interface SpreadPage {
  /** Small label above the heading, e.g. "Graduation day". */
  eyebrow?: string;
  title: string;
  titleAm?: string;
  /** Optional handwritten line under the heading. */
  note?: string;
}

export interface CoverClip {
  /** An .mp4 (H.264) in public/videos/. */
  src: string;
  /** A still frame shown while the clip loads. */
  poster: string;
  /** Short handwritten label under the clip. */
  title: string;
}

export interface Keepsake {
  image: string;
  thumbnail?: string;
  title: string;
  titleAm?: string;
  /** Free text, e.g. "ህዳር 29, 2012 ዓ.ም.". */
  date: string;
  /** Optional short handwritten line on the print (and its Amharic version). */
  note?: string;
  noteAm?: string;
  caption: string;
  alt: string;
}

export type MemoryCategory =
  | "special"
  | "everyday"
  | "travel"
  | "celebration"
  | "sunset"
  | "dinner"
  | "adventure";

export interface Memory {
  id: string;
  chapter: ChapterId;
  title: string;
  /** Free text: "Spring, 20XX", "A special moment", etc. */
  date: string;
  /** Full-size image (shown in the lightbox). */
  image: string;
  /** Optional smaller image for the grid. Falls back to `image`. */
  thumbnail?: string;
  caption: string;
  category: MemoryCategory;
  /** Describe the photo for screen readers. Falls back to the title. */
  alt?: string;
  /** Optional Amharic title. */
  titleAm?: string;
  /**
   * Give this photo its own full page right after the chapter cover,
   * instead of placing it on a scrapbook spread.
   */
  featured?: boolean;
  /**
   * Optional: pin this photo to a specific scrapbook page of its chapter
   * (1 = first page). Up to 7 photos per page; unpinned photos fill later pages.
   */
  spread?: number;
  /** Optional CSS object-position (e.g. "30% 40%") to keep faces in frame when cropped. */
  position?: string;
  /** Optional intrinsic size: helps the grid reserve space while loading. */
  width?: number;
  height?: number;
}

export interface VideoMemory {
  id: string;
  chapter?: ChapterId;
  title: string;
  caption: string;
  date: string;
  src: string;
  poster: string;
  /** Set to true for a clearly marked placeholder without a real file. */
  placeholder?: boolean;
}
