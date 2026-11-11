// A table, to compare values down its columns: native, named, each row titled by a header of its own, values at the
// end. In a card it runs edge to edge; loose on a page its text lines up with the page. Narrow, it hides the columns
// the app marks, and scrolls in an area of its own. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import {
  type ComponentProps,
  type ReactNode,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

// Its name, which a screen reader says on entering it: a label, a heading it points to, or its caption.
type TableName =
  | { "aria-label": string; "aria-labelledby"?: never; caption?: never }
  | { "aria-labelledby": string; "aria-label"?: never; caption?: never }
  | { caption: ReactNode; "aria-label"?: never; "aria-labelledby"?: never };

type Align = "start" | "end";
// Below which width of the table's own area a column hides, as Tailwind names container sizes.
type Width = "sm" | "md" | "lg";

const aligns = { start: "text-start", end: "text-end" };
const hides = {
  sm: "@max-sm/table:hidden",
  md: "@max-md/table:hidden",
  lg: "@max-lg/table:hidden",
};
// A table's ends: 12 px loose on a page, where its area reaches out as much, and 20 px in a card, lined up with its
// title.
const ends =
  "first:ps-3 last:pe-3 in-data-[slot=card]:first:ps-5 in-data-[slot=card]:last:pe-5";

function Table({
  caption,
  className,
  children,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  ...props
}: Omit<ComponentProps<"table">, "aria-label" | "aria-labelledby"> &
  TableName) {
  const captionId = useId();
  const area = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  // Only an area that scrolls takes focus, so the keyboard can scroll it, and its name; one that fits adds no stop.
  useLayoutEffect(() => {
    const element = area.current as HTMLDivElement;
    const measure = () =>
      setOverflows(element.scrollWidth > element.clientWidth);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(element.firstElementChild as Element);
    return () => observer.disconnect();
  }, []);
  const named =
    caption === undefined
      ? { "aria-label": label, "aria-labelledby": labelledBy }
      : { "aria-labelledby": captionId };

  return (
    <div
      className="@container/table -mx-3 scroll-shadows overflow-x-auto in-data-[slot=card]:mx-0"
      data-slot="table-container"
      ref={area}
      {...(overflows ? { role: "region", tabIndex: 0, ...named } : {})}
    >
      <table
        aria-label={label}
        aria-labelledby={labelledBy}
        className={cn(
          "w-full caption-bottom text-sm [&_tbody_:is([data-slot=amount],[data-slot=percent],[data-slot=quantity])]:font-normal",
          className,
        )}
        data-slot="table"
        {...props}
      >
        {caption === undefined ? null : (
          <caption
            className="mt-4 text-sm text-muted-foreground"
            id={captionId}
          >
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  );
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

function TableBody({ className, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
}

function TableRow({ className, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      className={cn("border-b", className)}
      data-slot="table-row"
      {...props}
    />
  );
}

// A column's header, or with scope="row", a row's title, which stays at the table's start while it scrolls.
function TableHead({
  className,
  scope,
  align = "start",
  hideBelow,
  ...props
}: Omit<ComponentProps<"th">, "align"> & { align?: Align; hideBelow?: Width }) {
  return (
    <th
      className={cn(
        ends,
        aligns[align],
        hideBelow && hides[hideBelow],
        scope === "row"
          ? "sticky start-0 min-w-32 bg-(--surface) px-3 py-3 align-middle font-normal"
          : "h-9 px-3 align-middle type-label whitespace-nowrap text-muted-foreground first:sticky first:start-0 first:bg-(--surface)",
        className,
      )}
      data-slot="table-head"
      scope={scope}
      {...props}
    />
  );
}

function TableCell({
  className,
  align = "start",
  hideBelow,
  ...props
}: Omit<ComponentProps<"td">, "align"> & { align?: Align; hideBelow?: Width }) {
  return (
    <td
      className={cn(
        "px-3 py-3 align-middle",
        ends,
        aligns[align],
        hideBelow && hides[hideBelow],
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
