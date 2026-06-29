# Quickstart & Validation Guide: App Branding & Portfolio Polish

**Feature**: specs/004-app-branding/
**Date**: 2026-06-28

---

## Prerequisites

- `expo-haptics` installed (`npx expo install expo-haptics`)
- Icon PNGs replaced in `assets/`
- `app.json` updated with splash + adaptive icon config
- iOS Simulator running (for icon/splash/screenshot validation)

---

## Validation Scenario 1: Custom Icon visible on simulator home screen (FR-001, SC-001)

1. Press Cmd+Shift+H in Simulator to go to home screen
2. **Expected**: App icon shows indigo (#4F46E5) background with white wallet symbol
3. **Fail indicator**: Default white Expo logo still visible → icon.png not replaced or simulator cache needs reset
4. Cache reset if needed: Device → Erase All Content and Settings, then `npx expo start --clear`

---

## Validation Scenario 2: Splash screen shows indigo background (FR-003, FR-004, SC-002)

1. Force-quit the app from simulator
2. Relaunch it
3. **Expected**: During the ~1 second load, the screen shows indigo (#4F46E5) background with white centered logo — no white flash

---

## Validation Scenario 3: Haptic feedback on save (FR-005, SC-003)

1. Open on a **physical device** (haptics only work on real hardware)
2. Navigate to Add Expense → fill in amount + category → tap Save
3. **Expected**: A subtle physical tap sensation immediately after save
4. On simulator: no sensation, but no crash or console error either (SC-004)

---

## Validation Scenario 4: Haptic feedback on delete expense (FR-006, SC-003)

1. On a physical device, navigate to an existing expense → tap Edit → tap Delete
2. Confirm the deletion in the dialog
3. **Expected**: Warning-level vibration at the moment the expense disappears

---

## Validation Scenario 5: Haptic feedback on delete category (FR-007)

1. On a physical device, navigate to Categories → tap Delete on a user-created category with no expenses
2. Confirm deletion
3. **Expected**: Warning-level vibration at moment of deletion

---

## Validation Scenario 6: Silent failure on unsupported device (FR-008, SC-004)

1. Run on iOS Simulator (haptics not supported)
2. Perform add expense and delete expense
3. **Expected**: Actions complete normally, zero errors in Metro console, no crash

---

## Validation Scenario 7: Screenshots in README (FR-009, FR-010, SC-005, SC-006)

```bash
ls -lh assets/screenshots/
```

**Expected**:
```
expense-list.png    < 500KB
add-expense.png     < 500KB
monthly-summary.png < 500KB
categories.png      < 500KB
```

Then push to GitHub and visit the repository README — 4 images visible, no broken links.

---

## Validation Scenario 8: Lint + typecheck still pass after changes (regression)

```bash
npm run typecheck && npm run lint
```

**Expected**: Both exit 0 — no TypeScript errors from haptics import, no lint violations.

---

## Validation Scenario 9: Full test suite still passes (regression)

```bash
npm run test
```

**Expected**: 40/40 tests green — hook changes don't affect repository tests.

---

## Cross-Reference

- Asset specifications: [contracts/assets.md](./contracts/assets.md)
- Asset sizes + config schemas: [data-model.md](./data-model.md)
- Haptic integration pattern: [research.md](./research.md#decision-3-haptic-feedback-integration-point)
- Implementation tasks: [tasks.md](./tasks.md)
