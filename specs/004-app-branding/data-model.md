# Data Model: App Branding & Portfolio Polish

**Feature**: specs/004-app-branding/
**Date**: 2026-06-28

No new data entities. This document defines asset specifications and configuration schemas.

---

## Asset Specifications

### Icon Assets

| File | Size | Format | Content |
|------|------|--------|---------|
| `assets/icon.png` | 1024×1024px | PNG, no alpha | Indigo (#4F46E5) background + white wallet symbol, centered |
| `assets/splash-icon.png` | 200×200px min | PNG with alpha | White wallet symbol on transparent background |
| `assets/android-icon-foreground.png` | 1024×1024px | PNG with alpha | White wallet symbol on transparent (108dp safe zone respected) |
| `assets/android-icon-background.png` | *(can be deleted)* | — | Replaced by `backgroundColor` hex in app.json |
| `assets/android-icon-monochrome.png` | 1024×1024px | PNG with alpha | Same as foreground (for Android themed icons) |
| `assets/favicon.png` | 196×196px | PNG | Same symbol, can be smaller |

### Safe Zone Rule (Android Adaptive Icon)
The Android adaptive icon uses a 108dp canvas but only the center 72dp is guaranteed to be visible (masked). The wallet symbol must fit within the center 72dp circle — roughly the inner 66% of the 1024×1024 foreground image.

### Screenshot Assets

| File | Dimensions | Format | Max Size |
|------|-----------|--------|----------|
| `assets/screenshots/expense-list.png` | 390×844px min | PNG or JPG | 500KB |
| `assets/screenshots/add-expense.png` | 390×844px min | PNG or JPG | 500KB |
| `assets/screenshots/monthly-summary.png` | 390×844px min | PNG or JPG | 500KB |
| `assets/screenshots/categories.png` | 390×844px min | PNG or JPG | 500KB |

---

## Configuration Schema

### app.json Splash Config

| Field | Value | Purpose |
|-------|-------|---------|
| `expo.splash.image` | `"./assets/splash-icon.png"` | Logo centered on splash |
| `expo.splash.resizeMode` | `"contain"` | No stretching |
| `expo.splash.backgroundColor` | `"#4F46E5"` | Indigo fill, no white flash |

### app.json Android Adaptive Icon Config

| Field | Value | Change |
|-------|-------|--------|
| `expo.android.adaptiveIcon.foregroundImage` | `"./assets/android-icon-foreground.png"` | Keep (replace file) |
| `expo.android.adaptiveIcon.backgroundColor` | `"#4F46E5"` | NEW — replaces backgroundImage |
| `expo.android.adaptiveIcon.backgroundImage` | *(remove)* | Delete this field |
| `expo.android.adaptiveIcon.monochromeImage` | `"./assets/android-icon-monochrome.png"` | Keep (replace file) |

---

## Haptic Feedback Specification

| Action | Hook | Function | Haptic Type | Intensity |
|--------|------|----------|-------------|-----------|
| Save expense | `useExpenses.addExpense` | after `repoAdd` resolves | `impactAsync` | `Medium` |
| Delete expense | `useExpenses.deleteExpense` | after `repoDelete` resolves | `notificationAsync` | `Warning` |
| Delete category | `useCategories.deleteCategory` | after `repoDelete` resolves | `notificationAsync` | `Warning` |

**Error handling**: All calls use `.catch(() => {})` — silent failure on unsupported devices.

**Timing**: Fire-and-forget via `void` keyword — does not delay the hook's async flow.
