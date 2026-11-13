import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import { Toggle } from "./toggle.js";

const label = "Hide amounts";

const controlHeight = 36;

const meta = {
  title: "Components/Misc/Toggle",
  component: Toggle,
  tags: ["raw"],
  args: { children: label },
} satisfies Meta<typeof Toggle>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="toggle"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    await expect(
      within(canvasElement).getByRole("button", {
        name: label,
        pressed: false,
      }),
    ).toBeVisible();
  },
};

const Pressed: Story = {
  args: { defaultSelected: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: label,
        pressed: true,
      }),
    ).toBeVisible();
  },
};

// Each size of the scale: 32, 36 and 40 px.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-start gap-3">
      {sizes.map((size) => (
        <Toggle key={size} size={size}>
          {label}
        </Toggle>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = [
      ...canvasElement.querySelectorAll('[data-slot="toggle"]'),
    ];

    await expect(controls.map(height)).toEqual(
      sizes.map((size) => scale[size]),
    );
  },
};

export default meta;
export { Default, Pressed, Sizes };
