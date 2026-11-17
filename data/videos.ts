import type { VideoMemory } from "@/lib/types";

/**
 * Video memories.
 *
 * Put your own `.mp4` files in `public/videos/` and a poster image
 * (a still frame, ideally 16:9) in `public/videos/posters/`.
 * Videos never autoplay: they only start when someone presses play.
 *
 * The sample clips are royalty-free footage from Pexels (pexels.com/license).
 */
export const videos: VideoMemory[] = [
  {
    id: "video-001",
    chapter: "chapter-02",
    title: "Somewhere Along the Way",
    caption: "Hot-air balloons at sunrise, and a road trip that went exactly right.",
    date: "A trip to remember",
    src: "/videos/video-01-travel.mp4",
    poster: "/videos/posters/video-01-travel.jpg",
  },
  {
    id: "video-002",
    chapter: "chapter-03",
    title: "The Sunset We Waited For",
    caption: "The light lingering a little longer than usual, as if it knew.",
    date: "A golden evening",
    src: "/videos/video-02-sunset.mp4",
    poster: "/videos/posters/video-02-sunset.jpg",
  },
  {
    id: "video-003",
    chapter: "chapter-01",
    title: "Waves in the Golden Hour",
    caption: "Sitting on the rocks, watching the sea catch the last of the sun.",
    date: "An early adventure",
    src: "/videos/video-03-waves.mp4",
    poster: "/videos/posters/video-03-waves.jpg",
  },
];
