# Tasks: App Branding & Portfolio Polish

**Feature**: specs/004-app-branding/
**Plan**: [plan.md](./plan.md) | **Spec**: [spec.md](./spec.md)
**Date**: 2026-06-28

---

## Implementation Strategy

MVP = US1 (icon + splash) — branded identity visible before any other work. US2 (haptics) and US3 (screenshots) are independent and can follow in either order. Screenshots depend on US1 being done first (icon visible in simulator).

---

## Phase 1 — Setup

- [x] T001 Install expo-haptics: `npx expo install expo-haptics` (package.json updated, expo-haptics ~56.0.3)
- [x] T002 Create `assets/screenshots/` directory

---

## Phase 2 — US1: Branded App Identity

**Story goal**: Custom indigo icon on home screen, indigo splash screen on launch.

- [x] T003 [US1] Replace `assets/icon.png` with 1024×1024 PNG: indigo (#4F46E5) background + white wallet symbol (generated with Python Pillow)
- [x] T004 [US1] Replace `assets/splash-icon.png` with white wallet symbol on transparent background
- [x] T005 [US1] Replace `assets/android-icon-foreground.png` with white wallet on transparent, symbol within 672px safe zone
- [x] T006 [US1] Replace `assets/android-icon-monochrome.png` with same as foreground
- [x] T007 [US1] Update `app.json`: added `splash` key (backgroundColor #4F46E5, resizeMode contain); updated adaptiveIcon backgroundColor to #4F46E5; removed backgroundImage field; renamed app to "Expense Tracker"
- [ ] T008 [US1] Verify on simulator: home screen icon is indigo + white symbol — **MANUAL: run `npx expo start --ios`, press Cmd+Shift+H**
- [ ] T009 [US1] Verify on simulator: splash screen shows indigo background on launch — **MANUAL: force-quit and relaunch app**

---

## Phase 3 — US2: Haptic Feedback

**Story goal**: Save expense → subtle tap. Delete expense/category → warning vibration. Silent on unsupported devices.

- [x] T010 [US2] Updated `src/hooks/useExpenses.ts`: import expo-haptics; `addExpense` fires `impactAsync(Medium)` after save
- [x] T011 [US2] Updated `src/hooks/useExpenses.ts`: `deleteExpense` fires `notificationAsync(Warning)` after delete
- [x] T012 [US2] Updated `src/hooks/useCategories.ts`: import expo-haptics; `deleteCategory` fires `notificationAsync(Warning)` after delete
- [x] T013 [US2] `npm run typecheck` → 0 errors ✅
- [x] T014 [US2] `npm run lint` → 0 errors ✅
- [x] T015 [US2] `npm run test` → 40/40 green ✅

---

## Phase 4 — US3: README Screenshots

**⚠️ T016–T020 are manual steps requiring iOS Simulator.**

- [ ] T016 [US3] **MANUAL**: Run `npx expo start --ios`, add sample expenses, navigate to Expense List → Simulator File → Save Screen → `assets/screenshots/expense-list.png`
- [ ] T017 [US3] **MANUAL**: Navigate to Add Expense, tap amount field → save as `assets/screenshots/add-expense.png`
- [ ] T018 [US3] **MANUAL**: Navigate to Monthly Summary, ensure pie chart visible → save as `assets/screenshots/monthly-summary.png`
- [ ] T019 [US3] **MANUAL**: Navigate to Categories screen → save as `assets/screenshots/categories.png`
- [ ] T020 [US3] **MANUAL**: Verify each file ≤ 500KB: `ls -lh assets/screenshots/`
- [x] T021 [US3] Updated `README.md`: replaced all 4 `*(see /assets)*` placeholders with `<img>` tags pointing to `assets/screenshots/*.png`

---

## Phase 5 — Polish: Final Verification

- [x] T022 `npm run typecheck` → 0 errors ✅
- [x] T023 `npm run lint` → 0 errors ✅
- [x] T024 `npm run test` → 40/40 ✅
- [x] T025 `assets/screenshots/` directory created; screenshots pending manual capture (T016–T020)
- [ ] T026 Verify README screenshots render on GitHub — **after T016–T020 are complete and pushed**

---

## Task Count

| Phase | Story | Auto | Manual | Status |
|-------|-------|------|--------|--------|
| 1 — Setup | — | 2/2 | — | ✅ done |
| 2 — Branded Identity | US1 | 5/7 | 2 manual | ✅ code done; verify in simulator |
| 3 — Haptic Feedback | US2 | 6/6 | — | ✅ done |
| 4 — Screenshots | US3 | 1/6 | 5 manual | ⏳ pending simulator |
| 5 — Polish | — | 4/5 | 1 after screenshots | ✅ code done |
| **Total** | | **18/26** | **7 manual** | |
