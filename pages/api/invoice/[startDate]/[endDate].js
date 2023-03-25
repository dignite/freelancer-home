import { invoice } from "../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const invoiceJson = await invoice(startDate, endDate);
  res.status(200).json(invoiceJson);
}
