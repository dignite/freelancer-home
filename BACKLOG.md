# freelancer-home: Improvement Backlog

> Pick any item and ask Claude to implement it. Each item is self-contained.
> Items marked **[test first]** should have a failing test committed before the implementation fix — two commits, one PR.
> - When a task is implemented, **remove it from this file in the same PR** — including its entry in the "Suggested Order" section.

---

## Category A: Bug Fixes

### A2 — `pages/api/summary/[startDate]/[endDate].js`: Add try/catch _(low priority)_
**File**: `pages/api/summary/[startDate]/[endDate].js`
**Problem**: `await summary(startDate, endDate)` has no error handling. Next.js catches unhandled throws and returns an HTML 500 page — react-query clients get a non-JSON body and the UI stays on "Loading..." indefinitely.
**Fix**: Wrap in try/catch, return `res.status(500).json({ error: ... })` on failure.

---

### A3 — `pages/api/by-name/[name]/[startDate]/[endDate].js`: Add try/catch _(low priority)_
**File**: `pages/api/by-name/[name]/[startDate]/[endDate].js`
**Problem**: Same as A2 — no error handling around the async `byName()` call.
**Fix**: Same pattern — try/catch with 500 JSON response.

---

### A6 — Month page: Include `clientTimeReportingSuccess` in loading gate
**File**: `pages/month/[month].js`
**Problem**: Loading check only covers `summarySuccess && vabSuccess`. `clientTimeReporting.entries` is accessed below without confirming it loaded, risking a render with undefined data.
**Fix**: Add `clientTimeReportingSuccess` to the loading condition and remove the now-redundant inline `{clientTimeReportingSuccess ? ... : null}` guard.

---

### A7 — `react-query-client.ts`: Include HTTP status in error message
**File**: `modules/react-query-client.ts`
**Problem**: On non-ok response, throws `"Network response was not ok"` — no status code, no URL, impossible to debug in production.
**Fix**: Include `response.status` and `queryKey` in the error message.

---

### A8a — `vab.js`: Fix float accumulation in total
**File**: `modules/hours/vab.js`
**Problem**: Hours are summed with `reduce((acc, cur) => acc + cur.hours, 0)`. Floating-point addition of 0.1h values can produce results like `11.299999...`. The backend uses `sumPreservingOneDecimal` for exactly this reason.
**Fix**: Replace the reduce accumulator with `Math.round(acc * 10 + cur.hours * 10) / 10`.

---

### A8b — `client-time-reporting-entries.js`: Fix float accumulation in total
**File**: `modules/hours/client-time-reporting-entries.js`
**Problem**: Same as A8a — plain float accumulation in the reduce total.
**Fix**: Same pattern — `Math.round(acc * 10 + cur.hours * 10) / 10`.

---

## Category B: Code Quality / Small Cleanups

### B2a — `.env.example`: Document `PE_ACCOUNTING_ACTIVITY_ID`
**File**: `.env.example`
**Problem**: `activityId=45784` is hardcoded in the PE Accounting API URL with no indication it's configurable.
**Fix**: Add `PE_ACCOUNTING_ACTIVITY_ID=` to `.env.example` with a comment explaining what it is.

---

### B2b — PE Accounting API: Read `activityId` from env
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Requires**: B2a
**Problem**: `activityId=45784` is hardcoded in the URL.
**Fix**: Read from `process.env.PE_ACCOUNTING_ACTIVITY_ID ?? "45784"`.

---

### B3 — `harvest-queries.ts`: Remove redundant `NonNullable` type
**File**: `modules/harvest-report-api/npm-package-encapsulation/harvest-queries.ts`
**Problem**: The file defines `type NonNullable<T> = Exclude<T, null | undefined>` which is identical to TypeScript's built-in `NonNullable<T>`.
**Fix**: Delete the local definition; rely on the built-in.

---

## Category C: Test Coverage

### C1 — Test `hoursMetaSlim()` in `meta/index.ts`
**File**: `modules/harvest-report-api/meta/index.test.ts`
**Problem**: Only `getInvoiceSumExcludingVAT()` is tested. `hoursMetaSlim()` composes `totalSum()` + `perWeek()` and has no direct test.
**Fix**: Add a test case to the existing `index.test.ts`.

---

### C2 — Test `vercel-utils.ts` — all three branches of `getAbsoluteUrl()`
**File**: New file `modules/vercel-utils.test.ts`
**Problem**: Zero tests. Has three code paths: browser (`window.location.origin`), Vercel (`VERCEL_URL`), and localhost fallback.
**Fix**: Write unit tests mocking `window` and `process.env.VERCEL_URL`.

---

### C3a — Test `summary()` in `harvest-report-api/index.ts`
**File**: New file `modules/harvest-report-api/index.test.ts`
**Problem**: `summary()` is the main public API entry point with zero direct tests.
**Fix**: Add tests using MSW (already set up) covering the happy path and error case.

---

### C3b — Test `byName()` in `harvest-report-api/index.ts`
**File**: `modules/harvest-report-api/index.test.ts`
**Requires**: C3a (same file)
**Problem**: `byName()` filters entries by task name but has no direct tests.
**Fix**: Add tests for: entries matching the name, no matches, and multiple entries with mixed names.

---

### C4 — Test SEK edge cases in `swedish-crowns.ts`
**File**: `modules/harvest-report-api/npm-package-encapsulation/swedish-crowns.test.ts`
**Problem**: No tests for negative amounts, zero, or large numbers with float precision risk.
**Fix**: Add test cases to the existing file.

---

## Category D: CI / Dependencies

## Category E: Evergreen Skills

These are not one-off tasks — they are ongoing quality activities to run periodically or whenever the codebase changes significantly. Each has a corresponding Claude skill.

### E1 — Mutation testing (`/mutate`)
Introduce small deliberate mutations into implementation code and check whether any test catches the regression. If a mutation survives, either strengthen an existing test, write a new one, or remove dead code. Run periodically and especially after adding new features or tests.

### E2 — Security review
Review API routes, auth handling, environment variable usage, and any user-controlled input for OWASP top-10 issues (injection, broken auth, sensitive data exposure, etc.). Check that `.env` secrets are not leaked into client bundles or logs.

### E3 — Accessibility review
Check rendered pages against WCAG 2.1 AA. Focus on: semantic HTML, keyboard navigation, colour contrast, screen reader labels on interactive elements, and meaningful page titles.

### E4 — Usability review
Use the app as a real user would across different months and edge cases (no entries, large invoices, VAB weeks, December→January boundary). Look for confusing layouts, missing loading states, unhelpful error messages, or missing affordances.

### E5 — Brainstorm new improvements
Review the Harvest API (`/harvest`) and PE Accounting API for data that isn't yet surfaced in the app. Consider: yearly summaries, client breakdowns, invoice status tracking, Slack/calendar integrations, or mobile layout improvements.

---

## Category F: Feature Ideas

Sourced from `pages/index.js` goals listed on the home page.

### F1a — Explore money data from Harvest and PE Accounting
**Problem**: Before building money visualization, understand what data is available.
**Fix**: Use the `/harvest` skill to fetch `/invoices` and `/reports/time/clients`. Document what fields are available and what would be useful to display.

### F1b — Add `/api/invoices` API route
**Requires**: F1a
**Problem**: No API route exists for invoice data beyond the per-period total.
**Fix**: Add a new API route that fetches invoices from Harvest's `/invoices` endpoint and returns relevant fields.

### F1c — Show invoice status on the month page
**Requires**: F1b
**Problem**: The month page shows total hours and invoice amount but not whether the invoice has been sent or paid.
**Fix**: Use the new `/api/invoices` route to display invoice status for the current month.

### F1d — Add a yearly summary page
**Requires**: F1b
**Problem**: No way to see a full year of income at a glance.
**Fix**: Add a `/year/[year]` page with monthly invoice totals and a yearly sum.

---

### F2a — Explore Harvest timer API endpoints
**Problem**: Before building clock-in/out, understand the API.
**Fix**: Use the `/harvest` skill to explore `POST /time_entries`, `PATCH /time_entries/:id/restart`, and `PATCH /time_entries/:id/stop`. Document required fields and the shape of a running timer entry.

### F2b — Add `/api/timer` API route
**Requires**: F2a
**Problem**: No server-side route exists for starting or stopping a Harvest timer.
**Fix**: Add an API route supporting start (POST with task/project) and stop (PATCH) operations.

### F2c — Add clock-in/out UI to the day page
**Requires**: F2b
**Problem**: You have to open the Harvest app to start/stop a timer.
**Fix**: Add a clock-in button (when no active timer) and a clock-out button (when running) to the day page.

---

### F3a — Research Slack status API
**Problem**: Before building Slack sync, understand what credentials and payload are needed.
**Fix**: Review the Slack `users.profile.set` API. Document the required bot token scopes and status payload format.

### F3b — Add Slack credentials to `.env.example`
**Requires**: F3a
**Problem**: No place to store Slack credentials.
**Fix**: Add `SLACK_BOT_TOKEN=` to `.env.example` with a comment.

### F3c — Sync Slack status on Harvest clock-in/out
**Requires**: F2b, F3b
**Problem**: Slack status doesn't reflect Harvest timer state.
**Fix**: When the timer API route starts or stops a timer, also call Slack's `users.profile.set` to update or clear the status.

---

## Suggested Order

- **A6** — Month page: include `clientTimeReportingSuccess` in loading gate
- **A7** — `react-query-client.ts`: include HTTP status in error message
- **B2a** — Document `PE_ACCOUNTING_ACTIVITY_ID` in `.env.example`
- **B2b** — Read `activityId` from env
- **B3** — Remove redundant `NonNullable` type
- **C1** — Test `hoursMetaSlim()`
- **C2** — Test `vercel-utils.ts`
- **C3a** — Test `summary()`
- **C3b** — Test `byName()`
- **C4** — Test SEK edge cases
- **A2** — `pages/api/summary`: add try/catch
- **A3** — `pages/api/by-name`: add try/catch
- **A8a** — Fix float accumulation in `vab.js`
- **A8b** — Fix float accumulation in `client-time-reporting-entries.js`
- **F1a** — Explore money data from Harvest and PE Accounting
- **F1b** — Add `/api/invoices` route
- **F1c** — Show invoice status on month page
- **F1d** — Add yearly summary page
- **F2a** — Explore Harvest timer API endpoints
- **F2b** — Add `/api/timer` route
- **F2c** — Add clock-in/out UI to the day page
- **F3a** — Research Slack status API
- **F3b** — Add Slack credentials to `.env.example`
- **F3c** — Sync Slack status on clock-in/out
