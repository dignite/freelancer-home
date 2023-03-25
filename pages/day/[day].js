import Link from "next/link";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../../modules/layout/vertical-rhythm";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { getHoursSingleDay } from "../api/hours/single-day/[date]";
import { getInvoice } from "../api/invoice/[startDate]/[endDate]";

export default function Day({ day, isCurrentDay }) {
  const dayName = useDayName(day);
  const {
    data: hours,
    isSuccess: hoursSuccess,
    refetch: updateHours,
  } = useQuery(["hoursSingleDay", day], () => getHoursSingleDay(day));
  const {
    data: invoice,
    isSuccess: invoiceSuccess,
    refetch: updateInvoice,
  } = useQuery(["invoiceSingleDay", day], () => getInvoice(day, day));

  if (!hoursSuccess || !invoiceSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <MainHeading>
        🕚 {dayName} {day}
      </MainHeading>
      {isCurrentDay ? null : (
        <Paragraph>
          <Link href="/day">Jump to today</Link>
        </Paragraph>
      )}
      <Heading>Time</Heading>
      <Paragraph>{hours} hours</Paragraph>
      <Button onClick={updateHours}>Refresh hours</Button>
      <Heading>Money</Heading>
      <Paragraph>{invoice.totalExcludingVAT} excluding VAT</Paragraph>
      <Button onClick={updateInvoice}>Refresh invoice</Button>
    </>
  );
}

export async function getServerSideProps(context) {
  const { day } = context.params;
  if (!isValidDaySlug(day)) {
    return getCurrentDayRedirect();
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery(["hoursSingleDay", day], () =>
      getHoursSingleDay(day)
    ),
    queryClient.prefetchQuery(["invoiceSingleDay", day], () =>
      getInvoice(day, day)
    ),
  ]);

  const isCurrentDay = getCurrentDaySlug() === day;

  return {
    props: {
      day,
      isCurrentDay,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export const isValidDaySlug = (day) => day.length === 10;

export const getCurrentDayRedirect = () => ({
  redirect: {
    destination: `/day/${getCurrentDaySlug()}`,
    permanent: false,
  },
});

const getCurrentDaySlug = () => new Date().toISOString().slice(0, 10);

const useDayName = (day) => {
  if (getCurrentDaySlug() === day) return "Today";

  const dayOfWeek = new Date(Date.parse(day)).getDay();
  const dayOfWeekName = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][dayOfWeek];
  return dayOfWeekName;
};
