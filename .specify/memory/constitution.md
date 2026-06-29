<!--
  SYNC IMPACT REPORT
  ==================
  Version change: [template] → 1.0.0 (initial ratification)
  Modified principles: N/A (first fill)
  Added sections:
    - Core Principles (5 principles defined)
    - Technology Stack & Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates:
    - .specify/templates/plan-template.md ✅ Constitution Check gates align
    - .specify/templates/spec-template.md ✅ No changes required
    - .specify/templates/tasks-template.md ✅ No changes required
  Deferred TODOs: none
-->

# Expense Tracker Constitution

## Core Principles

### I. Mobile-First, Offline-Capable

Every feature MUST work without an active network connection. Financial data is
captured in the moment — at a coffee shop, a market, mid-flight. The app MUST
store all transactions locally first; sync or export are secondary concerns.
Remote calls are additive enhancements, never prerequisites to core user flows.

### II. TypeScript Strict Mode (NON-NEGOTIABLE)

All source files MUST compile under `strict: true` with zero type errors.
`any` is forbidden outside explicitly annotated escape hatches with a comment
explaining why. This is a financial application: type safety prevents silent
data corruption and currency calculation errors.

### III. Component-Driven UI with Clear Boundaries

UI MUST be composed from small, independently renderable components. Each
component owns its visual concern and nothing else; business logic lives in
hooks or services, not JSX. Screens are thin orchestrators. This boundary
MUST be respected to keep the codebase testable and navigable as the app grows.

### IV. Data Integrity Over Convenience

Financial figures MUST NOT be mutated silently. All write operations on
expense/income records MUST be explicit and reversible (soft-delete preferred
over hard-delete). Amounts MUST be stored as integers (cents/smallest currency
unit) — never floats — to avoid rounding errors. Display formatting is
separate from storage.

### V. Expo SDK Compliance

Code MUST target Expo SDK 56 (docs: https://docs.expo.dev/versions/v56.0.0/).
Before using any Expo or React Native API, the exact versioned docs MUST be
consulted — not memory, not older tutorials. Deprecated APIs MUST not be
introduced. Native modules requiring ejection are out of scope unless explicitly
approved as a constitutional amendment.

## Technology Stack & Constraints

- **Framework**: Expo SDK ~56.0.12 / React Native 0.85.3
- **Language**: TypeScript ~6.0.3 (strict mode, see Principle II)
- **React**: 19.x
- **Platforms**: iOS, Android, Web (portrait orientation primary)
- **State**: Local-first; no mandatory remote backend in v1
- **Storage**: AsyncStorage or Expo SQLite (decision per feature spec)
- **Testing**: Tests are optional per feature spec; when included, tests
  MUST fail before implementation (Red-Green-Refactor)
- **No ejection**: Managed Expo workflow only unless amended

## Development Workflow

- All work MUST be specced before implementation (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks`)
- Constitution Check in every plan.md MUST verify all 5 principles before Phase 0
- Amounts stored as integers (cents); display layer handles formatting
- Commits after each completed task or logical group
- Breaking changes to data schema MUST include a migration path

## Governance

This constitution supersedes all other practices and defaults. Amendments
require: (1) clear motivation, (2) version bump per semantic versioning rules,
(3) propagation to all dependent templates and specs in progress.

All plan reviews MUST verify compliance with Principles I–V before
implementation begins. Complexity violations MUST be justified in the plan's
Complexity Tracking table.

Amendment procedure: update this file, increment version, update Sync Impact
Report header, re-run `/speckit-constitution` to propagate.

**Version**: 1.0.0 | **Ratified**: 2026-06-28 | **Last Amended**: 2026-06-28
