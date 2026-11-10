import { describe, expect, it } from "vitest";
import { formatMoney, formatPercent } from "./money.js";

const nbsp = " ";
const minus = "−";

describe("formatMoney", () => {
  it.each([
    ["pads to the currency's decimals", "1234.5", "BRL", `R$${nbsp}1.234,50`],
    ["keeps every digit given", "0.0001234", "BRL", `R$${nbsp}0,0001234`],
    [
      "stays exact beyond what a number holds",
      "123456789012345678.99",
      "BRL",
      `R$${nbsp}123.456.789.012.345.678,99`,
    ],
    ["writes the minus sign", "-286.4", "BRL", `${minus}R$${nbsp}286,40`],
    ["gives zero no sign", "-0.00", "BRL", `R$${nbsp}0,00`],
    ["writes none of the yen's decimals", "1234", "JPY", `JP¥${nbsp}1.234`],
  ])("%s", (_case, amount, currency, text) => {
    expect(formatMoney("pt-BR", { amount, currency })).toBe(text);
  });

  it("writes the language it is given", () => {
    expect(formatMoney("en-US", { amount: "-1234.5", currency: "USD" })).toBe(
      `${minus}$1,234.50`,
    );
  });

  it.each(["1,5", "", "1e5", "+10", " 1", "1.", ".5", "abc"])(
    'refuses "%s", which is not a decimal string',
    (amount) => {
      expect(() => formatMoney("pt-BR", { amount, currency: "BRL" })).toThrow(
        `Money: "${amount}" is not a decimal string, as "1234.50".`,
      );
    },
  );

  it.each(["real", "brl", "BR", "BRLL", ""])(
    'refuses "%s", which is not a currency code',
    (currency) => {
      expect(() => formatMoney("pt-BR", { amount: "1", currency })).toThrow(
        `Money: "${currency}" is not a currency code, as "BRL".`,
      );
    },
  );
});

describe("formatPercent", () => {
  it.each([
    ["shows a ratio's decimals beyond the hundredths", "0.459", "45,9%"],
    ["shows a whole percent with none", "0.15", "15%"],
    ["keeps the zeros given", "0.1500", "15,00%"],
    ["keeps every digit given", "0.0001234", "0,01234%"],
    ["shows more than a whole", "1.25", "125%"],
    ["shows a whole with no decimals", "1", "100%"],
    [
      "stays exact beyond what a number holds",
      "1234567890123456.7891",
      "123.456.789.012.345.678,91%",
    ],
    ["writes the minus sign", "-0.021", `${minus}2,1%`],
    ["gives zero no sign", "-0.00", "0%"],
  ])("%s", (_case, ratio, text) => {
    expect(formatPercent("pt-BR", ratio)).toBe(text);
  });

  it("writes the language it is given", () => {
    expect(formatPercent("en-US", "-0.459")).toBe(`${minus}45.9%`);
  });

  it.each(["45,9", "", "1e-2", "+0.5", "50%"])(
    'refuses "%s", which is not a decimal string',
    (ratio) => {
      expect(() => formatPercent("pt-BR", ratio)).toThrow(
        `Percent: "${ratio}" is not a decimal string, as "0.459".`,
      );
    },
  );
});
