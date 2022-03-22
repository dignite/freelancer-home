import Link from "next/link";

export default function IndexPage({ data }) {
  return (
    <div>
      <h1>Freelancer Home</h1>
      <ul>
        <li>
          <Link href="/about">
            <a>About</a>
          </Link>
        </li>
      </ul>
      <h2>Unbilled invoice</h2>
      <p>{data.meta.unbilledInvoice.excludingVAT} excluding VAT</p>
      <h2>Total unbilled hours per week</h2>
      <ul>
        {Object.keys(data.meta.totalUnbilledHoursPerWeek).map((week) => (
          <li key={week}>
            {week}: {data.meta.totalUnbilledHoursPerWeek[week]}
          </li>
        ))}
        <li>Total: {data.meta.totalUnbilledHours}</li>
      </ul>
    </div>
  );
}

export async function getServerSideProps() {
  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  const data = await res.json();
  return { props: { data } };
}
