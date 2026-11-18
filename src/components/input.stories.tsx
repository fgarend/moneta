import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { contrast, edgeContrast } from "../../.storybook/contrast.js";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import { Card, CardContent } from "./card.js";
import { Input } from "./input.js";

const name = "Reference";

const value = "Fictitious rent";

const controlHeight = 36;
const edge = 3;
const textContrast = 4.5;
const transparent = "rgba(0, 0, 0, 0)";

// The colour a value of the theme resolves to where the box sits, in light and in dark.
function colourOf(token: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = token;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

const meta = {
  title: "Components/Form & Input/Input",
  component: Input,
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

// Read-only: a filled box with no border, as tall as the others, its text at full contrast.
const ReadOnly: Story = {
  tags: ["visual"],
  args: { readOnly: true, defaultValue: value },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name });

    await expect(getComputedStyle(box).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(getComputedStyle(box).borderTopColor).toBe(transparent);
    await expect(box.offsetHeight).toBe(controlHeight);
    await expect(contrast(box)).toBeGreaterThanOrEqual(textContrast);
  },
};

// The box's edge, 3:1 against what it sits on, the page and a card, so it is seen as a control.
const Edge: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Input aria-label={`${name} on the page`} />
      <Card>
        <CardContent>
          <Input aria-label={`${name} on a card`} />
        </CardContent>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const boxes = within(canvasElement).getAllByRole("textbox");

    await expect(boxes).toHaveLength(2);
    for (const box of boxes) {
      await expect(edgeContrast(box)).toBeGreaterThanOrEqual(edge);
    }
  },
};

export default meta;
export { Default, Disabled, Edge, ReadOnly, Sizes };
