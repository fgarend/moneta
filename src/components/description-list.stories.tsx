import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { accountDetails } from "../../.storybook/data.js";
import { Amount } from "./amount.js";
import { DateTime } from "./date-time.js";
import {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from "./description-list.js";

const terms = ["Holder", "Institution", "Opened", "Balance"];
// What the guidelines give it: 8 px between pairs, and one above the other below 288 px of its own width.
const between = 8;
const wide = "max-w-96";
const narrow = "w-60";

function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function details() {
  return (
    <>
      <DescriptionItem>
        <DescriptionTerm>{terms[0]}</DescriptionTerm>
        <DescriptionDetails>{accountDetails.holder}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{terms[1]}</DescriptionTerm>
        <DescriptionDetails>{accountDetails.institution}</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{terms[2]}</DescriptionTerm>
        <DescriptionDetails>
          <DateTime value={accountDetails.opened} />
        </DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>{terms[3]}</DescriptionTerm>
        <DescriptionDetails>
          <Amount value={accountDetails.balance} />
        </DescriptionDetails>
      </DescriptionItem>
    </>
  );
}

const meta = {
  title: "Components/Display & Media/Description List",
  component: DescriptionList,
  args: { children: details() },
} satisfies Meta<typeof DescriptionList>;

type Story = StoryObj<typeof meta>;

// One account's details, each a term and its value, side by side with the value at the end, 8 px apart.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className={`${wide} p-6`}>
      <DescriptionList {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const list = canvasElement.querySelector("dl") as HTMLElement;
    const items = [...list.children];
    const [first, second] = items.map((item) => item.getBoundingClientRect());
    const term = within(canvasElement).getByText(terms[0] ?? "");
    const value = within(canvasElement).getByText(accountDetails.holder);

    await expect(items).toHaveLength(terms.length);
    for (const item of items) {
      await expect([...item.children].map(({ tagName }) => tagName)).toEqual([
        "DT",
        "DD",
      ]);
    }
    await expect((second?.top ?? 0) - (first?.bottom ?? 0)).toBe(between);
    await expect(Math.round(value.getBoundingClientRect().top)).toBe(
      Math.round(term.getBoundingClientRect().top),
    );
    await expect(getComputedStyle(value).textAlign).toBe("end");
    await expect(getComputedStyle(term).color).toBe(
      colourOf("var(--muted-foreground)", canvasElement),
    );
  },
};

// Narrower than 288 px, each term above its value, both at the start.
const Narrow: Story = {
  tags: ["visual"],
  render: (args) => (
    <div className={`${narrow} p-6`}>
      <DescriptionList {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const term = within(canvasElement).getByText(terms[0] ?? "");
    const value = within(canvasElement).getByText(accountDetails.holder);

    await expect(value.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      term.getBoundingClientRect().bottom,
    );
    await expect(getComputedStyle(value).textAlign).toBe("start");
  },
};

export default meta;
export { Default, Narrow };
