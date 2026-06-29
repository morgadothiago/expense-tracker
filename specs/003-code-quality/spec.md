# Feature Specification: Code Quality & CI Pipeline

**Feature Branch**: `003-code-quality`

**Created**: 2026-06-28

**Status**: Draft

**Input**: Prepare the project for a professional portfolio with code quality tooling and infrastructure: ESLint + Prettier, GitHub Actions CI/CD, unit and integration tests for utilities and the data layer, and organized commit history with Conventional Commits.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Consistent Code Style (Priority: P1)

A developer opening the project for the first time (a recruiter, a collaborator, or a future employer) sees code formatted consistently across every file. No mixed indentation, no inconsistent quote styles, no trailing spaces. Running a single command reveals any style violations and fixes them automatically.

**Why this priority**: Code style is the first signal of professionalism. A consistent codebase signals discipline and attention to quality — it is immediately visible without running the app.

**Independent Test**: A fresh clone of the repo, running the lint/format check command from the README, exits with no errors and produces no diffs.

**Acceptance Scenarios**:

1. **Given** any file in the project, **When** a developer opens it, **Then** all files follow the same indentation, quote style, semicolon policy, and line length.
2. **Given** a developer introduces a style violation in a file, **When** they run the format command, **Then** the file is automatically corrected with no manual intervention.
3. **Given** a developer introduces a code quality issue (unused variable, implicit any, missing return type), **When** they run the lint check, **Then** the command exits with a non-zero code and reports the specific violation with file and line number.
4. **Given** a new contributor sets up the project, **When** they follow the README setup instructions, **Then** the lint and format commands are available with a single short command.

---

### User Story 2 — Automated Quality Gate on Every Commit (Priority: P1)

Every time code is pushed to the repository, an automated pipeline runs and validates that the codebase compiles without errors and passes all lint rules. The result (pass or fail) is visible as a badge in the README and as a status check on every pull request.

**Why this priority**: A green CI badge is a portfolio signal. It shows the project is maintained, not abandoned, and that quality is enforced automatically — not just claimed.

**Independent Test**: Push a commit to the main branch. Within 2 minutes, a status check appears on GitHub showing pass or fail. The README badge reflects the current build status.

**Acceptance Scenarios**:

1. **Given** a developer pushes valid code to any branch, **When** the pipeline runs, **Then** it completes successfully within 3 minutes and reports a green status.
2. **Given** a developer pushes code with a type error, **When** the pipeline runs, **Then** it fails and reports the exact error with file name and line number.
3. **Given** a developer pushes code with a lint violation, **When** the pipeline runs, **Then** it fails and reports which rule was violated and where.
4. **Given** the README is viewed on GitHub, **When** the last pipeline run passed, **Then** a green badge is visible at the top of the README confirming the build status.

---

### User Story 3 — Verified Correctness of Business Logic (Priority: P2)

The two utility modules that handle money formatting and date manipulation are covered by automated tests. Given any input — edge cases, zero values, locale edge cases — the expected output is documented and verified automatically. A developer can refactor either utility with confidence that no silent regression was introduced.

**Why this priority**: Money and date logic are the highest-risk areas for silent bugs. Tests on these utilities serve as living documentation of the expected behavior and protect future changes.

**Independent Test**: Running the test command from the project root executes all utility tests and reports pass/fail for each case. Passing: all green. Mutating a formula in the currency formatter causes at least one test to fail.

**Acceptance Scenarios**:

1. **Given** the currency formatter receives `4590` (centavos), **When** the test runs, **Then** the result is verified as `R$ 45,90`.
2. **Given** the currency formatter receives `0`, **When** the test runs, **Then** the result is verified as `R$ 0,00`.
3. **Given** the currency input parser receives `"45,90"`, **When** the test runs, **Then** the result is verified as integer `4590`.
4. **Given** the currency input parser receives an empty string or non-numeric input, **When** the test runs, **Then** the result is verified as `null` or `0`.
5. **Given** the date utility receives a year and month, **When** the test runs, **Then** the month filter pattern is verified as `YYYY-MM-%`.
6. **Given** the date utility navigates from December to the next month, **When** the test runs, **Then** the result is verified as January of the following year.
7. **Given** the date utility formats an ISO date for display, **When** the test runs, **Then** the result is verified as the human-readable short form (e.g., `"28 jun"`).

---

### User Story 4 — Verified Data Layer Integrity (Priority: P2)

The repository functions that read and write to the SQLite database are covered by integration tests. Tests run against a real in-memory SQLite database — not mocks — so they verify actual SQL behavior including constraints, joins, and aggregations.

**Why this priority**: The data layer contains the most complex logic (FK constraints, GROUP BY aggregation, LIKE filtering). Mocking SQLite would not catch SQL mistakes. Real integration tests are the only meaningful verification.

**Independent Test**: Running the test command executes all repository tests against an in-memory database. Tests cover: inserting an expense with an invalid category fails; deleting a category with linked expenses fails; monthly aggregation sums correctly across multiple categories.

**Acceptance Scenarios**:

1. **Given** a category exists, **When** an expense is created linked to that category, **Then** the expense is retrievable with the category name and color joined correctly.
2. **Given** an expense exists for a category, **When** a test attempts to delete that category, **Then** the operation is rejected and the category and expense both remain.
3. **Given** expenses exist across two months, **When** the monthly summary is queried for one month, **Then** only expenses from that month are included in the total.
4. **Given** expenses exist in three categories in one month, **When** the monthly summary is queried, **Then** each category's total is the correct sum and categories are ordered by total descending.
5. **Given** no expenses exist for a month, **When** the monthly summary is queried, **Then** the total is zero and the category list is empty.

---

### User Story 5 — Readable Commit History (Priority: P3)

Every commit in the repository follows the Conventional Commits format. A developer (or recruiter) viewing the git log can understand the history of the project at a glance: what was added, what was fixed, what was refactored, and when.

**Why this priority**: Git history is the narrative of a project. Conventional Commits are the industry standard for readable, structured history and are required by many open-source projects and companies.

**Independent Test**: `git log --oneline` on the main branch shows commits with prefixes like `feat:`, `fix:`, `refactor:`, `test:`, `ci:`, `docs:`. No commit message is "fix", "update", "wip", or "initial commit".

**Acceptance Scenarios**:

1. **Given** the git log is viewed, **When** a developer reads it, **Then** every commit message starts with a type prefix (`feat`, `fix`, `refactor`, `test`, `ci`, `docs`, `chore`, `style`).
2. **Given** a new commit is written, **When** it is pushed, **Then** the message follows the pattern `<type>(<optional scope>): <description>` in lowercase.
3. **Given** the project repository is viewed on GitHub, **When** commits are listed, **Then** the history tells a coherent story of the project's development.

---

## Edge Cases

- Currency parser receives a string with both comma and period (e.g., `"1.234,56"`) — must correctly parse as `123456` centavos.
- Month navigation from January backwards must produce December of the prior year.
- Test database must be isolated per test — no shared state between test cases.
- Lint must not fail on generated files or node_modules (proper ignore patterns required).
- CI pipeline must cache dependencies to avoid re-downloading on every run.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A lint command MUST check all source files for code quality violations and report violations with file name, line number, and rule name.
- **FR-002**: A format command MUST automatically fix style violations (indentation, quotes, trailing commas, line endings) across all source files.
- **FR-003**: The lint and format commands MUST be runnable via short aliases documented in the README.
- **FR-004**: A CI pipeline MUST run automatically on every push and pull request to the main branch.
- **FR-005**: The CI pipeline MUST include a type-check step and a lint step; both MUST pass for the pipeline to succeed.
- **FR-006**: Pipeline results MUST be visible as a status badge in the README.
- **FR-007**: A test command MUST execute all unit and integration tests and report results with pass/fail per test case.
- **FR-008**: Unit tests MUST cover all public functions in the currency utility module.
- **FR-009**: Unit tests MUST cover all public functions in the date utility module, including month boundary edge cases.
- **FR-010**: Integration tests MUST cover expense CRUD operations against a real database instance.
- **FR-011**: Integration tests MUST cover category deletion guard (blocked when expenses exist).
- **FR-012**: Integration tests MUST cover monthly summary aggregation correctness.
- **FR-013**: Each integration test MUST use an isolated database instance — no shared state between tests.
- **FR-014**: The git log MUST show commit messages following the Conventional Commits format for all commits added during this feature.

### Key Entities

- **Lint rule**: A code quality check with a name, severity, and auto-fix capability.
- **CI pipeline**: An automated workflow triggered by code push that runs quality checks.
- **Unit test**: An automated test verifying a single function with given inputs and expected outputs.
- **Integration test**: An automated test verifying multiple components working together against real infrastructure (database).
- **Conventional commit**: A commit message following the `<type>: <description>` format.

---

## Success Criteria *(mandatory)*

- **SC-001**: Running the lint check on a clean checkout exits with code 0 — zero violations reported.
- **SC-002**: The CI pipeline completes in under 3 minutes on GitHub Actions for a typical push.
- **SC-003**: The README displays a green CI badge reflecting the latest pipeline result.
- **SC-004**: 100% of public functions in the currency and date utility modules are covered by passing tests.
- **SC-005**: All 5 repository integration test scenarios pass against a real database without mocks.
- **SC-006**: `git log --oneline` on main branch shows zero commit messages without a Conventional Commits type prefix.

---

## Assumptions

- Tests run in Node.js (not on a device or simulator) — database tests use a Node-compatible SQLite binding.
- The CI environment is GitHub Actions (ubuntu-latest runner).
- Pipeline caches `node_modules` between runs to keep run time under 3 minutes.
- Conventional Commits are applied to new commits only — existing history (001, 002 features) is preserved as-is to avoid rewriting shared history.
- Lint rules follow community standards for React Native + TypeScript projects; no custom rules are authored.
- Test framework choice (Jest or Vitest) is an implementation decision — the spec only defines behavior.
