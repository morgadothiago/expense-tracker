# Design Tokens: Visual Design & UI Polish

**Feature**: specs/002-visual-design/
**Date**: 2026-06-28

This document defines all visual design tokens used across the app.
Source of truth: `src/theme/tokens.ts`

---

## Color Tokens

### Brand Colors
| Token              | Value     | Usage                              |
|--------------------|-----------|------------------------------------|
| brand.primary      | #2563EB   | Primary actions, FAB, active tab   |
| brand.primaryLight | #EFF6FF   | Primary tinted backgrounds         |

### Semantic Colors
| Token              | Value     | Usage                              |
|--------------------|-----------|------------------------------------|
| semantic.danger    | #E53E3E   | Delete actions, error states       |
| semantic.success   | #38A169   | Confirmation states                |
| semantic.warning   | #D97706   | Warning messages                   |

### Neutral Palette
| Token              | Value     | Usage                              |
|--------------------|-----------|------------------------------------|
| neutral.900        | #1A1A1A   | Primary text                       |
| neutral.700        | #444444   | Secondary text, labels             |
| neutral.500        | #888888   | Placeholder, muted text            |
| neutral.300        | #DDDDDD   | Borders, dividers                  |
| neutral.100        | #F5F6FA   | Screen backgrounds                 |
| neutral.0          | #FFFFFF   | Card backgrounds                   |

### Category Preset Palette (10 colors)
| Token              | Value     |
|--------------------|-----------|
| category.coral     | #FF6B6B   |
| category.teal      | #4ECDC4   |
| category.sky       | #45B7D1   |
| category.sage      | #96CEB4   |
| category.yellow    | #FFEAA7   |
| category.lavender  | #DDA0DD   |
| category.peach     | #FFA07A   |
| category.seagreen  | #20B2AA   |
| category.purple    | #9370DB   |
| category.forest    | #3CB371   |

---

## Spacing Tokens

| Token       | Value (pt) | Usage                         |
|-------------|------------|-------------------------------|
| space.xs    | 4          | Icon gaps, tight padding      |
| space.sm    | 8          | Component internal padding    |
| space.md    | 12         | Row padding, badge padding    |
| space.lg    | 16         | Screen horizontal margin      |
| space.xl    | 20         | Form field gap                |
| space.xxl   | 24         | Section padding               |
| space.xxxl  | 32         | Empty state padding           |

---

## Typography Tokens

| Token          | fontSize | fontWeight | lineHeight | Usage              |
|----------------|----------|------------|------------|--------------------|
| type.display   | 36       | '800'      | 44         | Monthly total      |
| type.heading   | 20       | '700'      | 28         | Screen titles      |
| type.title     | 18       | '700'      | 24         | Month navigator    |
| type.body      | 16       | '400'      | 22         | Form inputs, body  |
| type.label     | 14       | '600'      | 20         | Form labels        |
| type.caption   | 12       | '400'      | 16         | Dates, meta text   |
| type.badge     | 13       | '600'      | 18         | Category badge     |
| type.badgeSm   | 11       | '600'      | 14         | Small badge        |
| type.amount    | 18       | '700'      | 24         | Expense row amount |

---

## Radius Tokens

| Token          | Value (pt) | Usage                        |
|----------------|------------|------------------------------|
| radius.sm      | 8          | Buttons, small chips         |
| radius.md      | 12         | Cards, inputs, badges        |
| radius.lg      | 16         | Dialogs, bottom sheets       |
| radius.xl      | 20         | Feature cards (total card)   |
| radius.full    | 999        | Circular elements, FAB       |

---

## Shadow Tokens

| Token          | Usage                         | Properties                                  |
|----------------|-------------------------------|---------------------------------------------|
| shadow.sm      | Expense list cards            | offset(0,1), opacity 0.06, radius 4, el 2  |
| shadow.md      | FAB, dialogs                  | offset(0,3), opacity 0.2, radius 6, el 6   |

---

## Touch Target Token

| Token              | Value (pt) | Usage                              |
|--------------------|------------|------------------------------------|
| touch.minSize      | 44         | Minimum height/width for all interactive elements |
| touch.colorSwatch  | 36         | Color picker swatches (≥32pt per FR-015) |

---

## Layout Tokens

| Token              | Value (pt) | Usage                              |
|--------------------|------------|------------------------------------|
| layout.screenPadding | 16       | Default horizontal screen padding  |
| layout.maxContent  | 600        | Max content width (iPad safety)    |
| layout.fabSize     | 56         | FAB diameter                       |
| layout.fabBottom   | 24         | FAB bottom offset from safe area   |
