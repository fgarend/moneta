import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { height, scale, sizes } from "../../.storybook/sizes.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const list = "Account views";
const balance = "Balance";
const history = "History";
const content = "Balance 1,250.00";

const controlHeight = 36;

const meta = {
  title: "Components/Layout & Navigation/Tabs",
  component: Tabs,
  tags: ["raw"],
  args: {
    children: (
      <>
        <TabsList aria-label={list}>
          <TabsTrigger id={balance}>{balance}</TabsTrigger>
          <TabsTrigger id={history}>{history}</TabsTrigger>
        </TabsList>
        <TabsContent id={balance}>{content}</TabsContent>
        <TabsContent id={history}>{history}</TabsContent>
      </>
    ),
  },
} satisfies Meta<typeof Tabs>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '[data-slot="tabs-list"]',
    );

    await expect(control?.offsetHeight).toBe(controlHeight);
    const canvas = within(canvasElement);

    await expect(
      within(canvas.getByRole("tablist", { name: list })).getByRole("tab", {
        name: balance,
        selected: true,
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("tabpanel", { name: balance }),
    ).toHaveTextContent(content);
  },
};

// Each size of the scale, so tabs line up with the buttons beside them: 32, 36 and 40 px.
const Sizes: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex items-start gap-3">
      {sizes.map((size) => (
        <Tabs key={size}>
          <TabsList aria-label={`${list} ${size}`} size={size}>
            <TabsTrigger id={balance}>{balance}</TabsTrigger>
            <TabsTrigger id={history}>{history}</TabsTrigger>
          </TabsList>
          <TabsContent id={balance}>{content}</TabsContent>
          <TabsContent id={history}>{history}</TabsContent>
        </Tabs>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const controls = [
      ...canvasElement.querySelectorAll('[data-slot="tabs-list"]'),
    ];

    await expect(controls.map(height)).toEqual(
      sizes.map((size) => scale[size]),
    );
  },
};

export default meta;
export { Default, Sizes };
