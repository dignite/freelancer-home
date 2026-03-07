---
allowed-tools: Bash(gh pr:*), Bash(gh run:*), Bash(git:*), Bash(printf:*), Bash(base64:*), Bash(curl:*), Read, Skill(test-preview)
---

Open a PR for the current branch, wait for CI to pass, run /test-preview, then ask whether to merge.

## Steps

1. **Sync with origin/main** — fetch and rebase if needed:
   ```
   git fetch origin
   ```
   Check if origin/main has commits not in the branch:
   ```
   git log HEAD..origin/main --oneline
   ```
   If there are any commits, rebase:
   ```
   git rebase origin/main
   ```
   Then force-push to update the remote branch:
   ```
   git push --force-with-lease
   ```
   If the rebase has conflicts, stop and report them — do not proceed until resolved.

2. **Open PR** — summarise the branch commits with `git log origin/main..HEAD --oneline`, then create the PR:
   ```
   gh pr create --title "<title>" --body "..."
   ```
   Use this body format:
   ```
   ## Summary
   <bullet points from commits>

   ## Test plan
   - [ ] CI passes
   - [ ] Preview deployment tested with /test-preview

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```

3. **Wait for CI** — run `gh pr checks --watch` to block until all checks complete.
   - If any check fails, report which check failed and stop. Do not proceed.

4. **Run /test-preview** — invoke the test-preview skill against the preview deployment.
   - If any endpoint fails, report the failure and stop. Do not proceed.

5. **Ask whether to merge** — once CI and preview both pass, ask:

   > CI passed and preview looks good. Should I merge this PR?

   Wait for the user's response. Do not merge automatically.
