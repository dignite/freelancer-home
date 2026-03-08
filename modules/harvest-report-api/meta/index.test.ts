import { getInvoiceSumExcludingVAT, hoursMetaSlim } from "./";

const nonBreakingSpace = String.fromCharCode(160);

describe("getInvoiceSumExcludingVAT function", () => {
  const novemberThird = {
    id: 1,
    date: "2018-11-03",
    name: "Programming",
    billableHours: 3.1,
    hours: 3.1,
    cost: 964.1,
    comment: "",
  };
  const novemberFourth = {
    id: 2,
    date: "2018-11-04",
    name: "Programming",
    billableHours: 4.1,
    hours: 4.1,
    cost: 1275.1,
    comment: "",
  };
  const novemberSixth = {
    id: 3,
    date: "2018-11-06",
    name: "Programming",
    billableHours: 4.1,
    hours: 4.1,
    cost: 1275.1,
    comment: "",
  };
  const relevantTimeEntries = [novemberThird, novemberFourth, novemberSixth];

  it("should return total unbilled invoice size", () => {
    expect.assertions(1);
    const result = getInvoiceSumExcludingVAT(relevantTimeEntries);

    expect(result).toStrictEqual(
      `3${nonBreakingSpace}514,30${nonBreakingSpace}kr`
    );
  });
});

describe("hoursMetaSlim function", () => {
  const entries = [
    { id: 1, date: "2018-11-03", name: "Programming", billableHours: 3.1, hours: 3.1, cost: 964.1, comment: "" },
    { id: 2, date: "2018-11-04", name: "Programming", billableHours: 4.1, hours: 4.1, cost: 1275.1, comment: "" },
    { id: 3, date: "2018-11-06", name: "Programming", billableHours: 4.1, hours: 4.1, cost: 1275.1, comment: "" },
  ];

  it("should return totalBillableHours as the sum of all entries", () => {
    expect.assertions(1);
    const result = hoursMetaSlim(entries);
    expect(result.totalBillableHours).toBe(11.3);
  });

  it("should return totalBillableHoursPerWeek grouped by ISO week", () => {
    expect.assertions(1);
    const result = hoursMetaSlim(entries);
    // Nov 3+4 2018 are in ISO week 44; Nov 6 2018 is in ISO week 45
    expect(result.totalBillableHoursPerWeek).toStrictEqual({ w44: 7.2, w45: 4.1 });
  });
});
