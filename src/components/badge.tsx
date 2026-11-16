import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

// A label that only shows, so it has no focus, hover or link of its own. Its words wrap rather than leave their
// column, line under line, each 20 px.
const badgeVariants = cva(
  "group/badge inline-flex min-h-5 w-fit max-w-full shrink-0 items-center justify-center gap-1 rounded-xl border border-transparent px-2 py-px text-xs font-medium has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        info: "bg-info/10 text-info",
        outline: "border-border text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * A short label beside something, which says its state or its kind, as "Paid" or "Expense". It only shows: it is
 * never pressed.
 *
 * **Use it for**
 *
 * - A state, in its meaning's variant, `success`, `warning`, `destructive` or `info`, with an icon whose shape says
 *   it without colour, written before the word with `data-icon="inline-start"`, as a check for paid.
 * - A kind, its word alone, in `secondary`, or in `outline` where it should be quiet; a count beside a section's
 *   title, in `secondary`.
 * - The one thing on a screen that should stand out, in `default`, as a new holding.
 *
 * **Not recommended**
 *
 * - As a link or a button: it is too small to press, and its word does not say where it goes. The row's title holds
 *   the link, and a filter is a chip.
 * - A meaning by colour alone: its word says it, and its icon's shape.
 * - A kind's category colour: it shows on the row's IconTile.
 * - More than one or two words: long words wrap, but a badge is read at a glance.
 */
function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
