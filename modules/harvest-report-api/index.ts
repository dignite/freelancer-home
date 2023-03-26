import { get, HarvestReportLambdaTimeEntry } from "./time-entries";
import {
  getInvoiceSumExcludingVAT,
  hoursMetaSlim,
  MetaSlim,
} from "./meta/index";
import { totalSum } from "./meta/time-summary";

export const singleDayHours = async (date: string): Promise<number> => {
  const parsedDate = new Date(Date.parse(date));
  const relevantTimeEntries = await get(parsedDate, parsedDate);
  return totalSum(relevantTimeEntries);
};

export const isRunning = async (): Promise<{
  isRunning: HarvestReportLambdaTimeEntry["isRunning"];
  billableRate: HarvestReportLambdaTimeEntry["billableRate"];
  lastTick: HarvestReportLambdaTimeEntry["lastTick"];
}> => {
  const today = new Date();
  const relevantTimeEntries = await get(today, today);
  const runningTimeEntry = relevantTimeEntries.find((x) => x.isRunning);
  return {
    isRunning: !!runningTimeEntry,
    billableRate: runningTimeEntry ? runningTimeEntry.billableRate : 0,
    lastTick: runningTimeEntry?.lastTick,
  };
};

export const hours = async (
  startDate: string,
  endDate: string
): Promise<MetaSlim> => {
  const parsedStartDate = new Date(Date.parse(startDate));
  const parsedEndDate = new Date(Date.parse(endDate));
  const relevantTimeEntries = await get(parsedStartDate, parsedEndDate);
  return hoursMetaSlim(relevantTimeEntries);
};

export const byName = async (
  startDate: string,
  endDate: string,
  name: string
): Promise<HarvestReportLambdaTimeEntry[]> => {
  const parsedStartDate = new Date(Date.parse(startDate));
  const parsedEndDate = new Date(Date.parse(endDate));
  const relevantTimeEntries = await get(parsedStartDate, parsedEndDate);
  return relevantTimeEntries.filter((x) => x.name === name);
};

export const invoice = async (
  startDate: string,
  endDate: string
): Promise<{ totalExcludingVAT: string }> => {
  const parsedStartDate = new Date(Date.parse(startDate));
  const parsedEndDate = new Date(Date.parse(endDate));
  const relevantTimeEntries = await get(parsedStartDate, parsedEndDate);
  return {
    totalExcludingVAT: getInvoiceSumExcludingVAT(relevantTimeEntries),
  };
};
