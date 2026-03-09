import type { NextApiRequest, NextApiResponse } from "next";
import { byName } from "../../../../../modules/harvest-report-api/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, startDate, endDate } = req.query as {
    name: string;
    startDate: string;
    endDate: string;
  };
  try {
    const hours = await byName(startDate, endDate, name);
    res.status(200).json(hours);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
