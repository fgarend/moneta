// The history of one thing, its events in the order the app writes them, each that happened or is expected.
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import type { ComponentProps } from "react";

/**
 * The history of one thing, as a transfer's or an order's: what happened, each event with its time, and what is
 * expected next, at the end, its dot hollow and the line to it dashed. A list to read, of what others make happen.
 *
 * **Use it for**
 * - One thing's events, oldest first, as the app writes them, each a `TimelineItem` with its `TimelineTitle` and
 *   `TimelineTime`, and a `TimelineDescription` when it says more.
 * - What is expected, as a credit's day, in a `TimelineItem` with `isExpected`, at the end, its time in your words,
 *   as "Expected on" and its `DateTime`.
 * - What an event means, in its dot's `variant`, `destructive`, `success`, `warning` or `info`, which its title
 *   says too.
 * - An amount in an event, as an `Amount` in its title or its description.
 * - A long history: its last events, and a `Link` to the whole of it, in a `Table` or an `ItemGroup`.
 *
 * **Not recommended**
 * - A process a person moves through, as a form in steps: that is Steps, still to come.
 * - Many things, each with its value, as a statement: use `ItemGroup` or `Table`.
 * - No events: write your words in its place, as a thing's history starts when it is made.
 */
function Timeline({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("flex flex-col text-sm", className)}
      {...props}
    />
  );
}

const timelineDotVariants = cva("size-2 rounded-full border-4", {
  variants: {
    variant: {
      default: "border-muted-foreground",
      destructive: "border-destructive",
      success: "border-success",
      warning: "border-warning",
      info: "border-info",
    },
  },
  defaultVariants: { variant: "default" },
});

/**
 * One event: its dot, the line on to the next, and what is written in it.
 */
function TimelineItem({
  className,
  isExpected = false,
  variant = "default",
  children,
  ...props
}: ComponentProps<"li"> &
  VariantProps<typeof timelineDotVariants> & {
    // Not yet happened, as a day a credit is expected: a hollow dot, its title muted, and a dashed line reaching it.
    isExpected?: boolean;
  }) {
  return (
    <li
      data-slot="timeline-item"
      data-expected={isExpected || undefined}
      className={cn(
        "group/timeline-item grid grid-cols-[auto_1fr] gap-x-3",
        className,
      )}
      {...props}
    >
      <div aria-hidden="true" className="flex flex-col items-center">
        <span
          data-slot="timeline-dot"
          className={cn(
            "mt-1.5",
            isExpected
              ? "size-2 rounded-full border border-muted-foreground"
              : timelineDotVariants({ variant }),
          )}
        />
        <span
          data-slot="timeline-line"
          className="mt-1.5 w-0 grow border-l border-border-strong group-last/timeline-item:hidden group-has-[+[data-expected]]/timeline-item:border-dashed"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5 pb-4 group-last/timeline-item:pb-0">
        {children}
      </div>
    </li>
  );
}

/**
 * What happened, in your words.
 */
function TimelineTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-title"
      className={cn(
        "leading-5 font-medium group-data-expected/timeline-item:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * When it happened, as a `DateTime`, or when it is expected, in your words around one.
 */
function TimelineTime({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-time"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

/**
 * What else it says, as who did it.
 */
function TimelineDescription({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-description"
      className={cn("type-paragraph text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
};
