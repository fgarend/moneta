import type { Meta, StoryObj } from "@storybook/react-vite";
import { ExternalLinkIcon } from "lucide-react";
import { RouterProvider } from "react-aria-components";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { Link } from "./link.js";

const name = "the fee schedule";
const before = "Read ";
const after = " before moving money between fictitious accounts.";
const account = "Fictitious savings";
const balance = "1,250.00";
const longName =
  "the schedule of every fee a fictitious account may charge in a year";
const newTab = " (opens in a new tab)";
const route = "/accounts/fictitious";
// Where the fictitious router below sends a route, as a router with a base path would.
const base = "/app";

// What the guidelines give a link: an underline 4 px below its text, in the theme's primary.
const underline = "underline";
const offset = "4px";
const dimmed = "0.5";

// The colour a value of the theme resolves to where the link sits, in light and in dark.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

function lineOf(element: Element): string {
  return getComputedStyle(element).textDecorationLine;
}

const meta = {
  title: "Components/Layout & Navigation/Link",
  component: Link,
  args: { href: "#fees", children: name },
} satisfies Meta<typeof Link>;

type Story = StoryObj<typeof meta>;

// In a sentence: underlined, as the theme's primary is close to its text, in the text's own size and weight.
const Default: Story = {
  tags: ["visual"],
  render: (args) => (
    <p className="text-sm">
      {before}
      <Link {...args} />
      {after}
    </p>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name });
    const sentence = canvasElement.querySelector("p") as Element;
    const { color, textUnderlineOffset, fontSize, fontWeight } =
      getComputedStyle(link);

    await expect(link).toHaveAttribute("href", "#fees");
    await expect(lineOf(link)).toBe(underline);
    await expect(textUnderlineOffset).toBe(offset);
    await expect(color).toBe(colourOf("var(--primary)", canvasElement));
    await expect([fontSize, fontWeight]).toEqual([
      getComputedStyle(sentence).fontSize,
      getComputedStyle(sentence).fontWeight,
    ]);
  },
};

// Alone in a cell, where its place says it is a link: no underline until it is hovered or reached by keyboard.
const Quiet: Story = {
  args: { isQuiet: true, children: account },
  render: (args) => (
    <table>
      <tbody>
        <tr>
          <td>
            <Link {...args} />
          </td>
          <td>{balance}</td>
        </tr>
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: account });

    await expect(lineOf(link)).toBe("none");
    // A pointer moves before it arrives, which React Aria needs to count it as hovering. React draws each state after
    // the event, so the line is awaited. React Aria ends a hover on any pointerover elsewhere, which Chromium also
    // fires under the browser's real, still cursor when the page under it changes, so the hover is tried again.
    await userEvent.hover(canvasElement);
    await waitFor(async () => {
      await userEvent.hover(link);
      await expect(lineOf(link)).toBe(underline);
    });
    await userEvent.unhover(link);
    await waitFor(() => expect(lineOf(link)).toBe("none"));
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await waitFor(() => expect(lineOf(link)).toBe(underline));
  },
};

// Longer than its column: it wraps onto more lines, underlined on each, and nothing scrolls.
const Long: Story = {
  args: { children: longName },
  decorators: [
    (Story) => (
      <div className="w-32">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name: longName });
    const column = canvasElement.querySelector("div") as Element;

    await expect(link.getClientRects().length).toBeGreaterThan(1);
    await expect(lineOf(link)).toBe(underline);
    await expect(column.scrollWidth).toBe(column.clientWidth);
  },
};

// In a new tab, which the link says in the app's words: Link adds no icon and no text of its own.
const NewTab: Story = {
  args: {
    href: "https://example.com/fees",
    target: "_blank",
    children: (
      <>
        {name}
        <ExternalLinkIcon aria-hidden={true} className="ml-1 inline size-4" />
        <span className="sr-only">{newTab}</span>
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: `${name}${newTab}`,
    });

    await expect(link).toHaveAttribute("target", "_blank");
  },
};

const navigate = fn();

// Through a router set once at the app's root: a click goes to the router, not the browser.
const WithRouterProvider: Story = {
  args: { href: route },
  render: (args) => (
    <RouterProvider navigate={navigate}>
      <Link {...args} />
    </RouterProvider>
  ),
  play: async ({ canvasElement }) => {
    navigate.mockClear();
    await userEvent.click(within(canvasElement).getByRole("link", { name }));

    await expect(navigate).toHaveBeenCalledWith(route, undefined);
  },
};

// Through each link's `render`, drawn as a router's own link would be, with its base path, keeping Link's look.
const WithRender: Story = {
  args: {
    href: route,
    render: (props) =>
      "href" in props ? (
        <a {...props} href={`${base}${props.href}`} />
      ) : (
        <span {...props} />
      ),
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name });

    await expect(link).toHaveAttribute("href", `${base}${route}`);
    await expect(lineOf(link)).toBe(underline);
  },
};

// Disabled, as React Aria draws it: no longer an anchor, out of the tab order, said as such, and dimmed as Button is.
const Disabled: Story = {
  args: { isDisabled: true },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", { name });

    // A span keeps the href React Aria passes on, which leads nowhere from it.
    await expect(link.tagName).toBe("SPAN");
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(getComputedStyle(link).opacity).toBe(dimmed);
    await userEvent.tab();
    await expect(link).not.toHaveFocus();
  },
};

export default meta;
export {
  Default,
  Disabled,
  Long,
  NewTab,
  Quiet,
  WithRender,
  WithRouterProvider,
};
