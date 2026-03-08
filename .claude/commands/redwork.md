---
allowed-tools: Read, Edit, Write, Bash(git:*), Bash(gh pr:*), Bash(gh run:*), Bash(npm test:*), Bash(npx tsc:*), Bash(npm run build:*), Bash(printf:*), Bash(base64:*), Bash(curl:*), Skill(verify), Skill(ship), Skill(bluework)
---

Red work: pick the next prioritised task from BACKLOG.md, implement it, ship it, then hand off
to /bluework.

Accepts optional argument `auto` — if passed, skip all confirmation prompts and treat the
/ship merge question as auto-approved (used for the autonomous claude-claude-claude loop).

## Steps

0. **Clear context** — run `/clear` to free the context window before starting work.

1. **Pick a task** — read `BACKLOG.md`. From "Suggested Order", find the first item that:
   - Is not Category E (evergreen) or F (feature) — too large for autonomous execution
   - Has no unmet `Requires` — a dep is met if its ID is gone from BACKLOG.md

   **Non-auto**: show the task and ask:
   > I'll work on **<ID>**: <title>. Shall I proceed?
   Wait for confirmation.

   **Auto**: proceed immediately without asking.

2. **Create branch**:
   ```
   git fetch origin
   git checkout -b backlog/<id>-<short-slug> origin/main
   ```

3. **Implement** — follow the task description.
   - **[test first]**: commit failing test first, then fix in a second commit.
   - Otherwise: implementation + tests in one commit.
   - Reuse existing patterns and utilities.

4. **Verify** — run /verify. Fix any failures.

5. **Remove from BACKLOG.md** — delete the entry from its category section and from
   "Suggested Order". Commit this alongside the implementation.

6. **Ship**:
   - **Non-auto**: run /ship (which handles CI, preview, and asks whether to merge).
   - **Auto**: run /ship but treat its merge confirmation as auto-approved — after CI and
     preview pass, merge with `gh pr merge --rebase` without waiting for user input.

7. **Hand off**:
   - **Non-auto**: call /bluework (without `auto`) to plan the next task.
   - **Auto**: call /bluework with argument `auto` to continue the loop.
