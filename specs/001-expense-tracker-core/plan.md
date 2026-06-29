# Implementation Plan: Expense Tracker Core

**Branch**: `001-expense-tracker-core` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-expense-tracker-core/spec.md`

## Summary

Build a 100% offline personal expense tracking mobile app with Expo 56 + TypeScript. Core flows: add/edit/delete expenses linked to categories, browse expenses newest-first, view monthly totals per category, and see a live-updating spending distribution chart. All data persists locally via expo-sqlite. No network dependency.

## Technical Context

**Language/Version**: TypeScript ~6.0.3 (strict mode, already configured)

**Primary Dependencies**:
- Expo SDK ~56.0.12 / React Native 0.85.3 / React 19.2.3 (existing)
- `expo-sqlite` — local relational storage (categories ↔ expenses)
- `@react-navigation/native` v7 + `@react-navigation/bottom-tabs` + `@react-navigation/native-stack`
- `react-native-gifted-charts` — pie/bar chart, Expo managed workflow compatible
- `react-native-safe-area-context` + `react-native-screens` (React Navigation peers)

**Storage**: expo-sqlite (relational, enables category FK constraint enforcement)

**Testing**: Optional per spec — no test framework added in v1

**Target Platform**: iOS + Android (portrait). Web: best-effort (expo-sqlite web support via wa-sqlite in Expo 56)

**Project Type**: Mobile app (Expo managed workflow, single project)

**Performance Goals**: Expense save < 300ms; chart update < 1s after save; list scroll at 60fps

**Constraints**: 100% offline; no cloud sync; Expo managed workflow only (no ejection); amounts stored as integers (centavos) internally

**Scale/Scope**: Single user; ~5 screens; up to ~10,000 expense records supported without pagination issues

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First, Offline-Capable | ✅ PASS | expo-sqlite stores all data locally; zero network calls in any feature |
| II. TypeScript Strict Mode | ✅ PASS | `tsconfig.json` already has `"strict": true`; no `any` permitted |
| III. Component-Driven UI | ✅ PASS | Screens are thin orchestrators; logic in hooks; reusable components extracted |
| IV. Data Integrity | ✅ PASS | Amounts stored as integers (centavos); FK constraint on categoryId; soft-conceptual delete with confirmation |
| V. Expo SDK Compliance | ✅ PASS | All APIs from expo.dev/versions/v56.0.0; no deprecated or ejection-requiring APIs |

**No violations. Gate passes.**

## Project Structure

### Documentation (this feature)

```text
specs/001-expense-tracker-core/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── screens.md       # Navigation params + screen contracts
└── tasks.md             # Phase 2 output (/speckit-tasks — not created here)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── common/
│   │   ├── ConfirmDialog.tsx       # reusable delete confirmation
│   │   ├── EmptyState.tsx          # empty list/chart message
│   │   └── MonthNavigator.tsx      # prev/next month control
│   ├── expenses/
│   │   ├── ExpenseItem.tsx         # single row in list
│   │   └── ExpenseForm.tsx         # shared add/edit form
│   ├── categories/
│   │   ├── CategoryBadge.tsx       # color/icon pill
│   │   └── CategoryPicker.tsx      # picker used in ExpenseForm
│   └── charts/
│       └── SpendingChart.tsx       # pie or bar chart wrapper
├── screens/
│   ├── ExpenseListScreen.tsx       # US1 + US2 — main list
│   ├── AddExpenseScreen.tsx        # US1 — add form
│   ├── EditExpenseScreen.tsx       # US2 — edit form (reuses ExpenseForm)
│   ├── CategoryManagementScreen.tsx # US3 — list + create + delete
│   └── MonthlySummaryScreen.tsx    # US4 + US5 — totals + chart
├── navigation/
│   └── AppNavigator.tsx            # bottom tabs + nested stacks
├── hooks/
│   ├── useExpenses.ts              # CRUD + list query
│   ├── useCategories.ts            # CRUD + default seed check
│   └── useMonthlySummary.ts        # totals + per-category breakdown for month
├── storage/
│   ├── database.ts                 # SQLite init, schema migration
│   ├── expenseRepository.ts        # expense CRUD operations
│   └── categoryRepository.ts      # category CRUD operations
├── context/
│   └── AppContext.tsx              # shared reactive state (triggers chart re-render)
├── types/
│   └── index.ts                    # Expense, Category, MonthlySummary interfaces
└── utils/
    ├── currency.ts                 # centavos ↔ R$ X,XX display
    └── date.ts                     # ISO date helpers, month navigation
```

**Structure Decision**: Single Expo project. All source under `src/`. No backend. No separate test directory in v1. Navigation at `src/navigation/`. Storage layer isolated at `src/storage/` so it can be swapped independently.

## Complexity Tracking

> No constitution violations — section left intentionally empty.
