# Asset Contracts: App Branding & Portfolio Polish

**Feature**: specs/004-app-branding/
**Date**: 2026-06-28

These contracts define the acceptance criteria for each asset. If an asset meets all criteria, the task is done.

---

## Contract: App Icon (`assets/icon.png`)

**Dimensions**: 1024×1024 pixels exactly
**Format**: PNG, RGB (no alpha channel — iOS ignores it and some tools break with alpha in the master icon)
**Background**: Solid indigo `#4F46E5` filling the entire canvas
**Symbol**: White wallet/finance symbol, centered, occupying 50–60% of canvas width
**Corners**: No rounded corners baked in (iOS applies corners automatically; Android uses masking)
**Verification**: Open in Preview or any image viewer — shows indigo square with white centered symbol, no transparency

---

## Contract: Splash Icon (`assets/splash-icon.png`)

**Dimensions**: At least 200×200px (Expo recommends 1242×2436 for full-screen, but 512×512 works for `contain` mode)
**Format**: PNG with alpha channel (transparency required — background comes from `app.json`)
**Content**: White wallet symbol on transparent background only — no background fill
**Verification**: Open with transparency visible — white symbol, transparent everywhere else

---

## Contract: Android Foreground Icon (`assets/android-icon-foreground.png`)

**Dimensions**: 1024×1024px
**Format**: PNG with alpha channel
**Content**: White wallet symbol on transparent background; symbol fits within the center 672px circle (66% of 1024px) — the Android safe zone
**Verification**: Overlay on a colored background — only the white symbol is visible, no solid square border

---

## Contract: Android Monochrome Icon (`assets/android-icon-monochrome.png`)

**Same spec as foreground** — identical file is acceptable.

---

## Contract: Screenshots (`assets/screenshots/*.png`)

**Count**: Exactly 4 files
**Names**: `expense-list.png`, `add-expense.png`, `monthly-summary.png`, `categories.png`
**Dimensions**: Width ≥ 390px (iPhone standard), height ≥ 844px
**Format**: PNG or JPG
**Size**: Each file ≤ 500KB
**Content**:
  - `expense-list.png`: Shows the Expense List screen with at least 3 sample expense rows visible in avatar style
  - `add-expense.png`: Shows the Add Expense form with the indigo-focused input field or Save button visible
  - `monthly-summary.png`: Shows the Monthly Summary screen with the indigo total card AND the pie chart visible
  - `categories.png`: Shows the Category Management screen with colored category badges visible

**Verification**: Open README on GitHub — 4 images render, no broken links, no placeholder text

---

## Contract: README Screenshots Section

**Before** (failing):
```markdown
| *(see `/assets`)* | *(see `/assets`)* | *(see `/assets`)* | *(see `/assets`)* |
```

**After** (passing):
```markdown
| <img src="assets/screenshots/expense-list.png" width="200" alt="Expense List"> | <img src="assets/screenshots/add-expense.png" width="200" alt="Add Expense"> | <img src="assets/screenshots/monthly-summary.png" width="200" alt="Monthly Summary"> | <img src="assets/screenshots/categories.png" width="200" alt="Categories"> |
```

**Verification**: Load README on GitHub — 4 images visible, each showing a different app screen.
