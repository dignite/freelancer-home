import { singleDayHours } from "../../../../modules/harvest-report-api";

export default async function handler(req, res) {
  const { date } = req.query;
  const hours = await getHoursSingleDay(date);
  res.status(200).json(hours);
}

export const getHoursSingleDay = async (date) => {
  const commonRelativePath = `hours/single-day/${date}`;
  const json =
    typeof window === "undefined"
      ? await singleDayHours(date)
      : await (await fetch(`/api/ ${commonRelativePath}`)).json();
  return json;
};
