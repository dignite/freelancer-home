Run all local quality checks before committing. Work through each step and fix any failures before moving on.

## Steps

1. **Types** — `npx tsc --noEmit`
   - Fix all type errors before proceeding

2. **Tests** — `npm test`
   - Fix any failing tests before proceeding

3. **Build** — `npm run build`
   - Catches Next.js page/API issues that TypeScript misses (missing exports, bad imports, etc.)
   - Fix any build errors before proceeding

## Output

Report pass/fail for each step. If everything passes, it is safe to commit.
If anything fails, fix it and re-run the failing step to confirm before proceeding.
Do not commit until all three steps pass.
