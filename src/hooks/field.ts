// How a field lays out its label, its box and its words, shared by Field and TextField, which draw the same frame.
// Internal: an app gets it through those two pieces. Across, a label beside a FieldContent keeps its width and sits
// 8 px down, level with a box of 36 px; beside a switch alone, it takes the room left.
import { cva } from "class-variance-authority";

const fieldVariants = cva("group/field flex w-full gap-2", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start not-has-[>[data-slot=field-content]]:*:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:*:data-[slot=field-label]:mt-2 has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      responsive:
        "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:not-has-[>[data-slot=field-content]]:*:data-[slot=field-label]:flex-auto @md/field-group:has-[>[data-slot=field-content]]:*:data-[slot=field-label]:mt-2 [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

type FieldOrientation = "vertical" | "horizontal" | "responsive";

export { type FieldOrientation, fieldVariants };
