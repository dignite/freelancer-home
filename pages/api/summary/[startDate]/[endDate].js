import { summary } from "../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const hoursJson = await summary(startDate, endDate);
  res.status(200).json(hoursJson);
}
