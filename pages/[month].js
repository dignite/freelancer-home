import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { UnbilledHoursPerWeek } from "../modules/hours/unbilled-hours-per-week";
import {
  Heading,
  MainHeading,
  Paragraph,
} from "../modules/layout/vertical-rhythm";
import { getHours } from "./api/hours";
import { getUnbilledInvoice } from "./api/unbilled-invoice";

export default function MonthPage({
  serverSideHours,
  serverSideUnbilledInvoice,
}) {
  const [hours, updateHours] = useStateWithUpdateCallback(
    serverSideHours,
    getHours
  );
  const [unbilledInvoice, updateUnbilledInvoice] = useStateWithUpdateCallback(
    serverSideUnbilledInvoice,
    getUnbilledInvoice
  );
  const router = useRouter();
  const { month } = router.query;
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <Heading>Unbilled invoice</Heading>
      <Paragraph>
        {unbilledInvoice.totalUnbilledExcludingVAT} excluding VAT
      </Paragraph>
      <Paragraph>
        <a href="#" onClick={updateUnbilledInvoice}>
          Refresh unbilled invoice
        </a>
      </Paragraph>
      <UnbilledHoursPerWeek meta={hours.meta} />
      <Paragraph>
        <a href="#" onClick={updateHours}>
          Refresh hours
        </a>
      </Paragraph>
    </>
  );
}

export async function getServerSideProps(context) {
  const { month } = context.query;
  if (!isValidMonthSlug(month)) {
    return getCurrentMonthRedirect();
  }

  const [serverSideHours, serverSideUnbilledInvoice] = await Promise.all([
    getHours(),
    getUnbilledInvoice(),
  ]);
  return { props: { serverSideHours, serverSideUnbilledInvoice } };
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
