export default async function handler(req, res) {
  res.status(200).json({
    HARVEST_REPORT_LAMBDA_HOURS_URL:
      process.env.HARVEST_REPORT_LAMBDA_HOURS_URL,
  });
}
