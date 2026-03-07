import {
  isValidMonthSlug,
  lastDayOfMonth,
  firstDayOfLastMonth,
} from "pages/month/[month]";

describe("isValidMonthSlug", () => {
  it("accepts a valid YYYY-MM slug", () => {
    expect(isValidMonthSlug("2024-03")).toBe(true);
  });

  it("rejects a non-numeric 7-char string", () => {
    expect(isValidMonthSlug("aaaaaaa")).toBe(false);
  });

  it("rejects a slug with wrong separator", () => {
    expect(isValidMonthSlug("2024/03")).toBe(false);
  });

  it("rejects a slug that is too short", () => {
    expect(isValidMonthSlug("2024-3")).toBe(false);
  });

  it("rejects an out-of-range month number", () => {
    expect(isValidMonthSlug("2024-99")).toBe(false);
  });
});

describe("lastDayOfMonth", () => {
  it("returns 2024-01-31 for January", () => {
    expect(lastDayOfMonth(new Date("2024-01-01")).toISOString().slice(0, 10)).toBe("2024-01-31");
  });

  it("returns 2024-02-29 for February in a leap year", () => {
    expect(lastDayOfMonth(new Date("2024-02-01")).toISOString().slice(0, 10)).toBe("2024-02-29");
  });

  it("returns 2023-02-28 for February in a non-leap year", () => {
    expect(lastDayOfMonth(new Date("2023-02-01")).toISOString().slice(0, 10)).toBe("2023-02-28");
  });

  it("returns 2023-12-31 for December", () => {
    expect(lastDayOfMonth(new Date("2023-12-01")).toISOString().slice(0, 10)).toBe("2023-12-31");
  });
});

describe("firstDayOfLastMonth", () => {
  it("returns 2024-01-01 when current month is February 2024", () => {
    expect(firstDayOfLastMonth(new Date("2024-02-01")).toISOString().slice(0, 10)).toBe("2024-01-01");
  });

  it("returns 2023-12-01 when current month is January 2024 (year boundary)", () => {
    expect(firstDayOfLastMonth(new Date("2024-01-01")).toISOString().slice(0, 10)).toBe("2023-12-01");
  });
});
