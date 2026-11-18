"use client";

// A field for text, on React Aria's, which links its label, description and error to its box by itself, laid out as
// Field lays one. docs/decisions/components.md says why it is so.
import { cn } from "cn";
import {
  TextField as TextFieldPrimitive,
  type TextFieldProps,
} from "react-aria-components";
import { type FieldOrientation, fieldVariants } from "#hooks/field";

/**
 * A field to type text in, which holds its label, its box and its words, and links them by itself.
 *
 * **Use it for**
 *
 * - A name, a reference or a note: a `FieldLabel`, an `Input` or a `Textarea`, a `FieldDescription` and a
 *   `FieldError`, in that order.
 * - Its state: `isRequired`, which marks the label with an asterisk, `isInvalid`, `isReadOnly` and `isDisabled`.
 *
 * **Not recommended**
 *
 * - A day, a choice or an amount: `DateField`, `Select`, and the fields to come.
 * - Ids written by hand to link its parts, which the field links by itself.
 */
function TextField({
  className,
  orientation = "vertical",
  ...props
}: Omit<TextFieldProps, "className"> & {
  className?: string;
  orientation?: FieldOrientation;
}) {
  return (
    <TextFieldPrimitive
      data-slot="text-field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

export { TextField };
