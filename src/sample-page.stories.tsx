// A whole money screen drawn from the real pieces, with fictitious data, so the theme is judged on a page and not one
// piece at a time. It is no piece of the package, and its navigation stands in for the Sidebar of the roadmap's 4.6.
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
import { expect, within } from "storybook/test";
import { Badge } from "./components/badge.js";
import { Button } from "./components/button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/card.js";
import { Input } from "./components/input.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/table.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/tabs.js";
import { Progress } from "./components/ui/progress.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select.js";

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
const totals = [
  {
    name: "Balance",
    amount: "$12,480.50",
    change: "+3.9% this month",
  },
  {
    name: "Income",
    amount: "$8,450.00",
    change: "+5.8% this month",
  },
  {
    name: "Spending",
    amount: "$4,184.35",
    change: "−2.1% this month",
  },
  {
    name: "Invested",
    amount: "$96,300.00",
    change: "+1.6% this month",
  },
];
const payments = [
  {
    name: "Example Company",
    group: "Income",
    day: "Today",
    state: "Paid",
    amount: "+ $7,250.00",
  },
  {
    name: "Central Market",
    group: "Food",
    day: "Today",
    state: "Paid",
    amount: "− $286.40",
  },
  {
    name: "Corner Bakery",
    group: "Food",
    day: "Yesterday",
    state: "Paid",
    amount: "− $48.90",
  },
  {
    name: "Rent",
    group: "Home",
    day: "Yesterday",
    state: "Scheduled",
    amount: "− $1,850.00",
  },
  {
    name: "Example Gym",
    group: "Health",
    day: "Tuesday",
    state: "Paid",
    amount: "− $129.90",
  },
  {
    name: "Between accounts",
    group: "Transfer",
    day: "Tuesday",
    state: "Paid",
    amount: "− $1,000.00",
  },
  {
    name: "Example Bond 2035",
    group: "Investment",
    day: "Monday",
    state: "Pending",
    amount: "− $1,500.00",
  },
];
const budgets = [
  { name: "Food", used: foodUsed },
  { name: "Home", used: 77 },
  { name: "Leisure", used: 42 },
];

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
        className="h-10 w-60"
        placeholder="Search payments"
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
              <p className="mt-1 type-amount-lg">{amount}</p>
              <p className="mt-2 text-xs text-muted-foreground">{change}</p>
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
      <CardContent className="border-t px-0">
        <Table aria-label="Recent payments">
          <TableHeader>
            <TableHead isRowHeader={true}>Description</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableHeader>
          <TableBody>
            {payments.map(({ name, group, day, state, amount }) => (
              <TableRow id={name} key={name}>
                <TableCell>{name}</TableCell>
                <TableCell className="text-muted-foreground">{group}</TableCell>
                <TableCell className="text-muted-foreground">{day}</TableCell>
                <TableCell>
                  {state === "Paid" ? null : (
                    <Badge variant="outline">{state}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right type-amount">
                  {amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
  );
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
    await expect(
      within(canvas.getByRole("navigation", { name: "Main" })).getByRole(
        "link",
        { current: "page" },
      ),
    ).toHaveTextContent("Overview");
    const recent = within(
      canvas.getByRole("grid", { name: "Recent payments" }),
    );

    await expect(recent.getAllByRole("row")).toHaveLength(payments.length + 1);
    // Money is shown exactly, with the true minus sign.
    await expect(recent.getByText("− $286.40")).toBeVisible();
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
      getComputedStyle(recent.getByText("− $286.40")).fontVariantNumeric,
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
