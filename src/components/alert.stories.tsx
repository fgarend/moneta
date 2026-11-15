import type { Meta, StoryObj } from "@storybook/react-vite";
import { WalletIcon } from "lucide-react";
import { expect, within } from "storybook/test";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert.js";
import { Button } from "./button.js";

const title = "The positions could not be read";
const description = "The file had no rows. Export it again from the broker.";
const action = "Try again";
const second = "Choose another file";
const named = "Import";
const longTitle =
  "The positions of every fictitious account could not be read from the file sent this morning";
const reason = "Two sales sold more shares than the account held that day.";
const sales = [
  "2026-10-03, FICT3, 40 shares too many",
  "2026-10-21, DEMO11, 12 shares too many",
];

// What the guidelines give it: 8 px between paragraphs, 4 between a list's items, and 8 between controls in a row.
const betweenParagraphs = 8;
const betweenItems = 4;
const betweenControls = 8;

// The colour a value of the theme resolves to where the alert sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function backgroundOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.backgroundColor = value;
  near.append(probe);
  const { backgroundColor } = getComputedStyle(probe);
  probe.remove();
  return backgroundColor;
}

function slot(root: Element, name: string): HTMLElement {
  return root.querySelector(`[data-slot="${name}"]`) as HTMLElement;
}

const meta = {
  title: "Components/Feedback & Status/Alert",
  component: Alert,
  args: {
    children: (
      <>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </>
    ),
  },
} satisfies Meta<typeof Alert>;

type Story = StoryObj<typeof meta>;

// With no meaning, the card's look and no icon; heard once the reader finishes, named by its title.
const Default: Story = {
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole("status", { name: title });

    await expect(alert).toHaveTextContent(description);
    await expect(alert.querySelector("svg")).toBeNull();
    await expect(getComputedStyle(alert).backgroundColor).toBe(
      backgroundOf("var(--card)", canvasElement),
    );
  },
};

// The meanings, each its tint, its icon and its title in its colour, its description in the text's. Something wrong
// is heard at once; the rest once the reader finishes.
const meanings = [
  ["destructive", "The payment failed", "alert"],
  ["success", "The payment went through", "status"],
  ["warning", "The balance is low", "status"],
  ["info", "A transfer is scheduled", "status"],
] as const;

const Meanings: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex w-full max-w-120 flex-col gap-2 p-6">
      {meanings.map(([variant, words]) => (
        <Alert key={variant} variant={variant}>
          <AlertTitle>{words}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Alert>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const text = colourOf("var(--foreground)", canvasElement);
    const shapes = new Set<string>();
    for (const [variant, words, role] of meanings) {
      const alert = canvas.getByRole(role, { name: words });
      const icon = alert.querySelector("svg") as SVGElement;
      const colour = colourOf(`var(--${variant})`, canvasElement);

      await expect(alert).toHaveAttribute("data-variant", variant);
      await expect(getComputedStyle(within(alert).getByText(words)).color).toBe(
        colour,
      );
      await expect(
        getComputedStyle(slot(alert, "alert-description")).color,
      ).toBe(text);
      await expect(getComputedStyle(icon).color).toBe(colour);
      await expect(icon).toHaveAttribute("aria-hidden", "true");
      // A tint of its own, neither the card's nor none.
      await expect(getComputedStyle(alert).backgroundColor).not.toBe(
        backgroundOf("var(--card)", canvasElement),
      );
      await expect(getComputedStyle(alert).backgroundColor).not.toBe(
        "rgba(0, 0, 0, 0)",
      );
      shapes.add(icon.innerHTML);
    }
    // Each meaning an icon of its own shape.
    await expect(shapes.size).toBe(meanings.length);
  },
};

// An icon the app writes, on an alert with no meaning.
const OwnIcon: Story = {
  args: {
    children: (
      <>
        <WalletIcon />
        <AlertTitle>{title}</AlertTitle>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll("svg")).toHaveLength(1);
  },
};

// A name given by hand wins over its title's.
const NamedByHand: Story = {
  tags: ["!autodocs"],
  args: { "aria-label": named },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("status", { name: named }),
    ).toBeVisible();
  },
};

// With no title, no name, and none pointing nowhere.
const WithoutTitle: Story = {
  tags: ["!autodocs"],
  args: { children: <AlertDescription>{description}</AlertDescription> },
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole("status");

    await expect(alert).not.toHaveAttribute("aria-labelledby");
    await expect(alert).toHaveAccessibleName("");
  },
};

// Its actions at its end, beside its words, 8 px apart, at the top of its title.
const Action: Story = {
  args: {
    variant: "destructive",
    children: (
      <>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">
            {second}
          </Button>
          <Button size="sm">{action}</Button>
        </AlertAction>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-180">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const words = slot(
      canvasElement,
      "alert-description",
    ).getBoundingClientRect();
    const [first, last] = [second, action].map((name) =>
      canvas.getByRole("button", { name }).getBoundingClientRect(),
    ) as [DOMRect, DOMRect];

    await expect(Math.round(first.left)).toBeGreaterThanOrEqual(
      Math.round(words.right),
    );
    await expect(Math.round(last.left - first.right)).toBe(betweenControls);
    await expect(Math.round(first.top)).toBeLessThan(Math.round(words.top));
  },
};

// Narrow, its actions move under its words, lined up with them, and nothing leaves it.
const NarrowAction: Story = {
  ...Action,
  tags: ["!autodocs"],
  args: {
    ...Action.args,
    children: (
      <>
        <AlertTitle>{longTitle}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
        <AlertAction>
          <Button size="sm">{action}</Button>
        </AlertAction>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const alert = within(canvasElement).getByRole("alert");
    const words = slot(
      canvasElement,
      "alert-description",
    ).getBoundingClientRect();
    const button = within(canvasElement)
      .getByRole("button", { name: action })
      .getBoundingClientRect();

    await expect(Math.round(button.top)).toBeGreaterThanOrEqual(
      Math.round(words.bottom),
    );
    await expect(Math.round(button.left)).toBe(Math.round(words.left));
    await expect(alert.scrollWidth).toBe(alert.clientWidth);
  },
};

// A paragraph and a list in its description: paragraphs 8 px apart, and a list with markers, 4 px between items.
const LongText: Story = {
  args: {
    variant: "warning",
    children: (
      <>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>
          <p>{reason}</p>
          <p>{description}</p>
          <ul>
            {sales.map((sale) => (
              <li key={sale}>{sale}</li>
            ))}
          </ul>
        </AlertDescription>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [first, next] = [reason, description].map((words) =>
      canvas.getByText(words).getBoundingClientRect(),
    ) as [DOMRect, DOMRect];
    const items = canvas.getAllByRole("listitem");
    const [one, two] = items.map((item) => item.getBoundingClientRect()) as [
      DOMRect,
      DOMRect,
    ];

    await expect(Math.round(next.top - first.bottom)).toBe(betweenParagraphs);
    await expect(Math.round(two.top - one.bottom)).toBe(betweenItems);
    await expect(getComputedStyle(canvas.getByRole("list")).listStyleType).toBe(
      "disc",
    );
  },
};

export default meta;
export {
  Action,
  Default,
  LongText,
  Meanings,
  NamedByHand,
  NarrowAction,
  OwnIcon,
  WithoutTitle,
};
