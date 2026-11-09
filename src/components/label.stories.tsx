import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Input } from "./input.js";
import { Label } from "./label.js";

const label = "Reference";
const inputId = "label-reference";

const meta = {
  title: "Components/Form & Input/Label",
  component: Label,
  tags: ["raw"],
  args: { children: label },
} satisfies Meta<typeof Label>;

type Story = StoryObj<typeof meta>;

// With htmlFor, for a field of the page's own.
const Default: Story = {
  args: { htmlFor: inputId },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Input id={inputId} />
      </>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name: label }),
    ).toBeVisible();
  },
};

// Inside a React Aria field, with no htmlFor, the field links its label by itself.
const InAField: Story = {
  decorators: [
    (Story) => (
      <TextField>
        <Story />
        <Input />
      </TextField>
    ),
  ],
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getAllByRole("textbox", { name: label }),
    ).toHaveLength(1);
  },
};

export default meta;
export { Default, InAField };
