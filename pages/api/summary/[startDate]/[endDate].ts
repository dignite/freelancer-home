import type { NextApiRequest, NextApiResponse } from "next";
import { summary } from "../../../../modules/harvest-report-api/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { startDate, endDate } = req.query as {
    startDate: string;
    endDate: string;
  };
  try {
    const hoursJson = await summary(startDate, endDate);
    res.status(200).json(hoursJson);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
