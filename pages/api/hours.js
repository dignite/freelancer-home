export default async function handler(req, res) {
  const hours = await getHours();
  res.status(200).json(hours);
}

export const getHours = async () => {
  const res =
    typeof window === "undefined"
      ? await fetch(process.env.HARVEST_REPORT_LAMBDA_HOURS_URL)
      : await fetch("/api/hours");
  return await res.json();
};
