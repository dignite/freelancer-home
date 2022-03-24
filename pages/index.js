import {
  Heading,
  MainHeading,
  Paragraph,
  Table,
  TableData,
  TableHeader,
  TableRow,
  UnorderedList,
  UnorderedListItem,
} from "../components/vertical-rhythm";

export default function IndexPage({ data }) {
  return (
    <>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <Heading>Unbilled invoice</Heading>
      <Paragraph>
        {data.meta.unbilledInvoice.excludingVAT} excluding VAT
      </Paragraph>
      <Heading>Total unbilled hours per week</Heading>
      <Table>
        <TableRow>
          <TableHeader>Week</TableHeader>
          <TableHeader>Hours</TableHeader>
        </TableRow>
        {Object.keys(data.meta.totalUnbilledHoursPerWeek).map((week) => (
          <TableRow key={week}>
            <TableData>{week}</TableData>
            <TableData>{data.meta.totalUnbilledHoursPerWeek[week]}</TableData>
          </TableRow>
        ))}
        <TableRow>
          <TableData>Total</TableData>
          <TableData>{data.meta.totalUnbilledHours}</TableData>
        </TableRow>
      </Table>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  const data = await res.json();
  return { props: { data } };
}
