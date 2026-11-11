// A table, to compare values down its columns: native, named, each row titled by a header of its own, values at the
// end. In a card it runs edge to edge; loose on a page its text lines up with the page. Narrow, it hides the columns
// the app marks, and scrolls in an area of its own. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import { ChevronRightIcon } from "lucide-react";
import {
  type ComponentProps,
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
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
// The row a part sits in: its title, which names its controls, its key, and its parent's when it is a child.
const RowContext = createContext<{
  titleId: string;
  rowKey?: string | undefined;
  parentKey?: string | undefined;
}>({ titleId: "" });

// Which rows are open, and the children each parent has, by the rows' keys.
interface TableState {
  expanded: Set<string>;
  toggle: (key: string) => void;
  children: Map<string, string[]>;
  adopt: (parent: string, child: string) => () => void;
}

const TableContext = createContext<TableState | null>(null);

// A part of a table outside one says so, rather than draw a row no table knows.
function useTable(part: string): TableState {
  const table = useContext(TableContext);
  if (table === null) {
    throw new Error(`${part} must be used within a Table.`);
  }
  return table;
}

// A table's ends: 12 px loose on a page, where its area reaches out as much, and 20 px in a card, lined up with its
// title.
const ends =
  "first:ps-3 last:pe-3 in-data-[slot=card]:first:ps-5 in-data-[slot=card]:last:pe-5";

function Table({
  caption,
  className,
  children: rows,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  expandedKeys,
  defaultExpandedKeys = [],
  onExpandedChange,
  ...props
}: Omit<ComponentProps<"table">, "aria-label" | "aria-labelledby"> &
  TableName & {
    // The keys of the rows whose children show, held by the app.
    expandedKeys?: Iterable<string>;
    // The same, held by the table from the start.
    defaultExpandedKeys?: Iterable<string>;
    onExpandedChange?: (keys: Set<string>) => void;
  }) {
  const captionId = useId();
  const [own, setOwn] = useState(() => new Set(defaultExpandedKeys));
  const expanded = expandedKeys === undefined ? own : new Set(expandedKeys);
  const toggle = (key: string) => {
    const next = new Set(expanded);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setOwn(next);
    onExpandedChange?.(next);
  };
  const [children, setChildren] = useState(new Map<string, string[]>());
  // A child row tells its parent's key and its own id, so the parent's button can point at it.
  const adopt = useCallback((parent: string, child: string) => {
    const change = (add: boolean) =>
      setChildren((all) => {
        const next = new Map(all);
        const kept = (next.get(parent) ?? []).filter((id) => id !== child);
        next.set(parent, add ? [...kept, child] : kept);
        return next;
      });
    change(true);
    return () => change(false);
  }, []);
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
        <TableContext.Provider value={{ expanded, toggle, children, adopt }}>
          {rows}
        </TableContext.Provider>
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

// What a click on a row leaves alone: a control of its own.
const controlTargets =
  "a, button, input, select, textarea, label, [role=button], [role=checkbox], [role=menuitem]";

// A click on an empty part of a row goes to the link in its title, with its keys, so a pointer has the whole row while
// keyboards and screen readers keep one real link; a click that is part of selecting text stays where it is.
function openTitle(event: MouseEvent<HTMLTableRowElement>): void {
  const link = event.currentTarget.querySelector('th[scope="row"] a[href]');
  const selection = document.getSelection() as Selection;
  if (
    link === null ||
    (event.target as Element).closest(controlTargets) !== null ||
    !selection.isCollapsed
  ) {
    return;
  }
  link.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      ctrlKey: event.ctrlKey,
      metaKey: event.metaKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
    }),
  );
}

function TableRow({
  className,
  onClick,
  id: rowKey,
  parentId: parentKey,
  ...props
}: Omit<ComponentProps<"tr">, "id"> & {
  // The row's key, by which the table keeps it open or selected, and its children find it.
  id?: string;
  // The key of the row this one is a child of, which it shows under while that row is open.
  parentId?: string;
}) {
  const titleId = useId();
  const domId = useId();
  const { expanded, adopt } = useTable("TableRow");
  useLayoutEffect(
    () => (parentKey === undefined ? undefined : adopt(parentKey, domId)),
    [parentKey, domId, adopt],
  );
  return (
    <RowContext.Provider value={{ titleId, rowKey, parentKey }}>
      <tr
        hidden={parentKey !== undefined && !expanded.has(parentKey)}
        id={domId}
        className={cn(
          "border-b has-[th[scope=row]_a[href]]:cursor-pointer has-[th[scope=row]_a[href]]:hover:bg-muted/50",
          className,
        )}
        data-slot="table-row"
        onClick={(event) => {
          openTitle(event);
          onClick?.(event);
        }}
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
  const table = useTable("TableHead");
  const hidden = hideHeader ? (
    <span className="sr-only">{children}</span>
  ) : (
    children
  );
  // Once a row has children, every row's title keeps the room of their button, so titles line up, and a child's is
  // set in by as much again.
  const content =
    scope === "row" && table.children.size > 0 ? (
      <span className="flex items-center gap-2">
        {row.parentKey === undefined ? null : <Room />}
        <Disclosure rowKey={row.rowKey} titleId={row.titleId} />
        {hidden}
      </span>
    ) : (
      hidden
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

function Room() {
  return <span aria-hidden="true" className="size-8 shrink-0" />;
}

// The button that shows a row's children, named by the row's title, or the room it takes in a row with none.
function Disclosure({
  rowKey,
  titleId,
}: {
  rowKey: string | undefined;
  titleId: string;
}) {
  const { expanded, toggle, children } = useTable("TableHead");
  const controls = rowKey === undefined ? [] : (children.get(rowKey) ?? []);
  if (rowKey === undefined || controls.length === 0) {
    return <Room />;
  }
  const isOpen = expanded.has(rowKey);
  return (
    <Button
      aria-controls={controls.join(" ")}
      aria-expanded={isOpen}
      aria-labelledby={titleId}
      data-slot="table-expand"
      onPress={() => toggle(rowKey)}
      size="icon-sm"
      variant="ghost"
    >
      <ChevronRightIcon className={isOpen ? "rotate-90" : undefined} />
    </Button>
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
