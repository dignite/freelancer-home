# D4 — Upgrade date-fns v2 → v3

**Package**: `date-fns` ^2.29.3 → ^3.x
**Risk**: Low — one import site, one test to rewrite
**Tests affected**: Yes — `date-info.test.ts` mocks the old subpath

## What changes in date-fns v3

date-fns v3 is ESM-first. The deep subpath import style (`import getISOWeek from "date-fns/getISOWeek"`) is replaced by named exports from the main package (`import { getISOWeek } from "date-fns"`). The function signatures are unchanged.

## Files to change

- `modules/harvest-report-api/npm-package-encapsulation/date-info.ts`
- `modules/harvest-report-api/npm-package-encapsulation/date-info.test.ts`
- `tsconfig.json` — may need `moduleResolution` update (see D5)

## Migration steps

1. `npm install date-fns@^3`
2. In `date-info.ts`:
   - Replace `import getISOWeek from "date-fns/getISOWeek"` with `import { getISOWeek } from "date-fns"`
   - The export `export const getWeekNumber = getISOWeek` is unchanged
3. In `date-info.test.ts`:
   - Replace `import mockGetISOWeek from "date-fns/getISOWeek"` with `import { getISOWeek as mockGetISOWeek } from "date-fns"`
   - Replace `jest.mock("date-fns/getISOWeek")` with `jest.mock("date-fns", () => ({ getISOWeek: jest.fn() }))`
   - The assertion `expect(getWeekNumber).toStrictEqual(mockGetISOWeek)` tests referential equality after the mock; verify this still holds or refactor to a behavioural assertion
4. In `tsconfig.json`: consider changing `"moduleResolution": "node"` to `"moduleResolution": "bundler"` for better ESM compatibility (do alongside D5)
5. Run `npm test`

## Notes

- `time-summary.ts` calls `getWeekNumber(Date.parse(timeEntry.date))` — `getISOWeek` in date-fns v3 still accepts `Date | number`, so no change needed there.
- The `date-info.test.ts` test verifies that `getWeekNumber` is a re-export alias. After the module-level mock change, confirm the test still validates the wiring correctly.

## Suggested order

D4 is independent of D1, D2, D3. It can be done at any point. Good warm-up before tackling D1 or D2.

Full upgrade order: **D5 → D4 → D1 → D2 → D3 → D6**
