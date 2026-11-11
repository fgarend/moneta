# Dates

How Moneta holds a date, and how it shows one.

## What holds today

- **A date is an ISO string, as a backend sends it:** `"2026-10-24"`, a day, with no time or zone, or
  `"2026-10-24T14:32:00Z"`, a moment, with its offset. Any other string throws an error that names it.
- **A day never moves:** it is read as midnight in UTC and written in UTC, so no zone can shift it to the day before.
- **`DateTime` draws a `<time>` whose `datetime` is the value given,** its text in the language React Aria speaks,
  its first letter a capital, as it stands alone in a cell or a title.
- **Four formats by name, `format`:** `"short"`, the default, as "24 de out."; `"long"`, as "sábado, 24 de outubro";
  `"numeric"`, as "24/10/2026"; and `"month"`, as "outubro de 2026". `showTime` adds a moment's time, as "24 de out.,
  14:32"; a day has none, and asking for it throws.
- **The year shows in `"short"` and `"long"` only when it is not this year's,** and always in `"numeric"` and
  `"month"`.
- **`relative` writes today, yesterday and tomorrow as words,** in `"short"` only, as `Intl.RelativeTimeFormat` gives
  them, one day each way.
- **A moment, "today" and "this year" are in the browser's zone,** or in `timeZone` on the piece and the hook.
- **No date shows a dash,** `value={null}`, with what screen readers hear from `emptyLabel` on the piece or on
  `MoneyProvider`; with no words, it throws.
- **`useFormatDate` gives the same text where no piece can go,** in the browser's case, to sit in a sentence.
- **One path from a value to its text,** in `src/lib/date.ts`, internal, on `Intl` alone.
- **`DateField` takes a day typed in, part by part in the language's order,** on React Aria's `DateField`, from and to
  an ISO day: `value` and `defaultValue` take one, `onChange` gives one once the day is whole and `null` once every part
  is cleared, and a day half typed changes nothing until it is whole. A value that is not an ISO day, or a day that
  does not exist, throws.
- **One piece, with `label` or `aria-label`, `description` and `errorMessage` as props,** linked by React Aria; its
  name asked for by TypeScript.
- **36 px, as `Input`, and 32 at `size="sm"`,** with `Input`'s border, ring, invalid red and disabled look, tabular
  parts, and the focused one on `--muted`.
- **Validation as it happens, `validationBehavior="aria"`:** `isRequired`, `minValue` and `maxValue` as ISO days, and
  `isInvalid`, each with the app's `errorMessage`, which TypeScript asks for whenever a rule is set.

## Why

- **An ISO string, not a `Date`,** as money takes a decimal string and a backend sends dates so, and as
  `new Date("2026-10-24")` is UTC midnight, the 23rd in São Paulo. A day apart from a moment, as Plaid keeps a
  transaction's date apart from its time, and React Aria keeps `CalendarDate` apart from `ZonedDateTime`.
- **Showing a date on `Intl` alone,** as money's core is, as `@internationalized/date`'s `DateFormatter` fixes
  `hour12` and ranges, which Moneta does not use. **What it costs:** a range of dates or a fixed 24-hour clock would
  bring that choice back. **`@internationalized/date` a dependency since 2026-11-11, for `DateField`,** whose value
  React Aria takes as its `CalendarDate`, at the version React Aria brings, so nothing new reaches an app.
- **Four formats by name,** which cover what an app's screens and prototypes show, so a screen names one rather than
  build `Intl`'s options. **What it costs:** another format changes the piece.
- **The year left out this year,** as Polaris, Primer and Material leave it, and kept in documents and periods, as
  GOV.UK keeps it always. **What it costs:** a list across the new year shows some years and not others.
- **Relative words one day each way, in the short format,** as Polaris words today and yesterday, and as pt-BR's
  "anteontem" has no peer in English, so the rule is the same in every language. **What it costs:** a group's title by
  day shows "Sábado, 24 de outubro", not "Hoje · sábado, 24 de outubro", which the hook can compose.
- **A capital in the piece, the browser's case in the hook,** as the piece stands alone and the hook sits in a sentence.
- **The browser's zone, and `timeZone` per use,** as a provider for the app's zone waits for Sidebar, AppLayout and
  providers. **What it costs:** an app that wants one zone passes it on each use until then.
- **`DateField` on React Aria's, as its starters build it,** with the label, description and error as props, as
  shadcn's aria-nova style has a calendar and no date field, and `Field`'s description is not linked yet. **What it
  costs:** Actions and forms may open its parts, as a breaking change.
- **Its value in ISO, as `DateTime`'s,** so a day goes from a backend to the field and back with no conversion of the
  app's. **What it costs:** a half typed day leaves the app with the last whole one, as React Aria reports a day only
  when it is whole or cleared.
- **The message always the app's,** asked for by TypeScript with each rule, as a piece has no default text, React
  Aria's neither. **What it costs:** a rule with no words does not compile.
- **`MoneyProvider`'s `emptyLabel`,** so the app words "no value" once. **What it costs:** its name says money; it may
  become a provider of values.

## Alternatives considered

- **`CalendarDate` and `ZonedDateTime` as props,** typed, but each use would convert first.
- **`@internationalized/date` for showing a date too,** `parseDate`, `parseAbsolute` and `DateFormatter`, which
  `Intl` does without.
- **`Intl`'s options as props,** as `useDateFormatter` takes them, freer, but each screen would invent a format.
- **Two pieces, `Day` and `Moment`,** each named for what it takes, for one task.
- **Relative words in `"long"` too,** which needs punctuation of Moneta's own between the word and the date.
- **The year always,** simpler, but every row repeats it.

- **`DateField` as open parts with `Field`,** as shadcn composes a field, but its description is not linked yet.
- **`CalendarDate` as `DateField`'s value,** as React Aria takes it, which each use would convert.
- **Validation on submit, `validationBehavior="native"`,** which needs a form and says nothing as the day is typed.

## History

- 2026-11-11: Written, with `DateTime`, `useFormatDate` and `src/lib/date.ts`.
- 2026-11-11: `@internationalized/date` a dependency, for `DateField`.
- 2026-11-11: `DateField`.
