import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { expect, within } from "storybook/test";
import {
  contributions,
  longEvents,
  refund,
  resentTransfer,
  transferHistory,
} from "../../.storybook/data.js";
import { Amount } from "./amount.js";
import { Card, CardContent, CardHeader, CardTitle } from "./card.js";
import { DateTime } from "./date-time.js";
import { Link } from "./link.js";
import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "./timeline.js";

// What the guidelines give it: 16 px between events, an 8 px dot, filled but when expected, and a line between dots.
const between = 16;
const dotSize = 8;
const filled = "4px";
const ring = "1px";
const dot = '[data-slot="timeline-dot"]';
const line = '[data-slot="timeline-line"]';
const cardTitle = "Contributions";
const expectedOn = "Expected on";

function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function itemsOf(canvas: HTMLElement): HTMLElement[] {
  return [...(canvas.querySelector("ol")?.children ?? [])] as HTMLElement[];
}

// Whether an item draws a line on to the next one.
function lineOf(item: Element): HTMLElement | null {
  const found = item.querySelector<HTMLElement>(line);
  return found && getComputedStyle(found).display !== "none" ? found : null;
}

function moment(at: string) {
  return <DateTime showTime={true} timeZone="UTC" value={at} />;
}

function transfer() {
  return (
    <>
      {transferHistory.events.map((event) => (
        <TimelineItem key={event.id}>
          <TimelineTitle>{event.title}</TimelineTitle>
          <TimelineTime>{moment(event.at)}</TimelineTime>
        </TimelineItem>
      ))}
      <TimelineItem isExpected={true}>
        <TimelineTitle>{transferHistory.expected.title}</TimelineTitle>
        <TimelineTime>
          {expectedOn} <DateTime value={transferHistory.expected.on} />
        </TimelineTime>
      </TimelineItem>
    </>
  );
}

const meta = {
  title: "Components/Display & Media/Timeline",
  component: Timeline,
  args: { children: transfer() },
} satisfies Meta<typeof Timeline>;

type Story = StoryObj<typeof meta>;

// A transfer's history, oldest first, its credit expected at the end: a hollow dot, a muted title, a dashed line.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className="max-w-96 p-6">
      <Timeline {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector("ol");
    const items = itemsOf(canvasElement);
    const [first, second, third, last] = items;
    const firstDot = first?.querySelector(dot) as HTMLElement;
    const lastDot = last?.querySelector(dot) as HTMLElement;
    const firstTime = first?.querySelector("time") as HTMLElement;
    const lastTitle = within(last as HTMLElement).getByText(
      transferHistory.expected.title,
    );

    await expect(list).not.toBeNull();
    await expect(items).toHaveLength(transferHistory.events.length + 1);
    for (const item of items) {
      await expect(item.tagName).toBe("LI");
    }
    await expect(firstTime).toHaveAttribute(
      "datetime",
      transferHistory.events[0]?.at,
    );
    await expect(
      (second?.getBoundingClientRect().top ?? 0) -
        (
          firstTime.closest('[data-slot="timeline-time"]') as HTMLElement
        ).getBoundingClientRect().bottom,
    ).toBe(between);

    await expect(firstDot.getBoundingClientRect().width).toBe(dotSize);
    await expect(firstDot.getBoundingClientRect().height).toBe(dotSize);
    await expect(getComputedStyle(firstDot).borderTopWidth).toBe(filled);
    await expect(getComputedStyle(firstDot).borderTopColor).toBe(
      colourOf("var(--muted-foreground)", canvasElement),
    );
    await expect(getComputedStyle(lastDot).borderTopWidth).toBe(ring);
    await expect(getComputedStyle(lastTitle).color).toBe(
      colourOf("var(--muted-foreground)", canvasElement),
    );

    await expect(lineOf(first as HTMLElement)).not.toBeNull();
    await expect(
      getComputedStyle(lineOf(first as HTMLElement) as HTMLElement)
        .borderLeftStyle,
    ).toBe("solid");
    await expect(
      getComputedStyle(lineOf(third as HTMLElement) as HTMLElement)
        .borderLeftStyle,
    ).toBe("dashed");
    await expect(lineOf(last as HTMLElement)).toBeNull();

    const nextDot = second?.querySelector(dot) as HTMLElement;
    const reach =
      nextDot.getBoundingClientRect().top -
      (lineOf(first as HTMLElement)?.getBoundingClientRect().bottom ?? 0);
    await expect(reach).toBeGreaterThanOrEqual(0);
    await expect(reach).toBeLessThanOrEqual(dotSize);
  },
};

// What an event means, in its dot's colour, which its words say too: a refusal, sent again and credited.
const Meanings: Story = {
  tags: ["visual"],
  args: {
    children: resentTransfer.map((event) => (
      <TimelineItem
        key={event.id}
        variant={"meaning" in event ? event.meaning : "default"}
      >
        <TimelineTitle>{event.title}</TimelineTitle>
        <TimelineTime>{moment(event.at)}</TimelineTime>
      </TimelineItem>
    )),
  },
  render: (args) => (
    <div className="max-w-96 p-6">
      <Timeline {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const colours = itemsOf(canvasElement).map(
      (item) =>
        getComputedStyle(item.querySelector(dot) as HTMLElement).borderTopColor,
    );

    await expect(colours).toEqual(
      [
        "var(--muted-foreground)",
        "var(--destructive)",
        "var(--muted-foreground)",
        "var(--success)",
      ].map((value) => colourOf(value, canvasElement)),
    );
  },
};

// A refund, its amounts in the text, and a description under one event, muted.
const WithDetails: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <TimelineItem>
          <TimelineTitle>
            Payment of <Amount value={refund.paid} />
          </TimelineTitle>
          <TimelineTime>{moment(refund.events.paid)}</TimelineTime>
        </TimelineItem>
        <TimelineItem>
          <TimelineTitle>
            Partial refund of <Amount value={refund.refunded} />
          </TimelineTitle>
          <TimelineTime>{moment(refund.events.refunded)}</TimelineTime>
          <TimelineDescription>By {refund.by}</TimelineDescription>
        </TimelineItem>
        <TimelineItem variant="success">
          <TimelineTitle>Refund completed</TimelineTitle>
          <TimelineTime>{moment(refund.events.done)}</TimelineTime>
        </TimelineItem>
      </>
    ),
  },
  render: (args) => (
    <div className="max-w-96 p-6">
      <Timeline {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const description = within(canvasElement).getByText(`By ${refund.by}`);
    const time = description.previousElementSibling as HTMLElement;

    await expect(time.querySelector("time")).not.toBeNull();
    await expect(getComputedStyle(description).color).toBe(
      colourOf("var(--muted-foreground)", canvasElement),
    );
  },
};

// In a card, the last events, named by the card's title, and a link to the whole history.
const InCard: Story = {
  tags: ["visual"],
  render: function Render() {
    const titleId = useId();
    return (
      <Card className="max-w-96">
        <CardHeader>
          <CardTitle id={titleId}>{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Timeline aria-labelledby={titleId}>
            {contributions.made.map((made) => (
              <TimelineItem key={made.id}>
                <TimelineTitle>Monthly contribution</TimelineTitle>
                <TimelineTime>{moment(made.at)}</TimelineTime>
              </TimelineItem>
            ))}
            <TimelineItem isExpected={true}>
              <TimelineTitle>Monthly contribution</TimelineTitle>
              <TimelineTime>
                {expectedOn} <DateTime value={contributions.next} />
              </TimelineTime>
            </TimelineItem>
          </Timeline>
          <Link href="#contributions">
            See all {contributions.count} events
          </Link>
        </CardContent>
      </Card>
    );
  },
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole("list", { name: cardTitle });

    await expect(within(list).getAllByRole("listitem")).toHaveLength(
      contributions.made.length + 1,
    );
  },
};

// Narrower than a phone, titles wrap onto more lines, each dot by its title's first line.
const Narrow: Story = {
  tags: ["visual"],
  args: {
    children: longEvents.map((event) => (
      <TimelineItem key={event.id}>
        <TimelineTitle>{event.title}</TimelineTitle>
        <TimelineTime>{moment(event.at)}</TimelineTime>
      </TimelineItem>
    )),
  },
  render: (args) => (
    <div className="w-60 p-6">
      <Timeline {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [first] = itemsOf(canvasElement);
    const title = within(first as HTMLElement).getByText(
      longEvents[0]?.title ?? "",
    );
    const { lineHeight } = getComputedStyle(title);
    const titleBox = title.getBoundingClientRect();
    const dotBox = (
      (first as HTMLElement).querySelector(dot) as HTMLElement
    ).getBoundingClientRect();

    await expect(titleBox.height).toBeGreaterThan(
      Number.parseFloat(lineHeight) * 2,
    );
    await expect(dotBox.top).toBeGreaterThanOrEqual(titleBox.top);
    await expect(dotBox.bottom).toBeLessThanOrEqual(
      titleBox.top + Number.parseFloat(lineHeight),
    );
  },
};

export default meta;
export { Default, InCard, Meanings, Narrow, WithDetails };
