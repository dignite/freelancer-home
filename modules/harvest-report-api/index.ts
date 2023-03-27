import { get, HarvestReportLambdaTimeEntry } from "./time-entries";
import {
  getInvoiceSumExcludingVAT,
  hoursMetaSlim,
  MetaSlim,
} from "./meta/index";

export const summary = async (
  startDate: string,
  endDate: string
): Promise<{
  hours: MetaSlim;
  invoice: {
    totalExcludingVATFormatted: string;
  };
}> => {
  const parsedStartDate = new Date(Date.parse(startDate));
  const parsedEndDate = new Date(Date.parse(endDate));
  const relevantTimeEntries = await get(parsedStartDate, parsedEndDate);
  return {
    hours: hoursMetaSlim(relevantTimeEntries),
    invoice: {
      totalExcludingVATFormatted:
        getInvoiceSumExcludingVAT(relevantTimeEntries),
    },
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
