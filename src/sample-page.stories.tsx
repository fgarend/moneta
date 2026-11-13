// A whole money screen drawn from the real pieces, with fictitious data, so the theme is judged on a page and not one
// piece at a time. It is no piece of the package, and its navigation stands in for the roadmap's Sidebar.
// biome-ignore-all lint/style/noJsxLiterals: the words of a page are its content, and no piece here holds default text.
// biome-ignore-all lint/style/useComponentExportOnlyModules: the page's parts are this story's own, and enter no package.
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowLeftRight,
  Bell,
  ChartLine,
  Download,
  Filter,
  Home,
  Landmark,
  PiggyBank,
  Plus,
  Target,
  Wallet,
} from "lucide-react";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Amount } from "./components/amount.js";
import { Badge } from "./components/badge.js";
import { Button } from "./components/button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/card.js";
import { Input } from "./components/input.js";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  ItemValue,
} from "./components/item.js";
import { Link } from "./components/link.js";
import { MonetaProvider } from "./components/moneta-provider.js";
import type { Money } from "./components/money.js";
import { Percent } from "./components/percent.js";
import { Progress } from "./components/progress.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/select.js";
import {
  Table,
  TableBody,
  TableCell,
  TableGroupRow,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/table.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs.js";

interface NavigationItem {
  name: string;
  icon: typeof Home;
  current?: boolean;
}

const displaySize = "32px";
const amountSize = "24px";
const tabular = "tabular-nums";
const periods = ["Week", "Month", "Year"];
const selectedPeriod = "Month";
const foodUsed = 87;
const navigation = [
  { name: "Overview", icon: Home, current: true },
  { name: "Payments", icon: ArrowLeftRight },
  { name: "Budgets", icon: Target },
  { name: "Reports", icon: ChartLine },
];
const wealth = [
  { name: "Accounts", icon: Landmark },
  { name: "Portfolio", icon: Wallet },
];
function dollars(amount: string): Money {
  return { amount, currency: "USD" };
}

// Each change is good news here, spending that fell too, though its sign is a minus.
const totals = [
  { name: "Balance", amount: dollars("12480.5"), change: "0.039" },
  { name: "Income", amount: dollars("8450"), change: "0.058" },
  { name: "Spending", amount: dollars("4184.35"), change: "-0.021" },
  { name: "Invested", amount: dollars("96300"), change: "0.016" },
];
const payments = [
  {
    name: "Example Company",
    group: "Income",
    day: "Today",
    state: "Paid",
    amount: dollars("7250"),
  },
  {
    name: "Central Market",
    group: "Food",
    day: "Today",
    state: "Paid",
    amount: dollars("-286.4"),
  },
  {
    name: "Corner Bakery",
    group: "Food",
    day: "Yesterday",
    state: "Paid",
    amount: dollars("-48.9"),
  },
  {
    name: "Rent",
    group: "Home",
    day: "Yesterday",
    state: "Scheduled",
    amount: dollars("-1850"),
  },
  {
    name: "Example Gym",
    group: "Health",
    day: "Tuesday",
    state: "Paid",
    amount: dollars("-129.9"),
  },
  {
    name: "Between accounts",
    group: "Transfer",
    day: "Tuesday",
    state: "Paid",
    amount: dollars("-1000"),
  },
  {
    name: "Example Bond 2035",
    group: "Investment",
    day: "Monday",
    state: "Pending",
    amount: dollars("-1500"),
  },
];
// The days the payments fall on, each with what its payments add up to, which the page's check sums again.
const days = [
  { name: "Today", subtotal: dollars("6963.6") },
  { name: "Yesterday", subtotal: dollars("-1898.9") },
  { name: "Tuesday", subtotal: dollars("-1129.9") },
  { name: "Monday", subtotal: dollars("-1500") },
];
// Three of the person's accounts, and how many there are in all.
const accounts = [
  {
    name: "Checking 1234",
    bank: "Example Bank",
    icon: Landmark,
    balance: dollars("4230.5"),
  },
  {
    name: "Savings",
    bank: "Example Bank",
    icon: PiggyBank,
    balance: dollars("6000"),
  },
  {
    name: "Brokerage",
    bank: "Fictitious Broker",
    icon: Wallet,
    balance: dollars("2250"),
  },
];
const accountCount = 5;
const budgets = [
  { name: "Food", used: foodUsed },
  { name: "Home", used: 77 },
  { name: "Leisure", used: 42 },
];

// Fictitious sums are still sums: a decimal string in cents, exact.
function cents(value: string): bigint {
  const [whole = "0", decimals = ""] = value.split(".");
  const sign = whole.startsWith("-") ? -1n : 1n;
  return (
    BigInt(whole) * 100n + sign * BigInt(decimals.padEnd(2, "0").slice(0, 2))
  );
}

function sum(values: string[]): bigint {
  return values.reduce((all, value) => all + cents(value), 0n);
}

// What a payment means is the page's to say, not its sign's.
function toneOf(group: string): "positive" | "negative" | undefined {
  if (group === "Income") {
    return "positive";
  }
  return group === "Transfer" ? undefined : "negative";
}

function NavigationLinks({ items }: { items: NavigationItem[] }) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map(({ name, icon: Icon, current }) => (
        <li key={name}>
          <a
            aria-current={current ? "page" : undefined}
            className="flex items-center gap-2 rounded-md px-2 py-2 outline-1 outline-transparent hover:bg-sidebar-accent aria-[current=page]:bg-sidebar-accent aria-[current=page]:font-medium aria-[current=page]:text-sidebar-accent-foreground"
            href="#sample"
          >
            <Icon aria-hidden="true" className="size-4" />
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Navigation() {
  return (
    <nav
      aria-label="Main"
      className="w-60 shrink-0 bg-sidebar px-3 py-4 text-sm text-sidebar-foreground [--ring:var(--sidebar-ring)]"
    >
      <p className="px-2 pb-6 font-semibold">Moneta</p>
      <NavigationLinks items={navigation} />
      <p className="px-2 pt-6 pb-2 text-xs text-sidebar-foreground/70">
        Wealth
      </p>
      <NavigationLinks items={wealth} />
    </nav>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 flex-1">
        <p className="mb-2 text-xs text-muted-foreground">
          Saturday, October 24
        </p>
        <h1 className="type-display">Overview</h1>
      </div>
      <Input
        aria-label="Search payments"
        className="w-60"
        placeholder="Search payments"
        size="lg"
      />
      <Button aria-label="Notices" size="icon-lg" variant="ghost">
        <Bell />
      </Button>
      <Button size="lg" variant="gold">
        <Plus />
        New payment
      </Button>
    </header>
  );
}

function Totals() {
  return (
    <section aria-label="October summary" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg/6 font-semibold">October summary</h2>
        <Tabs defaultSelectedKey={selectedPeriod}>
          <TabsList aria-label="Period">
            {periods.map((period) => (
              <TabsTrigger className="px-3" id={period} key={period}>
                {period}
              </TabsTrigger>
            ))}
          </TabsList>
          {periods.map((period) => (
            <TabsContent className="hidden" id={period} key={period} />
          ))}
        </Tabs>
      </div>
      <Card className="py-0">
        <div className="grid grid-cols-2 divide-x lg:grid-cols-4">
          {totals.map(({ name, amount, change }) => (
            <div className="p-5" key={name}>
              <p className="type-label text-muted-foreground">{name}</p>
              <p className="mt-1">
                <Amount size="lg" value={amount} />
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                <Percent sign="always" tone="positive" value={change} /> this
                month
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}

function Payments() {
  return (
    <Card className="gap-3 pb-0 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent payments</CardTitle>
        <CardDescription>The last three days</CardDescription>
        <CardAction className="flex gap-1">
          <Button size="sm" variant="ghost">
            <Filter />
            Filter
          </Button>
          <Button size="sm" variant="ghost">
            <Download />
            Export
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table aria-label="Recent payments">
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead hideBelow="md">Group</TableHead>
              <TableHead hideBelow="md">Status</TableHead>
              <TableHead align="end">Amount</TableHead>
            </TableRow>
          </TableHeader>
          {days.map((day) => (
            <TableBody key={day.name}>
              <TableGroupRow>
                <TableHead scope="row">{day.name}</TableHead>
                <TableCell hideBelow="md" />
                <TableCell hideBelow="md" />
                <TableCell align="end">
                  {/* A day's sum follows its rows' sign, and says no good or bad news of its own. */}
                  <Amount sign="always" value={day.subtotal} />
                </TableCell>
              </TableGroupRow>
              {payments
                .filter((payment) => payment.day === day.name)
                .map(({ name, group, state, amount }) => (
                  <TableRow key={name}>
                    <TableHead scope="row">
                      <Link href={`#${name}`} isQuiet={true}>
                        {name}
                      </Link>
                    </TableHead>
                    <TableCell className="text-muted-foreground" hideBelow="md">
                      {group}
                    </TableCell>
                    <TableCell hideBelow="md">
                      {state === "Paid" ? null : (
                        <Badge variant="outline">{state}</Badge>
                      )}
                    </TableCell>
                    <TableCell align="end">
                      {/* Money in is good news and money out bad, as the page says, and a transfer between accounts neither. */}
                      <Amount
                        sign="always"
                        tone={toneOf(group)}
                        value={amount}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          ))}
        </Table>
      </CardContent>
    </Card>
  );
}

function SidePanels() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Budgets</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {budgets.map(({ name, used }) => (
            <div className="flex flex-col gap-1" key={name}>
              <p className="flex justify-between type-label">
                <span>{name}</span>
                <span className="tabular-nums">{used}%</span>
              </p>
              <Progress aria-label={name} value={used} />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {accounts.map(({ name, bank, icon: Icon, balance }) => (
              <Item key={name}>
                <ItemMedia variant="icon">
                  <Icon aria-hidden="true" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>
                    <Link href={`#${name}`} isQuiet={true}>
                      {name}
                    </Link>
                  </ItemTitle>
                  <ItemDescription>{bank}</ItemDescription>
                </ItemContent>
                <ItemValue>
                  <Amount value={balance} />
                </ItemValue>
              </Item>
            ))}
          </ItemGroup>
        </CardContent>
        <CardFooter>
          <p>
            Showing {accounts.length} of {accountCount} ·{" "}
            <Link href="#accounts">See all accounts</Link>
          </p>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Quick entry</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input aria-label="Amount" placeholder="$0.00" />
          <Select aria-label="Group" className="w-full" placeholder="Group">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem>Food</SelectItem>
              <SelectItem>Home</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-1 flex justify-end gap-2">
            <Button variant="outline">Clear</Button>
            <Button>Save</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SamplePage() {
  return (
    <I18nProvider locale="en-US">
      <MonetaProvider emptyLabel="No value yet" hiddenLabel="Hidden value">
        <div
          className="flex min-h-screen bg-background font-sans text-foreground"
          data-testid="sample-font"
        >
          <Navigation />
          <main className="mx-auto flex w-full min-w-0 max-w-7xl flex-1 flex-col gap-10 px-12 py-10">
            <PageHeader />
            <Totals />
            <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
              <Payments />
              <SidePanels />
            </div>
          </main>
        </div>
      </MonetaProvider>
    </I18nProvider>
  );
}

// A colour of the theme where the page sits, in light and in dark, which no colour the theme lacks matches.
function colourOf(value: string, near: Element): string {
  const probe = document.createElement("span");
  probe.style.color = value;
  near.append(probe);
  const { color } = getComputedStyle(probe);
  probe.remove();
  return color;
}

const meta = {
  title: "Sample/Page",
  component: SamplePage,
  // The gap of Select, written in docs/pieces.md, reaches the page that draws it.
  tags: ["visual", "gap-forced-colors"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SamplePage>;

type Story = StoryObj<typeof meta>;

const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", { level: 1, name: "Overview" }),
    ).toBeVisible();
    // The search beside the page's main action takes its size, so the row lines up.
    await expect(
      canvas.getByRole("textbox", { name: "Search payments" }).offsetHeight,
    ).toBe(canvas.getByRole("button", { name: "New payment" }).offsetHeight);
    await expect(
      within(canvas.getByRole("navigation", { name: "Main" })).getByRole(
        "link",
        { current: "page" },
      ),
    ).toHaveTextContent("Overview");
    const recent = within(
      canvas.getByRole("table", { name: "Recent payments" }),
    );

    // A row per payment and per day, under the header; each payment opens by its title, and each day adds up.
    await expect(recent.getAllByRole("row")).toHaveLength(
      payments.length + days.length + 1,
    );
    await expect(recent.getAllByRole("link")).toHaveLength(payments.length);
    for (const day of days) {
      await expect(
        sum(
          payments
            .filter((payment) => payment.day === day.name)
            .map((payment) => payment.amount.amount),
        ),
      ).toBe(cents(day.subtotal.amount));
    }
    await expect(recent.getByText("+$6,963.60")).toBeVisible();
    // Money is shown exactly, with the true minus sign, by the pieces of money.
    await expect(recent.getByText("−$286.40").tagName).toBe("DATA");
    // Good news in green: money in, and spending that fell, though its sign is a minus. Money out in red, but a
    // transfer between accounts, which is neither.
    const colourIn = (text: string, scope = canvas): string =>
      getComputedStyle(scope.getByText(text)).color;
    await expect(colourIn("+$7,250.00", recent)).toBe(
      colourOf("var(--positive)", canvasElement),
    );
    await expect(colourIn("−2.1%")).toBe(
      colourOf("var(--positive)", canvasElement),
    );
    await expect(colourIn("−$286.40", recent)).toBe(
      colourOf("var(--negative)", canvasElement),
    );
    await expect(colourIn("−$1,000.00", recent)).toBe(
      getComputedStyle(
        recent.getByRole("rowheader", { name: "Between accounts" }),
      ).color,
    );
    // The person's accounts, one per row, each opening by its title, with a link to the rest.
    const accountList = within(
      canvas
        .getByText("Accounts", { selector: '[data-slot="card-title"]' })
        .closest('[data-slot="card"]') as HTMLElement,
    );
    await expect(accountList.getAllByRole("listitem")).toHaveLength(
      accounts.length,
    );
    await expect(
      accountList.getByRole("link", { name: "See all accounts" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("button", { name: "New payment" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("progressbar", { name: "Food" }),
    ).toHaveAttribute("aria-valuenow", String(foodUsed));
    await expect(canvas.getByRole("textbox", { name: "Amount" })).toBeVisible();
    // The text styles, each with what no Tailwind step gives alone.
    await expect(
      getComputedStyle(canvas.getByRole("heading", { level: 1 })).fontSize,
    ).toBe(displaySize);
    await expect(
      getComputedStyle(canvas.getByText("$12,480.50")).fontVariantNumeric,
    ).toBe(tabular);
    await expect(
      getComputedStyle(canvas.getByText("$12,480.50")).fontSize,
    ).toBe(amountSize);
    await expect(
      getComputedStyle(recent.getByText("−$286.40")).fontVariantNumeric,
    ).toBe(tabular);
    // An app changes the font by one variable, which is what this checks.
    canvasElement.style.setProperty("--font", "serif");
    await expect(
      getComputedStyle(canvas.getByTestId("sample-font")).fontFamily,
    ).toBe("serif");
    canvasElement.style.removeProperty("--font");
  },
};

export default meta;
export { Default };
