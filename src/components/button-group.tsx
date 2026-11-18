import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { CSSProperties } from "react";
import { Group, type GroupProps } from "react-aria-components";

import { Separator } from "#components/separator";

// Joined, at spacing 0, the boxes become one: each against the next, sharing the width at one height so their words
// wrap when narrow, and only the ends rounded. Apart, a box each that far away, wrapping onto the next line.
const buttonGroupVariants = cva(
  "flex w-fit *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
  {
    variants: {
      orientation: {
        horizontal: "",
        vertical: "flex-col",
      },
      joined: {
        true: "items-stretch *:data-[slot=button]:shrink",
        false: "flex-wrap items-center gap-(--gap)",
      },
    },
    compoundVariants: [
      {
        orientation: "horizontal",
        joined: true,
        className:
          "**:data-slot:rounded-r-none [&_[data-slot]~[data-slot]]:rounded-l-none [&_[data-slot]~[data-slot]]:border-l-0 [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
      },
      {
        orientation: "vertical",
        joined: true,
        className:
          "**:data-slot:rounded-b-none [&_[data-slot]~[data-slot]]:rounded-t-none [&_[data-slot]~[data-slot]]:border-t-0 [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      joined: true,
    },
  },
);

/**
 * Actions on one thing, side by side, as React Aria's `Group`, named by the app's `aria-label`.
 *
 * Use it for:
 * - Related actions joined in one box, as "Download" and "Print", or an action and its menu, three at most, the rest
 *   in a menu at its end.
 * - A row of separate actions, as a form's "Save" and "Cancel", with `spacing` above 0, which wraps when narrow.
 *
 * Not recommended:
 * - A choice among options: use `ToggleGroup`.
 * - What a field holds beside its text: use `InputGroup`.
 */
function ButtonGroup({
  className,
  orientation,
  spacing = 0,
  style,
  ...props
}: Omit<GroupProps, "className" | "style"> & {
  className?: string;
  style?: CSSProperties;
  // The vocabulary's: 0 joins the boxes, more parts them by that many of the theme's steps.
  spacing?: number;
} & Omit<VariantProps<typeof buttonGroupVariants>, "joined">) {
  return (
    <Group
      data-slot="button-group"
      data-orientation={orientation}
      data-spacing={spacing}
      className={cn(
        buttonGroupVariants({ orientation, joined: spacing === 0 }),
        className,
      )}
      style={
        {
          "--gap": `calc(var(--spacing) * ${spacing})`,
          ...style,
        } as CSSProperties
      }
      {...props}
    />
  );
}

function ButtonGroupText({
  className,
  render,
  ...props
}: React.ComponentProps<"div"> & {
  render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode;
}) {
  if (render) {
    const renderProps = {
      "data-slot": "button-group-text",
      className: cn(
        "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      ),
      ...props,
    };

    return render(renderProps);
  }

  return (
    <div
      data-slot="button-group-text"
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-muted px-2.5 text-sm font-medium [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
        className,
      )}
      {...props}
    />
  );
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText };
