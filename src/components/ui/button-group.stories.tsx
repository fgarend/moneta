import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Button } from "./button.js";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "./button-group.js";

const group = "Statement actions";
const text = "Statement";
const download = "Download";
const print = "Print";

const meta = {
  title: "Components/Form & Input/Button Group",
  component: ButtonGroup,
  tags: ["raw"],
  args: {
    "aria-label": group,
    children: (
      <>
        <ButtonGroupText>{text}</ButtonGroupText>
        <Button variant="outline">{download}</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">{print}</Button>
      </>
    ),
  },
} satisfies Meta<typeof ButtonGroup>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const buttons = within(
      within(canvasElement).getByRole("group", { name: group }),
    );

    await expect(buttons.getByRole("button", { name: download })).toBeVisible();
    await expect(buttons.getByRole("button", { name: print })).toBeVisible();
    await expect(buttons.getByRole("separator")).toBeInTheDocument();
  },
};

export default meta;
export { Default };
