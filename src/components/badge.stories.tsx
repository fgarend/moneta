import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  CalendarIcon,
  CheckIcon,
  CircleAlertIcon,
  ClockIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { expect, within } from "storybook/test";
import { Badge } from "./badge.js";

const emphasis = "New";
const kind = "Expense";
const quiet = "Reviewed";
const long = "Asset and issuer will be created";

// What the guidelines give it: a line of 20 px, its corners the theme's `xl`, about 10 px, and an icon of 12.
const lineHeight = 20;
const iconSize = 12;

// The corners a value of the theme resolves to.
function cornerOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.borderTopLeftRadius = value;
  near.append(probe);
  const { borderTopLeftRadius } = getComputedStyle(probe);
  probe.remove();
  return borderTopLeftRadius;
}

// The colour a value of the theme resolves to where the badge sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function backgroundOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

const meta = {
  title: "Components/Feedback & Status/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: { children: emphasis },
} satisfies Meta<typeof Badge>;

type Story = StoryObj<typeof meta>;

/**
 * Its usual look, dark and filled, for the one thing on a screen that should stand out, as a new holding.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText(emphasis);

    await expect(badge).toHaveAttribute("data-variant", "default");
    await expect(getComputedStyle(badge).backgroundColor).toBe(
      backgroundOf("var(--primary)", canvasElement),
    );
    await expect(badge.getBoundingClientRect().height).toBe(lineHeight);
    await expect(getComputedStyle(badge).borderTopLeftRadius).toBe(
      cornerOf("var(--radius-xl)", canvasElement),
    );
  },
};

/**
 * A kind, its word alone: `secondary` for a common label, as an expense, and `outline` for a quiet one. A kind's
 * category shows on the row's IconTile, not here.
 */
export const Kinds: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{kind}</Badge>
      <Badge variant="outline">{quiet}</Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(getComputedStyle(canvas.getByText(kind)).backgroundColor).toBe(
      backgroundOf("var(--secondary)", canvasElement),
    );
    await expect(getComputedStyle(canvas.getByText(quiet)).borderTopColor).toBe(
      colourOf("var(--border)", canvasElement),
    );
  },
};

// The states, each its meaning, its word and an icon of its own shape.
const states = [
  ["success", "Paid", CheckIcon],
  ["warning", "Due tomorrow", ClockIcon],
  ["destructive", "Overdue", CircleAlertIcon],
  ["info", "Scheduled", CalendarIcon],
] as const;

/**
 * A state: its meaning's colour, its word, and an icon whose shape says it without colour, as a check for paid and a
 * clock for due, written before the word with `data-icon="inline-start"`. The icon is hidden from screen readers, as
 * the word says it.
 */
export const States: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-wrap gap-2 p-6">
      {states.map(([variant, words, Icon]) => (
        <Badge key={variant} variant={variant}>
          <Icon data-icon="inline-start" />
          {words}
        </Badge>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // A colour of its own, not the page's text, which a missing token would leave.
    const plain = colourOf("var(--foreground)", canvasElement);
    for (const [variant, words] of states) {
      const badge = within(canvasElement).getByText(words);
      const icon = badge.querySelector("svg") as SVGElement;
      await expect(getComputedStyle(badge).color).toBe(
        colourOf(`var(--${variant})`, canvasElement),
      );
      await expect(getComputedStyle(badge).color).not.toBe(plain);
      await expect(getComputedStyle(badge).backgroundColor).not.toBe(
        "rgba(0, 0, 0, 0)",
      );
      await expect(icon).toHaveAttribute("aria-hidden", "true");
      await expect(icon.getBoundingClientRect().width).toBe(iconSize);
      // Read as its word alone, the icon adding nothing.
      await expect(badge.textContent).toBe(words);
    }
  },
};

/**
 * Words that do not fit wrap, line under line, and none is cut; the corners stay the same. A badge holds one or two
 * words, so this is a corner, not a use.
 */
export const LongText: Story = {
  tags: ["!autodocs"],
  render: () => (
    <div className="w-40">
      <Badge variant="warning">
        <TriangleAlertIcon data-icon="inline-start" />
        {long}
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = within(canvasElement).getByText(long);
    const column = badge.parentElement as HTMLElement;

    await expect(badge.getBoundingClientRect().height).toBeGreaterThan(
      lineHeight,
    );
    await expect(
      Math.round(badge.getBoundingClientRect().right),
    ).toBeLessThanOrEqual(Math.round(column.getBoundingClientRect().right));
    await expect(badge.scrollWidth).toBe(badge.clientWidth);
    await expect(getComputedStyle(badge).borderTopLeftRadius).toBe(
      cornerOf("var(--radius-xl)", canvasElement),
    );
  },
};

export default meta;
