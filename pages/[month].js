import { useRouter } from "next/router";
import { UnbilledHoursPerWeek } from "../modules/hours/unbilled-hours-per-week";
import {
  Heading,
  MainHeading,
  Paragraph,
} from "../modules/layout/vertical-rhythm";

export default function MonthPage({ data }) {
  const router = useRouter();
  const { month } = router.query;
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <Heading>Unbilled invoice</Heading>
      <Paragraph>
        {data.meta.unbilledInvoice.excludingVAT} excluding VAT
      </Paragraph>
      <UnbilledHoursPerWeek meta={data.meta} />
    </>
  );
}

export async function getServerSideProps(context) {
  const { month } = context.query;
  if (!isValidMonthSlug(month)) {
    return getCurrentMonthRedirect();
  }

  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  const data = await res.json();
  return { props: { data } };
}

export const isValidMonthSlug = (month) => month.length === 7;

export const getCurrentMonthRedirect = () => ({
  redirect: {
    destination: `/${new Date().toISOString().slice(0, 7)}`,
    permanent: false,
  },
});
