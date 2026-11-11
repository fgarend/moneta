// A date field has a name, and a rule it keeps has the app's words for when it is broken.
import type { ComponentProps } from "react";
import { expectTypeOf, it } from "vitest";
import type { DateField } from "../src/components/date-field.js";

type DateFieldProps = ComponentProps<typeof DateField>;

it("asks a date field for its name", () => {
  expectTypeOf<object>().not.toExtend<DateFieldProps>();
  expectTypeOf<{ label: string }>().toExtend<DateFieldProps>();
  expectTypeOf<{ "aria-label": string }>().toExtend<DateFieldProps>();
});

it("asks a rule for its message", () => {
  expectTypeOf<{
    label: string;
    isRequired: true;
  }>().not.toExtend<DateFieldProps>();
  expectTypeOf<{
    label: string;
    minValue: string;
  }>().not.toExtend<DateFieldProps>();
  expectTypeOf<{
    label: string;
    isInvalid: true;
  }>().not.toExtend<DateFieldProps>();
  expectTypeOf<{
    label: string;
    isRequired: true;
    errorMessage: string;
  }>().toExtend<DateFieldProps>();
});
