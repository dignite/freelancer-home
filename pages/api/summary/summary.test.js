jest.mock("../../../modules/harvest-report-api/index");

const { summary } = require("../../../modules/harvest-report-api/index");
const handler = require("./[startDate]/[endDate]").default;

describe("GET /api/summary/[startDate]/[endDate]", () => {
  const req = { query: { startDate: "2024-01-01", endDate: "2024-01-31" } };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns 200 with hours and invoice when summary resolves", async () => {
    const mockData = {
      hours: {
        totalBillableHours: 40.0,
        totalBillableHoursPerWeek: { w1: 40.0 },
      },
      invoice: { totalExcludingVATFormatted: "88 000 kr" },
    };
    summary.mockResolvedValue(mockData);

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(json.mock.calls[0][0]).toEqual(mockData);
    expect(summary).toHaveBeenCalledWith("2024-01-01", "2024-01-31");
  });

  it("returns 500 with error message when summary rejects", async () => {
    summary.mockRejectedValue(new Error("Harvest API unreachable"));

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(500);
    expect(json.mock.calls[0][0]).toEqual({
      error: "Harvest API unreachable",
    });
  });
});
