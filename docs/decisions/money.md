# Money

How Moneta holds an amount of money, and how it shows one.

## What holds today

- **One type, `Money`: `{ amount, currency }`,** an exact decimal string and its currency's code, as a backend sends
  them, for every piece of money. A JavaScript number never holds one.
- **Shown exactly:** every digit given, never rounded, padded with zeros to the currency's decimals.
- **`hideCurrency` leaves an amount's currency out,** with the space that joins it to the number, for a column of one
  currency whose header names it, as an app's tables have it and Polaris advises. Every digit and the sign stay.
- **The currency's decimals are the browser's,** which `Intl` gives. They differ only in how many zeros pad an amount,
  and never drop a digit given.
- **A negative amount takes the minus sign, U+2212, in every language,** where the language puts it, with no space
  after it, as `−R$ 1.234,50`. Zero takes no sign, even when given as `-0`.
- **A copy of one value takes a hyphen for its minus,** and so does a copy across a table's cells, which the table
  builds; any other copy of more is the browser's own.
- **An amount that is not a decimal string, or a currency that is not three capital letters, throws an error** that
  names it.
- **The words are the app's.** `MonetaProvider`, once at the app's root, holds what screen readers hear for no value,
  `emptyLabel`, and a piece's own prop wins over it. A piece with no value and no words throws an error.
- **A percent is a ratio, a decimal string of a fraction of one,** `"0.459"` for 45.9%, shown with exactly the
  decimals given beyond its hundredths, zeros too, and never rounded: `"0.15"` is 15%, and `"0.1500"` 15,00%.
- **A quantity, as shares or units, is a decimal string,** shown with exactly the decimals given, zeros too. Its unit
  is the app's words, around it.
- **One path from a value to its text,** in `src/lib/money.ts`, internal, in the language `MonetaProvider`
  gives React Aria. `Amount`, `Percent` and `Quantity` take it, and so do `useFormatMoney`, `useFormatPercent`
  and `useFormatQuantity`, for where no piece can go, as a chart's axis. What the pieces share beyond it, their text, the words for no value and the
  copy, is `src/hooks/use-value.ts`, internal too.
- **`sign="always"` shows the plus of a change,** and `"auto"`, the default, the minus alone. Zero takes no sign either
  way. The hooks take `{ sign }`.
- **`tone="positive"` or `"negative"` colours good news or bad,** which the app says and Moneta never reads from the
  sign, in the theme's `--positive` and `--negative`. With no tone, the colour of the text around. Colour is never
  alone: the sign, the column or the words around say it too, which the guidelines ask of the app.
- **Hidden values, when the app asks,** with `isHidden` on `MonetaProvider` and the app's own control. Every value,
  amount, percent and quantity, shows `••••••`, hidden from screen readers, which hear `hiddenLabel`, with no sign, no
  tone and nothing of the value in the page. A value with none shows the dots too. Without `hiddenLabel`, a piece
  throws. The hooks give the dots, and a text only screen readers hear, as an `aria-label`, is the app's to word
  while values are hidden.
- **A `MonetaProvider` inside another keeps what it is not given,** so one that changes only the words never shows
  what the app hid.
- **`Amount`, `Percent` and `Quantity` draw a `data` element, with the value as given in its `value`.** No value draws a `span`,
  with a dash hidden from screen readers and the app's words for them.
- **They never wrap and are never cut,** so whatever holds them deals with the space.
- **They bring their text,** with `size`: `default` for a row, at 500 in the size around it, and `lg` for a value of
  note, at 24/32 and 600, both with tabular figures.
- **Each file is imported by its name:** `@fgarend/moneta/money` for `Money` and the hooks,
  `@fgarend/moneta/moneta-provider`, `@fgarend/moneta/amount`, `@fgarend/moneta/percent` and
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
  again, as text and as HTML, which a spreadsheet needs for its columns. **What it costs:** a copy of more than one
  value outside a table keeps its minus as text. Since 2026-11-11, Table builds the copy of its own cells.
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
- **A sign and a tone on each piece, with no piece for a change,** as a change is a value with its plus, and an
  expense has a tone with no change, so one more piece would only repeat these. **What it costs:** an app can forget
  `sign="always"` on a change.
- **`auto` and `always`,** Intl's names, with `never` left out, as it would hide a loss's minus. **What it costs:**
  Intl's `always` signs zero, and ours does not, which its comment and the guidelines say.
- **The tone from the app,** as the sign does not say the meaning: a debt that falls is good, and an expense is not a
  loss. Tremor, SAP, Chakra and Polaris leave it to the caller too. **`positive` and `negative`,** React Spectrum's and
  SAP's names, which fit a gain, an income and a fall alike. **What it costs:** a negative value with a positive tone
  reads oddly in the code, though it is the case that needs one.
- **Colours from the theme,** so a market where red means a rise swaps them in one place. **The theme's one red for a
  loss,** so a theme keeps one. **What it costs:** whoever changes the red of a button that deletes changes the losses
  too, unless they set `--negative` apart.
- **Colour never alone, by the guidelines,** as a piece cannot see whether its column or its words already say it.
  **What it costs:** a debt that falls, green with its minus, is the case an app gets wrong.
- **Hiding by replacing the text,** as a blur leaves the value on the page, in a copy and to a screen reader, and
  a `span` with no `value`, so nothing reads it from the page.
- **All three hidden,** as shares times a known price, or a return on a known sum, say what the money is, and
  whoever turns the mode on wants nothing read over their shoulder. **What it costs:** a percent that says little, as
  a budget's share, hides too.
- **No sign and no tone while hidden,** as green dots say the money rose, and a minus says it left. **What it
  costs:** a hidden screen gives nothing at a glance.
- **Dots for the hooks,** as an axis or a title is seen, and the app, which turns the mode on, knows to word a label
  only heard. **What it costs:** an app that forgets has a screen reader say "bullet", though it shows nothing.
- **Dots for no value too,** as hidden hides everything, by one rule.
- **A provider that keeps what it is not given,** as one that dropped the mode would show every value under it.
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
- **A `Delta` piece,** as Tremor's `BadgeDelta` or Chakra's `StatArrow`, with a ▲ or ▼. It never forgets the plus, but
  repeats the pieces, and an arrow can come by composition.
- **A tone read from the sign.** Less for an app to write, but a good fall shown in red, with no warning.
- **`gain` and `loss`, `good` and `bad`, or `success` and `critical`.** The first does not fit an expense, the second
  is informal, and the third would mix with a form's states.
- **A red of its own for a loss.** Apart from a button that deletes, but two reds to keep.
- **A boolean, as `showPlus`, or Intl's own `exceptZero`.** Plainer, or exact, but the first leaves no room for a third
  way, and the second reads badly.
- **The plus forced by any tone.** Colour would never be alone, but a column of expenses, all out, would need a sign
  on each.
- **A blur, or a mask over the text.** Simpler, but the value stays in the page, in a copy and to a screen reader.
- **Only amounts hidden, or a prop on a piece to stay shown.** Less hidden for nothing, but one rule per piece for
  the app to think through. The prop may come when a screen asks.
- **The tone kept while hidden,** as some apps keep the colour or an arrow, which tells the way a value went.
- **`hiddenLabel` from a hook, by `{ spoken: true }`.** Nothing for the app to think of, for an option seldom used.
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
- 2026-11-10: `sign` and `tone`, with `--positive` and `--negative`.
- 2026-11-10: Hidden values.
- 2026-11-10: `hideCurrency`.
- 2026-11-12: `MoneyProvider` became `MonetaProvider`, which holds the language, the router and the time zone too.
