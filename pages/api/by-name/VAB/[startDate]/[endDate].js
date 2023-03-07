import { byName } from "../../../../../harvest-report-api/index";

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const hours = await getVAB(startDate, endDate);
  res.status(200).json(hours);
}

export const getVAB = async (startDate, endDate) => {
  const commonRelativePath = `by-name/VAB/${startDate}/${endDate}`;
  const json =
    typeof window === "undefined"
      ? await byName(startDate, endDate, "VAB")
      : await (await fetch(`/api/${commonRelativePath}`)).json();
  return json;
};
