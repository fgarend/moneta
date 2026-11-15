import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";
import { Item, ItemContent, ItemGroup, ItemTitle } from "./item.js";
import { Section, SectionHeader, SectionTitle } from "./section.js";
import { Stat, StatGroup, StatLabel, StatValue } from "./stat.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const title = "Savings";
const description = "Fictitious account";
const content = "Balance 1,250.00";
const action = "Details";
const footer = "Updated today";
const group = "Today";
const row = "Fictitious grocer";
const outer = "Fictitious accounts";
const longTitle =
  "Every fictitious account held for the long term, with what each one earned this year";
const stats = ["Balance", "Income", "Expenses", "Invested"];

// The scale of text and space the guidelines give a card, and a large one, a part of the page.
const titleSize = "15px";
const descriptionSize = "13px";
const cardSpacing = "20px";
const largeTitleSize = "18px";
const largeTitleLine = "24px";
const largeTitleWeight = "600";
const largeSpacing = "24px";
// A shadow that draws a line, as a ring does: any length but 0.
const drawn = /[1-9]\d*(?:\.\d+)?px/u;

function headingOf(canvasElement: HTMLElement, name: string): HTMLElement {
  return within(canvasElement).getByRole("heading", { name });
}

function slot(canvasElement: HTMLElement, name: string): HTMLElement {
  return canvasElement.querySelector(`[data-slot="${name}"]`) as HTMLElement;
}

// A list grouped under a title of its own, whose heading says how deep the card's content sits.
function grouped() {
  return (
    <ItemGroup title={group}>
      <Item>
        <ItemContent>
          <ItemTitle>{row}</ItemTitle>
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}

function numbers(
  props: Pick<ComponentProps<typeof StatGroup>, "spacing" | "variant"> = {},
) {
  return (
    <StatGroup {...props}>
      {stats.map((label) => (
        <Stat key={label}>
          <StatLabel>{label}</StatLabel>
          <StatValue>1,250.00</StatValue>
        </Stat>
      ))}
    </StatGroup>
  );
}

// A header kept in a component of the app's own, which the card cannot see among its children.
// biome-ignore lint/style/useComponentExportOnlyModules: a part of this story's own, which enters no package.
function OwnHeader() {
  return (
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
  );
}

const meta = {
  title: "Components/Display & Media/Card",
  component: Card,
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Button size="sm">{action}</Button>
          </CardAction>
        </CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter>{footer}</CardFooter>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

// Its title a heading, h2 at the page's top, in the scale of text and space the theme sets.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = headingOf(canvasElement, title);

    await expect(heading.tagName).toBe("H2");
    await expect(getComputedStyle(heading).fontSize).toBe(titleSize);
    await expect(getComputedStyle(canvas.getByText(description)).fontSize).toBe(
      descriptionSize,
    );
    await expect(getComputedStyle(slot(canvasElement, "card")).paddingTop).toBe(
      cardSpacing,
    );
    await expect(canvas.getByText(description)).toBeVisible();
    await expect(canvas.getByText(content)).toBeVisible();
    await expect(canvas.getByText(footer)).toBeVisible();
    await expect(canvas.getByRole("button", { name: action })).toBeVisible();
  },
};

// In a section, its title one level below the section's.
const InSection: Story = {
  render: (args) => (
    <Section>
      <SectionHeader>
        <SectionTitle>{outer}</SectionTitle>
      </SectionHeader>
      <Card {...args} />
    </Section>
  ),
  play: async ({ canvasElement }) => {
    await expect(headingOf(canvasElement, outer).tagName).toBe("H2");
    await expect(headingOf(canvasElement, title).tagName).toBe("H3");
  },
};

// A level given by hand wins over the one from where it sits.
const LevelByHand: Story = {
  args: {
    children: (
      <CardHeader>
        <CardTitle level={4}>{title}</CardTitle>
      </CardHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(headingOf(canvasElement, title).tagName).toBe("H4");
  },
};

// What a card with a title holds sits one level below it: a list's group under an h2 card is an h3.
const ContentUnderTitle: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{grouped()}</CardContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(headingOf(canvasElement, title).tagName).toBe("H2");
    await expect(headingOf(canvasElement, group).tagName).toBe("H3");
  },
};

// With no title, what it holds takes the level the title would, so no level is skipped.
const ContentWithoutTitle: Story = {
  args: { children: <CardContent>{grouped()}</CardContent> },
  play: async ({ canvasElement }) => {
    await expect(headingOf(canvasElement, group).tagName).toBe("H2");
  },
};

// A header kept in a component of the app's own is not seen: what the card holds stays at its title's level, beside
// it rather than below, and no level is skipped. Its page does not recommend it.
const HeaderInAComponent: Story = {
  tags: ["!autodocs"],
  args: {
    children: (
      <>
        <OwnHeader />
        <CardContent>{grouped()}</CardContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(headingOf(canvasElement, title).tagName).toBe("H2");
    await expect(headingOf(canvasElement, group).tagName).toBe("H2");
  },
};

// A group of numbers alone in its content runs edge to edge, as a table and a list do: a line above, no box of its
// own, its lines reaching the card's sides and its foot, and its text lined up with the card's title.
// A table as the card holds it: a header and one row.
function table() {
  return (
    <Table aria-label={title}>
      <TableHeader>
        <TableRow>
          <TableHead>{stats[0]}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{row}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

const edgeToEdge = [
  ["table", table()],
  ["list", grouped()],
  ["numbers", numbers()],
] as const;

/**
 * With no title, under a section's, what runs edge to edge starts at the card's top, with no padding and no line
 * above it: a table, a list of rows, or numbers joined in one box. The section's header holds the title, a count and
 * the controls.
 */
const WithoutTitle: Story = {
  render: () => (
    <div className="flex flex-col gap-10">
      {edgeToEdge.map(([kind, inside]) => (
        <Section key={kind}>
          <SectionHeader>
            <SectionTitle>{outer}</SectionTitle>
          </SectionHeader>
          <Card data-kind={kind}>
            <CardContent>{inside}</CardContent>
          </Card>
        </Section>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const card of canvasElement.querySelectorAll('[data-slot="card"]')) {
      const inside = card.querySelector(
        '[data-slot="card-content"]',
      ) as HTMLElement;
      await expect(getComputedStyle(inside).borderTopWidth).toBe("0px");
      await expect(Math.round(inside.getBoundingClientRect().top)).toBe(
        Math.round(card.getBoundingClientRect().top),
      );
    }
  },
};

const Numbers: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{numbers()}</CardContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const card = slot(canvasElement, "card").getBoundingClientRect();
    const box = getComputedStyle(slot(canvasElement, "card-content"));
    const list = getComputedStyle(slot(canvasElement, "stat-group"));
    const first = within(canvasElement)
      .getByText(stats[0] as string)
      .getBoundingClientRect();
    const last = (
      canvasElement.querySelectorAll('[data-slot="stat"]')[
        stats.length - 1
      ] as Element
    ).getBoundingClientRect();

    await expect(box.paddingLeft).toBe("0px");
    await expect(box.borderTopWidth).toBe("1px");
    await expect(list.boxShadow).not.toMatch(drawn);
    await expect(list.borderTopLeftRadius).toBe("0px");
    await expect(list.backgroundColor).toBe("rgba(0, 0, 0, 0)");
    await expect(Math.round(last.bottom)).toBe(Math.round(card.bottom));
    await expect(Math.round(first.left)).toBe(
      Math.round(headingOf(canvasElement, title).getBoundingClientRect().left),
    );
  },
};

// In a large card and a small one, the numbers' padding follows the card's, so their text still lines up with its
// title.
const NumbersBySize: Story = {
  tags: ["!autodocs"],
  render: () => (
    <div className="flex flex-col gap-6">
      {(["lg", "sm"] as const).map((size) => (
        <Card key={size} size={size}>
          <CardHeader>
            <CardTitle>{size}</CardTitle>
          </CardHeader>
          <CardContent>{numbers()}</CardContent>
        </Card>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const card of canvasElement.querySelectorAll('[data-slot="card"]')) {
      const heading = within(card as HTMLElement).getByRole("heading");
      const label = card.querySelector('[data-slot="stat-label"]') as Element;
      await expect(Math.round(label.getBoundingClientRect().left)).toBe(
        Math.round(heading.getBoundingClientRect().left),
      );
    }
  },
};

// Numbers in boxes apart, or with no box, keep the card's padding: boxes against its edges, or words with no room
// beside them, would look cut. Only joined boxes, which have lines of their own, run to the edges.
const NumbersApart: Story = {
  tags: ["!autodocs"],
  render: () => (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>{numbers({ spacing: 4 })}</CardContent>
      </Card>
      <Card>
        <CardContent>{numbers({ variant: "ghost" })}</CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const card of canvasElement.querySelectorAll('[data-slot="card"]')) {
      const inside = getComputedStyle(
        card.querySelector('[data-slot="card-content"]') as Element,
      );
      await expect(inside.paddingLeft).toBe(cardSpacing);
      await expect(inside.borderTopWidth).toBe("0px");
      await expect(getComputedStyle(card).paddingBottom).toBe(cardSpacing);
    }
  },
};

// A card that is a part of the page: its title at a section's size, 18/24 and 600, and 24 px around what it holds.
const Large: Story = {
  args: { size: "lg" },
  play: async ({ canvasElement }) => {
    const heading = headingOf(canvasElement, title);
    const { fontSize, lineHeight, fontWeight } = getComputedStyle(heading);

    await expect(heading.tagName).toBe("H2");
    await expect(fontSize).toBe(largeTitleSize);
    await expect(lineHeight).toBe(largeTitleLine);
    await expect(fontWeight).toBe(largeTitleWeight);
    await expect(getComputedStyle(slot(canvasElement, "card")).paddingTop).toBe(
      largeSpacing,
    );
    await expect(
      getComputedStyle(slot(canvasElement, "card-header")).paddingLeft,
    ).toBe(largeSpacing);
  },
};

// Several controls in a card's action lie in a row, 8 px apart, centred on one another.
const SeveralActions: Story = {
  args: {
    children: (
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            {action}
          </Button>
          <Button size="sm">{footer}</Button>
        </CardAction>
      </CardHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = [action, footer].map((name) =>
      canvas.getByRole("button", { name }).getBoundingClientRect(),
    ) as [DOMRect, DOMRect];

    await expect(Math.round(second.left - first.right)).toBe(8);
    await expect(Math.round(second.top - first.top)).toBe(0);
  },
};

// A long title wraps beside its action at 320 px, and nothing leaves the card.
const LongTitle: Story = {
  tags: ["!autodocs"],
  args: {
    children: (
      <CardHeader>
        <CardTitle>{longTitle}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button size="sm">{action}</Button>
        </CardAction>
      </CardHeader>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const card = slot(canvasElement, "card");
    const heading = headingOf(canvasElement, longTitle);
    const button = within(canvasElement)
      .getByRole("button", { name: action })
      .getBoundingClientRect();

    await expect(card.scrollWidth).toBe(card.clientWidth);
    await expect(heading.getBoundingClientRect().height).toBeGreaterThan(
      Number.parseFloat(getComputedStyle(heading).lineHeight),
    );
    await expect(
      Math.round(heading.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(Math.round(button.left));
  },
};

export default meta;
export {
  ContentUnderTitle,
  ContentWithoutTitle,
  Default,
  HeaderInAComponent,
  InSection,
  Large,
  LevelByHand,
  LongTitle,
  Numbers,
  NumbersApart,
  NumbersBySize,
  SeveralActions,
  WithoutTitle,
};
