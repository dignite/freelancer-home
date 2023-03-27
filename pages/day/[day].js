import Link from "next/link";
import {
  Heading,
  MainHeading,
  Paragraph,
} from "../../modules/layout/vertical-rhythm";
import { dehydrate, useQuery } from "react-query";
import { createClient } from "../../modules/react-query-client";

export default function Day({ day, isCurrentDay }) {
  const dayName = useDayName(day);
  const { data, isSuccess } = useQuery(`summary/${day}/${day}`);

  if (!isSuccess) {
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
      <Paragraph>{data.hours.totalBillableHours} hours</Paragraph>
      <Heading>Money</Heading>
      <Paragraph>
        {data.invoice.totalExcludingVATFormatted} excluding VAT
      </Paragraph>
    </>
  );
}

export async function getServerSideProps(context) {
  const { day } = context.params;
  if (!isValidDaySlug(day)) {
    return getCurrentDayRedirect();
  }

  const queryClient = createClient();

  await Promise.all([queryClient.prefetchQuery(`summary/${day}/${day}`)]);

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
