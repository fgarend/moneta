import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "./breadcrumb.js";

const path = "Account path";
const accounts = "Accounts";
const current = "Savings";

const meta = {
  title: "Components/Layout & Navigation/Breadcrumb",
  component: Breadcrumb,
  tags: ["raw"],
  args: {
    "aria-label": path,
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#accounts">{accounts}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
} satisfies Meta<typeof Breadcrumb>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole("navigation", { name: path });

    await expect(
      within(nav).getByRole("link", { name: accounts }),
    ).toHaveAttribute("href", "#accounts");
    // The current page is a link that goes nowhere: marked, disabled, and out of the keyboard's way.
    const page = within(nav).getByRole("link", { name: current });
    await expect(page).toHaveAttribute("aria-current", "page");
    await expect(page).toHaveAttribute("aria-disabled", "true");
    await expect(page).not.toHaveAttribute("tabindex");
  },
};

// Pages left out of a long path, shown as an ellipsis that a screen reader skips.
const Collapsed: Story = {
  args: {
    children: (
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#accounts">{accounts}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbPage>{current}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    ),
  },
  play: async ({ canvasElement }) => {
    const ellipsis = canvasElement.querySelector(
      '[data-slot="breadcrumb-ellipsis"]',
    );
    await expect(ellipsis).toBeVisible();
    await expect(ellipsis).toHaveAttribute("aria-hidden", "true");
  },
};

export default meta;
export { Collapsed, Default };
