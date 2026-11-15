import { cn } from "cn";
import {
  type ComponentProps,
  createContext,
  isValidElement,
  type ReactNode,
  useContext,
} from "react";
import { Heading, type HeadingProps } from "react-aria-components";
import { partsOf } from "#hooks/children";
import { deepest, SectionLevel } from "#hooks/level";

// The level of a card's title, one below where the card sits, which CardTitle takes.
const TitleLevel = createContext(2);

// Whether a CardHeader among its own children holds a CardTitle. A header kept in another component is not seen.
function hasTitle(children: ReactNode): boolean {
  return partsOf(children).some(
    (child) =>
      isValidElement<{ children?: ReactNode }>(child) &&
      child.type === CardHeader &&
      partsOf(child.props.children).some(
        (part) => isValidElement(part) && part.type === CardTitle,
      ),
  );
}

/**
 * A surface that holds one group of things under its title, as a list of accounts or a form. Its title is a heading
 * one level below where the card sits, `h2` at the page's top, and what it holds one level below its title.
 *
 * **Use it for**
 *
 * - A group that needs a surface of its own, beside others, as a list of accounts, a chart or a form.
 * - A table, a list of rows or a group of numbers joined in one box, alone in its content, which runs to the card's
 *   edges.
 * - A part of the page, with `size="lg"`: its title at a section's size, and 24 px around what it holds.
 * - A surface with no title of its own under a section's, as a table whose `Section` holds its title, a count and its
 *   controls: what runs edge to edge then starts at the card's top.
 *
 * **Not recommended**
 *
 * - A part that needs no surface: use `Section`.
 * - A card in a card: a section or a list's groups part what it holds.
 * - A `CardHeader` kept in another component: the card reads its title from its own children, so what it holds stays
 *   at the title's level.
 * - A whole card as a link or a button: a link goes in its title, and its actions in `CardAction`.
 */
function Card({
  className,
  size = "default",
  children,
  ...props
}: ComponentProps<"div"> & {
  /** Its padding and its title: 12 px and a smaller title, 20 px, or 24 px and a section's title. */
  size?: "default" | "sm" | "lg";
}) {
  const level = Math.min(useContext(SectionLevel) + 1, deepest);
  const box = (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) [--surface:var(--card)] overflow-hidden rounded-xl bg-card py-(--card-spacing) text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:--spacing(5)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 data-[size=lg]:[--card-spacing:--spacing(6)] *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        // Numbers joined at its foot reach its edge, as their lines do.
        "has-[>[data-slot=card-content]:last-child>[data-slot=stat-group-box]:only-child>[data-joined]]:pb-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
  return (
    <TitleLevel.Provider value={level}>
      {hasTitle(children) ? (
        <SectionLevel.Provider value={level}>{box}</SectionLevel.Provider>
      ) : (
        box
      )}
    </TitleLevel.Provider>
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className,
      )}
      {...props}
    />
  );
}

// A heading at the level its card gives; a level given by hand wins.
function CardTitle({ className, level, ...props }: HeadingProps) {
  const fromCard = useContext(TitleLevel);
  return (
    <Heading
      data-slot="card-title"
      className={cn(
        "font-heading type-title group-data-[size=lg]/card:text-lg/6 group-data-[size=sm]/card:text-sm",
        className,
      )}
      level={level ?? fromCard}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("type-label text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 flex flex-wrap items-center gap-2 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        // A line above only below a header. First, with no header, it draws none and rises to the card's top.
        "px-(--card-spacing) not-first:has-[>[data-slot=table-container]:only-child]:border-t has-[>[data-slot=table-container]:only-child]:px-0 not-first:has-[>[data-slot=table-selection-bar]:first-child+[data-slot=table-container]:last-child]:border-t has-[>[data-slot=table-selection-bar]:first-child+[data-slot=table-container]:last-child]:px-0 not-first:has-[>[data-slot=item-group]]:not-has-[>:not([data-slot=item-group])]:border-t has-[>[data-slot=item-group]]:not-has-[>:not([data-slot=item-group])]:px-0",
        // Numbers joined in one box, alone, run edge to edge, the card their box; apart or with no box, they keep its
        // padding.
        "not-first:has-[>[data-slot=stat-group-box]:only-child>[data-joined]]:border-t first:has-[>[data-slot=table-container]:only-child]:-mt-(--card-spacing) first:has-[>[data-slot=table-selection-bar]:first-child+[data-slot=table-container]:last-child]:-mt-(--card-spacing) first:has-[>[data-slot=item-group]]:not-has-[>:not([data-slot=item-group])]:-mt-(--card-spacing) first:has-[>[data-slot=stat-group-box]:only-child>[data-joined]]:-mt-(--card-spacing) has-[>[data-slot=stat-group-box]:only-child>[data-joined]]:px-0 [&>[data-slot=stat-group-box]:only-child>[data-joined]]:rounded-none [&>[data-slot=stat-group-box]:only-child>[data-joined]]:bg-transparent [&>[data-slot=stat-group-box]:only-child>[data-joined]]:ring-0",
        className,
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
