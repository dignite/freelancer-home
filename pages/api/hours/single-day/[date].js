import { singleDayHours } from "../../../../modules/harvest-report-api";

export default async function handler(req, res) {
  const { date } = req.query;
  const hours = await singleDayHours(date);
  res.status(200).json(hours);
}
