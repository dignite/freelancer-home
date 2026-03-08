import { summary } from "../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  return res.status(500).json({ error: "deliberate failure for smoke test" });
  const { startDate, endDate } = req.query;
  const hoursJson = await summary(startDate, endDate);
  res.status(200).json(hoursJson);
}
