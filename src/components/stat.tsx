import { cn } from "cn";
import {
  Children,
  type ComponentProps,
  type CSSProperties,
  createContext,
  useContext,
  useId,
  useLayoutEffect,
} from "react";
import { Button } from "#components/button";
import { Skeleton } from "#components/skeleton";
import { TilePlace } from "#hooks/tile";
import { ValueSizeContext } from "#hooks/use-value";

type StatVariant = "default" | "muted" | "ghost";

// What a group says to its numbers: the look of their boxes, whether they join, and whether they load.
const GroupContext = createContext<{
  variant: StatVariant;
  isJoined: boolean;
  isLoading: boolean;
}>({ variant: "default", isJoined: false, isLoading: false });
// The number a part sits in, whose label names its action.
const StatContext = createContext<{ labelId: string | undefined }>({
  labelId: undefined,
});

// While its values load, the app's words for it, heard; without, nothing is said.
type GroupLoading =
  | {
      /** Whether its values load: the first time, a shape in place of each value left empty; after, the values. */
      isLoading: boolean;
      /** The app's words for the load, which a screen reader hears. */
      loadingLabel: string;
    }
  | { isLoading?: never; loadingLabel?: never };

// The look of a box, alone or, joined, of the one box around them all.
const boxes = {
  default: "rounded-xl bg-card ring-1 ring-foreground/10",
  muted: "rounded-xl bg-muted",
  ghost: "",
};

/**
 * Numbers of note, read together, as a month's totals: a list of terms and values, each `Stat` a label and its value,
 * which a screen reader reads as such, with how many. Its boxes by `spacing`: `0`, one box with lines between; more, a
 * box each that far apart; and `variant` their look, a card's, soft, or none, which parts them by 24 px. Its columns
 * come from its own width, as shadcn's dashboard: one, two from 576 px, and all on one line from 1024.
 *
 * **Use it for**
 *
 * - A few totals at the top of a page or in a card, each its label, its value and a note under it.
 * - A change in `StatDescription`, beside your words, as "+3.9% this month".
 * - An icon and an action, written in `StatLabel`.
 *
 * **Not recommended**
 *
 * - Many values, or values to compare: use `ItemGroup` or `Table`.
 * - One number in a sentence: use `Amount`.
 * - An icon or an action outside `StatLabel`, which a list of terms and values does not allow.
 */
function StatGroup({
  className,
  spacing,
  variant = "default",
  isLoading,
  loadingLabel,
  style,
  ...props
}: ComponentProps<"dl"> &
  GroupLoading & {
    /** How far apart its boxes stand, in spacing units: 0, one box with lines between; with no box, 6 by default. */
    spacing?: number;
    /** A card's box, a soft one, or none, as in a card or a page's head. */
    variant?: StatVariant;
  }) {
  const gap = spacing ?? (variant === "ghost" ? 6 : 0);
  const isJoined = gap === 0 && variant !== "ghost";
  return (
    // The box its columns measure, as a group's width, not the screen's, says how many fit.
    <div className="@container/stat-group" data-slot="stat-group-box">
      {isLoading === undefined ? null : (
        <p className="sr-only" role="status">
          {isLoading ? loadingLabel : ""}
        </p>
      )}
      <GroupContext.Provider
        value={{ variant, isJoined, isLoading: isLoading === true }}
      >
        <dl
          aria-busy={isLoading ? true : undefined}
          className={cn(
            "group/stat-group grid grid-cols-1 gap-(--gap) @xl/stat-group:grid-cols-2 @5xl/stat-group:grid-flow-col @5xl/stat-group:grid-cols-none @5xl/stat-group:auto-cols-fr",
            isJoined && cn("overflow-hidden", boxes[variant]),
            className,
          )}
          data-joined={isJoined || undefined}
          data-slot="stat-group"
          data-spacing={gap}
          data-variant={variant}
          style={
            {
              "--gap": `calc(var(--spacing) * ${gap})`,
              ...style,
            } as CSSProperties
          }
          {...props}
        />
      </GroupContext.Provider>
    </div>
  );
}

/**
 * One number: its label, its value and a note under it. An icon, an IconTile written in the label, is drawn left of
 * them all, a solid circle of 48 px.
 */
function Stat({ className, ...props }: ComponentProps<"div">) {
  const { variant, isJoined } = useContext(GroupContext);
  const labelId = useId();
  const isGhost = variant === "ghost";
  return (
    <StatContext.Provider value={{ labelId }}>
      <TilePlace.Provider
        value={{
          shape: "circle",
          size: "lg",
          variant: "solid",
          className: cn(
            "absolute",
            isGhost
              ? "start-0 top-0"
              : "start-(--stat-inset) top-(--stat-inset)",
          ),
        }}
      >
        <div
          className={cn(
            "relative min-w-0",
            isGhost
              ? "has-data-[slot=icon-tile]:ps-15"
              : "p-(--stat-inset) [--stat-inset:--spacing(5)] has-data-[slot=icon-tile]:*:ms-15",
            // Joined in a card, its padding the card's, so its text lines up with the card's title at every size.
            isJoined &&
              "in-data-[slot=card-content]:[--stat-inset:var(--card-spacing)]",
            // Joined, a line at its start and its top, which the group's edge hides where it has none beside it.
            isJoined ? "-ms-px -mt-px border-s border-t" : boxes[variant],
            className,
          )}
          data-slot="stat"
          {...props}
        />
      </TilePlace.Provider>
    </StatContext.Provider>
  );
}

/**
 * What the number is, muted, as "Balance". Its icon, an IconTile, and its action, a StatAction, are written in it, as
 * a term holds all that names it.
 */
function StatLabel({ className, ...props }: ComponentProps<"dt">) {
  const { labelId } = useContext(StatContext);
  return (
    <dt
      className={cn(
        "flex items-center gap-2 type-label text-muted-foreground",
        className,
      )}
      data-slot="stat-label"
      id={labelId}
      {...props}
    />
  );
}

/**
 * The number itself, at 24/32 and 600 with tabular figures, which an Amount, a Percent or a Quantity in it takes, as
 * does plain text; a size given by hand wins. Left empty while its group loads, a shape stands in its place.
 */
function StatValue({ className, children, ...props }: ComponentProps<"dd">) {
  const { isLoading } = useContext(GroupContext);
  const isEmpty = Children.toArray(children).length === 0;
  return (
    <dd
      className={cn("mt-1 type-amount-lg", className)}
      data-slot="stat-value"
      {...props}
    >
      {isLoading && isEmpty ? (
        <Skeleton
          aria-hidden="true"
          className="h-8 w-32 group-data-[variant=muted]/stat-group:bg-background"
        />
      ) : (
        <ValueSizeContext.Provider value="lg">
          {children}
        </ValueSizeContext.Provider>
      )}
    </dd>
  );
}

/**
 * The note under the number, small and muted, as its change beside the app's words; a value in it keeps its own size.
 */
function StatDescription({ className, ...props }: ComponentProps<"dd">) {
  return (
    <dd
      className={cn("mt-2 text-xs text-muted-foreground", className)}
      data-slot="stat-description"
      {...props}
    />
  );
}

/**
 * An action on a number, written in its label: a quiet icon button of 32 px at the label's end, whose name joins the
 * app's one word to the label, as "Open Invested", and which takes no more height than the label's line. A number
 * with no label throws, as its action would have no name to say which number it acts on.
 */
function StatAction({
  "aria-label": label,
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "aria-label" | "size" | "variant"> & {
  "aria-label": string;
}) {
  const { labelId } = useContext(StatContext);
  const id = useId();
  useLayoutEffect(() => {
    if (document.getElementById(labelId as string) === null) {
      throw new Error(
        `StatAction: "${label}" needs its stat labelled by StatLabel.`,
      );
    }
  }, [labelId, label]);
  return (
    <Button
      aria-label={label}
      aria-labelledby={`${id} ${labelId}`}
      className={cn("-my-1.5 ms-auto flex", className)}
      data-slot="stat-action"
      id={id}
      size="icon-sm"
      variant="ghost"
      {...props}
    />
  );
}

export { Stat, StatAction, StatDescription, StatGroup, StatLabel, StatValue };
