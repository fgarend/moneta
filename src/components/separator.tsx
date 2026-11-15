import { cn } from "cn";
import { Separator as SeparatorPrimitive } from "react-aria-components";

/**
 * A line between two groups of things, which a screen reader hears as a separator.
 *
 * **Use it for**
 *
 * - Two groups in a menu, a form or a bar, which a line parts and a screen reader should hear parted.
 * - Across, by default, or upright with `orientation="vertical"` between controls in a row, where it takes their
 *   height.
 *
 * **Not recommended**
 *
 * - A line only seen, as under a title or around a box: a border, which a screen reader does not hear.
 * - Between a list's rows or a table's: they draw their own lines.
 * - Space of its own: it has none, so the gap of the column or row it sits in places it.
 */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive>) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "block shrink-0 border-0 bg-border aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=vertical]:w-px aria-[orientation=vertical]:self-stretch [:is(hr)]:h-px [:is(hr)]:w-full",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
