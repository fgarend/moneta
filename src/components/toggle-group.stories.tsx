import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
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

export default meta;
export { Default };
