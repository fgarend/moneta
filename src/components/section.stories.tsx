import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
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

export default meta;
export { Deep, Default, LevelByHand, Narrow, Nested, TitleOnly };
