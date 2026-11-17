import Deck, { type SlideSpec } from "@/components/deck/Deck";
import MemoryUpload from "@/components/MemoryUpload";
import MotionProvider from "@/components/MotionProvider";
import ChapterCoverSlide from "@/components/slides/ChapterCoverSlide";
import ClosingSlide from "@/components/slides/ClosingSlide";
import FeaturedPhotoSlide from "@/components/slides/FeaturedPhotoSlide";
import IntroSlide from "@/components/slides/IntroSlide";
import JourneySlide from "@/components/slides/JourneySlide";
import NoteSlide from "@/components/slides/NoteSlide";
import ScrollSlide from "@/components/slides/ScrollSlide";
import SpreadSlide from "@/components/slides/SpreadSlide";
import VideosSlide from "@/components/slides/VideosSlide";
import SpecialLetter from "@/components/SpecialLetter";
import { chapters } from "@/data/chapters";
import { getMemoriesByChapter } from "@/data/memories";
import { hero, letter, sections } from "@/data/messages";
import { chunkIntoSpreads } from "@/lib/spreads";

/**
 * The whole site is one horizontal book. Pages are generated from the files in
 * `data/`, so adding photos or chapters adds pages automatically.
 */
function buildSlides(): SlideSpec[] {
  const chapterTargets: Record<string, number> = {};
  const chapterSlides: SlideSpec[] = [];
  const offset = 2; // intro + journey come first

  for (const chapter of chapters) {
    const chapterMemories = getMemoriesByChapter(chapter.id);
    const spreads = chunkIntoSpreads(chapterMemories.filter((m) => !m.featured));
    const label = `Chapter ${chapter.number} · ${chapter.title}`;
    const tone = chapter.theme === "dark" ? "dark" : "light";

    chapterTargets[chapter.id] = offset + chapterSlides.length;
    chapterSlides.push({
      id: `${chapter.id}-cover`,
      tone: "dark",
      label,
      group: chapter.id,
      content: <ChapterCoverSlide chapter={chapter} />,
    });
    chapterMemories
      .filter((m) => m.featured)
      .forEach((memory) =>
        chapterSlides.push({
          id: `${chapter.id}-${memory.id}`,
          tone,
          label: memory.title,
          group: chapter.id,
          content: <FeaturedPhotoSlide chapter={chapter} memory={memory} chapterMemories={chapterMemories} />,
        }),
      );
    spreads.forEach((spread, i) =>
      chapterSlides.push({
        id: `${chapter.id}-spread-${i + 1}`,
        tone,
        label,
        group: chapter.id,
        content: (
          <SpreadSlide
            chapter={chapter}
            memories={spread}
            chapterMemories={chapterMemories}
            spread={i + 1}
            spreads={spreads.length}
          />
        ),
      }),
    );
    if (chapter.closingNote) {
      chapterSlides.push({
        id: `${chapter.id}-note`,
        tone: "dark",
        label,
        group: chapter.id,
        content: (
          <NoteSlide
            eyebrow={`Chapter ${chapter.number} · A little note`}
            note={chapter.closingNote}
            image={chapterMemories.at(-1)?.image ?? chapter.cover}
          />
        ),
      });
    }
  }

  return [
    { id: "intro", tone: "dark", label: hero.title, group: "intro", content: <IntroSlide /> },
    {
      id: "journey",
      tone: "light",
      label: sections.journey.eyebrow,
      group: "journey",
      content: <JourneySlide targets={chapterTargets} />,
    },
    ...chapterSlides,
    { id: "videos", tone: "light", label: sections.videos.eyebrow, group: "videos", content: <VideosSlide /> },
    {
      id: "remember",
      tone: "light",
      label: sections.remember.title,
      group: "remember",
      content: (
        <ScrollSlide className="bg-paper">
          <MemoryUpload />
        </ScrollSlide>
      ),
    },
    {
      id: "letter",
      tone: "light",
      label: letter.title,
      group: "letter",
      content: (
        <ScrollSlide className="bg-cream">
          <SpecialLetter />
        </ScrollSlide>
      ),
    },
    {
      id: "closing",
      tone: "dark",
      label: "The last page",
      group: "closing",
      content: <ClosingSlide image="/memories/chapter-03/photo-02.jpg" />,
    },
  ];
}

export default function Home() {
  return (
    <MotionProvider>
      <main>
        <Deck slides={buildSlides()} />
      </main>
    </MotionProvider>
  );
}
