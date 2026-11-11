// Dates for an app: the hook that writes a date where no piece can go, as a sentence or a chart's axis, in the
// browser's case, to sit in a sentence. docs/decisions/dates.md says why it is so.
import { useCallback } from "react";
import { useLocale } from "react-aria-components";
import { type DateFormat, type DateOptions, formatDate } from "#lib/date";

// As the piece's props.
type FormatDateOptions = Omit<DateOptions, "now">;

// The same text as DateTime, but its first letter as the browser writes it.
function useFormatDate(): (
  value: string,
  options?: FormatDateOptions,
) => string {
  const { locale } = useLocale();
  return useCallback(
    (value, options) => formatDate(locale, value, options),
    [locale],
  );
}

export type { DateFormat };
export { useFormatDate };
