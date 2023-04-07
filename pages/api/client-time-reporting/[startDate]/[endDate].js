export default async function handler(req, res) {
  const { startDate, endDate } = req.query;
  const headers = new Headers();
  headers.append("X-token", process.env.PE_ACCOUNTING_TOKEN);
  headers.append("Content-Type", "application/json");
  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow",
  };
  const response = await fetch(
    `https://api.accounting.pe/v1/company/${process.env.PE_ACCOUNTING_ACCOUNT_ID}/event?startDate=${startDate}&endDate=${endDate}&activityId=45784`,
    requestOptions
  );
  const events = await response.json();

  res.status(200).json({
    entries:
      events["event-readables"] === undefined
        ? []
        : events["event-readables"].map((event) => ({
            id: event.id.id,
            date: event.date,
            hours: event.hours,
            comment: event.comment,
          })),
  });
}
