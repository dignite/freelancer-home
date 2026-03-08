# D2 — Upgrade react-query v3 → @tanstack/react-query v5

**Package**: `react-query` ^3.39.3 → `@tanstack/react-query` ^5.x
**Risk**: High — package renamed, SSR API changed, useQuery call-site changes
**Tests affected**: Yes — any test importing from `"react-query"` must be updated

## What changes

The package is renamed from `react-query` to `@tanstack/react-query`. Every import in the codebase must be updated. The SSR hydration component is renamed from `Hydrate` to `HydrationBoundary`. The string-key shorthand for `useQuery` is removed.

## Files to change

- `modules/react-query-client.ts`
- `pages/_app.js`
- `pages/month/[month].js`
- `pages/day/[day].js`

## Migration steps

1. `npm uninstall react-query && npm install @tanstack/react-query@^5`
2. In `react-query-client.ts`:
   - Replace `import { QueryClient } from "react-query"` with `import { QueryClient } from "@tanstack/react-query"`
   - The `queryFn: ({ queryKey }) => ...` signature is still valid in v5
3. In `pages/_app.js`:
   - Replace `import { Hydrate, QueryClientProvider } from "react-query"` with `import { HydrationBoundary, QueryClientProvider } from "@tanstack/react-query"`
   - Replace `<Hydrate state={...}>` with `<HydrationBoundary state={...}>`
4. In `pages/month/[month].js` and `pages/day/[day].js`:
   - Replace `import { dehydrate, useQuery } from "react-query"` with `import { dehydrate, useQuery } from "@tanstack/react-query"`
   - **Breaking**: `useQuery("summary/...")` string shorthand is removed in v5. Convert all calls to the object form: `useQuery({ queryKey: ["summary/..."] })`
   - The `defaultQueryFn` set on the `QueryClient` is still honoured in v5, so the shorthand removal is purely call-site syntax
5. Run `npm test` to catch any remaining issues

## Notes on defaultQueryFn

The `createClient()` factory in `react-query-client.ts` sets `defaultOptions.queries.queryFn`. In v5, `defaultQueryFn` is still supported but the string-key shorthand `useQuery("key")` is removed — callers must pass `useQuery({ queryKey: ["key"] })`. This affects every `useQuery(...)` call in pages.

## Suggested order

Do D2 after D1 (both touch test infrastructure). Do D2 before D3 (Next.js 15) and D6 (React 19), as `@tanstack/react-query` v5 is designed for React 18+.

Full upgrade order: **D5 → D4 → D1 → D2 → D3 → D6**
