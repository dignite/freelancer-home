require("dotenv").config({ path: `.env.local` });

import { server } from "../mock-service-worker/server";
import { getTimeEntriesForMonth } from "./harvest-queries";
import { get } from "../process-env";

const areAllDefined = (args: string[]) =>
  args.every((key) => get(key) !== undefined);

const isTestEnvSetup = areAllDefined([
  "HARVEST_ACCESS_TOKEN",
  "HARVEST_ACCOUNT_ID",
  "USER_AGENT_EMAIL",
]);

describe("getTimeEntriesForMonth function", () => {
  isTestEnvSetup
    ? it("should return all hours for month", async () => {
        expect.assertions(1);
        server.close();

        const result = await getTimeEntriesForMonth(
          new Date(Date.parse("2022-10-01")),
          new Date(Date.parse("2022-10-31"))
        );

        expect(result.length).toBeGreaterThan(0);
      })
    : it.todo(
        "should return all hours for month (not tested due to missing environment variables)"
      );
});
