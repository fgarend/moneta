import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import { Text } from "./text.js";

// What the guidelines give it: a paragraph at 14/24 in the text's colour, 65 characters at most, and a note at 14/20,
// muted, with no limit; neither with a margin of its own.
const paragraph = { lineHeight: "24px" };
const note = { lineHeight: "20px" };
const fetched =
  "The latest fetch ran on Nov 17 at 08:00 and brought 1,240 quotes from two fictitious sources, each checked against the day before.";
const daily = "Instruments and companies are fetched once a day.";
const noQuote = "No quote for this day.";
const cardTitle = "Market data";
const longWord =
  "Statements arrive at https://statements.example.com/fictitious-household/2026/november/card-1234/final-statement-of-the-month.pdf";

function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// The width of 65 of the font's zeros, as Tailwind's max-w-prose is 65ch.
function measureOf(element: HTMLElement): number {
  const probe = document.createElement("span");
  probe.style.width = "65ch";
  probe.style.display = "inline-block";
  element.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

const meta = {
  title: "Components/Display & Media/Text",
  component: Text,
  args: { children: fetched },
} satisfies Meta<typeof Text>;

type Story = StoryObj<typeof meta>;

// The app's own sentences, a paragraph at 14/24 in the text's colour, with no margin.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className="p-6">
      <Text {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const element = within(canvasElement).getByText(fetched);
    const style = getComputedStyle(element);

    await expect(element.tagName).toBe("P");
    await expect(style.lineHeight).toBe(paragraph.lineHeight);
    await expect(style.fontSize).toBe("14px");
    await expect(style.color).toBe(
      colourOf("var(--foreground)", canvasElement),
    );
    await expect(style.marginTop).toBe("0px");
    await expect(style.marginBottom).toBe("0px");
  },
};

// A muted line in the place of something that did not come, at 14/20.
const Note: Story = {
  tags: ["visual"],
  args: { children: noQuote, variant: "note" },
  render: (args) => (
    <div className="p-6">
      <Text {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const element = within(canvasElement).getByText(noQuote);
    const style = getComputedStyle(element);

    await expect(element.tagName).toBe("P");
    await expect(style.lineHeight).toBe(note.lineHeight);
    await expect(style.color).toBe(
      colourOf("var(--muted-foreground)", canvasElement),
    );
  },
};

// In a card, two paragraphs 12 px apart, as the card's content lays them, and a note.
const InCard: Story = {
  tags: ["visual"],
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <Text>{fetched}</Text>
        <Text>{daily}</Text>
        <Text variant="note">{noQuote}</Text>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const first = within(canvasElement).getByText(fetched);
    const second = within(canvasElement).getByText(daily);

    await expect(
      second.getBoundingClientRect().top - first.getBoundingClientRect().bottom,
    ).toBe(12);
  },
};

// Across a wide place, a paragraph stops at 65 characters and a note does not.
const Wide: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex w-full max-w-5xl flex-col gap-4 p-6">
      <Text>{fetched}</Text>
      <Text variant="note">
        {daily} {fetched}
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [first, second] = [
      ...canvasElement.querySelectorAll<HTMLElement>("p"),
    ];
    const measure = measureOf(first as HTMLElement);

    await expect(first?.getBoundingClientRect().width).toBeLessThanOrEqual(
      Math.ceil(measure),
    );
    await expect(second?.getBoundingClientRect().width).toBeGreaterThan(
      measure,
    );
  },
};

// A word longer than its place, as an address, breaks rather than overflows.
const LongWord: Story = {
  tags: ["visual"],
  args: { children: longWord },
  render: (args) => (
    <div className="w-60 p-6">
      <Text {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const element = within(canvasElement).getByText(longWord);

    await expect(element.tagName).toBe("P");
    await expect(element.scrollWidth).toBe(element.clientWidth);
  },
};

export default meta;
export { Default, InCard, LongWord, Note, Wide };
