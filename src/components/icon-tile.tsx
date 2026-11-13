import { cn } from "cn";
import type { ComponentProps, ReactElement } from "react";
import { useContext } from "react";
import {
  TilePlace,
  type TileShape,
  type TileSize,
  type TileVariant,
} from "#hooks/tile";

const shapes = { square: "rounded-lg", circle: "rounded-full" };
const sizes = {
  sm: "size-8 [&_svg:not([class*='size-'])]:size-4",
  default: "size-10 [&_svg:not([class*='size-'])]:size-5",
  lg: "size-12 [&_svg:not([class*='size-'])]:size-6",
};
const variants = {
  default: "bg-muted text-foreground",
  solid: "bg-foreground text-background",
  gold: "bg-gold text-gold-foreground",
};

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

/**
 * An icon on a square or a circle, where the eye starts a row or a number. Its colour says weight, not meaning: soft,
 * neutral or a category's tint; solid, in the text's colour; or gold, the screen's headline, once per screen. It is
 * always decoration, hidden from screen readers, as the words beside it say what it is. The piece it sits in says
 * how it behaves there, and a prop given by hand wins.
 */
function IconTile({
  shape,
  size,
  variant,
  category,
  className,
  children,
  ...props
}: Omit<ComponentProps<"span">, "children"> & {
  /** A square, as in a row, or a circle, as beside a number or a card's title. */
  shape?: TileShape;
  /** 32 px, 40 or 48, with an icon of 16, 20 or 24. */
  size?: TileSize;
  /** Soft, solid in the text's colour, or gold for the screen's headline. */
  variant?: TileVariant;
  /** The thing's category, from 1, as the app numbers them, which tints a soft tile. */
  category?: number;
  /** Its icon, one element. */
  children: ReactElement;
}) {
  const place = useContext(TilePlace);
  const drawn = {
    shape: shape ?? place.shape ?? "square",
    size: size ?? place.size ?? "default",
    variant: variant ?? place.variant ?? "default",
  };
  return (
    <span
      aria-hidden="true"
      data-shape={drawn.shape}
      data-size={drawn.size}
      data-slot="icon-tile"
      data-variant={drawn.variant}
      className={cn(
        "inline-flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        shapes[drawn.shape],
        sizes[drawn.size],
        variants[drawn.variant],
        drawn.variant === "default" && categoryColour(category),
        place.className,
        size === undefined && place.sizeClassName,
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { IconTile };
