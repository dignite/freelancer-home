# freelancer-home: Improvement Backlog

> Pick any item and ask Claude to implement it. Each item is self-contained.
> Items marked **[test first]** should have a failing test committed before the implementation fix — two commits, one PR.
> - When a task is implemented, **remove it from this file in the same PR** — including its entry in the "Suggested Order" section.
> - Detailed upgrade plans for dependency items (D-category) live in `BACKLOG/`. Read the relevant file before starting a D-category task.

---

## Category A: Bug Fixes

### A1 — `middleware.js`: Use constant-time comparison for Basic Auth credentials
**File**: `middleware.js`
**Problem**: Credentials are compared with `===` (`user === process.env.USER_NAME && pwd === process.env.PASSWORD`). JavaScript string equality short-circuits on the first differing character, making response time weakly correlated with how many characters match — a timing side-channel. While the dashboard is personal, it is public on the internet.
**Fix**: Compare using `crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))` for both username and password. Guard against undefined env vars (return 401 immediately if either is not set).

---

### A3 — `pages/api/by-name/[name]/[startDate]/[endDate].js`: Add try/catch _(low priority)_
**File**: `pages/api/by-name/[name]/[startDate]/[endDate].js`
**Problem**: Same as A2 — no error handling around the async `byName()` call.
**Fix**: Same pattern — try/catch with 500 JSON response.

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

### A9 — `pages/api/client-time-reporting/[startDate]/[endDate].js`: Use URLSearchParams to build PE Accounting query
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Problem**: `startDate` and `endDate` from the Next.js route are interpolated directly into the URL string without encoding. A crafted path like `2024-01-01%26injected=yes` would append a rogue query parameter to the PE Accounting request.
**Fix**: Build the query string with `new URLSearchParams({ startDate, endDate, accountId, activityId })` and append it to the base URL, so values are always percent-encoded.

---

### A10 — `billable-hours-per-week.js` + `billable-hours-clipboard-button.js`: Weeks displayed out of order at year boundary
**Files**: `modules/hours/billable-hours-per-week.js`, `modules/hours/billable-hours-clipboard-button.js`
**Problem**: Both components iterate `Object.keys(hours.totalBillableHoursPerWeek)` without sorting. `perWeek()` in `time-summary.ts` groups by ISO week number, so a December→January month will produce keys like `["52", "1", "2"]` (insertion order). The table and clipboard export show week 1 before week 52 — the wrong chronological order.
**Fix**: Sort the keys numerically before iterating. Account for the year-boundary case: if both low week numbers (≤ 10) and high week numbers (≥ 40) are present, the high weeks come first. Sort by `parseInt(week) > 26 ? parseInt(week) - 53 : parseInt(week)`.

---

### A11 — Hour display missing `.toFixed(1)` in UI components
**Files**: `modules/hours/billable-hours-per-week.js`, `modules/hours/billable-hours-clipboard-button.js`, `pages/day/[day].js`
**Problem**: Hours are rendered as raw JS numbers (`{hours.totalBillableHours}`, `` `${hours}h` ``). CLAUDE.md requires "exactly one decimal place (e.g. 3.5h, not 3.48h or 3.50h)". If a floating-point value slips through (e.g. from A8a/A8b not yet fixed), it will display as `11.3` or `11.299999`. Even when values are correct, `3` displays as `3` not `3.0`.
**Fix**: Apply `.toFixed(1)` when rendering any hour value in UI components.

---

### A12 — `billable-hours-clipboard-button.js`: `clipboard.writeText()` not awaited — false success feedback
**File**: `modules/hours/billable-hours-clipboard-button.js`
**Problem**: The `onClick` handler calls `navigator.clipboard.writeText(text)` and immediately calls `setChecked(true)` without awaiting the promise. If the clipboard API rejects (permission denied, API unavailable), the user sees "Copied to clipboard ✓" even though the copy failed.
**Fix**: Make the handler `async`, `await clipboard.writeText(text)`, and only call `setChecked(true)` on success. Catch rejection and surface an error (e.g. console.error or a visible message).

---

### A13 — `billable-hours-clipboard-button.js`: "Copied" state never resets
**File**: `modules/hours/billable-hours-clipboard-button.js`
**Problem**: After the first successful copy, `checked` is set to `true` and never reset. The button shows "Copied to clipboard ✓" permanently for the rest of the page session. Standard UX for copy buttons is to revert to the original label after ~2 seconds.
**Fix**: After setting `checked(true)`, schedule `setTimeout(() => setChecked(false), 2000)`. Clear the timeout in a `useEffect` cleanup to avoid state updates on unmounted components.

---

## Category B: Code Quality / Small Cleanups

### B1 — `pages/day/[day].js`: Remove unnecessary export from `getCurrentDayRedirect`
**File**: `pages/day/[day].js`
**Problem**: `getCurrentDayRedirect` is exported but only used internally within the same file's `getServerSideProps`. The export is dead — nothing else imports it.
**Fix**: Remove the `export` keyword. Keep the function as a plain local function.

### B3 — `jest.config.js`: Add coverage collection configuration
**File**: `jest.config.js`
**Problem**: Jest is not configured to collect or report coverage. Without `collectCoverageFrom`, running `npm test -- --coverage` reports on files that happen to be imported by tests, missing untested modules entirely. There are no coverage thresholds to prevent regressions.
**Fix**: Add to `jest.config.js`:
```js
collectCoverageFrom: [
  'modules/**/*.{ts,js}',
  'pages/**/*.js',
  '!**/*.test.{ts,js}',
  '!modules/harvest-report-api/mock-service-worker/**',
  '!modules/harvest-report-api/harvest-v2-types.ts',
],
```
Do not set hard thresholds yet — let coverage reporting run first to establish a baseline.

### B2 — `pages/api/client-time-reporting/[startDate]/[endDate].js`: Extract hardcoded activity ID fallback
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Problem**: The fallback activity ID `"45784"` is inlined in a template literal: `` `...&activityId=${process.env.PE_ACCOUNTING_ACTIVITY_ID ?? "45784"}` ``. Magic numbers are hard to find and change.
**Fix**: Extract to a named constant at the top of the file: `const DEFAULT_ACTIVITY_ID = "45784"`.

---

## Category C: Test Coverage

### C1 — `pages/api/summary/[startDate]/[endDate].js`: Add integration tests **[test first]**
**File**: `pages/api/summary/[startDate]/[endDate].js`
**Problem**: The summary API route has zero test coverage. It calls `summary()` and returns `{ hours, invoice }` — the happy path and error path are both untested.
**Fix**: Add a test file alongside the route (or under `modules/pages/`) using MSW to mock Harvest responses. Cover: successful response shape, and the try/catch 500 error path.

### C2 — `pages/api/by-name/[name]/[startDate]/[endDate].js`: Add integration tests **[test first]**
**File**: `pages/api/by-name/[name]/[startDate]/[endDate].js`
**Problem**: The by-name API route has zero test coverage. It has no error handling (see A3), and also no tests.
**Fix**: Add a test file covering: successful response, and — after A3 is done — the 500 error path. Implement A3 first.
**Requires**: A3

### C3 — `pages/api/client-time-reporting/[startDate]/[endDate].js`: Expand test coverage
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Test file**: `pages/api/client-time-reporting/client-time-reporting.test.js`
**Problem**: Current tests only cover the "unconfigured" case (env var not set → returns `{ entries: [] }`). The success path (PE Accounting returns data), the error path (PE Accounting returns non-200), and the malformed-response path are all untested.
**Fix**: Add test cases for: (1) PE Accounting returns valid entries → response matches, (2) PE Accounting returns 4xx/5xx → API returns 500 JSON, (3) PE Accounting returns malformed JSON → API returns 500.

### C4 — `billable-hours-per-week.js` + `billable-hours-clipboard-button.js`: Add component tests
**Files**: `modules/hours/billable-hours-per-week.js`, `modules/hours/billable-hours-clipboard-button.js`
**Problem**: Both components have zero test coverage. The week-ordering fix (A10), the hour formatting fix (A11), and the clipboard behaviour fixes (A12, A13) cannot be verified without tests.
**Fix**: Add React component tests (jest + @testing-library/react if available, or snapshot tests) covering: week order in rendered output, `.toFixed(1)` formatting, clipboard success/failure paths, and button state reset after copy.

## Category D: CI / Dependencies

### D5 — Upgrade TypeScript 4.9 → 5
**Detail**: `BACKLOG/D5-typescript-5.md`
**Risk**: Very low. Backward-compatible upgrade. Optional `tsconfig.json` modernization.

### D4 — Upgrade date-fns v2 → v3
**Detail**: `BACKLOG/D4-date-fns-v3.md`
**Risk**: Low. One import site (`date-info.ts`), one test mock to rewrite.

### D1 — Upgrade MSW v1 → v2
**Detail**: `BACKLOG/D1-msw-v2.md`
**Risk**: High. Complete handler API rewrite in `harvest-handlers.ts`. `rest.get` / `res(ctx.json(...))` pattern replaced with `http.get` / `HttpResponse.json(...)`.

### D2 — Upgrade react-query v3 → @tanstack/react-query v5
**Detail**: `BACKLOG/D2-react-query-v5.md`
**Risk**: High. Package renamed, SSR `Hydrate` → `HydrationBoundary`, `useQuery("key")` string shorthand removed.

### D3 — Upgrade Next.js 13 → 15 (Pages Router)
**Detail**: `BACKLOG/D3-nextjs-15.md`
**Risk**: Very high. Stay on Pages Router (App Router migration is separate). Do after D1, D2, D5.

### D6 — Upgrade React 18 → 19
**Detail**: `BACKLOG/D6-react-19.md`
**Risk**: Medium. Depends on D2 and D3 being complete first.

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

- **A1** — Basic Auth constant-time comparison in `middleware.js`
- **A3** — `pages/api/by-name`: add try/catch
- **A8a** — Fix float accumulation in `vab.js`
- **A8b** — Fix float accumulation in `client-time-reporting-entries.js`
- **A9** — Use URLSearchParams in client-time-reporting route
- **A10** — Fix week ordering at year boundary in hour table and clipboard export
- **A11** — Apply `.toFixed(1)` to all hour displays in UI components
- **A12** — Await `clipboard.writeText()` and handle rejection
- **A13** — Reset clipboard button state after 2 seconds
- **B1** — Remove unnecessary export from `getCurrentDayRedirect`
- **B2** — Extract hardcoded activity ID fallback to named constant
- **B3** — Add coverage collection config to `jest.config.js`
- **C1** — Add integration tests for `/api/summary` route
- **C2** — Add integration tests for `/api/by-name` route (after A3)
- **C3** — Expand PE Accounting tests to cover success and error paths
- **C4** — Add component tests for billable-hours-per-week and clipboard button (after A10-A13)
- **D5** — Upgrade TypeScript 4.9 → 5 (safest, do first)
- **D4** — Upgrade date-fns v2 → v3
- **D1** — Upgrade MSW v1 → v2
- **D2** — Upgrade react-query v3 → @tanstack/react-query v5
- **D3** — Upgrade Next.js 13 → 15
- **D6** — Upgrade React 18 → 19 (do last, depends on D2 + D3)
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
