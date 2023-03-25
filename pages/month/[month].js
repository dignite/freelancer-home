import Link from "next/link";
import { dehydrate, useQuery } from "react-query";
import { createClient } from "../../modules/react-query-client";
import { BillableHoursPerWeek } from "../../modules/hours/billable-hours-per-week";
import { BillableHoursClipboardButton } from "../../modules/hours/billable-hours-clipboard-button";
import { VAB } from "../../modules/hours/vab";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../../modules/layout/vertical-rhythm";

export default function MonthPage({
  formattedFirstDayOfMonth,
  formattedLastDayOfMonth,
  formattedFirstDayOfLastMonth,
  formattedLastDayOfLastMonth,
  isCurrentMonth,
  month,
}) {
  const monthName = useMonthName(month);
  const {
    data: hours,
    isSuccess: hoursSuccess,
    refetch: updateHours,
  } = useQuery(`hours/${formattedFirstDayOfMonth}/${formattedLastDayOfMonth}`);
  const {
    data: invoice,
    isSuccess: invoiceSuccess,
    refetch: updateInvoice,
  } = useQuery(
    `invoice/${formattedFirstDayOfMonth}/${formattedLastDayOfMonth}`
  );
  const {
    data: vab,
    isSuccess: vabSuccess,
    refetch: updateVAB,
  } = useQuery(
    `by-name/VAB/${formattedFirstDayOfLastMonth}/${formattedLastDayOfLastMonth}`
  );

  if (!hoursSuccess || !invoiceSuccess || !vabSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainHeading>
        🕚 {monthName} {month}
      </MainHeading>
      {isCurrentMonth ? null : (
        <Paragraph>
          <Link href="/month">Jump to current month</Link>
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
  const queryClient = createClient();
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

  await Promise.all([
    queryClient.prefetchQuery(
      `hours/${formattedFirstDayOfMonth}/${formattedLastDayOfMonth}`
    ),
    queryClient.prefetchQuery(
      `invoice/${formattedFirstDayOfMonth}/${formattedLastDayOfMonth}`
    ),
    queryClient.prefetchQuery(
      `by-name/VAB/${formattedFirstDayOfLastMonth}/${formattedLastDayOfLastMonth}`
    ),
  ]);

  const isCurrentMonth = getCurrentMonthSlug() === month;

  return {
    props: {
      formattedFirstDayOfMonth,
      formattedLastDayOfMonth,
      formattedFirstDayOfLastMonth,
      formattedLastDayOfLastMonth,
      isCurrentMonth,
      month,
      dehydratedState: dehydrate(queryClient),
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
