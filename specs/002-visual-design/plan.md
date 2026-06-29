# Implementation Plan: Visual Design & UI Polish

**Branch**: `002-visual-design` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-visual-design/spec.md`

## Summary

Apply consistent visual design across all 4 screens of the Expense Tracker: establish a design token system (colors, spacing, typography scale), enforce 44pt touch targets, implement proper empty/loading states, add live category badge preview, and ensure all layouts render without horizontal overflow at 320pt minimum width. No new architectural layers — this is a polish pass on existing components and screens.

## Technical Context

**Language/Version**: TypeScript ~6.0.3 (strict mode, existing)

**Primary Dependencies**:
- All existing (Expo SDK 56, React Native 0.85.3)
- `@expo/vector-icons` — included in Expo SDK 56, no install needed; used for tab icons and empty state icons
- No new packages required

**Storage**: N/A — no data model changes

**Testing**: Visual validation via Expo Go / Simulator per quickstart.md

**Target Platform**: iOS + Android, portrait, 320pt–430pt width range

**Project Type**: UI polish pass on existing mobile app

**Performance Goals**: List scroll at 60fps with 50+ items; no visible jank during tab transitions

**Constraints**: Light mode only; system font; no animations; no custom SVGs; preset color palette; portrait only

**Scale/Scope**: 4 screens, ~15 components updated; 1 new file (src/theme/tokens.ts)

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Mobile-First, Offline-Capable | PASS | Pure UI changes, no network dependency introduced |
| II. TypeScript Strict Mode | PASS | Design tokens typed; no any introduced |
| III. Component-Driven UI | PASS | Token system shared via import, not prop-drilling |
| IV. Data Integrity | PASS | No data layer changes |
| V. Expo SDK Compliance | PASS | Only @expo/vector-icons (bundled with SDK 56) used |

**No violations. Gate passes.**

## Project Structure

### Documentation (this feature)

```text
specs/002-visual-design/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Design token definitions
├── quickstart.md        # Visual validation guide
└── contracts/
    └── components.md    # Per-component visual contracts
```

### Source Code Changes (repository root)

```text
src/
├── theme/
│   └── tokens.ts                    # NEW — design tokens (colors, spacing, type scale, shadows)
├── components/
│   ├── common/
│   │   ├── EmptyState.tsx           # UPDATE — larger icon, better message styling
│   │   ├── ConfirmDialog.tsx        # UPDATE — token colors
│   │   └── MonthNavigator.tsx       # UPDATE — 44pt touch targets, token typography
│   ├── categories/
│   │   ├── CategoryBadge.tsx        # UPDATE — larger color fill, sm/md/lg sizes
│   │   ├── CategoryPicker.tsx       # UPDATE — 44pt items, clear selected state
│   │   └── CategoryPreview.tsx      # NEW — live badge preview for create form
│   ├── expenses/
│   │   ├── ExpenseItem.tsx          # UPDATE — token spacing, amount prominence
│   │   └── ExpenseForm.tsx          # UPDATE — 44pt inputs, keyboard-avoiding layout
│   └── charts/
│       └── SpendingChart.tsx        # UPDATE — legend layout, empty state icon
├── screens/
│   ├── ExpenseListScreen.tsx        # UPDATE — FAB 56pt, loading state
│   ├── AddExpenseScreen.tsx         # UPDATE — KeyboardAvoidingView improvement
│   ├── EditExpenseScreen.tsx        # UPDATE — loading/disabled state on save
│   ├── CategoryManagementScreen.tsx # UPDATE — live preview, hide delete on defaults
│   └── MonthlySummaryScreen.tsx     # UPDATE — total prominence, loading state
└── navigation/
    └── AppNavigator.tsx             # UPDATE — @expo/vector-icons for tabs
```

**Structure Decision**: Single token file at src/theme/tokens.ts shared by all components via direct import. No React Context needed — tokens are static constants.

## Complexity Tracking

> No constitution violations — section intentionally empty.
