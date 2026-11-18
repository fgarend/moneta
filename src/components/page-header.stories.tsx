import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Avatar, AvatarFallback } from "./avatar.js";
import { Badge } from "./badge.js";
import { Button } from "./button.js";
import {
  PageAction,
  PageContext,
  PageDescription,
  PageHeader,
  PageTitle,
} from "./page-header.js";

const title = "Portfolio";
const description =
  "Everything a fictitious household holds, by account and by asset, at yesterday's close, with what each one earned.";
const action = "New operation";
const exportAction = "Export";
const scope = "Fictitious household";
const company = "Fictitious Energy";
const state = "Active";
const loading = "Loading the company";
const longTitle =
  "Every fictitious account the household holds for the long term, by its institution";

// What the guidelines give a page's head: a title at 32/40, a description at 14/24, 8 px under it, the context 12 px
// above, a mark at 40 px, and actions under the description below 384 px of the header's width.
const titleSize = "32px";
const titleLine = "40px";
const descriptionLine = "24px";
const toDescription = 8;
const toTitle = 12;
const mark = 40;
const shape = 40;

function edges(element: Element): DOMRect {
  return element.getBoundingClientRect();
}

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
  const { width } = probe.getBoundingClientRect();
  probe.remove();
  return width;
}

const meta = {
  title: "Components/Layout & Navigation/Page Header",
  component: PageHeader,
  args: {
    children: (
      <>
        <PageTitle>{title}</PageTitle>
        <PageDescription>{description}</PageDescription>
        <PageAction>
          <Button variant="outline">{exportAction}</Button>
          <Button variant="gold">{action}</Button>
        </PageAction>
      </>
    ),
  },
} satisfies Meta<typeof PageHeader>;

type Story = StoryObj<typeof meta>;

// The page's one heading of level 1, at 32/40, its description muted at 14/24 and 65 characters at most, 8 px under
// it, and its actions at the end.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 1, name: title });
    const text = canvas.getByText(description);
    const button = canvas.getByRole("button", { name: action });

    await expect(getComputedStyle(heading).fontSize).toBe(titleSize);
    await expect(getComputedStyle(heading).lineHeight).toBe(titleLine);
    await expect(text.tagName).toBe("P");
    await expect(getComputedStyle(text).lineHeight).toBe(descriptionLine);
    await expect(getComputedStyle(text).color).toBe(
      colourOf("var(--muted-foreground)", canvasElement),
    );
    await expect(edges(text).width).toBeLessThanOrEqual(
      Math.ceil(measureOf(text)),
    );
    await expect(edges(text).top - edges(heading).bottom).toBe(toDescription);
    await expect(edges(button).left).toBeGreaterThan(edges(text).right);
  },
};

// What scopes the page, above the title, 12 px over it.
const WithContext: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <PageContext>
          <Button size="sm" variant="outline">
            {scope}
          </Button>
        </PageContext>
        <PageTitle>{title}</PageTitle>
        <PageDescription>{description}</PageDescription>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole("heading", { level: 1 });
    const context = canvas.getByRole("button", { name: scope });

    await expect(edges(heading).top - edges(context).bottom).toBe(toTitle);
  },
};

// A company's page: its logo before the name, 40 px and hidden from screen readers, and its state after, heard in the
// heading.
const WithMark: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <PageTitle>
          <Avatar>
            <AvatarFallback>FE</AvatarFallback>
          </Avatar>
          {company}
          <Badge variant="success">{state}</Badge>
        </PageTitle>
        <PageDescription>{description}</PageDescription>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading", {
      level: 1,
      name: `${company} ${state}`,
    });
    const avatar = heading.querySelector('[data-slot="avatar"]') as Element;

    await expect(edges(avatar).width).toBe(mark);
    await expect(edges(avatar).height).toBe(mark);
  },
};

// In a narrow place, the actions go under the description and wrap, and nothing overflows.
const Narrow: Story = {
  tags: ["visual"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector(
      '[data-slot="page-header"]',
    ) as Element;

    await expect(header.scrollWidth).toBe(header.clientWidth);
    await expect(
      edges(canvas.getByRole("button", { name: exportAction })).top,
    ).toBeGreaterThanOrEqual(edges(canvas.getByText(description)).bottom);
  },
};

// While its title loads, the heading holds the app's words for screen readers, and a shape of a line they skip stands
// in its place, beside it, as a heading holds no block.
const Loading: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <PageTitle isLoading={true} loadingLabel={loading}>
          {undefined}
        </PageTitle>
        <PageDescription>{description}</PageDescription>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const heading = within(canvasElement).getByRole("heading", {
      level: 1,
      name: loading,
    });
    const placeholder = canvasElement.querySelector(
      '[data-slot="skeleton"]',
    ) as Element;

    await expect(heading).toHaveClass("sr-only");
    await expect(placeholder).toHaveAttribute("aria-hidden", "true");
    await expect(edges(placeholder).height).toBe(shape);
  },
};

// A title longer than its place wraps, at the narrowest screen.
const LongTitle: Story = {
  tags: ["visual"],
  args: {
    children: (
      <>
        <PageTitle>{longTitle}</PageTitle>
        <PageDescription>{description}</PageDescription>
      </>
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
    const heading = within(canvasElement).getByRole("heading", { level: 1 });

    await expect(heading.scrollWidth).toBe(heading.clientWidth);
    await expect(edges(heading).height).toBeGreaterThan(
      Number.parseInt(titleLine, 10),
    );
  },
};

export default meta;
export { Default, Loading, LongTitle, Narrow, WithContext, WithMark };
