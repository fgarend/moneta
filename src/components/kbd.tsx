import { cn } from "cn";
import type { ComponentProps } from "react";
import { Keyboard as KbdPrimitive } from "react-aria-components";

/**
 * A key to press, or several pressed together, as a shortcut beside the action it takes.
 *
 * **Use it for**
 *
 * - A shortcut beside its action, in a menu, a tooltip or a hint, each key a `Kbd` in a `KbdGroup`, side by side.
 * - A key shown as a symbol, as ⌘, with its name in words in `label`, as "Command", which a screen reader hears.
 *
 * **Not recommended**
 *
 * - The only way to an action: every shortcut has a control that a pointer and a screen reader reach.
 * - A sequence, as G then I, with nothing between: write your word for "then" between its groups.
 * - A label or a count: use `Badge`.
 */
function Kbd({
  className,
  label,
  children,
  ...props
}: ComponentProps<"kbd"> & {
  /** The key's name in words, as "Command" for ⌘, which a screen reader hears in place of its symbol. */
  label?: string;
}) {
  return (
    <KbdPrimitive
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm bg-muted px-1 font-sans text-xs font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
        className,
      )}
      {...props}
    >
      {label === undefined ? (
        children
      ) : (
        <>
          <span aria-hidden="true">{children}</span>
          <span className="sr-only">{label}</span>
        </>
      )}
    </KbdPrimitive>
  );
}

// Keys pressed together, side by side, inside one kbd.
function KbdGroup({ className, ...props }: ComponentProps<"kbd">) {
  return (
    <KbdPrimitive
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export { Kbd, KbdGroup };
