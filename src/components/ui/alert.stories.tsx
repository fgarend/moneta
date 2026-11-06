import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert.js";
import { Button } from "./button.js";

const title = "Payment received";
const description = "The transfer reached the savings account.";
const action = "Review";

const meta = {
  title: "UI/Alert",
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

export default meta;
export { Default };
