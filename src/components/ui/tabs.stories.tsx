import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

const list = "Account views";
const balance = "Balance";
const history = "History";
const content = "Balance 1,250.00";

const meta = {
  title: "UI/Tabs",
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

export default meta;
export { Default };
