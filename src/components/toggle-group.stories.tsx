import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

const group = "Period";
const month = "Month";
const year = "Year";

const meta = {
  title: "Components/Misc/Toggle Group",
  component: ToggleGroup,
  tags: ["raw"],
  args: {
    "aria-label": group,
    defaultSelectedKeys: [year],
    children: (
      <>
        <ToggleGroupItem id={month}>{month}</ToggleGroupItem>
        <ToggleGroupItem id={year}>{year}</ToggleGroupItem>
      </>
    ),
  },
} satisfies Meta<typeof ToggleGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const items = within(
      within(canvasElement).getByRole("radiogroup", { name: group }),
    );

    await expect(items.getByRole("radio", { name: year })).toBeChecked();
    await expect(items.getByRole("radio", { name: month })).not.toBeChecked();
  },
};

// Each size of the scale, its items 32, 36 and 40 px.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-start gap-3">
      {sizes.map((size) => (
        <ToggleGroup
          aria-label={`${group} ${size}`}
          defaultSelectedKeys={[year]}
          key={size}
          size={size}
        >
          <ToggleGroupItem id={month}>{month}</ToggleGroupItem>
          <ToggleGroupItem id={year}>{year}</ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = [
      ...canvasElement.querySelectorAll(
        '[data-slot="toggle-group"] > :first-child',
      ),
    ];

    await expect(controls.map(height)).toEqual(
      sizes.map((size) => scale[size]),
    );
  },
};

export default meta;
export { Default, Sizes };
