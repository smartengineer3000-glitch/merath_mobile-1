# Merath UI/UX Implementation Progress

> Auto-maintained tracking file. Updated after each phase commit.

## Current Status: ALL PHASES COMPLETED

---

## Phase 1: Foundation

**Status:** `completed`
**Commit:** `03d6930`

- [x] Navigation: RootNavigator, MainTabNavigator, CalculatorStack, HistoryStack, ComparisonStack, SettingsStack, MoreStack
- [x] Screen shells: LoadingScreen, ErrorScreen, OnboardingScreen, CalculatorScreen, ResultsScreen, HistoryScreen, ComparisonScreen, SettingsScreen, AboutScreen
- [x] Feedback: ErrorBoundary, DisclaimersModal, Toast, LoadingOverlay
- [x] Core UI: Button, Card, Input, Chip, StepperCounter, Badge, SectionHeader, EmptyState, ProgressBar, Divider, Avatar, IconButton, AppSwitch
- [x] Layout: ScreenContainer, AnimatedHeader, GlassCard
- [x] Constants: heirData.ts (heir icons, colors, groups)
- [x] Barrel export: components/ui/index.ts

---

## Phase 2: Calculator Flow

**Status:** `completed`
**Commit:** `129a03e`

- [x] EstateCard: total input, collapsible deductions, net estate badge
- [x] HeirCategory: 5 accordion groups, expandable heir rows with Avatar + StepperCounter
- [x] QuickAddChips: 6 common scenario presets
- [x] HeirList: selected heirs summary with badges
- [x] CalculatorScreen: madhab selector, estate input, heir selection, calculate flow
- [x] ResultsScreen: 4-tab layout (Distribution/Steps/Explanation/Export)

---

## Phase 3: History + Comparison

**Status:** `completed`
**Commit:** `b228ba4`

- [x] HistoryScreen: FlatList + search bar + madhab filter chips
- [x] HistoryDetailScreen: full calculation detail view
- [x] ComparisonScreen: compare across all 4 madhabs
- [x] ComparisonResultsScreen: overview cards + per-heir comparison table

---

## Phase 4: Settings + About + Onboarding

**Status:** `completed`
**Commit:** `d6322e4`

- [x] SettingsScreen: appearance, language, calc prefs, data mgmt, about sections
- [x] LanguagePickerScreen: 6 languages with RTL badge
- [x] AboutScreen: app info, features, links, copyright
- [x] OnboardingScreen: animated 3-step carousel
- [x] App.tsx: fixed broken imports (ErrorBoundary, LoadingScreen paths)

---

## Phase 5: Charts + Animations

**Status:** `completed`
**Commit:** `040be76`

- [x] DonutChart: animated SVG donut with per-arc animation
- [x] CircularProgress: animated ring progress indicator
- [x] BarChart: animated vertical bars with staggered reveal
- [x] SkeletonLoader: pulsing placeholder with CardSkeleton and ListSkeleton presets
- [x] Installed react-native-svg dependency

---

## Phase 6: Polish

**Status:** `completed`
**Commit:** `7981887`

- [x] RTL support: I18nManager toggle on language change via applyRTLOfLanguage()
- [x] LanguagePickerScreen: applies RTL when switching to ar/ur
- [x] SettingsContext: syncs RTL on language load at app startup
- [x] Accessibility: Button, AppSwitch, Chip, StepperCounter all have a11y props
- [x] Dark mode audit: all screen colors use theme correctly
- [x] Performance: chart components use shared values for animations

---

## Engine Code Audit — Comprehensive Review

**Date:** 2026-07-13
**Scope:** `lib/inheritance/` — enhanced-engine-complete.ts, fraction.ts, hijab-system.ts, constants.ts, engine-input.ts, invariant.ts, types.ts, utils.ts
**Status:** CRITICAL BUGS FOUND — fixes proposed below

---

### CRITICAL BUGS (produce wrong calculations)

| # | Location | Issue |
|---|----------|-------|
| **C1** | `engine:477-479` | **Umariyyah mother's share hardcoded to 1/6.** When a *wife* (1/4) is present instead of a husband (1/2), the mother should get 1/3 × 3/4 = **1/4**, not 1/6. Engine also ignores the per-madhab Umariyyah config in `constants.ts:228-234`. |
| **C2** | `engine:975-978` | **Spouse radd not madhab-aware.** `applyRadd()` unconditionally excludes husband/wife. But Hanafi and Maliki allow spouse radd (`spouse_radd: true`). The engine never reads this config. |
| **C3** | `engine:747-748` | **Grandfather optimal selection uses wrong basis.** The 1/3 and 1/6 options are treated as fractions of the *remainder* instead of the *total estate*. Produces incorrect asaba shares when the optimal choice is 1/3 or 1/6. |
| **C4** | `engine:computeFixedShares` | **Grandmother fard shares not implemented.** The grandmother (الجدة) is normalized in engine-input but never assigned a 1/6 share in any scenario. She is completely ignored in calculations. |

### MODERATE ISSUES (correct in most cases, wrong in edge cases)

| # | Location | Issue |
|---|----------|-------|
| **M1** | `engine:158` | After awl, remainder is computed from pre-awl `totalFixed`, producing a negative value. Works by accident because `computeAsaba()` returns `[]` for non-positive remainders, but semantically incorrect. |
| **M2** | `engine:428` | Akdariyya sets `this.state.awlApplied = true` but never pushes `{type: "awl"}` to `this.specialCases`. `specialCases.awl` returns `false` while `awlApplied` is `true` — two sources of truth out of sync. |
| **M3** | `engine:299,353` | `isMusharraka()` and `computeMusharraka()` read from `this.heirs` (original input) instead of hijab-filtered heirs. Works by accident since maternal/full siblings are not blocked by hijab in relevant cases. |
| **M4** | `constants.ts:188-223` | Hanafi, Maliki, and Hanbali hijab rule arrays are incomplete — missing the father-to-mother partial hijab rule (from_third_to_sixth). Calculation is still correct (handled in `computeFixedShares()`), but hijab log is incomplete for non-Shafi'i madhabs. |

### DESIGN ISSUES

| # | Issue |
|---|-------|
| **D1** | `InvariantEngine.assertConservation()` is defined but **never called** by the engine. Estate conservation (sum of shares == 1) is not verified in production. |
| **D2** | Confidence score (lines 1120-1219) penalizes mathematical complexity rather than verifying correctness. Awl (-8), radd (-5), musharraka (-8) are deterministic rules — applying them should not reduce confidence. A better metric would verify mathematical invariants. |
| **D3** | `FIQH_DATABASE.provisions` (constants.ts lines 79-153) is defined but never referenced by the engine. All fractions are hardcoded in `computeFixedShares()`. Dead data. |
| **D4** | `utils.ts:181` validates will against `total/3` (gross estate), but Islamic law limits will to 1/3 of remainder after debts/funeral. The engine correctly applies `(total - funeral - debts)/3`, but this utility validation is less strict and could pass invalid inputs. |
| **D5** | `mergeShares()` (lines 1274-1291) silently drops asaba shares that have the same key as existing fard shares but `addToExisting: false`. Could mask bugs. |

### MISSING FEATURES

| # | Feature |
|---|---------|
| **F1** | Grandmother inheritance priority — when multiple grandmothers from different lines (paternal vs maternal) compete for the 1/6 share, priority rules are not implemented. |
| **F2** | Extended dhawu al-arham classes — only 4 of ~8+ classes implemented in `distributeToBloodRelatives()`. |
| **F3** | Double asaba — heir qualifying as asaba through multiple paths not handled. |

### DIVISION BY ZERO / NaN / INFINITY RISKS

| # | Location | Risk | Description |
|---|----------|------|-------------|
| **Z1** | `fraction.ts:280` | Low | `fromDecimal()` — `1/(b-a)` when `b` is integer produces `Infinity`. Loop exits due to `NaN > x = false` but result may be corrupted. Only affects decimal-to-fraction conversion, not the main calculation path. |
| **Z2** | `engine:945,957` | None | Division by heir count — protected by `> 0` checks. |

---

### Proposed Fix Plan

#### Fix 1 — C1: Umariyyah mother share
- Compute mother's Umariyyah share as `1/3 × (1 - spouse_share)` instead of hardcoded `1/6`
- Read madhab-specific config from `FIQH_DATABASE.specialCases.umariyyah`
- When husband present: `1/3 × (1 - 1/2) = 1/6` (correct for husband case)
- When wife present: `1/3 × (1 - 1/4) = 1/4` (was incorrectly 1/6)

#### Fix 2 — C2: Madhab-aware spouse radd
- In `applyRadd()`, read `FIQH_DATABASE.madhabs[this.madhab].rules.spouse_radd`
- If `true` (Hanafi/Maliki), include husband/wife in eligible fard heirs for radd distribution
- If `false` (Shafi'i/Hanbali), keep current behavior (exclude spouses)

#### Fix 3 — C3: Grandfather optimal selection fix
- Compute 1/3 and 1/6 options as fractions of **total estate** (not remainder)
- New comparison: `max(muqasama_share_of_remainder, 1/3_total - 1/6_fard, 1/6_total - 1/6_fard)`
- Subtract grandfather's existing fard (1/6) from the 1/3 and 1/6 total options

#### Fix 4 — C4: Grandmother fard shares
- Implement grandmother 1/6 share when mother is absent
- Handle competing grandmothers: paternal grandmother gets priority over maternal
- Handle single grandmother: gets full 1/6

#### Fix 5 — M1+M2: Awl consistency
- After awl, recompute remainder from adjusted fractions (not pre-awl total)
- Push `{type: "awl"}` from the Akdariyya code path to sync with `awlApplied` flag

#### Fix 6 — D1: Wire InvariantEngine
- Call `InvariantEngine.assertConservation()` after final shares are computed in `calculate()`
- Log warning (don't throw) if conservation fails — set `confidence` to 0

#### Fix 7 — D3+D4: Clean up dead data and fix validation
- Either remove `FIQH_DATABASE.provisions` or refactor engine to read from it
- Fix `validateEstateData()` to check will against `(total - funeral - debts)/3`
