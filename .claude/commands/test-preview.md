Test the Vercel preview deployment for the current PR.

## Steps

1. Run `gh pr view --json url,headRefName,statusCheckRollup` to get the current PR's branch and check if the Vercel deployment is complete. If CI/deployment checks are still pending, let the user know and stop.

2. Find the preview URL by running:
   ```
   gh pr view --json comments --jq '.comments[].body' | grep -o 'https://freelancer-home[^)]*vercel\.app' | head -1
   ```
   Do not try to derive the URL from the branch name — Vercel's preview URLs include a hash and are not predictable. If the grep returns nothing, ask the user to paste the URL from the PR.

3. Read `.env` to get `USER_NAME` and `PASSWORD` for Basic Auth. Encode them as base64 (`printf '%s:%s' "user" "pass" | base64`) to construct the `Authorization: Basic ...` header.

4. Run each endpoint as a **separate Bash tool call** (one curl per call). Use `-w "status:%{http_code}"` — avoid leading `/` in the `-w` format string as MSYS on Windows converts it to a filesystem path. Include the Authorization header on all requests.

   | Endpoint | Expected status |
   |---|---|
   | `/` | 200 |
   | `/day` | 200 (follows redirects, use `-L`) |
   | `/month` | 200 (follows redirects, use `-L`) |
   | `/api/summary/{today}/{today}` | 200, valid JSON with `hours` and `invoice` keys |
   | `/api/client-time-reporting/{first-of-month}/{today}` | 200 if `PE_ACCOUNTING_ACCOUNT_ID` is set in `.env`; 400 with `{"entries":[]}` if not set — both are acceptable |

5. For the API endpoints, omit `-o /dev/null` to capture the response body and verify it has the expected JSON shape.

6. Report a clear pass/fail summary for each endpoint. If anything fails, include the status code and response body to help diagnose the issue.
