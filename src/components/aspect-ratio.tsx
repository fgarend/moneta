import { cn } from "cn";

/**
 * A box of a fixed shape, as 16:9, that a picture, a map or a video fills, cropped to it, on `--muted` until it loads.
 *
 * **Use it for**
 *
 * - A picture whose shape holds at any width, as a place's photo or a map, so the page does not move when it loads.
 * - A card's cover, as the card's first child, edge to edge, with the card's corners.
 * - Covers of one height in a grid of cards, whatever the shape of each picture.
 *
 * **Not recommended**
 *
 * - Text, or anything that grows: its height is fixed, so larger text or spacing is cut off.
 * - A document read whole, as a receipt or a statement, where a crop would hide a value: show it at its own shape.
 */
function AspectRatio({
  ratio,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  /** Width over height, as `16 / 9`. */
  ratio: number;
}) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as React.CSSProperties
      }
      className={cn(
        "relative aspect-(--ratio) overflow-hidden rounded-lg bg-muted *:absolute *:inset-0 *:size-full *:object-cover",
        className,
      )}
      {...props}
    />
  );
}

export { AspectRatio };
