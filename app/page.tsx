import Deck, { type SlideSpec } from "@/components/deck/Deck";
import MotionProvider from "@/components/MotionProvider";
import ChapterCoverSlide from "@/components/slides/ChapterCoverSlide";
import ClosingSlide from "@/components/slides/ClosingSlide";
import FeaturedPhotoSlide from "@/components/slides/FeaturedPhotoSlide";
import IntroSlide from "@/components/slides/IntroSlide";
import JourneySlide from "@/components/slides/JourneySlide";
import NoteSlide from "@/components/slides/NoteSlide";
import ScrollSlide from "@/components/slides/ScrollSlide";
import SpreadSlide from "@/components/slides/SpreadSlide";
import VideoPageSlide from "@/components/slides/VideoPageSlide";
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
    if (chapter.videoPage) {
      chapterSlides.push({
        id: `${chapter.id}-video`,
        tone: "dark",
        label,
        group: chapter.id,
        content: <VideoPageSlide chapter={chapter} page={chapter.videoPage} />,
      });
    }
    const featuredPage = (memory: (typeof chapterMemories)[number]): SlideSpec => ({
      id: `${chapter.id}-${memory.id}`,
      tone,
      label: memory.title,
      group: chapter.id,
      content: <FeaturedPhotoSlide chapter={chapter} memory={memory} chapterMemories={chapterMemories} />,
    });
    chapterMemories
      .filter((m) => m.featured && m.featuredAt !== "end")
      .forEach((memory) => chapterSlides.push(featuredPage(memory)));
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
    chapterMemories
      .filter((m) => m.featured && m.featuredAt === "end")
      .forEach((memory) => chapterSlides.push(featuredPage(memory)));
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
            image={chapter.closingNoteImage ?? chapterMemories.at(-1)?.image ?? chapter.cover}
            position={chapter.closingNoteImagePosition}
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
      content: <ClosingSlide image="/memories/chapter-02/dubai-10.jpg" />,
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
