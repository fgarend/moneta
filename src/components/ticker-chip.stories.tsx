import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { funds, holdings } from "../../.storybook/data.js";
import { Amount } from "./amount.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";
import { IconTile } from "./icon-tile.js";
import { Percent } from "./percent.js";
import { ScrollArea } from "./scroll-area.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";
import { TickerChip } from "./ticker-chip.js";

// What the guidelines give it: 24 px tall, a 20 px mark 2 px in all round, and a --border-strong border.
const height = 24;
const markSize = 20;
const inset = 2;
const chip = '[data-slot="ticker-chip"]';
const mark = '[data-slot="icon-tile"], [data-slot="avatar"]';
// A square of one colour, so nothing is fetched and no one is shown.
const logo =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1'/%3E%3C/svg%3E";
// A picture that fails to load, with nothing fetched.
const broken = "data:image/png;base64,AAAA";
const [stock, fund, coin] = holdings;
const columns = { asset: "Asset", value: "Value", day: "Day" };

function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.borderColor = value;
  near.append(probe);
  const { borderTopColor } = getComputedStyle(probe);
  probe.remove();
  return borderTopColor;
}

// The name a screen reader hears: the code, then the company's, after a pause. A browser puts a space before the
// comma, as the name is a part of its own, which speech does not say.
function heard(ticker: string | undefined, name: string | undefined) {
  return (said: string) => said.replace(" ,", ",") === `${ticker}, ${name}`;
}

function chipsOf(canvas: HTMLElement): HTMLElement[] {
  return [...canvas.querySelectorAll<HTMLElement>(chip)];
}

// Its mark sits 2 px in from the chip's edge, top and start, at 20 px.
async function expectMarkIn(element: HTMLElement) {
  const box = element.getBoundingClientRect();
  const drawn = (
    element.querySelector(mark) as HTMLElement
  ).getBoundingClientRect();
  await expect(drawn.width).toBe(markSize);
  await expect(drawn.height).toBe(markSize);
  await expect(drawn.left - box.left).toBe(inset);
  await expect(drawn.top - box.top).toBe(inset);
}

function typed(holding: (typeof holdings)[number] | undefined) {
  const asset = holding ?? holdings[0];
  const Icon = asset?.icon ?? (() => null);
  return (
    <TickerChip href={`#${asset?.ticker}`} name={asset?.name}>
      <IconTile category={asset?.category}>
        <Icon />
      </IconTile>
      {asset?.ticker}
    </TickerChip>
  );
}

const meta = {
  title: "Components/Display & Media/Ticker Chip",
  component: TickerChip,
  args: { children: "" },
} satisfies Meta<typeof TickerChip>;

type Story = StoryObj<typeof meta>;

// A fund, its type's icon in its category's tint, a link to its page named by its code and its company.
const Default: Story = {
  tags: ["visual"],
  render: () => <div className="p-6">{typed(fund)}</div>,
  play: async ({ canvasElement }) => {
    const [element] = chipsOf(canvasElement);
    const link = within(canvasElement).getByRole("link", {
      name: heard(fund?.ticker, fund?.name),
    });

    await expect(element).toBe(link);
    await expect(element?.getBoundingClientRect().height).toBe(height);
    await expect(getComputedStyle(element as HTMLElement).borderTopColor).toBe(
      colourOf("var(--border-strong)", canvasElement),
    );
    await expectMarkIn(element as HTMLElement);
    await expect(within(canvasElement).queryByRole("img")).toBeNull();
  },
};

// The issuer's logo, as an Avatar, and a picture that fails, whose fallback keeps the circle.
const WithLogo: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex gap-2 p-6">
      {[logo, broken].map((src) => (
        <TickerChip href={`#${stock?.ticker}`} key={src} name={stock?.name}>
          <Avatar>
            <AvatarImage src={src} />
            <AvatarFallback />
          </Avatar>
          {stock?.ticker}
        </TickerChip>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(chipsOf(canvasElement)).toHaveLength(2);
    for (const element of chipsOf(canvasElement)) {
      await expectMarkIn(element);
    }
    await expect(within(canvasElement).queryByRole("img")).toBeNull();
  },
};

// Funds of one type, with no mark, the code in the middle of the pill.
const WithoutMark: Story = {
  tags: ["visual"],
  render: () => (
    <div className="flex gap-2 p-6">
      {funds.map((asset) => (
        <TickerChip href={`#${asset.ticker}`} key={asset.ticker}>
          {asset.ticker}
        </TickerChip>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [element] = chipsOf(canvasElement);
    const box = (element as HTMLElement).getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(element as HTMLElement);
    const text = range.getBoundingClientRect();

    await expect(box.height).toBe(height);
    await expect(Math.round(text.left - box.left)).toBe(
      Math.round(box.right - text.right),
    );
  },
};

// A column of chips of mixed types, each a link, with the day's change in a column of its own.
const InTable: Story = {
  tags: ["visual"],
  render: () => (
    <Table aria-label="Holdings">
      <TableHeader>
        <TableRow>
          <TableHead>{columns.asset}</TableHead>
          <TableHead align="end">{columns.value}</TableHead>
          <TableHead align="end">{columns.day}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holdings.map((asset) => (
          <TableRow key={asset.ticker}>
            <TableHead scope="row">{typed(asset)}</TableHead>
            <TableCell align="end">
              <Amount value={asset.value} />
            </TableCell>
            <TableCell align="end">
              <Percent
                sign="always"
                tone={asset.change.startsWith("-") ? "negative" : "positive"}
                value={asset.change}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
  play: async ({ canvasElement }) => {
    for (const asset of holdings) {
      await expect(
        within(canvasElement).getByRole("link", {
          name: heard(asset.ticker, asset.name),
        }),
      ).toBeVisible();
    }
  },
};

// Within a sentence, each chip with its change after it.
const InText: Story = {
  tags: ["visual"],
  render: () => (
    <p className="max-w-96 p-6 text-sm">
      The day&apos;s largest rise was {typed(stock)}{" "}
      <Percent sign="always" tone="positive" value={stock?.change ?? "0"} />,
      and its largest fall {typed(coin)}{" "}
      <Percent sign="always" tone="negative" value={coin?.change ?? "0"} />.
    </p>
  ),
  play: async ({ canvasElement }) => {
    await expect(chipsOf(canvasElement)).toHaveLength(2);
  },
};

// With no page to go to, as on the asset's own: text, never a link or a button.
const Static: Story = {
  render: () => (
    <div className="p-6">
      <TickerChip name={fund?.name}>{fund?.ticker}</TickerChip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [element] = chipsOf(canvasElement);

    await expect(within(canvasElement).queryByRole("link")).toBeNull();
    await expect(within(canvasElement).queryByRole("button")).toBeNull();
    await expect(element?.textContent).toBe(`${fund?.ticker}, ${fund?.name}`);
  },
};

// A long code in a column narrower than it, which scrolls in its own area, as a table's: never wrapped, never cut.
const LongCode: Story = {
  tags: ["visual"],
  render: () => (
    <div className="p-6">
      <div className="w-16">
        <ScrollArea aria-label={columns.asset}>{typed(coin)}</ScrollArea>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const [element] = chipsOf(canvasElement);

    await expect(element?.getBoundingClientRect().height).toBe(height);
    await expect(element?.scrollWidth).toBe(element?.clientWidth);
  },
};

export default meta;
export { Default, InTable, InText, LongCode, Static, WithLogo, WithoutMark };
