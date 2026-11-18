"use client";

import { cn } from "cn";
import {
  LabelContext,
  Label as LabelPrimitive,
  type LabelProps,
} from "react-aria-components";

/**
 * The visible name of a control, at 14/20 and 500, as a control's words are.
 *
 * **Use it for**
 *
 * - A field's name, inside a `TextField` or a field of React Aria, which links it to its box by itself.
 * - A control of the page's own, by `htmlFor`.
 *
 * **Not recommended**
 *
 * - A group's name: `FieldLegend`, in a `FieldSet`.
 * - A name nobody sees: the control's `aria-label`.
 */
function Label({ className, htmlFor, slot, children, ...props }: LabelProps) {
  const label = (
    <LabelPrimitive
      data-slot="label"
      className={cn(
        "block text-sm leading-5 font-medium select-none group-data-[disabled=true]/field:pointer-events-none group-data-[disabled=true]/field:opacity-50 group-data-[invalid=true]/field:text-destructive peer-disabled:cursor-not-allowed peer-disabled:opacity-50 peer-data-disabled:opacity-50",
        className,
      )}
      {...props}
      htmlFor={htmlFor}
      slot={slot}
    >
      {children}
      {/* A required field's mark, which a screen reader skips, as it hears the field is required. */}
      <span
        aria-hidden="true"
        className="ms-1 hidden group-data-[required=true]/field:inline"
        data-slot="label-required"
      >
        *
      </span>
    </LabelPrimitive>
  );

  if (htmlFor && slot === undefined) {
    return <LabelContext.Provider value={null}>{label}</LabelContext.Provider>;
  }

  return label;
}

export { Label };
