import { invoice } from "../../../../harvest-report-api/index";

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const invoice = await getInvoice(startDate, endDate);
  res.status(200).json(invoice);
}

export const getInvoice = async (startDate, endDate) => {
  const commonRelativePath = `invoice/${startDate}/${endDate}`;
  const json =
    typeof window === "undefined"
      ? await invoice(startDate, endDate)
      : await (await fetch(`/api/${commonRelativePath}`)).json();
  return json;
};
