import { useRouter } from "next/router";
import { UnbilledHoursPerWeek } from "../modules/hours/unbilled-hours-per-week";
import {
  Heading,
  MainHeading,
  Paragraph,
} from "../modules/layout/vertical-rhythm";

export default function MonthPage({ hours, unbilledInvoice }) {
  const router = useRouter();
  const { month } = router.query;
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <Heading>Unbilled invoice</Heading>
      <Paragraph>
        {unbilledInvoice.totalUnbilledExcludingVAT} excluding VAT
      </Paragraph>
      <UnbilledHoursPerWeek meta={hours.meta} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { month } = context.query;
  if (!isValidMonthSlug(month)) {
    return getCurrentMonthRedirect();
  }

  const hours = await getHours();
  const unbilledInvoice = await getUnbilledInvoice();
  return { props: { hours, unbilledInvoice } };
}

const getHours = async () => {
  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  return await res.json();
};

const getUnbilledInvoice = async () => {
  const res = await fetch(
    `${process.env.HARVEST_REPORT_LAMBDA_HOURS_URL}/unbilled-invoice`
  );
  return await res.json();
};

export const isValidMonthSlug = (month) => month.length === 7;

export const getCurrentMonthRedirect = () => ({
  redirect: {
    destination: `/${new Date().toISOString().slice(0, 7)}`,
    permanent: false,
  },
});
