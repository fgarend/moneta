// One fictitious household's money, which every story draws from, so the gallery reads as one app in use. Every name
// is made up; data is added rather than changed, so a story's screenshot holds.
import {
  Building2Icon,
  CarIcon,
  ChartLineIcon,
  CoinsIcon,
  GiftIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  HouseIcon,
  Landmark,
  PawPrintIcon,
  PiggyBank,
  PlaneIcon,
  ShoppingCartIcon,
  TvIcon,
  Wallet,
} from "lucide-react";
import type { Money } from "#lib/money";

// Its accounts, each with the institution that keeps it.
const accounts = [
  { id: "a1", name: "Account 1234", detail: "Example Bank" },
  { id: "a2", name: "Account 5678", detail: "Fictitious Broker" },
  { id: "a3", name: "Savings", detail: "Example Bank" },
];

// An account whose name and detail run long, as a phone shows them.
const longAccount = {
  name: "A fictitious joint savings account whose name is long enough to need more than one line",
  detail:
    "Opened for a fictitious family's holidays, kept at a fictitious bank, with a detail that runs to three lines or more on a phone",
};

// Its latest payments, in dollars, each with its category and when it was paid, or that it is pending.
const payments = [
  {
    id: "p1",
    name: "Central Market",
    detail: "Food",
    value: "-286.4",
    when: "Today",
  },
  {
    id: "p2",
    name: "A fictitious rent, paid to a landlord with a long name",
    detail: "Home",
    value: "-1850",
    when: "Pending",
  },
];

// Two days of its statement, in dollars, each with its total, a decimal string as each row's.
const days = [
  {
    id: "today",
    title: "Today, October 24",
    total: "-335.3",
    rows: [
      { id: "d1", name: "Central Market", value: "-286.4" },
      { id: "d2", name: "Corner Bakery", value: "-48.9" },
    ],
  },
  {
    id: "yesterday",
    title: "Yesterday, October 23",
    total: "6250",
    rows: [
      { id: "d3", name: "Fictitious salary", value: "7250" },
      { id: "d4", name: "Between accounts", value: "-1000" },
    ],
  },
];

// The categories of its spending, numbered from 1 as an app numbers them, each with its icon; the ninth repeats the
// first colour.
const spending = [
  { category: 1, name: "Groceries", Icon: ShoppingCartIcon },
  { category: 2, name: "Home", Icon: HouseIcon },
  { category: 3, name: "Transport", Icon: CarIcon },
  { category: 4, name: "Health", Icon: HeartPulseIcon },
  { category: 5, name: "Education", Icon: GraduationCapIcon },
  { category: 6, name: "Travel", Icon: PlaneIcon },
  { category: 7, name: "Subscriptions", Icon: TvIcon },
  { category: 8, name: "Gifts", Icon: GiftIcon },
  { category: 9, name: "Pets", Icon: PawPrintIcon },
];

function dollars(amount: string): Money {
  return { amount, currency: "USD" };
}

// Its month in totals, each with its change, good news here, spending that fell too, though its sign is a minus.
const totals = [
  { name: "Balance", amount: dollars("12480.5"), change: "0.039" },
  { name: "Income", amount: dollars("8450"), change: "0.058" },
  { name: "Spending", amount: dollars("4184.35"), change: "-0.021" },
  { name: "Invested", amount: dollars("96300"), change: "0.016" },
];
// Its payments of the last days, in dollars, each in its group, on its day, paid or not yet.
const recentPayments = [
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
const paymentDays = [
  { name: "Today", subtotal: dollars("6963.6") },
  { name: "Yesterday", subtotal: dollars("-1898.9") },
  { name: "Tuesday", subtotal: dollars("-1129.9") },
  { name: "Monday", subtotal: dollars("-1500") },
];
// Three of the person's accounts, and how many there are in all.
const accountBalances = [
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
// One account's details, as a side panel shows them: who holds it, where, since when and its balance.
const accountDetails = {
  holder: "Ana Fictícia",
  institution: "Example Bank",
  opened: "2021-03-12",
  balance: dollars("4230.5"),
};
// A transfer's history, oldest first, each moment in UTC, with its credit still expected on a day.
const transferHistory = {
  events: [
    { id: "e1", title: "Requested", at: "2026-11-12T09:14:00Z" },
    { id: "e2", title: "Approved", at: "2026-11-12T09:20:00Z" },
    { id: "e3", title: "Sent to the bank", at: "2026-11-13T08:02:00Z" },
  ],
  expected: { id: "e4", title: "Credit", on: "2026-11-17" },
};
// A transfer the bank refused, sent again and credited, with what each event means.
const resentTransfer = [
  { id: "r1", title: "Requested", at: "2026-11-12T09:14:00Z" },
  {
    id: "r2",
    title: "Refused by the bank",
    at: "2026-11-12T14:05:00Z",
    meaning: "destructive",
  },
  { id: "r3", title: "Sent again", at: "2026-11-13T08:02:00Z" },
  {
    id: "r4",
    title: "Credited",
    at: "2026-11-13T10:40:00Z",
    meaning: "success",
  },
] as const;
// A payment partly refunded, in dollars, by its holder.
const refund = {
  paid: dollars("200"),
  refunded: dollars("50"),
  by: "Ana Fictícia",
  events: {
    paid: "2026-11-03T10:12:00Z",
    refunded: "2026-11-08T16:30:00Z",
    done: "2026-11-10T09:01:00Z",
  },
};
// A monthly contribution's last two and its next, of 24 in all.
const contributions = {
  count: 24,
  made: [
    { id: "c1", at: "2026-10-01T08:00:00Z" },
    { id: "c2", at: "2026-11-01T08:00:00Z" },
  ],
  next: "2026-12-01",
};
// Events whose titles run long, as a phone shows them.
const longEvents = [
  {
    id: "l1",
    title:
      "Sent again to a fictitious bank, after its holder corrected the account's number",
    at: "2026-11-13T08:02:00Z",
  },
  {
    id: "l2",
    title:
      "Credited to a fictitious joint savings account whose name is long enough to wrap",
    at: "2026-11-13T10:40:00Z",
  },
];
// Assets it holds, each with its traded code, its issuer's name, its type's icon and category, and the day's change,
// a fraction of one. Every code and name is made up.
const holdings = [
  {
    ticker: "FCTA3",
    name: "Fictitious Energy",
    icon: ChartLineIcon,
    category: 1,
    value: dollars("7640"),
    change: "0.014",
  },
  {
    ticker: "DMMY11",
    name: "Dummy Logistics",
    icon: Building2Icon,
    category: 4,
    value: dollars("7111.4"),
    change: "0.002",
  },
  {
    ticker: "EXCN-USD",
    name: "Example Coin",
    icon: CoinsIcon,
    category: 7,
    value: dollars("9450"),
    change: "-0.021",
  },
];
// Funds of one type, which need no mark.
const funds = [
  { ticker: "DMMY11", name: "Dummy Logistics", value: dollars("7111.4") },
  { ticker: "FCTL11", name: "Fictitious Towers", value: dollars("4820") },
  { ticker: "EXRE11", name: "Example Real Estate", value: dollars("2315.7") },
];
// How far into its food budget it is, in percent.
const foodUsed = 87;
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

export {
  accountBalances,
  accountCount,
  accountDetails,
  accounts,
  budgets,
  cents,
  contributions,
  days,
  foodUsed,
  funds,
  holdings,
  longAccount,
  longEvents,
  paymentDays,
  payments,
  recentPayments,
  refund,
  resentTransfer,
  spending,
  totals,
  transferHistory,
};
