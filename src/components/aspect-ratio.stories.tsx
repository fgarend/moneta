import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { AspectRatio } from "./aspect-ratio.js";
import { Card, CardDescription, CardHeader, CardTitle } from "./card.js";

const place = "A harbour at dusk";
const goal = "Trip to the coast";
const saved = "Saved: 4,350.00 of 12,000.00";
const widescreen = 16 / 9;
// A picture wider than the box, of no one, and fetched from nowhere: hills under a sky, cropped at its sides.
const picture =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 1'%3E%3Cdefs%3E%3ClinearGradient id='s' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%236b8fa3'/%3E%3Cstop offset='1' stop-color='%23e7d8a8'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='3' height='1' fill='url(%23s)'/%3E%3Cpath d='M0 .75Q.75.5 1.5.7T3 .65V1H0z' fill='%236b8f71'/%3E%3C/svg%3E";

function slot(root: Element, part: string): HTMLElement {
  return root.querySelector(`[data-slot="${part}"]`) as HTMLElement;
}

function backgroundOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

function radiusOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.borderRadius = value;
  near.append(probe);
  const { borderTopLeftRadius } = getComputedStyle(probe);
  probe.remove();
  return borderTopLeftRadius;
}

const meta = {
  title: "Components/Display & Media/Aspect Ratio",
  component: AspectRatio,
  args: {
    ratio: widescreen,
    children: <img alt={place} src={picture} />,
  },
} satisfies Meta<typeof AspectRatio>;

type Story = StoryObj<typeof meta>;

// A picture of another shape fills the box, cropped, on --muted until it loads, with the corners of an alert.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className="max-w-80 p-6">
      <AspectRatio {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const box = slot(canvasElement, "aspect-ratio");
    const image = within(canvasElement).getByRole("img", { name: place });
    const outer = box.getBoundingClientRect();
    const inner = image.getBoundingClientRect();
    const style = getComputedStyle(box);

    await expect(outer.height).toBeCloseTo(outer.width / widescreen, 0);
    await expect([inner.width, inner.height]).toEqual([
      outer.width,
      outer.height,
    ]);
    await expect(getComputedStyle(image).objectFit).toBe("cover");
    await expect(style.overflow).toBe("hidden");
    await expect(style.backgroundColor).toBe(
      backgroundOf("var(--muted)", canvasElement),
    );
    await expect(style.borderTopLeftRadius).toBe(
      radiusOf("var(--radius)", canvasElement),
    );
  },
};

// A card's cover: its first child reaches the card's edge, with the card's corners, so covers are of one height.
const CardCover: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className="max-w-80 p-6">
      <Card>
        <AspectRatio {...args} />
        <CardHeader>
          <CardTitle>{goal}</CardTitle>
          <CardDescription>{saved}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const card = slot(canvasElement, "card").getBoundingClientRect();
    const box = slot(canvasElement, "aspect-ratio");
    const cover = box.getBoundingClientRect();

    await expect([cover.top, cover.left, cover.right]).toEqual([
      card.top,
      card.left,
      card.right,
    ]);
    await expect(getComputedStyle(box).borderBottomLeftRadius).toBe("0px");
  },
};

export default meta;
export { CardCover, Default };
