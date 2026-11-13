import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import { Card, CardContent } from "./card.js";
import {
  Section,
  SectionAction,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "./section.js";

const title = "Fictitious savings";
const description = "Three accounts, updated today";
const action = "Add account";
const content = "Balance 1,250.00";
const inner = "Fictitious goals";
const longTitle =
  "Every fictitious account held for the long term, with what each one earned this year";

// The scale of text and space the guidelines give a section.
const titleSize = "18px";
const titleLine = "24px";
const titleWeight = "600";
const toDescription = 4;
const toContent = 16;
// What sits beside a title, and between an action's controls: 8 px, as the guidelines give a row.
const between = 8;
const count = "12";
const actions = ["Group by class", "Group by account", "Export as a sheet"];

function rowOf(element: Element): {
  left: number;
  right: number;
  top: number;
  bottom: number;
} {
  const { left, right, top, bottom } = element.getBoundingClientRect();
  return { left, right, top, bottom };
}

// Where a text ends, as its own box, not its parent's.
function textEnd(element: Element): number {
  const range = document.createRange();
  range.selectNodeContents(element.firstChild as Node);
  return range.getBoundingClientRect().right;
}

function gapBetween(above: Element, below: Element): number {
  return (
    below.getBoundingClientRect().top - above.getBoundingClientRect().bottom
  );
}

const meta = {
  title: "Components/Layout & Navigation/Section",
  component: Section,
  args: {
    children: (
      <>
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
          <SectionDescription>{description}</SectionDescription>
          <SectionAction>
            <Button variant="outline">{action}</Button>
          </SectionAction>
        </SectionHeader>
        <Card>
          <CardContent>{content}</CardContent>
        </Card>
      </>
    ),
  },
} satisfies Meta<typeof Section>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { name: title });

    // Outside any section, a title starts at 2, below the page's 1.
    await expect(heading.tagName).toBe("H2");
    // No landmark: a page of sections would fill the list of landmarks.
    await expect(canvas.queryByRole("region")).toBeNull();
    const { fontSize, lineHeight, fontWeight } = getComputedStyle(heading);
    await expect([fontSize, lineHeight, fontWeight]).toEqual([
      titleSize,
      titleLine,
      titleWeight,
    ]);
    await expect(gapBetween(heading, canvas.getByText(description))).toBe(
      toDescription,
    );
    await expect(
      gapBetween(
        canvasElement.querySelector('[data-slot="section-header"]') as Element,
        canvasElement.querySelector('[data-slot="card"]') as Element,
      ),
    ).toBe(toContent);
    // The action sits at the right of the title.
    const button = canvas.getByRole("button", { name: action });
    await expect(button.getBoundingClientRect().left).toBeGreaterThan(
      heading.getBoundingClientRect().right,
    );
  },
};

// A title alone, with no description or action.
const TitleOnly: Story = {
  args: {
    children: (
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
      </SectionHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: title })).toBeVisible();
  },
};

// A section in a section, its title one level below.
const Nested: Story = {
  args: {
    children: (
      <>
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
        <Section>
          <SectionHeader>
            <SectionTitle>{inner}</SectionTitle>
          </SectionHeader>
        </Section>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: title }).tagName).toBe(
      "H2",
    );
    await expect(canvas.getByRole("heading", { name: inner }).tagName).toBe(
      "H3",
    );
  },
};

// A level given by hand wins over the one from where it sits.
const LevelByHand: Story = {
  args: {
    children: (
      <SectionHeader>
        <SectionTitle level={4}>{title}</SectionTitle>
      </SectionHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: title }).tagName).toBe(
      "H4",
    );
  },
};

// HTML stops at h6, however deep sections go.
const Deep: Story = {
  args: {
    children: (
      <Section>
        <Section>
          <Section>
            <Section>
              <Section>
                <Section>
                  <SectionHeader>
                    <SectionTitle>{inner}</SectionTitle>
                  </SectionHeader>
                </Section>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("heading", { name: inner }).tagName).toBe(
      "H6",
    );
  },
};

// On a narrow screen, a long title wraps and the action moves under it.
const Narrow: Story = {
  args: {
    children: (
      <SectionHeader>
        <SectionTitle>{longTitle}</SectionTitle>
        <SectionDescription>{description}</SectionDescription>
        <SectionAction>
          <Button variant="outline">{action}</Button>
        </SectionAction>
      </SectionHeader>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const section = canvasElement.querySelector(
      '[data-slot="section"]',
    ) as Element;

    await expect(section.scrollWidth).toBe(section.clientWidth);
    await expect(
      canvas.getByRole("button", { name: action }).getBoundingClientRect().top,
    ).toBeGreaterThanOrEqual(
      canvas.getByText(description).getBoundingClientRect().bottom,
    );
  },
};

// A count beside the title, read inside its heading, 8 px after its words and centred on their line.
const TitleWithCount: Story = {
  tags: ["visual"],
  args: {
    children: (
      <SectionHeader>
        <SectionTitle>
          {title}
          <Badge variant="secondary">{count}</Badge>
        </SectionTitle>
      </SectionHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading");
    const badge = within(heading).getByText(count);
    const words = rowOf(heading);
    const mark = rowOf(badge);

    await expect(Math.round(mark.left - textEnd(heading))).toBe(between);
    await expect(
      Math.round((mark.top + mark.bottom) / 2 - (words.top + words.bottom) / 2),
    ).toBe(0);
  },
};

// Several controls in a section's action lie in a row, 8 px apart, centred on one another.
const SeveralActions: Story = {
  tags: ["visual"],
  args: {
    children: (
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <SectionDescription>{description}</SectionDescription>
        <SectionAction>
          <Button size="sm" variant="outline">
            {actions[0]}
          </Button>
          <Button variant="outline">{actions[2]}</Button>
        </SectionAction>
      </SectionHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = [actions[0], actions[2]].map((name) =>
      rowOf(canvas.getByRole("button", { name })),
    ) as [ReturnType<typeof rowOf>, ReturnType<typeof rowOf>];

    await expect(Math.round(second.left - first.right)).toBe(between);
    await expect(
      Math.round(
        (first.top + first.bottom) / 2 - (second.top + second.bottom) / 2,
      ),
    ).toBe(0);
  },
};

// On a phone, the controls that do not fit go to a next row, 8 px below, and nothing runs off the screen.
const SeveralActionsNarrow: Story = {
  globals: { viewport: { value: "mobile1" } },
  args: {
    children: (
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <SectionAction>
          {actions.map((name) => (
            <Button key={name} variant="outline">
              {name}
            </Button>
          ))}
        </SectionAction>
      </SectionHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = actions.map((name) =>
      rowOf(canvas.getByRole("button", { name })),
    );
    const section = canvasElement.querySelector(
      '[data-slot="section"]',
    ) as Element;
    const last = buttons.at(-1) as ReturnType<typeof rowOf>;
    const first = buttons[0] as ReturnType<typeof rowOf>;

    await expect(section.scrollWidth).toBe(section.clientWidth);
    await expect(last.top).toBeGreaterThan(first.top);
    await expect(Math.round(last.top - first.bottom)).toBe(between);
  },
};

export default meta;
export {
  Deep,
  Default,
  LevelByHand,
  Narrow,
  Nested,
  SeveralActions,
  SeveralActionsNarrow,
  TitleOnly,
  TitleWithCount,
};
