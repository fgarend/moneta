import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "./avatar.js";
import { Button } from "./button.js";
import { Card, CardContent } from "./card.js";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "./item.js";

const name = "Ana Fictícia";
const initials = "AF";
const second = "BF";
const holders = "Ana, Bruno and 3 more";
const others = "+3";
const state = "Holder";
const change = "Change the picture";
// A square of one colour, so nothing is fetched and no one is shown.
const picture =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";
// A picture a lazy image out of sight never asks for, so it stays loading.
const unfetched = "/never-fetched.png";
// A picture that fails to load, with nothing fetched.
const broken = "data:image/png;base64,AAAA";

// The sizes the guidelines give it: 24, 32 and 40 px, and a row's, 40 or 32 in a compact list, as an IconTile's.
const small = 24;
const usual = 32;
const row = 40;

function slot(root: Element, part: string): HTMLElement {
  return root.querySelector(`[data-slot="${part}"]`) as HTMLElement;
}

function backgroundOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

const meta = {
  title: "Components/Display & Media/Avatar",
  component: Avatar,
  args: {
    children: (
      <>
        <AvatarImage src={picture} />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
} satisfies Meta<typeof Avatar>;

type Story = StoryObj<typeof meta>;

// A person's picture, hidden from screen readers, as the name beside it is what is heard.
const Default: Story = {
  render: (args) => (
    <p className="flex items-center gap-2">
      <Avatar {...args} />
      <span>{name}</span>
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await waitFor(() =>
      expect(slot(canvasElement, "avatar-image")).toBeVisible(),
    );
    await expect(canvas.queryByRole("img")).toBeNull();
    await expect(slot(canvasElement, "avatar-fallback")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    // Inside a sentence, every part a span.
    await expect(slot(canvasElement, "avatar").tagName).toBe("SPAN");
    await expect(slot(canvasElement, "avatar-fallback").tagName).toBe("SPAN");
    await expect(
      slot(canvasElement, "avatar").getBoundingClientRect().width,
    ).toBe(usual);
  },
};

// With no picture, the initials stand in for it, hidden from screen readers too.
const Initials: Story = {
  args: {
    children: (
      <>
        <AvatarImage />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const fallback = slot(canvasElement, "avatar-fallback");

    await expect(fallback).toBeVisible();
    await expect(fallback).toHaveAttribute("aria-hidden", "true");
  },
};

// While the picture loads, the initials, not an empty circle; here it waits, out of sight, to load.
const Loading: Story = {
  tags: ["!autodocs"],
  args: {
    children: (
      <>
        <AvatarImage loading="lazy" src={unfetched} />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ marginTop: "300vh" }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(slot(canvasElement, "avatar-image")).toHaveAttribute(
      "data-state",
      "loading",
    );
    await expect(slot(canvasElement, "avatar-fallback")).toBeVisible();
  },
};

// A picture that fails to load gives way to the initials.
const BrokenPicture: Story = {
  tags: ["!autodocs"],
  args: {
    children: (
      <>
        <AvatarImage src={broken} />
        <AvatarFallback>{initials}</AvatarFallback>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(slot(canvasElement, "avatar-fallback")).toBeVisible(),
    );
  },
};

// A picture changed after one that failed, as a person sending a new one, is tried again.
// biome-ignore lint/style/useComponentExportOnlyModules: a part of this story's own, which enters no package.
function NewPictureDemo() {
  const [src, setSrc] = useState(broken);
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={src} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <Button onPress={() => setSrc(picture)} size="sm" variant="outline">
        {change}
      </Button>
    </div>
  );
}

const NewPicture: Story = {
  tags: ["!autodocs"],
  render: () => <NewPictureDemo />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(slot(canvasElement, "avatar-fallback")).toBeVisible(),
    );
    await userEvent.click(within(canvasElement).getByRole("button"));
    await waitFor(() =>
      expect(slot(canvasElement, "avatar-image")).toBeVisible(),
    );
    await expect(slot(canvasElement, "avatar-fallback")).not.toBeVisible();
  },
};

// The sizes: 24 px in a cell or a choice, 32 by default, and 40 in a page's head.
const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const widths = [
      ...canvasElement.querySelectorAll('[data-slot="avatar"]'),
    ].map((avatar) => avatar.getBoundingClientRect().width);

    await expect(widths).toEqual([small, usual, row]);
  },
};

// In a list's row, a row's size, as an IconTile's, so the rows' titles line up; 32 in a compact list; a size given
// wins.
const InRow: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "compact"] as const).map((density) => (
        <ItemGroup density={density} key={density}>
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{name}</ItemTitle>
            </ItemContent>
          </Item>
          <Item>
            <ItemMedia>
              <Avatar size="sm">
                <AvatarFallback>{second}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{name}</ItemTitle>
            </ItemContent>
          </Item>
        </ItemGroup>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const widths = [
      ...canvasElement.querySelectorAll('[data-slot="avatar"]'),
    ].map((avatar) => avatar.getBoundingClientRect().width);

    await expect(widths).toEqual([row, small, usual, small]);
  },
};

// A person's state: an icon of its own shape at the avatar's corner, and the app's words, heard though the rest is
// hidden. At 24 px it is not drawn, and its words are still heard.
const State: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-center gap-3 p-6">
      {(["lg", "default", "sm"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>{initials}</AvatarFallback>
          <AvatarBadge label={state}>
            <CheckIcon />
          </AvatarBadge>
        </Avatar>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badges = [
      ...canvasElement.querySelectorAll('[data-slot="avatar-badge"]'),
    ] as HTMLElement[];

    await expect(within(canvasElement).getAllByText(state)).toHaveLength(3);
    await expect(badges[0]?.querySelector("svg")).toBeVisible();
    await expect(badges[1]?.querySelector("svg")).toBeVisible();
    await expect(badges[2]).not.toBeVisible();
  },
};

// The holders of a joint account: heard as the app's words, its count hidden, as the words say it, and its ring the
// colour of the surface it sits on.
const Group: Story = {
  render: () => (
    <Card>
      <CardContent>
        <AvatarGroup aria-label={holders}>
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>{second}</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>{others}</AvatarGroupCount>
        </AvatarGroup>
      </CardContent>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const group = within(canvasElement).getByRole("img", { name: holders });
    const card = backgroundOf("var(--card)", canvasElement);

    await expect(group.tagName).toBe("SPAN");
    await expect(slot(group, "avatar-group-count")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    await expect(slot(group, "avatar-group-count").tagName).toBe("SPAN");
    await expect(getComputedStyle(slot(group, "avatar")).boxShadow).toContain(
      card,
    );
  },
};

export default meta;
export {
  BrokenPicture,
  Default,
  Group,
  Initials,
  InRow,
  Loading,
  NewPicture,
  Sizes,
  State,
};
