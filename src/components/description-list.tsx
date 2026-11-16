import { cn } from "cn";
import type { ComponentProps } from "react";

/**
 * The details of one thing, each a term and its value, side by side with the value at the end, and one above the
 * other when the list is narrower than 288 px.
 *
 * **Use it for**
 *
 * - The details of one thing, as an account's holder, institution and balance, in a side panel, a card or a part of a
 *   page, each pair a `DescriptionItem` with its `DescriptionTerm` and `DescriptionDetails`.
 * - A value as an `Amount`, a `Percent`, a `DateTime` or text, which lines up at the end, as a row's amount does.
 * - A pair shown only sometimes, as a `DescriptionItem` written or not; a value missing, in your words, as "None", or
 *   `Amount`'s own words for no value.
 *
 * **Not recommended**
 *
 * - A list of things, each with its value: use `ItemGroup`.
 * - Values compared down columns: use `Table`.
 * - Numbers of note read together: use `StatGroup`.
 * - Details to edit: use the fields of a form.
 */
function DescriptionList({ className, ...props }: ComponentProps<"dl">) {
  return (
    <dl
      data-slot="description-list"
      className={cn(
        "@container/description-list flex flex-col gap-2 text-sm",
        className,
      )}
      {...props}
    />
  );
}

/** One pair: its term and its value, side by side, or one above the other when the list is narrow. */
function DescriptionItem({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="description-item"
      className={cn(
        "grid @2xs/description-list:grid-cols-[auto_1fr] @2xs/description-list:gap-x-4",
        className,
      )}
      {...props}
    />
  );
}

/** What the value is, as "Balance", quieter than the value. */
function DescriptionTerm({ className, ...props }: ComponentProps<"dt">) {
  return (
    <dt
      data-slot="description-term"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

/** The value, at the end of its pair, or under its term when the list is narrow. */
function DescriptionDetails({ className, ...props }: ComponentProps<"dd">) {
  return (
    <dd
      data-slot="description-details"
      className={cn("text-start @2xs/description-list:text-end", className)}
      {...props}
    />
  );
}

export {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
};
