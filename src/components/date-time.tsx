// A date, as a <time> whose datetime is the ISO value given, in one of four formats and the language React Aria speaks,
// its first letter a capital, as it stands alone in a cell or a title. docs/decisions/dates.md says why it is so.
import { cn } from "cn";
import { type HTMLAttributes, useContext } from "react";
import { useLocale } from "react-aria-components";
import { MonetaContext } from "#hooks/moneta";
import { type DateFormat, formatDate } from "#lib/date";

function DateTime({
  value,
  format = "short",
  showTime = false,
  relative = false,
  timeZone,
  emptyLabel,
  className,
  ...props
}: Omit<HTMLAttributes<HTMLElement>, "children"> & {
  // An ISO day, "2026-10-24", or moment, "2026-10-24T14:32:00Z"; null says there is no date, which shows a dash.
  value: string | null;
  format?: DateFormat;
  // A moment's time, after its date.
  showTime?: boolean;
  // Today, yesterday and tomorrow as words, in the short format.
  relative?: boolean;
  // The zone a moment is shown in, and today is counted in, over MonetaProvider's. The browser's with neither.
  timeZone?: string;
  // What screen readers hear for no date, over MonetaProvider's.
  emptyLabel?: string;
}) {
  const { locale } = useLocale();
  const provided = useContext(MonetaContext);
  if (value === null) {
    const words = emptyLabel ?? provided.emptyLabel;
    if (words === undefined) {
      throw new Error(
        "DateTime: no date needs an emptyLabel, on it or on MonetaProvider.",
      );
    }
    return (
      <span className={className} data-slot="date-time" {...props}>
        <span aria-hidden="true">—</span>
        <span className="sr-only">{words}</span>
      </span>
    );
  }
  const text = formatDate(locale, value, {
    format,
    showTime,
    relative,
    timeZone: timeZone ?? provided.timeZone,
  });
  return (
    <time
      className={cn(className)}
      data-slot="date-time"
      dateTime={value}
      {...props}
    >
      {text.charAt(0).toLocaleUpperCase(locale) + text.slice(1)}
    </time>
  );
}

export { DateTime };
