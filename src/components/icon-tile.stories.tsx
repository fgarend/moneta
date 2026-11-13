import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowDownLeftIcon,
  ArrowLeftRightIcon,
  TagIcon,
  TargetIcon,
  WalletIcon,
} from "lucide-react";
import { expect, within } from "storybook/test";
import { spending } from "../../.storybook/data.js";
import { IconTile } from "./icon-tile.js";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "./item.js";

// What the guidelines give it: 32, 40 and 48 px, each with its icon, and a square's corners or a circle.
const sizes = { sm: [32, 16], default: [40, 20], lg: [48, 24] } as const;

// The colour a value of the theme resolves to where the tile sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// The tint a tile draws from a colour, as the browser resolves it, in light and in dark.
function tintOf(value: string, near: Element): string {
  const share = document.documentElement.classList.contains("dark") ? 20 : 10;
  const probe = document.createElement("span");
  probe.style.backgroundColor = `color-mix(in oklab, ${value} ${share}%, transparent)`;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

function tiles(canvasElement: HTMLElement): HTMLElement[] {
  return [
    ...canvasElement.querySelectorAll('[data-slot="icon-tile"]'),
  ] as HTMLElement[];
}

function width(element: Element): number {
  return Math.round(element.getBoundingClientRect().width);
}

// A circle's corners reach half its width; a square's stay well short of it.
function isRound(tile: Element): boolean {
  return (
    Number.parseFloat(getComputedStyle(tile).borderTopLeftRadius) >=
    width(tile) / 2
  );
}

const meta = {
  title: "Components/Display & Media/IconTile",
  component: IconTile,
  tags: ["autodocs"],
  args: { children: <WalletIcon /> },
  // Each prop as a control on its page, to try on the first story.
  argTypes: {
    shape: { control: "inline-radio", options: ["square", "circle"] },
    size: { control: "inline-radio", options: ["sm", "default", "lg"] },
    variant: {
      control: "inline-radio",
      options: ["default", "solid", "gold"],
    },
    category: { control: { type: "number", min: 1, max: 8 } },
    children: { control: false },
  },
} satisfies Meta<typeof IconTile>;

type Story = StoryObj<typeof meta>;

/**
 * An icon on a quiet square of 40 px, where the eye starts a row. It is always decoration, so screen readers skip it,
 * and the words beside it say what it is.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const [tile] = tiles(canvasElement) as [HTMLElement];
    const icon = tile.querySelector("svg") as SVGElement;

    await expect(tile).toHaveAttribute("aria-hidden", "true");
    await expect(tile.tagName).toBe("SPAN");
    await expect([width(tile), width(icon)]).toEqual([...sizes.default]);
    await expect(getComputedStyle(tile).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(getComputedStyle(tile).color).toBe(
      colourOf("var(--foreground)", canvasElement),
    );
    await expect(isRound(tile)).toBe(false);
  },
};

/**
 * A square, as in a row, or a circle, as beside a number or a card's title.
 */
export const Shapes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-wrap gap-3">
      <IconTile>
        <WalletIcon />
      </IconTile>
      <IconTile shape="circle">
        <WalletIcon />
      </IconTile>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [square, circle] = tiles(canvasElement) as [HTMLElement, HTMLElement];

    await expect([isRound(square), isRound(circle)]).toEqual([false, true]);
  },
};

/**
 * Three tones, each saying weight and not meaning: soft, in a row, neutral or a category's tint; solid, in the
 * text's colour, the anchor of a number or a card's title; and gold, the screen's headline, once per screen.
 */
export const Variants: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-wrap gap-3">
      <IconTile>
        <ArrowLeftRightIcon />
      </IconTile>
      <IconTile category={1}>
        <TagIcon />
      </IconTile>
      <IconTile shape="circle" variant="solid">
        <ArrowDownLeftIcon />
      </IconTile>
      <IconTile shape="circle" variant="gold">
        <WalletIcon />
      </IconTile>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [plain, category, solid, gold] = tiles(canvasElement) as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    const colours = (tile: HTMLElement): string[] => [
      getComputedStyle(tile).backgroundColor,
      getComputedStyle(tile).color,
    ];

    await expect(colours(plain)).toEqual([
      colourOf("var(--muted)", canvasElement),
      colourOf("var(--foreground)", canvasElement),
    ]);
    await expect(colours(category)).toEqual([
      tintOf("var(--category-1)", canvasElement),
      colourOf("var(--category-1)", canvasElement),
    ]);
    await expect(colours(solid)).toEqual([
      colourOf("var(--foreground)", canvasElement),
      colourOf("var(--background)", canvasElement),
    ]);
    await expect(colours(gold)).toEqual([
      colourOf("var(--gold)", canvasElement),
      colourOf("var(--gold-foreground)", canvasElement),
    ]);
  },
};

/**
 * Three sizes: 32 px for a compact row or a table's cell, 40 for a row, and 48 for a number or a card's title.
 */
export const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <IconTile key={size} shape="circle" size={size} variant="solid">
          <TargetIcon />
        </IconTile>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const measured = tiles(canvasElement).map((tile) => [
      width(tile),
      width(tile.querySelector("svg") as SVGElement),
    ]);

    await expect(measured).toEqual(
      Object.values(sizes).map((size) => [...size]),
    );
  },
};

/**
 * In a list of rows, a tile is written straight in its item, which says how it behaves there: a square of 40 px, or
 * 32 in a compact list, at the row's start, a category's tint telling the rows apart.
 */
export const InARow: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["default", "compact"] as const).map((density) => (
        <ItemGroup density={density} key={density}>
          {spending.slice(0, 2).map(({ category, name, Icon }) => (
            <Item key={name}>
              <IconTile category={category}>
                <Icon />
              </IconTile>
              <ItemContent>
                <ItemTitle>{name}</ItemTitle>
                <ItemDescription>{`This month in ${name}`}</ItemDescription>
              </ItemContent>
            </Item>
          ))}
        </ItemGroup>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [loose, , compact] = tiles(canvasElement) as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    const title = within(canvasElement).getAllByText(
      spending[0]?.name ?? "",
    )[0] as HTMLElement;

    await expect([width(loose), width(compact)]).toEqual([40, 32]);
    await expect(isRound(loose)).toBe(false);
    // At the row's start, its top level with its title's when a description follows, and not centred on both lines.
    await expect(loose.getBoundingClientRect().left).toBeLessThan(
      title.getBoundingClientRect().left,
    );
    await expect(
      Math.abs(
        loose.getBoundingClientRect().top - title.getBoundingClientRect().top,
      ),
    ).toBeLessThanOrEqual(4);
  },
};

/**
 * What an app writes by hand wins over what the place says: a solid circle of 48 px in a compact row stays so.
 */
export const GivenByHand: Story = {
  tags: ["!autodocs"],
  render: () => (
    <ItemGroup density="compact">
      <Item>
        <IconTile shape="circle" size="lg" variant="solid">
          <TargetIcon />
        </IconTile>
        <ItemContent>
          <ItemTitle>Emergency fund</ItemTitle>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
  play: async ({ canvasElement }) => {
    const [tile] = tiles(canvasElement) as [HTMLElement];

    await expect(width(tile)).toBe(48);
    await expect(isRound(tile)).toBe(true);
    await expect(getComputedStyle(tile).backgroundColor).toBe(
      colourOf("var(--foreground)", canvasElement),
    );
  },
};

/**
 * A category colours only the soft tile; a solid or gold one keeps its own colours, and a number that names no
 * category, nought, below it or a fraction, keeps the quiet tile.
 */
export const CategoryOnSoftOnly: Story = {
  tags: ["!autodocs"],
  render: () => (
    <div className="flex flex-wrap gap-3">
      <IconTile category={2} variant="solid">
        <TagIcon />
      </IconTile>
      {[0, -1, 2.5].map((category) => (
        <IconTile category={category} key={category}>
          <TagIcon />
        </IconTile>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [solid, ...plain] = tiles(canvasElement) as HTMLElement[];

    await expect(getComputedStyle(solid as HTMLElement).backgroundColor).toBe(
      colourOf("var(--foreground)", canvasElement),
    );
    for (const tile of plain) {
      await expect(getComputedStyle(tile).backgroundColor).toBe(
        colourOf("var(--muted)", canvasElement),
      );
    }
  },
};

export default meta;
