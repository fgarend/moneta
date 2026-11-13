// A day typed in, part by part in the language's order, from and to an ISO string, as DateTime takes one. Its label,
// description and error are the app's words, linked to it by React Aria. docs/decisions/dates.md says why it is so.
import { type CalendarDate, parseDate } from "@internationalized/date";
import { cn } from "cn";
import {
  DateField as DateFieldPrimitive,
  DateInput,
  DateSegment,
  FieldError,
  Text,
} from "react-aria-components";
import { Label } from "#components/label";

// Its name: a label above it, or aria-label where its label is elsewhere.
type DateFieldName =
  | { label: string; "aria-label"?: never }
  | { "aria-label": string; label?: never };

// A rule it keeps, with the app's words for when it is broken; with no rule, no words.
type DateFieldRules =
  | {
      isRequired?: boolean;
      // The least and the greatest day, as ISO days.
      minValue?: string;
      maxValue?: string;
      // Invalid as the app or its server says.
      isInvalid?: boolean;
      errorMessage: string;
    }
  | {
      isRequired?: never;
      minValue?: never;
      maxValue?: never;
      isInvalid?: never;
      errorMessage?: never;
    };

const isoDay = /^\d{4}-\d{2}-\d{2}$/u;

// An ISO day as React Aria holds it; another string throws, rather than show a wrong day.
function dayOf(
  value: string | null | undefined,
): CalendarDate | null | undefined {
  if (value === null || value === undefined) {
    return value;
  }
  try {
    if (isoDay.test(value)) {
      return parseDate(value);
    }
  } catch {
    // A date that does not exist, as the 30th of February, falls through to the error below.
  }
  throw new Error(`DateField: "${value}" is not an ISO day, as "2026-10-24".`);
}

const sizes = { default: "h-9", sm: "h-8", lg: "h-10" };

function DateField({
  label,
  "aria-label": ariaLabel,
  description,
  errorMessage,
  value,
  defaultValue,
  onChange,
  minValue,
  maxValue,
  size = "default",
  className,
  ...props
}: DateFieldName &
  DateFieldRules & {
    // An ISO day, or null for none; or the day it starts with, the field keeping it.
    value?: string | null;
    defaultValue?: string | null;
    // The ISO day once it is whole, or null once it is cleared; a day half typed says nothing.
    onChange?: (value: string | null) => void;
    description?: string;
    size?: keyof typeof sizes;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    name?: string;
    className?: string;
  }) {
  return (
    <DateFieldPrimitive
      aria-label={ariaLabel}
      className={cn("group/date-field flex flex-col gap-2", className)}
      data-slot="date-field"
      defaultValue={dayOf(defaultValue)}
      maxValue={dayOf(maxValue)}
      minValue={dayOf(minValue)}
      onChange={(day) => onChange?.(day === null ? null : day.toString())}
      validationBehavior="aria"
      value={dayOf(value)}
      {...props}
    >
      {label === undefined ? null : <Label>{label}</Label>}
      <DateInput
        className={cn(
          "flex w-full min-w-0 items-center rounded-lg border border-input bg-transparent px-2.5 text-base tabular-nums transition-colors outline-none md:text-sm dark:bg-input/30",
          "data-focus-within:border-ring data-focus-within:ring-3 data-focus-within:ring-ring/50",
          "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
          "data-disabled:cursor-not-allowed data-disabled:bg-input/50 data-disabled:opacity-50 dark:data-disabled:bg-input/80",
          sizes[size],
        )}
        data-slot="date-input"
      >
        {/* Each part a target of 24 px each way, whatever the font, and the slash between them only its width. */}
        {(segment) => (
          <DateSegment
            className="inline-flex h-6 min-w-6 items-center justify-center rounded-sm px-0.5 outline-none data-focused:bg-muted data-focused:text-foreground data-placeholder:text-muted-foreground data-[type=literal]:min-w-0 data-[type=literal]:px-0"
            segment={segment}
          />
        )}
      </DateInput>
      {description === undefined ? null : (
        <Text className="text-sm text-muted-foreground" slot="description">
          {description}
        </Text>
      )}
      <FieldError className="text-sm text-destructive">
        {errorMessage}
      </FieldError>
    </DateFieldPrimitive>
  );
}

export { DateField };
