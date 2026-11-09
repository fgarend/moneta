import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../../.storybook/settled.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select.js";

const name = "Account";
const placeholder = "Choose an account";
const savings = "Savings";
const checking = "Checking";

const controlHeight = 36;

const meta = {
  title: "Components/Form & Input/Select",
  component: Select,
  tags: ["raw", "gap-forced-colors"],
  args: {
    "aria-label": name,
    placeholder,
    children: (
      <>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem>{savings}</SelectItem>
          <SelectItem>{checking}</SelectItem>
        </SelectContent>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="select-trigger"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    const trigger = within(canvasElement).getByRole("button", {
      name: new RegExp(name, "u"),
    });

    await expect(trigger).toHaveTextContent(placeholder);
    await expect(
      within(document.body).queryByRole("listbox"),
    ).not.toBeInTheDocument();
  },
};

const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", {
        name: new RegExp(name, "u"),
      }),
    );
    const list = await within(document.body).findByRole("listbox");

    await settled(list);
    await expect(
      within(list).getByRole("option", { name: savings }),
    ).toBeInTheDocument();
    await expect(
      within(list).getByRole("option", { name: checking }),
    ).toBeInTheDocument();
  },
};

export default meta;
export { Default, Open };
