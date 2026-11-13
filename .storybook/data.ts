// One fictitious household's money, which every story draws from, so the gallery reads as one app in use. Every name
// is made up; data is added rather than changed, so a story's screenshot holds.
import {
  CarIcon,
  GiftIcon,
  GraduationCapIcon,
  HeartPulseIcon,
  HouseIcon,
  PawPrintIcon,
  PlaneIcon,
  ShoppingCartIcon,
  TvIcon,
} from "lucide-react";

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

// Fictitious sums are still sums: a decimal string in cents, exact.
function cents(value: string): bigint {
  const [whole = "0", decimals = ""] = value.split(".");
  const sign = whole.startsWith("-") ? -1n : 1n;
  return (
    BigInt(whole) * 100n + sign * BigInt(decimals.padEnd(2, "0").slice(0, 2))
  );
}

export { accounts, cents, days, longAccount, payments, spending };
