import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar.js";

const name = "Fictitious account holder";
const initials = "FH";
// A square of one colour, so nothing is fetched and no one is shown.
const picture =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";
// A picture that fails to load, with nothing fetched.
const broken = "data:image/png;base64,AAAA";
const others = "+3";

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

// A picture that fails to load gives way to the initials.
const BrokenPicture: Story = {
  args: {
    children: (
      <>
        <AvatarImage alt={name} src={broken} />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(within(canvasElement).getByText(initials)).toBeVisible(),
    );
  },
};

// A group of avatars, one with a badge, one a picture beside the others with no name of its own, and how many more
// there are.
const Group: Story = {
  render: () => (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>{initials}</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <Avatar>
        <AvatarImage src={picture} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>{others}</AvatarGroupCount>
    </AvatarGroup>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(others)).toBeVisible();
    await expect(
      canvasElement.querySelector('[data-slot="avatar-badge"]'),
    ).toBeVisible();
  },
};

export default meta;
export { BrokenPicture, Default, Fallback, Group };
