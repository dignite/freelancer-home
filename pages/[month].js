import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { BillableHoursPerWeek } from "../modules/hours/billable-hours-per-week";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../modules/layout/vertical-rhythm";
import { getHours } from "./api/hours";
import { getInvoice } from "./api/invoice";

export default function MonthPage({ serverSideHours, serverSideInvoice }) {
  const [hours, updateHours] = useStateWithUpdateCallback(
    serverSideHours,
    getHours
  );
  const [invoice, updateInvoice] = useStateWithUpdateCallback(
    serverSideInvoice,
    getInvoice
  );
  const router = useRouter();
  const { month } = router.query;
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <Heading>Invoice</Heading>
      <Paragraph>{invoice.totalExcludingVAT} excluding VAT</Paragraph>
      <Button onClick={updateInvoice}>Refresh invoice</Button>
      <BillableHoursPerWeek meta={hours.meta} />
      <Button onClick={updateHours}>Refresh hours</Button>
    </>
  );
}

export async function getServerSideProps(context) {
  const { month } = context.query;
  if (!isValidMonthSlug(month)) {
    return getCurrentMonthRedirect();
  }

  const [serverSideHours, serverSideInvoice] = await Promise.all([
    getHours(),
    getInvoice(),
  ]);
  return { props: { serverSideHours, serverSideInvoice } };
}

export const isValidMonthSlug = (month) => month.length === 7;

export const getCurrentMonthRedirect = () => ({
  redirect: {
    destination: `/${new Date().toISOString().slice(0, 7)}`,
    permanent: false,
  },
});

const useStateWithUpdateCallback = (initialState, getRefreshedState) => {
  const [state, setState] = useState(initialState);
  const updateState = useCallback(async () => {
    setState(await getRefreshedState());
  }, setState);
  return [state, updateState];
};
