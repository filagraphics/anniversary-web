"use client";

import { useMotionValue, useReducedMotion, useScroll } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DeckContext, SlideIndexContext, type SlideMeta } from "./DeckContext";
import DeckChrome from "./DeckChrome";

export type SlideSpec = SlideMeta & { content: ReactNode };

/** Does `target` sit inside an element that can still scroll vertically in `dir`? */
function canScrollInner(target: EventTarget | null, root: HTMLElement, dir?: 1 | -1) {
  let node = target instanceof Element ? target : null;
  while (node && node !== root) {
    if (node instanceof HTMLElement && node.scrollHeight > node.clientHeight + 1) {
      const overflowY = getComputedStyle(node).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        if (dir === undefined) return true;
        if (dir > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1) return true;
        if (dir < 0 && node.scrollTop > 0) return true;
      }
    }
    node = node.parentElement;
  }
  return false;
}

export default function Deck({ slides }: { slides: SlideSpec[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = Boolean(useReducedMotion());
  const total = slides.length;
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const targetRef = useRef(0);
  const width = useMotionValue(1);
  const { scrollX } = useScroll({ container: ref });

  const go = useCallback(
    (index: number) => {
      const el = ref.current;
      if (!el) return;
      const target = Math.max(0, Math.min(total - 1, index));
      targetRef.current = target;
      el.scrollTo({ left: target * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
    },
    [total, reduce],
  );
  const next = useCallback(() => go(targetRef.current + 1), [go]);
  const prev = useCallback(() => go(targetRef.current - 1), [go]);

  // Track the active slide while scrolling (native swipe, wheel or buttons).
  useEffect(() => {
    const el = ref.current!;
    let raf = 0;
    let settle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        if (i !== activeRef.current) {
          activeRef.current = i;
          setActive(i);
        }
      });
      clearTimeout(settle);
      settle = setTimeout(() => {
        targetRef.current = Math.round(el.scrollLeft / el.clientWidth);
      }, 160);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, []);

  // Keep the current slide in place when the window is resized or rotated.
  useEffect(() => {
    const el = ref.current!;
    const ro = new ResizeObserver(() => {
      width.set(el.clientWidth);
      el.scrollTo({ left: activeRef.current * el.clientWidth, behavior: "auto" });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  // Mouse wheel / vertical trackpad: one slide per gesture.
  useEffect(() => {
    const el = ref.current!;
    let last = 0;
    let fired = false;
    let innerAt = 0;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // pinch-zoom
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // horizontal: native
      const now = performance.now();
      const dir = e.deltaY > 0 ? 1 : -1;
      if (canScrollInner(e.target, el, dir)) {
        innerAt = now;
        return;
      }
      e.preventDefault();
      const newGesture = now - last > 220;
      last = now;
      if (newGesture) fired = false;
      if (fired || now - innerAt < 350 || Math.abs(e.deltaY) < 4) return;
      fired = true;
      go(targetRef.current + dir);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [go]);

  // Vertical swipes on touch screens also turn the page.
  useEffect(() => {
    const el = ref.current!;
    let sx = 0;
    let sy = 0;
    let skip = false;
    const onStart = (e: TouchEvent) => {
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      skip = e.touches.length > 1 || canScrollInner(e.target, el);
    };
    const onEnd = (e: TouchEvent) => {
      if (skip) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      if (Math.abs(dy) > 70 && Math.abs(dy) > Math.abs(dx) * 1.5) go(targetRef.current + (dy < 0 ? 1 : -1));
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [go]);

  // Keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.metaKey || e.ctrlKey) return;
      if (document.querySelector('[role="dialog"]')) return; // the lightbox handles its own keys
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, video, audio, [contenteditable='true']")) return;
      const map: Record<string, () => void> = {
        ArrowRight: next,
        PageDown: next,
        ArrowLeft: prev,
        PageUp: prev,
        Home: () => go(0),
        End: () => go(total - 1),
      };
      if (e.key === " " && (t === document.body || t === ref.current)) map[" "] = e.shiftKey ? prev : next;
      const action = map[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total]);

  // Pause any video that is no longer on screen.
  useEffect(() => {
    ref.current?.querySelectorAll("video").forEach((video) => {
      const slide = video.closest("[data-slide]");
      if (slide && Number(slide.getAttribute("data-slide")) !== active && !video.paused) video.pause();
    });
  }, [active]);

  const value = useMemo(
    () => ({ active, total, reduce, go, next, prev, scrollX, width }),
    [active, total, reduce, go, next, prev, scrollX, width],
  );
  const metas = useMemo(
    () => slides.map(({ id, tone, label, group }) => ({ id, tone, label, group })),
    [slides],
  );

  return (
    <DeckContext.Provider value={value}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        aria-label="Six Years of Memories"
        className="no-scrollbar fixed inset-0 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain"
      >
        {slides.map((slide, i) => (
          <section
            key={slide.id}
            data-slide={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${slide.label}`}
            inert={i !== active}
            className="relative h-full w-full shrink-0 snap-start snap-always overflow-hidden"
          >
            <SlideIndexContext.Provider value={i}>{slide.content}</SlideIndexContext.Provider>
          </section>
        ))}
      </div>
      <DeckChrome slides={metas} />
    </DeckContext.Provider>
  );
}
