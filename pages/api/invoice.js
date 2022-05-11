export default async function handler(req, res) {
  const invoice = await getInvoice();
  res.status(200).json(invoice);
}

export const getInvoice = async () => {
  const res =
    typeof window === "undefined"
      ? await fetch(`${process.env.HARVEST_REPORT_LAMBDA_HOURS_URL}/invoice`)
      : await fetch("/api/invoice");
  return await res.json();
};
