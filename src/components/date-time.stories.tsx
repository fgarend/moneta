import type { Meta, StoryObj } from "@storybook/react-vite";
import { I18nProvider } from "react-aria-components";
import { expect, within } from "storybook/test";
import { Caught } from "../../.storybook/caught.js";
import { useFormatDate } from "./date.js";
import { DateTime } from "./date-time.js";
import { MoneyProvider } from "./money-provider.js";

// A day of another year, so its year shows whatever year the clock says, and a moment of it.
const day = "2001-01-01";
const moment = "2001-01-01T14:32:00Z";
const noDate = "No date yet";
const dash = "—";

// Today and yesterday where the story runs, as "today" is the clock's.
function dayAway(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return new Intl.DateTimeFormat("en-CA").format(date);
}

const meta = {
  title: "Components/Display & Media/DateTime",
  component: DateTime,
  decorators: [
    (Story) => (
      <I18nProvider locale="pt-BR">
        <Story />
      </I18nProvider>
    ),
  ],
  args: { value: day },
} satisfies Meta<typeof DateTime>;

type Story = StoryObj<typeof meta>;

// A date as a <time> whose datetime is the value given, in the four formats, each starting with a capital, and today
// and yesterday as words.
const Default: Story = {
  tags: ["visual"],
  render: () => (
    <ul className="flex flex-col gap-2 p-6">
      <li>
        <DateTime value={day} />
      </li>
      <li>
        <DateTime format="long" value={day} />
      </li>
      <li>
        <DateTime format="numeric" value={day} />
      </li>
      <li>
        <DateTime format="month" value={day} />
      </li>
      <li>
        <DateTime relative={true} value={dayAway(0)} />
      </li>
      <li>
        <DateTime relative={true} value={dayAway(-1)} />
      </li>
    </ul>
  ),
  play: async ({ canvasElement }) => {
    const times = [...canvasElement.querySelectorAll("time")];

    await expect(times.map((time) => time.textContent)).toEqual([
      "1 de jan. de 2001",
      "Segunda-feira, 1 de janeiro de 2001",
      "01/01/2001",
      "Janeiro de 2001",
      "Hoje",
      "Ontem",
    ]);
    await expect(times.map((time) => time.dateTime)).toEqual([
      day,
      day,
      day,
      day,
      dayAway(0),
      dayAway(-1),
    ]);
  },
};

// This year's dates leave their year out, and a moment shows its time in the zone asked for.
const ThisYearAndTime: Story = {
  render: () => (
    <>
      <DateTime value={dayAway(-7)} />
      <DateTime showTime={true} timeZone="UTC" value={moment} />
    </>
  ),
  play: async ({ canvasElement }) => {
    const [thisYear, withTime] = [...canvasElement.querySelectorAll("time")];

    await expect(thisYear?.textContent).not.toContain(
      String(new Date().getFullYear()),
    );
    await expect(withTime?.textContent).toBe("1 de jan. de 2001, 14:32");
    await expect(withTime?.dateTime).toBe(moment);
  },
};

// No date: a dash screen readers skip, and the app's words they read, from the piece or from MoneyProvider.
const Empty: Story = {
  render: () => (
    <MoneyProvider emptyLabel={noDate}>
      <DateTime value={null} />
    </MoneyProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(dash)).toHaveAttribute("aria-hidden", "true");
    await expect(canvas.getByText(noDate)).toHaveClass("sr-only");
    await expect(canvasElement.querySelector("time")).toBeNull();
  },
};

const EmptyWithoutWords: Story = {
  render: () => (
    <Caught>
      <DateTime value={null} />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        "DateTime: no date needs an emptyLabel, on it or on MoneyProvider.",
      ),
    ).toBeVisible();
  },
};

// A value that is not an ISO day or moment says so, rather than show a wrong day.
const NotIso: Story = {
  render: () => (
    <Caught>
      <DateTime value="24/10/2026" />
    </Caught>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'DateTime: "24/10/2026" is not an ISO day or moment, as "2026-10-24" or "2026-10-24T14:32:00Z".',
      ),
    ).toBeVisible();
  },
};

// The hook gives the same text where no piece can go, in the browser's case, to sit in a sentence.
const Hook: Story = {
  render: function Render() {
    const formatDate = useFormatDate();
    return (
      <p>
        {`Updated ${formatDate(dayAway(0), { relative: true })}, `}
        {formatDate(day, { format: "long" })}
      </p>
    );
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.textContent).toBe(
      "Updated hoje, segunda-feira, 1 de janeiro de 2001",
    );
  },
};

export default meta;
export { Default, Empty, EmptyWithoutWords, Hook, NotIso, ThisYearAndTime };
