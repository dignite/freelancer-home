# D5 — Upgrade TypeScript 4.9 → 5

**Package**: `typescript` ^4.9.5 → ^5.x
**Risk**: Very low — backward-compatible for this codebase
**Tests affected**: No

## What changes in TypeScript 5

TypeScript 5 is designed to be backward-compatible with TS 4.9 code. Key additions: const type parameters, decorators (not used here), `moduleResolution: "bundler"` option. No TS 4.9-legal code is illegal in TS 5 under the current tsconfig.

## Files to change

- `package.json` — devDependency version bump

## Optional improvement

`tsconfig.json` currently uses `"moduleResolution": "node"`. TypeScript 5 introduces `"moduleResolution": "bundler"` which better matches how Next.js and Webpack resolve modules. Consider updating if D4 (date-fns v3) is also being done, as date-fns v3 benefits from bundler resolution.

## Migration steps

1. `npm install typescript@^5 --save-dev`
2. Run `npm run build` to check for any new TS5 errors
3. Run `npm test`
4. Optionally update `tsconfig.json` `moduleResolution` to `"bundler"` and re-run both

## Suggested order

Do D5 first — it is the safest upgrade and removes one variable from subsequent upgrades that involve TypeScript type changes (D1, D2).

Full upgrade order: **D5 → D4 → D1 → D2 → D3 → D6**
