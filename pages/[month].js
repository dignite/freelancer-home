import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { BillableHoursPerWeek } from "../modules/hours/billable-hours-per-week";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../modules/layout/vertical-rhythm";
import { getHours } from "./api/hours/[startDate]/[endDate]";
import { getInvoice } from "./api/invoice/[startDate]/[endDate]";

export default function MonthPage({
  serverSideHours,
  serverSideInvoice,
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth,
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
  const router = useRouter();
  const { month } = router.query;
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <Heading>Invoice</Heading>
      <Paragraph>{invoice.totalExcludingVAT} excluding VAT</Paragraph>
      <Button onClick={updateInvoice}>Refresh invoice</Button>
      <BillableHoursPerWeek hours={hours} />
      <Button onClick={updateHours}>Refresh hours</Button>
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

  const [serverSideHours, serverSideInvoice] = await Promise.all([
    getHours(formattedFirstDayOfMonth, formattedLastDayOfMonth),
    getInvoice(formattedFirstDayOfMonth, formattedLastDayOfMonth),
  ]);
  return {
    props: {
      serverSideHours,
      serverSideInvoice,
      formattedFirstDayOfMonth,
      formattedLastDayOfMonth,
    },
  };
}

export const isValidMonthSlug = (month) => month.length === 7;

export const getCurrentMonthRedirect = () => ({
  redirect: {
    destination: `/${new Date().toISOString().slice(0, 7)}`,
    permanent: false,
  },
});

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
