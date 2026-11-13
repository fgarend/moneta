import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
  Children,
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import { Heading } from "react-aria-components";
import { Button } from "#components/button";
import { Progress } from "#components/progress";
import { Separator } from "#components/separator";
import { Skeleton } from "#components/skeleton";
import { deepest, SectionLevel } from "#hooks/level";
import { followTitle, rowFill } from "#hooks/row";

// Whether an item sits in a list of rows, where it is one of its items.
const InList = createContext(false);
// The item a part sits in, whose title names its action.
const ItemContext = createContext<{ titleId: string | undefined }>({
  titleId: undefined,
});

// While its rows load, the app's words for it, heard; without, nothing is said.
type ListLoading =
  | {
      /** Whether its rows load: the first time, shapes of a row; after, a running bar over the rows. */
      isLoading: boolean;
      /** The app's words for the load, which a screen reader hears. */
      loadingLabel: string;
      /** How many shapes of a row the first load draws. */
      loadingRows?: number;
    }
  | { isLoading?: never; loadingLabel?: never; loadingRows?: never };

// A list's ends: a table's, 12 px loose on a page, where it reaches as much out, and 20 px in a card.
const listEnds =
  "group/item-group -mx-3 flex flex-col in-data-[slot=card]:mx-0";

/**
 * A list of rows: one thing per row, read across, with a line between rows and no box of their own. With a title, a
 * group, as a day's: its title a heading a level below its section's, which names the list, and its total at its
 * end, as a table's groups, 12 px above the first and 32 above the next, with a strong line under it.
 */
function ItemGroup({
  className,
  title,
  total,
  isLoading,
  loadingLabel,
  loadingRows = 5,
  density = "default",
  children,
  ...props
}: Omit<ComponentProps<"ul">, "title"> &
  ListLoading & {
    /** Rows of about 64 px, or 48 where many are read at once. */
    density?: "default" | "compact";
    /** The group's title, as a day. */
    title?: ReactNode;
    /** What its rows add up to, as an Amount. */
    total?: ReactNode;
  }) {
  const level = useContext(SectionLevel);
  const titleId = useId();
  const isGroup = title !== undefined;
  const hasRows = Children.toArray(children).length > 0;
  // A list that may load, or a group, has a box around its list, which holds its title, its status and its bar.
  const isWrapped = isGroup || isLoading !== undefined;
  const list = (
    <InList.Provider value={true}>
      <ul
        aria-busy={isLoading ? true : undefined}
        aria-labelledby={isGroup ? titleId : undefined}
        className={cn(isWrapped ? "flex flex-col" : cn(listEnds, className))}
        data-density={isWrapped ? undefined : density}
        data-slot={isWrapped ? "item-list" : "item-group"}
        // biome-ignore lint/a11y/noRedundantRoles: Safari drops a list's meaning with its markers, which Tailwind removes.
        role="list"
        {...props}
      >
        {children}
        {isLoading && !hasRows ? <LoadingRows count={loadingRows} /> : null}
      </ul>
    </InList.Provider>
  );
  if (!isWrapped) {
    return list;
  }
  return (
    <div
      className={cn(
        listEnds,
        isGroup &&
          "pt-3 data-[density=compact]:pt-2 [[data-slot=item-group]~&]:pt-8 [[data-slot=item-group]~&]:data-[density=compact]:pt-5",
        className,
      )}
      data-density={density}
      data-slot="item-group"
    >
      {isGroup ? (
        <div
          className="flex items-baseline justify-between gap-3 border-b border-border-strong px-3 pb-1.5 in-data-[slot=card]:px-5"
          data-slot="item-group-header"
        >
          <Heading
            className="text-xs font-semibold text-muted-foreground"
            id={titleId}
            level={Math.min(level + 1, deepest)}
          >
            {title}
          </Heading>
          {total === undefined ? null : (
            <span className="text-sm">{total}</span>
          )}
        </div>
      ) : null}
      {isLoading === undefined ? null : (
        <p className="sr-only" role="status">
          {isLoading ? loadingLabel : ""}
        </p>
      )}
      <div className="relative">
        {isLoading && hasRows ? (
          // A reload: a thin running bar along the list's top, over its rows as they are.
          <Progress
            aria-label={loadingLabel}
            className="absolute inset-x-0 top-0 z-10 [&_[data-slot=progress-track]]:h-0.5 [&_[data-slot=progress-track]]:rounded-none"
            isIndeterminate={true}
          />
        ) : null}
        {list}
      </div>
    </div>
  );
}

// The first load's rows: the shape of a row, an icon, a title and its detail, and a value, which a screen reader skips.
function LoadingRows({ count }: { count: number }) {
  return Array.from({ length: count }, (_, row) => (
    <li
      aria-hidden="true"
      className="flex items-center gap-2.5 border-b px-3 py-3 last:border-0 in-data-[density=compact]:py-2 in-data-[slot=card]:px-5"
      data-slot="item-loading"
      // biome-ignore lint/suspicious/noArrayIndexKey: shapes with no identity of their own.
      key={row}
    >
      <Skeleton className="size-10 rounded-lg in-data-[density=compact]:size-8" />
      {/* A title's line and a description's, each as tall as its text, so the shapes stand as tall as a row. */}
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-24" />
      </div>
      <Skeleton className="h-5 w-16" />
    </li>
  ));
}

/**
 * No rows: the app's words in their place, centred and muted, under the group's title.
 */
function ItemEmpty({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "px-3 py-10 text-center text-muted-foreground in-data-[slot=card]:px-5",
        className,
      )}
      data-slot="item-empty"
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn("my-2", className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "border-transparent bg-muted/50",
      },
      size: {
        default: "gap-2.5 px-3 py-2.5",
        sm: "gap-2.5 px-3 py-2.5",
        xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// The link in an item's title, which a click anywhere empty in it follows.
const titleLink = '[data-slot="item-title"] a[href]';

/**
 * One thing, read across. In a list, a row, whose state, aria-current, and whose clicks are the row's; alone, a box.
 */
function Item({
  className,
  variant = "default",
  size = "default",
  "aria-current": current,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemVariants>) {
  const inList = useContext(InList);
  const titleId = useId();
  // The row, which a click anywhere empty in sends to its title's link: the list's item, or the item alone.
  const row = useRef<HTMLElement>(null);
  useEffect(() => {
    const element = row.current as HTMLElement;
    const follow = (event: MouseEvent) =>
      followTitle(element, event, titleLink);
    element.addEventListener("click", follow);
    return () => element.removeEventListener("click", follow);
  }, []);
  const item = (
    <div
      aria-current={inList ? undefined : current}
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(
        itemVariants({ variant, size }),
        // In a list, the row draws the space, the line and the state, and the item none of its own.
        inList
          ? "rounded-none border-0 p-0"
          : "has-[[data-slot=item-title]_a[href]]:cursor-pointer has-[[data-slot=item-title]_a[href]]:hover:bg-muted",
        className,
      )}
      ref={inList ? undefined : (row as React.RefObject<HTMLDivElement>)}
      {...props}
    />
  );
  return (
    <ItemContext.Provider value={{ titleId }}>
      {inList ? (
        <li
          aria-current={current}
          className={cn(
            rowFill,
            "relative border-b px-3 py-3 last:border-0 in-data-[density=compact]:py-2 in-data-[slot=card]:px-5 has-[[data-slot=item-title]_a[href]]:cursor-pointer has-[[data-slot=item-title]_a[href]]:hover:[--row-hover:color-mix(in_oklab,var(--muted)_50%,transparent)] has-data-[slot=item-action]:hover:[--row-hover:color-mix(in_oklab,var(--muted)_50%,transparent)] aria-[current=true]:before:absolute aria-[current=true]:before:inset-y-0 aria-[current=true]:before:start-0 aria-[current=true]:before:w-0.75 aria-[current=true]:before:bg-primary",
          )}
          data-slot="item-row"
          ref={row as React.RefObject<HTMLLIElement>}
        >
          {item}
        </li>
      ) : (
        item
      )}
    </ItemContext.Provider>
  );
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        // An icon on a tile of 40 px, where the eye starts each row, quiet until a category colours it.
        icon: "size-10 rounded-lg bg-muted text-foreground in-data-[density=compact]:size-8 [&_svg:not([class*='size-'])]:size-5 in-data-[density=compact]:[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// The colours of categories, in the theme's order: the icon in the colour, on a tenth of it, a fifth in dark.
const categoryColours = [
  "bg-category-1/10 text-category-1 dark:bg-category-1/20",
  "bg-category-2/10 text-category-2 dark:bg-category-2/20",
  "bg-category-3/10 text-category-3 dark:bg-category-3/20",
  "bg-category-4/10 text-category-4 dark:bg-category-4/20",
  "bg-category-5/10 text-category-5 dark:bg-category-5/20",
  "bg-category-6/10 text-category-6 dark:bg-category-6/20",
  "bg-category-7/10 text-category-7 dark:bg-category-7/20",
  "bg-category-8/10 text-category-8 dark:bg-category-8/20",
];

// A category from 1 takes its colour, and past the last they repeat; a number that names none takes no colour.
function categoryColour(category: number | undefined): string | undefined {
  return category !== undefined && Number.isInteger(category) && category >= 1
    ? categoryColours[(category - 1) % categoryColours.length]
    : undefined;
}

function ItemMedia({
  className,
  variant = "default",
  category,
  ...props
}: ComponentProps<"div"> &
  VariantProps<typeof itemMediaVariants> & {
    /** The row's category, from 1, which colours an icon's tile, as the app numbers its categories. */
    category?: number;
  }) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(
        itemMediaVariants({ variant }),
        categoryColour(category),
        className,
      )}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        "flex flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className,
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: ComponentProps<"div">) {
  const { titleId } = useContext(ItemContext);
  return (
    <div
      data-slot="item-title"
      id={titleId}
      className={cn(
        "flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        "text-start text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}

/**
 * The value at a row's end, as an amount, aligned to it and at the text's weight, which never wraps while the title
 * gives way, with an optional line under it, small and muted, as the day it was paid, or a badge.
 */
function ItemValue({
  className,
  detail,
  children,
  ...props
}: ComponentProps<"div"> & {
  /** What is said under the value, as a date or a badge. */
  detail?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "ms-auto flex shrink-0 flex-col items-end gap-0.5 text-end [&_:is([data-slot=amount],[data-slot=percent],[data-slot=quantity])]:font-normal",
        className,
      )}
      data-slot="item-value"
      {...props}
    >
      {children}
      {detail === undefined ? null : (
        <span className="text-xs text-muted-foreground">{detail}</span>
      )}
    </div>
  );
}

/**
 * An action on an item: a quiet icon button of 32 px, whose name joins the app's one word to the item's title, as
 * "Edit Account 1234", and which takes less than a line of text's height, so a row keeps its own. An item with no
 * title throws, as its action would have no name to say which item it acts on.
 */
function ItemAction({
  "aria-label": label,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "aria-label" | "size" | "variant"> & {
  "aria-label": string;
}) {
  const { titleId } = useContext(ItemContext);
  const id = useId();
  useLayoutEffect(() => {
    if (document.getElementById(titleId as string) === null) {
      throw new Error(
        `ItemAction: "${label}" needs its item titled by ItemTitle.`,
      );
    }
  }, [titleId, label]);
  return (
    <Button
      aria-label={label}
      aria-labelledby={`${id} ${titleId}`}
      className={cn("-my-2 flex", className)}
      data-slot="item-action"
      id={id}
      size="icon-sm"
      variant="ghost"
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        "flex basis-full items-center justify-between gap-2",
        className,
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemAction,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemEmpty,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemValue,
};
