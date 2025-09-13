import { expect, test } from "vitest";
import { buyerBase } from "../validators/buyer";

test("budgetMax must be >= budgetMin", () => {
  const input = {
    fullName: "John Doe",
    phone: "9876543210",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "2",
    purpose: "Buy",
    timeline: "0-3m",
    source: "Website",
    budgetMin: 1000000,
    budgetMax: 900000
  };
  expect(() => buyerBase.parse(input)).toThrow();
});

test("valid budgets pass", () => {
  const input = {
    fullName: "John Doe",
    phone: "9876543210",
    city: "Chandigarh",
    propertyType: "Apartment",
    bhk: "2",
    purpose: "Buy",
    timeline: "0-3m",
    source: "Website",
    budgetMin: 900000,
    budgetMax: 1000000
  };
  expect(buyerBase.parse(input)).toBeTruthy();
});
