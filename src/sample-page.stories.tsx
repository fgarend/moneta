// A whole money screen drawn from the real pieces, with the gallery's fictitious household, so the theme is judged on
// a page and not one piece at a time, on a phone as on a desktop. It is no piece of the package.
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
  Plus,
  Target,
  Wallet,
} from "lucide-react";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import {
  accountBalances,
  accountCount,
  budgets,
  cents,
  foodUsed,
  paymentDays,
  recentPayments,
  totals,
} from "../.storybook/data.js";
import { Amount } from "./components/amount.js";
import {
  AppContent,
  AppHeader,
  AppLayout,
  AppMain,
} from "./components/app-layout.js";
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
import { IconTile } from "./components/icon-tile.js";
import { Input } from "./components/input.js";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
  ItemValue,
} from "./components/item.js";
import { Link } from "./components/link.js";
import { MonetaProvider } from "./components/moneta-provider.js";
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
} from "./components/sidebar.js";
import { SkipLink } from "./components/skip-link.js";
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

const displaySize = "32px";
const amountSize = "24px";
const tabular = "tabular-nums";
const periods = ["Week", "Month", "Year"];
const selectedPeriod = "Month";
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

function NavigationGroup({
  label,
  items,
}: {
  label: string;
  items: { name: string; icon: typeof Home; current?: boolean }[];
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map(({ name, icon: Icon, current }) => (
          <SidebarMenuItem key={name}>
            <SidebarMenuButton href="#sample" isActive={current === true}>
              <Icon />
              {name}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function Navigation() {
  return (
    <Sidebar aria-label="Main" closeLabel="Close the menu">
      <SidebarHeader>Moneta</SidebarHeader>
      <SidebarContent>
        <NavigationGroup items={navigation} label="Money" />
        <NavigationGroup items={wealth} label="Wealth" />
      </SidebarContent>
    </Sidebar>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-wrap items-end gap-3">
      <div className="min-w-0 grow basis-60">
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
        {/* The card's edge shows through 1 px between the totals, so the lines follow them as they wrap. */}
        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {totals.map(({ name, amount, change }) => (
            <div className="bg-card p-5" key={name}>
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
          {paymentDays.map((day) => (
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
              {recentPayments
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
            {accountBalances.map(({ name, bank, icon: Icon, balance }) => (
              <Item key={name}>
                <IconTile>
                  <Icon aria-hidden="true" />
                </IconTile>
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
            Showing {accountBalances.length} of {accountCount} ·{" "}
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
        <SidebarProvider>
          <div
            className="bg-background font-sans text-foreground"
            data-testid="sample-font"
          >
            <SkipLink href="#main">Skip to the content</SkipLink>
            <AppLayout>
              <Navigation />
              <AppMain>
                <AppHeader>
                  <SidebarTrigger aria-label="Open the menu" />
                  <span>Money / Overview</span>
                </AppHeader>
                <AppContent>
                  <PageHeader />
                  <Totals />
                  <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
                    <Payments />
                    <SidePanels />
                  </div>
                </AppContent>
              </AppMain>
            </AppLayout>
          </div>
        </SidebarProvider>
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
      recentPayments.length + paymentDays.length + 1,
    );
    await expect(recent.getAllByRole("link")).toHaveLength(
      recentPayments.length,
    );
    for (const day of paymentDays) {
      await expect(
        sum(
          recentPayments
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
      accountBalances.length,
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
