# Feature Specification: Expense Tracker Core

**Feature Branch**: `001-expense-tracker-core`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: Personal expense tracking mobile app, 100% offline. Add expenses with amount/category/date/optional description; full CRUD with confirmation; default + custom categories with color/icon; monthly total navigation with per-category breakdown; pie/bar chart auto-updating on data changes. Out of scope: cloud sync, multiple users, income, push notifications, data export.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Log an Expense (Priority: P1)

A user wants to record money they just spent. They open the app, tap "Add Expense", enter the amount, pick a category, optionally adjust the date (defaults to today) and add a description, then save. The expense appears immediately at the top of their expense list.

**Why this priority**: Core value proposition — without this, nothing else works.

**Independent Test**: Can be fully tested by adding a new expense and verifying it appears in the list with correct amount, category, date, and description.

**Acceptance Scenarios**:

1. **Given** the home screen is open, **When** the user taps "Add Expense", enters 45.50, selects "Alimentação", leaves date as today, and saves, **Then** the expense appears first in the list showing R$ 45.50, "Alimentação", today's date.
2. **Given** the add expense form is open, **When** the user enters 0 or a negative number, **Then** the form displays an error "Amount must be greater than zero" and does not save.
3. **Given** the add expense form is open, **When** the user saves without entering an amount, **Then** the form displays a validation error and does not save.
4. **Given** the add expense form is open, **When** the user changes the date to a past date and saves, **Then** the expense is saved with the selected date, not today.
5. **Given** the add expense form is open, **When** the user leaves the description field empty and saves, **Then** the expense is saved successfully without a description.

---

### User Story 2 - View, Edit, and Delete Expenses (Priority: P2)

A user wants to review their recorded expenses, fix a typo in an amount or description, or remove a duplicate entry. They see all expenses ordered newest-first, tap one to edit it, make changes, and save — or tap delete and confirm to remove it.

**Why this priority**: Data correctness is essential for trust in the tool.

**Independent Test**: Can be tested by first adding expenses (US1), then editing one expense and verifying the update, then deleting one with confirmation and verifying it disappears.

**Acceptance Scenarios**:

1. **Given** multiple expenses exist, **When** the user opens the expense list, **Then** expenses appear ordered from most recent to oldest.
2. **Given** an expense is in the list, **When** the user taps it to edit and changes the amount to 60.00 and saves, **Then** the list reflects the updated amount.
3. **Given** an expense is in the list, **When** the user taps delete, **Then** a confirmation dialog appears asking "Delete this expense?".
4. **Given** the delete confirmation dialog is shown, **When** the user confirms, **Then** the expense is removed from the list permanently.
5. **Given** the delete confirmation dialog is shown, **When** the user cancels, **Then** the expense remains unchanged in the list.
6. **Given** the device has no network connection, **When** the user adds, edits, or deletes an expense, **Then** all operations complete successfully and the list reflects the changes.
7. **Given** expenses have been added, **When** the user closes the app completely and reopens it, **Then** all previously saved expenses appear in the list unchanged.

---

### User Story 3 - Manage Categories (Priority: P3)

A user wants to organize expenses into meaningful groups. The app ships with 6 default categories. The user can create a new category with a custom name and a color or icon to distinguish it visually. A category with linked expenses cannot be deleted — the user sees a clear message explaining why.

**Why this priority**: Categories enable all reporting features; defaults cover most cases immediately.

**Independent Test**: Can be tested by viewing the default category list, creating a new category, assigning an expense to it, then attempting to delete the category (blocked) vs. deleting an empty custom category (succeeds).

**Acceptance Scenarios**:

1. **Given** the app is freshly installed, **When** the user opens category management, **Then** 6 default categories are visible: Alimentação, Transporte, Moradia, Lazer, Saúde, Outros.
2. **Given** the category management screen is open, **When** the user creates a new category "Pets" with a color, **Then** "Pets" appears in the category list and is available when adding expenses.
3. **Given** a custom category "Pets" has no linked expenses, **When** the user deletes it, **Then** it is removed from the list.
4. **Given** category "Lazer" has linked expenses, **When** the user attempts to delete it, **Then** deletion is blocked and a message appears: "Cannot delete — this category has linked expenses."
5. **Given** the category form is open, **When** the user saves without entering a name, **Then** an error "Category name is required" is shown.
6. **Given** a category named "Pets" already exists, **When** the user attempts to create another category named "pets" (any case variation), **Then** creation is blocked and a message appears: "A category with this name already exists."

---

### User Story 4 - View Monthly Spending Summary (Priority: P4)

A user wants to understand how much they spent in a given month, broken down by category. They see the current month's total by default and can navigate backward/forward between months. Each category shows its total and the full month total is displayed prominently.

**Why this priority**: Primary insight feature — transforms raw data into actionable information.

**Independent Test**: Can be tested by adding expenses across two months, navigating between months, and verifying totals match the sum of expenses in each month.

**Acceptance Scenarios**:

1. **Given** the summary screen is open, **When** the user views the current month, **Then** the total spent and per-category breakdown for that month are displayed.
2. **Given** the summary screen shows the current month, **When** the user taps the "previous month" control, **Then** the summary updates to show last month's data.
3. **Given** expenses exist in month A but not month B, **When** the user navigates to month B, **Then** all totals show R$ 0.00.
4. **Given** an expense is added in the current month, **When** the user views the monthly summary, **Then** the new expense's amount is included in the total immediately.

---

### User Story 5 - Spending Distribution Chart (Priority: P5)

A user wants a visual breakdown of where their money went in a selected month. A chart (pie or bar) shows the proportion of spending per category. The chart updates automatically without requiring a manual refresh when expenses are added, edited, or removed.

**Why this priority**: Visual representation accelerates comprehension of spending patterns.

**Independent Test**: Can be tested by viewing the chart for a month with multiple categories, then adding an expense in a new category and verifying the chart updates without user action.

**Acceptance Scenarios**:

1. **Given** the current month has expenses across 3 categories, **When** the user views the chart screen, **Then** each category appears as a distinct slice/bar with its proportional value.
2. **Given** the chart is visible, **When** the user adds a new expense in a category, **Then** the chart updates automatically to reflect the new distribution.
3. **Given** the chart is visible, **When** the user deletes an expense, **Then** the chart updates automatically.
4. **Given** the selected month has no expenses, **When** the user views the chart, **Then** an empty state message is shown (e.g., "No expenses this month").
5. **Given** the chart is showing the current month, **When** the user navigates to a different month, **Then** the chart updates to show that month's distribution.

---

### Edge Cases

- What happens when the user edits an expense's category to one that no longer exists (data corruption)?
- What happens when two expenses have the same amount, category, and date (legitimate duplicates must be allowed)?
- What happens when the user navigates to a future month (no expenses exist — show empty state)?
- What happens when a category name already exists and the user tries to create it again (duplicate prevention)?
- How does the app behave when device storage is full and a new expense cannot be saved?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow users to add an expense with: amount (required, > 0), category (required), date (required, defaults to today), description (optional).
- **FR-002**: System MUST reject expense amounts of zero or less with a clear validation message.
- **FR-003**: System MUST display all expenses ordered from most recent to oldest.
- **FR-004**: System MUST allow users to edit any field of an existing expense and persist changes.
- **FR-005**: System MUST require user confirmation before deleting an expense.
- **FR-006**: System MUST permanently delete an expense upon confirmed deletion.
- **FR-007**: System MUST provide 6 default categories on first launch: Alimentação, Transporte, Moradia, Lazer, Saúde, Outros.
- **FR-008**: System MUST allow users to create custom categories with a name and a color or icon.
- **FR-009**: System MUST prevent deletion of any category that has one or more linked expenses, displaying an explanatory message.
- **FR-010**: System MUST allow deletion of custom categories that have no linked expenses.
- **FR-011**: System MUST display total amount spent in a user-selected month.
- **FR-012**: System MUST allow users to navigate to previous and next months on the summary screen.
- **FR-013**: System MUST display per-category spending totals for the selected month.
- **FR-014**: System MUST display a chart (pie or bar) showing spending distribution by category for the selected month.
- **FR-015**: System MUST update the chart automatically when an expense is added, edited, or deleted — without requiring manual refresh.
- **FR-016**: System MUST function entirely offline with no network dependency.
- **FR-017**: System MUST persist all data locally on the device across app restarts.
- **FR-018**: System MUST display an empty state message on the chart when the selected month has no expenses.
- **FR-019**: System MUST prevent creation of duplicate category names (case-insensitive).

### Key Entities

- **Expense**: Represents a single spending record. Key attributes: amount (positive monetary value, greater than zero), category reference, date, optional description, date and time the record was created.
- **Category**: Represents a spending group. Key attributes: name (unique), color or icon identifier, origin flag (default vs. user-created).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can log a new expense in under 30 seconds from app open.
- **SC-002**: All expense data persists correctly across app restarts — zero data loss.
- **SC-003**: Monthly summary totals match the arithmetic sum of all expenses in that month — 100% accuracy.
- **SC-004**: Chart updates reflect expense changes within 1 second of the change being saved, without user-initiated refresh.
- **SC-005**: App is fully usable with no network connection — 100% of features available offline.
- **SC-006**: 100% of new users complete the primary flow (add expense → view in list → see in chart) on first attempt without facilitator assistance in a usability test.

## Assumptions

- Single user — no login, no accounts, no multi-device sync.
- Currency is Brazilian Real (BRL / R$). All amounts are displayed in the format R$ X,XX.
- Default categories cannot be deleted or renamed by users.
- App supports portrait orientation only (per app.json configuration).
- No recurring/scheduled expenses in v1.
- No income tracking — expenses only.
- No budget limits or alerts in v1 (out of scope as described).
- Data deletion is permanent — no recycle bin or undo after confirmed delete.
- "Navigate between months" covers past months freely; future months show empty state.
