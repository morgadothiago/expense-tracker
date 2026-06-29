# Research: Code Quality & CI Pipeline

**Feature**: specs/003-code-quality/
**Date**: 2026-06-28

---

## Decision 1: ESLint Configuration Approach

**Decision**: `@typescript-eslint` + `eslint-plugin-react-hooks` + `eslint-config-prettier` in a flat `.eslintrc.js`

**Rationale**: The `@typescript-eslint` plugin is the de facto standard for TypeScript linting in 2024-2025. It understands types (not just syntax), enabling rules like `no-explicit-any`, `no-floating-promises`, and `no-unsafe-*`. `eslint-plugin-react-hooks` enforces `exhaustive-deps` which catches bugs in `useEffect` dependencies — a common React mistake. `eslint-config-prettier` disables all formatting rules from ESLint so Prettier owns formatting and ESLint owns correctness.

**Alternatives considered**:
- `biome` (Rome successor): all-in-one lint + format, faster, but ecosystem is still maturing and integration with Expo/RN toolchains less documented — rejected
- `xo`: opinionated preset, less control — rejected
- No linting: not acceptable for a portfolio project — rejected

---

## Decision 2: Formatter

**Decision**: Prettier with `singleQuote: true`, `trailingComma: 'all'`, `semi: true`, `printWidth: 100`

**Rationale**: Prettier is the industry standard for JavaScript/TypeScript formatting. Zero configuration drift between contributors. The settings chosen match the existing code style in the project (single quotes, trailing commas). `printWidth: 100` suits a TypeScript codebase with longer type annotations.

**Alternatives considered**:
- Biome formatter: same as above — ecosystem maturity concern
- dprint: fast but niche — rejected

---

## Decision 3: Test Runner

**Decision**: Jest + ts-jest

**Rationale**: Jest is the most widely used test runner in the React Native ecosystem. It runs in Node.js (no simulator needed), supports TypeScript via `ts-jest`, has excellent async support for testing repository functions, and is already familiar to most React Native developers. `ts-jest` compiles TypeScript at test-time using the project's own `tsconfig.json`, so test types are validated the same way as production code.

**Alternatives considered**:
- Vitest: faster, ESM-native, but requires more config for Node environments with CommonJS modules (expo-sqlite uses CJS interop); Jest is safer here — considered but rejected
- Mocha + Chai: more setup required, less integrated with TypeScript — rejected

---

## Decision 4: SQLite in Node.js for Integration Tests

**Decision**: `sql.js` (WebAssembly SQLite port) as the database engine for integration tests

**Rationale**: Production code uses `expo-sqlite` which requires a native iOS/Android runtime unavailable in Jest's Node environment. `sql.js` is a WebAssembly port of SQLite that runs identically in Node.js. Since both use SQLite under the hood, all SQL (CREATE TABLE, INSERT, SELECT, JOIN, GROUP BY, PRAGMA) behaves identically. Integration tests import repository functions directly, substituting the `sql.js` database object for `expo-sqlite`'s database object via dependency injection.

**The key insight**: Repository functions already accept a `db` parameter (`addExpense(db, data)`). Tests pass a `sql.js` Database instance; production code passes an `expo-sqlite` instance. Same SQL, different runtime adapter.

**Alternatives considered**:
- Mocking expo-sqlite: Would not test actual SQL correctness — rejected (spec FR-013 requires real database)
- Running tests on Detox (E2E): Too heavy, requires simulator, out of scope — rejected
- better-sqlite3: Synchronous API, requires native compilation per platform — harder in CI — rejected

---

## Decision 5: GitHub Actions Configuration

**Decision**: Single workflow file `.github/workflows/ci.yml` with two jobs: `typecheck` and `lint`, running in parallel on `ubuntu-latest`.

**Rationale**: Two separate jobs means typecheck and lint failures are reported independently — a developer sees exactly which check failed. `ubuntu-latest` is the fastest and cheapest GH Actions runner. Dependency cache (`actions/cache` on `node_modules`) cuts install time from ~40s to ~5s on repeat runs, keeping total pipeline time under 2 minutes.

**Pipeline steps**:
1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20 LTS)
3. `actions/cache@v4` on `node_modules` keyed by `package-lock.json` hash
4. `npm ci`
5. Job A: `npx tsc --noEmit`
6. Job B: `npx eslint . --max-warnings 0`
7. Job C: `npx jest --passWithNoTests` (separate job, can fail without blocking badge)

**Alternatives considered**:
- Single job sequential: Slower feedback — rejected
- Self-hosted runner: Overkill for a personal project — rejected

---

## Decision 6: Conventional Commits Scope

**Decision**: Apply Conventional Commits to all commits within this feature (003-code-quality). Do NOT rewrite prior history (001, 002 features) — force-pushing rewritten history is destructive to shared repositories.

**Commit type mapping for this project**:
| Type | When to use |
|------|-------------|
| `feat` | New user-facing feature |
| `fix` | Bug fix |
| `test` | Adding or updating tests |
| `ci` | CI/CD pipeline changes |
| `style` | Lint/formatting changes |
| `refactor` | Code restructuring without behavior change |
| `chore` | Dependency updates, config files |
| `docs` | README, spec, or documentation changes |

**Rationale**: Conventional Commits are required by semantic-release, changelogs, and many open-source projects. Adding them from feature 003 forward demonstrates the practice; rewriting history is risky and unnecessary for a portfolio project.

---

## Decision 7: Repository Test Adapter Pattern

**Decision**: Extract a thin adapter interface so the same repository functions work with both `expo-sqlite` (production) and `sql.js` (tests).

**Pattern**: Repository functions accept `db: DatabaseAdapter` where:
- Production: `DatabaseAdapter` = `expo-sqlite SQLiteDatabase` (async methods: `runAsync`, `getAllAsync`, `getFirstAsync`)
- Tests: wrap `sql.js` synchronous API in async wrappers matching the same method signatures

This requires a minimal test helper file `src/storage/__tests__/testDb.ts` that creates an in-memory sql.js database, runs the schema init, and wraps it in async methods.

**Rationale**: Zero changes to production repository code. Tests exercise real SQL. The adapter is 30-40 lines of glue code.
