# Research: Expense Tracker Core

**Feature**: specs/001-expense-tracker-core/
**Date**: 2026-06-28

## Decision 1: Local Storage Engine

**Decision**: `expo-sqlite` (Expo SDK 56 built-in)

**Rationale**: Expenses have a foreign-key relationship to categories. expo-sqlite provides a relational engine, supports FK constraints, and allows efficient queries like "all expenses in month X grouped by category." AsyncStorage is key-value only — joining expenses to categories would require loading all records into memory.

Expo SDK 53+ introduced `SQLiteProvider` + `useSQLiteContext()` hook, making it idiomatic for React. Expo 56 ships this API stable.

**Alternatives considered**:
- AsyncStorage: key-value, no queries, manual joins in JS — rejected
- WatermelonDB: overkill for single-user offline app, complex setup — rejected
- MMKV: key-value like AsyncStorage, same problem — rejected
- Realm: native module, requires custom dev client or ejection — rejected (Constitution V)

**Reference**: https://docs.expo.dev/versions/v56.0.0/sdk/sqlite/

---

## Decision 2: Chart Library

**Decision**: `react-native-gifted-charts`

**Rationale**: Works entirely within Expo managed workflow — no native modules, no Skia dependency, no custom dev client needed. Supports both pie and bar charts. Actively maintained (2024–2025). Renders well on iOS, Android, and Web.

**Alternatives considered**:
- `victory-native` v40+: requires `react-native-skia` (native module, needs custom dev client in Expo managed) — rejected (Constitution V)
- `react-native-chart-kit`: pure JS but largely unmaintained since 2021, no pie chart with interactive labels — rejected
- `recharts` (web only): not React Native compatible — rejected

---

## Decision 3: Navigation

**Decision**: `@react-navigation/native` v7 + `@react-navigation/bottom-tabs` + `@react-navigation/native-stack`

**Rationale**: React Navigation is the standard for Expo apps. v7 is compatible with React 19 and React Native 0.85. Two bottom tabs ("Expenses" and "Summary"), each with a native stack for drill-down (Add, Edit, Category Management). `native-stack` uses native UINavigationController / FragmentManager for 60fps transitions.

**Peers required**: `react-native-safe-area-context`, `react-native-screens` (already included in Expo SDK 56)

**Alternatives considered**:
- Expo Router: file-based routing, adds complexity for a 5-screen app with no deep links needed — rejected (YAGNI, Constitution V simplicity)

---

## Decision 4: Global State / Reactivity

**Decision**: React Context + `useState` / `useReducer` in hooks

**Rationale**: The chart must update automatically when expenses change (FR-015). A shared context holding the expense list and a refresh trigger achieves this without external libraries. For a single-user, single-device app with ~5 screens, React Context is sufficient. Hooks (`useExpenses`, `useCategories`, `useMonthlySummary`) encapsulate all queries and mutations.

**Alternatives considered**:
- Zustand: appropriate but adds a dependency for a problem solvable with built-in React — rejected (no added value)
- Redux Toolkit: significant boilerplate overhead for this scope — rejected
- TanStack Query: designed for server state, not local SQLite — rejected

---

## Decision 5: Currency Handling

**Decision**: Store amounts as integers (centavos). Display as R$ X,XX via `utils/currency.ts`.

**Rationale**: Floating-point arithmetic produces rounding errors for monetary sums (e.g., 0.1 + 0.2 ≠ 0.3). Integer centavos avoid this entirely. Constitution Principle IV mandates this. Display conversion is `amount / 100`, formatted with Brazilian locale (comma as decimal separator).

**Implementation note**: Input from user is a decimal string (e.g., "45,50" or "45.50") → parse to centavos on save. Output: centavos → "R$ 45,50" via `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`.

---

## Decision 6: Date Handling

**Decision**: Store dates as ISO 8601 strings (`YYYY-MM-DD`) in SQLite. Use JS `Date` only for display and month navigation.

**Rationale**: SQLite has no native date type; storing as ISO string enables lexicographic sorting (newest-first = ORDER BY date DESC, id DESC). Month filtering uses `WHERE date LIKE 'YYYY-MM-%'`. No timezone complexity since dates are calendar dates (no time component stored per expense).

---

## Resolved Unknowns Summary

| Unknown | Resolution |
|---------|-----------|
| Storage engine | expo-sqlite (relational, Expo 56 SDK) |
| Chart library | react-native-gifted-charts (managed workflow compatible) |
| Navigation | React Navigation v7 native-stack + bottom-tabs |
| State management | React Context + hooks (no external lib) |
| Currency precision | Integer centavos; display via Intl.NumberFormat |
| Date storage format | ISO 8601 string YYYY-MM-DD |
