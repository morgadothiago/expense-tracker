# Screen Contracts: Expense Tracker Core

**Feature**: specs/001-expense-tracker-core/
**Date**: 2026-06-28

Documents navigation params, inputs, outputs, and responsibilities for each screen.
Data types reference [data-model.md](../data-model.md).

---

## Navigation Structure

```
AppNavigator (Bottom Tabs)
├── Tab 1: Expenses
│   └── ExpensesStack (NativeStack)
│       ├── ExpenseListScreen          [root]
│       ├── AddExpenseScreen
│       ├── EditExpenseScreen
│       └── CategoryManagementScreen
└── Tab 2: Summary
    └── SummaryStack (NativeStack)
        └── MonthlySummaryScreen       [root]
```

---

## Screen: ExpenseListScreen

**Route**: `ExpensesStack / ExpenseList` (stack root)

**Navigation Params**: none

**Responsibilities**:
- Display all expenses ordered newest-first (FR-003)
- Entry point to Add (→ AddExpenseScreen) and Edit (→ EditExpenseScreen)
- Entry point to Category Management via header button (→ CategoryManagementScreen)
- Show empty state when no expenses exist

**Outputs (navigates to)**:

| Action | Destination | Params passed |
|--------|-------------|---------------|
| Tap "Add Expense" button | AddExpenseScreen | none |
| Tap expense row | EditExpenseScreen | `{ expenseId: number }` |
| Tap "Categories" header button | CategoryManagementScreen | none |

**Data consumed**: `Expense[]` with joined `Category` (for display of category name + color)

---

## Screen: AddExpenseScreen

**Route**: `ExpensesStack / AddExpense`

**Navigation Params**: none

**Responsibilities**:
- Render ExpenseForm with empty initial values (date defaults to today)
- Validate and save new expense (FR-001, FR-002)
- Navigate back to ExpenseListScreen on success

**Form Fields**:

| Field       | Required | Default | Validation               |
|-------------|----------|---------|--------------------------|
| amount      | yes      | empty   | > 0, numeric             |
| category_id | yes      | none    | must select from list    |
| date        | yes      | today   | valid calendar date      |
| description | no       | empty   | max 500 chars            |

**Outputs (navigates to)**:

| Action | Destination | Notes |
|--------|-------------|-------|
| Save success | back (ExpenseListScreen) | expense added, list refreshes |
| Cancel / back | back (ExpenseListScreen) | no changes |

---

## Screen: EditExpenseScreen

**Route**: `ExpensesStack / EditExpense`

**Navigation Params**: `{ expenseId: number }`

**Responsibilities**:
- Load existing expense by `expenseId`
- Render ExpenseForm pre-populated with current values
- Validate and save edits (FR-004)
- Offer delete with confirmation (FR-005, FR-006)
- Navigate back on success or cancellation

**Outputs (navigates to)**:

| Action | Destination | Notes |
|--------|-------------|-------|
| Save success | back (ExpenseListScreen) | expense updated, list refreshes |
| Delete confirmed | back (ExpenseListScreen) | expense removed, list refreshes |
| Cancel / back | back (ExpenseListScreen) | no changes |

---

## Screen: CategoryManagementScreen

**Route**: `ExpensesStack / CategoryManagement`

**Navigation Params**: none

**Responsibilities**:
- List all categories (defaults first, then user-created) (FR-007)
- Show visual indicator (color/icon) per category
- Allow creation of new category with name + color (FR-008)
- Allow deletion of user-created categories with no linked expenses (FR-010)
- Block deletion of categories with linked expenses; show explanatory message (FR-009)
- Block deletion of default categories

**Form Fields (new category)**:

| Field | Required | Validation |
|-------|----------|------------|
| name  | yes      | non-empty, unique (case-insensitive), max 50 chars |
| color | yes      | valid hex color |
| icon  | no       | optional emoji or icon key |

**Outputs**: no navigation away (modal-style or inline form)

---

## Screen: MonthlySummaryScreen

**Route**: `SummaryStack / MonthlySummary` (stack root)

**Navigation Params**: none (opens to current month by default)

**Responsibilities**:
- Display month navigator (prev/next) (FR-012)
- Display total spent for selected month (FR-011)
- Display per-category breakdown for selected month (FR-013)
- Display spending distribution chart (pie or bar) (FR-014)
- Chart auto-updates when data changes (FR-015)
- Show empty state when selected month has no expenses (FR-018)

**Internal State**:

| State | Type | Initial value |
|-------|------|---------------|
| selectedYear | number | current year |
| selectedMonth | number (1–12) | current month |

**Data consumed**: `MonthlySummary` (totalAmount + byCategory[]) derived from expenses in selected month

---

## Component: ExpenseForm (shared)

Used by both AddExpenseScreen and EditExpenseScreen.

**Props**:

| Prop | Type | Description |
|------|------|-------------|
| initialValues | Partial\<ExpenseFormValues\> | pre-fill for edit; empty for add |
| onSubmit | (values: ExpenseFormValues) => Promise\<void\> | called on valid save |
| onDelete | (() => void) \| undefined | shown as delete button if provided (edit only) |
| isLoading | boolean | disables form during save |

```typescript
interface ExpenseFormValues {
  amount: string;        // user-entered string, parsed to centavos on submit
  categoryId: number | null;
  date: string;          // 'YYYY-MM-DD'
  description: string;
}
```

---

## Hook Contracts

### useExpenses()

```typescript
interface UseExpensesReturn {
  expenses: (Expense & { category: Category })[];
  addExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>;
  updateExpense: (id: number, data: Partial<Omit<Expense, 'id' | 'createdAt'>>) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
  isLoading: boolean;
}
```

### useCategories()

```typescript
interface UseCategoriesReturn {
  categories: Category[];
  addCategory: (data: Omit<Category, 'id' | 'createdAt' | 'isDefault'>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;  // throws if has expenses or isDefault
  isLoading: boolean;
}
```

### useMonthlySummary(year: number, month: number)

```typescript
interface UseMonthlySummaryReturn {
  summary: MonthlySummary | null;
  isLoading: boolean;
}
```
