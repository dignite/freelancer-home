import { isValidDaySlug, getCurrentDayRedirect } from "pages/day/[day]";

describe("isValidDaySlug", () => {
  it("accepts a valid YYYY-MM-DD slug", () => {
    expect(isValidDaySlug("2024-03-01")).toBe(true);
  });

  it("rejects a non-numeric 10-char string", () => {
    expect(isValidDaySlug("aaaaaaaaaa")).toBe(false);
  });

  it("rejects a slug with wrong separators", () => {
    expect(isValidDaySlug("2024/03/01")).toBe(false);
  });

  it("rejects a slug with invalid month/day numbers", () => {
    expect(isValidDaySlug("2024-99-99")).toBe(false);
  });

  it("accepts Feb 29 in a leap year", () => {
    expect(isValidDaySlug("2024-02-29")).toBe(true);
  });

  it("rejects Feb 29 in a non-leap year", () => {
    expect(isValidDaySlug("2023-02-29")).toBe(false);
  });

  it("accepts Dec 31 (year-end boundary)", () => {
    expect(isValidDaySlug("2023-12-31")).toBe(true);
  });

  it("accepts Jan 1 (year-start boundary)", () => {
    expect(isValidDaySlug("2024-01-01")).toBe(true);
  });
});

describe("getCurrentDayRedirect", () => {
  it("returns a redirect to today in /day/YYYY-MM-DD format", () => {
    const result = getCurrentDayRedirect();
    expect(result.redirect.permanent).toBe(false);
    expect(result.redirect.destination).toMatch(/^\/day\/\d{4}-\d{2}-\d{2}$/);
  });
});
