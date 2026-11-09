import type { Meta, StoryObj } from "@storybook/react-vite";
import { PiggyBank } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "./item.js";

const title = "Savings";
const description = "Balance 1,250.00";
const action = "Details";
const linked = "Checking";

const meta = {
  title: "Components/Display & Media/Item",
  component: ItemGroup,
  tags: ["raw"],
  args: {
    children: (
      <>
        <Item>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
            <ItemDescription>{description}</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm">{action}</Button>
          </ItemActions>
        </Item>
        <Item href="#checking">{linked}</Item>
      </>
    ),
  },
} satisfies Meta<typeof ItemGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    // A group of items, which says nothing more than its items do.
    const list = within(
      canvasElement.querySelector('[data-slot="item-group"]') as HTMLElement,
    );

    await expect(list.getByText(title)).toBeVisible();
    await expect(list.getByText(description)).toBeVisible();
    await expect(list.getByRole("button", { name: action })).toBeVisible();
    // With an href, an item is a link.
    await expect(list.getByRole("link", { name: linked })).toHaveAttribute(
      "href",
      "#checking",
    );
  },
};

const header = "Goal";
const footer = "Updated today";

// Every part: media as an icon on a tile and as it is, a header and a footer, and a line between items.
const AllParts: Story = {
  args: {
    children: (
      <>
        <Item>
          <ItemHeader>{header}</ItemHeader>
          <ItemMedia variant="icon">
            <PiggyBank aria-hidden={true} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{title}</ItemTitle>
          </ItemContent>
          <ItemFooter>{footer}</ItemFooter>
        </Item>
        <ItemSeparator />
        <Item>
          <ItemMedia>
            <PiggyBank aria-hidden={true} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{linked}</ItemTitle>
          </ItemContent>
        </Item>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const media = [
      ...canvasElement.querySelectorAll('[data-slot="item-media"]'),
    ];

    await expect(canvas.getByText(header)).toBeVisible();
    await expect(canvas.getByText(footer)).toBeVisible();
    await expect(canvas.getByRole("separator")).toBeInTheDocument();
    await expect(
      media.map((part) => part.getAttribute("data-variant")),
    ).toEqual(["icon", "default"]);
  },
};

export default meta;
export { AllParts, Default };
