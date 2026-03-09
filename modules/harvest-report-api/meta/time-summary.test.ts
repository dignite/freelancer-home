import { totalSum, perWeek } from "./time-summary";

describe("totalSum function", () => {
  it("should return zero for zero time entries", () => {
    expect.assertions(1);
    const result = totalSum([]);

    expect(result).toBe(0);
  });

  it("should return hours from single time entry", () => {
    expect.assertions(1);
    const novemberThird = {
      id: 1,
      date: "2018-11-03",
      name: "Programming",
      billableHours: 3.1,
      hours: 3.1,
      cost: 0,
      comment: "",
    };

    const result = totalSum([novemberThird]);

    expect(result).toBe(3.1);
  });

  it("should return sum from collection of time entries", () => {
    expect.assertions(1);
    const novemberThird = {
      id: 1,
      date: "2018-11-03",
      name: "Programming",
      billableHours: 3.1,
      hours: 3.1,
      cost: 0,
      comment: "",
    };
    const novemberFourth = {
      id: 2,
      date: "2018-11-04",
      name: "Programming",
      billableHours: 4.1,
      hours: 4.1,
      cost: 0,
      comment: "",
    };
    const novemberSixth = {
      id: 3,
      date: "2018-11-06",
      name: "Programming",
      billableHours: 4.12,
      hours: 4.12,
      cost: 0,
      comment: "",
    };

    const result = totalSum([novemberThird, novemberFourth, novemberSixth]);

    expect(result).toBe(11.3);
  });
});

describe("perWeek function", () => {
  it("should return empty object for zero time entries", () => {
    expect.assertions(1);
    const result = perWeek([]);

    expect(result).toStrictEqual({});
  });

  it("should return weekly hours from single time entry", () => {
    expect.assertions(1);
    const novemberThird = {
      id: 1,
      date: "2018-11-03",
      name: "Programming",
      billableHours: 3.1,
      hours: 3.1,
      cost: 0,
      comment: "",
    };

    const result = perWeek([novemberThird]);

    expect(result).toStrictEqual({
      "2018-w44": 3.1,
    });
  });

  it("should return weekly sum from collection of same-week time entries", () => {
    expect.assertions(1);
    const novemberThird = {
      id: 1,
      date: "2018-11-03",
      name: "Programming",
      billableHours: 3.1,
      hours: 3.1,
      cost: 0,
      comment: "",
    };
    const novemberFourth = {
      id: 2,
      date: "2018-11-04",
      name: "Programming",
      billableHours: 4.1,
      hours: 4.1,
      cost: 0,
      comment: "",
    };

    const result = perWeek([novemberThird, novemberFourth]);

    expect(result).toStrictEqual({
      "2018-w44": 7.2,
    });
  });

  it("should return weekly sum from collection of spread out time entries", () => {
    expect.assertions(1);
    const novemberThird = {
      id: 1,
      date: "2018-11-03",
      name: "Programming",
      billableHours: 3.1,
      hours: 3.1,
      cost: 0,
      comment: "",
    };
    const novemberFourth = {
      id: 2,
      date: "2018-11-04",
      name: "Programming",
      billableHours: 4.1,
      hours: 4.1,
      cost: 0,
      comment: "",
    };
    const novemberSixth = {
      id: 3,
      date: "2018-11-06",
      name: "Programming",
      billableHours: 4.1,
      hours: 4.1,
      cost: 0,
      comment: "",
    };

    const result = perWeek([novemberThird, novemberFourth, novemberSixth]);

    expect(result).toStrictEqual({
      "2018-w44": 7.2,
      "2018-w45": 4.1,
    });
  });

  it("zero-pads week number so w09 sorts before w10", () => {
    expect.assertions(1);
    // 2026-02-25 is ISO week 9; 2026-03-04 is ISO week 10
    const week9Entry = {
      id: 1,
      date: "2026-02-25",
      name: "Programming",
      billableHours: 1.0,
      hours: 1.0,
      cost: 0,
      comment: "",
    };
    const week10Entry = {
      id: 2,
      date: "2026-03-04",
      name: "Programming",
      billableHours: 2.0,
      hours: 2.0,
      cost: 0,
      comment: "",
    };

    const result = perWeek([week9Entry, week10Entry]);
    const sortedKeys = Object.keys(result).sort();

    expect(sortedKeys).toStrictEqual(["2026-w09", "2026-w10"]);
  });
});
