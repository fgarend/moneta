import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import { Input } from "./input.js";

const name = "Reference";

const controlHeight = 36;

const meta = {
  title: "Components/Form & Input/Input",
  component: Input,
  tags: ["raw"],
  args: { "aria-label": name },
} satisfies Meta<typeof Input>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="input"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    await expect(
      within(canvasElement).getByRole("textbox", { name }),
    ).toBeEnabled();
  },
};

const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("textbox", { name }),
    ).toBeDisabled();
  },
};

// Each size of the scale, so a field lines up with the buttons beside it: 32, 36 and 40 px.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-start gap-3">
      {sizes.map((size) => (
        <Input aria-label={`${name} ${size}`} key={size} size={size} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = [...canvasElement.querySelectorAll('[data-slot="input"]')];

    await expect(controls.map(height)).toEqual(
      sizes.map((size) => scale[size]),
    );
  },
};

export default meta;
export { Default, Disabled, Sizes };
