# Data Model: Expense Tracker Core

**Feature**: specs/001-expense-tracker-core/
**Date**: 2026-06-28

Storage engine: `expo-sqlite` (Expo SDK 56)
Amount precision: integers (centavos) — see research.md Decision 5
Date format: ISO 8601 string `YYYY-MM-DD` — see research.md Decision 6

---

## Entity: Category

Represents a spending group. Either a default (seeded on first launch) or user-created.

### Fields

| Field       | SQLite Type  | Constraints                        | Notes                                      |
|-------------|--------------|------------------------------------|--------------------------------------------|
| id          | INTEGER      | PRIMARY KEY AUTOINCREMENT          |                                            |
| name        | TEXT         | NOT NULL, UNIQUE (case-insensitive)| Validated via COLLATE NOCASE               |
| color       | TEXT         | NOT NULL                           | Hex string e.g. `#FF6B6B`                 |
| icon        | TEXT         | NULL                               | Optional icon identifier (emoji or key)    |
| is_default  | INTEGER      | NOT NULL, DEFAULT 0, CHECK (0 or 1)| 1 = seeded default, cannot be deleted      |
| created_at  | TEXT         | NOT NULL                           | ISO 8601 datetime `YYYY-MM-DDTHH:MM:SSZ`  |

### Validation Rules

- `name`: required, non-empty, unique case-insensitive, max 50 characters
- `color`: required, must match `#RRGGBB` pattern
- `is_default = 1`: cannot be deleted (FR-009)
- Category with any linked expense (FK from expenses): cannot be deleted (FR-009)

### Default Seed Data

Seeded on first launch (before any user interaction):

| name          | color    | is_default |
|---------------|----------|------------|
| Alimentação   | #FF6B6B  | 1          |
| Transporte    | #4ECDC4  | 1          |
| Moradia       | #45B7D1  | 1          |
| Lazer         | #96CEB4  | 1          |
| Saúde         | #FFEAA7  | 1          |
| Outros        | #DDA0DD  | 1          |

---

## Entity: Expense

Represents a single spending record.

### Fields

| Field       | SQLite Type  | Constraints                        | Notes                                           |
|-------------|--------------|------------------------------------|-------------------------------------------------|
| id          | INTEGER      | PRIMARY KEY AUTOINCREMENT          |                                                 |
| amount      | INTEGER      | NOT NULL, CHECK (amount > 0)       | Stored in centavos (e.g. R$ 45,50 → 4550)      |
| category_id | INTEGER      | NOT NULL, FOREIGN KEY → categories | ON DELETE RESTRICT                              |
| date        | TEXT         | NOT NULL                           | ISO 8601 date `YYYY-MM-DD`; default = today     |
| description | TEXT         | NULL                               | Optional free-text note                         |
| created_at  | TEXT         | NOT NULL                           | ISO 8601 datetime `YYYY-MM-DDTHH:MM:SSZ`       |

### Validation Rules

- `amount`: required, integer, must be > 0 (FR-001, FR-002)
- `category_id`: required, must reference a valid existing category
- `date`: required, valid calendar date, defaults to today on new expense
- `description`: optional, max 500 characters

### Ordering

Default list order: `ORDER BY date DESC, id DESC` (newest date first; tie-break by most recently created)

### Month Filtering

`WHERE date LIKE 'YYYY-MM-%'` — efficient with index on `date`

---

## Relationships

```
Category ──< Expense
  (1)          (many)
  id ──────── category_id (FK, RESTRICT on delete)
```

- One category has zero or more expenses
- Each expense belongs to exactly one category
- Deleting a category with linked expenses is blocked at application level (FR-009) and at DB level via `ON DELETE RESTRICT`

---

## Schema (SQLite DDL)

```sql
CREATE TABLE IF NOT EXISTS categories (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL COLLATE NOCASE,
  color      TEXT    NOT NULL,
  icon       TEXT,
  is_default INTEGER NOT NULL DEFAULT 0 CHECK (is_default IN (0, 1)),
  created_at TEXT    NOT NULL,
  UNIQUE (name COLLATE NOCASE)
);

CREATE TABLE IF NOT EXISTS expenses (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  amount      INTEGER NOT NULL CHECK (amount > 0),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  date        TEXT    NOT NULL,
  description TEXT,
  created_at  TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category_id ON expenses(category_id);
```

---

## TypeScript Interfaces

```typescript
// src/types/index.ts

export interface Category {
  id: number;
  name: string;
  color: string;         // hex '#RRGGBB'
  icon: string | null;
  isDefault: boolean;
  createdAt: string;     // ISO 8601
}

export interface Expense {
  id: number;
  amount: number;        // centavos, integer > 0
  categoryId: number;
  date: string;          // 'YYYY-MM-DD'
  description: string | null;
  createdAt: string;     // ISO 8601
}

export interface CategorySummary {
  category: Category;
  total: number;         // centavos
}

export interface MonthlySummary {
  year: number;
  month: number;         // 1–12
  totalAmount: number;   // centavos
  byCategory: CategorySummary[];
}
```

---

## State Transitions

### Expense Lifecycle

```
[none] → CREATE → [saved]
[saved] → EDIT   → [saved, updated]
[saved] → DELETE (confirmed) → [gone]
```

DELETE requires user confirmation dialog. No soft-delete — deletion is permanent (spec Assumption).

### Category Lifecycle

```
[seeded defaults on install] — immutable
[none] → CREATE (user) → [active]
[active, no linked expenses] → DELETE → [gone]
[active, has linked expenses] → DELETE attempt → [blocked, stays active]
```
