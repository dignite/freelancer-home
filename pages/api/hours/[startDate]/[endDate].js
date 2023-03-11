import { hours } from "../../../../modules/harvest-report-api/index";

export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const hours = await getHours(startDate, endDate);
  res.status(200).json(hours);
}

export const getHours = async (startDate, endDate) => {
  const commonRelativePath = `hours/${startDate}/${endDate}`;
  const json =
    typeof window === "undefined"
      ? await hours(startDate, endDate)
      : await (await fetch(`/api/${commonRelativePath}`)).json();
  return json;
};
