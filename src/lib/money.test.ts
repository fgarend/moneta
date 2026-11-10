import { describe, expect, it } from "vitest";
import { formatMoney } from "./money.js";

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
