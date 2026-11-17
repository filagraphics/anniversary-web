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
  /** Small image used on the timeline. */
  timelineImage: string;
  theme: ChapterTheme;
  /** Little keywords shown under the chapter description. */
  highlights: string[];
  /** Optional handwritten note shown at the end of the chapter. */
  closingNote?: string;
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
