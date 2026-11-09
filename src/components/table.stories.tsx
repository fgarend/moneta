import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

const name = "Payments";
const description = "Description";
const amount = "Amount";
const payee = "Fictitious rent";
const paid = "1,250.00";
const total = "Total";
const caption = "Fictitious payments of October";

const headSize = "13px";
const cellSpacing = "12px";
const edgeSpacing = "20px";

const meta = {
  title: "Components/Display & Media/Table",
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
    // The scale the theme sets: a quiet header, and rows with room.
    await expect(
      getComputedStyle(canvas.getByRole("columnheader", { name: amount }))
        .fontSize,
    ).toBe(headSize);
    await expect(
      getComputedStyle(canvas.getByRole("gridcell", { name: paid })).paddingTop,
    ).toBe(cellSpacing);
    await expect(
      getComputedStyle(canvas.getByRole("rowheader", { name: payee }))
        .paddingLeft,
    ).toBe(edgeSpacing);
    await expect(canvas.getByRole("gridcell", { name: paid })).toBeVisible();
  },
};

// A total in a footer, and a caption under the table, inside a figure as a figcaption needs one.
const WithFooterAndCaption: Story = {
  render: (args) => (
    <figure>
      <Table {...args}>
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
        <TableFooter>
          <TableRow>
            <TableCell>{total}</TableCell>
            <TableCell>{paid}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <TableCaption>{caption}</TableCaption>
    </figure>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole("rowheader", { name: total })).toBeVisible();
    await expect(canvas.getByText(caption)).toBeVisible();
  },
};

export default meta;
export { Default, WithFooterAndCaption };
