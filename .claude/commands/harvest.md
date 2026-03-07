Interact with the Harvest API v2 using the credentials in `.env`.

## Setup

Read credentials from `.env` using `grep KEY .env | cut -d= -f2-` (note `f2-` not `f2` — values like tokens can contain `=` characters):
- `HARVEST_ACCESS_TOKEN` → Bearer token
- `HARVEST_ACCOUNT_ID` → Harvest-Account-Id header
- `USER_AGENT_EMAIL` → User-Agent header

Base URL: `https://api.harvestapp.com/v2`

Standard headers for every request:
```
Authorization: Bearer {HARVEST_ACCESS_TOKEN}
Harvest-Account-Id: {HARVEST_ACCOUNT_ID}
User-Agent: freelancer-home ({USER_AGENT_EMAIL})
```

Use `curl` to make requests, piping through `jq` for readable output.

## API Reference

- **Docs**: https://help.getharvest.com/api-v2/
- **Local generated types**: `modules/harvest-report-api/harvest-v2-types.ts` — use this to understand the shape of responses without fetching docs

## Modes

### Verify — check data shown in the app
When asked to verify something (e.g. "are today's hours correct?"), make the same API call the app makes and compare:
- App uses `/time_entries?from=YYYY-MM-DD&to=YYYY-MM-DD`
- Cross-reference with what's displayed on the relevant page

### Discover — explore available endpoints and data
When asked about new data or features, fetch the relevant endpoint and inspect the response shape. Common starting points:
- `GET /time_entries` — time entries with task, project, client info
- `GET /projects` — all projects
- `GET /clients` — all clients
- `GET /invoices` — invoices
- `GET /tasks` — tasks
- `GET /users/me` — current user info
- `GET /reports/time/clients` — time summary by client (requires `from` and `to`)
- `GET /reports/time/projects` — time summary by project
- `GET /reports/time/tasks` — time summary by task
- `GET /reports/time/team` — time summary by team member

All list endpoints support `from` and `to` (YYYY-MM-DD) query params and are paginated (`page`, `per_page`).

## Presenting results

- Always display hours with **one decimal place** (e.g. 3.5h, not 3.48h or 3.50h)
- Each entry is first rounded to one decimal place (nearest 6 minutes), then entries are summed while preserving one decimal throughout — so round each entry before adding, not just the final total

## Output

Always show:
1. The exact `curl` command used (with credentials redacted)
2. The HTTP status code
3. The formatted JSON response (or a summary if very large)
4. A plain-language interpretation of what the data means in the context of the app
