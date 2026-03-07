Test the Vercel preview deployment for the current PR.

## Steps

1. Run `gh pr view --json url,headRefName,statusCheckRollup` to get the current PR's branch and check if the Vercel deployment is complete. If CI/deployment checks are still pending, let the user know and stop.

2. Find the preview URL. Vercel deployments follow the pattern `https://freelancer-home-git-{branch}-dignite.vercel.app` — derive it from the branch name, replacing slashes with dashes and lowercasing. If unsure, ask the user to paste the Vercel preview URL from the PR.

3. Read `.env` to get `USER_NAME` and `PASSWORD` for Basic Auth. Encode them as base64 (`echo -n "user:pass" | base64`) to construct the `Authorization: Basic ...` header.

4. Test the following endpoints using `curl -s -o /dev/null -w "%{http_code}"` (include the Authorization header on all requests):

   | Endpoint | Expected status |
   |---|---|
   | `/` | 200 |
   | `/day` | 200 (redirects to today) |
   | `/month` | 200 (redirects to current month) |
   | `/api/summary/{today}/{today}` | 200, valid JSON with `hours` and `invoice` keys |
   | `/api/client-time-reporting/{first-of-month}/{today}` | 200, valid JSON with `entries` key |

5. For the API endpoints, also fetch the response body and verify it is valid JSON with the expected shape.

6. Report a clear pass/fail summary for each endpoint. If anything fails, include the status code and response body to help diagnose the issue.
