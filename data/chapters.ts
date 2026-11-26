import type { Chapter } from "@/lib/types";

/**
 * The three chapters of the story.
 *
 * Edit titles, captions and descriptions here.
 * `period` is optional: leave it out and the cover and journey page show
 * only the chapter number.
 */
export const chapters: Chapter[] = [
  {
    id: "chapter-01",
    number: "01",
    title: "Where It All Began ",
    titleAm: "ሁሉም የጀመረበት 🤍",
    milestone: "The Beginning",
    period: "Year One",
    caption: "Every beautiful story has its own beginning.",
    description:
      "First conversations that ran late, coffee that went cold on the table, long walks with nowhere to be, and sunsets that seemed to wait for us. The quiet, ordinary start of something worth remembering.",
    timelineNote: "First moments, Young ages, coffee dates, long walks and early sunsets.",
    cover: "/images/covers/chapter-01.jpg",
    coverBlur: "/images/covers/chapter-01-blur.jpg",
    coverShape: "wide",
    coverAlign: "right",
    coverPosition: "50% 42%",
    // The first flower: a small keepsake print taped onto this cover.
    keepsake: {
      image: "/memories/chapter-01/first-flower.jpg",
      thumbnail: "/memories/chapter-01/thumbs/first-flower.jpg",
      title: "The first flower I gave you",
      titleAm: "የሰጠሁሽ የመጀመሪያ አበባ",
      date: "ህዳር 29, 2012 ዓ.ም ",
      note: "🌹 One flower, because you're my only one.",
      caption: "One flower, because you're my only one.",
      alt: "A single red rose with a handwritten date tag on its stem, held against deep pink velvet",
    },
    coverAlt: "The two of us cheek to cheek, smiling, on a green hillside",
    timelineImage: "/memories/chapter-01/thumbs/first-photo.jpg",
    theme: "paper",
highlights: [
  "First moments 🌱✨", "Young Ages 🤍🦋", "Odoo 🤗💻", "Coffee Dates ☕❤️", "Walking Together 🚶‍♂️🚶‍♀️🤝","Early Sunsets 🌅🌸"],  },
  {
    id: "chapter-02",
    number: "02",
    title: "Moments Worth Keeping",
    titleAm: "ሊታወሱ የሚገቡ ትዝታዎቻችን",
    milestone: "The Promise Ring",
    caption: "Our first anniversary: a little ring, and a promise given with all my heart.",
    description:
      "ህዳር 19 ዓ.ም. our first anniversary. A little ring, and a promise made with all my heart. Whatever came after, that smile is a moment worth keeping, and so is every celebration, Our favourite photo and golden evening we shared.",
    timelineNote: "The promise ring on our first anniversary, and the moments worth keeping.",
    cover: "/images/covers/chapter-03.jpg",
    coverBlur: "/images/covers/chapter-03-blur.jpg",
    coverAlign: "left",
    // Our first anniversary (ህዳር 19): the promise ring, with a gold badge, twinkling stars and a sparkle on the ring.
    celebrate: {
      badge: "A promise",
      badgeAm: "ህዳር 19",
      glint: { x: 531, y: 425, width: 960, height: 1280 },
    },
    // Two little clips from the promise day, taped onto the cover and playing on a loop.
    coverClips: [
      {
        src: "/videos/promise-day-02.mp4",
        poster: "/videos/posters/promise-day-02.jpg",
        title: "The ring goes on",
      },
      {
        src: "/videos/promise-day-01.mp4",
        poster: "/videos/posters/promise-day-01.jpg",
        title: "Showing it off",
      },
    ],
    // A page of its own for the white-gown clip, right after this cover.
    videoPage: {
      clip: {
        src: "/videos/cover-gown.mp4",
        poster: "/videos/posters/cover-gown.jpg",
        title: "Like a princess",
      },
      eyebrow: "A dream 💍🤍" ,
      title: "Marrying you was my dream 💍",
      note: "One twirl in that white gown, and I could see the whole story.",
      photos: [
        {
          image: "/memories/dream/gown-01.jpg",
          thumbnail: "/memories/dream/thumbs/gown-01.jpg",
          title: "Twirling in white",
          caption: "The gown filling the whole room, and your smile filling my heart.",
          alt: "Her in a sweeping white ball gown, smiling in a bridal boutique",
          position: "50% 30%",
        },
        {
          image: "/memories/dream/gown-02.jpg",
          thumbnail: "/memories/dream/thumbs/gown-02.jpg",
          title: "A bride smile",
          caption: "A sparkling gown, a little tiara, and the brightest smile.",
          alt: "Her in a sparkling off-shoulder gown and tiara, holding out the skirt",
          position: "50% 20%",
        },
      ],
    },
    spreadPages: {
      2: {
        // Two groups on one page: the texts, then the video calls.
        groups: [
          { title: "My favourite texts", note: "The words we kept.", count: 2 },
          { title: "Our video calls", note: "The calls that made the distance smaller." },
        ],
      },
      1: {
        eyebrow: "Kisses",
        title: "The feeling ❤️",
        note: "Every kiss on the cheek said what words never had to.",
      },
    },
    // Where the promise ring went on: a small keepsake print taped onto this cover.
    keepsake: {
      image: "/memories/chapter-03/mado-hotel.jpg",
      thumbnail: "/memories/chapter-03/thumbs/mado-hotel.jpg",
      title: "Mado Hotel",
      date: "ህዳር 19",
      note: "Our special place.",
      caption: "Mado Hotel: the place we vowed our love with our words and our hearts.",
      alt: "The front of Mado Hotel seen through a car window, gold balloons at the entrance",
    },
    coverAlt: "Her in a long black dress in a hotel lobby, beaming and showing off her promise ring",
    timelineImage: "/memories/chapter-03/thumbs/she-said-yes.jpg",
    // Zoom in on her face in the small journey-page photo.
    timelinePosition: "48% 18%",
    timelineZoom: 1.35,
    theme: "light",
    highlights: ["The promise ring💍", "Our first anniversary ❤️", "Our day ✨", "Golden evenings 💕"],
  },
  {
    id: "chapter-03",
    number: "03",
    title: "Little Moments, Big Memories ",
    titleAm: "ትናንሽ ጊዜያት፣ ትልልቅ ትዝታዎች ",
    milestone: "The Adventures",
    caption:
      "It was never just about the places we explored, but the memories we created along the way, memories that time can never fade. ✨",
    description:
      "Trips, Graduation and dinner reservations, wrong turns that became the best part of the day. The everyday became unforgettable, one small moment at a time.",
    timelineNote: "Trips, birthdays, dinners, and the everyday adventures in between.",
    cover: "/images/covers/chapter-02.jpg",
    coverBlur: "/images/covers/chapter-02-blur.jpg",
    coverPosition: "44% 50%",
    // Two little clips from Dubai, taped onto the cover and playing on a loop.
    coverClips: [
      {
        src: "/videos/dubai-clip-01.mp4",
        poster: "/videos/posters/dubai-clip-01.jpg",
        title: "By the fountains",
      },
      {
        src: "/videos/dubai-clip-02.mp4",
        poster: "/videos/posters/dubai-clip-02.jpg",
        title: "Top of the world",
      },
    ],
    coverAlt: "The two of us on a beach at night, arm in arm, looking across the water at a glowing hotel",
    timelineImage: "/memories/chapter-02/thumbs/together-02.jpg",
    theme: "light",
    highlights: ["Trips & travels 🌍", "Birthdays 🎂", "Dinner dates 🍽️", "Beautiful places 🌸"],
    spreadPages: {
      3: {
        eyebrow: "A day up the mountain 🤍",
        title: "Entoto",
        note: "red rocks, and our names left behind on the hillside.",
      },
      1: {
        eyebrow: "Our first trip 🤍",
        title: "Yaya Village",
        note: "The first of many trips, and the one that started them all.",
      },
      2: {
        eyebrow: "Valentine's Day ❤️",
        title: "Debre Zeit",
        note: "From the road there to the water, a whole day of us.",
      },
      4: {
        eyebrow: "Graduation day🎓",
        title: "We did it, together🤝",
        note: "one proud day to show for it.",
      },
      5: {
        eyebrow: "Our Dubai trip ✈️",
        title: "Dubai",
        note: "Yachts and glass floors, desert sand and turquoise sea. Every day felt like a dream 💛",
      },
      6: {
        eyebrow: "Dubai by Day & night",
        title: "City of lights",
        note: "Glowing towers and late walks, and you were still my favourite view 💚",
      },
    },
    // Background photo for the "A little note" page that closes this chapter.
    closingNoteImage: "/images/note-its-your-space.jpg",
    closingNoteImagePosition: "52% 62%",
    closingNote:
      "Of all the photographs, these are the memories I find myself revisiting time and time again. Grateful for every moment, every smile, and every memory we created together. 🤍❤️",
  },
];

export function getChapter(id: string) {
  return chapters.find((chapter) => chapter.id === id);
}
