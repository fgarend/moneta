import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const name = "Payments";
const description = "Description";
const amount = "Amount";
const payee = "Fictitious rent";
const paid = "1,250.00";

const meta = {
  title: "UI/Table",
  component: Table,
  tags: ["raw"],
  args: {
    "aria-label": name,
    children: (
      <>
        <TableHeader>
          <TableHead isRowHeader={true}>{description}</TableHead>
          <TableHead>{amount}</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{payee}</TableCell>
            <TableCell>{paid}</TableCell>
          </TableRow>
        </TableBody>
      </>
    ),
  },
} satisfies Meta<typeof Table>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("grid", { name })).toBeVisible();
    await expect(
      canvas.getByRole("columnheader", { name: amount }),
    ).toBeVisible();
    await expect(canvas.getByRole("rowheader", { name: payee })).toBeVisible();
    await expect(canvas.getByRole("gridcell", { name: paid })).toBeVisible();
  },
};

export default meta;
export { Default };
