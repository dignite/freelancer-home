# Mutation Testing

Verify that the test suite actually detects broken code — not just that it runs.

## What is mutation testing?

A small deliberate change ("mutation") is introduced into implementation code.
If no test fails, the mutation survived — meaning the tests don't cover that behaviour.
The mutation is always reverted afterwards regardless of outcome.

## Process

Repeat the following cycle for a reasonable number of iterations (default: 10, or as instructed):

### One iteration

1. **Pick a mutation target** — choose a line in an implementation file (not a test file, not a type definition). Good candidates:
   - A conditional (`===` → `!==`, `>` → `>=`, `&&` → `||`)
   - A arithmetic operator (`+` → `-`, `*` → `/`)
   - A return value (return `0` instead of a computed value, return `[]` instead of a mapped array)
   - A string constant (change a key name, status code, or error message)
   - Remove a guard clause entirely

2. **Apply the mutation** — make the single-line change

3. **Run tests** — `npm test`

4. **Evaluate the result**:
   - **Tests failed** → mutation was caught ✅. Revert the change and move to the next iteration.
   - **Tests passed** → mutation survived ⚠️. Revert the change, then analyse:
     - Is there an **existing test** that should be strengthened to catch this?
     - Should a **new test** be written?
     - Is the mutated code **unreachable or redundant** and should be removed?
     - Document the finding.

5. **Revert the mutation** — always restore the original code before the next iteration.

## Output

After all iterations, produce a summary:
- How many mutations were caught vs survived
- For each surviving mutation: the file, the change, and the recommended action (improve test / add test / remove dead code)
- Prioritised list of recommended follow-up actions
