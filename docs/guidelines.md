# Guidelines

How to use Moneta's look when building a screen. It comes with the package, so the copy in `node_modules` is the one for
the version installed. It holds only what exists, and each reviewed piece adds its section. Why each rule is so is in
[the theme's decisions](https://github.com/fgarend/moneta/blob/main/docs/decisions/theme.md).

## Colour

- **The page is `--background`, a card is `--card`, and a menu or dialog is `--popover`.** A card stands out by its edge,
  not by a strong fill.
- **Text is `--foreground`, and secondary text, such as a label, a date or a hint, is `--muted-foreground`.** Both reach
  4.5:1 on the page, a card and `--muted`.
- **`--primary` is for a screen's main action and for what is selected.** `--secondary` and `--accent` are quiet fills,
  for a secondary action and for hover.
- **`--border` is for a divider and the lines between rows, and `--input` for a control's edge,** which reaches 3:1
  against the page and a card, so a field's edge is seen.
- **`--destructive` is for an error and for an action that deletes.** A word says it too, never colour alone.
- **`--positive` and `--negative` are a value's good news and bad,** through `tone` on `Amount`, `Percent` and
  `Quantity`. `--negative` is `--destructive`'s red.
- **Gold is for little.** `Button`'s `variant="gold"`, at most once per screen, with `--gold-foreground` on it. Never a
  page's or a card's background, and never text, as it reaches only 1.66:1 on the page.
- **The sidebar is the one dark surface in light,** `--sidebar`, and what sits on it reads `--sidebar-foreground`,
  `--sidebar-accent`, `--sidebar-border` and `--sidebar-ring`. Moneta has no `Sidebar` yet, so an app's own reads them.
- **`--chart-1` to `--chart-5` are still shadcn's greys,** until charts are reviewed.

## Size

- **Controls are 36 px tall by default, 40 at `size="lg"` for a page's main action, and 32 at `size="sm"` for a dense
  place,** such as a table's row. That holds for `Button`, `Input`, `InputGroup`, `NativeSelect`, `Pagination`, `Select`,
  `Tabs`, `Toggle` and `ToggleGroup`, where each has the size. `xs` is shadcn's, outside this scale.
- **The controls in a row with a page's main action are 40 px as well,** so the row lines up.
- **The radius is `--radius`,** and every piece takes its corners from it.

## Text

- **The font is Geist, in `--font`,** with tabular figures in amounts, so digits line up in a column.
- **The scale,** in px of size and line height: 32/40 for a page's title, 24/32 for an amount of note, 18/24 for a
  section, 15/22 for a card's title, 14/20 for the body, 13/20 for a label and 12/16 for a caption.
- **One emphasis at each level:** 600 for titles and amounts of note, 500 for an amount in a row, 400 for the rest.
- **An app gets the scale through the pieces,** with no class of its own: `Section`'s and `Card`'s titles and
  descriptions, `Table`'s header and `Amount` already read it. A page's title has no piece yet.

## Space

- **In multiples of 4 px:** 4 between a label and what it names, as a value or a bar, and between `Card`'s title and
  description, 8 to 12 within a group, 16 to 20 in a card, 16 between cards, 40 between sections, and 40 to 48 around a
  page. Inside is smaller than between, so what belongs together reads together.
- **`Card` has 20 px around its content, and `Table` 12 px in a cell, with 20 at each end of a row in a card,** so a
  table in a card lines up with the card's title. Loose on a page, a table's text lines up with the page, and its rows
  reach 12 px out on each side.

## Focus

- **Keyboard focus is a solid outline,** 2 px with 2 px of offset, in `--ring`. The theme draws it on every control of
  the page, an app's own too, so it is never removed.
- **An area with a dark surface of its own sets `--ring` there,** as the sidebar does with `--sidebar-ring`, so the
  outline still shows on it.

## Dark

- **Put the class `dark` on the page's root, or on any part of the page,** before the first paint, or the page flashes
  light. Gold is the same in both modes.

## Section

- **A part of a page under one title, with no box of its own.** `Card` is for a group that needs a surface. A section
  often holds cards.
- **`SectionHeader` holds `SectionTitle`, and may hold a `SectionDescription` and a `SectionAction`,** such as tabs or a
  button, which moves under the title when the header is narrow. The content follows the header, 16 px below it.
- **A title's level comes from where it sits:** 2 at the top of a page, below the page's 1, and one more in each section
  it sits in. `level` sets it by hand, where the page's outline needs another.
- **It is no landmark,** so a page of sections keeps its landmarks few, and its titles give its structure.
- **The page puts 40 px between sections,** as a section has no space around itself.

## Link

- **A link goes somewhere, and a button does something.** `Link` is for a link in text or in a cell, `LinkButton` for
  a link drawn as a button, and `Button` for an action.
- **Underlined, as its colour is close to the text's.** `isQuiet` hides the underline until hover or keyboard focus, for
  a link alone where its place says it is one, as a name in a table's cell, and never in a sentence.
- **It takes the size and weight of its text,** in the theme's primary.
- **Its words say where it goes, read alone:** "the fee schedule", not "here". When it opens a new tab, it says so in
  the app's words, as an icon with hidden text, which Link does not add.
- **It goes through the app's router,** with `render` on each link or `RouterProvider` once at the root.
- **`isDisabled` dims it and takes it out of the tab order.** A text that says why is often better than a link that
  leads nowhere.

## Money

- **An amount is `Money`, `{ amount, currency }`:** a decimal string, as `"-1234.50"`, never a number, and its
  currency's code, as `"BRL"`. `Amount` shows every digit given, padded to the currency's decimals, and never rounds.
- **In a column of one currency, name it in the header,** as "Amount (R$)", and give each `Amount` `hideCurrency`.
  Never in a column that mixes currencies.
- **`Amount` for an amount on a screen,** `size="lg"` for one of note. `useFormatMoney` gives the same text where no
  piece can go, as a chart's axis, a page's title or an option of a `select`, so the two never differ.
- **`Percent` for a ratio, given as a fraction of one:** `"0.459"` is 45.9%, never `"45.9"`. It shows the decimals
  given, zeros too, and never rounds, so send one precision for a column, as `"0.1500"`. `useFormatPercent` gives its
  text where no piece can go.
- **`Quantity` for shares or units,** as a decimal string, with the decimals given, zeros too. Its unit is yours,
  around it or in the column's header. `useFormatQuantity` gives its text where no piece can go.
- **`MoneyProvider`, once at the root,** with `emptyLabel`, what screen readers hear for no value, in the app's words.
  One inside another keeps what it is not given.
  `value={null}` shows a dash, and its own `emptyLabel` wins over the provider's. Without either, it throws.
- **A change shows its plus with `sign="always"`,** as `+3,9%`, and zero takes no sign. The hooks take `{ sign }` too.
- **`tone="positive"` or `"negative"` says good news or bad,** and only the app knows which: a debt that falls is
  negative and good. The tone only adds colour, so the sign, the column or the words around must say the same, as
  "Debt: −R$ 500,00 this month". With no tone, a value takes the colour of the text around it.
- **Hidden values are `isHidden` on `MoneyProvider`,** with `hiddenLabel`, what screen readers hear, and your own
  control to turn it on. Every amount, percent and quantity shows `••••••`, with no sign and no colour, and the hooks
  give the dots too. A text only screen readers hear, as an `aria-label`, is yours to word while values are hidden,
  as "Pay the bill" in place of "Pay ••••••".
- **The language is React Aria's,** from `I18nProvider`.
- **A negative value takes the minus sign, `−`,** which screen readers read. A copy of one value takes a hyphen, so a
  spreadsheet reads it as negative, but a copy of a row keeps the minus, which a spreadsheet takes as text.
- **A value never wraps and is never cut.** What holds it makes room, as a table that scrolls.
- **A wrong value or currency throws,** as `"1,5"`, `"50%"` or `"real"`, so a mistake is never shown as money. An error
  boundary keeps it to its part of the screen.

## Pagination

- **Pages of rows, under a table or a list,** when they are too many to show at once and the user moves through them
  in order. A filter or a search often serves better than many pages.
- **Each page has an address,** as `?page=2`, so it can be shared and the browser's back returns to it.
- **Name it,** as "Pages of payments", and give Previous and Next your words as their children.
- **Say which rows are shown** with `PaginationSummary`, as "15–28 of 142".
- **Draw the first page, the last, the current one and one on each side,** with a `PaginationEllipsis` where pages
  are skipped, and mark the current one with `isActive`.
- **On the first page, Previous is `isDisabled`,** and Next on the last, so neither moves.
- **With one page, draw no pagination.**

## Table

- **A table is for comparing down its columns,** under headers. A list of things read across, each with its value at
  the end, is a list of rows, and the attributes of one thing are a description list.
- **It has a name,** which TypeScript asks for: `aria-labelledby` pointing to the title already on the screen, as a
  card's, `aria-label` when there is none, or `caption`, a visible caption.
- **Each row has a title,** `TableHead scope="row"`, which names the row for screen readers and stays at the table's
  start while it scrolls.
- **Numbers and their header go at the end,** with `align="end"` on the header and on each cell of the column, never
  centred. Values in the rows are at the text's weight, so a total stands out.
- **Groups and totals:** each group in a `TableBody` of its own, opened by a `TableGroupRow` with its title and its
  subtotals in their columns, and the total in a `TableFooter`. Subtotals and the total follow their rows' `sign`, and
  take no `tone`. A total that counts more rows than are shown says so in its title, as "Total of every account".
- **An action per row goes in the last column,** a `TableRowAction` with one word as its `aria-label`, as "Edit",
  under a `TableHead hideHeader` that names the column; the row's title completes its name. Several actions go in a
  `DropdownMenu` whose trigger is a `TableRowAction`.
- **A row that opens something puts a `Link` in its title,** quiet, and the whole row follows it on a click, with
  Ctrl or Cmd for a new tab, while a control in the row or selected text stays where it is.
- **Rows that open give their children `parentId`,** the parent's `id`, right after it; the table adds the button.
  A detail that explains a row is a child row too. One level only.
- **Rows to act on together get a `TableSelect` each,** in a cell before the title, a `TableSelectAll` in the
  header with the app's words, as "Select all", and a `TableSelectionBar` over the table, with the count of every
  row selected, on this page and others, as "2 selected". Clearing the selection, or selecting all on every page,
  is a button of the app's in the bar. Confirm an action on rows selected but not shown.
- **A column the user may sort takes `allowsSorting` and an `id`,** and the table `sortDescriptor` and
  `onSortChange`; the app sorts the rows, here or on its server. Sort what is compared, as amounts and dates, and keep
  a first order that makes sense, as the newest first.
- **The row whose details are open beside the table, as in a side panel, takes `aria-current="true"`,** not a
  selection, which is for acting on rows together.
- **A cell is blank when a value does not apply,** and "—" when it is missing, with `value={null}`.
- **In a card, alone in its `CardContent`,** it runs edge to edge, with a line above. With anything else in the same
  content, it keeps the card's padding, so give it a content of its own.
- **On a phone or in a narrow panel, keep the title and the value,** and hide the rest with `hideBelow` on each cell of
  a column: `sm`, `md` or `lg`, measured on the table's own width, about 384, 448 and 512 px. A column you do not want,
  do not draw. Otherwise text wraps, a row's title never below a minimum width, and the table scrolls in an area of
  its own, with a shadow at the end that has more, which then takes keyboard focus and the table's name.

## Changing the look

- **Redefine the variables after Moneta's import, outside any `@layer`, and again under `.dark`.** Before the import, or
  in a layer, nothing changes, and with `:root` alone the light value also holds in dark.
- **Keep the contrast:** 4.5:1 for text on every surface it sits on, and 3:1 for `--input` and `--ring` against the page
  and a card.
- **`--font` changes the font,** and the app loads its own.
