# freelancer-home: Improvement Backlog

> Pick any item and ask Claude to implement it. Each item is self-contained.
> Items marked **[test first]** should have a failing test committed before the implementation fix — two commits, one PR.
> - When a task is implemented, **remove it from this file in the same PR** — including its entry in the "Suggested Order" section.
> - Detailed upgrade plans for dependency items (D-category) live in `BACKLOG/`. Read the relevant file before starting a D-category task.

---

## Category A: Bug Fixes

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

## Category B: Code Quality / Small Cleanups

## Category C: Test Coverage

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

- **A3** — `pages/api/by-name`: add try/catch
- **A8a** — Fix float accumulation in `vab.js`
- **A8b** — Fix float accumulation in `client-time-reporting-entries.js`
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
