# Component Visual Contracts: Visual Design & UI Polish

**Feature**: specs/002-visual-design/
**Date**: 2026-06-28

Defines the expected visual behavior for each component after the polish pass.
All measurements in pt. All colors reference tokens from data-model.md.

---

## CategoryBadge

**Sizes**:
| Size | Height | Padding H | Font     | Usage                           |
|------|--------|-----------|----------|---------------------------------|
| sm   | 24pt   | 7pt       | badgeSm  | Expense list rows, legend       |
| md   | 32pt   | 10pt      | badge    | Category picker, category list  |
| lg   | 40pt   | 14pt      | label    | Category management screen      |

**Visual rules**:
- Background = category.color (filled, not just a dot)
- Text color = #FFFFFF always (white on color background)
- Border radius = radius.md
- Icon (if present) left of name, 4pt gap
- Name truncates with ellipsis at 120pt max width

---

## CategoryPicker

**Layout**: Horizontal FlatList, rows of badges

**Selected state**:
- Border: 2pt solid neutral.900 around the item wrapper
- Scale: 1.05 (subtle emphasis via transform)
- Selection dot: 6pt circle below badge in category.color

**Unselected state**:
- Border: 2pt solid transparent
- No dot

**Touch target**: minHeight 44pt per item wrapper

**When no category selected**: all items appear equally weighted, no border

---

## CategoryPreview (NEW)

Live preview of a new category badge as the user types.

**Layout**: Centered in a 56pt-tall container, shows badge with current name + color
**Initial state** (name empty): shows "Nova categoria" in neutral.500
**Update trigger**: re-renders on every keystroke and every color selection
**Visibility**: always shown while the new category form is open

---

## EmptyState

**Layout**: Centered vertically + horizontally in parent container

**Elements**:
1. Ionicons icon — 64pt, color neutral.500
2. Primary message — type.heading, neutral.700, centered
3. Hint text — type.body, neutral.500, centered (optional)

**Per-screen icons and messages**:
| Screen | Icon (Ionicons) | Primary | Hint |
|--------|----------------|---------|------|
| ExpenseList | receipt-outline | Nenhum gasto ainda | Toque em + para adicionar |
| MonthlySummary/Chart | bar-chart-outline | Nenhum gasto neste mês | Navegue para outro mês |
| CategoryManagement | pricetag-outline | Nenhum gasto nesta categoria | — |

---

## ExpenseItem

**Height**: minHeight 72pt (accommodates 2-line description)

**Visual hierarchy**:
1. Amount — type.amount (18pt bold), neutral.900 — TOP LEFT, dominant
2. CategoryBadge (sm) + date caption — secondary row
3. Description — type.caption, neutral.500 — third row (hidden if null)

**Right element**: Ionicons `chevron-forward` 20pt, neutral.300

**Card style**: white background, radius.md, shadow.sm, horizontal margin 16pt

---

## ExpenseForm

**Input height**: minHeight 44pt (all TextInput)

**Field order**: Amount → Category picker → Date → Description

**Error state**: red border (semantic.danger) on input + error text in semantic.danger directly below field, type.caption

**Save button**:
- Normal: background brand.primary, height 52pt, radius.md, type.label white
- Loading: ActivityIndicator white, disabled opacity 0.6
- Disabled: opacity 0.6

**Keyboard behavior**: KeyboardAvoidingView wraps the scroll, behavior='padding' on iOS

---

## MonthNavigator

**Container height**: 56pt (touch area)
**Chevron buttons**: 44×44pt minimum tap area, text size 32pt
**Label**: type.title (18pt bold), centered, textTransform capitalize
**Min label width**: 220pt (prevents layout shift between short/long month names)

---

## FAB (Add button on ExpenseListScreen)

**Size**: 56×56pt
**Border radius**: radius.full (28pt)
**Shadow**: shadow.md
**Icon**: Ionicons `add` 28pt white
**Position**: bottom 24pt + safeArea.bottom, right 24pt

---

## MonthlySummaryScreen — Total Card

**Height**: min 120pt
**Background**: brand.primary (#2563EB)
**Border radius**: radius.xl (20pt)
**Total label**: type.label, rgba(255,255,255,0.8)
**Total amount**: type.display (36pt 800 weight), #FFFFFF
**Horizontal padding**: 24pt

---

## Tab Bar Icons

| Tab      | Icon (Ionicons) | Active color  |
|----------|----------------|---------------|
| Gastos   | wallet          | brand.primary |
| Resumo   | stats-chart     | brand.primary |

Icon size: 24pt
