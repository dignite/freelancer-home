export default async function handler(req, res) {
  const invoice = await getInvoice();
  res.status(200).json(invoice);
}

export const getInvoice = async (startDate, endDate) => {
  const commonRelativePath = `invoice/${startDate}/${endDate}`;
  const res =
    typeof window === "undefined"
      ? await fetch(
          `${process.env.HARVEST_REPORT_LAMBDA_HOURS_URL}/${commonRelativePath}`
        )
      : await fetch("/api/${commonRelativePath}");
  return await res.json();
};
