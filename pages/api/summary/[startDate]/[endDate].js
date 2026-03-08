import { summary } from "../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  try {
    const hoursJson = await summary(startDate, endDate);
    res.status(200).json(hoursJson);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
