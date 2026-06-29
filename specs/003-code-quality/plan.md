# Implementation Plan: Code Quality & CI Pipeline

**Branch**: `003-code-quality` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-code-quality/spec.md`

## Summary

Add ESLint + Prettier for consistent code style, a GitHub Actions CI pipeline (typecheck + lint on every push), unit tests for currency and date utilities, and integration tests for the SQLite repository layer. Reorganize git history with Conventional Commits for all new commits going forward. This is a pure developer-tooling and testing pass — zero changes to app behavior.

## Technical Context

**Language/Version**: TypeScript ~6.0.3 (strict mode, existing)

**Primary New Dependencies**:
- `eslint` + `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` — TypeScript-aware linting
- `eslint-plugin-react` + `eslint-plugin-react-native` — React/RN specific rules
- `eslint-plugin-react-hooks` — hooks rules (exhaustive-deps, rules-of-hooks)
- `prettier` — opinionated formatter
- `eslint-config-prettier` — disables ESLint rules that conflict with Prettier
- `jest` + `@types/jest` — test runner (Node-compatible, runs without simulator)
- `ts-jest` — TypeScript transform for Jest
- `better-sqlite3` or `sql.js` — Node-compatible SQLite for integration tests (NOT expo-sqlite which requires native runtime)

**CI**: GitHub Actions (`ubuntu-latest`) — no iOS/Android simulator needed since tests run in Node.js

**Storage**: No changes to production database

**Testing Strategy**:
- Unit tests: Jest + ts-jest, pure TypeScript, zero React Native dependencies
- Integration tests: Jest + sql.js (WebAssembly SQLite) — mirrors expo-sqlite behavior in Node environment
- Test files co-located: `src/utils/__tests__/currency.test.ts`, `src/utils/__tests__/date.test.ts`, `src/storage/__tests__/*.test.ts`

**Performance Goals**: CI pipeline completes under 3 minutes (dependency cache + no simulator spin-up)

**Constraints**:
- Tests run in Node.js — cannot import React Native modules directly
- Repository tests must isolate state per test (fresh DB per describe block)
- No 100% coverage requirement — target meaningful coverage of public APIs
- Conventional Commits applied to new commits only; existing history untouched

**Scale/Scope**: ~6 new config files, ~4 test files, ~60-80 test cases

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First, Offline-Capable | PASS | Tooling only; no production code changes |
| II. TypeScript Strict Mode | PASS | ESLint enforces strict TS; no `any` rule added |
| III. Component-Driven UI | PASS | No UI changes |
| IV. Data Integrity | PASS | Integration tests verify constraints; data logic unchanged |
| V. Expo SDK Compliance | PASS | Test-only dependency (sql.js) not bundled in app |

**No violations. Gate passes.**

## Project Structure

### Documentation (this feature)

```text
specs/003-code-quality/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Test case definitions + config schemas
├── contracts/
│   └── commands.md      # CLI command contracts (npm scripts)
├── quickstart.md        # Validation guide
└── checklists/
    └── requirements.md  # 16/16 pass
```

### Source Code Changes (repository root)

```text
.github/
└── workflows/
    └── ci.yml                          # NEW — GitHub Actions pipeline

src/
├── utils/
│   └── __tests__/
│       ├── currency.test.ts            # NEW — unit tests: formatCurrency, parseCurrencyInput
│       └── date.test.ts                # NEW — unit tests: all date utilities
└── storage/
    └── __tests__/
        ├── expenseRepository.test.ts   # NEW — integration tests: expense CRUD + monthly summary
        └── categoryRepository.test.ts  # NEW — integration tests: category CRUD + delete guard

.eslintrc.js                            # NEW — ESLint config (TS + React Native + hooks)
.prettierrc                             # NEW — Prettier config
.eslintignore                           # NEW — ignore node_modules, dist, .expo
jest.config.js                          # NEW — Jest config (ts-jest, test paths, coverage)
jest.setup.ts                           # NEW — global test setup (DB initialization)
package.json                            # UPDATE — add lint/test/format scripts + devDependencies
README.md                               # UPDATE — add CI badge + lint/test commands to README
```

**Structure Decision**: Test files co-located under `__tests__/` alongside the module under test. This is the Jest convention and makes it trivially obvious which tests cover which module.

## Complexity Tracking

> No constitution violations — section intentionally empty.
