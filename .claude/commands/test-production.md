Test the production Vercel deployment (after merging to main).

## Steps

1. Get the production URL from GitHub deployments using two separate Bash calls (avoids MSYS path conversion on the jq output):
   ```
   gh repo view --json nameWithOwner --jq '.nameWithOwner'
   ```
   Then use the repo name to fetch the deployment URL:
   ```
   gh api repos/{nameWithOwner}/deployments --jq '[.[] | select(.environment == "Production")][0].id'
   gh api repos/{nameWithOwner}/deployments/{id}/statuses --jq '.[0].environment_url'
   ```
   If the URL is empty or null, ask the user to paste the production URL.

2. Read `.env` to get `USER_NAME` and `PASSWORD` for Basic Auth. Encode them as base64 (`printf '%s:%s' "user" "pass" | base64`) to construct the `Authorization: Basic ...` header.

3. Run each endpoint as a **separate Bash tool call** (one curl per call). Use `-w "status:%{http_code}"` — avoid leading `/` in the `-w` format string as MSYS on Windows converts it to a filesystem path. Include the Authorization header on all requests.

   | Endpoint | Expected status |
   |---|---|
   | `/` | 200 |
   | `/day` | 200 (follows redirects, use `-L`) |
   | `/month` | 200 (follows redirects, use `-L`) |
   | `/api/summary/{today}/{today}` | 200, valid JSON with `hours` and `invoice` keys |
   | `/api/client-time-reporting/{first-of-month}/{today}` | 200 if `PE_ACCOUNTING_ACCOUNT_ID` is set in `.env`; 400 with `{"entries":[]}` if not set — both are acceptable |

4. For the API endpoints, omit `-o /dev/null` to capture the response body and verify it has the expected JSON shape.

5. Report a clear pass/fail summary for each endpoint. If anything fails, include the status code and response body to help diagnose the issue.
