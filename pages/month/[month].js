import Link from "next/link";
import { useCallback, useState, useEffect, useRef } from "react";
import { BillableHoursPerWeek } from "../../modules/hours/billable-hours-per-week";
import { BillableHoursClipboardButton } from "../../modules/hours/billable-hours-clipboard-button";
import { VAB } from "../../modules/hours/vab";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../../modules/layout/vertical-rhythm";
import { getHours } from "../api/hours/[startDate]/[endDate]";
import { getInvoice } from "../api/invoice/[startDate]/[endDate]";
import { getVAB } from "../api/by-name/VAB/[startDate]/[endDate]";

export default function MonthPage({
  serverSideHours,
  serverSideInvoice,
  serverSideVAB,
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth,
  formattedFirstDayOfLastMonth,
  formattedLastDayOfLastMonth,
  isCurrentMonth,
  month,
}) {
  const monthName = useMonthName(month);
  const [hours, updateHours] = useStateWithUpdateCallback(
    serverSideHours,
    getHours,
    formattedFirstDayOfMonth,
    formattedLastDayOfMonth
  );
  const [invoice, updateInvoice] = useStateWithUpdateCallback(
    serverSideInvoice,
    getInvoice,
    formattedFirstDayOfMonth,
    formattedLastDayOfMonth
  );
  const [vab, updateVAB] = useStateWithUpdateCallback(
    serverSideVAB,
    getVAB,
    formattedFirstDayOfLastMonth,
    formattedLastDayOfLastMonth
  );
  return (
    <>
      <MainHeading>
        🕚 {monthName} {month}
      </MainHeading>
      {isCurrentMonth ? null : (
        <Paragraph>
          <Link href="/">Jump to current month</Link>
        </Paragraph>
      )}
      <Heading>Invoice</Heading>
      <Paragraph>{invoice.totalExcludingVAT} excluding VAT</Paragraph>
      <Button onClick={updateInvoice}>Refresh invoice</Button>
      <BillableHoursPerWeek hours={hours} />
      <BillableHoursClipboardButton
        hours={hours}
        formattedFirstDayOfMonth={formattedFirstDayOfMonth}
        formattedLastDayOfMonth={formattedLastDayOfMonth}
      />
      <Button onClick={updateHours}>Refresh hours</Button>
      <VAB
        startDate={formattedFirstDayOfLastMonth}
        endDate={formattedLastDayOfLastMonth}
        vab={vab}
      />
      <Button onClick={updateVAB}>Refresh VAB</Button>
    </>
  );
}

export async function getServerSideProps(context) {
  const { month } = context.query;
  if (!isValidMonthSlug(month)) {
    return getCurrentMonthRedirect();
  }

  const formattedFirstDayOfMonth = `${month}-01`;
  const formattedLastDayOfMonth = lastDayOfMonth(
    new Date(Date.parse(formattedFirstDayOfMonth))
  )
    .toISOString()
    .slice(0, 10);
  const formattedFirstDayOfLastMonth = firstDayOfLastMonth(
    new Date(Date.parse(formattedFirstDayOfMonth))
  )
    .toISOString()
    .slice(0, 10);
  const formattedLastDayOfLastMonth = lastDayOfMonth(
    new Date(Date.parse(formattedFirstDayOfLastMonth))
  )
    .toISOString()
    .slice(0, 10);

  const [serverSideHours, serverSideInvoice, serverSideVAB] = await Promise.all(
    [
      getHours(formattedFirstDayOfMonth, formattedLastDayOfMonth),
      getInvoice(formattedFirstDayOfMonth, formattedLastDayOfMonth),
      getVAB(formattedFirstDayOfLastMonth, formattedLastDayOfLastMonth),
    ]
  );

  const isCurrentMonth = getCurrentMonthSlug() === month;

  return {
    props: {
      serverSideHours,
      serverSideInvoice,
      serverSideVAB,
      formattedFirstDayOfMonth,
      formattedLastDayOfMonth,
      formattedFirstDayOfLastMonth,
      formattedLastDayOfLastMonth,
      isCurrentMonth,
      month,
    },
  };
}

export const isValidMonthSlug = (month) => month.length === 7;

export const getCurrentMonthRedirect = () => ({
  redirect: {
    destination: `/month/${getCurrentMonthSlug()}`,
    permanent: false,
  },
});

const getCurrentMonthSlug = () => new Date().toISOString().slice(0, 7);

const useMonthName = (month) => {
  return new Date(Date.parse(`${month}-01`)).toLocaleString("default", {
    month: "long",
  });
};

export const lastDayOfMonth = (dayInMonth) => {
  return new Date(
    Date.UTC(dayInMonth.getFullYear(), dayInMonth.getMonth() + 1, 0)
  );
};

const firstDayOfLastMonth = (dayInNextMonth) => {
  return new Date(
    Date.UTC(dayInNextMonth.getFullYear(), dayInNextMonth.getMonth() - 1, 1)
  );
};

const useStateWithUpdateCallback = (
  initialState,
  getRefreshedState,
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth
) => {
  const initialRender = useRef(true);
  const [state, setState] = useState(initialState);
  const updateState = useCallback(async () => {
    setState(
      await getRefreshedState(formattedFirstDayOfMonth, formattedLastDayOfMonth)
    );
  }, [setState, formattedFirstDayOfMonth, formattedLastDayOfMonth]);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
    } else {
      updateState();
    }
  }, [updateState]);
  return [state, updateState];
};
