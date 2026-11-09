import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../button.js";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
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
  parameters: { a11y: { test: "todo" } },
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
    const list = within(within(canvasElement).getByRole("list"));

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

export default meta;
export { Default };
