import { useRouter } from "next/router";
import Link from "next/link";
import { useCallback, useState } from "react";
import { BillableHoursPerWeek } from "../modules/hours/billable-hours-per-week";
import { VAB } from "../modules/hours/vab";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../modules/layout/vertical-rhythm";
import { getHours } from "./api/hours/[startDate]/[endDate]";
import { getInvoice } from "./api/invoice/[startDate]/[endDate]";
import { getVAB } from "./api/vab/[startDate]/[endDate]";

export default function MonthPage({
  serverSideHours,
  serverSideInvoice,
  serverSideVAB,
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth,
  isCurrentMonth,
}) {
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
    formattedFirstDayOfMonth,
    formattedLastDayOfMonth
  );
  const router = useRouter();
  const { month } = router.query;
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      {isCurrentMonth ? null : (
        <Paragraph>
          <Link href="/">Jump to current month</Link>
        </Paragraph>
      )}
      <Heading>Invoice</Heading>
      <Paragraph>{invoice.totalExcludingVAT} excluding VAT</Paragraph>
      <Button onClick={updateInvoice}>Refresh invoice</Button>
      <BillableHoursPerWeek hours={hours} />
      <Button onClick={updateHours}>Refresh hours</Button>
      <VAB vab={vab} />
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

  const [serverSideHours, serverSideInvoice, serverSideVAB] = await Promise.all(
    [
      getHours(formattedFirstDayOfMonth, formattedLastDayOfMonth),
      getInvoice(formattedFirstDayOfMonth, formattedLastDayOfMonth),
      getVAB(formattedFirstDayOfMonth, formattedLastDayOfMonth),
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
      isCurrentMonth,
    },
  };
}

export const isValidMonthSlug = (month) => month.length === 7;

export const getCurrentMonthRedirect = () => ({
  redirect: {
    destination: `/${getCurrentMonthSlug()}`,
    permanent: false,
  },
});

const getCurrentMonthSlug = () => new Date().toISOString().slice(0, 7);

export const lastDayOfMonth = (dayInMonth) => {
  return new Date(
    Date.UTC(dayInMonth.getFullYear(), dayInMonth.getMonth() + 1, 0)
  );
};

const useStateWithUpdateCallback = (
  initialState,
  getRefreshedState,
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth
) => {
  const [state, setState] = useState(initialState);
  const updateState = useCallback(async () => {
    setState(
      await getRefreshedState(formattedFirstDayOfMonth, formattedLastDayOfMonth)
    );
  }, [setState, formattedFirstDayOfMonth, formattedLastDayOfMonth]);
  return [state, updateState];
};
