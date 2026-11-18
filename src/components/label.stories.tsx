import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextField } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Input } from "./input.js";
import { Label } from "./label.js";

const label = "Reference";
const inputId = "label-reference";
const longLabel =
  "The reference the fictitious household gives every monthly transfer to its landlord";

// A control's name: 14/20 and 500.
const size = "14px";
const line = "20px";
const weight = "500";

const meta = {
  title: "Components/Form & Input/Label",
  component: Label,
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

// A long label wraps on lines of 20 px, at 14 and 500, at the narrowest screen.
const LongLabel: Story = {
  tags: ["visual"],
  args: { children: longLabel, htmlFor: inputId },
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
        <Input id={inputId} />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const words = canvasElement.querySelector(
      '[data-slot="label"]',
    ) as HTMLElement;

    await expect(getComputedStyle(words).fontSize).toBe(size);
    await expect(getComputedStyle(words).lineHeight).toBe(line);
    await expect(getComputedStyle(words).fontWeight).toBe(weight);
    await expect(words.getBoundingClientRect().height).toBeGreaterThan(
      Number.parseInt(line, 10),
    );
  },
};

export default meta;
export { Default, InAField, LongLabel };
