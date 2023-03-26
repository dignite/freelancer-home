import {
  getTimeEntriesForMonth,
  SimplifiedUnbilledTimeEntry,
} from "./npm-package-encapsulation/harvest-queries";
import { SEK } from "./npm-package-encapsulation/swedish-crowns";

export interface HarvestReportLambdaTimeEntry {
  id: SimplifiedUnbilledTimeEntry["id"];
  date: SimplifiedUnbilledTimeEntry["date"];
  name: SimplifiedUnbilledTimeEntry["name"];
  billableHours: number;
  hours: number;
  cost: number;
  comment: SimplifiedUnbilledTimeEntry["comment"];
  isRunning: SimplifiedUnbilledTimeEntry["isRunning"];
  billableRate: SimplifiedUnbilledTimeEntry["billableRate"];
  lastTick: SimplifiedUnbilledTimeEntry["startedTime"];
}

export const get = async (
  startOfMonth: Date,
  lastDayOfMonth: Date
): Promise<HarvestReportLambdaTimeEntry[]> => {
  const now = new Date();
  const timeEntries = await getTimeEntriesForMonth(
    startOfMonth,
    lastDayOfMonth
  );
  const timeEntriesWithCost = timeEntries.map((timeEntry) => {
    const hours = timeEntry.hours
      ? roundToNearestSixMinutes(timeEntry.hours)
      : 0;
    const billableHours =
      timeEntry.billable && timeEntry.billableRate ? hours : 0;

    return {
      id: timeEntry.id,
      date: timeEntry.date,
      name: timeEntry.name,
      billableHours,
      hours: hours,
      cost: SEK(billableHours).multiply(timeEntry.billableRate).getAmount(),
      comment: timeEntry.comment,
      isRunning: timeEntry.isRunning,
      billableRate: timeEntry.billableRate,
      // Add hours to startedTime to get the time when the time entry was last ticked
      lastTick: new Date(
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          parseInt(timeEntry.startedTime?.substring(0, 2), 10),
          parseInt(timeEntry.startedTime?.substring(3, 5), 10),
          0,
          0
        ).getTime() +
          hours * 60 * 60 * 1000
      ),
    };
  });
  return timeEntriesWithCost;
};

const roundToNearestSixMinutes = (hours: number) => Math.round(hours * 10) / 10;
