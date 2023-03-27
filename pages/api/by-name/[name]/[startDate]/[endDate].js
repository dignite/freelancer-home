import { byName } from "../../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  const { name, startDate, endDate } = req.query;
  const hours = await byName(startDate, endDate, name);
  res.status(200).json(hours);
}
