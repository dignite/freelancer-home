# freelancer-home: Workflow / CI Improvements

> Tasks that improve the developer workflow, CI pipeline, or tooling — not the app itself.
> Tracked separately from BACKLOG.md so redwork doesn't pick them up.

---

## Category D: CI / Dependencies

### D1 — Skip GitHub Actions CI for BACKLOG.md-only changes
**File**: `.github/workflows/continuous-integration.yml`
**Problem**: Every push that touches only `BACKLOG.md` triggers a full `npm ci && npm run build && npm test` run (~1 min), wasting CI minutes and blocking bluework PRs behind unnecessary checks.
**Fix**: Add `paths-ignore` to the workflow trigger so the build-and-test job is skipped when only documentation files change:
```yaml
on:
  push:
    paths-ignore:
      - 'BACKLOG.md'
      - 'BLUEWORK.md'
  pull_request:
    paths-ignore:
      - 'BACKLOG.md'
      - 'BLUEWORK.md'
```

---

### D2 — Skip Vercel preview deployments for BACKLOG.md-only changes
**File**: `vercel.json` (create)
**Requires**: D1 (do alongside — same PR is fine)
**Problem**: Every bluework PR triggers a Vercel preview deployment even though only `BACKLOG.md` changed, consuming build minutes and adding noise to the PR checks.
**Fix**: Create `vercel.json` with an `ignoreCommand` that exits 0 (skip build) when only `BACKLOG.md` or `BLUEWORK.md` changed, and exits 1 (proceed) otherwise:
```json
{
  "ignoreCommand": "git diff HEAD~1 --name-only | grep -vE '^(BACKLOG|BLUEWORK)\\.md$' | grep -q . && exit 1 || exit 0"
}
```
Vercel exits 0 → skip, exits 1 → build.

---

## Suggested Order

- **D1** — Skip CI for doc-only changes
- **D2** — Skip Vercel for doc-only changes
