# Research: App Branding & Portfolio Polish

**Feature**: specs/004-app-branding/
**Date**: 2026-06-28

---

## Decision 1: Icon Generation Method

**Decision**: Generate icon PNGs using an SVG wallet icon + Node script (`sharp`) or manually export from Figma/Canva. Not using a third-party Expo icon generator service.

**Rationale**: The project already has `assets/icon.png` at 1024×1024. Replacing it requires only a new PNG at the same path. The simplest path: design a 1024×1024 indigo square + white wallet SVG in any tool (Figma, Canva, Inkscape), export as PNG, drop in. `sharp` can be used in a one-off script to generate all derivative sizes from the master. Expo SDK 56 handles resizing from the master 1024×1024 automatically for iOS. Android adaptive icons need the foreground/background layers as separate files.

**Alternatives considered**:
- `expo-image-utils` CLI: generates icons but requires a running Expo server — more setup than necessary for a one-off task
- Third-party icon generator sites: acceptable but adds an external dependency with no version control
- `@expo/prebuild-config`: overkill for icon replacement

---

## Decision 2: Splash Screen Approach

**Decision**: Use `app.json` `splash.backgroundColor: "#4F46E5"` with `splash.image` pointing to a white-symbol-only PNG (`assets/splash-icon.png`). The background color fills the screen; the image is centered and contains the logo mark.

**Rationale**: In Expo SDK 56 managed workflow, the splash screen is configured entirely via `app.json`. Setting `backgroundColor` to indigo (#4F46E5) eliminates the white flash — the OS shows the splash color immediately on launch before JS loads. The `resizeMode: "contain"` ensures the logo is not stretched. This approach requires zero native changes.

**Key `app.json` fields**:
```json
"splash": {
  "image": "./assets/splash-icon.png",
  "resizeMode": "contain",
  "backgroundColor": "#4F46E5"
}
```

**Alternatives considered**:
- `expo-splash-screen` (programmatic control): gives animated splash capability but adds complexity — not needed for a static branded splash
- Native splash (Info.plist / launch activity): requires prebuild, not available in managed workflow

---

## Decision 3: Haptic Feedback Integration Point

**Decision**: Add haptics in hooks (`useExpenses`, `useCategories`), not in screens or components.

**Rationale**: Hooks are the single place where write operations execute. Adding haptics here ensures every call path (current and future) gets the feedback without duplicating the call. Screens call `hook.addExpense()` → hook fires haptic + repo call → screen gets result. No screen needs to know about haptics.

**Fire-and-forget pattern** (do NOT await haptics):
```typescript
// correct — doesn't delay UI
void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
// wrong — would delay the function return
await Haptics.impactAsync(...);
```

**Silent failure**:
```typescript
void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
```
The `.catch(() => {})` swallows `ExpoHapticsNotSupportedError` and any other error silently.

**Alternatives considered**:
- Adding haptics in screen `onPress` handlers: would require touching every screen; misses future callers
- Custom haptics hook: unnecessary abstraction for 3 call sites

---

## Decision 4: Android Adaptive Icon Structure

**Decision**: Use `backgroundColor: "#4F46E5"` (solid color) for Android adaptive icon background instead of a `backgroundImage` PNG. Remove the `backgroundImage` field from `app.json`.

**Rationale**: The current `app.json` uses a separate `android-icon-background.png` for the background image. Replacing it with a solid hex color in `app.json` is simpler, smaller (no PNG file needed), and guaranteed to render correctly on all Android API levels that support adaptive icons (26+). A solid color is the recommended approach in the Android developer docs for single-color backgrounds.

**Files affected**: `assets/android-icon-background.png` can be deleted or kept (unused). `android-icon-monochrome.png` stays for themed icon support.

---

## Decision 5: Screenshot Optimization

**Decision**: Capture screenshots from iOS Simulator (iPhone 16 or 16 Pro) using Cmd+S shortcut or `xcrun simctl io booted screenshot`. Optimize with macOS Preview (Export → reduce quality) or `npx imagemin-cli` to stay under 500KB.

**Rationale**: Simulator screenshots are retina (2x or 3x) and typically 300-700KB. Preview's JPEG export at 80% quality brings most under 500KB while keeping them sharp enough for README display at 200px wide. PNG screenshots can be compressed with `pngquant` or `imagemin`.

**Naming convention**: `assets/screenshots/expense-list.png`, `add-expense.png`, `monthly-summary.png`, `categories.png`.

**README display**: `<img src="assets/screenshots/expense-list.png" width="200" alt="Expense List">` — 200px width renders 4 images side-by-side on desktop GitHub.
