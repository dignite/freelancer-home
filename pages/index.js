import Link from "next/link";
import {
  Paragraph,
  UnorderedList,
  UnorderedListItem,
} from "../components/vertical-rhythm";

export default function IndexPage({ data }) {
  return (
    <div>
      <h1>Freelancer Home</h1>
      <UnorderedList>
        <UnorderedListItem>
          <Link href="/about">
            <a>About</a>
          </Link>
        </UnorderedListItem>
      </UnorderedList>
      <h2>Unbilled invoice</h2>
      <Paragraph>
        {data.meta.unbilledInvoice.excludingVAT} excluding VAT
      </Paragraph>
      <h2>Total unbilled hours per week</h2>
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
