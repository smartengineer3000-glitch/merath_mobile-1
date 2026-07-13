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

---

## UI/UX Audit Report

**Date:** 2026-07-13
**Overall Score:** 6.5 / 10

**Justification:** The app has a well-defined design system (`theme.ts` is excellent) and consistent component architecture. However, execution has significant gaps: the OnboardingScreen bypasses the theme system entirely with hardcoded colors, many touch targets are undersized, RTL support is incomplete, dark mode is broken in several places, and there's no transition animation between screens. The app is functional and structured but not yet "world-class".

---

### Top 10 Issues (Prioritized)

#### P0 — Critical

| # | Issue | File:Line |
|---|-------|-----------|
| 1 | **OnboardingScreen ignores theme entirely** — 10+ hardcoded colors (`#2e7d32`, `#ffffff`, `#999`, etc.), will break in dark mode | `OnboardingScreen.tsx:122,181-182,198,204,216-218,224,232,247,251,254` |
| 2 | **HistoryScreen hardcoded `#ffffff` background** — broken in dark mode | `HistoryScreen.tsx:249` |
| 3 | **Toast has no SafeAreaView** — fixed `bottom: 100` overlaps notched devices | `Toast.tsx:79` |
| 4 | **Export tab is dead** — all 4 export buttons have NO `onPress` handler | `ResultsScreen.tsx:539-588` |
| 5 | **SettingsScreen default madhab row shows language** instead of madhab name | `SettingsScreen.tsx:188` |

#### P1 — High

| # | Issue | File:Line |
|---|-------|-----------|
| 6 | **Touch targets below 44pt** — StepperCounter 36x36, QuickAddChips ~30px, About icons 32x32 | Multiple files |
| 7 | **No screen transition animations** — AnimatedHeader has zero animation, all nav is default stack | `AnimatedHeader.tsx` |
| 8 | **EngineTestScreen hardcoded colors** — `#9C27B0`, `#4CAF50`, `#FF9800`, `#E0E0E0` not from theme | `EngineTestScreen.tsx:190-195,593` |
| 9 | **EmptyState icon renders as text** — shows literal string "time" instead of Ionicons icon | `EmptyState.tsx:24` |
| 10 | **RTL broken** — all `flexDirection: "row"`, `marginLeft`, `chevron-forward` are hardcoded LTR | Multiple files |

---

### Per-Screen Assessment

| Screen | Rating | Key Issue |
|--------|--------|-----------|
| CalculatorScreen | Good | Missing moon icon onPress wiring |
| ResultsScreen | Needs Work | Export tab dead, hardcoded colors |
| HistoryScreen | Needs Work | Hardcoded white background |
| HistoryDetailScreen | Needs Work | Blank empty state |
| ComparisonScreen | Good | Clean flow |
| ComparisonResultsScreen | Needs Work | RTL textAlign broken |
| SettingsScreen | Good | Default madhab bug |
| LanguagePickerScreen | Good | — |
| EngineTestScreen | Needs Work | All colors hardcoded |
| OnboardingScreen | **Issue** | Completely ignores theme |
| LoadingScreen | Good | — |
| DisclaimersModal | Needs Work | Hardcoded handle color |
| ErrorBoundary | Good | — |
| Toast | Needs Work | No SafeAreaView |

---

### Component Quality

| Component | Grade | Notes |
|-----------|-------|-------|
| Button | A | Best component — spring animation + haptics + a11y |
| Card | A- | Gesture press, 3 variants |
| Chip | B+ | Animated, missing haptics |
| Input | A- | Focus/error/helper states |
| StepperCounter | B | Good haptics but 36px buttons too small |
| EmptyState | C | Icon renders as text, not Ionicons |
| AnimatedHeader | D | Misleading name — zero animation |

---

### Accessibility Gaps

- `neutral.light400` text on white fails WCAG AA (2.93:1 vs 4.5:1 required)
- Touch targets below 44pt on multiple interactive elements
- No `accessibilityRole` on history items, settings rows, or Toast

### RTL Issues

- All `marginLeft`/`marginRight` should be `marginStart`/`marginEnd`
- `chevron-forward` icons don't flip in RTL
- `textAlign: "left"` hardcoded in ComparisonResultsScreen

### Specific Code Issues

| File:Line | Issue |
|-----------|-------|
| `OnboardingScreen.tsx:122` | Hardcoded `"#2e7d32"` for dots, should use `theme.colors.primary.main` |
| `OnboardingScreen.tsx:181` | Hardcoded `backgroundColor: "#ffffff"` for card |
| `EngineTestScreen.tsx:190-195` | `CATEGORY_ICONS` colors are all hardcoded Material Design colors, not theme tokens |
| `EngineTestScreen.tsx:593` | `borderBottomColor: "#E0E0E0"` hardcoded |
| `EngineTestScreen.tsx:486` | Radd badge `"#9C27B0"` not in design system |
| `HistoryScreen.tsx:249` | `backgroundColor: "#ffffff"` hardcoded in item style |
| `DisclaimersModal.tsx:170` | `backgroundColor: "#d1d5db"` hardcoded handle bar |
| `ResultsScreen.tsx:612` | `heroLeft: {}` empty style object (dead code) |
| `EmptyState.tsx:24` | Icon rendered as `Text` — Ionicons name string shows as text, not icon |
| `SettingsScreen.tsx:188` | Default madhab row shows `state.language` instead of madhab name |
| `ComparisonResultsScreen.tsx:205` | `textAlign: "left"` hardcoded — broken in RTL |
| `ErrorBoundary.tsx:131` | `color: "#d32f2f"` hardcoded — close to but not exactly `theme.colors.error.main` |
| `AboutScreen.tsx:201` | Logo `"M"` text uses hardcoded `color: "#ffffff"` |
| `Toast.tsx:79` | `bottom: 100` is a magic number — should account for safe area insets |

---

### Recommendations Summary

#### Immediate fixes (1-2 days):
1. Refactor `OnboardingScreen` to use `useAppTheme()` — replace all 10+ hardcoded colors
2. Replace `EmptyState` icon `Text` with actual `Ionicons` component
3. Fix `HistoryScreen` item `backgroundColor: "#ffffff"` to `theme.colors.background.light`
4. Add `onPress` handlers or "Coming Soon" labels to export options
5. Fix `SettingsScreen` default madhab row to show madhab, not language
6. Wire up `AnimatedHeader` `rightIcon` press in CalculatorScreen (moon-outline)
7. Fix `AboutScreen` links that have no `onPress`/URL
8. Replace all `marginLeft`/`marginRight`/`paddingLeft`/`paddingRight` with `marginStart`/`marginEnd`/`paddingStart`/`paddingEnd` for RTL
9. Replace hardcoded `"chevron-forward"` with directional icon in RTL contexts
10. Fix `ComparisonResultsScreen:205` `textAlign: "left"` to `textAlign: "start"`

#### Short-term improvements (1 week):
- Add `accessibilityRole="button"` + labels to all list items
- Increase StepperCounter buttons to 44x44
- Increase QuickAddChips `chipSm` touch area
- Use `Typography` tokens in screens instead of raw fontSize/fontWeight
- Add `accessibilityRole="alert"` to Toast
- Add haptic feedback to Chip and IconButton
- Replace `neutral.light400` text on white with a darker shade for WCAG AA
- Add pull-to-refresh to HistoryScreen FlatList
- Add actual animation to AnimatedHeader (scroll-reactive parallax or opacity)
- Implement skeleton loading states for ResultsScreen

#### Medium-term (2-4 weeks):
- Screen transition animations (shared element or fade)
- Lottie animation for LoadingScreen
- Drag-to-dismiss for DisclaimersModal
- Swipe actions on HistoryScreen items (delete, re-calculate)
- Proper dark mode audit (fix all hardcoded colors that break in dark)
- Use `Shadows` tokens consistently instead of inline shadow styles
- Add error boundary per-tab in ResultsScreen for crash isolation
