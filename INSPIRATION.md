# Inspiration

Reference projects for bluework analysis: patterns, quality benchmarks, and feature ideas
relevant to this codebase. Consult during Phase 1 when scanning for improvement opportunities.

---

## Testing patterns

Directly relevant to C-category backlog items (Jest, MSW, react-query, TypeScript migration).

| Repository | Stars | Key technique |
|---|---|---|
| [TanStack/query](https://github.com/TanStack/query) | ~49k | `createWrapper` factory with `retry: false`; `queryClient.clear()` in `afterEach`; `renderHook` + `waitFor` for async assertions |
| [mswjs/msw](https://github.com/mswjs/msw) | ~18k | `resetHandlers()` after each test (not `close()`); per-test `server.use()` overrides that are cleaned up automatically |
| [goldbergyoni/javascript-testing-best-practices](https://github.com/goldbergyoni/javascript-testing-best-practices) | ~25k | Test naming (`describe` / `it` structure); no logic in tests; `test.each` for parameterisation; testing observable behaviour not implementation |
| [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react) | ~31k | MSW handler co-location next to the feature it mocks; `renderApp()` integration helper that wires up QueryClientProvider + router + MSW in one call |
| [vercel/next.js — `examples/with-jest`](https://github.com/vercel/next.js/tree/canary/examples/with-jest) | 138k repo | `next/jest` transformer; dual `testEnvironment` (jsdom for components, node for API routes) configured as Jest projects |
| [kulshekhar/ts-jest](https://github.com/kulshekhar/ts-jest) | ~7k | Incremental JS→TS migration: mixed `.test.js` + `.test.ts` in one run; `diagnostics: false` escape hatch during transition; per-file `tsconfig` override |
| [TkDodo — Testing React Query](https://tkdodo.eu/blog/testing-react-query) | canonical blog post | The single best reference combining react-query + MSW in Jest: exactly how the two layers compose without mocking `fetch` manually |
| [Xunnamius/next-test-api-route-handler](https://github.com/Xunnamius/next-test-api-route-handler) | ~200 | The only purpose-built library for testing Next.js Pages Router API routes in a realistic request/response context; useful for C1/C2-style API tests |

**What to look for during a bluework pass:** are our test files following the `createWrapper` /
`retry: false` pattern? Are MSW handlers reset per test? Are there test files still in JS that
could migrate? Do any new C-category items make sense given these patterns?

---

## Harvest & freelancer domain

Relevant to F-category features (clock-in/out, invoicing, client reporting).

| Repository | Stars | Key value |
|---|---|---|
| [solidtime-io/solidtime](https://github.com/solidtime-io/solidtime) | ~9k | Modern open-source time-tracker for freelancers: invoicing UX, client reports, timer start/stop flows — strong feature inspiration |
| [kimai/kimai](https://github.com/kimai/kimai) | ~5k | Mature self-hosted tracker: rate sheets, multi-user, export formats — useful for data model depth |
| [Yaaqoub/node-harvest-v2](https://github.com/Yaaqoub/node-harvest-v2) | small | Node.js Harvest v2 API client: endpoint shapes and auth patterns when building F-category features |

**What to look for:** are there Harvest API capabilities (timers, expenses, invoices) that solidtime
or kimai expose in their UI that we have not yet considered as backlog items?

---

## Next.js architecture

| Repository | Stars | Key value |
|---|---|---|
| [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react) | ~31k | Feature-folder structure; shared test utilities; co-located MSW handlers — reference when evaluating modules/ layout |
| [vercel/next.js](https://github.com/vercel/next.js) | ~138k | Official SSR, `getServerSideProps`, and API route examples; authoritative for Pages Router patterns |

---

## Claude Code & AI-assisted development

| Repository | Stars | Key value |
|---|---|---|
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | ~75k | Authoritative source for hooks API, MCP, SDK features, and slash command capabilities |
| [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) | ~27k | Community-curated skills, commands, and hooks — reference when designing new `.claude/` tooling or evaluating our current setup |

**What to look for:** are there hook patterns or skill designs in the community that we should adopt?
Is our `.claude/` setup missing anything the official docs now support?
