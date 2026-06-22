# V0.1 Enhancement Plan

## Purpose

This file is the only Markdown tracking reference for the V0.1 workstream. It should be updated after each implementation task so future sessions can quickly see what was reviewed, what is planned, what is in progress, and what has already shipped.

## Review scope

- Project reviewed: `/workspace/merath_mobile-1/V0.1`.
- Review method: code-focused inspection only; outdated Markdown files were not read.
- Current app type: Expo / React Native Android-first Islamic inheritance calculator.
- Current strengths: strong calculation-domain coverage, typed inheritance entities, reusable theme tokens, dedicated providers for settings/theme/calculation scenario, broad unit-test coverage, and clear separation between screens, reusable components, hooks, and domain logic.

## Mandatory pre-push quality gate

Before any push to `origin main`, these checks must pass or be explicitly documented as blocked by environment:

1. `npx expo-doctor`
2. `npm run check`
3. `npm test`
4. `npm run lint`
5. Format check must pass. If no `format:check` script exists, run an equivalent Prettier check such as `npx prettier --check .` from `V0.1`.

## Senior evaluation

### Architecture and maintainability

- The app has a reasonable feature split: screens in `screens/`, reusable controls in `components/`, app state in `lib/context/`, domain calculation in `lib/inheritance/`, and utilities in `lib/utils/`.
- The calculation engine is currently large and highly stateful. This increases regression risk when special cases are added or modified. The next step should be to split validation, fixed-share rules, special cases, asaba/radd/awl, and result shaping into smaller pure modules.
- There are two calculator hook layers: the core hook in `lib/inheritance/hooks.ts` and an adapter in `lib/hooks/useCalculator.ts`. This is useful, but the boundary should be documented in code comments and enforced so screens do not import both styles accidentally.
- The `CalculationContext` stores only the latest in-memory scenario. This is good for lightweight comparison, but users can lose context after app restart. Consider persisting last scenario if product requirements expect continuity.
- Several files include historical `FIXES` comments. They help explain intent, but long-term maintainability would improve by moving rationale into tests and cleaner function/component names.

### UI and UX

- The recent Calculator stepper is directionally correct: it reduces tab switching, keeps the primary CTA predictable, and aligns the flow with the user task.
- The next UX improvements should focus on making each step collapsible after completion, adding an explicit review step before calculation, and preserving scroll position when users edit a previous step.
- Results should become the canonical output destination. Keep utility actions like export/share visually secondary to the final distribution summary.
- Madhhab comparison is already mobile-aware, but should prioritize differences-only views and explanatory cards over wide comparison tables.
- Settings and About should be regrouped around user intent: language/preferences, data/backup, legal/support, and trust/version information.

### State management

- Context providers are lightweight and understandable. However, settings persistence is relatively complex and should have focused tests for migration, failed storage, and concurrent updates.
- Calculation results are split between hooks and context. A single result store API should own current result, previous results, latest scenario, and persistence policy.
- Avoid using component-local state for values that must survive navigation unless there is a deliberate reset policy.

### Domain correctness

- The inheritance engine supports advanced Islamic inheritance cases and has many tests. This is a major strength.
- Because inheritance calculations are high-trust/high-impact, all special cases should have named fixture tests with human-readable scenario names and expected shares.
- Add golden tests for every madhhab difference surfaced in the comparison screen.
- Keep audit trail and calculation steps deterministic enough to be snapshot-tested without unstable timestamps.

### Reliability and error handling

- Error boundaries and logging exist, but user-facing errors should be standardized into reusable components: inline field errors, blocking calculation errors, export/share failures, and recoverable offline states.
- `expo-doctor` should be part of CI because dependency compatibility is critical for Expo projects.
- Export/share paths should have graceful fallbacks for unsupported platform capabilities.

### Performance

- Lazy loading heavier tabs is a good start.
- Results rendering, comparison generation, and audit exports can become expensive for large histories. Add memoized selectors and pagination/virtualization where lists can grow.
- Animated numbers and share previews should be checked for reduced-motion/accessibility preferences.

### Accessibility and localization

- The app supports multiple locales and RTL, but screen-reader order, text scaling, and 48dp touch targets need formal QA.
- Avoid emoji as primary icons in production UI. Prefer Material icons with accessible labels.
- All icon-only controls need `accessibilityRole`, `accessibilityLabel`, and state where relevant.
- Use centralized localized strings instead of hardcoded Arabic/English strings in screen components.

### Testing and CI

- Current unit coverage is broad, especially for calculation scenarios.
- Add component tests for the Calculator stepper, Results empty state CTA, Madhhab selector selected state, and comparison differences mode.
- Add a CI job that runs the mandatory pre-push quality gate and uploads test reports.
- Add a format-check script to `package.json` so formatting is verifiable without writing changes.

## Enhancement roadmap

### Phase 1 - Stabilize project quality gates

Status: Completed
Priority: Critical
Completed:

- Added `doctor`, `format:check`, and `quality:check` scripts to `package.json`.
- Added a GitHub Actions workflow for the V0.1 quality gate on pull requests and pushes to `main`.
- Ensured the CI quality gate runs from the `V0.1` directory.
- Documented the local `expo-doctor` environment blocker in the tracking log.

### Phase 2 - Normalize result and scenario state

Status: Not started
Priority: Critical
Tasks:

- Create one result/scenario service API used by Calculator, Results, and Madhhab Comparison.
- Decide whether latest scenario should persist across restarts.
- Add tests for save, clear, restore, and comparison reuse flows.

### Phase 3 - Refactor inheritance engine internals

Status: Not started
Priority: High
Tasks:

- Extract input normalization and validation from the engine constructor.
- Extract special-case detectors and calculators into named pure modules.
- Extract final amount formatting/result shaping from rule calculation.
- Add fixture tests for each special case and madhhab difference.

### Phase 4 - Complete Calculator guided flow

Status: In progress
Priority: High
Completed:

- Replaced top-tab calculator flow with a guided vertical stepper.
- Routed successful calculations to the Results tab as the canonical result destination.

Remaining tasks:

- Make completed steps collapsible and editable.
- Add a final review step before calculation.
- Add inline completion/error summaries per step.
- Add component tests for step state transitions.

### Phase 5 - Modernize Results and Comparison

Status: In progress
Priority: High
Completed:

- Improved the empty Results state with a clearer CTA.

Remaining tasks:

- Reorder result details into summary, distribution, legal notes, audit trail, and actions.
- Add a differences-only segmented mode to Madhhab Comparison.
- Render comparison by heir with highlighted changed shares.
- Add export/share failure states and tests.

### Phase 6 - Settings, About, trust, and compliance polish

Status: Not started
Priority: Medium
Tasks:

- Regroup Settings by intent and isolate destructive actions.
- Rebuild About around trust badges, supported madhhabs, version/build metadata, and legal links.
- Move hardcoded user-facing strings into locale files.

### Phase 7 - Accessibility, localization, and responsive QA

Status: Not started
Priority: High
Tasks:

- Audit every screen with screen reader enabled.
- Verify 48dp touch targets on 320dp, 360dp, 411dp, and tablet layouts.
- Check text scaling, dark mode, contrast, RTL order, and keyboard behavior.
- Add accessibility props to icon-only controls and custom cards/buttons.

## Current tracking log

### 2026-06-22

- Created this enhancement plan after code-focused review of the V0.1 project.
- Did not read outdated Markdown files.
- Recorded the mandatory pre-push quality gate requested for all future pushes to `origin main`.
- Current implementation baseline includes the Calculator stepper, canonical Results navigation, Results empty-state polish, Madhhab explanation card, and typed V0.1 design review file.
- Started Enhancement Roadmap Phase 1 and completed the quality-gate setup by adding package scripts for `doctor`, `format:check`, and `quality:check`, plus CI coverage in `.github/workflows/v01-quality-gate.yml`.
- Local `npx expo-doctor` remains blocked in this environment by npm registry `403 Forbidden` while resolving `expo-doctor`; all other local checks should still be run and recorded.
