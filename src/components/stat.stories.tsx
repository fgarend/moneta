import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ChevronRightIcon,
  TrendingUpIcon,
  WalletIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { totals } from "../../.storybook/data.js";
import { Amount } from "./amount.js";
import { IconTile } from "./icon-tile.js";
import { Percent } from "./percent.js";
import {
  Stat,
  StatAction,
  StatDescription,
  StatGroup,
  StatLabel,
  StatValue,
} from "./stat.js";

// Each total's icon, in the totals' order.
const icons = [WalletIcon, ArrowDownLeftIcon, ArrowUpRightIcon, TrendingUpIcon];
const thisMonth = " this month";
const open = "Open";
const loadingLabel = "Loading totals";

// What the guidelines give it: a box's padding, 20 px, as a card's; a tile of 48 px, 12 from the text; and a label of
// 13/20, a value of 24/32 at 600.
const pad = 20;
const tileSize = 48;
const tileGap = 12;
const line = "1px";
const none = "0px";

// The colour a value of the theme resolves to where the group sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// The corners a value of the theme resolves to, as a card's.
function cornerOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.borderTopLeftRadius = value;
  near.append(probe);
  const { borderTopLeftRadius } = getComputedStyle(probe);
  probe.remove();
  return borderTopLeftRadius;
}

function box(element: Element): DOMRect {
  return element.getBoundingClientRect();
}

function slots(canvasElement: HTMLElement, slot: string): HTMLElement[] {
  return [
    ...canvasElement.querySelectorAll(`[data-slot="${slot}"]`),
  ] as HTMLElement[];
}

// The household's totals, each with its icon, the first gold, and its change beside the app's words.
function stats({
  withIcons = true,
  count = totals.length,
}: {
  withIcons?: boolean;
  count?: number;
} = {}): ReactNode {
  return totals.slice(0, count).map(({ name, amount, change }, index) => {
    const Icon = icons[index] as typeof WalletIcon;
    return (
      <Stat key={name}>
        <StatLabel>
          {withIcons ? (
            <IconTile variant={index === 0 ? "gold" : undefined}>
              <Icon aria-hidden={true} />
            </IconTile>
          ) : null}
          {name}
        </StatLabel>
        <StatValue>
          <Amount value={amount} />
        </StatValue>
        <StatDescription>
          <Percent sign="always" tone="positive" value={change} />
          {thisMonth}
        </StatDescription>
      </Stat>
    );
  });
}

const meta = {
  title: "Components/Display & Media/Stat",
  component: StatGroup,
  subcomponents: {
    Stat,
    StatLabel,
    StatValue,
    StatDescription,
    StatAction,
    IconTile,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StatGroup>;

type Story = StoryObj<typeof meta>;

/**
 * The month's totals: one box with lines between, each number its label, its value and a note under it, as its
 * change beside the app's words. A screen reader reads them as a list of terms and values, and hears how many. The
 * icon is written in the label, and drawn left of the label and the value: a solid circle of 48 px, gold for the
 * screen's headline.
 */
export const Default: Story = {
  tags: ["visual"],
  render: () => <StatGroup>{stats()}</StatGroup>,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector("dl") as HTMLElement;
    const all = slots(canvasElement, "stat");
    const first = all[0] as HTMLElement;
    const label = first.querySelector("dt") as HTMLElement;
    const value = first.querySelector('[data-slot="stat-value"]') as Element;
    const amount = value.querySelector('[data-slot="amount"]') as Element;
    const note = first.querySelector(
      '[data-slot="stat-description"]',
    ) as Element;
    const change = note.querySelector('[data-slot="percent"]') as Element;
    const tiles = slots(canvasElement, "icon-tile");
    const tile = tiles[0] as HTMLElement;

    // 1.3.1: a list of terms and values, each number a div of one term and its values, and nothing else in it.
    await expect(group).toHaveAttribute("data-slot", "stat-group");
    await expect(all).toHaveLength(totals.length);
    for (const stat of all) {
      await expect(stat.tagName).toBe("DIV");
      await expect(stat.parentElement).toBe(group);
      await expect([...stat.children].map((child) => child.tagName)).toEqual([
        "DT",
        "DD",
        "DD",
      ]);
    }
    await expect(label.textContent).toBe(totals[0]?.name);
    // One box at a card's ring and corners, its boxes 20 px in, with a line between them.
    await expect(getComputedStyle(group).borderTopLeftRadius).toBe(
      cornerOf("var(--radius-xl)", canvasElement),
    );
    await expect([
      getComputedStyle(first).paddingTop,
      getComputedStyle(first).paddingInlineEnd,
    ]).toEqual([`${pad}px`, `${pad}px`]);
    await expect(
      getComputedStyle(all[1] as Element).borderInlineStartWidth,
    ).toBe(line);
    await expect(
      getComputedStyle(all[1] as Element).borderInlineStartColor,
    ).toBe(colourOf("var(--border)", canvasElement));
    // The label muted at 13/20, the value at 24/32 and 600, the note's change at its own size.
    const labelStyle = getComputedStyle(label);
    await expect([
      labelStyle.fontSize,
      labelStyle.lineHeight,
      labelStyle.color,
    ]).toEqual([
      "13px",
      "20px",
      colourOf("var(--muted-foreground)", canvasElement),
    ]);
    const amountStyle = getComputedStyle(amount);
    await expect([
      amountStyle.fontSize,
      amountStyle.lineHeight,
      amountStyle.fontWeight,
    ]).toEqual(["24px", "32px", "600"]);
    await expect(getComputedStyle(change).fontSize).toBe(
      getComputedStyle(note).fontSize,
    );
    await expect(getComputedStyle(note).fontSize).toBe("12px");
    // The tile: a solid circle of 48, the first gold, left of the label and the value, level with the label's top.
    await expect(tiles).toHaveLength(totals.length);
    await expect([box(tile).width, box(tile).height]).toEqual([
      tileSize,
      tileSize,
    ]);
    await expect(tile).toHaveAttribute("data-shape", "circle");
    await expect(tile).toHaveAttribute("data-variant", "gold");
    await expect(tiles[1] as HTMLElement).toHaveAttribute(
      "data-variant",
      "solid",
    );
    // 20 px from the group's edge, as the line at a box's start lies under the edge.
    await expect(Math.round(box(tile).left)).toBe(
      Math.round(box(group).left + pad),
    );
    await expect(Math.round(box(tile).top)).toBe(Math.round(box(label).top));
    for (const part of [label, value, note]) {
      await expect(Math.round(box(part).left)).toBe(
        Math.round(box(tile).right + tileGap),
      );
    }
  },
};

/**
 * With no icon, the label and the value start at the box's padding.
 */
export const NoIcon: Story = {
  render: () => <StatGroup>{stats({ withIcons: false })}</StatGroup>,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector("dl") as HTMLElement;

    await expect(slots(canvasElement, "icon-tile")).toHaveLength(0);
    await expect(
      Math.round(box(group.querySelector("dt") as Element).left),
    ).toBe(Math.round(box(group).left + pad));
  },
};

/**
 * Apart: with `spacing`, a box each, that far apart, each at a card's ring and corners.
 */
export const Spacing: Story = {
  tags: ["visual"],
  render: () => <StatGroup spacing={4}>{stats()}</StatGroup>,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector("dl") as HTMLElement;
    const [first, second] = slots(canvasElement, "stat") as [
      HTMLElement,
      HTMLElement,
    ];

    await expect(group).toHaveAttribute("data-spacing", "4");
    await expect(getComputedStyle(group).columnGap).toBe("16px");
    await expect(getComputedStyle(first).borderTopLeftRadius).toBe(
      cornerOf("var(--radius-xl)", canvasElement),
    );
    await expect(getComputedStyle(second).borderInlineStartWidth).toBe(none);
    await expect(getComputedStyle(first).backgroundColor).toBe(
      colourOf("var(--card)", canvasElement),
    );
  },
};

/**
 * Soft: `variant="muted"`, boxes at --muted with no ring.
 */
export const Muted: Story = {
  tags: ["visual"],
  render: () => (
    <StatGroup spacing={4} variant="muted">
      {stats()}
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const first = slots(canvasElement, "stat")[0] as HTMLElement;

    await expect(getComputedStyle(first).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(getComputedStyle(first).boxShadow).toBe("none");
  },
};

/**
 * No box: `variant="ghost"`, as in a card or a page's head, the text lined up with what is around it, and the tile at
 * the group's start. With no box there are no lines between, so its numbers stand 24 px apart unless a `spacing` is
 * given.
 */
export const Ghost: Story = {
  tags: ["visual"],
  render: () => <StatGroup variant="ghost">{stats()}</StatGroup>,
  play: async ({ canvasElement }) => {
    const group = canvasElement.querySelector("dl") as HTMLElement;
    const first = slots(canvasElement, "stat")[0] as HTMLElement;
    const tile = slots(canvasElement, "icon-tile")[0] as HTMLElement;

    await expect(getComputedStyle(group).columnGap).toBe("24px");
    await expect(getComputedStyle(first).borderInlineStartWidth).toBe(none);

    await expect(getComputedStyle(first).backgroundColor).toBe(
      "rgba(0, 0, 0, 0)",
    );
    await expect(getComputedStyle(first).boxShadow).toBe("none");
    await expect(Math.round(box(tile).left)).toBe(Math.round(box(group).left));
    await expect(Math.round(box(tile).top)).toBe(Math.round(box(group).top));
  },
};

/**
 * Its columns come from its own width, as shadcn's dashboard: one, two from 576 px, and all on one line from 1024. So
 * three across a wide space fill it, four in a middle one stand two and two, three there two and one, and four in a
 * narrow column one under the other; the lines between follow them.
 */
export const Columns: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="w-full">
        <StatGroup>{stats({ count: 3 })}</StatGroup>
      </div>
      <div className="w-full max-w-200">
        <StatGroup>{stats()}</StatGroup>
      </div>
      <div className="w-full max-w-160">
        <StatGroup>{stats({ count: 3 })}</StatGroup>
      </div>
      <div className="w-full max-w-72">
        <StatGroup>{stats()}</StatGroup>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [wide, four, three, narrow] = [
      ...canvasElement.querySelectorAll("dl"),
    ] as HTMLElement[] as [HTMLElement, HTMLElement, HTMLElement, HTMLElement];
    const lines = (group: HTMLElement) =>
      [...group.children].map((stat) => Math.round(box(stat).top));

    // Wide: three on one line, which fill it.
    await expect(new Set(lines(wide)).size).toBe(1);
    await expect(Math.round(box(wide.lastElementChild as Element).right)).toBe(
      Math.round(box(wide).right),
    );
    // Middle: four two and two, three two and one, the group behind the empty place at the card's colour.
    const [a, b, c, d] = lines(four);
    await expect([a === b, b === c, c === d]).toEqual([true, false, true]);
    await expect(new Set(lines(three)).size).toBe(2);
    await expect(getComputedStyle(three).backgroundColor).toBe(
      colourOf("var(--card)", canvasElement),
    );
    await expect(
      getComputedStyle(three.children[2] as Element).borderTopWidth,
    ).toBe(line);
    // Narrow: one a line, and no value cut.
    await expect(new Set(lines(narrow)).size).toBe(totals.length);
    for (const amount of narrow.querySelectorAll('[data-slot="amount"]')) {
      await expect(Math.round(box(amount).right)).toBeLessThanOrEqual(
        Math.round(box(narrow).right - pad),
      );
    }
  },
};

const plain = "3 accounts";

/**
 * The value's size goes to what is in it, an amount or plain text, at 24/32 and 600; a size given by hand wins, as an
 * amount at the text's weight.
 */
export const ValueSize: Story = {
  tags: ["!autodocs"],
  render: () => (
    <StatGroup>
      <Stat>
        <StatLabel>{totals[0]?.name}</StatLabel>
        <StatValue>
          <Amount size="default" value={totals[0]?.amount ?? null} />
        </StatValue>
      </Stat>
      <Stat>
        <StatLabel>{totals[1]?.name}</StatLabel>
        <StatValue>{plain}</StatValue>
      </Stat>
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const amount = canvasElement.querySelector(
      '[data-slot="amount"]',
    ) as Element;
    const text = getComputedStyle(within(canvasElement).getByText(plain));

    await expect(getComputedStyle(amount).fontWeight).toBe("500");
    await expect([text.fontSize, text.lineHeight, text.fontWeight]).toEqual([
      "24px",
      "32px",
      "600",
    ]);
  },
};

/**
 * An action beside the label: a quiet icon button of 32 px, written in the label, whose name joins the app's one word
 * to the label, as "Open Invested", and which takes no more height than the label's line, so a number with one is as
 * tall as one without.
 */
export const Action: Story = {
  render: () => (
    <StatGroup>
      {totals.slice(2).map(({ name, amount }, index) => (
        <Stat key={name}>
          <StatLabel>
            {name}
            {index === 1 ? (
              <StatAction aria-label={open}>
                <ChevronRightIcon aria-hidden={true} />
              </StatAction>
            ) : null}
          </StatLabel>
          <StatValue>
            <Amount value={amount} />
          </StatValue>
        </Stat>
      ))}
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: `${open} ${totals[3]?.name}`,
    });
    const [without, withAction] = slots(canvasElement, "stat") as [
      HTMLElement,
      HTMLElement,
    ];
    const label = withAction.querySelector("dt") as Element;

    await expect(canvas.getAllByRole("button")).toHaveLength(1);
    await expect(label.contains(button)).toBe(true);
    await expect([box(button).width, box(button).height]).toEqual([32, 32]);
    // At the label's end.
    await expect(Math.round(box(button).right)).toBe(
      Math.round(box(withAction).right - pad),
    );
    await expect(box(withAction).height).toBe(box(without).height);
  },
};

/**
 * An action in a number with no label says so, as its name could not say which number it opens.
 */
export const ActionWithoutLabel: Story = {
  tags: ["!autodocs"],
  render: () => (
    <Caught>
      <StatGroup>
        <Stat>
          <StatValue>
            <Amount value={totals[0]?.amount ?? null} />
            <StatAction aria-label={open}>
              <ChevronRightIcon aria-hidden={true} />
            </StatAction>
          </StatValue>
        </Stat>
      </StatGroup>
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        `StatAction: "${open}" needs its stat labelled by StatLabel.`,
      ),
    ).toBeVisible();
  },
};

/**
 * Loading the first time: the labels stay, and a shape that a screen reader skips takes each value's place. The
 * group is busy, and the app's words are heard.
 */
export const FirstLoad: Story = {
  tags: ["visual"],
  render: () => (
    <StatGroup isLoading={true} loadingLabel={loadingLabel}>
      {totals.map(({ name }, index) => {
        const Icon = icons[index] as typeof WalletIcon;
        return (
          <Stat key={name}>
            <StatLabel>
              <IconTile variant={index === 0 ? "gold" : undefined}>
                <Icon aria-hidden={true} />
              </IconTile>
              {name}
            </StatLabel>
            <StatValue />
          </Stat>
        );
      })}
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvasElement.querySelector("dl") as HTMLElement;
    const values = slots(canvasElement, "stat-value");
    const shape = (values[0] as Element).firstElementChild as HTMLElement;

    await expect(group).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getByRole("status")).toHaveTextContent(loadingLabel);
    await expect(canvas.getByText(totals[0]?.name ?? "")).toBeVisible();
    await expect(shape).toHaveAttribute("data-slot", "skeleton");
    await expect(shape.closest("[aria-hidden=true]")).not.toBeNull();
    // As tall as a value's line.
    await expect(box(shape).height).toBe(32);
  },
};

/**
 * Loading again: the values stay as they are, while the group is busy and the app's words are heard.
 */
export const Reloading: Story = {
  render: () => (
    <StatGroup isLoading={true} loadingLabel={loadingLabel}>
      {stats()}
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvasElement.querySelector("dl")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(canvas.getByRole("status")).toHaveTextContent(loadingLabel);
    await expect(slots(canvasElement, "amount")).toHaveLength(totals.length);
    await expect(slots(canvasElement, "skeleton")).toHaveLength(0);
  },
};

/**
 * Loading ended: the group is no longer busy, and nothing is said.
 */
export const NotLoading: Story = {
  tags: ["!autodocs"],
  render: () => (
    <StatGroup isLoading={false} loadingLabel={loadingLabel}>
      {stats()}
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector("dl")).not.toHaveAttribute(
      "aria-busy",
    );
    await expect(within(canvasElement).getByRole("status")).toHaveTextContent(
      "",
    );
  },
};

const longLabel =
  "Invested across every fictitious broker and fund the household keeps";

/**
 * A long label wraps beside its icon, and is never cut.
 */
export const LongLabel: Story = {
  tags: ["!autodocs"],
  render: () => (
    <div className="w-72">
      <StatGroup>
        <Stat>
          <StatLabel>
            <IconTile>
              <TrendingUpIcon aria-hidden={true} />
            </IconTile>
            {longLabel}
          </StatLabel>
          <StatValue>
            <Amount value={totals[3]?.amount ?? null} />
          </StatValue>
        </Stat>
      </StatGroup>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector("dt") as HTMLElement;

    await expect(box(label).height).toBeGreaterThan(20);
    await expect(label.scrollWidth).toBe(label.clientWidth);
  },
};

export default meta;
