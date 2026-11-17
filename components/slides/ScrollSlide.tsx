import type { ReactNode } from "react";

/** A page whose content may be taller than the screen: it scrolls vertically inside the slide. */
export default function ScrollSlide({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`no-scrollbar h-full overflow-y-auto overscroll-y-contain [mask-image:linear-gradient(to_bottom,black_calc(100%-7.5rem),transparent_calc(100%-4rem))] pb-24 ${className}`}>{children}</div>
  );
}
