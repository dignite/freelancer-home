export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const hours = await getVAB(startDate, endDate);
  res.status(200).json(hours);
}

export const getVAB = async (startDate, endDate) => {
  const commonRelativePath = `by-name/VAB/${startDate}/${endDate}`;
  const res =
    typeof window === "undefined"
      ? await fetch(
          `${process.env.HARVEST_REPORT_LAMBDA_HOURS_URL}/${commonRelativePath}`
        )
      : await fetch(`/api/${commonRelativePath}`);
  return await res.json();
};
