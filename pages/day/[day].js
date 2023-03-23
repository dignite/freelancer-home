import {
  Heading,
  MainHeading,
  Paragraph,
} from "../../modules/layout/vertical-rhythm";
import { getHoursSingleDay } from "../api/hours/single-day/[date]";
import { getInvoice } from "../api/invoice/[startDate]/[endDate]";

export default function Day({ serverSideHours, serverSideInvoice, day }) {
  return (
    <>
      <MainHeading>Single day ({day})</MainHeading>
      <Heading>Time</Heading>
      <Paragraph>{serverSideHours} hours</Paragraph>
      <Heading>Money</Heading>
      <Paragraph>{serverSideInvoice.totalExcludingVAT} excluding VAT</Paragraph>
    </>
  );
}

export async function getServerSideProps(context) {
  const { day } = context.params;
  if (!isValidDaySlug(day)) {
    return getCurrentDayRedirect();
  }

  const [serverSideHours, serverSideInvoice] = await Promise.all([
    getHoursSingleDay(day),
    getInvoice(day, day),
  ]);

  return {
    props: {
      serverSideHours,
      serverSideInvoice,
      day,
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
