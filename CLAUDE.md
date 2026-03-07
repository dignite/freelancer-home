# freelancer-home

Personal Next.js 13 dashboard for a Swedish freelancer. Visualizes billable time and invoice amounts by integrating with Harvest (time tracking) and optionally PE Accounting (Swedish accounting).

## Tech Stack

- Next.js 13 pages router, SSR via `getServerSideProps`
- React 18 + react-query v3 (SSR dehydration/hydration pattern)
- TypeScript (modules), JavaScript (pages + UI components)
- Jest 29 + MSW v1 for unit/integration tests
- Vercel deployment (auto on PR)
- CSS: normalize.css + custom vertical-rhythm.css + colors.css (CSS variables)

## Pages

- `/` — goals/home page
- `/day` — redirects to `/day/YYYY-MM-DD` (today)
- `/day/[day]` — billable hours + invoice for a single day
- `/month` — redirects to `/month/YYYY-MM` (current month)
- `/month/[month]` — full monthly view: invoice, hours/week table, clipboard copy, client time reporting, VAB

## API Routes

- `/api/summary/[startDate]/[endDate]` — returns `{ hours: MetaSlim, invoice: { totalExcludingVATFormatted } }`
- `/api/by-name/[name]/[startDate]/[endDate]` — returns filtered time entries by task name (used for VAB)
- `/api/client-time-reporting/[startDate]/[endDate]` — fetches from PE Accounting (returns `{ entries: [] }` if `PE_ACCOUNTING_ACCOUNT_ID` not set)
- `/api/auth` — returns 401 WWW-Authenticate (Basic Auth challenge target)

## Auth

HTTP Basic Auth via `middleware.js` — only applies to `/` and `/index`. Credentials from `USER_NAME` / `PASSWORD` env vars.

## Module Map (`modules/`)

```
harvest-report-api/
  index.ts                   summary(start,end), byName(start,end,name)
  time-entries.ts            get() — fetches + transforms; rounds hours to nearest 0.1 (6 min)
  process-env.ts             get(key) thin wrapper for process.env
  harvest-v2-types.ts        generated Harvest v2 OpenAPI types
  meta/
    index.ts                 hoursMetaSlim(), getInvoiceSumExcludingVAT()
    time-summary.ts          totalSum(), perWeek() grouped by ISO week number
    cost-summary.ts          totalExcludingVAT() using SEK utility
  npm-package-encapsulation/
    harvest-queries.ts       getTimeEntriesForMonth() — hits Harvest v2 /time_entries
    swedish-crowns.ts        SEK(amount) — currency util, sv-SE Intl format
    date-info.ts             getWeekNumber() = date-fns getISOWeek
  mock-service-worker/
    harvest-handlers.ts      MSW request handlers for Harvest API
    server.ts                MSW server instance for tests
hours/
  billable-hours-per-week.js        table: hours by week
  billable-hours-clipboard-button.js copy time report text to clipboard
  client-time-reporting-entries.js   PE Accounting events table
  vab.js                            VAB (child sick leave) entries table
layout/
  vertical-rhythm.js        all UI primitives with scoped JSX styles
react-query-client.ts       QueryClient factory; default queryFn = fetch /api/{queryKey}
vercel-utils.ts             getAbsoluteUrl() — handles browser / SSR / Vercel URL resolution
```

## Key Patterns

- react-query keys map directly to API paths: `summary/YYYY-MM-DD/YYYY-MM-DD`
- SSR prefetch via `queryClient.prefetchQuery(key)` + `dehydrate(queryClient)` passed as `pageProps.dehydratedState`
- Hours stored/displayed in 0.1h increments (one decimal place); cost computed as `SEK(billableHours).multiply(billableRate)`
- Always present time with exactly one decimal place (e.g. 3.5h, not 3.48h or 3.50h)
- Currency formatted as Swedish SEK string

## Environment Variables

```
USER_NAME, PASSWORD                    Basic Auth credentials
HARVEST_ACCESS_TOKEN, HARVEST_ACCOUNT_ID, USER_AGENT_EMAIL
PE_ACCOUNTING_ACCOUNT_ID (optional), PE_ACCOUNTING_TOKEN
VERCEL_URL                             auto-set by Vercel
```

## Testing

- `npm test` runs Jest with jsdom environment
- To run a single test file: `npm test -- modules/pages/month.test.js` (pass path after `--`)
- Always use `npm ci` before running tests in a fresh environment
- Setup: `modules/harvest-report-api/setup-tests.ts` (MSW server lifecycle)
- Integration tests for harvest-queries and process-env use real env vars

## CI/CD

- GitHub Actions: Node 14, `npm ci && npm run build && npm test` on push/PR
- Vercel auto-deploys on PR open; disable via Vercel UI
- Repository only allows rebase merges (no merge commits, no squash)

## Planned (not yet built)

- Money visualization via PE Accounting
- Harvest clock-in/out via portal
- Slack status sync with Harvest state
