const { rest } = require("msw");
const {
  server,
} = require("../../../modules/harvest-report-api/mock-service-worker/server");
const handler = require("./[startDate]/[endDate]").default;

const KLEER_URL =
  "https://api.accounting.pe/v1/company/test-account-id/event";

describe("GET /api/client-time-reporting — unconfigured (no KLEER_ACCOUNT_ID)", () => {
  let statusCode;
  let responseBody;

  beforeEach(async () => {
    delete process.env.KLEER_ACCOUNT_ID;

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

describe("GET /api/client-time-reporting — configured (KLEER_ACCOUNT_ID set)", () => {
  beforeEach(() => {
    process.env.KLEER_ACCOUNT_ID = "test-account-id";
    process.env.KLEER_TOKEN = "test-token";
  });

  afterEach(() => {
    delete process.env.KLEER_ACCOUNT_ID;
    delete process.env.KLEER_TOKEN;
  });

  it("returns mapped entries when Kleer responds with valid data", async () => {
    server.resetHandlers(
      rest.get(KLEER_URL, (_req, res, ctx) =>
        res(
          ctx.json({
            "event-readables": [
              {
                id: { id: "evt-1" },
                date: "2024-01-15",
                hours: 8,
                comment: "Client meeting",
              },
            ],
          })
        )
      )
    );

    const json = jest.fn();
    const req = { query: { startDate: "2024-01-01", endDate: "2024-01-31" } };
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(json.mock.calls[0][0]).toEqual({
      entries: [
        { id: "evt-1", date: "2024-01-15", hours: 8, comment: "Client meeting" },
      ],
    });
  });

  it("returns empty entries when event-readables is missing from response", async () => {
    server.resetHandlers(
      rest.get(KLEER_URL, (_req, res, ctx) => res(ctx.json({})))
    );

    const json = jest.fn();
    const req = { query: { startDate: "2024-01-01", endDate: "2024-01-31" } };
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(json.mock.calls[0][0]).toEqual({ entries: [] });
  });

  it("returns 502 when Kleer responds with a non-OK status", async () => {
    server.resetHandlers(
      rest.get(KLEER_URL, (_req, res, ctx) =>
        res(ctx.status(503), ctx.json({ error: "Service unavailable" }))
      )
    );

    const json = jest.fn();
    const req = { query: { startDate: "2024-01-01", endDate: "2024-01-31" } };
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(502);
    expect(json.mock.calls[0][0]).toMatchObject({
      error: expect.stringContaining("503"),
    });
  });

  it("returns 500 when Kleer responds with malformed JSON", async () => {
    server.resetHandlers(
      rest.get(KLEER_URL, (_req, res, ctx) =>
        res(
          ctx.status(200),
          ctx.set("Content-Type", "text/html"),
          ctx.body("<html>Bad Gateway</html>")
        )
      )
    );

    const json = jest.fn();
    const req = { query: { startDate: "2024-01-01", endDate: "2024-01-31" } };
    const res = { status: jest.fn().mockReturnValue({ json }) };

    await handler(req, res);

    expect(res.status.mock.calls[0][0]).toBe(500);
  });
});
