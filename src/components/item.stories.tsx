import type { Meta, StoryObj } from "@storybook/react-vite";
import { PiggyBank } from "lucide-react";
import { RouterProvider } from "react-aria-components";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./button.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item.js";
import { Link } from "./link.js";

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

// Every part: media as an icon and as it is, a header and a footer.
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

export default meta;
export { AllParts, Alone, CurrentRow, Default, InCard, LongText, RowLink };
