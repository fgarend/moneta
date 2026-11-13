import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert.js";
import { Button } from "./button.js";

const title = "Payment received";
const description = "The transfer reached the savings account.";
const action = "Review";

// The colour a value of the theme resolves to where the alert sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

const meta = {
  title: "Components/Feedback & Status/Alert",
  component: Alert,
  tags: ["raw"],
  args: {
    children: (
      <>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <AlertAction>
          <Button size="xs">{action}</Button>
        </AlertAction>
      </>
    ),
  },
} satisfies Meta<typeof Alert>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole("alert");

    await expect(alert).toHaveTextContent(title);
    await expect(alert).toHaveTextContent(description);
    await expect(
      within(alert).getByRole("button", { name: action }),
    ).toBeVisible();
  },
};

// The colours of meaning, each alert's title and description in its colour, on the card; its words say the meaning
// too.
const meanings = [
  ["destructive", "The payment failed"],
  ["success", "The payment went through"],
  ["warning", "The balance is low"],
  ["info", "A transfer is scheduled"],
] as const;

const Meanings: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex w-full max-w-96 flex-col gap-2 p-6">
      {meanings.map(([variant, words]) => (
        <Alert key={variant} variant={variant}>
          <AlertTitle>{words}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    // A colour of its own, not the card's text, which a missing token would leave.
    const plain = colourOf("var(--card-foreground)", canvasElement);
    for (const [variant, words] of meanings) {
      const { color } = getComputedStyle(
        within(canvasElement).getByText(words),
      );
      await expect(color).toBe(colourOf(`var(--${variant})`, canvasElement));
      await expect(color).not.toBe(plain);
    }
  },
};

export default meta;
export { Default, Meanings };
