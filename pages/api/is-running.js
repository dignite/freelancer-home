import { isRunning } from "../../modules/harvest-report-api";

export default async function handler(req, res) {
  const hours = await isRunning();
  res.status(200).json(hours);
}
