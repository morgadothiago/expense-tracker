# Quickstart Validation Guide: Expense Tracker Core

**Feature**: specs/001-expense-tracker-core/
**Date**: 2026-06-28

Use this guide to validate each user story works end-to-end after implementation.
For data model details see [data-model.md](./data-model.md).
For screen contracts see [contracts/screens.md](./contracts/screens.md).

---

## Prerequisites

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start
# or target platform directly:
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

Requires: Node.js, Expo CLI, and either Xcode (iOS) or Android Studio (Android).

---

## Validation: User Story 1 — Log an Expense

**Goal**: Add a new expense and verify it appears in the list.

1. Open the app → Expenses tab
2. Tap "Add Expense"
3. Enter amount: `45,50`
4. Select category: "Alimentação"
5. Leave date as today (default)
6. Leave description empty
7. Tap "Save"

**Expected**: Expense "R$ 45,50 · Alimentação · [today]" appears at the top of the list.

**Validation — amount > 0 rule**:
1. Tap "Add Expense"
2. Enter amount: `0`
3. Tap "Save"
4. **Expected**: Error message shown; expense NOT saved.

---

## Validation: User Story 2 — Edit and Delete

**Goal**: Modify an existing expense and delete another.

**Edit**:
1. Tap any expense in the list
2. Change amount to `60,00`
3. Tap "Save"
4. **Expected**: List reflects R$ 60,00 for that expense.

**Delete**:
1. Tap any expense in the list
2. Tap "Delete"
3. **Expected**: Confirmation dialog appears.
4. Tap "Confirm"
5. **Expected**: Expense removed from list.

**Delete cancel**:
1. Tap "Delete" on an expense
2. Tap "Cancel" on dialog
3. **Expected**: Expense remains unchanged.

**Offline validation**:
1. Enable airplane mode on device
2. Add a new expense
3. **Expected**: Expense saves and appears in list without errors.

**Persistence validation**:
1. Add an expense
2. Close the app completely (swipe away from recents)
3. Reopen the app
4. **Expected**: Previously added expense still appears.

---

## Validation: User Story 3 — Categories

**Goal**: Verify default categories exist, create a custom one, test deletion rules.

**Defaults**:
1. Open Category Management (header button on Expenses tab)
2. **Expected**: 6 categories visible — Alimentação, Transporte, Moradia, Lazer, Saúde, Outros.

**Create category**:
1. Tap "New Category"
2. Enter name: "Pets", pick a color
3. Tap "Save"
4. **Expected**: "Pets" appears in category list and is available when adding an expense.

**Block delete — has expenses**:
1. Add an expense with category "Pets"
2. Attempt to delete "Pets"
3. **Expected**: Error message "Cannot delete — this category has linked expenses."

**Allow delete — empty category**:
1. Create a new category "Teste" with no expenses
2. Delete "Teste"
3. **Expected**: "Teste" removed from list.

**Duplicate name**:
1. Attempt to create a category named "pets" (lowercase)
2. **Expected**: Error "A category with this name already exists."

---

## Validation: User Story 4 — Monthly Summary

**Goal**: Verify month totals and navigation.

**Setup**: Add 3 expenses in the current month across different categories and 1 expense in the previous month.

1. Open Summary tab
2. **Expected**: Current month shown; total matches sum of all current-month expenses; per-category breakdown visible.
3. Tap "previous month" control
4. **Expected**: Summary updates to previous month, showing only the 1 expense added there.
5. Navigate to a future month
6. **Expected**: Total shows R$ 0,00 and per-category list is empty or shows empty state.

---

## Validation: User Story 5 — Spending Chart

**Goal**: Verify chart renders and auto-updates.

**Setup**: Have 2+ categories with expenses in the current month.

1. Open Summary tab
2. **Expected**: Chart shows each category as a distinct slice/bar with proportional values.

**Auto-update**:
1. Keep Summary tab visible (or navigate to it)
2. Add a new expense in Expenses tab
3. Return to Summary tab
4. **Expected**: Chart updates to reflect the new expense — no manual refresh needed.

**Delete auto-update**:
1. Delete an expense from Expenses tab
2. Check Summary tab
3. **Expected**: Chart updated.

**Empty state**:
1. Navigate to a month with no expenses
2. **Expected**: Chart area shows message "No expenses this month" (or similar).

---

## Success Criteria Verification

| Criterion | How to verify |
|-----------|---------------|
| SC-001: log expense < 30s | Time from app open to expense appearing in list |
| SC-002: zero data loss | Persistence validation above |
| SC-003: 100% totals accuracy | Compare Summary tab total to manual sum of expenses |
| SC-004: chart updates < 1s | Add expense, switch to Summary tab, observe update speed |
| SC-005: fully offline | Airplane mode test above |
| SC-006: no tutorial needed | New user completes US1 flow without help |
