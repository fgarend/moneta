import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
} from "./pagination.js";

const name = "Pages of payments";
const previous = "Previous";
const next = "Next";
const summary = "15–28 of 142";
const pages = ["1", "2", "3"];
const lastPage = "11";
const current = "2";
const dimmed = "0.5";

// The colour a value of the theme resolves to where the pagination sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// The pages around the current one, as the guidelines ask an app to draw them: the first, the last, the current and
// one on each side, with a gap between.
function links(page = current, withSummary = true) {
  return (
    <>
      {withSummary ? <PaginationSummary>{summary}</PaginationSummary> : null}
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${Number(page) - 1}`}
            isDisabled={page === "1"}
          >
            {previous}
          </PaginationPrevious>
        </PaginationItem>
        {pages.map((number) => (
          <PaginationItem key={number}>
            <PaginationLink href={`?page=${number}`} isActive={number === page}>
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href={`?page=${lastPage}`}>{lastPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`?page=${Number(page) + 1}`}>
            {next}
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </>
  );
}

// Storybook cannot type a pagination whose name is one of two props, so each story draws its own.
const meta = {
  title: "Components/Misc/Pagination",
} satisfies Meta;

type Story = StoryObj<typeof meta>;

// Under a table: the app's summary at the start, heard as it changes, and the pages at the end, the current one
// outlined as fields are, which shows its state at 3:1.
const Default: Story = {
  tags: ["visual"],
  render: () => (
    <div className="p-6">
      <Pagination aria-label={name}>{links()}</Pagination>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name });
    const status = within(nav).getByRole("status");
    const list = within(nav).getByRole("list");
    const currentLink = within(nav).getByRole("link", { name: current });

    await expect(status).toHaveTextContent(summary);
    await expect(currentLink).toHaveAttribute("aria-current", "page");
    await expect(
      within(nav).getByRole("link", { name: pages[0] }),
    ).not.toHaveAttribute("aria-current");
    // A button's colours ease in, so the outline is read once they settle.
    await Promise.all(
      currentLink.getAnimations().map((animation) => animation.finished),
    );
    await expect(getComputedStyle(currentLink).borderTopColor).toBe(
      colourOf("var(--input)", canvasElement),
    );
    // Previous and Next are named by their visible words.
    await expect(
      within(nav).getByRole("link", { name: previous }),
    ).toHaveTextContent(previous);
    await expect(within(nav).getByRole("link", { name: next })).toBeVisible();
    // The gap says nothing, as it cannot be pressed.
    const gap = canvasElement.querySelector(
      '[data-slot="pagination-ellipsis"]',
    ) as Element;
    await expect(gap).toHaveAttribute("aria-hidden", "true");
    await expect(gap.textContent).toBe("");
    // The summary at the start, the pages at the end.
    await expect(Math.round(status.getBoundingClientRect().left)).toBe(
      Math.round(nav.getBoundingClientRect().left),
    );
    await expect(Math.round(list.getBoundingClientRect().right)).toBe(
      Math.round(nav.getBoundingClientRect().right),
    );
  },
};

// On the first page, Previous stays in its place, dimmed, and goes nowhere, so Next does not move.
const FirstPage: Story = {
  render: () => <Pagination aria-label={name}>{links("1")}</Pagination>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: previous });

    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).not.toHaveAttribute("href");
    await expect(getComputedStyle(link).opacity).toBe(dimmed);
  },
};

// With no summary, the pages still sit at the end.
const WithoutSummary: Story = {
  render: () => (
    <Pagination aria-label={name}>{links(current, false)}</Pagination>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", { name });

    await expect(
      Math.round(within(nav).getByRole("list").getBoundingClientRect().right),
    ).toBe(Math.round(nav.getBoundingClientRect().right));
  },
};

// Narrow, by its own width: Previous, the current page and Next, as arrows that keep their names, beside the summary.
const Narrow: Story = {
  render: () => <Pagination aria-label={name}>{links()}</Pagination>,
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name });
    const shown = (label: string) =>
      canvas.getByRole("link", { name: label, hidden: true }).checkVisibility();

    await expect(
      [pages[0], pages[2], lastPage].map((page) => shown(page ?? "")),
    ).toEqual([false, false, false]);
    await expect(
      (
        canvasElement.querySelector(
          '[data-slot="pagination-ellipsis"]',
        ) as Element
      ).checkVisibility(),
    ).toBe(false);
    await expect([shown(previous), shown(current), shown(next)]).toEqual([
      true,
      true,
      true,
    ]);
    // The words are heard, not seen, and everything fits on one line.
    await expect(
      canvas.getByText(previous).getBoundingClientRect().width,
    ).toBeLessThanOrEqual(1);
    await expect(nav.scrollWidth).toBe(nav.clientWidth);
    const middle = (element: Element) => {
      const { top, height } = element.getBoundingClientRect();
      return Math.round(top + height / 2);
    };
    await expect(middle(canvas.getByRole("status"))).toBe(
      middle(canvas.getByRole("list")),
    );
  },
};

// Read from the right, the arrows turn to point the way the pages go.
const RightToLeft: Story = {
  render: () => (
    <div dir="rtl">
      <Pagination aria-label={name}>{links()}</Pagination>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const arrow = within(canvasElement)
      .getByRole("link", { name: previous })
      .querySelector("svg") as Element;

    await expect(getComputedStyle(arrow).rotate).toBe("180deg");
  },
};

export default meta;
export { Default, FirstPage, Narrow, RightToLeft, WithoutSummary };
