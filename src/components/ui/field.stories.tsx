import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
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

export default meta;
export { Default, Invalid };
