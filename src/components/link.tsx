// A link in text or in a cell. Underlined, as the theme's primary is close to the colour of its text, and in the
// text's own size and weight. A quiet link, alone where its place says it is one, shows its underline only on hover
// and keyboard focus. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import {
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components";

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
