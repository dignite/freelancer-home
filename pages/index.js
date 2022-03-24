import Link from "next/link";
import {
  Heading,
  MainHeading,
  Paragraph,
  UnorderedList,
  UnorderedListItem,
} from "../components/vertical-rhythm";

export default function IndexPage({ data }) {
  return (
    <div>
      <MainHeading>Freelancer Home 🕚</MainHeading>
      <UnorderedList>
        <UnorderedListItem>
          <Link href="/about">
            <a>About</a>
          </Link>
        </UnorderedListItem>
      </UnorderedList>
      <Heading>Unbilled invoice</Heading>
      <Paragraph>
        {data.meta.unbilledInvoice.excludingVAT} excluding VAT
      </Paragraph>
      <Heading>Total unbilled hours per week</Heading>
      <UnorderedList>
        {Object.keys(data.meta.totalUnbilledHoursPerWeek).map((week) => (
          <UnorderedListItem key={week}>
            {week}: {data.meta.totalUnbilledHoursPerWeek[week]}
          </UnorderedListItem>
        ))}
        <UnorderedListItem>
          Total: {data.meta.totalUnbilledHours}
        </UnorderedListItem>
      </UnorderedList>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  const data = await res.json();
  return { props: { data } };
}
