---

description: "Task list for Visual Design & UI Polish implementation"
---

# Tasks: Visual Design & UI Polish

**Input**: Design documents from `specs/002-visual-design/`

**Prerequisites**: plan.md ✅ spec.md ✅ research.md ✅ data-model.md ✅ contracts/components.md ✅ quickstart.md ✅

**Tests**: Not requested — visual validation via quickstart.md and Simulator.

**Organization**: Tasks grouped by user story. Token file is the single foundational dependency.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1–US5)
- Paths relative to repository root

---

## Phase 1: Setup

**Purpose**: Create design token system — every subsequent task depends on this file

- [x] T001 Create src/theme/ directory and src/theme/tokens.ts with all tokens from data-model.md: Colors (brand, semantic, neutral, 10 category presets), Spacing (xs–xxxl), Typography scale (display 36/800 → caption 12/400), Radius (sm/md/lg/xl/full), Shadow (sm/md), Touch target constants (minSize 44, colorSwatch 36), Layout constants (screenPadding 16, maxContent 600, fabSize 56)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tab navigation visual identity — affects all screens, must be in place before per-screen work

**⚠️ CRITICAL**: Update before any per-screen work begins

- [x] T002 Update src/navigation/AppNavigator.tsx — replace emoji tab icons with Ionicons from @expo/vector-icons: 'wallet' (Gastos tab) and 'stats-chart' (Resumo tab), size 24pt, active color brand.primary (#2563EB); apply token colors to tabBarStyle (white bg, top border neutral.300) and all NativeStack screenOptions headers (headerStyle white, headerTintColor neutral.900, headerShadowVisible false)

**Checkpoint**: App opens with proper Ionicons tab icons and consistent header styling

---

## Phase 3: User Story 1 — Navigate the App Visually (Priority: P1)

**Goal**: User instantly identifies primary action on each screen and navigates tabs without ambiguity.

**Independent Test**: Fresh user opens app, identifies + tab for expenses and chart tab for summary within 5 seconds. FAB is visually dominant on Expenses screen. (quickstart.md FR-001)

### Implementation for User Story 1

- [x] T003 [US1] Update src/screens/ExpenseListScreen.tsx — replace text "+" FAB with Ionicons 'add' icon (size 28pt, color white); set FAB container to 56×56pt using tokens.layout.fabSize, borderRadius tokens.radius.full, shadow.md values; bottom offset uses tokens.layout.fabBottom + SafeAreaInsets bottom; ensure FAB is visually dominant over all other elements

**Checkpoint**: US1 independently testable — FAB prominent, tab icons clear (quickstart.md FR-001 passes)

---

## Phase 4: User Story 2 — Expense List Visual Hierarchy (Priority: P1)

**Goal**: Expense list is scannable at a glance on any phone size; empty and loading states are handled.

**Independent Test**: Add 5 expenses, verify amount is largest text per row; delete all, verify empty state with icon + hint; check 320pt layout with iPhone SE simulator (quickstart.md FR-002, FR-003, FR-004, FR-005 partial, FR-014 partial)

### Implementation for User Story 2

- [x] T004 [P] [US2] Update src/components/common/EmptyState.tsx — replace emoji prop with Ionicons icon prop (name: string, size defaults to 64, color defaults to tokens.neutral[500]); add optional hint prop (string); render: icon → primary message in type.heading/neutral.700 → hint in type.body/neutral.500 centered; use tokens.space.xxxl for container padding
- [x] T005 [P] [US2] Update src/components/expenses/ExpenseItem.tsx — apply tokens: amount uses type.amount (fontSize 18, fontWeight '700') in neutral.900; CategoryBadge size="sm"; date uses type.caption in neutral.500; Ionicons 'chevron-forward' 20pt neutral.300 as right element; card minHeight 72pt, borderRadius tokens.radius.md, shadow.sm, horizontal margin tokens.space.lg
- [x] T006 [US2] Update src/screens/ExpenseListScreen.tsx — show ActivityIndicator (size large, color brand.primary) centered while isLoading=true; update EmptyState call to use new props: icon="receipt-outline" message="Nenhum gasto ainda" hint="Toque em + para adicionar"; ensure listContent paddingBottom accounts for FAB height (90pt)

**Checkpoint**: US2 independently testable — amount dominant in rows, empty state with icon+hint, spinner on load, no clipping at 320pt (quickstart.md FR-002–FR-004 pass)

---

## Phase 5: User Story 3 — Add/Edit Form Comfort (Priority: P2)

**Goal**: Form fields are touch-friendly (44pt), keyboard doesn't block Save, errors visible inline, Save shows loading state.

**Independent Test**: Open Add Expense on iPhone SE, trigger keyboard, verify Save button reachable; submit empty form, verify red errors below each field; tap Save on valid form, verify spinner appears (quickstart.md FR-008, FR-009, FR-017)

### Implementation for User Story 3

- [x] T007 [P] [US3] Update src/components/expenses/ExpenseForm.tsx — set minHeight tokens.touch.minSize (44) on all TextInput; set Save button height 52pt (tokens.space.xxl×2 + content), borderRadius tokens.radius.md; error text uses tokens.semantic.danger color, type.caption size, positioned directly below field; Pressable Save disabled+opacity 0.6 while isLoading; wrap ScrollView in KeyboardAvoidingView behavior='padding' (iOS) / 'height' (Android)
- [x] T008 [P] [US3] Update src/screens/AddExpenseScreen.tsx — remove outer View wrapper, replace with KeyboardAvoidingView flex:1 bg tokens.neutral[100]; pass isLoading state down to ExpenseForm
- [x] T009 [US3] Update src/screens/EditExpenseScreen.tsx — same KeyboardAvoidingView wrapper as AddExpenseScreen; ensure isLoading applied to form during updateExpense and deleteExpense operations; delete button in form uses tokens.semantic.danger color

**Checkpoint**: US3 independently testable — 44pt touch targets, keyboard-avoiding Save reachable, inline errors in red, Save spinner on submit (quickstart.md FR-008, FR-009, FR-017 pass)

---

## Phase 6: User Story 4 — Category Visual Identity (Priority: P2)

**Goal**: Category colors are visually prominent; selected state unambiguous; live badge preview while creating; default categories cannot be deleted (hidden affordance).

**Independent Test**: Open CategoryPicker and select a category — border visible; open New Category form, type name, select color — preview badge updates live; attempt to delete default category — no delete button visible (quickstart.md FR-006, FR-007, FR-010, FR-015, FR-016)

### Implementation for User Story 4

- [x] T010 [P] [US4] Update src/components/categories/CategoryBadge.tsx — add 'lg' size option (height 40pt, paddingHorizontal 14pt, font type.label); ensure all sizes use tokens (sm: h24 px7 badgeSm, md: h32 px10 badge, lg: h40 px14 label); text color always #FFFFFF; borderRadius tokens.radius.md; icon gap tokens.space.xs; name truncates with numberOfLines=1 maxWidth 120pt
- [x] T011 [P] [US4] Update src/components/categories/CategoryPicker.tsx — item wrapper minHeight tokens.touch.minSize (44pt); selected state: borderWidth 2, borderColor tokens.neutral[900], transform scale 1.05; selection indicator dot 6pt circle below badge in category.color; unselected border transparent; horizontal gap tokens.space.sm
- [x] T012 [US4] Create src/components/categories/CategoryPreview.tsx — displays live CategoryBadge preview; props: name string, color string, icon?: string; when name is empty shows badge with text "Nova categoria" in neutral.500; container height 56pt centered; badge uses 'md' size; updates on every prop change (no debounce needed)
- [x] T013 [US4] Update src/screens/CategoryManagementScreen.tsx — integrate CategoryPreview above the name input in the new category form; replace PRESET_COLORS array with 10 tokens from tokens.ts category palette; color swatches set to tokens.touch.colorSwatch size (36pt) ensuring ≥32pt per FR-015; hide delete button entirely for default categories (item.isDefault ? null : deleteButton) instead of showing disabled; use CategoryBadge size="lg" in category list rows

**Checkpoint**: US4 independently testable — live preview updates, default delete hidden, selected state visible, 10 color swatches ≥32pt (quickstart.md FR-006, FR-007, FR-010, FR-015, FR-016 pass)

---

## Phase 7: User Story 5 — Monthly Summary Readability (Priority: P2)

**Goal**: Monthly total is dominant, chart legend maps colors to names+amounts, month nav has 44pt targets, empty state shown when no data.

**Independent Test**: Open Summary with expenses — total card blue with 36pt white amount; view chart legend — each row shows dot + name + amount; navigate to empty month — Ionicons empty state replaces blank chart (quickstart.md FR-011, FR-012, FR-013, FR-014 partial)

### Implementation for User Story 5

- [x] T014 [P] [US5] Update src/components/common/MonthNavigator.tsx — chevron Pressable containers: minWidth and minHeight tokens.touch.minSize (44pt); chevron text size 32pt; label fontSize tokens.type.title.fontSize (18pt), fontWeight '700', minWidth 220pt, textAlign center, textTransform capitalize; container height 56pt
- [x] T015 [P] [US5] Update src/components/charts/SpendingChart.tsx — update legend rows: colorDot 12pt, catName flex:1 type.body neutral.333, catAmount type.label neutral.900 on same row; empty state uses Ionicons 'bar-chart-outline' 64pt with message "Nenhum gasto neste mês." and hint "Navegue para outro mês" via updated EmptyState component
- [x] T016 [US5] Update src/screens/MonthlySummaryScreen.tsx — total card: backgroundColor tokens.brand.primary, borderRadius tokens.radius.xl (20pt), padding 24pt, totalAmount fontSize 36pt fontWeight '800' color white; totalLabel type.label rgba(255,255,255,0.8); show ActivityIndicator while isLoading; chart section uses updated SpendingChart with EmptyState on empty byCategory

**Checkpoint**: US5 independently testable — 36pt white total amount in blue card, legend color+name+amount rows, 44pt month nav, empty state icon (quickstart.md FR-011–FR-013 pass)

---

## Phase 8: Polish & Cross-Cutting

**Purpose**: Apply tokens to remaining components, verify TypeScript strict compliance

- [x] T017 [P] Update src/components/common/ConfirmDialog.tsx — apply tokens: destructive button background tokens.semantic.danger, cancel background tokens.neutral[100], borderRadius tokens.radius.lg (16pt) for dialog container, message type.body neutral.900, button text type.label
- [x] T018 Run npx tsc --noEmit and fix any TypeScript errors introduced by new Ionicons imports or token usage; confirm 0 errors under strict mode

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Requires T001 (tokens) — blocks all story work
- **US1 (Phase 3)**: Requires Phase 2; T003 uses FAB tokens
- **US2 (Phase 4)**: Requires Phase 2; T004+T005 parallel, T006 after both
- **US3 (Phase 5)**: Requires Phase 2; T007+T008 parallel, T009 after T007
- **US4 (Phase 6)**: Requires Phase 2; T010+T011 parallel, T012 parallel, T013 after T010+T011+T012
- **US5 (Phase 7)**: Requires Phase 2 + T004 (EmptyState update); T014+T015 parallel, T016 after both
- **Polish (Phase 8)**: After all user stories complete

### Within Each User Story

- Shared component updates [P] first
- Screen integration after components ready

---

## Parallel Example: User Story 4

```bash
# Launch together (different files):
Task T010: Update CategoryBadge.tsx (sizes + tokens)
Task T011: Update CategoryPicker.tsx (44pt + selected state)
Task T012: Create CategoryPreview.tsx (new component)

# After T010 + T011 + T012:
Task T013: Update CategoryManagementScreen.tsx (integrates all three)
```

---

## Implementation Strategy

### MVP First (US1 + US2 only)

1. T001: tokens.ts
2. T002: AppNavigator icons
3. T003: FAB
4. T004–T006: Expense list hierarchy + empty state + loading
5. **VALIDATE**: Expenses tab looks polished end-to-end on iPhone SE + iPhone 15 Pro Max

### Full Delivery

1. Foundation (T001–T002)
2. US1 (T003) → visual navigation ✓
3. US2 (T004–T006) → list polish ✓
4. US3 (T007–T009) → form polish ✓
5. US4 (T010–T013) → category identity ✓
6. US5 (T014–T016) → summary polish ✓
7. Polish (T017–T018) → tokens everywhere, TS clean ✓

---

## Notes

- All token values imported from src/theme/tokens.ts — never hardcode colors or sizes after T001
- Ionicons import: `import { Ionicons } from '@expo/vector-icons'` — zero install needed (Expo SDK 56 bundled)
- EmptyState update (T004) is used by US2 (list), US5 (chart) — complete before Phase 7
- CategoryPreview (T012) is a pure presentational component — no hooks, no DB access
- Run quickstart.md sign-off table after T018 to confirm all 6 SC pass
