import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

const group = "Frequency";
const monthly = "Monthly";
const yearly = "Yearly";

const meta = {
  title: "Components/Form & Input/Radio Group",
  component: RadioGroup,
  tags: ["raw"],
  args: {
    "aria-label": group,
    defaultValue: yearly,
    children: (
      <>
        <RadioGroupItem aria-label={monthly} value={monthly} />
        <RadioGroupItem aria-label={yearly} value={yearly} />
      </>
    ),
  },
} satisfies Meta<typeof RadioGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const radios = within(
      within(canvasElement).getByRole("radiogroup", { name: group }),
    );

    await expect(radios.getByRole("radio", { name: yearly })).toBeChecked();
    await expect(
      radios.getByRole("radio", { name: monthly }),
    ).not.toBeChecked();
  },
};

export default meta;
export { Default };
