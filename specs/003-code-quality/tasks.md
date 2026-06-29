# Tasks: Code Quality & CI Pipeline

**Feature**: specs/003-code-quality/
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)
**Date**: 2026-06-28

---

## Implementation Strategy

MVP = US1 + US2 (style + CI). Unlocks the green badge. US3 + US4 (tests) add credibility. US5 (commits) is applied throughout.

Execution order: Phase 1 → Phase 2 → Phase 3 (US1+US2 parallel) → Phase 4 → Phase 5 → Phase 6.

---

## Phase 1 — Setup: Install Dependencies

**Goal**: All devDependencies installed and importable. No config yet.

- [x] T001 Install ESLint + TypeScript ESLint + React Native plugins: `npx expo install --dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-native eslint-config-prettier` (updates package.json)
- [x] T002 Install Prettier: `npx expo install --dev prettier` (updates package.json)
- [x] T003 Install Jest + ts-jest + types: `npm install --save-dev jest ts-jest @types/jest` (updates package.json)
- [x] T004 Install sql.js for Node-compatible SQLite integration tests: `npm install --save-dev sql.js @types/sql.js` (updates package.json)

---

## Phase 2 — Foundational: Configuration Files

**Goal**: All tooling configured. `npm run lint`, `npm run typecheck`, `npm run test` wired up.

- [x] T005 Create `eslint.config.js` (flat config, ESLint 9) with `@typescript-eslint/recommended`, `react-hooks`, `prettier` rules; ignore `node_modules/`, `.expo/`, `dist/`, `specs/`, `coverage/`
- [x] T006 (merged into T005 — flat config uses `ignores` array, no separate .eslintignore needed)
- [x] T007 Create `.prettierrc` with `singleQuote: true`, `trailingComma: "all"`, `semi: true`, `printWidth: 100`, `tabWidth: 2`
- [x] T008 Create `jest.config.js` with `preset: "ts-jest"`, `testEnvironment: "node"`, `testMatch: ["**/__tests__/**/*.test.ts"]`, `moduleNameMapper` to stub `expo-sqlite` → test adapter
- [x] T009 Add npm scripts to `package.json`: `typecheck`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:coverage`
- [x] T010 Verify `npm run typecheck` exits 0 with zero errors after config changes

---

## Phase 3 — US1: Consistent Code Style

**Story goal**: `npm run lint` and `npm run format:check` both exit 0 on clean checkout.

**Independent test**: Run `npm run lint && npm run format:check` — both exit 0.

- [x] T011 [US1] Run `npm run format` to auto-format all existing `src/**/*.{ts,tsx}` files
- [x] T012 [US1] Run `npm run lint:fix` to auto-fix all auto-fixable ESLint violations
- [x] T013 [US1] Manually fix remaining non-auto-fixable ESLint violations (`Text` unused import in `ExpenseListScreen.tsx`)
- [x] T014 [US1] Verify `npm run format:check` exits 0 (all files formatted)
- [x] T015 [US1] Verify `npm run lint` exits 0 with `--max-warnings 0`

---

## Phase 4 — US2: Automated CI Quality Gate

**Story goal**: Pipeline runs on every push. Typecheck + lint + test jobs appear on GitHub Actions. README badge shows green.

**Independent test**: Push a commit → visit `github.com/<user>/expense-tracker/actions` → three jobs complete green within 3 minutes.

- [x] T016 [US2] Create `.github/workflows/ci.yml` with three parallel jobs: `typecheck` (`tsc --noEmit`), `lint` (`eslint . --max-warnings 0`), `test` (`jest`) — all on `ubuntu-latest`, Node 20, with `actions/cache` on `node_modules`
- [x] T017 [US2] Update `README.md` to add CI badge at top pointing to the `ci.yml` workflow

---

## Phase 5 — US3: Business Logic Unit Tests

**Story goal**: `npm run test -- --testPathPatterns=utils` exits 0, all currency and date cases pass.

**Independent test**: Running `npm test -- --testPathPatterns=utils` reports all 25 test cases green.

- [x] T018 [US3] Create `src/utils/__tests__/currency.test.ts` with 14 test cases covering `formatCurrency` (CUR-01 to CUR-06) and `parseCurrencyInput` (PAR-01 to PAR-08)
- [x] T019 [US3] Create `src/utils/__tests__/date.test.ts` with 11 test cases covering `todayISO`, `monthFilterPattern`, `prevMonth`, `nextMonth`, `formatDateShort`
- [x] T020 [US3] Verify all 25 utility tests green

---

## Phase 6 — US4: Data Layer Integration Tests

**Story goal**: `npm run test -- --testPathPatterns=storage` exits 0, all 15 repository cases pass against real in-memory SQLite.

**Independent test**: Running `npm test -- --testPathPatterns=storage` reports all 15 cases green.

- [x] T021 [US4] Create `src/storage/__tests__/testDb.ts` — in-memory `sql.js` Database with full schema + async wrappers matching expo-sqlite API
- [x] T022 [US4] Create `src/storage/__tests__/expenseRepository.test.ts` with 9 test cases (EXP-01 to EXP-09)
- [x] T023 [US4] Create `src/storage/__tests__/categoryRepository.test.ts` with 6 test cases (CAT-01 to CAT-06)
- [x] T024 [US4] Verify all 15 integration tests green

---

## Phase 7 — Polish: Full Suite Verification

**Goal**: Entire suite green. All contracts satisfied.

- [x] T025 `npm run test` — 40/40 tests pass across 4 suites (zero interference between isolated DB instances)
- [x] T026 `npm run typecheck` — 0 TypeScript errors after all new files added
- [x] T027 `npm run lint` — 0 errors/warnings including test files
- [x] T028 `.gitignore` updated with `coverage/`

---

## Dependencies

```
T001-T004 (install) → T005-T009 (config) → T010 (verify typecheck)
T010 → T011-T015 (US1: style)
T010 → T016-T017 (US2: CI)  ← parallel with US1
T010 → T018-T020 (US3: unit tests)  ← parallel with US1+US2
T021 → T022-T023 (US4: integration tests — testDb required first)
T022-T023 → T024 (verify)
T024 → T025-T028 (final verification)
```

---

## Task Count

| Phase | Story | Tasks | Status |
|-------|-------|-------|--------|
| 1 — Setup | — | T001–T004 (4) | ✅ done |
| 2 — Foundational | — | T005–T010 (6) | ✅ done |
| 3 — Style | US1 | T011–T015 (5) | ✅ done |
| 4 — CI | US2 | T016–T017 (2) | ✅ done |
| 5 — Unit Tests | US3 | T018–T020 (3) | ✅ done |
| 6 — Integration Tests | US4 | T021–T024 (4) | ✅ done |
| 7 — Polish | — | T025–T028 (4) | ✅ done |
| **Total** | | **28** | **28/28** |
