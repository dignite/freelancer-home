import { isValidMonthSlug } from "pages/month/[month]";

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
