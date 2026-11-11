import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode, useId } from "react";
import { I18nProvider } from "react-aria-components";
import { expect, waitFor, within } from "storybook/test";
import { Amount } from "./amount.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import type { Money } from "./money.js";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const name = "Fictitious payments";
const title = "Recent payments";
const caption = "Fictitious payments of October";
const description = "Description";
const category = "Category";
const account = "Account";
const amount = "Amount";
const note = "Values of October.";

function brl(value: string): Money {
  return { amount: value, currency: "BRL" };
}

const payments = [
  {
    id: "p1",
    name: "Central Market",
    category: "Food",
    account: "Account 1234",
    value: "-286.4",
  },
  {
    id: "p2",
    name: "Corner Bakery",
    category: "Food",
    account: "Card 4821",
    value: "-48.9",
  },
  {
    id: "p3",
    name: "Fictitious salary",
    category: "Income",
    account: "Account 1234",
    value: "7250",
  },
];

// What the guidelines give a table: a quiet header, rows with room, a line under each but the last, values at the
// text's weight, and 20 px at each end in a card.
const headSize = "13px";
const cellSpacing = "12px";
const cardEnd = "20px";
const looseEnd = "12px";
const rowWeight = "400";
const line = "1px";
const textMinimum = 128;
const none = "rgba(0, 0, 0, 0)";

// The colour a value of the theme resolves to where the table sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// Where a cell's text starts, inside its padding.
function textStart(cell: Element): number {
  return (
    cell.getBoundingClientRect().left +
    Number.parseFloat(getComputedStyle(cell).paddingInlineStart)
  );
}

function rows(narrow = false): ReactNode {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>{description}</TableHead>
          <TableHead hideBelow={narrow ? "md" : undefined}>
            {category}
          </TableHead>
          <TableHead hideBelow={narrow ? "md" : undefined}>{account}</TableHead>
          <TableHead align="end">{amount}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableHead scope="row">{payment.name}</TableHead>
            <TableCell hideBelow={narrow ? "md" : undefined}>
              {payment.category}
            </TableCell>
            <TableCell hideBelow={narrow ? "md" : undefined}>
              {payment.account}
            </TableCell>
            <TableCell align="end">
              <Amount value={brl(payment.value)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

// Storybook cannot type a table whose name is one of three props, so each story draws its own.
const meta = {
  title: "Components/Display & Media/Table",
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <Story />
      </I18nProvider>
    ),
  ],
} satisfies Meta;

type Story = StoryObj<typeof meta>;

// Loose on a page: a native table, named, its rows titled, values at the end, and its text lined up with the page.
const Default: Story = {
  tags: ["visual"],
  render: () => (
    <section className="p-6">
      <h2 className="type-title">{title}</h2>
      <Table aria-label={name}>{rows()}</Table>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table", { name });
    const head = canvas.getByRole("columnheader", { name: amount });
    const firstTitle = canvas.getByRole("rowheader", {
      name: payments[0]?.name,
    });
    const lastRow = canvas.getAllByRole("row").at(-1) as HTMLElement;
    const heading = canvas.getByRole("heading", { name: title });

    await expect(table.tagName).toBe("TABLE");
    await expect(canvas.queryByRole("grid")).toBeNull();
    await expect(canvas.getAllByRole("rowheader")).toHaveLength(
      payments.length,
    );
    await expect(firstTitle).toHaveAttribute("scope", "row");
    // Numbers and their header at the end, as every library has it.
    await expect(getComputedStyle(head).textAlign).toBe("end");
    await expect(
      getComputedStyle(
        head.closest("table")?.querySelector("tbody td:last-child") as Element,
      ).textAlign,
    ).toBe("end");
    // A quiet header with no fill, rows with room, and a line under each row but the last.
    const { fontSize, color, backgroundColor } = getComputedStyle(head);
    await expect([fontSize, color, backgroundColor]).toEqual([
      headSize,
      colourOf("var(--muted-foreground)", canvasElement),
      none,
    ]);
    await expect(getComputedStyle(firstTitle).paddingTop).toBe(cellSpacing);
    await expect(
      getComputedStyle(firstTitle.closest("tr") as Element).borderBottomWidth,
    ).toBe(line);
    await expect(getComputedStyle(lastRow).borderBottomWidth).toBe("0px");
    // Values at the text's weight inside a table, so a total stands out.
    await expect(
      getComputedStyle(
        canvasElement.querySelector('tbody [data-slot="amount"]') as Element,
      ).fontWeight,
    ).toBe(rowWeight);
    // Loose, its text lines up with the page, and its rows reach 12 px out on each side.
    await expect(Math.round(textStart(firstTitle))).toBe(
      Math.round(heading.getBoundingClientRect().left),
    );
    await expect(getComputedStyle(firstTitle).paddingInlineStart).toBe(
      looseEnd,
    );
    // It fits, so its area takes no focus of its own.
    await expect(
      canvasElement.querySelector('[data-slot="table-container"]'),
    ).not.toHaveAttribute("tabindex");
  },
};

// In a card, alone in its content: edge to edge, with a line above, its text lined up with the card's title.
const InCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table aria-label={name}>{rows()}</Table>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvasElement.querySelector(
      '[data-slot="card-content"]',
    ) as Element;
    const firstTitle = canvas.getByRole("rowheader", {
      name: payments[0]?.name,
    });
    const cardTitle = canvasElement.querySelector(
      '[data-slot="card-title"]',
    ) as Element;
    const { paddingLeft, paddingRight, borderTopWidth } =
      getComputedStyle(content);

    await expect([paddingLeft, paddingRight, borderTopWidth]).toEqual([
      "0px",
      "0px",
      line,
    ]);
    await expect(getComputedStyle(firstTitle).paddingInlineStart).toBe(cardEnd);
    await expect(Math.round(textStart(firstTitle))).toBe(
      Math.round(cardTitle.getBoundingClientRect().left),
    );
  },
};

// With something else in the same content, the content keeps its padding: a table runs edge to edge only alone.
const InCardWithMore: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>{note}</p>
        <Table aria-label={name}>{rows()}</Table>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector(
      '[data-slot="card-content"]',
    ) as Element;

    await expect(getComputedStyle(content).paddingLeft).toBe(cardEnd);
  },
};

// Named by its caption, a native one, first in the table.
const WithCaption: Story = {
  render: () => <Table caption={caption}>{rows()}</Table>,
  play: async ({ canvasElement }) => {
    const table = within(canvasElement).getByRole("table", { name: caption });

    await expect(table.firstElementChild?.tagName).toBe("CAPTION");
  },
};

// Named by a heading already on the page.
const NamedByHeading: Story = {
  render: function Render() {
    const titleId = useId();
    return (
      <section>
        <h2 id={titleId}>{title}</h2>
        <Table aria-labelledby={titleId}>{rows()}</Table>
      </section>
    );
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("table", { name: title }),
    ).toBeVisible();
  },
};

// Narrow, as a phone or a side panel: the columns the app marks hide by the table's own width, and the rest fit.
const Narrow: Story = {
  render: () => <Table aria-label={name}>{rows(true)}</Table>,
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const hidden = canvas.getAllByText(payments[0]?.category ?? "");
    const area = canvasElement.querySelector(
      '[data-slot="table-container"]',
    ) as Element;

    await expect(hidden.every((cell) => !cell.checkVisibility())).toBe(true);
    await expect(
      canvas.queryByRole("columnheader", { name: category }),
    ).toBeNull();
    await expect(area.scrollWidth).toBe(area.clientWidth);
  },
};

// Narrow with every column: text wraps but keeps a minimum width, the table scrolls in its own area, which then
// takes focus and its name, its rows' titles stay at its start, and its background shows there is more.
const Overflowing: Story = {
  render: () => <Table aria-label={name}>{rows()}</Table>,
  decorators: Narrow.decorators,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const area = canvasElement.querySelector(
      '[data-slot="table-container"]',
    ) as HTMLElement;
    const firstTitle = canvas.getByRole("rowheader", {
      name: payments[0]?.name,
    });

    await expect(area.scrollWidth).toBeGreaterThan(area.clientWidth);
    // The area is measured once laid out, a frame later.
    await waitFor(() => expect(area).toHaveAttribute("tabindex", "0"));
    await expect(canvas.getByRole("region", { name })).toBe(area);
    await expect(
      firstTitle.getBoundingClientRect().width,
    ).toBeGreaterThanOrEqual(textMinimum);
    await expect(getComputedStyle(firstTitle).position).toBe("sticky");
    area.scrollLeft = area.scrollWidth;
    await expect(Math.round(firstTitle.getBoundingClientRect().left)).toBe(
      Math.round(area.getBoundingClientRect().left),
    );
    await expect(getComputedStyle(area).backgroundAttachment).toContain(
      "local",
    );
  },
};

// A statement by day: one body per group, opened by its title and subtotal, and a total in the footer.
const days = [
  {
    id: "today",
    title: "Today, October 24",
    subtotal: "-335.3",
    rows: [
      { id: "d1", name: "Central Market", value: "-286.4" },
      { id: "d2", name: "Corner Bakery", value: "-48.9" },
    ],
  },
  {
    id: "yesterday",
    title: "Yesterday, October 23",
    subtotal: "6250",
    rows: [
      { id: "d3", name: "Fictitious salary", value: "7250" },
      { id: "d4", name: "Between accounts", value: "-1000" },
    ],
  },
];
const total = "5914.7";
const totalTitle = "Total";

// Fictitious sums are still sums: a decimal string in cents, exact.
function cents(value: string): bigint {
  const [whole = "0", decimals = ""] = value.split(".");
  const sign = whole.startsWith("-") ? -1n : 1n;
  return (
    BigInt(whole) * 100n + sign * BigInt(decimals.padEnd(2, "0").slice(0, 2))
  );
}

function sum(values: string[]): bigint {
  return values.reduce((all, value) => all + cents(value), 0n);
}

const groupGap = "32px";
const firstGap = "12px";
const groupSize = "12px";
const strong = ["600", "600"];

const Groups: Story = {
  tags: ["visual"],
  render: () => (
    <div className="p-6">
      <Table aria-label={name}>
        <TableHeader>
          <TableRow>
            <TableHead>{description}</TableHead>
            <TableHead align="end">{amount}</TableHead>
          </TableRow>
        </TableHeader>
        {days.map((day) => (
          <TableBody key={day.id}>
            <TableGroupRow>
              <TableHead scope="row">{day.title}</TableHead>
              <TableCell align="end">
                <Amount value={brl(day.subtotal)} />
              </TableCell>
            </TableGroupRow>
            {day.rows.map((row) => (
              <TableRow key={row.id}>
                <TableHead scope="row">{row.name}</TableHead>
                <TableCell align="end">
                  <Amount value={brl(row.value)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ))}
        <TableFooter>
          <TableRow>
            <TableHead scope="row">{totalTitle}</TableHead>
            <TableCell align="end">
              <Amount value={brl(total)} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const table = canvas.getByRole("table", { name });
    const [first, second] = days.map((day) =>
      canvas.getByRole("rowheader", { name: day.title }),
    ) as [HTMLElement, HTMLElement];
    const groupRow = first.closest("tr") as Element;
    const amountOf = (row: Element) =>
      row.querySelector('[data-slot="amount"]') as Element;
    const itemRow = canvas
      .getByRole("rowheader", { name: days[0]?.rows[0]?.name })
      .closest("tr") as Element;
    const totalRow = canvas
      .getByRole("rowheader", { name: totalTitle })
      .closest("tr") as Element;

    // The fixture adds up.
    for (const day of days) {
      await expect(sum(day.rows.map((row) => row.value))).toBe(
        cents(day.subtotal),
      );
    }
    await expect(sum(days.map((day) => day.subtotal))).toBe(cents(total));
    // One body per group, its title a row header that names its subtotal.
    await expect(table.querySelectorAll("tbody")).toHaveLength(days.length);
    await expect(first).toHaveAttribute("scope", "row");
    await expect(totalRow.parentElement?.tagName).toBe("TFOOT");
    // A group's title: small, semibold and muted, with 32 px above it, 12 above the first, and a strong line under.
    const { fontSize, fontWeight, color } = getComputedStyle(first);
    await expect([fontSize, fontWeight, color]).toEqual([
      groupSize,
      "600",
      colourOf("var(--muted-foreground)", canvasElement),
    ]);
    await expect(getComputedStyle(first).paddingTop).toBe(firstGap);
    await expect(getComputedStyle(second).paddingTop).toBe(groupGap);
    await expect(getComputedStyle(groupRow).borderBottomColor).toBe(
      colourOf("var(--border-strong)", canvasElement),
    );
    // Weights: rows at 400, a subtotal at 500 and the row's size, the total at 600.
    await expect(getComputedStyle(amountOf(itemRow)).fontWeight).toBe("400");
    await expect(getComputedStyle(amountOf(groupRow)).fontWeight).toBe("500");
    await expect(getComputedStyle(amountOf(groupRow)).fontSize).toBe(
      getComputedStyle(amountOf(itemRow)).fontSize,
    );
    await expect([
      getComputedStyle(totalRow.querySelector("th") as Element).fontWeight,
      getComputedStyle(amountOf(totalRow)).fontWeight,
    ]).toEqual(strong);
    // The total: a double strong line above it.
    const { borderTopStyle, borderTopWidth, borderTopColor } =
      getComputedStyle(totalRow);
    await expect([borderTopStyle, borderTopWidth, borderTopColor]).toEqual([
      "double",
      "3px",
      colourOf("var(--border-strong)", canvasElement),
    ]);
  },
};

export default meta;
export {
  Default,
  Groups,
  InCard,
  InCardWithMore,
  NamedByHeading,
  Narrow,
  Overflowing,
  WithCaption,
};
