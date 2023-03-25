import Link from "next/link";
import {
  Button,
  Heading,
  MainHeading,
  Paragraph,
} from "../../modules/layout/vertical-rhythm";
import { dehydrate, useQuery } from "react-query";
import { createClient } from "../../modules/react-query-client";

export default function Day({ day, isCurrentDay }) {
  const dayName = useDayName(day);
  const {
    data: hours,
    isSuccess: hoursSuccess,
    refetch: updateHours,
  } = useQuery(`hours/single-day/${day}`);
  const {
    data: invoice,
    isSuccess: invoiceSuccess,
    refetch: updateInvoice,
  } = useQuery(`invoice/${day}/${day}`);

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

  const queryClient = createClient();

  await Promise.all([
    queryClient.prefetchQuery(`hours/single-day/${day}`),
    queryClient.prefetchQuery(`invoice/${day}/${day}`),
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
