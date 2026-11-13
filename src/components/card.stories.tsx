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

const titleSize = "15px";
const descriptionSize = "13px";
const cardSpacing = "20px";

const meta = {
  title: "Components/Display & Media/Card",
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
    // The scale of text and space the theme sets, which Card reads.
    await expect(getComputedStyle(canvas.getByText(title)).fontSize).toBe(
      titleSize,
    );
    await expect(getComputedStyle(canvas.getByText(description)).fontSize).toBe(
      descriptionSize,
    );
    await expect(
      getComputedStyle(
        canvasElement.querySelector('[data-slot="card"]') as Element,
      ).paddingTop,
    ).toBe(cardSpacing);
    await expect(canvas.getByText(description)).toBeVisible();
    await expect(canvas.getByText(content)).toBeVisible();
    await expect(canvas.getByText(footer)).toBeVisible();
    await expect(canvas.getByRole("button", { name: action })).toBeVisible();
  },
};

// Several controls in a card's action lie in a row, 8 px apart, centred on one another.
const SeveralActions: Story = {
  args: {
    children: (
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <Button size="sm" variant="outline">
            {action}
          </Button>
          <Button size="sm">{footer}</Button>
        </CardAction>
      </CardHeader>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, second] = [action, footer].map((name) =>
      canvas.getByRole("button", { name }).getBoundingClientRect(),
    ) as [DOMRect, DOMRect];

    await expect(Math.round(second.left - first.right)).toBe(8);
    await expect(Math.round(second.top - first.top)).toBe(0);
  },
};

export default meta;
export { Default, SeveralActions };
