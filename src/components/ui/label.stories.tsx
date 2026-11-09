import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Input } from "../input.js";
import { Label } from "./label.js";

const label = "Reference";
const inputId = "label-reference";

const meta = {
  title: "Components/Form & Input/Label",
  component: Label,
  tags: ["raw"],
  args: { children: label, htmlFor: inputId },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Input id={inputId} />
      </>
    ),
  ],
} satisfies Meta<typeof Label>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name: label }),
    ).toBeVisible();
  },
};

export default meta;
export { Default };
