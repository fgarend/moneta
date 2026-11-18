import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "react-aria-components";
import { expect, fn, userEvent, within } from "storybook/test";
import { contrast } from "../../.storybook/contrast.js";
import { Button } from "./button.js";
import {
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./field.js";
import { Input } from "./input.js";
import { TextField } from "./text-field.js";
import { Textarea } from "./textarea.js";

const label = "Reference";
const description = "Shown on the statement.";
const error = "Enter a reference.";
const other = "Use letters and numbers only.";
const value = "Fictitious rent";
const send = "Send";
const longLabel =
  "The reference the fictitious household gives every monthly transfer to its landlord";

// What the guidelines give a field: its label 8 px over the box, at 14/20 and 500.
const toBox = 8;
const labelSize = "14px";
const labelLine = "20px";
const labelWeight = "500";
const required = "*";
const textContrast = 4.5;
const half = "0.5";
const transparent = "rgba(0, 0, 0, 0)";

const onSubmit = fn();

function edges(element: Element): DOMRect {
  return element.getBoundingClientRect();
}

// The colour a value of the theme resolves to where the field sits, in light and in dark.
function colourOf(token: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = token;
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

function labelOf(canvasElement: HTMLElement): HTMLElement {
  return canvasElement.querySelector(
    '[data-slot="field-label"]',
  ) as HTMLElement;
}

// The mark of a required field, which a screen reader skips, as it hears the field is required.
function markOf(canvasElement: HTMLElement): HTMLElement | null {
  return labelOf(canvasElement).querySelector('[aria-hidden="true"]');
}

const meta = {
  title: "Components/Form & Input/TextField",
  component: TextField,
  decorators: [
    (Story) => (
      <div className="w-full max-w-80">
        <Story />
      </div>
    ),
  ],
  args: {
    children: (
      <>
        <FieldLabel>{label}</FieldLabel>
        <Input />
        <FieldDescription>{description}</FieldDescription>
      </>
    ),
  },
} satisfies Meta<typeof TextField>;

type Story = StoryObj<typeof meta>;

// Its label names the box and its description describes it, linked by the field with no id of the app's, the label
// 8 px over the box, at 14/20 and 500.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name: label });
    const words = labelOf(canvasElement);

    await expect(box).toHaveAccessibleDescription(description);
    await expect(within(canvasElement).getByText(description).tagName).toBe(
      "P",
    );
    await expect(edges(box).top - edges(words).bottom).toBe(toBox);
    await expect(getComputedStyle(words).fontSize).toBe(labelSize);
    await expect(getComputedStyle(words).lineHeight).toBe(labelLine);
    await expect(getComputedStyle(words).fontWeight).toBe(labelWeight);
  },
};

// Required: an asterisk after the label, in its colour, which a screen reader skips, as it hears the field required.
const Required: Story = {
  tags: ["visual"],
  args: { isRequired: true },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name: label });
    const mark = markOf(canvasElement);

    await expect(box).toBeRequired();
    await expect(mark).toHaveTextContent(required);
    await expect(mark).toBeVisible();
    await expect(getComputedStyle(mark as HTMLElement).color).toBe(
      getComputedStyle(labelOf(canvasElement)).color,
    );
  },
};

// Invalid: the app's words, heard with the box and not as an alert, the edge and the label in the destructive colour.
const Invalid: Story = {
  tags: ["visual"],
  args: {
    isInvalid: true,
    children: (
      <>
        <FieldLabel>{label}</FieldLabel>
        <Input />
        <FieldError>{error}</FieldError>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("textbox", { name: label });

    await expect(box).toBeInvalid();
    await expect(box).toHaveAccessibleDescription(error);
    await expect(canvas.queryByRole("alert")).toBeNull();
    await expect(getComputedStyle(box).borderTopColor).toBe(
      colourOf(invalidBorder(), canvasElement),
    );
    await expect(getComputedStyle(labelOf(canvasElement)).color).toBe(
      colourOf("var(--destructive)", canvasElement),
    );
  },
};

// An error given while the field is valid draws nothing, so no error shows beside a field said to be valid.
const ErrorOnlyWhenInvalid: Story = {
  args: {
    children: (
      <>
        <FieldLabel>{label}</FieldLabel>
        <Input />
        <FieldError>{error}</FieldError>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByText(error)).toBeNull();
    await expect(canvas.getByRole("textbox", { name: label })).toBeValid();
  },
};

// In a form, a required field left empty stops the submit and takes the focus, with its error; a form that says
// "aria" lets the submit through, as a form library decides.
const InAForm: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <Form data-testid="native" onSubmit={(event) => event.preventDefault()}>
        <TextField isRequired={true}>
          <FieldLabel>{label}</FieldLabel>
          <Input />
          <FieldError>{error}</FieldError>
        </TextField>
        <Button type="submit">{send}</Button>
      </Form>
      <Form
        data-testid="aria"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
        validationBehavior="aria"
      >
        <TextField isRequired={true}>
          <FieldLabel>{label}</FieldLabel>
          <Input />
          <FieldError>{error}</FieldError>
        </TextField>
        <Button type="submit">{send}</Button>
      </Form>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const native = within(canvas.getByTestId("native"));
    const aria = within(canvas.getByTestId("aria"));

    await userEvent.click(native.getByRole("button", { name: send }));
    await expect(native.getByRole("textbox", { name: label })).toHaveFocus();
    await expect(native.getByText(error)).toBeVisible();

    await userEvent.click(aria.getByRole("button", { name: send }));
    await expect(onSubmit).toHaveBeenCalledOnce();
  },
};

// An error with no words of the app's shows the browser's own message, in the browser's language, which the
// guidelines ask the app to replace with its own.
const BrowserMessage: Story = {
  render: () => (
    <Form onSubmit={(event) => event.preventDefault()}>
      <TextField isRequired={true}>
        <FieldLabel>{label}</FieldLabel>
        <Input />
        <FieldError />
      </TextField>
      <Button type="submit">{send}</Button>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: send }));
    const box = canvas.getByRole("textbox", { name: label });
    const message = canvasElement.querySelector('[data-slot="field-error"]');

    await expect(message?.textContent?.length).toBeGreaterThan(0);
    await expect(box).toHaveAccessibleDescription(
      message?.textContent as string,
    );
  },
};

// Read-only: a filled box with no border, its text at full contrast, still reached by keyboard and copied.
const ReadOnly: Story = {
  tags: ["visual"],
  args: { isReadOnly: true, defaultValue: value },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name: label });

    await expect(box).toHaveAttribute("readonly");
    await expect(getComputedStyle(box).backgroundColor).toBe(
      colourOf("var(--muted)", canvasElement),
    );
    await expect(getComputedStyle(box).borderTopColor).toBe(transparent);
    await expect(contrast(box)).toBeGreaterThanOrEqual(textContrast);
    await userEvent.tab();
    await expect(box).toHaveFocus();
  },
};

// Disabled: the label and the box at half, and out of reach.
const Disabled: Story = {
  tags: ["visual"],
  args: { isDisabled: true, defaultValue: value },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name: label });

    await expect(box).toBeDisabled();
    await expect(getComputedStyle(labelOf(canvasElement)).opacity).toBe(half);
  },
};

// Several lines: a Textarea in the field, named and described as an Input is.
const Multiline: Story = {
  args: {
    children: (
      <>
        <FieldLabel>{label}</FieldLabel>
        <Textarea />
        <FieldDescription>{description}</FieldDescription>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name: label });

    await expect(box.tagName).toBe("TEXTAREA");
    await expect(box).toHaveAccessibleDescription(description);
  },
};

// A label longer than its place wraps, on lines of 20 px, at the narrowest screen.
const LongLabel: Story = {
  tags: ["visual"],
  args: {
    isRequired: true,
    children: (
      <>
        <FieldLabel>{longLabel}</FieldLabel>
        <Input />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const words = labelOf(canvasElement);

    await expect(words.scrollWidth).toBe(words.clientWidth);
    await expect(edges(words).height).toBeGreaterThan(
      Number.parseInt(labelLine, 10),
    );
  },
};

// Across: the label beside the box, as Field lays one, and the box and its words together in a FieldContent.
const Across: Story = {
  tags: ["visual"],
  args: {
    orientation: "horizontal",
    children: (
      <>
        <FieldLabel>{label}</FieldLabel>
        <FieldContent>
          <Input />
          <FieldDescription>{description}</FieldDescription>
        </FieldContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const box = within(canvasElement).getByRole("textbox", { name: label });

    await expect(edges(labelOf(canvasElement)).right).toBeLessThanOrEqual(
      edges(box).left,
    );
    await expect(box).toHaveAccessibleDescription(description);
    await expect(
      edges(within(canvasElement).getByText(description)).top,
    ).toBeGreaterThanOrEqual(edges(box).bottom);
  },
};

// Errors given as a list, as a form library gives them: several as a list, each heard with the box.
const ErrorList: Story = {
  args: {
    isInvalid: true,
    children: (
      <>
        <FieldLabel>{label}</FieldLabel>
        <Input />
        <FieldError errors={[{ message: error }, { message: other }]} />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("textbox", { name: label });

    await expect(
      canvas.getAllByRole("listitem").map((item) => item.textContent),
    ).toEqual([error, other]);
    await expect(box).toHaveAccessibleDescription(`${error} ${other}`);
  },
};

export default meta;
export {
  Across,
  BrowserMessage,
  Default,
  Disabled,
  ErrorList,
  ErrorOnlyWhenInvalid,
  InAForm,
  Invalid,
  LongLabel,
  Multiline,
  ReadOnly,
  Required,
};
