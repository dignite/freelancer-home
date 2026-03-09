import { render, screen, act, fireEvent } from "@testing-library/react";
import { BillableHoursPerWeek } from "./billable-hours-per-week";
import { BillableHoursClipboardButton } from "./billable-hours-clipboard-button";

const makeHours = (perWeek) => ({
  totalBillableHours: Object.values(perWeek).reduce((a, b) => a + b, 0),
  totalBillableHoursPerWeek: perWeek,
});

describe("BillableHoursPerWeek", () => {
  it("renders week keys in sorted order", () => {
    const hours = makeHours({
      "2024-w03": 8.0,
      "2024-w01": 16.0,
      "2024-w02": 4.0,
    });
    render(<BillableHoursPerWeek hours={hours} />);

    const rows = screen.getAllByRole("row");
    // rows[0] = header, rows[1..3] = data weeks, rows[4] = footer total
    expect(rows[1]).toHaveTextContent("2024-w01");
    expect(rows[2]).toHaveTextContent("2024-w02");
    expect(rows[3]).toHaveTextContent("2024-w03");
  });

  it("formats per-week hours with one decimal place", () => {
    const hours = makeHours({ "2024-w01": 7.5 });
    render(<BillableHoursPerWeek hours={hours} />);
    expect(screen.getAllByText("7.5").length).toBeGreaterThan(0);
  });

  it("shows total in the footer", () => {
    const hours = makeHours({ "2024-w01": 16.0, "2024-w02": 8.0 });
    render(<BillableHoursPerWeek hours={hours} />);
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("24.0")).toBeInTheDocument();
  });
});

describe("BillableHoursClipboardButton", () => {
  const defaultProps = {
    hours: makeHours({ "2024-w01": 40.0 }),
    formattedFirstDayOfMonth: "2024-01-01",
    formattedLastDayOfMonth: "2024-01-31",
  };

  let writeText;

  beforeEach(() => {
    writeText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("shows 'Copy to clipboard' initially", () => {
    render(<BillableHoursClipboardButton {...defaultProps} />);
    expect(screen.getByRole("button")).toHaveTextContent("Copy to clipboard");
  });

  it("shows 'Copied to clipboard ✓' after successful copy", async () => {
    render(<BillableHoursClipboardButton {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(screen.getByRole("button")).toHaveTextContent(
      "Copied to clipboard ✓"
    );
  });

  it("resets button text after 2 seconds", async () => {
    jest.useFakeTimers();
    render(<BillableHoursClipboardButton {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(screen.getByRole("button")).toHaveTextContent(
      "Copied to clipboard ✓"
    );
    act(() => jest.advanceTimersByTime(2000));
    expect(screen.getByRole("button")).toHaveTextContent("Copy to clipboard");
  });

  it("stays at 'Copy to clipboard' when clipboard write fails", async () => {
    writeText.mockRejectedValue(new Error("Permission denied"));
    render(<BillableHoursClipboardButton {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(screen.getByRole("button")).toHaveTextContent("Copy to clipboard");
  });

  it("writes correct text to clipboard", async () => {
    render(<BillableHoursClipboardButton {...defaultProps} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button"));
    });
    expect(writeText).toHaveBeenCalledWith(
      "2024-01-01 - 2024-01-31\n2024-w01:  40.0h\nTotal: 40.0h"
    );
  });
});
