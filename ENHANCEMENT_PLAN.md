# Merath Mobile - Comprehensive Evaluation & Enhancement Plan

## Executive Summary

Merath is a React Native + Expo Islamic inheritance calculator supporting four Sunni madhabs. The codebase (~14,000 LOC across ~70 source files) has a solid domain engine but suffers from **critical architectural disconnects**, **broken imports**, **dead/stub code**, **dual theming systems**, and **screens that can never render in the current navigation tree**. The enhancement plan below is organized by severity (Critical > High > Medium > Low) and grouped by the logical control/data flow of the app.

---

## Part 1: Critical Issues (Must Fix)

### [DONE] C1. Broken Imports in Screen Files (3 screens non-functional)

`CalculatorScreen.tsx`, `MadhhabComparisonScreen.tsx`, and `TestScreen.tsx` import from modules that **do not exist**:

```ts
// CalculatorScreen.tsx:16-18
import { useMadhab } from '../lib/context/MadhabContext';     // MISSING: no MadhabContext file
import { useCalculator } from '../lib/hooks/useCalculator';   // MISSING: no lib/hooks/ directory
import { useResults } from '../lib/hooks/useResults';         // MISSING: no lib/hooks/ directory
```

The actual hooks exist at `lib/inheritance/hooks.ts` (exports `useCalculator`, `useResults`, etc.) and no `MadhabContext` exists anywhere.

**Fix:** Create `lib/context/MadhabContext.tsx` (simple context + provider for madhab selection state), and create barrel re-exports at `lib/hooks/useCalculator.ts` and `lib/hooks/useResults.ts` that re-export from `lib/inheritance/hooks.ts` — OR update all screen imports to point at the real locations.

### [DONE] C2. Missing Dependencies in `package.json`

Several packages are imported in source files but **not declared in package.json**:

| Import | Used in | Status |
|--------|---------|--------|
| `@react-native-picker/picker` | CalculatorScreen, MadhhabComparisonScreen, SettingsScreen | **Missing** |
| `react-native-reanimated` | CalculatorScreen (`Animated, FadeInUp`) | **Missing** |

These will crash at runtime.

**Fix:** Add `@react-native-picker/picker` and `react-native-reanimated` to `dependencies` in `package.json` with compatible versions for Expo SDK 54.

### [DONE] C3. Navigation Types Reference Nonexistent Types

```ts
// navigation/types.ts:63-66
export type NavigationOf<T extends keyof TabParamList> = BottomTabNavigationProp<
  TabParamList,
  T
>;
```

`TabParamList` and `BottomTabNavigationProp` are neither imported nor defined. This file **will fail type-checking** (`npm run check`).

**Fix:** Remove the dead `NavigationOf` type alias (it's unreferenced), or replace with a valid type using `DrawerParamList`.

### [DONE] C4. `DrawerNavigationProp` Name Collision

```ts
// navigation/types.ts:46
export type DrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;
```

The `export type` has the same name as the imported `DrawerNavigationProp` from `@react-navigation/drawer`, causing a name collision.

**Fix:** Rename the export to `AppDrawerNavigationProp` or similar.

### [DONE] C5. `SettingsScreen` Uses Non-existent API

```ts
// screens/SettingsScreen.tsx:13
import { useSettings } from '../lib/context/SettingsContext';
// But SettingsContext exports SettingsContext (not a useSettings hook)
// The actual hook pattern uses useContext(SettingsContext)
```

The `SettingsContext.tsx` exports `SettingsProvider` and `SettingsContext`, but `SettingsScreen` calls `useSettings()` which doesn't exist. Additionally, `updateSettings` is called but the context provides `dispatch` + individual setters, not `updateSettings`.

**Fix:** Add a `useSettings()` convenience hook to `SettingsContext.tsx` that wraps `useContext(SettingsContext)`, or update the screen to use the exported API.

### [DONE] C6. Duplicate `parseSafeDecimal` / `parseSafeInteger` Implementations

The same Arabic-numeral-to-Western parser is implemented **three separate times**:
- `lib/utils/parsers.ts`
- `components/EstateInput.tsx` (inline)
- `components/HeirSelector.tsx` (inline)

**Fix:** Consolidate to a single canonical implementation in `lib/utils/parsers.ts` and import it in both components.

---

## Part 2: High-Priority Enhancements

### [DONE] H1. Dual Theme System — Consolidate to One

The app has **two parallel theme systems** that don't interoperate:
1. `lib/context/ThemeProvider.tsx` — `useAppTheme()` (used by `App.tsx`, `ResultsDisplay.tsx`)
2. `lib/design/theme.ts` — `useTheme()` (used by `EstateInput`, `HeirSelector`, `MadhhabSelector`, `Card`, `Button`, `Input`, `SettingsScreen`)

Both define light/dark themes independently. The `ThemeProvider` uses `lightTheme`/`darkTheme` from `theme.ts` but consumers use different hooks, so the dark theme toggle may not propagate uniformly.

**Enhancement:** Remove `useTheme()` from `theme.ts` and make all consumers use `useAppTheme()` from `ThemeProvider.tsx`. The `ThemeProvider` already sources the same `lightTheme`/`darkTheme` objects.

**Symbols to modify:**
```ts
// lib/design/theme.ts — REMOVE:
export function useTheme() { ... }

// All components importing useTheme — CHANGE to:
import { useAppTheme } from '../lib/context/ThemeProvider';
// Then: const { theme } = useAppTheme();
```

### [DONE] H2. `SettingsScreen` Is a 2,047-Line Stub

The SettingsScreen file is 2,047 lines but the **functional code is only ~116 lines**; the rest appears to be dead StyleSheet definitions or copy-pasted stubs. The dark-mode toggle uses local `useState` instead of the `ThemeProvider`, so toggling does nothing.

**Enhancement:** Wire up the dark-mode Switch to `useAppTheme().toggleTheme()`. Strip dead code. Only expose the subset of languages actually supported.

### [DONE] H3. `MadhhabComparisonScreen` & `TestScreen` Are Non-functional Stubs

- `MadhhabComparisonScreen` imports nonexistent hooks and renders `JSON.stringify(result)` as raw text.
- `TestScreen` imports nonexistent hooks and has placeholder logic.

**Enhancement:** Either remove these from the drawer navigator until they're built, or implement them properly using the actual hooks from `lib/inheritance/hooks.ts`.

### [DONE] H4. `console.log` Debug Statements Throughout Engine

The calculation engine has extensive `console.log` calls that will pollute production logs:

```ts
// enhanced-engine-complete.ts:281-293
console.log('isMusharraka check:', { ... });
// enhanced-engine-complete.ts:364
console.log('isAkdariyya:', result, { ... });
// enhanced-engine-complete.ts:377
console.log('computeAkdariyya called');
// enhanced-engine-complete.ts:945, 986, 998, 1009, 1012
console.log('distributeToBloodRelatives ...', ...);
```

**Enhancement:** Remove or gate behind `__DEV__` checks. The `lib/performance/utils.ts` already disables console in production (line 140-144) but that approach is fragile — better to not log at all.

### [DONE] H5. `Fraction.divide(number)` Signature Mismatch

In `computeAsaba`, there are calls like:
```ts
fraction: remainder.divide(heirs.uncle_paternal)  // dividing by a number
```
But `FractionClass.divide()` likely expects a `FractionClass`, not a bare number. This could silently produce wrong results or throw.

**Enhancement:** Audit all `.divide()`, `.multiply()` calls to ensure type correctness. Add overloads or wrap bare numbers in `new FractionClass(n, 1)`.

### [DONE] H6. i18n Default Language Is English but UI Is Arabic

The i18n system defaults to `'en'` (`lib/i18n/index.ts:30`) but the onboarding modal, network indicator, and many UI strings in components are hardcoded in Arabic. This creates a mixed-language experience.

**Enhancement:** Move all hardcoded Arabic strings to locale files and use `t()` translation calls. Ensure the default language matches the primary audience or auto-detect from device locale.

### [DONE] H7. `CalculatorScreen` Uses `@react-native-picker/picker` + `react-native-reanimated` — Neither Installed

These are heavy native dependencies that need linking. Expo SDK 54 has `react-native-reanimated` available but it must be listed in dependencies. `@react-native-picker/picker` needs to be added and configured.

**Enhancement:** Add dependencies. Replace `Picker` with Expo-compatible alternatives (e.g., custom dropdown or `@react-native-picker/picker` with proper plugin config) if Picker causes issues.

---

## Part 3: Medium-Priority Enhancements

### [DONE] M1. No Error Boundary

The app has no React error boundary. A crash in any screen takes down the entire app.

**Enhancement:** Add an `ErrorBoundary` component wrapping `<RootNavigator />` in `App.tsx`. Show a friendly error screen with a "Try Again" button.

### [DONE] M2. `App.tsx` Onboarding Modal Renders Outside SafeArea

The `OnboardingModal` at line 76-170 uses absolute positioning but isn't aware of safe areas, which can cause content to be hidden behind notches.

**Enhancement:** Wrap modal content in `SafeAreaView` or use Expo's `useSafeAreaInsets()`.

### [DONE] M3. `any` Type Usage

The codebase uses `any` in several places despite strict mode being enabled:

```ts
// constants.ts:240 — (FIQH_DATABASE.madhabs as any)[madhab]
// constants.ts:245 — (FIQH_DATABASE.hijabRules as any)[madhab]
// enhanced-engine-complete.ts:1028 — share.key as any
// hooks.ts:200 — // @ts-ignore
// App.tsx:50 — as any (timeout cast)
```

**Enhancement:** Replace `any` casts with proper types. The `FIQH_DATABASE` access can use `Record<string, ...>` type narrowing. The timeout can use `ReturnType<typeof setTimeout>`.

### [DONE] M4. No Lazy Loading for Screens

All five screens are eagerly imported in `RootNavigator.tsx`. For a calculator app this is acceptable, but as screens grow (SettingsScreen is 2K+ lines), lazy loading would improve startup time.

**Enhancement:** Use `React.lazy()` with `Suspense` for `MadhhabComparisonScreen`, `TestScreen`, `SettingsScreen`, and `AboutScreen`.

### [DONE] M5. CSV Exporter Has Hardcoded Currency (SAR)

`CSVExporter.ts` and `utils.ts` (`formatCurrency`) hardcode Saudi Riyal (`SAR`). Users from other countries get wrong currency symbols.

**Enhancement:** Make currency configurable via settings or detect from device locale. Add a `currency` field to `SettingsState`.

### [DONE] M6. `backup_service.ts` Uses `(FileSystem as any).documentDirectory`

```ts
// BackupService.ts:47
const fileUri = (FileSystem as any).documentDirectory + fileName;
```

The `any` cast hides a potential `null` value since `documentDirectory` can be null on some platforms.

**Enhancement:** Add a null check: `if (!FileSystem.documentDirectory) throw new Error(...)`.

### [DONE] M7. Test Screen Exposes Internal Testing in Production

`TestScreen.tsx` is accessible from the drawer menu in production builds. Users should not see raw JSON test output.

**Enhancement:** Conditionally register the Test screen only when `__DEV__` is true, or gate it behind a developer settings flag.

---

## Part 4: Low-Priority / Quality-of-Life

### [DONE] L1. Version Mismatch

`package.json` says version `1.1.3`, `app.config.ts` says `1.0.0`, `BackupService.ts` says `1.1.3`, `AboutScreen` says `1.1.3`. Consolidate to a single source of truth.

**Enhancement:** Read version from `app.config.ts` via `expo-constants` everywhere, or define a `VERSION` constant.

### [DONE] L2. Hardcoded Header Styles

`RootNavigator.tsx` uses hardcoded colors (`#FFFFFF`, `#2E7D32`, `#E5E7EB`) instead of the theme system. When dark mode is toggled, the header stays white.

**Enhancement:** Use theme-aware colors in `screenOptions`.

### [DONE] L3. Missing `@react-navigation/drawer` Dependency Configuration

The `@react-navigation/drawer` requires `react-native-gesture-handler` and `react-native-reanimated` to be properly set up. While `react-native-gesture-handler` is listed, `react-native-reanimated` is not.

### [DONE] L4. `eslint.config.js` and Formatting

The ESLint config is minimal. Adding import ordering, unused-import detection, and React hooks exhaustive-deps rules would catch many of the issues found above automatically.

### [DONE] L5. `app.config.ts` References Google Maps API

```ts
// app.config.ts:74
googleMaps: { apiKey: process.env.GOOGLE_MAPS_API_KEY }
```

The app doesn't use Google Maps anywhere. This is dead configuration that could confuse future developers.

### [DONE] L6. Deep Linking Routes Don't Match Drawer Screens

`linking.ts` defines routes for `MainApp`, `Details`, `Error` but the drawer has `Calculator`, `MadhhabComparison`, `Test`, `Settings`, `About`. Deep links won't resolve to specific screens.

### [DONE] L7. `vitest.config.ts` and `drizzle.config.ts` Review

These configs should be validated — Dexie is used as the database (not Drizzle), so the Drizzle config may be vestigial.

---

## Recommended Implementation Order

| Phase | Items | Effort | Impact |
|-------|-------|--------|--------|
| **Phase 1** | C1, C2, C3, C4, C5 (broken imports & types) | 2-3 hours | App can compile & run |
| **Phase 2** | H1, H2, H4, H6 (theme consolidation, dead code, i18n) | 4-6 hours | Consistent UX |
| **Phase 3** | H3, H5, H7 (fix stub screens, fraction types, deps) | 4-6 hours | Full feature set |
| **Phase 4** | M1, M3, M5, M7 (error boundary, type safety, currency) | 3-4 hours | Production quality |
| **Phase 5** | C6, M2, M4, M6 (consolidation, lazy loading, safety) | 2-3 hours | Code quality |
| **Phase 6** | L1-L7 (version, deep links, cleanup) | 2-3 hours | Polish |

---

## Architecture Diagram (Current)

```
App.tsx
  |- ThemeProvider (lib/context/ThemeProvider.tsx)
  |    |- useAppTheme() — used by ResultsDisplay, App.tsx
  |    |- lightTheme/darkTheme from lib/design/theme.ts
  |
  |- SettingsProvider (lib/context/SettingsContext.tsx)
  |    |- language, notifications, rounding, autoSave
  |    |- AsyncStorage persistence with versioning
  |
  |- RootNavigator (navigation/RootNavigator.tsx)
       |- Drawer Navigator
            |- CalculatorScreen  [FIXED]
            |- MadhhabComparison [FIXED]
            |- TestScreen        [FIXED, __DEV__ only]
            |- SettingsScreen    [FIXED]
            |- AboutScreen       [OK]

Core Engine (lib/inheritance/):
  enhanced-engine-complete.ts  — 1,250 LOC, main calculation
  hijab-system.ts              — 283 LOC, blocking rules
  fraction.ts                  — 611 LOC, precise fraction math
  hooks.ts                     — 1,193 LOC, React hooks (useCalculator, useResults, etc.)
  types.ts                     — 182 LOC, TypeScript types
  constants.ts                 — 251 LOC, Fiqh database
  utils.ts                     — 309 LOC, helpers
  audit-log.ts                 — 800 LOC, IndexedDB audit logging
  audit-trail-manager.ts       — 252 LOC, filtering/sorting

Supporting Libraries:
  lib/database/db.ts           — Dexie/IndexedDB setup
  lib/export/PDFExporter.ts    — HTML→PDF via expo-print
  lib/export/CSVExporter.ts    — CSV generation
  lib/validation/InputValidator.ts — Zod-style validation
  lib/errors/ErrorHandler.ts   — Error logging + retry
  lib/performance/             — Caching, monitoring
  lib/i18n/                    — 6 languages via i18next
  lib/services/BackupService.ts — JSON backup/restore
```
