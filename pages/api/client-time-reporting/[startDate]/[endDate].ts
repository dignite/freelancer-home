import type { NextApiRequest, NextApiResponse } from "next";

interface EventReadable {
  id: { id: string };
  date: string;
  hours: number;
  comment: string;
}

interface EventsResponse {
  "event-readables"?: EventReadable[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!process.env.KLEER_ACCOUNT_ID) {
    res.status(200).json({ entries: [] });
    return;
  }
  try {
    const { startDate, endDate } = req.query as {
      startDate: string;
      endDate: string;
    };
    const headers = new Headers();
    headers.append("X-token", process.env.KLEER_TOKEN ?? "");
    headers.append("Content-Type", "application/json");
    const requestOptions: RequestInit = {
      method: "GET",
      headers,
      redirect: "follow",
    };
    const params = new URLSearchParams({
      startDate,
      endDate,
      activityId: process.env.KLEER_ACTIVITY_ID ?? "",
    });
    const response = await fetch(
      `https://api.accounting.pe/v1/company/${process.env.KLEER_ACCOUNT_ID}/event?${params}`,
      requestOptions,
    );
    if (!response.ok) {
      res
        .status(502)
        .json({ error: `Kleer responded with ${response.status}` });
      return;
    }
    const events: EventsResponse = await response.json();

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
    res.status(500).json({ error: (error as Error).message });
  }
}
