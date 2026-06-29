# Feature Specification: App Branding & Portfolio Polish

**Feature Branch**: `004-app-branding`

**Created**: 2026-06-28

**Status**: Draft

**Input**: Custom app icon (indigo background + wallet symbol), branded splash screen, haptic feedback on key actions, real screenshots in README for portfolio visibility.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Branded App Identity (Priority: P1)

A recruiter or developer seeing the app for the first time — whether on a physical device, in a simulator, or scrolling through the GitHub README — sees a professional, purpose-built identity: a custom indigo icon with a financial symbol, not the default Expo logo. The app's visual identity communicates intentionality before a single screen is opened.

**Why this priority**: The app icon is the first visual signal a recruiter sees on a device or app store listing. A default Expo icon communicates "tutorial project." A custom icon communicates "shipped product."

**Independent Test**: Install the app on a simulator. The home screen shows the custom indigo icon (not the white Expo logo). Opening the app, the splash screen shows the same indigo background with a centered logo — not a white screen. Both are visually distinguishable from any default Expo project.

**Acceptance Scenarios**:

1. **Given** the app is installed on iOS, **When** the home screen is viewed, **Then** the app icon shows an indigo background (#4F46E5) with a white wallet/finance symbol — not the default Expo logo.
2. **Given** the app is installed on Android, **When** the home screen is viewed, **Then** the adaptive icon shows the same indigo background with the white symbol in the foreground layer.
3. **Given** the app is launched, **When** it loads, **Then** the splash screen displays an indigo background (#4F46E5) with a centered logo — visible for at least 1 second before the app UI appears.
4. **Given** the app is shared as a link or screenshot, **When** a recruiter views it, **Then** the icon is recognizable as a finance/wallet app, not a generic placeholder.

---

### User Story 2 — Haptic Feedback on Key Actions (Priority: P2)

A user performing important actions in the app receives tactile confirmation through device vibration. Saving a new expense produces a subtle impact. Deleting an expense or category produces a warning vibration that signals irreversibility. This matches the UX standard set by Nubank, Revolut, and other premium finance apps.

**Why this priority**: Haptic feedback is a senior-level UX detail. Its presence in a portfolio project signals awareness of mobile platform standards beyond visual design.

**Independent Test**: On a physical device (or simulator with haptics enabled), save a new expense and feel a subtle tap. Confirm deletion of an expense and feel a stronger warning vibration. No crashes, no silent failures on devices that don't support haptics.

**Acceptance Scenarios**:

1. **Given** a user fills in the expense form and taps Save, **When** the save operation succeeds, **Then** the device produces a subtle impact haptic feedback immediately after the save.
2. **Given** a user taps the delete button on an expense, **When** the delete confirmation dialog appears and the user confirms, **Then** the device produces a warning-level haptic feedback at the moment of deletion.
3. **Given** a user attempts to delete a category with the delete option, **When** the delete confirmation is confirmed, **Then** the device produces a warning-level haptic feedback at the moment of deletion.
4. **Given** a device that does not support haptic feedback, **When** any of the above actions occur, **Then** the action completes normally with no crash or error — haptics are silently ignored.
5. **Given** haptic feedback is triggered, **When** it fires, **Then** it does not delay or block the UI — the visual update and haptic happen simultaneously.

---

### User Story 3 — README Portfolio Showcase (Priority: P2)

A recruiter landing on the GitHub repository page sees real screenshots of the app in a table at the top of the README, immediately understanding what the app does and how it looks — without cloning, installing, or running anything. The screenshots demonstrate the Indigo design system, the expense list, the pie chart, and the category management screen.

**Why this priority**: GitHub README is the recruiter's first and often only view of the project. Screenshots are the difference between 5 seconds of attention and 30 seconds. The current README has placeholder text where images should be.

**Independent Test**: Visit the GitHub repository README. Four screenshots are visible in the screenshots table — no placeholder text, no broken image links. Each screenshot shows a distinct screen of the app with the custom indigo design.

**Acceptance Scenarios**:

1. **Given** the README is viewed on GitHub, **When** a recruiter scrolls to the Screenshots section, **Then** four real screenshots are displayed in a 2x2 or 4-column table with captions.
2. **Given** the screenshots are loaded, **When** they are viewed, **Then** they show: (a) Expense List with sample expenses in avatar-style rows, (b) Add Expense form with indigo styling, (c) Monthly Summary with pie chart visible, (d) Category Management with colored badges.
3. **Given** a screenshot is clicked on GitHub, **When** it opens full-size, **Then** it is sharp enough to read the UI text and see design details clearly (minimum 390px width, retina resolution preferred).
4. **Given** the README is viewed on mobile GitHub, **When** the screenshots section is reached, **Then** images are visible and not broken.

---

## Edge Cases

- Devices that do not support haptic feedback (older iPhones, simulators without haptic support) — haptics must fail silently.
- Android adaptive icon must use the correct foreground/background layers — not just a rescaled square icon.
- Splash screen must not flash white before showing the indigo background.
- Screenshots committed to git must not exceed 500KB each to avoid bloating the repository.
- Icon at 1024x1024 (App Store) must not have rounded corners baked in — iOS applies corners automatically.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The iOS app icon MUST display an indigo (#4F46E5) background with a white wallet or finance symbol at all sizes (20pt to 1024px).
- **FR-002**: The Android adaptive icon MUST use a separate foreground layer (white symbol) and background layer (indigo fill) compatible with the adaptive icon system.
- **FR-003**: The splash screen MUST display an indigo background (#4F46E5) with a centered white logo — no white flash before the splash appears.
- **FR-004**: The splash screen background color MUST match the app icon background (#4F46E5) so the transition from icon tap to splash feels seamless.
- **FR-005**: Saving a new expense MUST trigger a subtle impact haptic feedback upon successful save.
- **FR-006**: Confirming deletion of an expense MUST trigger a warning-level haptic feedback at the moment the item is removed.
- **FR-007**: Confirming deletion of a category MUST trigger a warning-level haptic feedback at the moment the item is removed.
- **FR-008**: Haptic feedback MUST fail silently — no crash, no error — on devices or simulators that do not support haptics.
- **FR-009**: The README Screenshots section MUST display 4 real screenshots (not placeholder text) of: Expense List, Add Expense, Monthly Summary, Category Management.
- **FR-010**: Each screenshot MUST be committed to the repository under `assets/screenshots/` and referenced with relative paths in the README.

---

## Success Criteria *(mandatory)*

- **SC-001**: Opening the app on a fresh simulator install shows the custom indigo icon on the home screen — no default Expo logo visible.
- **SC-002**: The splash screen shows an indigo background (not white) for the full duration of app load.
- **SC-003**: On a device with haptic support, saving an expense produces a perceptible physical feedback within 100ms of the save completing.
- **SC-004**: On a device without haptic support, saving an expense completes normally with zero errors in the console.
- **SC-005**: The GitHub README screenshots section shows 4 images (0 broken links, 0 placeholder text strings).
- **SC-006**: Each screenshot file is under 500KB.

---

## Assumptions

- Icon design uses a wallet emoji (👛) or a custom SVG wallet path rendered to PNG — exact symbol is an implementation decision.
- Haptic intensity levels: save → `impact (medium)`, delete → `notification (warning)` — these are standard platform-appropriate intensities.
- Screenshots are captured from iOS Simulator at standard resolution (iPhone 16 Pro or similar) and committed as PNG or JPG.
- No App Store submission — adaptive icon and splash are needed for development/portfolio builds only.
- `expo-haptics` is available in Expo SDK 56 managed workflow without additional native linking.
- Splash screen background color is set in `app.json` — no separate native config needed for managed workflow.
