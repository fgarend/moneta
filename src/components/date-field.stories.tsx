import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria-components";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import { DateField } from "./date-field.js";

const label = "Date";
const description = "The day the payment left the account.";
const tooEarly = "Choose a day from June on.";
const missing = "Choose a day.";
const day = "2026-10-24";
const onChange = fn();

// What the guidelines give a field: 36 px, or 32 at size="sm"; and each part a target of 24 px, whatever the font.
const defaultHeight = 36;
const smallHeight = 32;
const target = 24;

// Each part's width and height, rounded, as axe measures a target.
function targets(canvasElement: HTMLElement): number[] {
  return segments(canvasElement).flatMap((part) => {
    const { width, height: tall } = part.getBoundingClientRect();
    return [Math.floor(width), Math.floor(tall)];
  });
}

// The colour a value of the theme resolves to where the field sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// The invalid edge, as Input draws it: the destructive colour, at half in dark.
function invalidBorder(): string {
  return document.documentElement.classList.contains("dark")
    ? "color-mix(in oklab, var(--destructive) 50%, transparent)"
    : "var(--destructive)";
}

function segments(canvasElement: HTMLElement): HTMLElement[] {
  return within(canvasElement).getAllByRole("spinbutton");
}

function box(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector('[data-slot="date-input"]') as HTMLElement;
}

// What a part is described by, every text its ids point to.
function describedBy(part: Element): string[] {
  return (part.getAttribute("aria-describedby") ?? "")
    .split(" ")
    .map((id) => document.getElementById(id)?.textContent ?? "");
}

// Storybook cannot type a field whose name is one of two props, so each story draws its own.
const meta = {
  title: "Components/Form & Input/DateField",
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <div className="w-64">
          <Story />
        </div>
      </I18nProvider>
    ),
  ],
} satisfies Meta;

type Story = StoryObj<typeof meta>;

// A day in the language's order, its label naming each part, and its description heard with it, at 36 px.
const Default: Story = {
  tags: ["visual"],
  render: () => (
    <DateField defaultValue={day} description={description} label={label} />
  ),
  play: async ({ canvasElement }) => {
    const parts = segments(canvasElement);
    const [first] = parts as [HTMLElement];

    await expect(parts.map((part) => part.textContent)).toEqual([
      "24",
      "10",
      "2026",
    ]);
    await expect(within(canvasElement).getByRole("group")).toHaveAccessibleName(
      label,
    );
    await expect(describedBy(first)).toContain(description);
    await expect(
      Math.round(box(canvasElement).getBoundingClientRect().height),
    ).toBe(defaultHeight);
  },
};

// Typed in, part by part: the app hears the ISO day once it is whole, and null once it is cleared. Each part is typed
// once focus has moved to it, as a person sees it move: React Aria moves it after a whole part, and a loaded browser
// can take a key's time to do so, so keys typed at once land in the part before.
const Typing: Story = {
  render: () => <DateField label={label} onChange={onChange} />,
  play: async ({ canvasElement }) => {
    const [dayPart, month, year] = segments(canvasElement) as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    onChange.mockClear();

    await userEvent.click(dayPart);
    await userEvent.keyboard("24");
    await waitFor(() => expect(month).toHaveFocus());
    await userEvent.keyboard("10");
    await waitFor(() => expect(year).toHaveFocus());
    await userEvent.keyboard("2026");
    await expect(onChange).toHaveBeenLastCalledWith(day);

    // Each part cleared where it is, as Backspace on an empty part moves back to the one before.
    for (const [part, digits] of [
      [year, 4],
      [month, 2],
      [dayPart, 2],
    ] as const) {
      await userEvent.click(part);
      await userEvent.keyboard("{Backspace}".repeat(digits));
    }
    await expect(onChange).toHaveBeenLastCalledWith(null);
  },
};

// Controlled by the app, which gives the ISO day.
const Controlled: Story = {
  render: () => <DateField label={label} value="2001-01-01" />,
  play: async ({ canvasElement }) => {
    await expect(
      segments(canvasElement).map((part) => part.textContent),
    ).toEqual(["01", "01", "2001"]);
  },
};

// Small, for a dense place, as a page's tools; named by aria-label where its label is elsewhere. Its parts, as the
// default's, are 24 px each way, in a narrow font as in Geist, so an app's font cannot shrink them.
const Small: Story = {
  render: () => <DateField aria-label={label} defaultValue={day} size="sm" />,
  play: async ({ canvasElement }) => {
    for (const font of ["", "Arial Narrow, sans-serif"]) {
      canvasElement.style.fontFamily = font;
      await expect(targets(canvasElement).every((side) => side >= target)).toBe(
        true,
      );
    }
    canvasElement.style.fontFamily = "";
    await expect(
      Math.round(box(canvasElement).getBoundingClientRect().height),
    ).toBe(smallHeight);
    await expect(within(canvasElement).getByRole("group")).toHaveAccessibleName(
      label,
    );
  },
};

// A day before its least: the app's message, heard with it, and the field drawn in the destructive colour.
const Invalid: Story = {
  render: () => (
    <DateField
      defaultValue="2026-01-01"
      errorMessage={tooEarly}
      label={label}
      minValue="2026-06-01"
    />
  ),
  play: async ({ canvasElement }) => {
    const [first] = segments(canvasElement) as [HTMLElement];

    await expect(within(canvasElement).getByText(tooEarly)).toBeVisible();
    await expect(first).toHaveAttribute("aria-invalid", "true");
    await expect(describedBy(first)).toContain(tooEarly);
    await expect(getComputedStyle(box(canvasElement)).borderTopColor).toBe(
      colourOf(invalidBorder(), canvasElement),
    );
  },
};

// Invalid as the app or its server says, with the app's words.
const InvalidByApp: Story = {
  render: () => (
    <DateField
      defaultValue={day}
      errorMessage={missing}
      isInvalid={true}
      label={label}
      maxValue="2030-12-31"
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText(missing)).toBeVisible();
  },
};

// Disabled: dimmed, and out of reach.
const Disabled: Story = {
  render: () => (
    <DateField defaultValue={day} isDisabled={true} label={label} />
  ),
  play: async ({ canvasElement }) => {
    const [first] = segments(canvasElement) as [HTMLElement];

    await expect(first).toHaveAttribute("aria-disabled", "true");
    await expect(getComputedStyle(box(canvasElement)).opacity).toBe("0.5");
  },
};

// A value that is not an ISO day says so, rather than show a wrong day; a day that does not exist too.
const NotIso: Story = {
  render: () => (
    <>
      <p>
        <Caught>
          <DateField defaultValue="24/10/2026" label={label} />
        </Caught>
      </p>
      <p>
        <Caught>
          <DateField defaultValue="2026-02-30" label={label} />
        </Caught>
      </p>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText(
        'DateField: "24/10/2026" is not an ISO day, as "2026-10-24".',
      ),
    ).toBeVisible();
    await expect(
      canvas.getByText(
        'DateField: "2026-02-30" is not an ISO day, as "2026-10-24".',
      ),
    ).toBeVisible();
  },
};

// Each size of the scale, so a field lines up with the buttons beside it: 32, 36 and 40 px.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex flex-col gap-3">
      {sizes.map((size) => (
        <DateField
          aria-label={`${label} ${size}`}
          defaultValue={day}
          key={size}
          size={size}
        />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = [
      ...canvasElement.querySelectorAll('[data-slot="date-input"]'),
    ];

    await expect(controls.map(height)).toEqual(
      sizes.map((size) => scale[size]),
    );
  },
};

export default meta;
export {
  Controlled,
  Default,
  Disabled,
  Invalid,
  InvalidByApp,
  NotIso,
  Sizes,
  Small,
  Typing,
};
