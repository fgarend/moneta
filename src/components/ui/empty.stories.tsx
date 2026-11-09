import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "../button.js";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "./empty.js";

const title = "No payments yet";
const description = "Payments appear here once one is made.";
const action = "Make a payment";

const meta = {
  title: "Components/Feedback & Status/Empty",
  component: Empty,
  tags: ["raw"],
  args: {
    children: (
      <>
        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>{action}</Button>
        </EmptyContent>
      </>
    ),
  },
} satisfies Meta<typeof Empty>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(title)).toBeVisible();
    await expect(canvas.getByText(description)).toBeVisible();
    await expect(canvas.getByRole("button", { name: action })).toBeVisible();
  },
};

export default meta;
export { Default };
