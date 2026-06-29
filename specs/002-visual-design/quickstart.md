# Quickstart Validation Guide: Visual Design & UI Polish

**Feature**: specs/002-visual-design/
**Date**: 2026-06-28

Use this guide after implementation to visually validate each FR.
Run on iOS Simulator at iPhone SE size (375pt) AND iPhone 15 Pro Max (430pt).

---

## Setup

```bash
npm run ios
# Switch simulator: Device > iPhone SE (3rd gen) then Device > iPhone 15 Pro Max
```

---

## Validation: FR-001 — Primary action prominence

1. Open app on Expenses tab (empty state)
2. **Check**: FAB (+) is the most visually prominent interactive element
3. Open Summary tab
4. **Check**: Monthly total amount is visually dominant over category list

---

## Validation: FR-002 — Amount dominance in list

1. Add 3 expenses with different amounts
2. **Check**: Amount text is larger and bolder than category badge and date on each row
3. **Check**: Rows are readable at a glance without zooming

---

## Validation: FR-003 — Empty states (all screens)

1. Fresh install (or delete all expenses)
2. Expenses tab → **Check**: icon + "Nenhum gasto ainda" + hint text visible
3. Summary tab with no expenses → **Check**: icon + "Nenhum gasto neste mês" visible
4. Navigate to a future month → **Check**: same empty state appears

---

## Validation: FR-004 — Loading states

1. Force quit and reopen app
2. **Check**: Loading spinner visible briefly on Expenses tab before list appears
3. **Check**: No blank white flash before content renders

---

## Validation: FR-005 — 44pt touch targets

Visual inspection checklist:
- [ ] FAB: 56pt diameter ✓
- [ ] TextInput fields: minHeight 44pt ✓
- [ ] Save button: height 52pt ✓
- [ ] Month nav chevrons: 44×44pt tap area ✓
- [ ] Category picker items: minHeight 44pt ✓
- [ ] Delete buttons in category list: hitSlop applied ✓

---

## Validation: FR-006 — Category badge color fill

1. View expense list with multiple categories
2. **Check**: Each badge has a solid color background filling the badge area
3. **Check**: Badge is visible at small size (sm) in the list row

---

## Validation: FR-007 — Selected state in category picker

1. Open "Add Expense" form
2. Select "Alimentação"
3. **Check**: Alimentação badge has visible border AND selection dot below
4. **Check**: All other badges have no border

---

## Validation: FR-008 — Validation errors adjacent to field

1. Open "Add Expense", tap Save without filling anything
2. **Check**: Red error message appears directly below the Amount field
3. **Check**: Red error message appears near the Category picker
4. **Check**: Errors visible without scrolling

---

## Validation: FR-009 — Save button loading state

1. Open "Add Expense", fill valid data, tap Save quickly twice
2. **Check**: Button shows spinner after first tap
3. **Check**: Button cannot be tapped again while saving (no duplicate expense)

---

## Validation: FR-010 — Default vs user-created category distinction

1. Open Categories screen
2. **Check**: Default categories (Alimentação etc.) show no delete button / disabled delete
3. Create a new category
4. **Check**: New category shows delete button

---

## Validation: FR-011 — Monthly total prominence

1. Open Summary tab with expenses
2. **Check**: Total amount (R$ X,XX) is the largest numeric text on screen
3. **Check**: Total is in the blue card at the top, white text, large font

---

## Validation: FR-012 — Chart legend

1. Add expenses in 3+ categories
2. Open Summary tab
3. **Check**: Legend below chart shows color dot + category name + amount on same line

---

## Validation: FR-013 — Month nav tap areas

1. On Summary screen, tap the ‹ (previous month) button at the very edge
2. **Check**: Navigation works without needing to tap precisely in the center

---

## Validation: FR-014 — 320pt width rendering

In Simulator: Device > iPhone SE (1st generation) [320pt wide]
1. View Expenses list → **Check**: No horizontal overflow, all content fits
2. View Add Expense form → **Check**: All inputs fit, no clipping
3. View Summary → **Check**: Chart and legend fully visible

---

## Validation: FR-015 — Color picker swatches

1. Open Categories → New Category
2. **Check**: At least 8 color swatches visible simultaneously
3. **Check**: Each swatch is ≥ 32pt × 32pt

---

## Validation: FR-016 — Live category preview

1. Open Categories → New Category
2. Type "Test" in name field
3. **Check**: Preview badge updates immediately showing "Test" with selected color
4. Tap a different color
5. **Check**: Preview badge updates immediately with new color

---

## Validation: FR-017 — Keyboard does not obscure Save

1. Open Add Expense form
2. Tap the Amount field (keyboard appears)
3. **Check**: Save button still visible below the keyboard (may require scroll)
4. On iPhone SE: scroll down if needed → Save button reachable

---

## Success Criteria Sign-off

| SC | Criterion | Pass? |
|----|-----------|-------|
| SC-001 | 0 screens with blank empty state | [ ] |
| SC-002 | 100% interactive elements ≥ 44pt | [ ] |
| SC-003 | No horizontal overflow at 320pt | [ ] |
| SC-004 | Monthly total is largest numeric on Summary | [ ] |
| SC-005 | Primary action identified in <5s per screen | [ ] |
| SC-006 | 8+ visually distinct category colors | [ ] |
