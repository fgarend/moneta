import { describe, expect, it } from "vitest";
import { formatDate } from "./date.js";

// A fixed "now", as "today" and "this year" are counted from it: noon of Saturday, 24 October 2026, in São Paulo.
const now = new Date("2026-10-24T15:00:00Z");
const saoPaulo = "America/Sao_Paulo";

describe("formatDate", () => {
  it.each([
    ["a day, short, this year", "2026-10-24", {}, "24 de out."],
    ["a day, short, another year", "2025-10-24", {}, "24 de out. de 2025"],
    [
      "a day, long, this year",
      "2026-10-24",
      { format: "long" },
      "sábado, 24 de outubro",
    ],
    [
      "a day, long, another year",
      "2025-10-24",
      { format: "long" },
      "sexta-feira, 24 de outubro de 2025",
    ],
    ["a day, numeric", "2026-10-24", { format: "numeric" }, "24/10/2026"],
    ["a day, a month", "2026-10-24", { format: "month" }, "outubro de 2026"],
  ] as const)("writes %s", (_case, value, options, text) => {
    expect(
      formatDate("pt-BR", value, { ...options, now, timeZone: saoPaulo }),
    ).toBe(text);
  });

  it("writes the language it is given", () => {
    expect(
      formatDate("en-US", "2026-10-24", {
        format: "long",
        now,
        timeZone: saoPaulo,
      }),
    ).toBe("Saturday, October 24");
  });

  it("never moves a day, whatever the zone", () => {
    for (const timeZone of ["Pacific/Kiritimati", "Pacific/Pago_Pago"]) {
      expect(
        formatDate("pt-BR", "2026-10-24", {
          format: "numeric",
          now,
          timeZone,
        }),
      ).toBe("24/10/2026");
    }
  });

  it("writes a moment in its zone, with its time when asked", () => {
    const moment = "2026-10-24T02:30:00Z";
    expect(
      formatDate("pt-BR", moment, {
        format: "numeric",
        now,
        timeZone: saoPaulo,
      }),
    ).toBe("23/10/2026");
    expect(
      formatDate("pt-BR", moment, { showTime: true, now, timeZone: "UTC" }),
    ).toBe("24 de out., 02:30");
  });

  it.each([
    ["2026-10-24", "hoje"],
    ["2026-10-23", "ontem"],
    ["2026-10-25", "amanhã"],
    ["2026-10-22", "22 de out."],
    ["2026-10-26", "26 de out."],
  ])("writes %s as %s, relative to today", (value, text) => {
    expect(
      formatDate("pt-BR", value, { relative: true, now, timeZone: saoPaulo }),
    ).toBe(text);
  });

  it("counts today in the zone, for a moment too", () => {
    // 01:00 on the 25th in UTC is still the 24th, today, in São Paulo.
    expect(
      formatDate("pt-BR", "2026-10-25T01:00:00Z", {
        relative: true,
        now,
        timeZone: saoPaulo,
      }),
    ).toBe("hoje");
  });

  it("keeps relative words to the short format", () => {
    expect(
      formatDate("pt-BR", "2026-10-24", {
        format: "long",
        relative: true,
        now,
        timeZone: saoPaulo,
      }),
    ).toBe("sábado, 24 de outubro");
  });

  it.each([
    "24/10/2026",
    "2026-10-32",
    "2026-02-30",
    "2026-13-01",
    "2026-10-24 14:32",
    "2026-10-24T14:32:00",
    "",
    "today",
  ])('refuses "%s", which is not an ISO day or moment', (value) => {
    expect(() => formatDate("pt-BR", value, { now })).toThrow(
      `DateTime: "${value}" is not an ISO day or moment, as "2026-10-24" or "2026-10-24T14:32:00Z".`,
    );
  });

  it("refuses a time for a day, which has none", () => {
    expect(() =>
      formatDate("pt-BR", "2026-10-24", { showTime: true, now }),
    ).toThrow('DateTime: "2026-10-24" is a day, which has no time to show.');
  });

  it("takes the short format with no options", () => {
    expect(formatDate("pt-BR", "2001-01-01")).toBe("1 de jan. de 2001");
  });

  it("reads today from the clock when not given one", () => {
    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: saoPaulo,
    }).format(new Date());
    expect(
      formatDate("pt-BR", today, { relative: true, timeZone: saoPaulo }),
    ).toBe("hoje");
  });
});
