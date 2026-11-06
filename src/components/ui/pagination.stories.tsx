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
} from "./pagination.js";

const name = "Statement pages";
const previous = "Previous statements";
const next = "Next statements";
const firstPage = "1";
const currentPage = "2";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["raw"],
  args: {
    "aria-label": name,
    children: (
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious aria-label={previous} href="#page-1" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-1">{firstPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2" isActive={true}>
            {currentPage}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext aria-label={next} href="#page-3" />
        </PaginationItem>
      </PaginationContent>
    ),
  },
} satisfies Meta<typeof Pagination>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(within(canvasElement).getByRole("navigation", { name }));

    await expect(nav.getByRole("link", { name: currentPage })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      nav.getByRole("link", { name: firstPage }),
    ).not.toHaveAttribute("aria-current");
    await expect(nav.getByRole("link", { name: previous })).toBeVisible();
    await expect(nav.getByRole("link", { name: next })).toBeVisible();
  },
};

export default meta;
export { Default };
