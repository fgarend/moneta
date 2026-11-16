"use client";

import { cn } from "cn";
import { type ComponentProps, useLayoutEffect, useRef, useState } from "react";

// Its name, one of the two, which a screen reader hears when it takes focus to be scrolled.
type Named =
  | { "aria-label": string; "aria-labelledby"?: never }
  | { "aria-labelledby": string; "aria-label"?: never };

/**
 * An area that fills what is left of a place of fixed height, as a panel's body, and scrolls there, with a shadow at
 * each end where it goes on.
 *
 * **Use it for**
 *
 * - A long list or text in a place whose height is fixed, as a panel's body, a card as tall as the one beside it, or
 *   a column of the screen.
 * - Its name, in `aria-label` or `aria-labelledby`, as the title above it, which a screen reader hears when it takes
 *   focus to be scrolled.
 *
 * **Not recommended**
 *
 * - A place that grows with what it holds, as a page's own flow: it never scrolls there, so let the page scroll.
 * - A table: `Table` scrolls in its own area.
 * - A menu, a select or a sidebar: each scrolls its own list.
 */
function ScrollArea({
  className,
  children,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  ...props
}: Omit<ComponentProps<"div">, "aria-label" | "aria-labelledby"> & Named) {
  const area = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  // Only an area that scrolls takes focus, so the keyboard can scroll it, and its name; one that fits adds no stop.
  useLayoutEffect(() => {
    const element = area.current as HTMLDivElement;
    const measure = () =>
      setOverflows(
        element.scrollHeight > element.clientHeight ||
          element.scrollWidth > element.clientWidth,
      );
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const child of element.children) {
      observer.observe(child);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-slot="scroll-area"
      className={cn(
        "relative scroll-shadows-xy overflow-auto outline-none",
        className,
      )}
      ref={area}
      {...(overflows
        ? {
            role: "region",
            tabIndex: 0,
            "aria-label": label,
            "aria-labelledby": labelledBy,
          }
        : {})}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
