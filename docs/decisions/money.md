# Money

How Moneta holds an amount of money, and how it shows one.

## What holds today

- **One type, `Money`: `{ amount, currency }`,** an exact decimal string and its currency's code, as a backend sends
  them, for every piece of money. A JavaScript number never holds one.
- **Shown exactly:** every digit given, never rounded, padded with zeros to the currency's decimals.
- **The currency's decimals are the browser's,** which `Intl` gives. They differ only in how many zeros pad an amount,
  and never drop a digit given.
- **A negative amount takes the minus sign, U+2212, in every language,** where the language puts it, with no space
  after it, as `−R$ 1.234,50`. Zero takes no sign, even when given as `-0`.
- **A copy of one value takes a hyphen for its minus,** and a copy of more is the browser's own.
- **An amount that is not a decimal string, or a currency that is not three capital letters, throws an error** that
  names it.
- **The words are the app's.** `MoneyProvider`, once at the app's root, holds what screen readers hear for no value,
  `emptyLabel`, and a piece's own prop wins over it. A piece with no value and no words throws an error.
- **A percent is a ratio, a decimal string of a fraction of one,** `"0.459"` for 45.9%, shown with exactly the
  decimals given beyond its hundredths, zeros too, and never rounded: `"0.15"` is 15%, and `"0.1500"` 15,00%.
- **A quantity, as shares or units, is a decimal string,** shown with exactly the decimals given, zeros too. Its unit
  is the app's words, around it.
- **One path from a value to its text,** in `src/lib/money.ts`, internal, in the language React Aria's
  `I18nProvider` gives. `Amount`, `Percent` and `Quantity` take it, and so do `useFormatMoney`, `useFormatPercent`
  and `useFormatQuantity`, for where no piece can go, as a chart's axis. What the pieces share beyond it, their text, the words for no value and the
  copy, is `src/hooks/use-value.ts`, internal too.
- **`Amount`, `Percent` and `Quantity` draw a `data` element, with the value as given in its `value`.** No value draws a `span`,
  with a dash hidden from screen readers and the app's words for them.
- **They never wrap and are never cut,** so whatever holds them deals with the space.
- **They bring their text,** with `size`: `default` for a row, at 500 in the size around it, and `lg` for a value of
  note, at 24/32 and 600, both with tabular figures.
- **Each file is imported by its name:** `@fgarend/moneta/money` for `Money` and the hooks,
  `@fgarend/moneta/money-provider`, `@fgarend/moneta/amount`, `@fgarend/moneta/percent` and
  `@fgarend/moneta/quantity`.
  `money.ts` holds no piece, so it is the one file in `src/components/` that is not a `.tsx`.

## Why

- **A decimal string,** as a number cannot hold every amount exactly, and Shopify's `MoneyV2`, PayPal and Open
  Banking send one beside a code. `Intl` formats such a string with every digit, in the three engines tried on
  2026-11-08. **What it costs:** an app parses nothing, but cannot do sums with what it gives a piece.
- **Exact,** as an amount rounded on a screen can disagree with the one in a statement, and `Intl` rounds silently
  by default.
- **The browser's decimals,** as the three engines agree on the common currencies, BRL, USD, EUR, JPY and BHD among
  them, and the specification lets each choose since 2024. **What it costs:** in about 17 currencies, as HUF, COP,
  IDR and IQD, Chromium follows CLDR and writes fewer zeros than Firefox and Safari, which follow ISO 4217, so
  `1000.00` HUF is `1 000 Ft` in one and `1 000,00 Ft` in the others.
- **U+2212,** as JAWS, NVDA, VoiceOver and TalkBack read it as "minus", while VoiceOver on macOS may skip a hyphen,
  and a loss read as a gain is the worst mistake an amount can make. It is as wide as a plus, and lines a column up.
  The language's own place, as a space of our own would need a rule for every pattern.
- **A hyphen in a copy,** as Excel and LibreOffice read a pasted U+2212 as text, not as a negative number. **Of one
  amount only,** as a page can replace a copy but not change one: a copy of a table's row would have to be built
  again, as text and as HTML, which a spreadsheet needs for its columns. **What it costs:** a row copied into a
  spreadsheet keeps its minus as text.
- **An error for a wrong amount,** as `"R$ NaN"` reaches whoever uses the app, and a dash would show a backend's
  mistake as an amount not there yet. **What it costs:** one wrong row breaks the screen, unless an error boundary
  holds it, and `"1e5"` and `"+10"`, which `Intl` reads, are refused.
- **A provider for the words,** as the same two words would repeat on every amount of an app, and the hidden mode
  needs a context of its own anyway. **An error when they are missing,** so an app finds it while it builds, not a
  screen reader's user. **What it costs:** TypeScript cannot ask for them, as it asks `Dialog` for `closeLabel`.
- **A ratio,** as `Intl`, spreadsheets and charts count 100% as 1, a share times a total is an amount with nothing
  to divide, and one form leaves no doubt whether `"15"` is 15% or 1500%. **What it costs:** a rate a backend sends in
  points, as `"15"`, is the app's to turn into `"0.15"`, exactly, and a `"45.9"` given by mistake shows 4590%.
- **The decimals given,** as a percent has no currency to pad it, and the app decides its precision where it builds
  the value, so one that sends `"0.1500"` and `"0.0324"` lines a column up. **What it costs:** a ratio divided and
  sent whole shows every digit, as `3,2412345678%`.
- **A quantity's decimals as given,** as each asset has its own precision, whole shares, a fund's six decimals or a
  coin's eight, which only the app knows. **What it costs:** a column of mixed assets does not line up its decimals.
- **No unit,** as a table names it once in its header, a unit is the app's words, with plurals that differ by
  language, and `Intl` names only units of measure, not shares. **What it costs:** in a sentence, a quantity and its
  unit may wrap apart, and the unit stays outside the `data`.
- **One path,** so a chart's axis and a table beside it never differ in a sign or a digit. **Internal,** as
  `src/lib/` and `src/hooks/` are, so an app depends only on the pieces and the hooks.
- **The type and the hook apart from the provider,** as a file that draws a piece exports only pieces, so that Fast
  Refresh can swap them, which Biome's `useComponentExportOnlyModules` holds with no exception. **What it costs:** an
  app imports money from two places.
- **The hooks of every kind of value in `money.ts`,** so a chart of amounts and percents imports from one place, and
  as `percent.ts` would build to the same `percent.js` as the piece.
- **`data`,** as HTML has that element for a value a machine reads, and the most semantic element is the rule
  `components.md` gives. **A `span` for no value,** as `data` needs one, and so the hidden mode will leave nothing in
  the page to read.
- **Never cut,** as an ellipsis hides digits, and never wrapped, as `Intl` already joins a currency to its number
  with a space that does not break. WCAG 1.4.10 lets a table scroll.
- **Its own text,** as an app gets the scale through the pieces, and the theme's `type-amount` and `type-amount-lg`
  had no piece.

## Alternatives considered

- **A number, or minor units as an integer.** Exact only up to 2^53, and an integer needs each currency's decimals to
  be read.
- **Rounding to the currency's decimals.** Familiar, but it hides what an app gave.
- **A table of ISO 4217 of our own.** The same zeros in every browser, but about 180 currencies to keep as SIX
  changes them.
- **The digits given, unpadded.** No table at all, but `"599.4"`, as a backend sends it, would be `R$ 599,4`.
- **The hyphen `Intl` writes.** Nothing to do, and it pastes as a number, but a screen reader may skip it.
- **A space after the minus,** as a prototype has. It stands apart, but needs a rule for every language.
- **Cents raised or smaller, and a muted symbol.** VoiceOver on iOS stops at each part, and reads raised cents as
  another number.
- **`Money`, `MoneyProvider` and `useFormatMoney` from one file,** with Biome's rule told to allow the two names. One
  import, but an exception to a rule that has none.
- **A percent in points, or a prop that says which.** Closer to how a rate is said, but a prop given wrong shows
  1500% for 15%.
- **A prop that rounds a percent, as `decimals`.** What most libraries offer, but it rounds silently, in the screen.
- **`ratio` for Percent's prop.** It says the form where it is written, but breaks `value`, the name every piece of
  money and React Aria use.
- **A `unit` prop on Quantity,** joined to the number by a space that does not break. It may come when a screen
  needs it, with nothing broken.
- **The words as a prop on every piece,** which TypeScript can ask for, but which each app would wrap to avoid.
- **A dash, or `Intl`'s own text, for a wrong amount.** Softer, but silent.
- **A `span` with the value.** Simpler, and the same to a screen reader, but a machine reads only the formatted text.
- **An ellipsis, a wrap at the thousands, or a smaller font.** They fit, but hide digits, or set amounts side by
  side in different sizes.
- **An `Amount` that only lines its digits up,** leaving the size to what holds it. Right in a sentence, but with no
  piece to hold an amount of note until Stat.

## History

- 2026-11-10: Written, with `Money`, `MoneyProvider`, `useFormatMoney` and `Amount`.
- 2026-11-10: `Percent` and `useFormatPercent`.
- 2026-11-10: `Quantity` and `useFormatQuantity`.
