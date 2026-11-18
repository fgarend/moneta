import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { Loader2Icon } from "lucide-react";
import type * as React from "react";
import { useId } from "react";
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
} from "react-aria-components";

// A height is a least one, so words that do not fit wrap, centred and balanced, with room above and below; an icon's
// sizes stay square. Hover and disabled read React Aria's data attributes, which a link drawn as a span carries too.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-center text-sm font-medium text-balance transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px data-disabled:pointer-events-none data-disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-pending:[&>svg]:hidden [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground data-hovered:bg-primary/80",
        outline:
          "border-border bg-background aria-expanded:bg-muted aria-expanded:text-foreground data-hovered:bg-muted data-hovered:text-foreground dark:border-input",
        secondary:
          "bg-secondary text-secondary-foreground aria-expanded:bg-secondary aria-expanded:text-secondary-foreground data-hovered:bg-secondary-hover",
        ghost:
          "aria-expanded:bg-muted aria-expanded:text-foreground data-hovered:bg-muted data-hovered:text-foreground dark:data-hovered:bg-muted/50",
        destructive:
          "bg-destructive text-destructive-foreground focus-visible:border-destructive/40 focus-visible:ring-destructive/20 data-hovered:bg-destructive/80 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 data-hovered:underline",
        gold: "bg-gold text-gold-foreground data-hovered:bg-gold/80",
      },
      size: {
        default:
          "min-h-9 gap-1.5 px-2.5 py-1.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "min-h-6 gap-1 rounded-md px-2 py-0.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "min-h-8 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 py-1.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "min-h-10 gap-1.5 px-2.5 py-2 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type Variants = VariantProps<typeof buttonVariants>;
type IconSize = "icon" | "icon-xs" | "icon-sm" | "icon-lg";

// An icon's sizes show no words, so they ask for a name.
type Sized =
  | { size?: Exclude<Variants["size"], IconSize> }
  | ({ size: IconSize } & (
      | { "aria-label": string }
      | { "aria-labelledby": string }
    ));

// A wait asks for the app's words for it, heard with the button's name.
type Waiting =
  | { isPending?: false; pendingLabel?: never }
  | { isPending: boolean; pendingLabel: string };

type ButtonProps = Omit<
  ButtonPrimitiveProps,
  "className" | "isPending" | "aria-label" | "aria-labelledby"
> &
  React.RefAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: Variants["variant"];
    "aria-label"?: string;
    "aria-labelledby"?: string;
  } & Sized &
  Waiting;

/**
 * An action the reader takes, as React Aria's `Button`, in a variant of the vocabulary and a size of the scale.
 *
 * Use it for:
 * - An action: `default` for most, `gold` for the screen's main one, once, `destructive` to confirm what cannot be
 *   undone, `secondary`, `outline` and `ghost` for quieter ones, and `link` for an action read as text.
 * - A wait on what it started, with `isPending` and your words for it in `pendingLabel`.
 * - A button inside another piece or beside a line of text, at `xs` or `icon-xs`, 24 px.
 *
 * Not recommended:
 * - Going somewhere: use `Link`, or `LinkButton` for a link drawn as a button.
 * - Disabling with no reason shown: say why, by a message, or wait with `isPending`.
 * - A long label: keep it to a few words, which wrap when they must.
 */
function Button({
  className,
  variant = "default",
  size = "default",
  isPending = false,
  pendingLabel,
  id,
  children,
  ...props
}: ButtonProps) {
  const ownId = useId();
  const wordsId = useId();
  const buttonId = id ?? ownId;
  // While it waits, the app's words follow the button's own, hidden, so its name is both. A name given by
  // `aria-label` or `aria-labelledby` gains them by reference, as a name from its content gains them by being there.
  const named = props["aria-labelledby"] ?? (props["aria-label"] && buttonId);
  const labelledBy =
    isPending && named ? `${named} ${wordsId}` : props["aria-labelledby"];

  return (
    <ButtonPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      aria-labelledby={labelledBy}
      id={buttonId}
      isPending={isPending}
    >
      {(values) => {
        const content =
          typeof children === "function" ? children(values) : children;
        return isPending ? (
          <>
            <span className="inline-flex" data-slot="button-spinner">
              <Loader2Icon aria-hidden={true} className="animate-spin" />
            </span>
            {content}
            <span className="sr-only" id={wordsId}>
              {pendingLabel}
            </span>
          </>
        ) : (
          content
        );
      }}
    </ButtonPrimitive>
  );
}

/**
 * A link drawn as a button, as React Aria's `Link`, in the button's variants but `link`, which is a `Link`.
 *
 * Use it for:
 * - Going somewhere where a button's look says it is the way on, as a page's next step.
 *
 * Not recommended:
 * - An action: use `Button`.
 * - A link in text or in a cell: use `Link`.
 */
function LinkButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: Omit<LinkPrimitiveProps, "className"> & {
  className?: string;
  variant?: Exclude<Variants["variant"], "link">;
  size?: Variants["size"];
}) {
  return (
    <LinkPrimitive
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, LinkButton };
