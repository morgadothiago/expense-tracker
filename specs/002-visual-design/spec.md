# Feature Specification: Visual Design & UI Polish

**Feature Branch**: `002-visual-design`

**Created**: 2026-06-28

**Status**: Draft

**Input**: Define visual design and responsive layout for all screens of the personal expense tracking app: expense list, add/edit form, categories screen, monthly summary/chart screen. Includes responsive behavior across phone sizes, visual hierarchy, empty states, loading states, and category visual identity (colors/icons).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate the App Visually (Priority: P1)

A new user opens the app and immediately understands what it does and how to navigate it. The visual hierarchy guides them: the most important action (add expense) is prominent, the tab bar is clear, and each screen title communicates its purpose without explanation.

**Why this priority**: First impression and usability — users decide whether to keep an app within seconds.

**Independent Test**: A person unfamiliar with the app opens it and, within 10 seconds, can identify: where to add a new expense, where to view their spending summary, and what the categories represent visually.

**Acceptance Scenarios**:

1. **Given** the app is open on the Expenses tab, **When** the user scans the screen, **Then** the "Add Expense" action is immediately visible and clearly distinguishable as the primary action.
2. **Given** the user is on any tab, **When** they look at the bottom navigation, **Then** they can identify each tab by its label and icon without ambiguity.
3. **Given** a category badge is visible, **When** the user sees it, **Then** the color and optional icon make the category instantly recognizable without needing to read the name.
4. **Given** the user is on any screen, **When** they view the content, **Then** the most important information (total amount, expense amount) is visually dominant over secondary information (date, description).

---

### User Story 2 - View Expense List with Clear Visual Hierarchy (Priority: P1)

A user opens the Expenses tab and sees their expenses in a clean, scannable list. Each item shows amount prominently, followed by category badge and date. Long lists remain fast and readable. The screen adapts correctly to different phone screen widths without content being cut off or over-stretched.

**Why this priority**: This is the most frequently visited screen — it must be fast to scan and comfortable to read.

**Independent Test**: View a list of 10 expenses on both a small phone (320pt wide) and a large phone (430pt wide). All content readable, no horizontal overflow, amounts legible at a glance.

**Acceptance Scenarios**:

1. **Given** the expense list has items, **When** the user views it, **Then** the expense amount is the largest text element on each row, making it scannable at a glance.
2. **Given** the list has more than 10 items, **When** the user scrolls, **Then** scroll performance is smooth with no visible lag or jank.
3. **Given** the list is empty, **When** the user views the Expenses tab, **Then** an encouraging empty state is shown with a clear visual cue and message guiding the user to add their first expense.
4. **Given** the screen is loading data, **When** the user opens the tab, **Then** a loading indicator is shown in place of the list until data is ready.
5. **Given** a phone with a small screen (320pt width), **When** the list is displayed, **Then** all expense row content fits within the screen width with no horizontal clipping.

---

### User Story 3 - Use Add/Edit Form Comfortably (Priority: P2)

A user fills in the expense form. The form fields are well-spaced for touch targets, the category picker is visually clear about which category is selected, the date field is unambiguous, and validation errors appear close to the offending field in a visible color. The keyboard does not obscure the Save button.

**Why this priority**: Form usability directly affects how quickly users can log expenses.

**Independent Test**: Complete the add expense flow on a small phone with the keyboard visible. The Save button must remain reachable. All validation errors must be visible without scrolling past the error.

**Acceptance Scenarios**:

1. **Given** the add expense form is open, **When** the keyboard appears, **Then** the form scrolls so the active field and the Save button remain accessible.
2. **Given** a category is selected in the picker, **When** the user views the picker, **Then** the selected category is visually distinguished from unselected ones (border, indicator, or scale change).
3. **Given** the user submits the form with an invalid amount, **When** the error appears, **Then** it is shown in red directly below the amount field with a clear, readable message.
4. **Given** the form is in a loading/saving state, **When** the user taps Save, **Then** the Save button shows a visual loading indicator and cannot be tapped again (prevents double submission).
5. **Given** the form is open on any phone size, **When** the user views all fields, **Then** all touch targets (inputs, category items, Save button) are at least 44pt tall.

---

### User Story 4 - Manage Categories with Visual Identity (Priority: P2)

A user views the category list. Each category is displayed with its assigned color as a prominent visual element, not just as a text label. Default categories are visually distinct from user-created ones (e.g., subtle lock icon or different styling). Creating a new category, the color picker shows enough contrast between options to make a clear choice.

**Why this priority**: Category colors are the primary visual language of the whole app — they appear in the list, chart, and summary. They must be immediately meaningful.

**Independent Test**: View the category list and, without reading labels, identify which categories are default vs. user-created. Choose a color for a new category using only the color swatches.

**Acceptance Scenarios**:

1. **Given** the category list is displayed, **When** the user scans it, **Then** each category's color fills a clearly visible area (not just a small dot), making the palette immediately legible.
2. **Given** the category list contains both default and user-created categories, **When** displayed, **Then** default categories have a visual indicator that distinguishes them from user-created ones.
3. **Given** the color picker for a new category is shown, **When** the user views it, **Then** at least 8 color options are visible simultaneously without scrolling, each large enough to tap accurately (≥ 32pt).
4. **Given** a category cannot be deleted (default or has linked expenses), **When** the user sees it, **Then** the delete affordance is either hidden or visually disabled — not just fail silently after tap.
5. **Given** the form for a new category is open, **When** the user views it, **Then** a live preview of how the new category badge will look updates as the user types the name and selects a color.

---

### User Story 5 - Read Monthly Summary and Chart (Priority: P2)

A user opens the Summary tab. The total amount for the month is visually dominant. The month navigation controls are easy to tap. The chart is large enough to read proportions clearly, and the legend below it maps colors to category names with their totals. On a small phone, all this content is accessible via vertical scrolling without anything being truncated.

**Why this priority**: The Summary screen is the insight layer — if it is visually cluttered or hard to read, the whole reporting value is lost.

**Independent Test**: View the Summary screen on a small phone (320pt) with 5 categories. All chart slices, legend entries, and the month total are fully readable. Month navigation tappable without precision difficulty.

**Acceptance Scenarios**:

1. **Given** the summary screen is open, **When** the user views it, **Then** the monthly total amount is the largest numeric element on the screen, visually separated from the per-category breakdown.
2. **Given** the chart is displayed with 3+ categories, **When** the user reads it, **Then** each slice/bar is visually distinguishable using the category color, and the legend directly below maps each color to its category name and amount.
3. **Given** the user is on the Summary screen, **When** they view the month navigation, **Then** the previous and next controls have a tap area of at least 44×44pt.
4. **Given** the selected month has no expenses, **When** the chart area renders, **Then** an illustrated or icon-based empty state is shown instead of a blank space, with a message like "Nenhum gasto neste mês."
5. **Given** the screen is viewed on a 320pt-wide phone, **When** the user scrolls through the summary, **Then** all content — total, category rows, chart, legend — is readable without horizontal clipping.

---

### Edge Cases

- What happens to very long category names (> 15 characters) inside the badge — does it truncate cleanly?
- What happens when an expense amount is very large (e.g., R$ 10.000,00) — does it fit in the list row without clipping?
- What does the category picker look like when there are 15+ categories — does it scroll without breaking layout?
- What happens on an iPad-sized screen (768pt) — does the layout stretch gracefully or look too sparse?
- What does the chart legend look like when all categories have similar colors — is it still distinguishable?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Every screen MUST have a clearly identifiable primary action, visually dominant over secondary actions.
- **FR-002**: The expense list MUST display amount as the largest text element per row, followed by category badge and date as secondary elements.
- **FR-003**: Empty states MUST display on every screen that can have no content (expense list, chart, category list if applicable), with an icon/illustration and a human-readable message.
- **FR-004**: Loading states MUST display a visual indicator whenever data is being fetched, preventing the user from seeing blank content.
- **FR-005**: All interactive touch targets MUST be at least 44×44pt to meet mobile accessibility guidelines.
- **FR-006**: Category badges MUST display the category color as a filled background, visible at both small (list row) and medium (picker) sizes.
- **FR-007**: The selected state in the category picker MUST be visually unambiguous — the selected item must be clearly differentiated from unselected items.
- **FR-008**: Validation error messages MUST appear in red directly adjacent to the field that failed, visible without scrolling.
- **FR-009**: The Save button on forms MUST show a loading/disabled state while a save operation is in progress.
- **FR-010**: Default categories MUST be visually distinguishable from user-created categories in the category management screen.
- **FR-011**: The monthly total amount MUST be the most visually prominent element on the Summary screen.
- **FR-012**: The chart legend MUST map each color to its category name and formatted amount on the same line.
- **FR-013**: The month navigation controls MUST have a tap area of at least 44×44pt.
- **FR-014**: All screens MUST render without horizontal overflow on a 320pt-wide screen.
- **FR-015**: The color picker for new categories MUST show at least 8 color options visible simultaneously, each ≥ 32pt in size.
- **FR-016**: A live preview of the new category badge MUST update in real time as the user types the name and selects a color.
- **FR-017**: The keyboard MUST not permanently obscure the Save button when open on any phone screen size.

### Key Entities

- **Screen layout**: The arrangement and sizing of UI elements on each screen, adapting to available width.
- **Visual hierarchy**: The relative prominence of information elements, expressed through size, weight, and color contrast.
- **Empty state**: A dedicated visual treatment shown when a screen has no content to display.
- **Loading state**: A visual indicator shown while data is being retrieved.
- **Category badge**: A colored, labeled pill used consistently across list rows, picker, legend, and summary rows.
- **Touch target**: The tappable area of an interactive element, which must meet minimum size requirements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of screens have a defined empty state — zero screens show blank white space when content is absent.
- **SC-002**: 100% of interactive elements meet the 44×44pt minimum touch target size.
- **SC-003**: All screens render without horizontal content clipping on a 320pt-wide device.
- **SC-004**: The monthly total amount is the largest numeric element on the Summary screen — verifiable by visual inspection.
- **SC-005**: A new user identifies the primary action on each screen within 5 seconds in a usability test, without assistance.
- **SC-006**: The category color palette contains at least 8 visually distinct colors with sufficient contrast between adjacent options.

## Assumptions

- Design targets portrait orientation only (per existing app configuration).
- Minimum supported screen width: 320pt (iPhone SE 1st gen equivalent).
- Maximum supported screen width: 430pt (iPhone Pro Max equivalent); wider screens get extra padding, not stretched content.
- Dark mode is out of scope for this feature — light mode only.
- Custom typography/fonts are out of scope — system font used throughout.
- Animation and transition effects are out of scope — focus is on static layout and visual hierarchy.
- Illustrations for empty states can be emoji-based or simple icon-based; custom SVG illustrations are out of scope.
- The category color palette is curated (preset options), not a free color picker.
