// A whole money screen drawn from the real pieces, with fictitious data, so the theme is judged on a page and not one
// piece at a time. It is no piece of the package, and its navigation stands in for the Sidebar of the roadmap's 4.6.
// biome-ignore-all lint/style/noJsxLiterals: the words of a page are its content, and no piece here holds default text.
// biome-ignore-all lint/style/useComponentExportOnlyModules: the page's parts are this story's own, and enter no package.
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
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
import { Badge } from "./components/ui/badge.js";
import { Button } from "./components/ui/button.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card.js";
import { Input } from "./components/ui/input.js";
import { Progress } from "./components/ui/progress.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table.js";
import { ToggleGroup, ToggleGroupItem } from "./components/ui/toggle-group.js";

const periods = ["Week", "Month", "Year"];
const selectedPeriod = "Month";
const foodUsed = 87;
const navigation = [
  { name: "Overview", icon: Home, current: true },
  { name: "Payments", icon: ArrowLeftRight },
  { name: "Budgets", icon: Target },
  { name: "Reports", icon: ChartLine },
  { name: "Accounts", icon: Landmark },
  { name: "Portfolio", icon: Wallet },
];
const totals = [
  {
    name: "Balance",
    amount: "$12,480.50",
    change: "+3.9% this month",
    icon: Wallet,
  },
  {
    name: "Income",
    amount: "$8,450.00",
    change: "+5.8% this month",
    icon: ArrowDownLeft,
  },
  {
    name: "Spending",
    amount: "$4,184.35",
    change: "−2.1% this month",
    icon: ArrowUpRight,
  },
  {
    name: "Invested",
    amount: "$96,300.00",
    change: "+1.6% this month",
    icon: ChartLine,
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

function Navigation() {
  return (
    <nav
      aria-label="Main"
      className="w-60 shrink-0 bg-sidebar px-3 py-4 text-sm text-sidebar-foreground"
    >
      <p className="px-2 pb-4 font-semibold">Moneta</p>
      <ul className="flex flex-col gap-1">
        {navigation.map(({ name, icon: Icon, current }) => (
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
    </nav>
  );
}

function PageHeader() {
  return (
    <header className="flex flex-wrap items-center gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">Saturday, October 24</p>
        <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
      </div>
      <Input
        aria-label="Search payments"
        className="w-60"
        placeholder="Search payments"
      />
      <Button aria-label="Notices" size="icon" variant="outline">
        <Bell />
      </Button>
      <Button>
        <Plus />
        New payment
      </Button>
    </header>
  );
}

function Totals() {
  return (
    <section aria-label="October summary" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">October summary</h2>
        <ToggleGroup
          aria-label="Period"
          defaultSelectedKeys={[selectedPeriod]}
          selectionMode="single"
          variant="outline"
        >
          {periods.map((period) => (
            <ToggleGroupItem id={period} key={period}>
              {period}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {totals.map(({ name, amount, change, icon: Icon }) => (
          <Card key={name}>
            <CardContent>
              <p className="flex items-center justify-between text-xs text-muted-foreground">
                {name}
                <Icon aria-hidden="true" className="size-4" />
              </p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">
                {amount}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{change}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Payments() {
  return (
    <Card className="lg:col-span-2">
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
            <TableHead isRowHeader={true}>Description</TableHead>
            <TableHead>Group</TableHead>
            <TableHead>Day</TableHead>
            <TableHead>State</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableHeader>
          <TableBody>
            {payments.map(({ name, group, day, state, amount }) => (
              <TableRow id={name} key={name}>
                <TableCell className="font-medium">{name}</TableCell>
                <TableCell className="text-muted-foreground">{group}</TableCell>
                <TableCell className="text-muted-foreground">{day}</TableCell>
                <TableCell>
                  <Badge variant={state === "Paid" ? "secondary" : "outline"}>
                    {state}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
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
        <CardContent className="flex flex-col gap-3">
          {budgets.map(({ name, used }) => (
            <div className="flex flex-col gap-1" key={name}>
              <p className="flex justify-between text-xs">
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
        <CardContent className="flex flex-col gap-2">
          <Input aria-label="Amount" placeholder="$0.00" />
          <Select aria-label="Group" placeholder="Group">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem>Food</SelectItem>
              <SelectItem>Home</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
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
    <div className="flex min-h-screen bg-background text-foreground">
      <Navigation />
      <main className="flex min-w-0 max-w-6xl flex-1 flex-col gap-6 p-8">
        <PageHeader />
        <Totals />
        <div className="grid gap-4 lg:grid-cols-3">
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
  tags: ["gap-forced-colors"],
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
  },
};

export default meta;
export { Default };
