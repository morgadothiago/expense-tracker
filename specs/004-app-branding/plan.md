# Implementation Plan: App Branding & Portfolio Polish

**Branch**: `004-app-branding` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

## Summary

Replace the default Expo icon and splash screen with a custom indigo-branded identity, add haptic feedback to save/delete actions, and add real screenshots to the README. Three independent delivery slices — each ships value without the others.

## Technical Context

**Expo SDK**: 56 (managed workflow) — all changes via `app.json` and JS layer only; no native builds required.

**Icon Pipeline**:
- `assets/icon.png` — 1024×1024 PNG, no rounded corners, indigo fill (#4F46E5) + white wallet SVG rendered in
- `assets/splash-icon.png` — white logo symbol only (no background), centered — Expo adds background via `splash.backgroundColor` in `app.json`
- `assets/android-icon-foreground.png` — white symbol on transparent background (foreground layer for adaptive icon)
- `assets/android-icon-background.png` — solid indigo fill (#4F46E5), no symbol
- `assets/android-icon-monochrome.png` — same as foreground (used for themed icons)

**app.json changes needed**:
- Add `splash` key with `backgroundColor: "#4F46E5"` and `resizeMode: "contain"`
- Update `android.adaptiveIcon.backgroundColor` to `"#4F46E5"` (currently `"#E6F4FE"`)
- Remove `backgroundImage` from adaptiveIcon (use solid color instead)

**Haptic Feedback**:
- Package: `expo-haptics` (managed workflow, SDK 56, no native linking)
- Install: `npx expo install expo-haptics`
- Save expense: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`
- Delete expense/category: `Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)`
- All calls fire-and-forget; wrapped in try/catch — silent failure on unsupported devices

**Touch points (hooks only — not scattered in screens)**:
- `src/hooks/useExpenses.ts` — `addExpense()` and `deleteExpense()` methods
- `src/hooks/useCategories.ts` — `deleteCategory()` method

**Screenshots**:
- Directory: `assets/screenshots/` (new, committed to repo)
- 4 files: `expense-list.png`, `add-expense.png`, `monthly-summary.png`, `categories.png`
- Captured from iOS Simulator after icon work is done (manual step)
- Max 500KB each
- README: replace `*(see /assets)*` with `<img src="assets/screenshots/..." width="200">`

**Files modified**:
```
app.json                                    UPDATE — splash + android adaptiveIcon color
assets/icon.png                             REPLACE — 1024×1024 custom branded icon
assets/splash-icon.png                      REPLACE — white symbol, no background
assets/android-icon-foreground.png          REPLACE — white symbol on transparent
assets/android-icon-background.png          REPLACE — solid indigo fill
assets/android-icon-monochrome.png          REPLACE — same as foreground
assets/screenshots/expense-list.png         NEW — manual capture
assets/screenshots/add-expense.png          NEW — manual capture
assets/screenshots/monthly-summary.png      NEW — manual capture
assets/screenshots/categories.png           NEW — manual capture
src/hooks/useExpenses.ts                    UPDATE — haptics on addExpense + deleteExpense
src/hooks/useCategories.ts                  UPDATE — haptics on deleteCategory
README.md                                   UPDATE — screenshots section with real images
```

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First, Offline-Capable | PASS | UI/UX layer only; no network calls |
| II. TypeScript Strict Mode | PASS | expo-haptics fully typed; try/catch preserves strict |
| III. Component-Driven UI | PASS | Haptics in hooks, not scattered in screens |
| IV. Data Integrity | PASS | No data layer changes |
| V. Expo SDK Compliance | PASS | expo-haptics is an official Expo SDK 56 package |

**No violations. Gate passes.**

## Project Structure

```text
specs/004-app-branding/
├── plan.md              # This file
├── research.md
├── data-model.md
├── contracts/
│   └── assets.md
├── quickstart.md
└── checklists/
    └── requirements.md
```
