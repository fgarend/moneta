import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ChartLineIcon,
  ChartPieIcon,
  FileTextIcon,
  LandmarkIcon,
  UsersIcon,
} from "lucide-react";
import type { ReactElement } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { left } from "../../.storybook/settled.js";
import { MonetaProvider } from "./moneta-provider.js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar.js";

const name = "Main";
const close = "Close the menu";
const open = "Open the menu";
const brand = "Fictitious Finance";
const investments = "Investments";
const people = "People and accounts";
const current = "Positions";
const longLabel = "Movements between accounts and their reconciliation";
const navigate = fn();

// What the guidelines give it: 256 px wide, items of 36 px, and icons of 16.
const width = 256;
const itemHeight = 36;
const iconSize = 16;

// The colour a value of the theme resolves to where the sidebar sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

// The story's navigation, with the current link's words.
function navigation(label = current): ReactElement {
  return (
    <Sidebar aria-label={name} closeLabel={close}>
      <SidebarHeader>{brand}</SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{investments}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/statements">
                <FileTextIcon />
                Statements
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/positions" isActive={true}>
                <ChartPieIcon />
                {label}
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/growth">
                <ChartLineIcon />
                Growth
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{people}</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/people">
                <UsersIcon />
                People
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/accounts">
                <LandmarkIcon />
                Accounts
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>Signed in as a fictitious person</SidebarFooter>
    </Sidebar>
  );
}

// The app's router takes every link, as MonetaProvider passes it on.
const meta = {
  title: "Components/Layout & Navigation/Sidebar",
  decorators: [
    (Story) => (
      <MonetaProvider navigate={navigate}>
        <div className="flex h-150">
          <Story />
        </div>
      </MonetaProvider>
    ),
  ],
  render: () => (
    <SidebarProvider>
      {navigation()}
      <SidebarTrigger aria-label={open} />
    </SidebarProvider>
  ),
} satisfies Meta;

type Story = StoryObj<typeof meta>;

// A named navigation of lists, each named by its section's label, the current page marked for every reader: its
// link said to be the page, and drawn with a bar, a bolder text and a gold icon.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name });
    const link = canvas.getByRole("link", { name: current });
    const other = canvas.getByRole("link", { name: "Growth" });
    const [icon] = [...link.querySelectorAll("svg")];

    await expect(
      within(nav).getByRole("list", { name: investments }),
    ).toBeVisible();
    await expect(within(nav).getByRole("list", { name: people })).toBeVisible();
    await expect(link).toHaveAttribute("aria-current", "page");
    await expect(other).not.toHaveAttribute("aria-current");
    await expect(getComputedStyle(link).fontWeight).toBe("500");
    await expect(getComputedStyle(link).borderLeftColor).toBe(
      colourOf("var(--sidebar-accent-foreground)", nav),
    );
    await expect(getComputedStyle(link).borderLeftWidth).toBe("4px");
    await expect(getComputedStyle(other).borderLeftWidth).toBe("0px");
    await expect(getComputedStyle(icon as Element).color).toBe(
      colourOf("var(--sidebar-primary)", nav),
    );
    await expect(Math.round(nav.getBoundingClientRect().width)).toBe(width);
    await expect(Math.round(other.getBoundingClientRect().height)).toBe(
      itemHeight,
    );
    await expect(
      Math.round((icon as Element).getBoundingClientRect().width),
    ).toBe(iconSize);
    await expect(getComputedStyle(nav).backgroundImage).toContain(
      "radial-gradient",
    );
  },
};

// A link goes through the app's router, and the button for a phone stays out of sight on a wider screen.
const Navigating: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    navigate.mockClear();

    await userEvent.click(canvas.getByRole("link", { name: "Growth" }));
    await expect(navigate.mock.lastCall?.[0]).toBe("/growth");
    await expect(canvas.queryByRole("button", { name: open })).toBeNull();
  },
};

// A label longer than the sidebar wraps to a second line, and nothing of it is cut.
const LongLabel: Story = {
  render: () => <SidebarProvider>{navigation(longLabel)}</SidebarProvider>,
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: longLabel });

    await expect(link.getBoundingClientRect().height).toBeGreaterThan(
      itemHeight,
    );
    await expect(link.scrollWidth).toBeLessThanOrEqual(link.clientWidth);
  },
};

// On a phone the sidebar leaves the screen, and the app's button opens it in a sheet named as it is, which closes
// once a link is followed, or on Esc.
const Phone: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole("button", { name: open });
    navigate.mockClear();

    await expect(canvas.queryByRole("navigation", { name })).toBeNull();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    const sheet = await body.findByRole("dialog", { name });
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(
      within(sheet).getByRole("link", { name: "Accounts" }),
    );
    await expect(navigate.mock.lastCall?.[0]).toBe("/accounts");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await left(() => body.queryByRole("dialog"));

    await userEvent.click(trigger);
    const again = await body.findByRole("dialog", { name });
    // Esc counts once focus is inside.
    await waitFor(() =>
      expect(again).toContainElement(document.activeElement as HTMLElement),
    );
    await userEvent.keyboard("{Escape}");
    await left(() => body.queryByRole("dialog"));
  },
};

// A part outside a SidebarProvider says so, rather than open nothing.
const WithoutProvider: Story = {
  render: () => (
    <Caught>
      <SidebarTrigger aria-label={open} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "Sidebar: its parts need a SidebarProvider around them.",
      ),
    ).toBeVisible();
  },
};

export default meta;
export { Default, LongLabel, Navigating, Phone, WithoutProvider };
