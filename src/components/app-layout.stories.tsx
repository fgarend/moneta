import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartPieIcon, FileTextIcon } from "lucide-react";
import type { ReactElement } from "react";
import { expect, within } from "storybook/test";
import {
  AppContent,
  AppHeader,
  AppHeaderActions,
  AppLayout,
  AppMain,
} from "./app-layout.js";
import { Button } from "./button.js";
import { MonetaProvider } from "./moneta-provider.js";
import {
  Section,
  SectionDescription,
  SectionHeader,
  SectionTitle,
} from "./section.js";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar.js";
import { SkipLink } from "./skip-link.js";

const skip = "Skip to the content";
const navName = "Main";
const open = "Open the menu";
const page = "Positions";
const action = "Export";

// What the guidelines give it: a bar of 56 px, content up to 1440 px with 40 px of margin, 16 on a phone.
const barHeight = 56;
const contentWidth = 1440;
const margin = 40;

// A screen wider than the content, and one too short for a bar that sticks.
const viewport = {
  options: {
    wide: {
      name: "Wide",
      styles: { width: "2400px", height: "900px" },
      type: "desktop",
    },
    short: {
      name: "Short",
      styles: { width: "1200px", height: "400px" },
      type: "desktop",
    },
  },
};

// The colour a value of the theme resolves to where the page sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function part(canvasElement: HTMLElement, slot: string): HTMLElement {
  return canvasElement.querySelector(`[data-slot="${slot}"]`) as HTMLElement;
}

// A shell as an app writes it: the skip link first, the sidebar, and the page in main, its bar and its sections.
function shell(isFull = false): ReactElement {
  return (
    <SidebarProvider>
      <SkipLink href="#main">{skip}</SkipLink>
      <AppLayout>
        <Sidebar aria-label={navName} closeLabel="Close the menu">
          <SidebarHeader>Fictitious Finance</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Investments</SidebarGroupLabel>
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
                    {page}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <AppMain>
          <AppHeader>
            <SidebarTrigger aria-label={open} />
            <span>Investments / {page}</span>
            <AppHeaderActions>
              <Button variant="outline">{action}</Button>
            </AppHeaderActions>
          </AppHeader>
          <AppContent {...(isFull ? { width: "full" as const } : {})}>
            {[1, 2, 3].map((index) => (
              <Section key={index}>
                <SectionHeader>
                  <SectionTitle>{`Fictitious section ${index}`}</SectionTitle>
                  <SectionDescription>
                    Fictitious figures, for the layout only.
                  </SectionDescription>
                </SectionHeader>
                <div className="h-40 rounded-lg border" />
              </Section>
            ))}
          </AppContent>
        </AppMain>
      </AppLayout>
    </SidebarProvider>
  );
}

const meta = {
  title: "Components/Layout & Navigation/AppLayout",
  parameters: { layout: "fullscreen", viewport },
  decorators: [
    (Story) => (
      <MonetaProvider navigate={() => undefined}>
        <Story />
      </MonetaProvider>
    ),
  ],
  render: () => shell(),
} satisfies Meta;

type Story = StoryObj<typeof meta>;

// One main, holding the page's bar; the sidebar beside it sticks at full height, and the bar at the top, at its layer
// and its height, on the page's background over a line; the page scrolls clear of it.
const Default: Story = {
  tags: ["visual"],
  play: async ({ canvasElement }) => {
    const main = within(canvasElement).getByRole("main");
    const nav = within(canvasElement).getByRole("navigation", {
      name: navName,
    });
    const bar = part(canvasElement, "app-header");
    const style = getComputedStyle(bar);

    await expect(within(canvasElement).getAllByRole("main")).toHaveLength(1);
    await expect(main).toHaveAttribute("id", "main");
    await expect(main).toContainElement(bar);
    await expect(
      nav.compareDocumentPosition(main) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    await expect(getComputedStyle(nav).position).toBe("sticky");
    await expect(Math.round(nav.getBoundingClientRect().height)).toBe(
      window.innerHeight,
    );
    await expect(style.position).toBe("sticky");
    await expect(style.zIndex).toBe("40");
    await expect(Math.round(bar.getBoundingClientRect().height)).toBe(
      barHeight,
    );
    await expect(style.backgroundColor).toBe(
      colourOf("var(--background)", bar),
    );
    await expect(style.borderBottomWidth).toBe("1px");
    await expect(
      getComputedStyle(document.documentElement).scrollPaddingTop,
    ).not.toBe("auto");
  },
};

// On a screen wider than the content, it stops at 1440 px, centred, and the bar's row lines up with it.
const Wide: Story = {
  globals: { viewport: { value: "wide" } },
  play: async ({ canvasElement }) => {
    const content = part(canvasElement, "app-content").getBoundingClientRect();
    const row = part(canvasElement, "app-header-row").getBoundingClientRect();
    const main = within(canvasElement)
      .getByRole("main")
      .getBoundingClientRect();

    await expect(Math.round(content.width)).toBe(contentWidth);
    await expect(Math.round(content.left - main.left)).toBe(
      Math.round(main.right - content.right),
    );
    await expect(Math.round(row.left)).toBe(Math.round(content.left));
    await expect(Math.round(row.width)).toBe(Math.round(content.width));
  },
};

// A page that asks for the full width, as a wide table's, takes it, and so does the bar's row.
const FullWidth: Story = {
  globals: { viewport: { value: "wide" } },
  render: () => shell(true),
  play: async ({ canvasElement }) => {
    const content = part(canvasElement, "app-content").getBoundingClientRect();
    const row = part(canvasElement, "app-header-row").getBoundingClientRect();
    const main = within(canvasElement)
      .getByRole("main")
      .getBoundingClientRect();

    await expect(Math.round(content.width)).toBe(Math.round(main.width));
    await expect(
      getComputedStyle(part(canvasElement, "app-content")).paddingLeft,
    ).toBe(`${margin}px`);
    await expect(Math.round(row.width)).toBe(Math.round(content.width));
  },
};

// On a phone the sidebar leaves for its sheet, and the bar holds the button that opens it, with 16 px of margin.
const Phone: Story = {
  globals: { viewport: { value: "mobile1" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("navigation", { name: navName }),
    ).toBeNull();
    await expect(canvas.getByRole("button", { name: open })).toBeVisible();
    await expect(
      getComputedStyle(part(canvasElement, "app-content")).paddingLeft,
    ).toBe("16px");
  },
};

// On a screen too short for it, the bar lets go and scrolls with the page.
const ShortScreen: Story = {
  globals: { viewport: { value: "short" } },
  play: async ({ canvasElement }) => {
    await expect(
      getComputedStyle(part(canvasElement, "app-header")).position,
    ).not.toBe("sticky");
  },
};

export default meta;
export { Default, FullWidth, Phone, ShortScreen, Wide };
