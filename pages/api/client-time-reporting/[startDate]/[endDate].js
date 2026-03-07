export default async function handler(req, res) {
  if(!process.env.PE_ACCOUNTING_ACCOUNT_ID){
    res.status(200).json({ entries: [] });
    return;
  }
  try {
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
      `https://api.accounting.pe/v1/company/${process.env.PE_ACCOUNTING_ACCOUNT_ID}/event?startDate=${startDate}&endDate=${endDate}&activityId=${process.env.PE_ACCOUNTING_ACTIVITY_ID ?? "45784"}`,
      requestOptions
    );
    if (!response.ok) {
      res.status(502).json({ error: `PE Accounting responded with ${response.status}` });
      return;
    }
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
