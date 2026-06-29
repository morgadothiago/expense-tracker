# Data Model: Code Quality & CI Pipeline

**Feature**: specs/003-code-quality/
**Date**: 2026-06-28

This feature introduces no new data entities. This document defines the configuration schemas and test case definitions that serve as the "data model" for the tooling layer.

---

## Configuration Schemas

### ESLint Config (`.eslintrc.js`)

| Field | Value | Purpose |
|-------|-------|---------|
| `parser` | `@typescript-eslint/parser` | Parse TypeScript syntax |
| `extends` | `eslint:recommended`, `@typescript-eslint/recommended`, `prettier` | Base rules |
| `plugins` | `@typescript-eslint`, `react`, `react-hooks` | Rule sets |
| `rules["@typescript-eslint/no-explicit-any"]` | `error` | Enforce no `any` |
| `rules["react-hooks/rules-of-hooks"]` | `error` | Hooks placement |
| `rules["react-hooks/exhaustive-deps"]` | `warn` | Hook deps |
| `ignorePatterns` | `node_modules/`, `.expo/`, `dist/`, `specs/` | Exclude non-source |

### Prettier Config (`.prettierrc`)

| Field | Value |
|-------|-------|
| `singleQuote` | `true` |
| `trailingComma` | `"all"` |
| `semi` | `true` |
| `printWidth` | `100` |
| `tabWidth` | `2` |
| `bracketSpacing` | `true` |

### Jest Config (`jest.config.js`)

| Field | Value | Purpose |
|-------|-------|---------|
| `preset` | `ts-jest` | TypeScript compilation |
| `testEnvironment` | `node` | Node.js runtime (no jsdom) |
| `testMatch` | `**/__tests__/**/*.test.ts` | Test file pattern |
| `moduleNameMapper` | maps `expo-sqlite` → test stub | Prevent native module import |
| `collectCoverageFrom` | `src/utils/**/*.ts`, `src/storage/**/*.ts` | Coverage scope |

---

## Test Case Definitions

### Currency Utility (`src/utils/__tests__/currency.test.ts`)

#### `formatCurrency(centavos: number): string`

| Test ID | Input | Expected Output | Notes |
|---------|-------|-----------------|-------|
| CUR-01 | `4590` | `"R$ 45,90"` | Standard amount |
| CUR-02 | `0` | `"R$ 0,00"` | Zero |
| CUR-03 | `100` | `"R$ 1,00"` | One real exactly |
| CUR-04 | `1` | `"R$ 0,01"` | Minimum unit (1 centavo) |
| CUR-05 | `100000` | `"R$ 1.000,00"` | Thousands separator |
| CUR-06 | `999999999` | Large formatted string | Large number (no overflow) |

#### `parseCurrencyInput(input: string): number`

| Test ID | Input | Expected Output | Notes |
|---------|-------|-----------------|-------|
| PAR-01 | `"45,90"` | `4590` | Standard Brazilian format |
| PAR-02 | `"45.90"` | `4590` | US decimal format |
| PAR-03 | `"45"` | `4500` | Integer input |
| PAR-04 | `"0"` | `0` | Zero input |
| PAR-05 | `""` | `0` | Empty string |
| PAR-06 | `"abc"` | `0` | Non-numeric |
| PAR-07 | `"1.234,56"` | `123456` | Thousands + decimal |
| PAR-08 | `"0,01"` | `1` | Minimum centavo |

---

### Date Utility (`src/utils/__tests__/date.test.ts`)

#### `todayISO(): string`

| Test ID | Expected Pattern | Notes |
|---------|-----------------|-------|
| DAT-01 | `YYYY-MM-DD` format | Matches ISO 8601 regex |

#### `monthFilterPattern(year, month): string`

| Test ID | Input | Expected Output |
|---------|-------|-----------------|
| DAT-02 | `(2026, 6)` | `"2026-06-%"` |
| DAT-03 | `(2026, 1)` | `"2026-01-%"` | Single-digit month padded |
| DAT-04 | `(2026, 12)` | `"2026-12-%"` | December |

#### `prevMonth(year, month)`

| Test ID | Input | Expected Output |
|---------|-------|-----------------|
| DAT-05 | `(2026, 6)` | `{ year: 2026, month: 5 }` |
| DAT-06 | `(2026, 1)` | `{ year: 2025, month: 12 }` | Year boundary |

#### `nextMonth(year, month)`

| Test ID | Input | Expected Output |
|---------|-------|-----------------|
| DAT-07 | `(2026, 6)` | `{ year: 2026, month: 7 }` |
| DAT-08 | `(2026, 12)` | `{ year: 2027, month: 1 }` | Year boundary |

#### `formatDateShort(iso: string): string`

| Test ID | Input | Expected Output |
|---------|-------|-----------------|
| DAT-09 | `"2026-06-28"` | `"28 jun"` |
| DAT-10 | `"2026-01-01"` | `"1 jan"` |
| DAT-11 | `"2026-12-31"` | `"31 dez"` |

---

### Expense Repository (`src/storage/__tests__/expenseRepository.test.ts`)

| Test ID | Scenario | Assertion |
|---------|----------|-----------|
| EXP-01 | Add expense to existing category | Retrieved expense has correct amount, date, category name |
| EXP-02 | Add expense, retrieve by ID | Returns matching expense with category joined |
| EXP-03 | Add 3 expenses, getExpenses | Returns all 3, ordered date DESC |
| EXP-04 | Update expense amount | Retrieved amount reflects update |
| EXP-05 | Delete expense | Subsequent getExpenses does not include deleted item |
| EXP-06 | Monthly summary — single month | Total = sum of all expenses in that month only |
| EXP-07 | Monthly summary — two months | Each month's total is independent |
| EXP-08 | Monthly summary — empty month | Total = 0, byCategory = [] |
| EXP-09 | Monthly summary — 3 categories | byCategory has 3 entries, ordered by total DESC |

### Category Repository (`src/storage/__tests__/categoryRepository.test.ts`)

| Test ID | Scenario | Assertion |
|---------|----------|-----------|
| CAT-01 | getCategories after seed | Returns 6 default categories |
| CAT-02 | createCategory | New category appears in getCategories |
| CAT-03 | Delete user-created category with no expenses | Category removed from list |
| CAT-04 | Delete category with linked expense | Throws error; category still exists |
| CAT-05 | Delete default category | Throws error; category still exists |
| CAT-06 | Duplicate category name (case-insensitive) | Throws error on second insert |

---

## npm Scripts Schema

| Script | Command | Description |
|--------|---------|-------------|
| `lint` | `eslint . --max-warnings 0` | Check all files, fail on any warning |
| `lint:fix` | `eslint . --fix` | Auto-fix fixable violations |
| `format` | `prettier --write "src/**/*.{ts,tsx}"` | Format all source files |
| `format:check` | `prettier --check "src/**/*.{ts,tsx}"` | Check formatting (CI mode) |
| `test` | `jest` | Run all tests |
| `test:coverage` | `jest --coverage` | Run tests with coverage report |
| `typecheck` | `tsc --noEmit` | TypeScript check only |
