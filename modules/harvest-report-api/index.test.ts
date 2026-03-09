import { summary, byName } from "./index";
import { server } from "./mock-service-worker/server";
import {
  prepareGetTimeEntriesSuccess,
  getTimeEntriesError,
} from "./mock-service-worker/harvest-handlers";

jest.mock("./process-env", () => ({
  get: (key: string) => `Value from process.env.${key}`,
}));

const nonBreakingSpace = String.fromCharCode(160);

describe("summary function", () => {
  it("returns hours and invoice for the given date range", async () => {
    expect.assertions(1);
    server.resetHandlers(
      prepareGetTimeEntriesSuccess({
        userAgent:
          "harvest-report-lambda (Value from process.env.USER_AGENT_EMAIL)",
        accessToken: "Value from process.env.HARVEST_ACCESS_TOKEN",
        accountId: "Value from process.env.HARVEST_ACCOUNT_ID",
        isBilledQueryParameter: "false",
        isFromQueryParameter: "2020-11-01",
        isToQueryParameter: "2020-11-30",
      }),
    );

    const result = await summary("2020-11-01", "2020-11-30");

    // Default MSW entries: 3.5h + 4.5h + 2.7h = 10.7h billable, all in ISO week 45
    // Invoice: 10.7h × 220 SEK/h = 2 354,00 kr
    expect(result).toStrictEqual({
      hours: {
        totalBillableHours: 10.7,
        totalBillableHoursPerWeek: { "2020-w45": 10.7 },
      },
      invoice: {
        totalExcludingVATFormatted: `2${nonBreakingSpace}354,00${nonBreakingSpace}kr`,
      },
    });
  });

  it("rejects when the Harvest API returns an error", async () => {
    expect.assertions(1);
    server.resetHandlers(getTimeEntriesError);

    await expect(summary("2020-11-01", "2020-11-30")).rejects.toThrow(
      'Error getting time entries: 401 Unauthorized, {"message":"Error getting time entries, bad request"}',
    );
  });
});

const config = {
  userAgent: "harvest-report-lambda (Value from process.env.USER_AGENT_EMAIL)",
  accessToken: "Value from process.env.HARVEST_ACCESS_TOKEN",
  accountId: "Value from process.env.HARVEST_ACCOUNT_ID",
  isBilledQueryParameter: "false",
  isFromQueryParameter: "2020-11-01",
  isToQueryParameter: "2020-11-30",
};

describe("byName function", () => {
  it("returns only entries matching the given name", async () => {
    expect.assertions(1);
    server.resetHandlers(
      prepareGetTimeEntriesSuccess(config, [
        {
          id: 1,
          spent_date: "2020-11-05",
          task: { name: "Programming" },
          is_billed: false,
          billable: true,
          billable_rate: 220,
          hours: 3.0,
          notes: null,
        },
        {
          id: 2,
          spent_date: "2020-11-06",
          task: { name: "Vacation" },
          is_billed: false,
          billable: false,
          billable_rate: null,
          hours: 8.0,
          notes: null,
        },
        {
          id: 3,
          spent_date: "2020-11-07",
          task: { name: "Programming" },
          is_billed: false,
          billable: true,
          billable_rate: 220,
          hours: 5.0,
          notes: null,
        },
      ]),
    );

    const result = await byName("2020-11-01", "2020-11-30", "Programming");

    expect(result.map((e) => e.id)).toStrictEqual([1, 3]);
  });

  it("returns empty array when no entries match the name", async () => {
    expect.assertions(1);
    server.resetHandlers(
      prepareGetTimeEntriesSuccess(config, [
        {
          id: 1,
          spent_date: "2020-11-05",
          task: { name: "Vacation" },
          is_billed: false,
          billable: false,
          billable_rate: null,
          hours: 8.0,
          notes: null,
        },
      ]),
    );

    const result = await byName("2020-11-01", "2020-11-30", "Programming");

    expect(result).toStrictEqual([]);
  });
});
