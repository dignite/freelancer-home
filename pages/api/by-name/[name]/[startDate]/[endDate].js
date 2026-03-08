import { byName } from "../../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  const { name, startDate, endDate } = req.query;
  try {
    const hours = await byName(startDate, endDate, name);
    res.status(200).json(hours);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
