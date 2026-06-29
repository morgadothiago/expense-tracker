# CLI Command Contracts: Code Quality & CI Pipeline

**Feature**: specs/003-code-quality/
**Date**: 2026-06-28

These contracts define the exact behavior of every npm script added by this feature. They are the acceptance criteria for implementation: if running the command produces the described outcome, the task is done.

---

## `npm run typecheck`

**Command**: `tsc --noEmit`

**Success**: exit code `0`, zero output, within 30 seconds.

**Failure**: exit code `1`, output includes file paths, line:col, and error message for each TypeScript error.

**Example failure output**:
```
src/screens/AddExpenseScreen.tsx:12:5 - error TS2322: Type 'string' is not assignable to type 'number'.
Found 1 error.
```

---

## `npm run lint`

**Command**: `eslint . --max-warnings 0`

**Success**: exit code `0`, zero output (no warnings, no errors).

**Failure**: exit code `1`, output lists each violation as:
```
/path/to/file.ts
  line:col  error  <message>  <rule-name>
```

**Scope**: All `.ts` and `.tsx` files under `src/`. Excludes `node_modules/`, `.expo/`, `dist/`, `specs/`, `coverage/`.

---

## `npm run lint:fix`

**Command**: `eslint . --fix`

**Success**: exit code `0`. Files with auto-fixable violations are rewritten in place. Non-fixable violations remain and are reported.

**Not a CI command** — for local developer use only.

---

## `npm run format`

**Command**: `prettier --write "src/**/*.{ts,tsx}"`

**Success**: exit code `0`. Files are rewritten with correct formatting. Output lists each file processed.

**Not a CI command** — for local developer use only.

---

## `npm run format:check`

**Command**: `prettier --check "src/**/*.{ts,tsx}"`

**Success**: exit code `0`, output: "All matched files use Prettier code style!"

**Failure**: exit code `1`, output lists each file with formatting violations.

**CI usage**: Run in pipeline after lint step.

---

## `npm run test`

**Command**: `jest`

**Success**: exit code `0`. Output includes:
```
Test Suites: N passed, N total
Tests:       N passed, N total
Time:        X.XXXs
```

**Failure**: exit code `1`. Output includes:
- Failed test suite name
- Failed test name  
- Expected vs received values

**Scope**: All `*.test.ts` files under `src/`.

---

## `npm run test:coverage`

**Command**: `jest --coverage`

**Success**: exit code `0`. Output includes coverage table:
```
File            | % Stmts | % Branch | % Funcs | % Lines |
----------------|---------|----------|---------|---------|
currency.ts     |   100   |   100    |   100   |   100   |
date.ts         |   100   |   100    |   100   |   100   |
```

**Not required to be 100%** — table is informational. Exit code driven by test pass/fail only.

---

## GitHub Actions CI Pipeline

**Trigger**: `push` to any branch, `pull_request` targeting `main`.

**Jobs**:

| Job | Steps | Fail condition |
|-----|-------|---------------|
| `typecheck` | checkout → setup-node → cache → npm ci → `tsc --noEmit` | Any TypeScript error |
| `lint` | checkout → setup-node → cache → npm ci → `eslint . --max-warnings 0` | Any lint error/warning |
| `test` | checkout → setup-node → cache → npm ci → `jest` | Any failing test |

**Parallelism**: `typecheck` and `lint` run in parallel. `test` runs in parallel with both.

**Cache key**: `${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}`

**Node version**: 20 (LTS)

**Runner**: `ubuntu-latest`

**Expected total duration**: < 3 minutes for a typical push (with warm cache: < 90 seconds).

---

## README Badge

After CI is configured:

```markdown
[![CI](https://github.com/YOUR_USERNAME/expense-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/expense-tracker/actions/workflows/ci.yml)
```

Badge reflects the most recent CI run on the `main` branch.
