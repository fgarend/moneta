// An asset named by its traded code, in a pill, with an optional mark and a link to its page. A mark written in it, an
// IconTile or an Avatar, takes a circle of 20 px, 2 px in all round. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import type { ReactNode } from "react";
import { Link as LinkPrimitive } from "react-aria-components";
import { TilePlace } from "#hooks/tile";

const chipTile = {
  shape: "circle" as const,
  sizeClassName: "size-5 [&_svg:not([class*='size-'])]:size-3",
};

/**
 * An asset named compactly by its traded code, where a row does not fit, as a table's cell or a sentence, and a way
 * to its page.
 *
 * **Use it for**
 * - An asset in a table's column or a sentence, its code in a pill that reads as one unit, linking to its page with
 *   `href`.
 * - A mark where it tells something: the issuer's logo, as an `Avatar`, or the asset's type among mixed types, as an
 *   `IconTile` in its category's tint, written before the code. None where every asset shares a type. All with a
 *   mark, or all without, in one column or sentence.
 * - The company's `name`, which a screen reader hears after the code, where it is not written beside.
 * - The day's change or the price beside it, as a `Percent` or an `Amount`, in a column of their own in a table.
 *
 * **Not recommended**
 * - A full row for an asset, with its name, value and change: use `Item`.
 * - A state, as "Pending": use `Badge`.
 * - An asset with no code, as a deposit: write its name.
 * - A code cut short: it is the asset's identity, so a table scrolls in its own area instead.
 */
function TickerChip({
  href,
  name,
  className,
  children,
}: {
  /** The asset's page, at the app's address. With none, the chip is text, as on the asset's own page. */
  href?: string;
  /** The company's or the fund's name, which a screen reader hears after the code. */
  name?: string;
  className?: string;
  /** The code, after an optional `IconTile` or `Avatar`. */
  children: ReactNode;
}) {
  const classes = cn(
    "inline-flex min-h-6 shrink-0 items-center gap-1 rounded-full border border-border-strong px-2 align-middle text-xs font-medium whitespace-nowrap text-foreground outline-none has-[>[data-slot=avatar]]:ps-px has-[>[data-slot=icon-tile]]:ps-px *:data-[slot=avatar]:size-5",
    href !== undefined && "data-hovered:bg-muted",
    className,
  );
  const content = (
    <TilePlace.Provider value={chipTile}>
      {children}
      {name !== undefined && <span className="sr-only">, {name}</span>}
    </TilePlace.Provider>
  );
  return href === undefined ? (
    <span className={classes} data-slot="ticker-chip">
      {content}
    </span>
  ) : (
    <LinkPrimitive className={classes} data-slot="ticker-chip" href={href}>
      {content}
    </LinkPrimitive>
  );
}

export { TickerChip };
