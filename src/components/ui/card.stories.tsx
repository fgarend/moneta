import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

const title = "Savings";
const description = "Fictitious account";
const content = "Balance 1,250.00";
const action = "Details";
const footer = "Updated today";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["raw"],
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <Button size="sm">{action}</Button>
          </CardAction>
        </CardHeader>
        <CardContent>{content}</CardContent>
        <CardFooter>{footer}</CardFooter>
      </>
    ),
  },
} satisfies Meta<typeof Card>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(title)).toBeVisible();
    await expect(canvas.getByText(description)).toBeVisible();
    await expect(canvas.getByText(content)).toBeVisible();
    await expect(canvas.getByText(footer)).toBeVisible();
    await expect(canvas.getByRole("button", { name: action })).toBeVisible();
  },
};

export default meta;
export { Default };
