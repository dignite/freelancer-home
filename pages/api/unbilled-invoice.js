export default async function handler(req, res) {
  const unbilledInvoice = await getUnbilledInvoice();
  res.status(200).json(unbilledInvoice);
}

export const getUnbilledInvoice = async () => {
  const res = await fetch(
    `${process.env.HARVEST_REPORT_LAMBDA_HOURS_URL}/unbilled-invoice`
  );
  return await res.json();
};
