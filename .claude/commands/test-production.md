Test the production Vercel deployment (after merging to main).

## Steps

1. Get the production URL from GitHub deployments:
   ```
   REPO=$(gh repo view --json nameWithOwner --jq '.nameWithOwner')
   DEPLOYMENT_ID=$(gh api repos/$REPO/deployments --jq '[.[] | select(.environment == "Production")][0].id')
   PROD_URL=$(gh api repos/$REPO/deployments/$DEPLOYMENT_ID/statuses --jq '.[0].environment_url')
   echo $PROD_URL
   ```
   If the URL is empty or null, ask the user to paste the production URL.

2. Read `.env` to get `USER_NAME` and `PASSWORD` for Basic Auth. Encode them as base64 (`echo -n "user:pass" | base64`) to construct the `Authorization: Basic ...` header.

3. Test the following endpoints using `curl -s -o /dev/null -w "%{http_code}"` (include the Authorization header on all requests):

   | Endpoint | Expected status |
   |---|---|
   | `/` | 200 |
   | `/day` | 200 (redirects to today) |
   | `/month` | 200 (redirects to current month) |
   | `/api/summary/{today}/{today}` | 200, valid JSON with `hours` and `invoice` keys |
   | `/api/client-time-reporting/{first-of-month}/{today}` | 200, valid JSON with `entries` key |

4. For the API endpoints, also fetch the response body and verify it is valid JSON with the expected shape.

5. Report a clear pass/fail summary for each endpoint. If anything fails, include the status code and response body to help diagnose the issue.
