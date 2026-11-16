import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  type ComponentProps,
  createContext,
  isValidElement,
  useContext,
  useId,
} from "react";
import { partsOf } from "#hooks/children";

// A meaning on a tint of its colour, 10% in both modes, as a badge's, its icon and title in its colour and
// its description in the text's. Its default is the card's.
const alertVariants = cva(
  "group/alert @container/alert w-full rounded-lg border px-2.5 py-2 text-start text-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "border-transparent bg-destructive/10 text-destructive **:data-[slot=alert-description]:text-foreground",
        success:
          "border-transparent bg-success/10 text-success **:data-[slot=alert-description]:text-foreground",
        warning:
          "border-transparent bg-warning/10 text-warning **:data-[slot=alert-description]:text-foreground",
        info: "border-transparent bg-info/10 text-info **:data-[slot=alert-description]:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

// Each meaning's icon, of its own shape, the same on every screen.
const icons = {
  destructive: CircleAlertIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  info: InfoIcon,
};

// The id of the title its alert is named by.
const TitleId = createContext<string | undefined>(undefined);

/**
 * A message about a part of the page or what just happened, in its meaning's colour and icon, under its title.
 *
 * **Use it for**
 *
 * - Something that went wrong, in `destructive`, which a screen reader hears at once, saying what and what to do, as
 *   in place of a part that could not be read.
 * - Something that asks attention, in `warning`, a result, in `success`, or news, in `info`, which a screen reader
 *   hears once it finishes what it reads.
 * - An action that settles it, in `AlertAction`, which moves under the words when the alert is narrow.
 * - Several things of one kind, as a list in its description, in one alert.
 *
 * **Not recommended**
 *
 * - A message that comes and goes on its own: a toast, to come.
 * - A field's error: the field's own `errorMessage`.
 * - The state of one row: a `Badge`.
 * - Asking to confirm before acting: an `AlertDialog`, to come.
 * - Its meaning in its words alone: its title says what happened, and its variant gives its colour and icon.
 */
function Alert({
  className,
  variant = "default",
  children,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  const ownId = useId();
  const title = partsOf(children).find(
    (part) => isValidElement<{ id?: string }>(part) && part.type === AlertTitle,
  );
  const titleId = isValidElement<{ id?: string }>(title)
    ? (title.props.id ?? ownId)
    : undefined;
  const Icon =
    variant === null || variant === "default" ? null : icons[variant];
  return (
    // biome-ignore lint/a11y/useAriaPropsSupportedByRole: its role, alert or status, is set by its variant, and both take a name.
    <div
      aria-labelledby={props["aria-label"] === undefined ? titleId : undefined}
      className={cn(alertVariants({ variant }), className)}
      data-slot="alert"
      data-variant={variant}
      // Something wrong is heard at once; the rest once the reader finishes.
      role={variant === "destructive" ? "alert" : "status"}
      {...props}
    >
      <TitleId.Provider value={titleId}>
        {/* Its icon, its words, and its action at its end, under its words when narrow. */}
        <div className="grid grid-cols-[auto_1fr_auto] *:[svg]:col-start-1 *:[svg]:row-span-2 *:[svg]:row-start-1 *:[svg]:me-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4">
          {Icon === null ? null : <Icon aria-hidden="true" />}
          {children}
        </div>
      </TitleId.Provider>
    </div>
  );
}

function AlertTitle({ className, id, ...props }: ComponentProps<"div">) {
  const fromAlert = useContext(TitleId);
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 font-medium [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className,
      )}
      id={id ?? fromAlert}
      {...props}
    />
  );
}

// Paragraphs 8 px apart, and a list with markers, 4 px between its items.
function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 mt-0.5 text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_li:not(:last-child)]:mb-1 [&_ol]:list-decimal [&_ol]:ps-5 [&_ul]:list-disc [&_ul]:ps-5 [&>:not(:last-child)]:mb-2",
        className,
      )}
      {...props}
    />
  );
}

// Several controls in a row, 8 px apart, at the alert's end, and under its words when it is narrower than 384 px. In
// the text's colour, not its meaning's, which a control without its own would take.
function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn(
        "col-start-2 mt-2 flex flex-wrap items-center gap-2 text-foreground @sm/alert:col-start-3 @sm/alert:row-span-2 @sm/alert:row-start-1 @sm/alert:mt-0 @sm/alert:ms-4 @sm/alert:self-start",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
