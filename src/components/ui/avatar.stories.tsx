import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

const name = "Fictitious account holder";
const initials = "FH";
// A square of one colour, so nothing is fetched and no one is shown.
const picture =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";

const meta = {
  title: "Components/Display & Media/Avatar",
  component: Avatar,
  tags: ["raw"],
  args: {
    children: (
      <>
        <AvatarImage alt={name} src={picture} />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
} satisfies Meta<typeof Avatar>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("img", { name })).toBeVisible();
    await expect(canvas.getByText(initials)).not.toBeVisible();
  },
};

// With no picture, the initials stand in for it.
const Fallback: Story = {
  args: {
    children: (
      <>
        <AvatarImage alt={name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(initials)).toBeVisible();
  },
};

export default meta;
export { Default, Fallback };
