import type { Meta, StoryObj } from "@storybook/react-vite";
import { PencilIcon } from "lucide-react";
import { Fragment, type ReactNode, useId, useState } from "react";
import {
  I18nProvider,
  RouterProvider,
  type SortDescriptor,
} from "react-aria-components";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { Amount } from "./amount.js";
import { Button } from "./button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import { Link } from "./link.js";
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
  TableRowAction,
  TableSelect,
  TableSelectAll,
  TableSelectionBar,
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

// An action per row: the last column, under a header screen readers hear and eyes do not, as narrow as its button,
// whose name joins the app's one word to the row's title.
const actions = "Actions";
const edit = "Edit";
const target = 32;
const narrowest = 80;

const RowActions: Story = {
  render: () => (
    <Table aria-label={name}>
      <TableHeader>
        <TableRow>
          <TableHead>{description}</TableHead>
          <TableHead align="end">{amount}</TableHead>
          <TableHead hideHeader={true}>{actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableHead scope="row">{payment.name}</TableHead>
            <TableCell align="end">
              <Amount value={brl(payment.value)} />
            </TableCell>
            <TableCell>
              <TableRowAction aria-label={edit}>
                <PencilIcon />
              </TableRowAction>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvas.getByRole("columnheader", { name: actions });
    const button = canvas.getByRole("button", {
      name: `${edit} ${payments[0]?.name}`,
    });
    const { width, height } = button.getBoundingClientRect();

    await expect(header.getBoundingClientRect().height).toBeGreaterThan(0);
    await expect(header.firstElementChild).toHaveClass("sr-only");
    await expect(canvas.getAllByRole("button")).toHaveLength(payments.length);
    await expect([width, height]).toEqual([target, target]);
    await expect(
      (button.closest("td") as Element).getBoundingClientRect().width,
    ).toBeLessThan(narrowest);
  },
};

// Child rows: a row with children gets a button in its title, named by it, which shows them right under it; rows with
// none keep its room, so titles line up, and children are set in by as much again.
const holdings = [
  { id: "fund", name: "Fictitious Income Fund", value: "30000" },
  { id: "stock", name: "Example Stock", value: "18200" },
];
const accounts = [
  { id: "a1", name: "Account 1234", value: "24000" },
  { id: "a2", name: "Account 5678", value: "6000" },
];
const slot = 40;
const onExpandedChange = fn();

function holdingRows(): ReactNode {
  return (
    <TableBody>
      {holdings.map((holding) => (
        <Fragment key={holding.id}>
          <TableRow id={holding.id}>
            <TableHead scope="row">{holding.name}</TableHead>
            <TableCell align="end">
              <Amount value={brl(holding.value)} />
            </TableCell>
          </TableRow>
          {holding.id === "fund"
            ? accounts.map((child) => (
                <TableRow key={child.id} parentId={holding.id}>
                  <TableHead scope="row">{child.name}</TableHead>
                  <TableCell align="end">
                    <Amount value={brl(child.value)} />
                  </TableCell>
                </TableRow>
              ))
            : null}
        </Fragment>
      ))}
    </TableBody>
  );
}

// Where a cell's own text starts: its first piece of text, past any button or room before it.
function textLeft(cell: Element): number {
  const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  range.selectNodeContents(walker.nextNode() as Node);
  return range.getBoundingClientRect().left;
}

const ChildRows: Story = {
  render: () => <Table aria-label={name}>{holdingRows()}</Table>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: holdings[0]?.name });
    const child = canvas.getByText(accounts[0]?.name ?? "");
    const parentTitle = canvas.getByRole("rowheader", {
      name: holdings[0]?.name,
    });
    const plainTitle = canvas.getByRole("rowheader", {
      name: holdings[1]?.name,
    });

    // Closed: children are hidden, and the button says so and points at them.
    await expect(child).not.toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    const controlled = (button.getAttribute("aria-controls") ?? "").split(" ");
    await expect(controlled).toHaveLength(accounts.length);
    await expect(
      controlled.every((id) => document.getElementById(id)?.tagName === "TR"),
    ).toBe(true);
    await expect(canvas.getAllByRole("button")).toHaveLength(1);
    await expect(button.getBoundingClientRect().width).toBe(target);
    // Titles line up, a row with no children keeping the button's room.
    await expect(Math.round(textLeft(plainTitle))).toBe(
      Math.round(textLeft(parentTitle)),
    );
    await userEvent.click(button);
    await expect(child).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    // Children are set in by the button's room.
    await expect(
      Math.round(
        textLeft(child.closest("th") as Element) - textLeft(parentTitle),
      ),
    ).toBe(slot);
    await userEvent.click(button);
    await expect(child).not.toBeVisible();
  },
};

// A row outside a Table says so, rather than draw a row no table knows.
const RowOutsideTable: Story = {
  render: () => (
    <Caught>
      <table>
        <tbody>
          <TableRow>
            <TableCell>{payments[0]?.name}</TableCell>
          </TableRow>
        </tbody>
      </table>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("TableRow must be used within a Table."),
    ).toBeVisible();
  },
};

// Open from the start, by the app, which hears each change.
const ChildRowsOpen: Story = {
  render: () => (
    <Table
      aria-label={name}
      expandedKeys={["fund"]}
      onExpandedChange={onExpandedChange}
    >
      {holdingRows()}
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(accounts[0]?.name ?? "")).toBeVisible();
    onExpandedChange.mockClear();
    await userEvent.click(
      canvas.getByRole("button", { name: holdings[0]?.name }),
    );
    await expect(onExpandedChange).toHaveBeenCalledWith(new Set());
    // The app holds the state, so the rows stay open until it changes it.
    await expect(canvas.getByText(accounts[0]?.name ?? "")).toBeVisible();
  },
};

// Open from the start, with the table holding the state.
const ChildRowsDefaultOpen: Story = {
  render: () => (
    <Table aria-label={name} defaultExpandedKeys={["fund"]}>
      {holdingRows()}
    </Table>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(accounts[0]?.name ?? ""),
    ).toBeVisible();
  },
};

// A row that opens: a click on an empty part of it goes to the link in its title, so keyboards and screen readers
// keep one real link while a pointer has the whole row. A click on a control, or with text selected, stays where it
// is, and a click with Ctrl or Cmd reaches the link with its key, for the browser to open a new tab.
const navigate = fn();
const RowLink: Story = {
  render: () => (
    <RouterProvider navigate={navigate}>
      <Table aria-label={name}>
        <TableHeader>
          <TableRow>
            <TableHead>{description}</TableHead>
            <TableHead>{category}</TableHead>
            <TableHead hideHeader={true}>{actions}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableHead scope="row">
                <Link href={`/payments/${payment.id}`} isQuiet={true}>
                  {payment.name}
                </Link>
              </TableHead>
              <TableCell>{payment.category}</TableCell>
              <TableCell>
                <TableRowAction aria-label={edit}>
                  <PencilIcon />
                </TableRowAction>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </RouterProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = payments[0];
    const cell = canvas.getAllByText(first?.category ?? "")[0] as HTMLElement;
    const row = cell.closest("tr") as HTMLElement;
    const link = canvas.getByRole("link", { name: first?.name });
    const keys: boolean[] = [];
    // The test's own clicks are not the user's, so the browser would follow a link with Ctrl in this very page.
    link.addEventListener("click", (event) => {
      keys.push(event.ctrlKey);
      if (event.ctrlKey) {
        event.preventDefault();
      }
    });

    // One link per row for keyboards and screen readers, and a pointer over the whole row.
    await expect(canvas.getAllByRole("link")).toHaveLength(payments.length);
    await expect(getComputedStyle(row).cursor).toBe("pointer");
    navigate.mockClear();
    await userEvent.click(cell);
    await expect(navigate).toHaveBeenCalledWith(
      `/payments/${first?.id}`,
      undefined,
    );
    // A control in the row stays where it is.
    navigate.mockClear();
    await userEvent.click(
      canvas.getByRole("button", { name: `${edit} ${first?.name}` }),
    );
    await expect(navigate).not.toHaveBeenCalled();
    // With text selected in the row, a click is part of selecting.
    const selection = document.getSelection() as Selection;
    selection.selectAllChildren(cell);
    cell.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await expect(navigate).not.toHaveBeenCalled();
    selection.removeAllRanges();
    // With Ctrl, the link gets the key, and the router does not navigate here.
    keys.length = 0;
    cell.dispatchEvent(
      new MouseEvent("click", { bubbles: true, ctrlKey: true }),
    );
    await expect(keys).toEqual([true]);
    await expect(navigate).not.toHaveBeenCalled();
  },
};

// An action in a row with no title says so, as its name could not say which row it acts on.
const ActionWithoutTitle: Story = {
  render: () => (
    <Caught>
      <Table aria-label={name}>
        <TableBody>
          <TableRow>
            <TableCell>{payments[0]?.name}</TableCell>
            <TableCell>
              <TableRowAction aria-label={edit}>
                <PencilIcon />
              </TableRowAction>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        `TableRowAction: "${edit}" needs its row titled by TableHead scope="row".`,
      ),
    ).toBeVisible();
  },
};

// Selection: a box in a column of its own before each row's title, named by it, and one in the header over the rows
// shown, named by the app once. Shift selects a range, and keys the table does not show, as from another page, stay.
const selectAll = "Select all";
const elsewhere = "p9";
const remove = "Delete";
const onSelectionChange = fn();

function selectableRows(): ReactNode {
  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead>
            <TableSelectAll aria-label={selectAll} />
          </TableHead>
          <TableHead>{description}</TableHead>
          <TableHead>{category}</TableHead>
          <TableHead>{account}</TableHead>
          <TableHead align="end">{amount}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow id={payment.id} key={payment.id}>
            <TableCell>
              <TableSelect />
            </TableCell>
            <TableHead scope="row">{payment.name}</TableHead>
            <TableCell>{payment.category}</TableCell>
            <TableCell>{payment.account}</TableCell>
            <TableCell align="end">
              <Amount value={brl(payment.value)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
}

function boxes(canvasElement: HTMLElement): HTMLElement[] {
  const canvas = within(canvasElement);
  return [selectAll, ...payments.map((payment) => payment.name)].map((label) =>
    canvas.getByRole("checkbox", { name: label }),
  );
}

const Selection: Story = {
  render: () => (
    <Table
      aria-label={name}
      defaultSelectedKeys={[elsewhere]}
      onSelectionChange={onSelectionChange}
    >
      {selectableRows()}
    </Table>
  ),
  play: async ({ canvasElement }) => {
    const [all, first, second, third] = boxes(canvasElement) as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    const row = first.closest("tr") as HTMLElement;
    const firstTitle = within(canvasElement).getByRole("rowheader", {
      name: payments[0]?.name,
    });
    const muted = colourOf("var(--muted)", canvasElement);
    onSelectionChange.mockClear();

    // A key from elsewhere checks no box here.
    await expect(all).not.toBeChecked();
    await expect(all).not.toBePartiallyChecked();
    await userEvent.click(first);
    await expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set([elsewhere, "p1"]),
    );
    await expect(first).toBeChecked();
    await expect(all).toBePartiallyChecked();
    // A selected row is drawn at --muted, over its sticky title's background too.
    await expect(getComputedStyle(row).backgroundColor).toBe(muted);
    await expect(getComputedStyle(firstTitle).backgroundImage).toContain(muted);
    // The header's box takes all the rows shown, then none, and keeps the key from elsewhere.
    await userEvent.click(all);
    await expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set([elsewhere, "p1", "p2", "p3"]),
    );
    await expect(all).toBeChecked();
    await userEvent.click(all);
    await expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set([elsewhere]),
    );
    await expect(third).not.toBeChecked();
    // Shift takes the range from the last box clicked, and clears one alike. One user holds the key between steps.
    const user = userEvent.setup();
    await user.click(first);
    await user.keyboard("{Shift>}");
    await user.click(third);
    await user.keyboard("{/Shift}");
    await expect(second).toBeChecked();
    await expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set([elsewhere, "p1", "p2", "p3"]),
    );
    await user.keyboard("{Shift>}");
    await user.click(second);
    await user.keyboard("{/Shift}");
    await expect(onSelectionChange).toHaveBeenLastCalledWith(
      new Set([elsewhere, "p1"]),
    );
    await expect(third).not.toBeChecked();
  },
};

// Narrow, the boxes stay at the table's start while it scrolls, and the titles right after them.
const SelectionOverflowing: Story = {
  render: () => <Table aria-label={name}>{selectableRows()}</Table>,
  decorators: Narrow.decorators,
  play: async ({ canvasElement }) => {
    const area = canvasElement.querySelector(
      '[data-slot="table-container"]',
    ) as HTMLElement;
    const [all, first] = boxes(canvasElement) as [HTMLElement, HTMLElement];
    const firstTitle = within(canvasElement).getByRole("rowheader", {
      name: payments[0]?.name,
    });
    const head = within(canvasElement).getByRole("columnheader", {
      name: description,
    });
    const start = (element: Element) =>
      Math.round(element.getBoundingClientRect().left);
    const end = (element: Element) =>
      Math.round(element.getBoundingClientRect().right);

    await expect(area.scrollWidth).toBeGreaterThan(area.clientWidth);
    area.scrollLeft = area.scrollWidth;
    for (const box of [all, first]) {
      await expect(start(box.closest("td, th") as Element)).toBe(start(area));
    }
    await expect(start(firstTitle)).toBe(end(first.closest("td") as Element));
    await expect(start(head)).toBe(end(all.closest("th") as Element));
  },
};

// The bar over a table with rows selected: the app's count, heard as it changes, and its actions, in a fill lined up
// with the table's ends. Nothing selected, it shows nothing, but its status stays to be heard.
const SelectionBar: Story = {
  render: function Render() {
    const [keys, setKeys] = useState(new Set<string>());
    return (
      <>
        <TableSelectionBar count={keys.size} label={`${keys.size} selected`}>
          <Button size="sm" variant="outline">
            {remove}
          </Button>
        </TableSelectionBar>
        <Table
          aria-label={name}
          onSelectionChange={setKeys}
          selectedKeys={keys}
        >
          {selectableRows()}
        </Table>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = canvas.getByRole("status");
    const bar = canvasElement.querySelector(
      '[data-slot="table-selection-bar"]',
    ) as HTMLElement;
    const area = canvasElement.querySelector(
      '[data-slot="table-container"]',
    ) as HTMLElement;
    const [all, , second] = boxes(canvasElement) as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];

    await expect(status).toHaveTextContent("");
    await expect(canvas.queryByRole("button", { name: remove })).toBeNull();
    await userEvent.click(second);
    await expect(status).toHaveTextContent("1 selected");
    await expect(canvas.getByRole("button", { name: remove })).toBeVisible();
    // A fill across the table's area, its text lined up with the table's.
    await expect(getComputedStyle(bar).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(Math.round(bar.getBoundingClientRect().left)).toBe(
      Math.round(area.getBoundingClientRect().left),
    );
    await expect(Math.round(status.getBoundingClientRect().left)).toBe(
      Math.round(textStart(all.closest("th") as Element)),
    );
  },
};

// The same in a card: the bar and the table run edge to edge together, with the card's 20 px ends.
const SelectionBarInCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <TableSelectionBar count={2} label="2 selected">
          <Button size="sm" variant="outline">
            {remove}
          </Button>
        </TableSelectionBar>
        <Table aria-label={name} selectedKeys={["p1", "p2"]}>
          {selectableRows()}
        </Table>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector(
      '[data-slot="card-content"]',
    ) as Element;
    const status = within(canvasElement).getByRole("status");
    const cardTitle = canvasElement.querySelector(
      '[data-slot="card-title"]',
    ) as Element;

    await expect(getComputedStyle(content).paddingLeft).toBe("0px");
    await expect(Math.round(status.getBoundingClientRect().left)).toBe(
      Math.round(cardTitle.getBoundingClientRect().left),
    );
  },
};

// Rows selected, as a screenshot: the bar, the rows' fill, and the header's box partly checked.
const SelectionShown: Story = {
  tags: ["visual"],
  render: () => (
    <section className="flex flex-col gap-2 p-6">
      <h2 className="type-title">{title}</h2>
      <TableSelectionBar count={2} label="2 selected">
        <Button size="sm" variant="outline">
          {remove}
        </Button>
      </TableSelectionBar>
      <Table aria-label={name} selectedKeys={["p1", "p2"]}>
        {selectableRows()}
      </Table>
    </section>
  ),
  play: async ({ canvasElement }) => {
    await expect(boxes(canvasElement)[0]).toBePartiallyChecked();
  },
};

// A box in a row with no title, or with no key, says so: it would have no name, or nothing to select.
const SelectWithoutTitle: Story = {
  render: () => (
    <Caught>
      <Table aria-label={name}>
        <TableBody>
          <TableRow id={payments[0]?.id}>
            <TableCell>
              <TableSelect />
            </TableCell>
            <TableCell>{payments[0]?.name}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'TableSelect needs its row titled by TableHead scope="row".',
      ),
    ).toBeVisible();
  },
};

const SelectWithoutKey: Story = {
  render: () => (
    <Caught>
      <Table aria-label={name}>
        <TableBody>
          <TableRow>
            <TableCell>
              <TableSelect />
            </TableCell>
            <TableHead scope="row">{payments[0]?.name}</TableHead>
          </TableRow>
        </TableBody>
      </Table>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText("TableSelect needs its row's id."),
    ).toBeVisible();
  },
};

// The row open beside the table, as in a side panel: aria-current, not selected, at --muted with a bar of --primary
// at its start, which moves none of its text.
const bar = "3px";

const CurrentRow: Story = {
  tags: ["visual"],
  render: () => (
    <section className="p-6">
      <h2 className="type-title">{title}</h2>
      <Table aria-label={name}>
        <TableHeader>
          <TableRow>
            <TableHead>{description}</TableHead>
            <TableHead>{category}</TableHead>
            <TableHead align="end">{amount}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow
              aria-current={payment.id === "p2" ? "true" : undefined}
              key={payment.id}
            >
              <TableHead scope="row">
                <Link href={`#${payment.id}`} isQuiet={true}>
                  {payment.name}
                </Link>
              </TableHead>
              <TableCell>{payment.category}</TableCell>
              <TableCell align="end">
                <Amount value={brl(payment.value)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [firstTitle, currentTitle] = payments.map((payment) =>
      canvas.getByRole("rowheader", { name: payment.name }),
    ) as [HTMLElement, HTMLElement];
    const row = currentTitle.closest("tr") as HTMLElement;
    const muted = colourOf("var(--muted)", canvasElement);
    const marker = getComputedStyle(currentTitle, "::before");

    await expect(row).toHaveAttribute("aria-current", "true");
    await expect(row).not.toHaveAttribute("data-selected");
    await expect(getComputedStyle(row).backgroundColor).toBe(muted);
    // The bar: 3 px of --primary at the row's start.
    await expect([marker.width, marker.backgroundColor]).toEqual([
      bar,
      colourOf("var(--primary)", canvasElement),
    ]);
    await expect(Math.round(currentTitle.getBoundingClientRect().left)).toBe(
      Math.round(row.getBoundingClientRect().left),
    );
    await expect(marker.insetInlineStart).toBe("0px");
    await expect(getComputedStyle(currentTitle).backgroundImage).toContain(
      muted,
    );
    // The bar moves no text: the current row's title starts where the others' do.
    await expect(Math.round(textLeft(currentTitle))).toBe(
      Math.round(textLeft(firstTitle)),
    );
    // A pointer over it keeps its state.
    await userEvent.hover(within(row).getByText(payments[1]?.category ?? ""));
    await expect(getComputedStyle(row).backgroundColor).toBe(muted);
  },
};

// Sorting: each sortable header a button with a quiet up and down mark, the sorted one its arrow in the text's colour,
// before the text in a column at the end. A press sorts ascending, then flips; the app sorts, and aria-sort says so.
const onSortChange = fn();
const target24 = 24;
// The columns' keys, which the app names.
const byName = "name";
const byAmount = "amount";

// The app's sort, by a fixture's values, which only order the rows.
function byColumn(column: string, direction: string) {
  return [...payments].sort((one, other) => {
    const difference =
      column === byAmount
        ? Number(one.value) - Number(other.value)
        : one.name.localeCompare(other.name);
    return direction === "ascending" ? difference : -difference;
  });
}

const Sorting: Story = {
  tags: ["visual"],
  render: function Render() {
    const [sort, setSort] = useState<SortDescriptor>({
      column: byAmount,
      direction: "ascending",
    });
    return (
      <section className="p-6">
        <h2 className="type-title">{title}</h2>
        <Table
          aria-label={name}
          onSortChange={(next) => {
            setSort(next);
            onSortChange(next);
          }}
          sortDescriptor={sort}
        >
          <TableHeader>
            <TableRow>
              <TableHead allowsSorting={true} id={byName}>
                {description}
              </TableHead>
              <TableHead>{category}</TableHead>
              <TableHead align="end" allowsSorting={true} id={byAmount}>
                {amount}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {byColumn(String(sort.column), sort.direction).map((payment) => (
              <TableRow key={payment.id}>
                <TableHead scope="row">{payment.name}</TableHead>
                <TableCell>{payment.category}</TableCell>
                <TableCell align="end">
                  <Amount value={brl(payment.value)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const amountButton = canvas.getByRole("button", { name: amount });
    const nameButton = canvas.getByRole("button", { name: description });
    const titles = () =>
      canvas.getAllByRole("rowheader").map((cell) => cell.textContent);
    const mark = (button: HTMLElement) =>
      button.querySelector("svg")?.getAttribute("class") ?? "";
    onSortChange.mockClear();

    // aria-sort on the sorted header only, and a button in each sortable one, named by its text.
    await expect(amountButton.closest("th")).toHaveAttribute(
      "aria-sort",
      "ascending",
    );
    await expect(nameButton.closest("th")).not.toHaveAttribute("aria-sort");
    await expect(
      canvas.getByRole("columnheader", { name: category }),
    ).not.toHaveAttribute("aria-sort");
    await expect(canvas.getAllByRole("button")).toHaveLength(2);
    await expect(titles()).toEqual(
      byColumn(byAmount, "ascending").map((payment) => payment.name),
    );
    // The sorted header's arrow, in the text's colour; a quiet mark on the others that sort.
    await expect(mark(amountButton)).toContain("lucide-arrow-up");
    await expect(mark(nameButton)).toContain("lucide-chevrons-up-down");
    await expect(getComputedStyle(amountButton).color).toBe(
      colourOf("var(--foreground)", canvasElement),
    );
    // At the end, the mark comes before the text, so the text lines up with the column.
    await expect(
      (amountButton.querySelector("svg") as Element).getBoundingClientRect()
        .left,
    ).toBeLessThan(
      (
        within(amountButton).getByText(amount) as Element
      ).getBoundingClientRect().left,
    );
    await expect(
      amountButton.getBoundingClientRect().height,
    ).toBeGreaterThanOrEqual(target24);
    // Every header's text on one line, whether it sorts or not, and wherever its mark is.
    const top = (element: Element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return Math.round(range.getBoundingClientRect().top);
    };
    const plainTop = top(canvas.getByRole("columnheader", { name: category }));
    await expect([
      top(within(amountButton).getByText(amount)),
      top(within(nameButton).getByText(description)),
    ]).toEqual([plainTop, plainTop]);
    // A press on the sorted header flips it; on another, sorts it ascending.
    await userEvent.click(amountButton);
    await expect(onSortChange).toHaveBeenLastCalledWith({
      column: byAmount,
      direction: "descending",
    });
    await expect(amountButton.closest("th")).toHaveAttribute(
      "aria-sort",
      "descending",
    );
    await expect(mark(amountButton)).toContain("lucide-arrow-down");
    await expect(titles()).toEqual(
      byColumn(byAmount, "descending").map((payment) => payment.name),
    );
    await userEvent.click(nameButton);
    await expect(onSortChange).toHaveBeenLastCalledWith({
      column: byName,
      direction: "ascending",
    });
    await expect(amountButton.closest("th")).not.toHaveAttribute("aria-sort");
  },
};

// A sortable header in a table that cannot hear a sort says so, as its button would do nothing.
const SortWithoutHandler: Story = {
  render: () => (
    <Caught>
      <Table aria-label={name}>
        <TableHeader>
          <TableRow>
            <TableHead allowsSorting={true} id={byName}>
              {description}
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "TableHead allowsSorting needs onSortChange on its Table.",
      ),
    ).toBeVisible();
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
  ActionWithoutTitle,
  ChildRows,
  ChildRowsDefaultOpen,
  ChildRowsOpen,
  CurrentRow,
  Default,
  Groups,
  InCard,
  InCardWithMore,
  NamedByHeading,
  Narrow,
  Overflowing,
  RowActions,
  RowLink,
  RowOutsideTable,
  Selection,
  SelectionBar,
  SelectionBarInCard,
  SelectionOverflowing,
  SelectionShown,
  SelectWithoutKey,
  SelectWithoutTitle,
  Sorting,
  SortWithoutHandler,
  WithCaption,
};
