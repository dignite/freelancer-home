# freelancer-home: Improvement Backlog

> Pick any item and ask Claude to implement it. Each item is self-contained.

---

## Category A: Bug Fixes

### A1 — `middleware.js`: Harden Basic Auth parsing
**File**: `middleware.js`
**Problem**: `basicAuth.split(" ")[1]` can be `undefined` if the header is malformed (e.g. `Authorization: Basic` with no value); `atob()` then throws an uncaught error, crashing the middleware.
**Fix**: Wrap parsing in try/catch; validate `authValue` exists and `atob()` result contains a colon before destructuring.

---

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

### A4 — PE Accounting API: Check `response.ok` before `.json()`
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Problem**: `response.json()` is called unconditionally. A 4xx/5xx response with a non-JSON body throws an unhandled error.
**Fix**: Check `response.ok`; return an appropriate error response if not ok.

---

### A5 — PE Accounting API: Wrap entire handler in try/catch
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Problem**: Network errors from `fetch()` are completely unhandled.
**Fix**: Wrap handler body in try/catch; return 500 on failure.

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

## Category B: Code Quality / Small Cleanups

### B1 — `package.json`: Fix React version strings
**File**: `package.json`
**Problem**: `"react": "18.2"` and `"react-dom": "18.2"` are missing the patch version — not valid semver.
**Fix**: Update both to `"^18.2.0"`.

---

### B2 — PE Accounting API: Move hardcoded `activityId` to env var
**File**: `pages/api/client-time-reporting/[startDate]/[endDate].js`
**Problem**: `activityId=45784` is hardcoded in the URL. This is personal/account-specific config.
**Fix**: Read from `process.env.PE_ACCOUNTING_ACTIVITY_ID`, falling back to the current hardcoded value. Document in `.env.example`.

---

### B3 — `harvest-queries.ts`: Remove redundant `NonNullable` type
**File**: `modules/harvest-report-api/npm-package-encapsulation/harvest-queries.ts`
**Problem**: The file defines `type NonNullable<T> = Exclude<T, null | undefined>` which is identical to TypeScript's built-in `NonNullable<T>`.
**Fix**: Delete the local definition; rely on the built-in.

---

### B4 — Improve `isValidDaySlug` validation
**File**: `pages/day/[day].js`
**Problem**: `day.length === 10` accepts any 10-character string like `"abcdefghij"` or `"2024-99-99"`.
**Fix**: Use a regex: `/^\d{4}-\d{2}-\d{2}$/.test(day)`.

---

### B5 — Improve `isValidMonthSlug` validation
**File**: `pages/month/[month].js`
**Problem**: `month.length === 7` accepts any 7-character string.
**Fix**: Use a regex: `/^\d{4}-\d{2}$/.test(month)`.

---

### B6 — Add `jest-mock` as explicit devDependency
**File**: `package.json`
**Problem**: `time-entries.test.ts` imports from `"jest-mock"` but it's not declared in `package.json` (arrives as a transitive dep of Jest).
**Fix**: Add `"jest-mock": "*"` (or matching version) to devDependencies.

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

### C3 — Test `harvest-report-api/index.ts` (summary + byName entry points)
**File**: New file `modules/harvest-report-api/index.test.ts`
**Problem**: `summary()` and `byName()` are the main public API but have zero direct tests.
**Fix**: Add tests using MSW (already set up) to exercise both functions.

---

### C4 — Test SEK edge cases in `swedish-crowns.ts`
**File**: `modules/harvest-report-api/npm-package-encapsulation/swedish-crowns.test.ts`
**Problem**: No tests for negative amounts, zero, or large numbers with float precision risk.
**Fix**: Add test cases to the existing file.

---

### C5 — Test `isValidDaySlug` and `isValidMonthSlug`
**Files**: `pages/day/[day].js`, `pages/month/[month].js`
**Problem**: Exported functions with business logic but no tests. Pairs naturally with B4/B5.
**Fix**: Add small test files for each page's exported helpers.

---

### C6 — Test `lastDayOfMonth` and `firstDayOfLastMonth`
**File**: `pages/month/[month].js`
**Problem**: Date arithmetic functions with no tests. Edge cases: leap years, December → January boundary.
**Fix**: The functions are already exported — add a test file covering edge cases.

---

## Category D: CI / Dependencies

### D1 — Update GitHub Actions versions
**File**: `.github/workflows/continuous-integration.yml`
**Problem**: Uses `actions/checkout@v2` and `actions/setup-node@v1` (both deprecated).
**Fix**: Update to `actions/checkout@v4` and `actions/setup-node@v4`.

---

### D2 — Update CI Node version from 14.x to 20.x
**File**: `.github/workflows/continuous-integration.yml`
**Problem**: Node 14 reached EOL April 2023.
**Fix**: Change `node-version: [14.x]` to `[20.x]`.

---

### D3 — Add `.nvmrc` file
**File**: New `.nvmrc`
**Problem**: No local Node version pinning. Developers may use any Node version.
**Fix**: Create `.nvmrc` containing `20`.

---

## Suggested Order

1. **D1 + D2** — Fix CI first so tests run on a supported runtime
2. **D3** — Add `.nvmrc`
3. **A1** — Auth middleware hardening (highest security impact)
4. **A4 + A5** — PE Accounting error handling
5. **B1 + B6** — `package.json` cleanups
6. **B4 + B5 + C5** — Improve slug validation + tests (natural pairing)
7. **A6 + A7** — Month page loading state + query error message
8. **B2** — Move `activityId` to env
9. **B3** — Remove redundant type
10. **C1 → C6** — Test coverage, in order
11. **A2 + A3** — API try/catch for tidy JSON errors
