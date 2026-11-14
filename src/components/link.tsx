// A link in text or in a cell. Underlined, as the theme's primary is close to the colour of its text, and in the
// text's own size and weight. A quiet link, alone where its place says it is one, shows its underline only on hover
// and keyboard focus. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import {
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components";

/**
 * A link in text or in a cell, through the app's router, underlined, in its text's size and weight.
 *
 * **Use it for**
 *
 * - A link in a sentence, its words saying where it goes, read alone.
 * - A row's title in a table or a list, with `isQuiet`, where its place says it is a link.
 *
 * **Not recommended**
 *
 * - An action: use `Button`. A link drawn as a button: use `LinkButton`.
 * - Words as "here" or "click", which say nothing read alone.
 * - `isQuiet` in a sentence, where an underline is the only sign of a link.
 */
function Link({
  className,
  isQuiet = false,
  ...props
}: Omit<LinkPrimitiveProps, "className" | "children"> & {
  className?: string;
  // A link with nothing in it has no name.
  children: NonNullable<LinkPrimitiveProps["children"]>;
  isQuiet?: boolean;
}) {
  return (
    <LinkPrimitive
      className={cn(
        "text-primary underline underline-offset-4 data-disabled:opacity-50",
        isQuiet &&
          "no-underline data-focus-visible:underline data-hovered:underline",
        className,
      )}
      data-slot="link"
      {...props}
    />
  );
}

export { Link };
