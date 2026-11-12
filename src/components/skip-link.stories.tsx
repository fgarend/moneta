import type { Meta, StoryObj } from "@storybook/react-vite";
import { useId } from "react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button.js";
import { SkipLink } from "./skip-link.js";

const words = "Skip to the content";
const before = "A control before the content";
const inside = "The content's first control";

const meta = {
  title: "Components/Layout & Navigation/SkipLink",
  render: function Render() {
    const id = useId();
    return (
      <>
        <SkipLink href={`#${id}`}>{words}</SkipLink>
        <Button>{before}</Button>
        <div id={id}>
          <Button>{inside}</Button>
        </div>
      </>
    );
  },
} satisfies Meta;

type Story = StoryObj<typeof meta>;

// Out of sight until the keyboard reaches it, first; then shown, and pressed, it takes focus to its target, so the next
// Tab goes on from there.
const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: words });
    const target = document.getElementById(
      (link.getAttribute("href") as string).slice(1),
    ) as HTMLElement;

    await expect(link.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await expect(link.getBoundingClientRect().width).toBeGreaterThan(1);

    await userEvent.keyboard("{Enter}");
    await expect(target).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole("button", { name: inside })).toHaveFocus();
    await expect(target).not.toHaveAttribute("tabindex");
  },
};

// A target missing from the page moves nothing, and the address keeps no fragment for a router to read.
const WithoutTarget: Story = {
  render: () => <SkipLink href="#nowhere">{words}</SkipLink>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: words });

    await userEvent.tab();
    await userEvent.keyboard("{Enter}");
    await expect(link).toHaveFocus();
    await expect(globalThis.location.hash).toBe("");
  },
};

export default meta;
export { Default, WithoutTarget };
