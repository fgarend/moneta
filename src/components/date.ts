// Dates for an app: the hook that writes a date where no piece can go, as a sentence or a chart's axis, in the
// browser's case, to sit in a sentence. docs/decisions/dates.md says why it is so.
import { useCallback, useContext } from "react";
import { useLocale } from "react-aria-components";
import { MonetaContext } from "#hooks/moneta";
import { type DateFormat, type DateOptions, formatDate } from "#lib/date";

// As the piece's props.
type FormatDateOptions = Omit<DateOptions, "now">;

// The same text as DateTime, but its first letter as the browser writes it, in MonetaProvider's zone unless given one.
function useFormatDate(): (
  value: string,
  options?: FormatDateOptions,
) => string {
  const { locale } = useLocale();
  const { timeZone } = useContext(MonetaContext);
  return useCallback(
    (value, options) =>
      formatDate(locale, value, {
        ...options,
        timeZone: options?.timeZone ?? timeZone,
      }),
    [locale, timeZone],
  );
}

export type { DateFormat };
export { useFormatDate };
