import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "./field.js";
import { Input } from "./input.js";

const legend = "Payment";
const label = "Reference";
const description = "Shown on the statement.";
const error = "Enter a reference.";
const inputId = "field-reference";
const descriptionId = "field-reference-description";
const errorId = "field-reference-error";

const meta = {
  title: "Components/Form & Input/Field",
  component: Field,
  tags: ["raw"],
  decorators: [
    (Story) => (
      <FieldSet>
        <FieldLegend>{legend}</FieldLegend>
        <Story />
      </FieldSet>
    ),
  ],
  args: {
    children: (
      <>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        <Input aria-describedby={descriptionId} id={inputId} />
        <FieldDescription id={descriptionId}>{description}</FieldDescription>
      </>
    ),
  },
} satisfies Meta<typeof Field>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("group", { name: legend })).toBeVisible();
    await expect(
      canvas.getByRole("textbox", { name: label }),
    ).toHaveAccessibleDescription(description);
  },
};

const Invalid: Story = {
  render: () => (
    <Field data-invalid={true}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <Input aria-describedby={errorId} aria-invalid={true} id={inputId} />
      <FieldError id={errorId}>{error}</FieldError>
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: label });

    await expect(canvas.getByRole("alert")).toHaveTextContent(error);
    await expect(input).toBeInvalid();
    await expect(input).toHaveAccessibleDescription(error);
  },
};

const title = "Round up";
const or = "or";
const first = "Enter an amount.";
const second = "Choose an account.";

// The parts that lay fields out: a group, a field across with its content and title, and lines between them.
const Composed: Story = {
  render: () => (
    <FieldSet>
      <FieldLegend variant="label">{legend}</FieldLegend>
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>{title}</FieldTitle>
            <FieldDescription>{description}</FieldDescription>
          </FieldContent>
        </Field>
        <FieldSeparator />
        <FieldSeparator>{or}</FieldSeparator>
      </FieldGroup>
    </FieldSet>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(title)).toBeVisible();
    await expect(canvas.getByText(or)).toBeVisible();
    await expect(
      canvasElement.querySelectorAll('[data-slot="field-separator"]'),
    ).toHaveLength(2);
  },
};

// Errors given as a list: one is said alone, several as a list with each once, and none draws nothing.
const ErrorList: Story = {
  render: () => (
    <>
      <FieldError errors={[{ message: first }]} />
      <FieldError
        errors={[
          { message: first },
          { message: first },
          undefined,
          { message: second },
        ]}
      />
      <FieldError errors={[]} />
    </>
  ),
  play: async ({ canvasElement }) => {
    const [alone, several, ...rest] =
      within(canvasElement).getAllByRole("alert");

    await expect(rest).toHaveLength(0);
    await expect(alone).toHaveTextContent(first);
    await expect(
      within(several as HTMLElement)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual([first, second]);
  },
};

export default meta;
export { Composed, Default, ErrorList, Invalid };
