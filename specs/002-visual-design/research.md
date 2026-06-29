# Research: Visual Design & UI Polish

**Feature**: specs/002-visual-design/
**Date**: 2026-06-28

## Decision 1: Design Token Approach

**Decision**: Static TypeScript constants file at `src/theme/tokens.ts`

**Rationale**: A single typed constants file gives autocompletion, refactoring support,
and zero runtime overhead. React Context or styled-components would add complexity
without benefit for a single-user app with no theming toggle. All tokens imported
directly at the top of each component file.

**Alternatives considered**:
- React Context theme: runtime overhead, no benefit without dark mode — rejected
- StyleSheet.create shared objects: no type safety for token names — rejected
- CSS-in-JS (styled-components): adds dependency, overkill for RN — rejected

---

## Decision 2: Icon Library

**Decision**: `@expo/vector-icons` (Ionicons set) for tab icons and empty state icons

**Rationale**: Bundled with Expo SDK 56 — zero install, zero config, thousands of icons,
consistent sizing API. Ionicons style matches iOS/Android conventions.

**Alternatives considered**:
- Emoji only: inconsistent rendering across OS versions, no sizing control — rejected for tabs
- Custom SVG: out of scope per spec Assumptions — rejected
- react-native-vector-icons: requires native setup, ejection risk — rejected (Constitution V)

---

## Decision 3: Touch Target Strategy

**Decision**: Explicit `minHeight: 44`, `minWidth: 44` on all interactive elements + `hitSlop`
for small visual elements (close buttons, color dots).

**Rationale**: React Native does not automatically expand touch targets. Explicit minHeight
on TextInput, Pressable, and picker items guarantees 44pt compliance per Apple HIG /
Material Design guidelines (FR-005). `hitSlop` extends the hit area beyond the visual
bounds without changing layout.

---

## Decision 4: Responsive Width Strategy

**Decision**: `useWindowDimensions()` for width-aware padding; `maxWidth` constraint on
content containers for large screens; percentage-based widths avoided (prefer fixed
padding that scales via tokens).

**Rationale**: Fixed horizontal padding (16pt on 320pt screen, 20pt on 390pt+) keeps
content readable at all widths. No layout breakpoints needed — content is single-column
throughout. Max content width of 600pt prevents over-stretching on iPads.

---

## Decision 5: Color Palette (Category Preset)

**Decision**: 10 curated colors with sufficient HSL contrast between adjacent swatches.

**Rationale**: 10 colors = >8 required by FR-015, visually distinct, covers warm/cool/neutral
range. All have sufficient luminance difference (>30% HSL lightness delta between any two
adjacent swatches when arranged in picker order).

Palette (hex):
- Coral Red:    #FF6B6B
- Teal:         #4ECDC4
- Sky Blue:     #45B7D1
- Sage:         #96CEB4
- Pale Yellow:  #FFEAA7
- Lavender:     #DDA0DD
- Peach:        #FFA07A
- Sea Green:    #20B2AA
- Purple:       #9370DB
- Forest Green: #3CB371

---

## Decision 6: Typography Scale

**Decision**: 4-step system font scale using React Native fontWeight + fontSize.

| Role          | size | weight |
|---------------|------|--------|
| Display       | 36   | 800    |
| Heading       | 20   | 700    |
| Body          | 16   | 400    |
| Label         | 14   | 600    |
| Caption       | 12   | 400    |

No custom fonts (per spec Assumptions). System font (San Francisco on iOS,
Roboto on Android) handles these weights natively.

---

## Decision 7: Empty State Visual Treatment

**Decision**: Ionicons icon (large, ~64pt, muted color) + 2-line message (primary + hint).

**Rationale**: Emoji rendering is inconsistent between iOS/Android versions and sizes.
Ionicons gives pixel-perfect, size-controlled icons. Two-line treatment: bold primary
message ("Nenhum gasto ainda") + lighter hint text ("Toque em + para adicionar").
