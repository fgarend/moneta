import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react";
import { Separator } from "#components/separator";
import { followTitle, rowFill } from "#hooks/row";

// Whether an item sits in a list of rows, where it is one of its items.
const InList = createContext(false);

// A list of rows: one thing per row, read across, with a line between rows and no box of their own. Its ends are a
// table's: 12 px loose on a page, where it reaches as much out, and 20 px in a card, lined up with its title.
function ItemGroup({ className, ...props }: ComponentProps<"ul">) {
  return (
    <InList.Provider value={true}>
      <ul
        className={cn(
          "group/item-group -mx-3 flex flex-col in-data-[slot=card]:mx-0",
          className,
        )}
        data-slot="item-group"
        // biome-ignore lint/a11y/noRedundantRoles: Safari drops a list's meaning with its markers, which Tailwind removes.
        role="list"
        {...props}
      />
    </InList.Provider>
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

// One thing, read across. In a list, a row, whose state, aria-current, and whose clicks are the row's; alone, a box.
function Item({
  className,
  variant = "default",
  size = "default",
  "aria-current": current,
  ...props
}: HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemVariants>) {
  const inList = useContext(InList);
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
  return inList ? (
    <li
      aria-current={current}
      className={cn(
        rowFill,
        "relative border-b px-3 py-3 last:border-0 in-data-[slot=card]:px-5 has-[[data-slot=item-title]_a[href]]:cursor-pointer has-[[data-slot=item-title]_a[href]]:hover:[--row-hover:color-mix(in_oklab,var(--muted)_50%,transparent)] aria-[current=true]:before:absolute aria-[current=true]:before:inset-y-0 aria-[current=true]:before:start-0 aria-[current=true]:before:w-0.75 aria-[current=true]:before:bg-primary",
      )}
      data-slot="item-row"
      ref={row as React.RefObject<HTMLLIElement>}
    >
      {item}
    </li>
  ) : (
    item
  );
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        // An icon on a tile of 40 px, where the eye starts each row; Colours of meaning tints it by category.
        icon: "size-10 rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-5",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function ItemMedia({
  className,
  variant = "default",
  ...props
}: ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
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
  return (
    <div
      data-slot="item-title"
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

// The value at a row's end, as an amount, aligned to it and at the text's weight, which never wraps while the title
// gives way, with an optional line under it, small and muted, as the day it was paid, or a badge.
function ItemValue({
  className,
  detail,
  children,
  ...props
}: ComponentProps<"div"> & {
  // What is said under the value, as a date or a badge.
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
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemValue,
};
