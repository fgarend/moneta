// A table, to compare values down its columns: native, named, each row titled by a header of its own, values at the
// end. In a card it runs edge to edge; loose on a page its text lines up with the page. Narrow, it hides the columns
// the app marks, and scrolls in an area of its own. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
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
import {
  Button as AriaButton,
  type SortDescriptor,
} from "react-aria-components";
import { Button } from "#components/button";
import { Checkbox } from "#components/checkbox";

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

// Which rows are open, and the children each parent has; which are selected, and which have a box here; by the
// rows' keys.
interface TableState {
  expanded: Set<string>;
  toggle: (key: string) => void;
  children: Map<string, string[]>;
  adopt: (parent: string, child: string) => () => void;
  selected: Set<string>;
  choose: (key: string, isSelected: boolean, isRange: boolean) => void;
  chooseShown: () => void;
  shown: Set<string>;
  show: (key: string) => () => void;
  sort: SortDescriptor | undefined;
  onSortChange: ((sort: SortDescriptor) => void) | undefined;
}

const TableContext = createContext<TableState | null>(null);

// A set of keys held by the app, or by the table from its defaults, and told to the app on each change.
function useKeys(
  held: Iterable<string> | undefined,
  defaults: Iterable<string>,
  onChange: ((keys: Set<string>) => void) | undefined,
): [Set<string>, (keys: Set<string>) => void] {
  const [own, setOwn] = useState(() => new Set(defaults));
  const keys = held === undefined ? own : new Set(held);
  const change = (next: Set<string>) => {
    setOwn(next);
    onChange?.(next);
  };
  return [keys, change];
}

// Keys a part tells the table it has while it is drawn, as children their parent or boxes the rows shown.
function useRegistry<T>(
  add: (all: T, key: string, isAdding: boolean) => T,
  empty: T,
): [T, (key: string) => () => void] {
  const [all, setAll] = useState(empty);
  const register = useCallback(
    (key: string) => {
      setAll((current) => add(current, key, true));
      return () => setAll((current) => add(current, key, false));
    },
    [add],
  );
  return [all, register];
}

function addChild(
  all: Map<string, string[]>,
  link: string,
  isAdding: boolean,
): Map<string, string[]> {
  const [parent, child] = link.split(" ") as [string, string];
  const next = new Map(all);
  const kept = (next.get(parent) ?? []).filter((id) => id !== child);
  next.set(parent, isAdding ? [...kept, child] : kept);
  return next;
}

function addKey(all: Set<string>, key: string, isAdding: boolean): Set<string> {
  const next = new Set(all);
  if (isAdding) {
    next.add(key);
  } else {
    next.delete(key);
  }
  return next;
}

function toggled(
  keys: Set<string>,
  changed: string[],
  isOn: boolean,
): Set<string> {
  const next = new Set(keys);
  for (const key of changed) {
    if (isOn) {
      next.add(key);
    } else {
      next.delete(key);
    }
  }
  return next;
}

// A part of a table outside one says so, rather than draw a row no table knows.
function useTable(part: string): TableState {
  const table = useContext(TableContext);
  if (table === null) {
    throw new Error(`${part} must be used within a Table.`);
  }
  return table;
}

// The current row's bar: 3 px of --primary at the start of its first cell, which sticks or is set relative, so it
// moves none of its text, as a border on a row of a table's collapsed borders would.
const currentBar =
  "in-aria-[current=true]:first:before:absolute in-aria-[current=true]:first:before:inset-y-0 in-aria-[current=true]:first:before:start-0 in-aria-[current=true]:first:before:w-0.75 in-aria-[current=true]:first:before:bg-primary";

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
  selectedKeys,
  defaultSelectedKeys = [],
  onSelectionChange,
  sortDescriptor,
  onSortChange,
  stickyHeader = false,
  density = "default",
  ...props
}: Omit<ComponentProps<"table">, "aria-label" | "aria-labelledby"> &
  TableName & {
    // The keys of the rows whose children show, held by the app.
    expandedKeys?: Iterable<string>;
    // The same, held by the table from the start.
    defaultExpandedKeys?: Iterable<string>;
    onExpandedChange?: (keys: Set<string>) => void;
    // The keys of the rows selected, held by the app, with those of rows on other pages.
    selectedKeys?: Iterable<string>;
    // The same, held by the table from the start.
    defaultSelectedKeys?: Iterable<string>;
    onSelectionChange?: (keys: Set<string>) => void;
    // A header that stays in view while the rows scroll, in a place that limits the table's height.
    stickyHeader?: boolean;
    // Rows of about 44 px, or 36 where many rows are compared at once.
    density?: "default" | "compact";
    // The column the rows are sorted by, and which way, held by the app, which sorts them.
    sortDescriptor?: SortDescriptor;
    onSortChange?: (sort: SortDescriptor) => void;
  }) {
  const captionId = useId();
  const [expanded, setExpanded] = useKeys(
    expandedKeys,
    defaultExpandedKeys,
    onExpandedChange,
  );
  const toggle = (key: string) =>
    setExpanded(toggled(expanded, [key], !expanded.has(key)));
  // A child row tells its parent's key and its own id, so the parent's button can point at it.
  const [children, register] = useRegistry(addChild, new Map());
  const adopt = useCallback(
    (parent: string, child: string) => register(`${parent} ${child}`),
    [register],
  );
  const [selected, setSelected] = useKeys(
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
  );
  // The rows with a box here, which the header's box takes, and the last box clicked, where a range starts.
  const [shown, show] = useRegistry(addKey, new Set<string>());
  const anchor = useRef<string>(undefined);
  const choose = (key: string, isSelected: boolean, isRange: boolean) => {
    const order = [
      ...(area.current as HTMLDivElement).querySelectorAll<HTMLElement>(
        '[data-slot="table-select"]',
      ),
    ].map((box) => box.dataset["key"]);
    const from = order.indexOf(anchor.current);
    const to = order.indexOf(key);
    const range =
      isRange && from !== -1
        ? (order.slice(Math.min(from, to), Math.max(from, to) + 1) as string[])
        : [key];
    anchor.current = key;
    setSelected(toggled(selected, range, isSelected));
  };
  const chooseShown = () =>
    setSelected(
      toggled(
        selected,
        [...shown],
        ![...shown].every((key) => selected.has(key)),
      ),
    );
  const area = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  // Only an area that scrolls takes focus, so the keyboard can scroll it, and its name; one that fits adds no stop.
  useLayoutEffect(() => {
    const element = area.current as HTMLDivElement;
    const measure = () =>
      setOverflows(
        element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(element.firstElementChild as Element);
    return () => observer.disconnect();
  }, []);
  // A row focused under a sticky header scrolls clear of it.
  useLayoutEffect(() => {
    if (!stickyHeader) {
      return;
    }
    const element = area.current as HTMLDivElement;
    element.addEventListener("focusin", clearHeader);
    return () => element.removeEventListener("focusin", clearHeader);
  }, [stickyHeader]);
  const named =
    caption === undefined
      ? { "aria-label": label, "aria-labelledby": labelledBy }
      : { "aria-labelledby": captionId };

  return (
    <div
      className={cn(
        "@container/table -mx-3 scroll-shadows overflow-x-auto in-data-[slot=card]:mx-0",
        // With a sticky header it fills its place and scrolls in it, clear of the header's 36 px when a row takes focus;
        // without, it grows with its rows.
        stickyHeader ? "max-h-full scroll-pt-9" : "shrink-0",
      )}
      data-slot="table-container"
      data-sticky-header={stickyHeader ? true : undefined}
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
        data-density={density}
        data-has-children={children.size > 0 ? true : undefined}
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
        <TableContext.Provider
          value={{
            expanded,
            toggle,
            children,
            adopt,
            selected,
            choose,
            chooseShown,
            shown,
            show,
            sort: sortDescriptor,
            onSortChange,
          }}
        >
          {rows}
        </TableContext.Provider>
      </table>
    </div>
  );
}

// What a sticky header covers of the element just focused, scrolled clear, as Safari 26 and before take no scroll
// padding into account when focus moves in an area.
function clearHeader(event: FocusEvent): void {
  const element = event.currentTarget as HTMLElement;
  // A header's cell, which sticks, as the header's group itself scrolls away.
  const header = element.querySelector("thead th");
  const target = event.target as Element;
  if (header === null || target.closest("tbody") === null) {
    return;
  }
  const covered =
    header.getBoundingClientRect().bottom - target.getBoundingClientRect().top;
  if (covered > 0) {
    element.scrollTop -= covered;
  }
}

function TableHeader({ className, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      className={cn(
        // A sticky header draws its own line, which stays with it.
        "[&_tr]:border-b in-data-sticky-header:[&_tr]:border-b-0",
        className,
      )}
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
  const { expanded, adopt, selected } = useTable("TableRow");
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
          // A row's fill: its state, selected or current, over the hover of a row that opens or selects.
          "border-b bg-(--row-fill) [--row-fill:var(--row-state,var(--row-hover))] has-[th[scope=row]_a[href]]:cursor-pointer has-[th[scope=row]_a[href]]:hover:[--row-hover:color-mix(in_oklab,var(--muted)_50%,transparent)] has-data-[slot=table-select]:hover:[--row-hover:color-mix(in_oklab,var(--muted)_50%,transparent)] data-selected:[--row-state:var(--muted)] aria-[current=true]:[--row-state:var(--muted)]",
          className,
        )}
        data-selected={
          rowKey !== undefined && selected.has(rowKey) ? true : undefined
        }
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

// A column's header, or with scope="row", a row's title, which stays at the table's start while it scrolls, after the
// boxes that select rows.
function TableHead({
  className,
  scope,
  align = "start",
  hideBelow,
  hideHeader = false,
  allowsSorting = false,
  id: columnKey,
  children,
  ...props
}: Omit<ComponentProps<"th">, "align" | "id"> & {
  align?: Align;
  hideBelow?: Width;
  // The header of a column of controls, which screen readers hear and eyes do not.
  hideHeader?: boolean;
  // A column the rows can be sorted by, by its key, its id.
  allowsSorting?: boolean;
  id?: string;
}) {
  const row = useContext(RowContext);
  const table = useTable("TableHead");
  if (allowsSorting && table.onSortChange === undefined) {
    throw new Error("TableHead allowsSorting needs onSortChange on its Table.");
  }
  const direction =
    columnKey !== undefined && table.sort?.column === columnKey
      ? table.sort.direction
      : undefined;
  const sortable =
    allowsSorting && columnKey !== undefined ? (
      <SortButton
        align={align}
        direction={direction}
        onPress={() =>
          table.onSortChange?.({
            column: columnKey,
            direction: direction === "ascending" ? "descending" : "ascending",
          })
        }
      >
        {children}
      </SortButton>
    ) : (
      children
    );
  const hidden = hideHeader ? (
    <span className="sr-only">{sortable}</span>
  ) : (
    sortable
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
          ? cn(
              "sticky start-0 z-10 min-w-32 px-3 py-3 align-middle font-normal in-data-[density=compact]:py-2",
              currentBar,
              "sticky-fill",
              // After a column of boxes that sticks too: the box and its start, 12 px loose and 20 in a card.
              "in-[tr:has([data-slot=table-select])]:start-7 in-data-[slot=card]:in-[tr:has([data-slot=table-select])]:start-9",
            )
          : cn(
              "h-9 px-3 align-middle type-label whitespace-nowrap text-muted-foreground first:sticky first:start-0 first:bg-(--surface) has-data-[slot=table-select-all]:w-px has-data-[slot=table-select-all]:pe-0",
              // Stuck to the top of its area, over the rows and their titles, with its own line, as a collapsed border
              // stays behind.
              "in-data-sticky-header:sticky in-data-sticky-header:top-0 in-data-sticky-header:z-20 in-data-sticky-header:bg-(--surface) in-data-sticky-header:after:absolute in-data-sticky-header:after:inset-x-0 in-data-sticky-header:after:bottom-0 in-data-sticky-header:after:h-px in-data-sticky-header:after:bg-border",
              // Once rows have children, the titles' header keeps their button's room too, 40 px, so it stands over their
              // text: the first column, or the second after the boxes.
              "in-data-has-children:first:not-has-data-[slot=table-select-all]:ps-13 in-data-[slot=card]:in-data-has-children:first:not-has-data-[slot=table-select-all]:ps-15 in-data-has-children:in-[tr:has([data-slot=table-select-all])]:nth-2:ps-13",
              "in-[tr:has([data-slot=table-select-all])]:nth-2:sticky in-[tr:has([data-slot=table-select-all])]:nth-2:start-7 in-[tr:has([data-slot=table-select-all])]:nth-2:bg-(--surface) in-data-[slot=card]:in-[tr:has([data-slot=table-select-all])]:nth-2:start-9",
            ),
        className,
      )}
      aria-sort={direction}
      data-slot="table-head"
      id={scope === "row" ? row.titleId : undefined}
      scope={scope}
      {...props}
    >
      {content}
    </th>
  );
}

// A sortable header's button, named by its text: a quiet up and down mark, or the sorted one's arrow in the text's
// colour, before the text in a column at the end, so the text lines up with the column.
function SortButton({
  align,
  direction,
  onPress,
  children,
}: {
  align: Align;
  direction: SortDescriptor["direction"] | undefined;
  onPress: () => void;
  children: ReactNode;
}) {
  const marks = {
    ascending: <ArrowUpIcon aria-hidden="true" />,
    descending: <ArrowDownIcon aria-hidden="true" />,
  };
  const mark =
    direction === undefined ? (
      <ChevronsUpDownIcon aria-hidden="true" />
    ) : (
      marks[direction]
    );
  return (
    <AriaButton
      className={cn(
        // A block centred in the cell, as a header's text is, so a mark before the text sets no baseline of its own.
        "flex min-h-6 w-fit cursor-pointer items-center gap-1 rounded-sm outline-none hover:text-foreground data-focus-visible:ring-3 data-focus-visible:ring-ring/50 [&_svg]:size-3.5 [&_svg]:shrink-0",
        align === "end" && "ms-auto",
        direction !== undefined && "text-foreground",
      )}
      data-slot="table-sort"
      onPress={onPress}
    >
      {align === "end" ? (
        <>
          {mark}
          <span>{children}</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {mark}
        </>
      )}
    </AriaButton>
  );
}

function Room() {
  return <span aria-hidden="true" className="w-8 shrink-0" />;
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
      // 32 px that take less than the text's height, so the row keeps its own.
      className="-my-2"
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
        "has-data-[slot=table-select]:sticky-fill in-aria-[current=true]:first:not-has-data-[slot=table-select]:relative",
        currentBar,
        "px-3 py-3 align-middle in-data-[density=compact]:py-2 has-data-[slot=table-row-action]:w-px has-data-[slot=table-select]:sticky has-data-[slot=table-select]:start-0 has-data-[slot=table-select]:z-10 has-data-[slot=table-select]:w-px has-data-[slot=table-select]:pe-0",
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
          "border-b border-border-strong [&>*]:pt-8 [&>*]:pb-1.5 in-[tbody:first-of-type]:[&>*]:pt-3 in-data-[density=compact]:[&>*]:pt-5 in-data-[density=compact]:in-[tbody:first-of-type]:[&>*]:pt-2 [&>th]:text-xs [&>th]:font-semibold [&>th]:text-muted-foreground",
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
  className,
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
      // 32 px that take less than the text's height, so the row keeps its own, as a block, which sets no baseline.
      className={cn("-my-2 flex", className)}
      data-slot="table-row-action"
      id={id}
      size="icon-sm"
      variant="ghost"
      {...props}
    />
  );
}

// A row's box, in a cell of its own before the row's title, which names it. A row with no title or no id throws, as
// the box would have no name, or nothing to select. Shift selects from the last box clicked.
function TableSelect() {
  const { titleId, rowKey } = useContext(RowContext);
  const { selected, choose, show } = useTable("TableSelect");
  const isRange = useRef(false);
  if (rowKey === undefined) {
    throw new Error("TableSelect needs its row's id.");
  }
  useLayoutEffect(() => {
    if (document.getElementById(titleId) === null) {
      throw new Error(
        'TableSelect needs its row titled by TableHead scope="row".',
      );
    }
  }, [titleId]);
  useLayoutEffect(() => show(rowKey), [show, rowKey]);
  return (
    <span
      className="flex"
      data-key={rowKey}
      data-slot="table-select"
      onKeyDownCapture={() => {
        isRange.current = false;
      }}
      onPointerDownCapture={(event) => {
        isRange.current = event.shiftKey;
      }}
    >
      <Checkbox
        aria-labelledby={titleId}
        isSelected={selected.has(rowKey)}
        onChange={(isSelected) => choose(rowKey, isSelected, isRange.current)}
      />
    </span>
  );
}

// The header's box, over the rows shown, named by the app once: checked when all are, partly when some are. Rows
// selected elsewhere, as on other pages, stay as they are.
function TableSelectAll({ "aria-label": label }: { "aria-label": string }) {
  const { selected, shown, chooseShown } = useTable("TableSelectAll");
  const count = [...shown].filter((key) => selected.has(key)).length;
  return (
    <span className="flex" data-slot="table-select-all">
      <Checkbox
        aria-label={label}
        isIndeterminate={count > 0 && count < shown.size}
        isSelected={count > 0 && count === shown.size}
        onChange={chooseShown}
      />
    </span>
  );
}

// Over a table with rows selected: the app's count, which a screen reader hears as it changes, and the app's actions,
// in a fill lined up with the table's ends. With none selected it shows nothing, and its status stays to be heard.
function TableSelectionBar({
  className,
  count,
  label,
  children,
  ...props
}: ComponentProps<"div"> & {
  // How many rows are selected, here and on other pages.
  count: number;
  // The app's words for it, as "2 selected".
  label: string;
}) {
  const isShown = count > 0;
  return (
    <div
      className={cn(
        isShown
          ? "-mx-3 flex min-h-10 flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-muted px-3 py-1 in-data-[slot=card]:mx-0 in-data-[slot=card]:rounded-none in-data-[slot=card]:px-5"
          : "contents",
        className,
      )}
      data-slot="table-selection-bar"
      {...props}
    >
      <p className={isShown ? "text-sm font-medium" : "sr-only"} role="status">
        {isShown ? label : ""}
      </p>
      {isShown ? <div className="ms-auto flex gap-2">{children}</div> : null}
    </div>
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
  TableSelect,
  TableSelectAll,
  TableSelectionBar,
};
