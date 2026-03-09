jest.mock("../../../modules/harvest-report-api/index");

const { byName } = require("../../../modules/harvest-report-api/index");
const handler = require("./[name]/[startDate]/[endDate]").default;

describe("GET /api/by-name/[name]/[startDate]/[endDate]", () => {
  const req = {
    query: { name: "VAB", startDate: "2024-01-01", endDate: "2024-01-31" },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns 200 with hours data when byName resolves", async () => {
    const mockData = {
      totalBillableHours: 8.0,
      totalBillableHoursPerWeek: { "2024-w01": 8.0 },
    };
    byName.mockResolvedValue(mockData);

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(json.mock.calls[0][0]).toEqual(mockData);
    expect(byName).toHaveBeenCalledWith("2024-01-01", "2024-01-31", "VAB");
  });

  it("returns 500 with error message when byName rejects", async () => {
    byName.mockRejectedValue(new Error("Harvest API unreachable"));

    const json = jest.fn();
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(500);
    expect(json.mock.calls[0][0]).toEqual({
      error: "Harvest API unreachable",
    });
  });
});
