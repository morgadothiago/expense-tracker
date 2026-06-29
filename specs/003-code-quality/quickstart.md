# Quickstart & Validation Guide: Code Quality & CI Pipeline

**Feature**: specs/003-code-quality/
**Date**: 2026-06-28

---

## Prerequisites

- Node.js 20+ and npm installed
- Project cloned and `npm install` completed
- **New devDependencies installed** (see T001 in tasks.md): `eslint`, `@typescript-eslint/*`, `prettier`, `jest`, `ts-jest`, `sql.js`

---

## Validation Scenario 1: ESLint passes on clean codebase (FR-001, SC-001)

```bash
npm run lint
```

**Expected**: Exit code 0. Zero output (silence = success). If output appears, it must be fixed before this scenario passes.

---

## Validation Scenario 2: Prettier check passes on clean codebase (FR-002)

```bash
npm run format:check
```

**Expected**: `All matched files use Prettier code style!` — exit code 0.

---

## Validation Scenario 3: TypeScript check passes (FR-005)

```bash
npm run typecheck
```

**Expected**: Zero output, exit code 0. `Found 0 errors.`

---

## Validation Scenario 4: Introducing a lint violation triggers failure (FR-001, FR-003)

1. Open any `src/` file and add `const x = 1;` on a new line (unused variable)
2. Run: `npm run lint`
3. **Expected**: Exit code 1. Output includes `@typescript-eslint/no-unused-vars` error with file name and line number.
4. Revert the change.

---

## Validation Scenario 5: All utility unit tests pass (FR-007, FR-008, FR-009, SC-004)

```bash
npm run test -- --testPathPattern=utils
```

**Expected**:
```
PASS src/utils/__tests__/currency.test.ts
PASS src/utils/__tests__/date.test.ts
Tests: 18+ passed
```

Key cases verified (see [data-model.md](./data-model.md)):
- `formatCurrency(4590)` → `"R$ 45,90"` (CUR-01)
- `formatCurrency(0)` → `"R$ 0,00"` (CUR-02)
- `parseCurrencyInput("45,90")` → `4590` (PAR-01)
- `parseCurrencyInput("")` → `0` (PAR-05)
- `prevMonth(2026, 1)` → `{ year: 2025, month: 12 }` (DAT-06)
- `nextMonth(2026, 12)` → `{ year: 2027, month: 1 }` (DAT-08)
- `formatDateShort("2026-06-28")` → `"28 jun"` (DAT-09)

---

## Validation Scenario 6: Repository integration tests pass (FR-010, FR-011, FR-012, SC-005)

```bash
npm run test -- --testPathPattern=storage
```

**Expected**:
```
PASS src/storage/__tests__/expenseRepository.test.ts
PASS src/storage/__tests__/categoryRepository.test.ts
Tests: 15+ passed
```

Key cases verified:
- Add expense → retrieve with category joined (EXP-01)
- Monthly summary — correct total, per category (EXP-06, EXP-09)
- Monthly summary — empty month returns 0 (EXP-08)
- Delete category with linked expense → throws error (CAT-04)
- Delete default category → throws error (CAT-05)

---

## Validation Scenario 7: Full test suite (SC-004, SC-005)

```bash
npm run test
```

**Expected**: All test suites pass. Exit code 0.

---

## Validation Scenario 8: Breaking a currency formula fails tests

1. Open `src/utils/currency.ts`
2. Change `centavos / 100` to `centavos / 10`
3. Run: `npm run test -- --testPathPattern=currency`
4. **Expected**: `FAIL` on CUR-01 (`"R$ 45,90"` expected but got `"R$ 459,00"`)
5. Revert the change.

---

## Validation Scenario 9: CI pipeline runs on GitHub (FR-004, FR-006, SC-002, SC-003)

1. Push any commit to the repository
2. Visit `github.com/<user>/expense-tracker/actions`
3. **Expected**: A workflow run appears within 10 seconds. Three jobs run: `typecheck`, `lint`, `test`.
4. All three jobs complete green within 3 minutes.
5. Visit the README on GitHub — CI badge shows green.

---

## Validation Scenario 10: Commit message follows Conventional Commits (FR-014, SC-006)

```bash
git log --oneline -10
```

**Expected**: Every line starts with a type prefix followed by colon and description, e.g.:
```
ci: add GitHub Actions workflow for typecheck, lint, test
chore: add ESLint and Prettier configuration
test: add unit tests for currency and date utilities
test: add integration tests for expense and category repositories
feat: initial project setup
```

No line should start with bare words like `fix`, `update`, or `wip`.

---

## Cross-Reference

- Command contracts: [contracts/commands.md](./contracts/commands.md)
- Test case definitions: [data-model.md](./data-model.md)
- Technical decisions: [research.md](./research.md)
- Implementation tasks: [tasks.md](./tasks.md)
