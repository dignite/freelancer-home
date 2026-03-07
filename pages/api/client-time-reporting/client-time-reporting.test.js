const handler = require("./[startDate]/[endDate]").default;

describe("GET /api/client-time-reporting — unconfigured (no PE_ACCOUNTING_ACCOUNT_ID)", () => {
  let statusCode;
  let responseBody;

  beforeEach(async () => {
    delete process.env.PE_ACCOUNTING_ACCOUNT_ID;

    const json = jest.fn();
    const req = { query: { startDate: "2024-01-01", endDate: "2024-01-31" } };
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    statusCode = res.status.mock.calls[0][0];
    responseBody = json.mock.calls[0][0];
  });

  it("returns status 200", () => {
    expect(statusCode).toBe(200);
  });

  it("returns empty entries", () => {
    expect(responseBody).toEqual({ entries: [] });
  });
});
