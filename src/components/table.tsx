// A table, to compare values down its columns: native, named, each row titled by a header of its own, values at the
// end. In a card it runs edge to edge; loose on a page its text lines up with the page. Narrow, it hides the columns
// the app marks, and scrolls in an area of its own. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "#components/button";

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
// The row a part sits in, whose title names its controls.
const RowContext = createContext({ titleId: "" });

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
          "w-full caption-bottom text-sm [&_tbody_[data-slot=table-row]_:is([data-slot=amount],[data-slot=percent],[data-slot=quantity])]:font-normal",
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
  const titleId = useId();
  return (
    <RowContext.Provider value={{ titleId }}>
      <tr
        className={cn("border-b", className)}
        data-slot="table-row"
        {...props}
      />
    </RowContext.Provider>
  );
}

// A column's header, or with scope="row", a row's title, which stays at the table's start while it scrolls.
function TableHead({
  className,
  scope,
  align = "start",
  hideBelow,
  hideHeader = false,
  children,
  ...props
}: Omit<ComponentProps<"th">, "align"> & {
  align?: Align;
  hideBelow?: Width;
  // The header of a column of controls, which screen readers hear and eyes do not.
  hideHeader?: boolean;
}) {
  const row = useContext(RowContext);
  const content = hideHeader ? (
    <span className="sr-only">{children}</span>
  ) : (
    children
  );
  return (
    <th
      className={cn(
        ends,
        aligns[align],
        hideBelow && hides[hideBelow],
        hideHeader && "w-px",
        scope === "row"
          ? "sticky start-0 min-w-32 bg-(--surface) px-3 py-3 align-middle font-normal"
          : "h-9 px-3 align-middle type-label whitespace-nowrap text-muted-foreground first:sticky first:start-0 first:bg-(--surface)",
        className,
      )}
      data-slot="table-head"
      id={scope === "row" ? row.titleId : undefined}
      scope={scope}
      {...props}
    >
      {content}
    </th>
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
        "px-3 py-3 align-middle has-data-[slot=table-row-action]:w-px",
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

// The total: its title and values at 600, under a double strong line, as accounts draw one.
function TableFooter({ className, ...props }: ComponentProps<"tfoot">) {
  return (
    <tfoot
      className={cn(
        "[&_th]:font-semibold [&_tr]:border-t-3 [&_tr]:border-b-0 [&_tr]:border-double [&_tr]:border-border-strong [&_:is([data-slot=amount],[data-slot=percent],[data-slot=quantity])]:font-semibold",
        className,
      )}
      data-slot="table-footer"
      {...props}
    />
  );
}

// A group's first row, in a body of its own: its title small, semibold and muted, its subtotals at 500 in their
// columns, 32 px above it, or 12 under the header, and a strong line under it.
function TableGroupRow({ className, ...props }: ComponentProps<"tr">) {
  const titleId = useId();
  return (
    <RowContext.Provider value={{ titleId }}>
      <tr
        className={cn(
          "border-b border-border-strong [&>*]:pt-8 [&>*]:pb-1.5 in-[tbody:first-of-type]:[&>*]:pt-3 [&>th]:text-xs [&>th]:font-semibold [&>th]:text-muted-foreground",
          className,
        )}
        data-slot="table-group-row"
        {...props}
      />
    </RowContext.Provider>
  );
}

// An action on a row: a quiet icon button of 32 px, whose name joins the app's one word to the row's title, as "Edit
// Central Market". A row with no title throws, as its action would have no name to say which row it acts on.
function TableRowAction({
  "aria-label": label,
  ...props
}: Omit<ComponentProps<typeof Button>, "aria-label" | "size" | "variant"> & {
  "aria-label": string;
}) {
  const { titleId } = useContext(RowContext);
  const id = useId();
  useLayoutEffect(() => {
    if (document.getElementById(titleId) === null) {
      throw new Error(
        `TableRowAction: "${label}" needs its row titled by TableHead scope="row".`,
      );
    }
  }, [titleId, label]);
  return (
    <Button
      aria-label={label}
      aria-labelledby={`${id} ${titleId}`}
      data-slot="table-row-action"
      id={id}
      size="icon-sm"
      variant="ghost"
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
  TableRowAction,
};
