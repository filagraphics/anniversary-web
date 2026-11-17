import type { Chapter } from "@/lib/types";

/**
 * The three chapters of the story.
 *
 * Edit titles, captions, descriptions and placeholder periods here.
 * `period` values are placeholders on purpose: replace "Year One" etc. with
 * real years (e.g. "2019 – 2020") whenever you like.
 */
export const chapters: Chapter[] = [
  {
    id: "chapter-01",
    number: "01",
    title: "Where It All Began",
    titleAm: "ሁሉም የጀመረበት",
    milestone: "The Beginning",
    period: "Year One",
    caption: "Every beautiful story has its own beginning.",
    description:
      "First conversations that ran late, coffee that went cold on the table, long walks with nowhere to be, and sunsets that seemed to wait for us. The quiet, ordinary start of something worth remembering.",
    timelineNote: "First moments, coffee dates, long walks and early sunsets.",
    cover: "/images/covers/chapter-01.jpg",
    coverAlt: "Silhouettes of people holding hands on a beach at sunset",
    timelineImage: "/memories/chapter-01/thumbs/first-photo.jpg",
    theme: "paper",
    highlights: ["First moments", "Coffee dates", "Walking together", "Early sunsets"],
  },
  {
    id: "chapter-02",
    number: "02",
    title: "Little Moments, Big Memories",
    titleAm: "ትናንሽ ጊዜያት፣ ትልልቅ ትዝታዎች",
    milestone: "The Adventures",
    period: "Years Two – Four",
    caption:
      "It was never just about the places we visited, but the moments we collected along the way.",
    description:
      "Road trips and mountain lakes, birthday candles and dinner reservations, wrong turns that became the best part of the day. The everyday became unforgettable, one small moment at a time.",
    timelineNote: "Trips, birthdays, dinners, and the everyday adventures in between.",
    cover: "/images/covers/chapter-02.jpg",
    coverAlt: "A wooden boathouse on a calm mountain lake",
    timelineImage: "/memories/chapter-02/thumbs/photo-02.jpg",
    theme: "light",
    highlights: ["Trips & travels", "Birthdays", "Dinner dates", "Beautiful places"],
  },
  {
    id: "chapter-03",
    number: "03",
    title: "Moments Worth Keeping",
    titleAm: "ሊጠበቁ የሚገባቸው ጊዜያት",
    milestone: "The Moments Worth Keeping",
    period: "Years Five – Six",
    caption: "Some moments become part of us, long after they have passed.",
    description:
      "The favourite photographs, the celebrations, the places we keep returning to in our minds. Golden evenings and quiet views: the memories that stay long after the day is over.",
    timelineNote: "Favourite photographs, celebrations, and the views we still think about.",
    cover: "/images/covers/chapter-03.jpg",
    coverAlt: "A person with open arms reflected on still water at sunset",
    timelineImage: "/memories/chapter-03/thumbs/photo-02.jpg",
    theme: "dark",
    highlights: ["Favourite photographs", "Celebrations", "Golden evenings", "Favourite places"],
    closingNote:
      "Of all the photographs, these are the ones I keep coming back to. Thank you for every one of these moments.",
  },
];

export function getChapter(id: string) {
  return chapters.find((chapter) => chapter.id === id);
}
