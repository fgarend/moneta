import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Breadcrumb,
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
    await expect(
      within(nav).getByRole("link", { name: current }),
    ).toHaveAttribute("aria-current", "page");
  },
};

export default meta;
export { Default };
