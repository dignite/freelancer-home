# D3 — Upgrade Next.js 13 → 15 (Pages Router)

**Package**: `next` ^13.2.4 → ^15.x
**Risk**: Very high — architectural decision required; broad surface area
**Tests affected**: Possibly — `nextJest` config may need verification

## Architectural decision: App Router migration or Pages Router continuation

Next.js 15 retains full Pages Router support. The App Router is not mandatory. This project uses `getServerSideProps` and the react-query dehydration/hydration SSR pattern, both of which map cleanly to Pages Router and have no equivalent shortcut in App Router without significant redesign.

**Recommendation**: Stay on Pages Router for this upgrade. App Router migration is separate, larger future work (F-category), not a D-category dependency upgrade.

## What changes between Next.js 13 and 15 (Pages Router only)

- **`next/jest` integration**: `createJestConfig` API is unchanged but internal transforms update. Re-run tests after upgrade.
- **Middleware**: Next.js 14+ tightened middleware behavior. The current `middleware.js` uses `NextResponse.rewrite(url)` for Basic Auth — smoke-test the `/` auth flow after upgrade.
- **Fetch caching**: Next.js 15 changes the default fetch cache behavior. In 13, server `fetch()` was cached by default (opt-out). In 15, it is uncached by default (opt-in). The Harvest API calls in `harvest-queries.ts` should not be cached anyway, so no action required — but verify no unexpected behavior.
- **`next-env.d.ts`**: Will be regenerated automatically.

## Files to change

- `package.json` — version bump
- `jest.config.js` — verify after upgrade; likely no changes needed
- `middleware.js` — smoke-test auth flow after upgrade

## Migration steps

1. Ensure D2 (@tanstack/react-query v5) is done first — the SSR hydration pattern must use `HydrationBoundary` before upgrading Next.js
2. `npm install next@^15`
3. Run `npm run build` — fix any TypeScript or compilation errors
4. Run `npm test` — fix any jest transform issues
5. Manually smoke-test: open `/` (should prompt Basic Auth), open `/month/YYYY-MM`, open `/day/YYYY-MM-DD`

## React peer dependency note

- Next.js 15 requires React 18.2.0 or later. React 19 is also supported.
- If D6 (React 19) is not yet done, pin React to 18 explicitly and upgrade React in a separate step.

## Suggested order

Do D3 after D1, D2, and D5. D6 (React 19) can be done after or alongside D3.

Full upgrade order: **D5 → D4 → D1 → D2 → D3 → D6**
