import { QueryClient } from "react-query";
import { getAbsoluteUrl } from "./vercel-utils";

export const createClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: async ({ queryKey }) => {
          const response = await fetch(`${getAbsoluteUrl()}/api/${queryKey}`);
          if (!response.ok) {
            throw new Error(
              `Network response was not ok: ${response.status} for ${queryKey}`
            );
          }
          return response.json();
        },
      },
    },
  });
