import type { Meta, StoryObj } from "@storybook/react-vite";
import { PiggyBank } from "lucide-react";
import { RouterProvider } from "react-aria-components";
import { expect, fn, userEvent, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { Amount } from "./amount.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import {
  Item,
  ItemAction,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemEmpty,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  ItemValue,
} from "./item.js";
import { Link } from "./link.js";
import { Section, SectionHeader, SectionTitle } from "./section.js";

const title = "Savings";
const description = "Balance 1,250.00";
const action = "Details";
const linked = "Checking";
const heading = "Accounts";
const accounts = [
  { id: "a1", name: "Account 1234", detail: "Example Bank" },
  { id: "a2", name: "Account 5678", detail: "Fictitious Broker" },
  { id: "a3", name: "Savings", detail: "Example Bank" },
];
const longName =
  "A fictitious joint savings account whose name is long enough to need more than one line";
const longDetail =
  "Opened for a fictitious family's holidays, kept at a fictitious bank, with a detail that runs to three lines or more on a phone";

// What the guidelines give a list of rows: a line under each row but the last, no box of its own, and the table's ends.
const line = "1px";
const none = "0px";
const looseEnd = "12px";
const cardEnd = "20px";
const lineHeight = 20;

// The colour a value of the theme resolves to where the list sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// Where a row's text starts, inside its padding.
function textStart(element: Element): number {
  return element.getBoundingClientRect().left;
}

function rows() {
  return accounts.map((account) => (
    <Item key={account.id}>
      <ItemContent>
        <ItemTitle>{account.name}</ItemTitle>
        <ItemDescription>{account.detail}</ItemDescription>
      </ItemContent>
    </Item>
  ));
}

const meta = {
  title: "Components/Display & Media/Item",
  component: ItemGroup,
  tags: ["raw"],
} satisfies Meta<typeof ItemGroup>;

type Story = StoryObj<typeof meta>;

// Loose on a page: a list, each item one of its items, a line under each row but the last and no box around a row,
// its text lined up with the page, its rows reaching 12 px out on each side.
const Default: Story = {
  tags: ["visual"],
  render: () => (
    <section className="p-6">
      <h2 className="type-title">{heading}</h2>
      <ItemGroup>{rows()}</ItemGroup>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list");
    const items = within(list).getAllByRole("listitem");
    const [first, , last] = items as [HTMLElement, HTMLElement, HTMLElement];
    const firstTitle = canvas.getByText(accounts[0]?.name ?? "");

    await expect(list.tagName).toBe("UL");
    await expect(items).toHaveLength(accounts.length);
    await expect(first.tagName).toBe("LI");
    const { borderBottomWidth, borderBottomColor, borderTopWidth } =
      getComputedStyle(first);
    await expect([
      borderBottomWidth,
      borderBottomColor,
      borderTopWidth,
    ]).toEqual([line, colourOf("var(--border)", canvasElement), none]);
    await expect(getComputedStyle(last).borderBottomWidth).toBe(none);
    await expect(getComputedStyle(first).paddingInlineStart).toBe(looseEnd);
    await expect(Math.round(textStart(firstTitle))).toBe(
      Math.round(
        canvas.getByRole("heading", { name: heading }).getBoundingClientRect()
          .left,
      ),
    );
  },
};

// In a card, alone in its content: edge to edge, with a line above, its text lined up with the card's title.
const InCard: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>{rows()}</ItemGroup>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const content = canvasElement.querySelector(
      '[data-slot="card-content"]',
    ) as Element;
    const first = within(canvasElement).getAllByRole("listitem")[0] as Element;
    const { paddingLeft, borderTopWidth } = getComputedStyle(content);

    await expect([paddingLeft, borderTopWidth]).toEqual([none, line]);
    await expect(getComputedStyle(first).paddingInlineStart).toBe(cardEnd);
    await expect(
      Math.round(
        textStart(within(canvasElement).getByText(accounts[0]?.name ?? "")),
      ),
    ).toBe(
      Math.round(
        (
          canvasElement.querySelector('[data-slot="card-title"]') as Element
        ).getBoundingClientRect().left,
      ),
    );
  },
};

// Narrow, a long title and a long description wrap, and are never cut.
const LongText: Story = {
  render: () => (
    <ItemGroup>
      <Item>
        <ItemContent>
          <ItemTitle>{longName}</ItemTitle>
          <ItemDescription>{longDetail}</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const text of [longName, longDetail]) {
      const element = canvas.getByText(text);
      await expect(element.getBoundingClientRect().height).toBeGreaterThan(
        lineHeight,
      );
      await expect(element.scrollHeight).toBe(element.clientHeight);
    }
    await expect(
      canvas.getByText(longDetail).getBoundingClientRect().height,
    ).toBeGreaterThan(lineHeight * 2);
  },
};

// Alone, out of a list, an item is no item of a list, and keeps its box when outlined; one that opens has its link in
// its title.
const Alone: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription>{description}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">{action}</Button>
        </ItemActions>
      </Item>
      <ItemSeparator />
      <Item>
        <ItemContent>
          <ItemTitle>
            <Link href="#checking" isQuiet={true}>
              {linked}
            </Link>
          </ItemTitle>
        </ItemContent>
      </Item>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvasElement.querySelector('[data-slot="item"]') as Element;

    await expect(canvas.queryByRole("listitem")).toBeNull();
    await expect(item.tagName).toBe("DIV");
    await expect(getComputedStyle(item).borderTopWidth).toBe(line);
    await expect(canvas.getByRole("button", { name: action })).toBeVisible();
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: linked })).toHaveAttribute(
      "href",
      "#checking",
    );
  },
};

const header = "Goal";
const footer = "Updated today";

// Every part: media as an icon and as it is, a header and a footer, and a value with nothing under it.
const AllParts: Story = {
  render: () => (
    <ItemGroup>
      <Item>
        <ItemHeader>{header}</ItemHeader>
        <ItemMedia variant="icon">
          <PiggyBank aria-hidden={true} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
        </ItemContent>
        <ItemFooter>{footer}</ItemFooter>
      </Item>
      <Item>
        <ItemMedia>
          <PiggyBank aria-hidden={true} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{linked}</ItemTitle>
        </ItemContent>
        <ItemValue>
          <Amount value={{ amount: "1250", currency: "USD" }} />
        </ItemValue>
      </Item>
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const media = [
      ...canvasElement.querySelectorAll('[data-slot="item-media"]'),
    ];

    await expect(canvas.getByText(header)).toBeVisible();
    await expect(canvas.getByText(footer)).toBeVisible();
    await expect(
      media.map((part) => part.getAttribute("data-variant")),
    ).toEqual(["icon", "default"]);
  },
};

// A row that opens: a click on an empty part of it goes to the link in its title, so keyboards and screen readers
// keep one short link while a pointer has the whole row, which shows a pointer over it. A click on text
// being selected stays where it is, and one with Ctrl or Cmd reaches the link with its key.
const navigate = fn();

const RowLink: Story = {
  render: () => (
    <RouterProvider navigate={navigate}>
      <ItemGroup>
        {accounts.map((account) => (
          <Item key={account.id}>
            <ItemContent>
              <ItemTitle>
                <Link href={`/accounts/${account.id}`} isQuiet={true}>
                  {account.name}
                </Link>
              </ItemTitle>
              <ItemDescription>{account.detail}</ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
    </RouterProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = accounts[0];
    const detail = canvas.getAllByText(first?.detail ?? "")[0] as HTMLElement;
    const row = detail.closest("li") as HTMLElement;
    const link = canvas.getByRole("link", { name: first?.name });
    const keys: boolean[] = [];
    // The test's own clicks are not the user's, so the browser would follow a link with Ctrl in this very page.
    link.addEventListener("click", (event) => {
      keys.push(event.ctrlKey);
      if (event.ctrlKey) {
        event.preventDefault();
      }
    });

    // One link per row, named by its title alone.
    await expect(canvas.getAllByRole("link")).toHaveLength(accounts.length);
    await expect(getComputedStyle(row).cursor).toBe("pointer");
    navigate.mockClear();
    await userEvent.click(detail);
    await expect(navigate).toHaveBeenCalledWith(
      `/accounts/${first?.id}`,
      undefined,
    );
    // With text selected in the row, a click is part of selecting.
    navigate.mockClear();
    const selection = document.getSelection() as Selection;
    selection.selectAllChildren(detail);
    detail.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await expect(navigate).not.toHaveBeenCalled();
    selection.removeAllRanges();
    // With Ctrl, the link gets the key, and the router does not navigate here.
    keys.length = 0;
    detail.dispatchEvent(
      new MouseEvent("click", { bubbles: true, ctrlKey: true }),
    );
    await expect(keys).toEqual([true]);
    await expect(navigate).not.toHaveBeenCalled();
  },
};

// The row open beside the list, as in a side panel: aria-current, at --muted with a bar of --primary at its start,
// which moves none of its text.
const bar = "3px";

const CurrentRow: Story = {
  render: () => (
    <ItemGroup>
      {accounts.map((account) => (
        <Item
          aria-current={account.id === "a2" ? "true" : undefined}
          key={account.id}
        >
          <ItemContent>
            <ItemTitle>{account.name}</ItemTitle>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, current] = canvas.getAllByRole("listitem") as [
      HTMLElement,
      HTMLElement,
    ];
    const marker = getComputedStyle(current, "::before");
    const left = (text: string) =>
      Math.round(canvas.getByText(text).getBoundingClientRect().left);

    await expect(current).toHaveAttribute("aria-current", "true");
    await expect(getComputedStyle(current).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect([
      marker.width,
      marker.backgroundColor,
      marker.insetInlineStart,
    ]).toEqual([bar, colourOf("var(--primary)", canvasElement), none]);
    await expect(left(accounts[1]?.name ?? "")).toBe(
      left(accounts[0]?.name ?? ""),
    );
    await expect(getComputedStyle(first).backgroundColor).toBe(
      "rgba(0, 0, 0, 0)",
    );
  },
};

// A row as the prototypes draw it: an icon on a tile, a title and its detail, and the value at the end, with a line
// under it, as the day it was paid or a badge. The value is at the text's weight, keeps its tone, and never wraps,
// while a long title gives way.
const payments = [
  {
    id: "p1",
    name: "Central Market",
    detail: "Food",
    value: "-286.4",
    when: "Today",
  },
  {
    id: "p2",
    name: "A fictitious rent, paid to a landlord with a long name",
    detail: "Home",
    value: "-1850",
    when: "Pending",
  },
];
const tile = 40;
const icon = 20;
const detailSize = "12px";

const IconAndValue: Story = {
  tags: ["visual"],
  render: () => (
    <section className="w-96 p-6">
      <h2 className="type-title">{heading}</h2>
      <ItemGroup>
        {payments.map((payment) => (
          <Item key={payment.id}>
            <ItemMedia variant="icon">
              <PiggyBank aria-hidden={true} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{payment.name}</ItemTitle>
              <ItemDescription>{payment.detail}</ItemDescription>
            </ItemContent>
            <ItemValue
              detail={
                payment.when === "Pending" ? (
                  <Badge variant="outline">{payment.when}</Badge>
                ) : (
                  payment.when
                )
              }
            >
              <Amount
                tone="negative"
                value={{ amount: payment.value, currency: "USD" }}
              />
            </ItemValue>
          </Item>
        ))}
      </ItemGroup>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const media = canvasElement.querySelector(
      '[data-slot="item-media"]',
    ) as Element;
    const [first, second] = [
      ...canvasElement.querySelectorAll('[data-slot="item-value"]'),
    ] as [HTMLElement, HTMLElement];
    const amount = first.querySelector('[data-slot="amount"]') as HTMLElement;
    const when = canvas.getByText(payments[0]?.when ?? "");
    const row = first.closest("li") as HTMLElement;

    // The tile: 40 px at --muted, its icon 20 px.
    const { width, height } = media.getBoundingClientRect();
    await expect([width, height]).toEqual([tile, tile]);
    await expect(getComputedStyle(media).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(
      (media.querySelector("svg") as Element).getBoundingClientRect().width,
    ).toBe(icon);
    // The value at the row's end, at the text's weight, in its tone, with the day under it, small and muted.
    await expect(Math.round(first.getBoundingClientRect().right)).toBe(
      Math.round(
        row.getBoundingClientRect().right -
          Number.parseFloat(getComputedStyle(row).paddingInlineEnd),
      ),
    );
    await expect(getComputedStyle(amount).fontWeight).toBe("400");
    await expect(getComputedStyle(amount).color).toBe(
      colourOf("var(--negative)", canvasElement),
    );
    await expect([
      getComputedStyle(when).fontSize,
      getComputedStyle(when).color,
    ]).toEqual([
      detailSize,
      colourOf("var(--muted-foreground)", canvasElement),
    ]);
    await expect(Math.round(when.getBoundingClientRect().right)).toBe(
      Math.round(first.getBoundingClientRect().right),
    );
    // A long title gives way, and the value keeps one line.
    const secondAmount = second.querySelector(
      '[data-slot="amount"]',
    ) as HTMLElement;
    await expect(secondAmount.scrollWidth).toBe(secondAmount.clientWidth);
    await expect(
      canvas.getByText(payments[1]?.name ?? "").getBoundingClientRect().height,
    ).toBeGreaterThan(lineHeight);
    await expect(
      within(second).getByText(payments[1]?.when ?? ""),
    ).toBeVisible();
  },
};

// Groups: a day's payments under its title, a heading that names the list, with the day's total at its end, as a
// table's groups: small, semibold and muted, 12 px above the first and 32 above the next, a strong line under it.
const days = [
  {
    id: "today",
    title: "Today, October 24",
    total: "-335.3",
    rows: [
      { id: "d1", name: "Central Market", value: "-286.4" },
      { id: "d2", name: "Corner Bakery", value: "-48.9" },
    ],
  },
  {
    id: "yesterday",
    title: "Yesterday, October 23",
    total: "6250",
    rows: [
      { id: "d3", name: "Fictitious salary", value: "7250" },
      { id: "d4", name: "Between accounts", value: "-1000" },
    ],
  },
];
const groupSize = "12px";
const firstGap = "12px";
const groupGap = "32px";

// Fictitious sums are still sums: a decimal string in cents, exact.
function cents(value: string): bigint {
  const [whole = "0", decimals = ""] = value.split(".");
  const sign = whole.startsWith("-") ? -1n : 1n;
  return (
    BigInt(whole) * 100n + sign * BigInt(decimals.padEnd(2, "0").slice(0, 2))
  );
}

function statement() {
  return days.map((day) => (
    <ItemGroup
      key={day.id}
      title={day.title}
      total={
        <Amount sign="always" value={{ amount: day.total, currency: "USD" }} />
      }
    >
      {day.rows.map((row) => (
        <Item key={row.id}>
          <ItemContent>
            <ItemTitle>{row.name}</ItemTitle>
          </ItemContent>
          <ItemValue>
            <Amount
              sign="always"
              value={{ amount: row.value, currency: "USD" }}
            />
          </ItemValue>
        </Item>
      ))}
    </ItemGroup>
  ));
}

const Groups: Story = {
  tags: ["visual"],
  render: () => <div className="p-6">{statement()}</div>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = days.map((day) =>
      canvas.getByRole("heading", { name: day.title }),
    ) as [HTMLElement, HTMLElement];
    const groupHeader = first.parentElement as HTMLElement;
    const total = groupHeader.querySelector(
      '[data-slot="amount"]',
    ) as HTMLElement;

    // The fixture adds up.
    for (const day of days) {
      await expect(
        day.rows.reduce((all, row) => all + cents(row.value), 0n),
      ).toBe(cents(day.total));
    }
    // A heading below the page's, which names its list of rows.
    await expect(first.tagName).toBe("H2");
    await expect(
      within(canvas.getByRole("list", { name: days[0]?.title })).getAllByRole(
        "listitem",
      ),
    ).toHaveLength(days[0]?.rows.length ?? 0);
    // Small, semibold and muted, with the total at 500 and the rows' size at its end, and a strong line under it.
    const { fontSize, fontWeight, color } = getComputedStyle(first);
    await expect([fontSize, fontWeight, color]).toEqual([
      groupSize,
      "600",
      colourOf("var(--muted-foreground)", canvasElement),
    ]);
    await expect([
      getComputedStyle(total).fontWeight,
      getComputedStyle(total).fontSize,
    ]).toEqual(["500", "14px"]);
    await expect(Math.round(total.getBoundingClientRect().right)).toBe(
      Math.round(
        groupHeader.getBoundingClientRect().right -
          Number.parseFloat(getComputedStyle(groupHeader).paddingInlineEnd),
      ),
    );
    await expect(getComputedStyle(groupHeader).borderBottomColor).toBe(
      colourOf("var(--border-strong)", canvasElement),
    );
    // 12 px above the first group's title, 32 above the next.
    const gap = (groupTitle: HTMLElement) =>
      getComputedStyle(
        groupTitle.closest('[data-slot="item-group"]') as Element,
      ).paddingTop;
    await expect([gap(first), gap(second)]).toEqual([firstGap, groupGap]);
  },
};

// In a section, a group's title is a level below the section's; in a card, the groups run edge to edge together; and a
// group may have no total.
const noTotal = "Other accounts";

const GroupsInSection: Story = {
  render: () => (
    <Section>
      <SectionHeader>
        <SectionTitle>{heading}</SectionTitle>
      </SectionHeader>
      <Card>
        <CardContent>
          {statement()}
          <ItemGroup title={noTotal}>{rows()}</ItemGroup>
        </CardContent>
      </Card>
    </Section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const content = canvasElement.querySelector(
      '[data-slot="card-content"]',
    ) as Element;

    await expect(
      canvas.getByRole("heading", { name: days[0]?.title }).tagName,
    ).toBe("H3");
    await expect(getComputedStyle(content).paddingLeft).toBe(none);
    await expect(
      (
        canvas.getByRole("heading", { name: noTotal }).parentElement as Element
      ).querySelector('[data-slot="amount"]'),
    ).toBeNull();
  },
};

// An action on a row: a quiet icon button of 32 px, whose name joins the app's one word to the row's title, and which
// takes no more height than the row's text, so a row with one is as tall as one without.
const edit = "Edit";
const target = 32;

const RowAction: Story = {
  render: () => (
    <ItemGroup>
      {accounts.map((account, index) => (
        <Item key={account.id}>
          <ItemContent>
            <ItemTitle>{account.name}</ItemTitle>
            <ItemDescription>{account.detail}</ItemDescription>
          </ItemContent>
          {index < 2 ? (
            <ItemActions>
              <ItemAction aria-label={edit}>
                <PiggyBank aria-hidden={true} />
              </ItemAction>
            </ItemActions>
          ) : null}
        </Item>
      ))}
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: `${edit} ${accounts[0]?.name}`,
    });
    const [withAction, , without] = canvas.getAllByRole("listitem") as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    const { width, height } = button.getBoundingClientRect();

    await expect(canvas.getAllByRole("button")).toHaveLength(2);
    await expect([width, height]).toEqual([target, target]);
    // The rows' content, as the last row has no line under it.
    const content = (row: Element) =>
      (
        row.querySelector('[data-slot="item"]') as Element
      ).getBoundingClientRect().height;
    await expect(content(withAction)).toBe(content(without));
  },
};

// An action in a row with no title says so, as its name could not say which row it acts on.
const ActionWithoutTitle: Story = {
  render: () => (
    <Caught>
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
          <ItemAction aria-label={edit}>
            <PiggyBank aria-hidden={true} />
          </ItemAction>
        </Item>
      </ItemGroup>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        `ItemAction: "${edit}" needs its item titled by ItemTitle.`,
      ),
    ).toBeVisible();
  },
};

// Empty: the group's title stays, and the app's words take the rows' place, centred and muted.
const emptyText = "No payments today.";

const Empty: Story = {
  render: () => (
    <ItemGroup title={days[0]?.title}>
      <ItemEmpty>{emptyText}</ItemEmpty>
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const words = canvas.getByText(emptyText);

    await expect(
      canvas.getByRole("heading", { name: days[0]?.title }),
    ).toBeVisible();
    await expect(words.tagName).toBe("LI");
    await expect([
      getComputedStyle(words).textAlign,
      getComputedStyle(words).color,
    ]).toEqual(["center", colourOf("var(--muted-foreground)", canvasElement)]);
  },
};

// Loading, as a table's: the first time, shapes of a row that a screen reader skips; on a reload, the rows as they
// are under a running bar. Either way the list is busy, and the app's words are heard.
const loadingLabel = "Loading accounts";
const rowHeight = 64;

const FirstLoad: Story = {
  tags: ["visual"],
  render: () => (
    <div className="p-6">
      <ItemGroup isLoading={true} loadingLabel={loadingLabel} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvasElement.querySelector("ul") as HTMLElement;
    const shapes = [...list.children] as HTMLElement[];

    await expect(list).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByRole("status")).toHaveTextContent(loadingLabel);
    await expect(shapes).toHaveLength(5);
    await expect(shapes.every((shape) => shape.ariaHidden === "true")).toBe(
      true,
    );
    await expect(
      Math.round(
        (
          (shapes[0] as HTMLElement).firstElementChild as Element
        ).getBoundingClientRect().height,
      ),
    ).toBe(tile);
    await expect(
      Math.round(shapes[1]?.getBoundingClientRect().height ?? 0),
    ).toBe(rowHeight + 1);
    await expect(canvas.queryByRole("progressbar")).toBeNull();
  },
};

const FirstLoadFew: Story = {
  render: () => (
    <ItemGroup isLoading={true} loadingLabel={loadingLabel} loadingRows={3} />
  ),
  play: async ({ canvasElement }) => {
    await expect(
      (canvasElement.querySelector("ul") as Element).children,
    ).toHaveLength(3);
  },
};

const Reloading: Story = {
  render: () => (
    <ItemGroup isLoading={true} loadingLabel={loadingLabel}>
      {rows()}
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const list = canvas.getByRole("list");
    const running = canvas.getByRole("progressbar", { name: loadingLabel });

    await expect(list).toHaveAttribute("aria-busy", "true");
    await expect(within(list).getAllByRole("listitem")).toHaveLength(
      accounts.length,
    );
    await expect(Math.round(running.getBoundingClientRect().top)).toBe(
      Math.round(list.getBoundingClientRect().top),
    );
  },
};

const NotLoading: Story = {
  render: () => (
    <ItemGroup isLoading={false} loadingLabel={loadingLabel}>
      {rows()}
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("list")).not.toHaveAttribute("aria-busy");
    await expect(canvas.getByRole("status")).toHaveTextContent("");
    await expect(canvas.queryByRole("progressbar")).toBeNull();
  },
};

export default meta;
export {
  ActionWithoutTitle,
  AllParts,
  Alone,
  CurrentRow,
  Default,
  Empty,
  FirstLoad,
  FirstLoadFew,
  Groups,
  GroupsInSection,
  IconAndValue,
  InCard,
  LongText,
  NotLoading,
  Reloading,
  RowAction,
  RowLink,
};
