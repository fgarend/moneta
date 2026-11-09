import type { Meta, StoryObj } from "@storybook/react-vite";
import { Autocomplete } from "react-aria-components";
import { expect, userEvent, within } from "storybook/test";
import { settled } from "../../.storybook/settled.js";
import {
  Select,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectInput,
  SelectItem,
  SelectLabel,
  SelectList,
  SelectPopover,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select.js";

const name = "Account";
const placeholder = "Choose an account";
const savings = "Savings";
const checking = "Checking";

const controlHeight = 36;

const meta = {
  title: "Components/Form & Input/Select",
  component: Select,
  tags: ["raw", "gap-forced-colors"],
  args: {
    "aria-label": name,
    placeholder,
    children: (
      <>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem>{savings}</SelectItem>
          <SelectItem>{checking}</SelectItem>
        </SelectContent>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

type Story = StoryObj<typeof meta>;

// The keys React Aria knows each item by, which no element takes as its id.
const checkingKey = "checking";
const investmentsKey = "investments";
const savingsKey = "savings";

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="select-trigger"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    const trigger = within(canvasElement).getByRole("button", {
      name: new RegExp(name, "u"),
    });

    await expect(trigger).toHaveTextContent(placeholder);
    await expect(
      within(document.body).queryByRole("listbox"),
    ).not.toBeInTheDocument();
  },
};

const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", {
        name: new RegExp(name, "u"),
      }),
    );
    const list = await within(document.body).findByRole("listbox");

    await settled(list);
    await expect(
      within(list).getByRole("option", { name: savings }),
    ).toBeInTheDocument();
    await expect(
      within(list).getByRole("option", { name: checking }),
    ).toBeInTheDocument();
  },
};

const investments = "Investments";
const everyday = "Everyday";
const search = "Search accounts";
const nothing = "No account found";

// Opens the select by its trigger, and returns its list settled.
async function openList(canvasElement: HTMLElement): Promise<HTMLElement> {
  await userEvent.click(
    within(canvasElement).getByRole("button", { name: new RegExp(name, "u") }),
  );
  const list = await within(document.body).findByRole("listbox");
  await settled(list);
  return list;
}

// Options in groups, with a label and a line between them, one chosen, and one whose words are its own.
const Grouped: Story = {
  args: {
    defaultValue: checkingKey,
    children: (
      <>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{everyday}</SelectLabel>
            <SelectItem id={checkingKey}>{checking}</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectItem id={investmentsKey} textValue={investments}>
              <span>{investments}</span>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const list = within(await openList(canvasElement));

    await expect(list.getByText(everyday)).toBeInTheDocument();
    await expect(list.queryByRole("separator")).not.toBeInTheDocument();
    await expect(
      document.querySelector('[data-slot="select-separator"]'),
    ).toBeInTheDocument();
    await expect(list.getByRole("option", { name: checking })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      list.getByRole("option", { name: investments }),
    ).toBeInTheDocument();
  },
};

// Several chosen, which the trigger says together.
const Multiple: Story = {
  args: {
    selectionMode: "multiple",
    defaultValue: [savingsKey, checkingKey],
    children: (
      <>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem id={savingsKey}>{savings}</SelectItem>
          <SelectItem id={checkingKey}>{checking}</SelectItem>
        </SelectContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole("button", {
      name: new RegExp(name, "u"),
    });

    await expect(trigger).toHaveTextContent(savings);
    await expect(trigger).toHaveTextContent(checking);
  },
};

// The chosen value as the page words it.
const WordedValue: Story = {
  args: {
    defaultValue: savingsKey,
    children: (
      <>
        <SelectTrigger>
          <SelectValue>
            {({ selectedText }) => `${selectedText} account`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem id={savingsKey}>{savings}</SelectItem>
        </SelectContent>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: new RegExp(name, "u"),
      }),
    ).toHaveTextContent(`${savings} account`);
  },
};

// A search above the options, which says so when nothing matches.
const Searchable: Story = {
  args: {
    children: (
      <>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectPopover>
          <Autocomplete
            filter={(text, query) =>
              text.toLowerCase().includes(query.toLowerCase())
            }
          >
            <SelectInput aria-label={search} />
            <SelectList
              renderEmptyState={() => <SelectEmpty>{nothing}</SelectEmpty>}
            >
              <SelectItem id={savingsKey}>{savings}</SelectItem>
              <SelectItem id={checkingKey}>{checking}</SelectItem>
            </SelectList>
          </Autocomplete>
        </SelectPopover>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const list = await openList(canvasElement);
    const field = within(document.body).getByRole("searchbox", {
      name: search,
    });

    await userEvent.type(field, "zz");
    await expect(within(list).getByText(nothing)).toBeInTheDocument();
  },
};

export default meta;
export { Default, Grouped, Multiple, Open, Searchable, WordedValue };
