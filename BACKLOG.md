# freelancer-home: Improvement Backlog

> Pick any item and ask Claude to implement it. Each item is self-contained.
> Items marked **[test first]** should have a failing test committed before the implementation fix — two commits, one PR.
>
> - When a task is implemented, **remove it from this file in the same PR** — including its entry in the "Suggested Order" section.
> - Some items have a detailed plan in `BACKLOG/` — read it before starting that task.

---

## Category T: TypeScript Migration

The project's `modules/harvest-report-api/` is already fully TypeScript. All remaining JS files live in `pages/` and `modules/hours/` + `modules/layout/`. Items are ordered so dependencies are typed before dependents. Prettier (D8) is already set up and will auto-format new `.ts`/`.tsx` files on commit.

Items marked _(non-production)_ touch only test files. Items without that note touch production code.

### T4 — Convert `pages/_app.js` to TypeScript _(production)_

**File**: `pages/_app.js` → `_app.tsx`
**Changes**: Import `AppProps` from `"next/app"`. Type the `FreelancerHome` component: `function FreelancerHome({ Component, pageProps }: AppProps)`. The `dehydratedState` in `pageProps` is `unknown` — cast or type appropriately.

### T5 — Convert redirect pages and `pages/index.js` to TypeScript _(production)_

**Files**: `pages/index.js` → `.tsx`, `pages/day/index.js` → `.tsx`, `pages/month/index.js` → `.tsx`
**Changes**: Rename all three. `index.tsx` is pure JSX with no props — no types needed beyond the default export. The redirect pages (`day/index.tsx`, `month/index.tsx`) each re-export `getServerSideProps` from the dynamic route — the type flows through automatically once those dynamic route files are converted.

### T6 — Convert API route test files to TypeScript _(non-production)_

**Files**: `pages/api/summary/summary.test.js` → `.test.ts`, `pages/api/by-name/by-name.test.js` → `.test.ts`, `pages/api/client-time-reporting/client-time-reporting.test.js` → `.test.ts`
**Changes**: Convert `require()` calls to ES `import` statements. Type mock functions (`jest.fn<ReturnType, ArgsType>()`). Type the mock `req`/`res` objects (or use a cast). The CJS→ESM conversion in test bodies makes this more involved than a simple rename.

### T7 — Convert `pages/api/client-time-reporting/[startDate]/[endDate].js` to TypeScript _(production)_

**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js` → `.ts`
**Changes**: Type `req: NextApiRequest, res: NextApiResponse`. Type the `events` JSON response (define an `EventReadable` interface with `id: { id: string }, date: string, hours: number, comment: string`). Type `Headers`, the `fetch` response, and the mapped entries.

### T8 — Convert `modules/layout/vertical-rhythm.js` to TypeScript _(production)_

**File**: `modules/layout/vertical-rhythm.js` → `.tsx`
**Changes**: All ~15 exported components take only `children` or a small set of known props. Add `React.PropsWithChildren` for the child-only ones. For `TableHeader` and `TableData`, add `{ children?: React.ReactNode; alignRight?: boolean }`. For `TableRow` and others with `colSpan`, add those props. No logic changes.

### T9 — Convert hour components to TypeScript _(production + test)_

**Files**: `modules/hours/billable-hours-per-week.js` → `.tsx`, `modules/hours/billable-hours-clipboard-button.js` → `.tsx`, `modules/hours/billable-hours.test.jsx` → `.test.tsx`
**Changes**: Both components receive a typed `hours` prop. Define `HoursMeta = { totalBillableHours: number; totalBillableHoursPerWeek: Record<string, number> }` (reuse across both). The clipboard button adds `formattedFirstDayOfMonth: string; formattedLastDayOfMonth: string`. Type the `useState<boolean>` hook. Convert the test file alongside — add `React.JSX.Element` return type where needed and cast the clipboard mock.
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

Review the Harvest API (`/harvest`) and Kleer API for data that isn't yet surfaced in the app. Consider: yearly summaries, client breakdowns, invoice status tracking, Slack/calendar integrations, or mobile layout improvements.

---

## Category F: Feature Ideas

Sourced from `pages/index.js` goals listed on the home page.

### F1a — Explore money data from Harvest and Kleer

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
- **F1a** — Explore money data from Harvest and Kleer
- **F1b** — Add `/api/invoices` route
- **F1c** — Show invoice status on month page
- **F1d** — Add yearly summary page
- **F2a** — Explore Harvest timer API endpoints
- **F2b** — Add `/api/timer` route
- **F2c** — Add clock-in/out UI to the day page
- **F3a** — Research Slack status API
- **F3b** — Add Slack credentials to `.env.example`
- **F3c** — Sync Slack status on clock-in/out
