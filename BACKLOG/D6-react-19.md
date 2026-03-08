# D6 — Upgrade React 18 → 19

**Package**: `react` + `react-dom` ^18.2.0 → ^19.x
**Risk**: Medium — breaking changes for legacy APIs; SSR hydration pattern must be verified
**Tests affected**: Possibly — if any tests rely on React 18 internal behavior

## What changes in React 19

- `forwardRef` is no longer needed — refs are passed as props directly. No `forwardRef` usage found in this codebase, so no action required.
- `ReactDOM.render` is fully removed (was deprecated in 18 and not used here).
- The `use()` hook is new. Not relevant yet.
- Strict mode double-invocation behavior is refined.
- React 19 is compatible with `@tanstack/react-query` v5, which is built for React 18+.

## Files to check

- `pages/_app.js` — uses `QueryClientProvider` and `HydrationBoundary` (after D2 is done); verify SSR hydration still works end-to-end
- `modules/layout/vertical-rhythm.js` — scan for any deprecated React API usage
- `@types/react` devDependency — update to `^19.x` alongside the runtime

## Migration steps

1. Ensure D2 (@tanstack/react-query v5) is done first
2. Ensure D3 (Next.js 15) is done first — Next.js 15 has full React 19 support; Next.js 13 does not
3. `npm install react@^19 react-dom@^19`
4. `npm install @types/react@^19 --save-dev`
5. Run `npm run build`
6. Run `npm test`
7. Smoke-test the app — pay attention to the hydration boundary and the SSR/client render split on `/month` and `/day`

## Dependency chain

D6 depends on D2 and D3 being complete. Do not attempt D6 in isolation.

## Suggested order

D6 is last in the dependency chain.

Full upgrade order: **D5 → D4 → D1 → D2 → D3 → D6**
