# D1 — Upgrade MSW v1 → v2

**Package**: `msw` ^1.1.0 → ^2.x
**Risk**: High — complete handler API rewrite
**Tests affected**: Yes — all MSW handler factories must be rewritten

## What changes in MSW v2

MSW v2 replaces the `rest.get(url, (req, res, ctx) => ...)` three-argument handler pattern with a fetch-native `http.get(url, ({ request }) => Response)` pattern. The `ctx` helper and `res()` composer are gone entirely. Responses are standard Web `Response` objects via the new `HttpResponse` helper.

## Files to change

- `modules/harvest-report-api/mock-service-worker/harvest-handlers.ts`
- `modules/harvest-report-api/mock-service-worker/server.ts`

## Migration steps

1. `npm install msw@^2`
2. In `harvest-handlers.ts`:
   - Replace `import { rest } from "msw"` with `import { http, HttpResponse } from "msw"`
   - Rewrite `prepareGetTimeEntriesSuccess` to use `http.get(url, ({ request }) => { ... return HttpResponse.json(body) })`
   - Replace `res(ctx.status(401), ctx.json({ ... }))` with `HttpResponse.json({ ... }, { status: 401 })`
   - Update the return type annotation from `ReturnType<typeof rest.get>` to `HttpHandler` (imported from `"msw"`)
   - Rewrite `getTimeEntriesError` similarly
3. In `server.ts`:
   - `setupServer` is now imported from `"msw/node"` — the import path is unchanged, but verify it still resolves
4. Run `npm test` — fix any remaining type errors from the handler type changes

## Notes on request inspection

In v1, `req.headers.get(...)` and `req.url.searchParams.get(...)` are available on the MSW request object. In v2, `request` is a standard `Request` — the same Web API applies. Header and query inspection logic in handler factories should transfer directly.

## Suggested order

Do D1 before D2, because D2's test changes will also touch the MSW server setup.

Full upgrade order: **D5 → D4 → D1 → D2 → D3 → D6**
