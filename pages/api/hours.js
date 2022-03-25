export default async function handler(req, res) {
  const hours = await getHours();
  res.status(200).json(hours);
}

export const getHours = async () => {
  const res = await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL);
  return await res.json();
};
