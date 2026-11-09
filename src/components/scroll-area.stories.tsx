import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ScrollArea } from "./scroll-area.js";

const first = "First payment";
const lines = [
  first,
  "Second payment",
  "Third payment",
  "Fourth payment",
  "Fifth payment",
  "Sixth payment",
  "Seventh payment",
  "Eighth payment",
];
const last = "Eighth payment";

const meta = {
  title: "Components/Layout & Navigation/Scroll Area",
  component: ScrollArea,
  tags: ["raw"],
  parameters: { a11y: { test: "todo" } },
  args: {
    className: "h-16",
    children: lines.map((line) => <p key={line}>{line}</p>),
  },
} satisfies Meta<typeof ScrollArea>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(first)).toBeVisible();
    await expect(canvas.getByText(last)).toBeInTheDocument();
  },
};

export default meta;
export { Default };
