# freelancer-home: Improvement Backlog

> Pick any item and ask Claude to implement it. Each item is self-contained.
> Items marked **[test first]** should have a failing test committed before the implementation fix — two commits, one PR.
> - When a task is implemented, **remove it from this file in the same PR** — including its entry in the "Suggested Order" section.
> - Some items have a detailed plan in `BACKLOG/` — read it before starting that task.

---

## Category A: Bug Fixes

### A3 — `pages/api/by-name/[name]/[startDate]/[endDate].js`: Add try/catch _(low priority)_
**File**: `pages/api/by-name/[name]/[startDate]/[endDate].js`
**Problem**: No error handling around the async `byName()` call. If it throws (Harvest API down, network error), the response hangs or crashes with an unhandled rejection instead of returning a 500 JSON response.
**Fix**: Wrap the `byName()` call in try/catch and return `res.status(500).json({ error: "Internal server error" })` in the catch block — same pattern as the summary route.

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
**Problem**: Both components iterate `Object.keys(hours.totalBillableHoursPerWeek)` without sorting. `perWeek()` in `time-summary.ts` groups by ISO week number with a `"w"` prefix, so a December→January month will produce keys like `["w52", "w1", "w2"]` (insertion order). The table and clipboard export show `w1` before `w52` — the wrong chronological order.
**Fix**: Sort the keys numerically before iterating. Keys are prefixed with `"w"` (e.g. `"w1"`, `"w52"`), so strip the prefix before comparing: `parseInt(week.slice(1))`. Account for the year-boundary case: high weeks come before low weeks. Sort comparator: `const n = (w) => { const v = parseInt(w.slice(1)); return v > 26 ? v - 53 : v; }` — this maps week 52 to -1 and week 1 to 1, producing correct chronological order.

---

### A11 — Hour display missing `.toFixed(1)` in UI components
**Files**: `modules/hours/billable-hours-per-week.js`, `modules/hours/billable-hours-clipboard-button.js`, `modules/hours/vab.js`, `pages/day/[day].js`
**Problem**: Hours are rendered as raw JS numbers (`{hours.totalBillableHours}`, `` `${hours}h` ``). CLAUDE.md requires "exactly one decimal place (e.g. 3.5h, not 3.48h or 3.50h)". If a floating-point value slips through (e.g. from A8a/A8b not yet fixed), it will display as `11.3` or `11.299999`. Even when values are correct, `3` displays as `3` not `3.0`.
**Fix**: Apply `.toFixed(1)` when rendering any hour value in UI components, including the VAB total.

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

### A14 — `pages/month/[month].js`: Add error handling on SSR prefetch **[test first]**
**File**: `pages/month/[month].js`
**Problem**: `getServerSideProps` wraps three `queryClient.prefetchQuery()` calls in `Promise.all()` with no `.catch()`. If the Harvest API is down or returns an error, the unhandled rejection causes a hard SSR 500 — the user sees a blank error page instead of a degraded view.
**Fix**: Wrap each `prefetchQuery` call individually in `.catch(() => {})` so a single failing query leaves the others intact and SSR completes. The client-side `useQuery` error states will then show the error gracefully in-page.

---

### A15 — `pages/day/[day].js`: Add error handling on SSR prefetch **[test first]**
**File**: `pages/day/[day].js`
**Problem**: Same root cause as A14 — `getServerSideProps` wraps a `queryClient.prefetchQuery()` call in `Promise.all()` with no `.catch()`. Harvest API failure causes a hard SSR 500 on the day page too.
**Fix**: Same fix — wrap the prefetch in `.catch(() => {})`.

---

## Category B: Code Quality / Small Cleanups

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

### C2 — `pages/api/by-name/[name]/[startDate]/[endDate].js`: Add integration tests **[test first]**
**File**: `pages/api/by-name/[name]/[startDate]/[endDate].js`
**Problem**: The by-name API route has zero test coverage. It has no error handling (see A3), and also no tests.
**Fix**: Add a test file covering: successful response, and — after A3 is done — the 500 error path. Implement A3 first.
**Requires**: A3

### C4 — `billable-hours-per-week.js` + `billable-hours-clipboard-button.js`: Add component tests
**Files**: `modules/hours/billable-hours-per-week.js`, `modules/hours/billable-hours-clipboard-button.js`
**Problem**: Both components have zero test coverage. The week-ordering fix (A10), the hour formatting fix (A11), and the clipboard behaviour fixes (A12, A13) cannot be verified without tests.
**Fix**: Install `@testing-library/react` and `@testing-library/jest-dom` as devDependencies (not currently in the project). Then add tests covering: week order in rendered output (assert `w52` row appears before `w1` row), `.toFixed(1)` formatting, clipboard success/failure paths (mock `navigator.clipboard`), and button state reset after copy.
**Requires**: A10, A11, A12, A13

## Category T: TypeScript Migration

The project's `modules/harvest-report-api/` is already fully TypeScript. All remaining JS files live in `pages/` and `modules/hours/` + `modules/layout/`. Items are ordered so dependencies are typed before dependents. Do D8 (Prettier) first so the formatter handles `.ts`/`.tsx` files from the start.

Items marked _(non-production)_ touch only test files. Items without that note touch production code.

### T1 — Convert simple API routes to TypeScript _(production)_
**Files**: `pages/api/auth.js` → `.ts`, `pages/api/summary/[startDate]/[endDate].js` → `.ts`, `pages/api/by-name/[name]/[startDate]/[endDate].js` → `.ts`
**Changes**: Add `NextApiRequest, NextApiResponse` types to all three handlers. Rename files. `auth.js` becomes a typed `NextApiHandler`. The summary and by-name handlers gain typed `req.query` destructuring. No logic changes.

### T2 — Convert `middleware.js` to TypeScript _(production)_
**File**: `middleware.js` → `middleware.ts`
**Changes**: Import `NextRequest` from `"next/server"`. Type the `request` parameter and the `NextResponse` calls. The exported `config.matcher` type-checks automatically.

### T3 — Convert test files to TypeScript _(non-production)_
**Files**: `modules/pages/day.test.js` → `.test.ts`, `modules/pages/month.test.js` → `.test.ts`
**Changes**: Rename files. Add type annotations to variables where inference is insufficient. Both already use ES `import` syntax so no require() conversion needed.

### T4 — Convert `pages/_app.js` to TypeScript _(production)_
**File**: `pages/_app.js` → `_app.tsx`
**Changes**: Import `AppProps` from `"next/app"`. Type the `FreelancerHome` component: `function FreelancerHome({ Component, pageProps }: AppProps)`. The `dehydratedState` in `pageProps` is `unknown` — cast or type appropriately.

### T5 — Convert redirect pages and `pages/index.js` to TypeScript _(production)_
**Files**: `pages/index.js` → `.tsx`, `pages/day/index.js` → `.tsx`, `pages/month/index.js` → `.tsx`
**Changes**: Rename all three. `index.tsx` is pure JSX with no props — no types needed beyond the default export. The redirect pages (`day/index.tsx`, `month/index.tsx`) each re-export `getServerSideProps` from the dynamic route — the type flows through automatically once those dynamic route files are converted.

### T6 — Convert API route test files to TypeScript _(non-production)_
**Files**: `pages/api/summary/summary.test.js` → `.test.ts`, `pages/api/client-time-reporting/client-time-reporting.test.js` → `.test.ts`
**Changes**: Convert `require()` calls to ES `import` statements. Type mock functions (`jest.fn<ReturnType, ArgsType>()`). Type the mock `req`/`res` objects (or use a cast). More involved than T3 due to CJS→ESM conversion in the test bodies.

### T7 — Convert `pages/api/client-time-reporting/[startDate]/[endDate].js` to TypeScript _(production)_
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js` → `.ts`
**Changes**: Type `req: NextApiRequest, res: NextApiResponse`. Type the `events` JSON response (define an `EventReadable` interface with `id: { id: string }, date: string, hours: number, comment: string`). Type `Headers`, the `fetch` response, and the mapped entries.

### T8 — Convert `modules/layout/vertical-rhythm.js` to TypeScript _(production)_
**File**: `modules/layout/vertical-rhythm.js` → `.tsx`
**Changes**: All ~15 exported components take only `children` or a small set of known props. Add `React.PropsWithChildren` for the child-only ones. For `TableHeader` and `TableData`, add `{ children?: React.ReactNode; alignRight?: boolean }`. For `TableRow` and others with `colSpan`, add those props. No logic changes.

### T9 — Convert hour components to TypeScript _(production)_
**Files**: `modules/hours/billable-hours-per-week.js` → `.tsx`, `modules/hours/billable-hours-clipboard-button.js` → `.tsx`
**Changes**: Both components receive a typed `hours` prop. Define `HoursMeta = { totalBillableHours: number; totalBillableHoursPerWeek: Record<string, number> }` (reuse across both). The clipboard button adds `formattedFirstDayOfMonth: string; formattedLastDayOfMonth: string`. Type the `useState<boolean>` hook.
**Requires**: T8 (vertical-rhythm types)

### T10 — Convert remaining hour components to TypeScript _(production)_
**Files**: `modules/hours/vab.js` → `.tsx`, `modules/hours/client-time-reporting-entries.js` → `.tsx`
**Changes**: Define `VabEntry = { id: string; date: string; hours: number; comment: string }` and `TimeReportingEntry = { id: string; date: string; hours: number; comment: string }`. Prop interfaces are `{ vab: VabEntry[]; startDate: string; endDate: string }` and `{ entries: TimeReportingEntry[] }`.
**Requires**: T8 (vertical-rhythm types)

### T11 — Convert `pages/day/[day].js` to TypeScript _(production)_
**File**: `pages/day/[day].js` → `[day].tsx`
**Changes**: Define `DayProps = { day: string; isCurrentDay: boolean; dehydratedState: unknown }`. Type `getServerSideProps` as `GetServerSideProps<DayProps>`. Type `isValidDaySlug(day: string): boolean` and `getCurrentDayRedirect()`. The `useDayName` hook takes `day: string` and returns `string`. Type `useQuery` return value.
**Requires**: T9, T10 (so component imports from hours/ are already typed)

### T12 — Convert `pages/month/[month].js` to TypeScript _(production)_
**File**: `pages/month/[month].js` → `[month].tsx`
**Changes**: Define `MonthProps` with all 7 props passed from `getServerSideProps`. Type `getServerSideProps` as `GetServerSideProps<MonthProps>`. Type all utility functions: `isValidMonthSlug`, `lastDayOfMonth`, `firstDayOfLastMonth`, `useMonthName`. Three `useQuery` calls need their data types. This is the most involved migration item.
**Requires**: T9, T10 (hours components typed), T11 (day page pattern established)

## Category D: CI / Dependencies

### D8 — Add Prettier with commit hook and CI check
**Detail**: `BACKLOG/D8-prettier.md`
**Risk**: Low. Formatting-only — no logic changes. Requires one initial bulk-format commit to clean up existing files, then hooks and CI enforce it going forward.

### D7 — CI: Add `tsc --noEmit` type-check step
**File**: `.github/workflows/continuous-integration.yml`
**Problem**: The CI workflow runs `npm ci && npm run build && npm test` but no explicit TypeScript type-check. `next build` does run tsc internally, but TypeScript errors can go unreported if they're in files not imported by the build (e.g. test utilities, type-only declarations). Adding an explicit `tsc --noEmit` step makes type errors visible as a distinct CI failure.
**Fix**: Add a `npm run type-check` script to `package.json` (`"type-check": "tsc --noEmit"`) and a CI step that runs it before `npm run build`.

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

- **A3** — `pages/api/by-name`: add try/catch
- **A8a** — Fix float accumulation in `vab.js`
- **A8b** — Fix float accumulation in `client-time-reporting-entries.js`
- **A9** — Use URLSearchParams in client-time-reporting route
- **A10** — Fix week ordering at year boundary in hour table and clipboard export
- **A11** — Apply `.toFixed(1)` to all hour displays in UI components
- **A12** — Await `clipboard.writeText()` and handle rejection
- **A13** — Reset clipboard button state after 2 seconds
- **A14** — Add error handling on SSR prefetch in `pages/month/[month].js`
- **A15** — Add error handling on SSR prefetch in `pages/day/[day].js`
- **B2** — Extract hardcoded activity ID fallback to named constant
- **B3** — Add coverage collection config to `jest.config.js`
- **C2** — Add integration tests for `/api/by-name` route (after A3)
- **C4** — Add component tests for billable-hours-per-week and clipboard button (after A10-A13)
- **D8** — Add Prettier with commit hook and CI check
- **D7** — Add `tsc --noEmit` type-check step to CI (do before D5 so upgrade errors are caught)
- **T1** — Convert simple API routes to TypeScript (auth, summary, by-name)
- **T2** — Convert `middleware.js` to TypeScript
- **T3** — Convert `day.test.js` and `month.test.js` to TypeScript (non-production)
- **T4** — Convert `pages/_app.js` to TypeScript
- **T5** — Convert redirect pages and `pages/index.js` to TypeScript
- **T6** — Convert API route test files to TypeScript (non-production)
- **T7** — Convert `pages/api/client-time-reporting` route to TypeScript
- **T8** — Convert `modules/layout/vertical-rhythm.js` to TypeScript
- **T9** — Convert clipboard button and billable-hours-per-week to TypeScript
- **T10** — Convert vab.js and client-time-reporting-entries.js to TypeScript
- **T11** — Convert `pages/day/[day].js` to TypeScript
- **T12** — Convert `pages/month/[month].js` to TypeScript (most complex)
- **D5** — Upgrade TypeScript 4.9 → 5
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
