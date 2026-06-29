---

description: "Task list for Expense Tracker Core implementation"
---

# Tasks: Expense Tracker Core

**Input**: Design documents from `specs/001-expense-tracker-core/`

**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/screens.md ✅ quickstart.md ✅

**Tests**: Not requested in spec — no test tasks included.

**Organization**: Tasks grouped by user story for independent implementation and delivery.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Paths relative to repository root

---

## Phase 1: Setup

**Purpose**: Install packages and create foundational structure + utilities

- [x] T001 Install npm dependencies: `expo-sqlite`, `react-native-gifted-charts`, `@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-safe-area-context`, `react-native-screens`
- [x] T002 [P] Create src/ directory tree: `src/components/common`, `src/components/expenses`, `src/components/categories`, `src/components/charts`, `src/screens`, `src/hooks`, `src/storage`, `src/context`, `src/navigation`, `src/types`, `src/utils`
- [x] T003 [P] Create TypeScript interfaces in `src/types/index.ts` (Category, Expense, CategorySummary, MonthlySummary — from data-model.md)
- [x] T004 [P] Create currency utility in `src/utils/currency.ts` (centavos→R$ display via `Intl.NumberFormat('pt-BR')`, string input→centavos parser)
- [x] T005 [P] Create date utility in `src/utils/date.ts` (today as YYYY-MM-DD, month navigation +1/-1, month filter string YYYY-MM-%)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: SQLite schema, default seed, shared state, navigation shell, app entry point

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Create SQLite schema init in `src/storage/database.ts` (enable FK pragma, CREATE TABLE categories + expenses per data-model.md DDL, CREATE INDEX on expenses.date and expenses.category_id)
- [x] T007 Create `src/storage/categoryRepository.ts` with `seedDefaultCategories()` — insert the 6 defaults (Alimentação/Transporte/Moradia/Lazer/Saúde/Outros with colors from data-model.md) only if categories table is empty
- [x] T008 Create `src/context/AppContext.tsx` with `expenseVersion: number` state and `refreshExpenses()` incrementer — provides reactive trigger for chart/summary auto-update (FR-015)
- [x] T009 Create `src/navigation/AppNavigator.tsx` — bottom tabs (Expenses tab, Summary tab), each with a NativeStack; declare all 5 screen routes with correct param types (see contracts/screens.md)
- [x] T010 Update `App.tsx` — wrap with `SQLiteProvider` (calls database init + seed), `AppContextProvider`, `SafeAreaProvider`, mount `AppNavigator`

**Checkpoint**: App launches, SQLite initializes, default categories seeded, navigation shell visible

---

## Phase 3: User Story 1 — Log an Expense (Priority: P1) 🎯 MVP

**Goal**: User can add a new expense; it persists locally and survives app restart.

**Independent Test**: Add R$ 45,50 to "Alimentação" → close app → reopen → expense present (quickstart.md US1 + persistence scenario)

### Implementation for User Story 1

- [x] T011 [P] [US1] Add `addExpense(data)` to `src/storage/expenseRepository.ts` (INSERT into expenses, amount as integer centavos, date as YYYY-MM-DD, returns inserted id)
- [x] T012 [P] [US1] Add `getCategories()` to `src/storage/categoryRepository.ts` (SELECT all, order: defaults first then user-created by name)
- [x] T013 [US1] Create `src/hooks/useCategories.ts` — loads categories via `getCategories()`, exposes `categories` array (read-only for US1; extended in US3)
- [x] T014 [US1] Create `src/hooks/useExpenses.ts` — exposes `addExpense(data)` that calls repository then calls `refreshExpenses()` from AppContext
- [x] T015 [US1] Create `src/components/categories/CategoryPicker.tsx` — scrollable list/picker of Category items with color swatch; calls `onSelect(category)`
- [x] T016 [US1] Create `src/components/expenses/ExpenseForm.tsx` — fields: amount (text input, parsed to centavos), CategoryPicker, date picker (defaults today), description (optional text); validates amount > 0 and category required before calling `onSubmit`; shows inline validation errors
- [x] T017 [US1] Create `src/screens/AddExpenseScreen.tsx` — mounts ExpenseForm with empty initial values; on submit calls `addExpense` then navigates back
- [x] T018 [US1] Add "Add Expense" FAB/button to `src/screens/ExpenseListScreen.tsx` placeholder (stub screen is fine) that navigates to AddExpenseScreen; register route in AppNavigator

**Checkpoint**: User Story 1 fully functional — add expense, persist across restart (quickstart.md US1 scenarios pass)

---

## Phase 4: User Story 2 — View, Edit, and Delete Expenses (Priority: P2)

**Goal**: User sees all expenses newest-first, can edit any field, can delete with confirmation; works offline.

**Independent Test**: Add 3 expenses → list shows newest first → edit middle expense → delete last → verify state (quickstart.md US2 scenarios)

### Implementation for User Story 2

- [x] T019 [P] [US2] Add `getExpenses()` to `src/storage/expenseRepository.ts` (SELECT expenses JOIN categories ORDER BY date DESC, id DESC; return typed array with joined Category)
- [x] T020 [P] [US2] Add `updateExpense(id, data)` and `deleteExpense(id)` to `src/storage/expenseRepository.ts`
- [x] T021 [US2] Expand `src/hooks/useExpenses.ts` — add `expenses` list (loaded from `getExpenses()`, re-fetched on `expenseVersion` change), `updateExpense`, `deleteExpense` (each calls `refreshExpenses()` after)
- [x] T022 [P] [US2] Create `src/components/categories/CategoryBadge.tsx` — colored pill with category name
- [x] T023 [P] [US2] Create `src/components/common/ConfirmDialog.tsx` — modal with message, "Confirm" and "Cancel" buttons; props: `visible`, `message`, `onConfirm`, `onCancel`
- [x] T024 [P] [US2] Create `src/components/common/EmptyState.tsx` — centered message + optional icon; prop: `message: string`
- [x] T025 [US2] Create `src/components/expenses/ExpenseItem.tsx` — row showing amount (R$ formatted), CategoryBadge, date, description preview; touchable → navigates to EditExpenseScreen
- [x] T026 [US2] Implement `src/screens/ExpenseListScreen.tsx` — FlatList of ExpenseItem, EmptyState when empty, "Add Expense" button (→ AddExpenseScreen), "Categories" header button (→ CategoryManagementScreen)
- [x] T027 [US2] Create `src/screens/EditExpenseScreen.tsx` — receives `expenseId` param, loads expense, pre-fills ExpenseForm; on submit calls `updateExpense`; delete button shows ConfirmDialog then calls `deleteExpense` and navigates back
- [x] T028 [US2] Register EditExpenseScreen in `src/navigation/AppNavigator.tsx` with typed `expenseId: number` param

**Checkpoint**: Full CRUD operational; offline mode verified; persistence verified; newest-first order correct (quickstart.md US2 scenarios pass)

---

## Phase 5: User Story 3 — Manage Categories (Priority: P3)

**Goal**: 6 defaults visible on install; user creates custom categories; deletion blocked when category has expenses.

**Independent Test**: Verify 6 defaults → create "Pets" → add expense to "Pets" → delete attempt blocked → create duplicate "pets" blocked → delete empty category succeeds (quickstart.md US3 scenarios)

### Implementation for User Story 3

- [x] T029 [P] [US3] Add `createCategory(data)`, `deleteCategory(id)`, `getCategoryExpenseCount(id)` to `src/storage/categoryRepository.ts` (`deleteCategory` checks `is_default` and expense count before DELETE; throws if blocked)
- [x] T030 [US3] Expand `src/hooks/useCategories.ts` — add `createCategory(data)` (validates unique name, calls repository), `deleteCategory(id)` (catches block error, returns user-facing message)
- [x] T031 [US3] Create `src/screens/CategoryManagementScreen.tsx` — scrollable list of categories with CategoryBadge, delete button per user-created category (ConfirmDialog + guard message if blocked), inline "New Category" form (name text input + color picker + optional icon input)
- [x] T032 [US3] Register CategoryManagementScreen in `src/navigation/AppNavigator.tsx`; add "Categories" header button to ExpenseListScreen (T026)

**Checkpoint**: US3 independently testable — all quickstart.md US3 scenarios pass

---

## Phase 6: User Story 4 — Monthly Spending Summary (Priority: P4)

**Goal**: User sees total spent and per-category breakdown for any navigated month.

**Independent Test**: Add expenses across 2 months → navigate between months → totals match manual sum → future month shows R$ 0,00 (quickstart.md US4 scenarios)

### Implementation for User Story 4

- [x] T033 [P] [US4] Add `getMonthlySummary(year, month)` to `src/storage/expenseRepository.ts` (SELECT SUM(amount) total, category_id, GROUP BY category_id WHERE date LIKE 'YYYY-MM-%'; JOIN categories; return MonthlySummary shape)
- [x] T034 [US4] Create `src/hooks/useMonthlySummary.ts` — accepts `(year: number, month: number)`; re-fetches when `expenseVersion` changes (from AppContext); returns `MonthlySummary | null` + `isLoading`
- [x] T035 [US4] Create `src/components/common/MonthNavigator.tsx` — prev/next chevron buttons + formatted month/year label (e.g. "Junho 2026"); props: `year`, `month`, `onPrev`, `onNext`
- [x] T036 [US4] Create `src/screens/MonthlySummaryScreen.tsx` — local state `selectedYear/Month` (default: current); MonthNavigator; total amount display (R$ formatted); per-category list (CategoryBadge + amount); EmptyState when no expenses

**Checkpoint**: US4 independently testable — navigation and totals correct (quickstart.md US4 scenarios pass)

---

## Phase 7: User Story 5 — Spending Distribution Chart (Priority: P5)

**Goal**: Pie or bar chart shows category distribution for selected month; auto-updates when data changes.

**Independent Test**: View chart with 2+ categories → add expense in new category → chart updates without manual refresh → navigate to empty month → EmptyState shown (quickstart.md US5 scenarios)

### Implementation for User Story 5

- [x] T037 [US5] Create `src/components/charts/SpendingChart.tsx` — renders pie or bar chart via `react-native-gifted-charts` using `CategorySummary[]` prop; each slice/bar colored by `category.color`; shows EmptyState if data is empty
- [x] T038 [US5] Integrate SpendingChart into `src/screens/MonthlySummaryScreen.tsx` — pass `summary.byCategory` from `useMonthlySummary`; chart re-renders automatically when `expenseVersion` increments (AppContext drives reactivity, FR-015)

**Checkpoint**: All 5 user stories independently functional and testable — quickstart.md US5 scenarios pass

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Quality sweep across all stories

- [x] T039 [P] Audit `strict: true` compliance across all `src/` files — fix any implicit `any`, missing return types, or non-null assertions without justification
- [x] T040 Run all quickstart.md scenarios end-to-end — verify SC-001 (< 30s to log), SC-002 (persistence), SC-003 (totals accuracy), SC-004 (chart update < 1s), SC-005 (airplane mode), SC-006 (primary flow without help)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately; T002–T005 all run in parallel
- **Foundational (Phase 2)**: Requires Phase 1 — BLOCKS all user stories; T007–T009 can start once T006 done
- **US1 (Phase 3)**: Requires Phase 2 — T011+T012 parallel; T013–T018 sequential after T011/T012
- **US2 (Phase 4)**: Requires Phase 2 + US1 complete — T019+T020+T022+T023+T024 parallel; T025+ sequential
- **US3 (Phase 5)**: Requires Phase 2 complete — can start concurrently with US2
- **US4 (Phase 6)**: Requires Phase 2 + US2 complete (needs expense data + AppContext refresh)
- **US5 (Phase 7)**: Requires US4 complete (needs MonthlySummaryScreen and useMonthlySummary)
- **Polish (Phase 8)**: Requires all user stories complete

### Within Each User Story

- Repository functions before hooks
- Hooks before screens
- Shared components [P] can run in parallel with repository work
- Screen implementation after all its dependencies are done

---

## Parallel Example: User Story 2

```bash
# Launch together (different files, no dependencies):
Task T019: Add getExpenses() to expenseRepository.ts
Task T020: Add updateExpense/deleteExpense to expenseRepository.ts
Task T022: Create CategoryBadge.tsx
Task T023: Create ConfirmDialog.tsx
Task T024: Create EmptyState.tsx

# After T019+T020 done:
Task T021: Expand useExpenses hook

# After T021+T022+T023+T024 done:
Task T025: Create ExpenseItem.tsx
Task T026: Implement ExpenseListScreen.tsx
Task T027: Create EditExpenseScreen.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T005)
2. Complete Phase 2: Foundational (T006–T010) — CRITICAL, blocks everything
3. Complete Phase 3: User Story 1 (T011–T018)
4. **STOP and VALIDATE**: Add expense → close app → reopen → verify persistence
5. Demo: basic expense logging works offline ✅

### Incremental Delivery

1. Setup + Foundational → app shell launches
2. US1 complete → can add expenses (MVP)
3. US2 complete → full CRUD, proper list view
4. US3 complete → category management
5. US4 complete → monthly insights
6. US5 complete → visual chart
7. Polish → production quality

---

## Notes

- [P] tasks = different files, no blocking dependencies — safe to run in parallel
- [Story] label maps each task to its user story for traceability
- Amounts: always pass as integers (centavos) to repository; parse from user string in ExpenseForm (T016)
- AppContext `expenseVersion` is the single reactive signal — increment on every write; useMonthlySummary and useExpenses both subscribe to it
- Default categories: `is_default = 1` — never deletable regardless of expense count
- Commit after each checkpoint (end of each phase)
