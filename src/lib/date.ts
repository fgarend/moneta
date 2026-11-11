// Dates as Moneta holds them, and the one path from a value to its text, which DateTime and useFormatDate take.
// Internal: an app gets it through them. docs/decisions/dates.md says why it is so.

// A day, "2026-10-24", with no time or zone, or a moment, "2026-10-24T14:32:00Z", with its offset, as a backend
// sends them.
const isoDay = /^(\d{4})-(\d{2})-(\d{2})$/u;
const isoMoment =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/u;

// The formats by name: a short date for rows, a long one for titles, a numeric one for documents, and a month for
// periods.
type DateFormat = "short" | "long" | "numeric" | "month";

type DateOptions = {
  format?: DateFormat | undefined;
  // A moment's time, after its date.
  showTime?: boolean | undefined;
  // Today, yesterday and tomorrow as words, in the short format.
  relative?: boolean | undefined;
  // The zone a moment is shown in, and today is counted in. The browser's when not given.
  timeZone?: string | undefined;
  // The moment "today" is counted from. The clock's when not given.
  now?: Date | undefined;
};

// The parts each format writes; the year is added to short and long ones only when it is not this year's.
const parts: Record<DateFormat, Intl.DateTimeFormatOptions> = {
  short: { day: "numeric", month: "short" },
  long: { weekday: "long", day: "numeric", month: "long" },
  numeric: { day: "2-digit", month: "2-digit", year: "numeric" },
  month: { month: "long", year: "numeric" },
};
const yearWhenAnother: Record<DateFormat, boolean> = {
  short: true,
  long: true,
  numeric: false,
  month: false,
};
// How far from today a day has a word of its own: yesterday, today and tomorrow, as some languages have a word for
// two days away and others none.
const nearest = 1;
const msPerDay = 86_400_000;

function refuse(value: string): never {
  throw new Error(
    `DateTime: "${value}" is not an ISO day or moment, as "2026-10-24" or "2026-10-24T14:32:00Z".`,
  );
}

// A day as UTC midnight, written in UTC, so no zone moves it; a moment as itself.
function read(value: string): { instant: Date; isDay: boolean } {
  const day = isoDay.exec(value);
  if (day !== null) {
    const [, year, month, date] = day.map(Number) as [
      number,
      number,
      number,
      number,
    ];
    const instant = new Date(Date.UTC(year, month - 1, date));
    if (instant.getUTCMonth() !== month - 1 || instant.getUTCDate() !== date) {
      refuse(value);
    }
    return { instant, isDay: true };
  }
  if (!isoMoment.test(value)) {
    refuse(value);
  }
  return { instant: new Date(value), isDay: false };
}

// The calendar day an instant falls on in a zone, as a count of days, so two can be compared.
function dayNumber(instant: Date, timeZone: string | undefined): number {
  const [year, month, date] = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(instant)
    .split("-")
    .map(Number) as [number, number, number];
  return Date.UTC(year, month - 1, date) / msPerDay;
}

function yearOf(instant: Date, timeZone: string | undefined): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric" }).format(
    instant,
  );
}

function formatDate(
  locale: string,
  value: string,
  {
    format = "short",
    showTime = false,
    relative = false,
    timeZone,
    now = new Date(),
  }: DateOptions = {},
): string {
  const { instant, isDay } = read(value);
  if (isDay && showTime) {
    throw new Error(
      `DateTime: "${value}" is a day, which has no time to show.`,
    );
  }
  // A day is read in UTC, where it was set; a moment in the zone asked for.
  const zone = isDay ? "UTC" : timeZone;
  if (relative && format === "short") {
    const away =
      Math.round(dayNumber(instant, zone)) - dayNumber(now, timeZone);
    if (Math.abs(away) <= nearest) {
      return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
        away,
        "day",
      );
    }
  }
  const options: Intl.DateTimeFormatOptions = {
    ...parts[format],
    timeZone: zone,
  };
  if (
    yearWhenAnother[format] &&
    yearOf(instant, zone) !== yearOf(now, timeZone)
  ) {
    options.year = "numeric";
  }
  if (showTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Intl.DateTimeFormat(locale, options).format(instant);
}

export { type DateFormat, type DateOptions, formatDate };
