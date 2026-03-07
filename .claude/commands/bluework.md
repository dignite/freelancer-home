---
allowed-tools: Read, Edit, Bash(git:*), Bash(gh pr:*), Bash(gh run:*), Skill(redwork)
---

Blue work: actively review and improve BACKLOG.md, commit the changes as a PR, then hand off
to /redwork.

Accepts optional argument `auto` — if passed, skip human discussion and act autonomously.

## Steps

### Phase 1: Analysis (always runs — auto or not)

1. Read `BACKLOG.md` in full.

2. Explore relevant parts of the codebase to inform the review. Consider:
   - Are there known problem areas not yet on the backlog?
   - Do any existing items look stale, vague, already done, or too large to be actionable?
   - Are there items that should be split into smaller steps, or small items that should be merged?
   - Are dependencies (`Requires`) still valid, or have some been resolved?
   - Is there an aspect of the code worth deep analysis (test coverage gaps, error handling,
     type safety, floating-point issues, API hardening)?

3. Formulate a concrete set of proposed changes: add, remove, split, combine, clarify, re-order.

### Phase 2: Decide & discuss

- **Non-auto**: present your proposed changes to the user. Discuss and refine. Get confirmation
  before writing anything.
- **Auto**: proceed with the proposed changes without asking.

### Phase 3: Edit BACKLOG.md (only if changes were decided)

4. Apply the agreed changes to `BACKLOG.md`. Keep the structure clean:
   - Entries use the standard format (ID, File, Problem, Fix, optional Requires/[test first])
   - "Suggested Order" reflects dependencies and priority

### Phase 4: Commit and PR (only if BACKLOG.md was changed)

5. Create a branch and commit:
   ```
   git fetch origin
   git checkout -b bluework/<short-slug> origin/main
   ```
   Commit the changes with a clear message. **Always append `[skip ci]` to the commit message** — BACKLOG.md changes don't need CI, and `[skip ci]` satisfies branch protection (unlike `paths-ignore` which leaves checks unsatisfied).

6. Open a PR:
   ```
   gh pr create --title "..." --body "..."
   ```

7. Wait for Vercel (CI is skipped):
   ```
   gh pr checks --watch
   ```
   Vercel will also skip via `ignoreCommand`. Once all checks are green (or skipped), proceed.

8. Merge:
   ```
   gh pr merge --rebase
   ```

### Phase 5: Hand off

9. **Non-auto**: call /redwork (without `auto`) to implement the next task.
   **Auto**: call /redwork with argument `auto`.
