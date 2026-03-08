# D8 — Add Prettier with commit hook and CI check

**Packages**: `prettier`, `husky`, `lint-staged` (all devDependencies)
**Risk**: Low — formatting-only change, no logic affected
**Tests affected**: No (test files will be reformatted but logic unchanged)

## What this adds

- `npm run format` — reformat all files in-place
- `npm run format:check` — fail if any file differs from Prettier output (used in CI)
- Pre-commit git hook via Husky that auto-formats staged files with lint-staged
- CI step that enforces formatting on every PR

## Migration steps

### 1. Install packages

```bash
npm install --save-dev prettier husky lint-staged
```

### 2. Update `package.json`

Add to `"scripts"`:
```json
"format": "prettier --write .",
"format:check": "prettier --check ."
```

Add top-level `"lint-staged"` config:
```json
"lint-staged": {
  "*.{js,ts,json,css,md}": "prettier --write"
}
```

No `.prettierrc` needed — use Prettier's defaults (single quotes, 80-char print width, 2-space indent, trailing commas in ES5 contexts).

### 3. Add `.prettierignore`

Create `.prettierignore` at the repo root:
```
.next
coverage
```
`node_modules` is ignored by Prettier automatically.

### 4. Initial formatting commit

Run `npm run format` to reformat all existing files. Commit everything as a single "style: apply Prettier formatting" commit. This keeps the blame history clean — future diffs won't show stale formatting noise.

### 5. Set up Husky pre-commit hook

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

This creates `.husky/pre-commit` which runs `lint-staged` on every `git commit`. `lint-staged` will only format files that are staged, then re-stage them.

### 6. Add CI step

In `.github/workflows/continuous-integration.yml`, add after `npm ci` and before `npm run build`:
```yaml
- run: npm run format:check
```

Placing it first ensures formatting failures are immediately visible without waiting for the build.

### 7. Open PR

CI should pass `format:check` since all files were already formatted in step 4.

## Suggested order

D8 is independent of D5 (TypeScript upgrade) and can be done before or after. Do D8 before D7 (type-check CI step) to keep CI changes batched by concern.

Full upgrade order reference: **D8 → D7 → D5 → D4 → D1 → D2 → D3 → D6**

## Notes

- Prettier's defaults: 2-space indent, 80-char print width, double quotes, trailing commas (`"all"` in v3), semicolons on.
- If you want to deviate from any default, add a `.prettierrc` — but the goal here is default config, so none is needed.
- `lint-staged` only formats files you're already staging, so it won't reformat unrelated files mid-PR.
- Husky v9+ uses a `prepare` script (`"prepare": "husky"`) to auto-install hooks after `npm install`. The `npx husky init` command adds this automatically.
