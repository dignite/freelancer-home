import { isValidDaySlug } from "./[day]";

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
});
