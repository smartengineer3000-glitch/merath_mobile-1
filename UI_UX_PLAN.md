# Merath — Professional UI/UX Rebuild Plan

## Executive Summary

**Merath** is a React Native (Expo SDK 54) Islamic Inheritance Calculator with a **fully complete backend engine** but **zero UI** (all screens, components, and navigation were deleted in commit `4ccfe05`). The design system (`lib/design/theme.ts`), 6-language i18n, all 4 context providers, and 5 custom hooks are ready. This plan rebuilds the entire visual layer from scratch using **Material Design 3 principles**, **fluid micro-interactions via Reanimated**, and a **competitive design** matching modern Islamic finance apps.

---

## 1. Navigation Architecture

### Primary: Bottom Tab Navigator (5 tabs)
```
[ Calculator ]  [ History ]  [ Compare ]  [ Settings ]  [ More ]
```
- Use `@react-navigation/bottom-tabs` with **custom animated tab bar** (Reanimated-driven icons, active badge, subtle color transitions)
- Tab bar follows MD3 specs: 80px height, 16px label typography, icon + label layout
- Active tab indicator: animated pill-shaped background (Islamic green)
- RTL-aware: tab order reverses for Arabic/Urdu

### Secondary: Stack Navigators per Tab
Each tab wraps a `@react-navigation/native-stack`:

| Tab | Stack Screens |
|---|---|
| **Calculator** | `CalculatorHome` → `EstateInput` → `HeirSelector` → `CalculationPreview` → `Results` |
| **History** | `HistoryList` → `HistoryDetail` |
| **Compare** | `ComparisonHome` → `ComparisonResults` |
| **Settings** | `SettingsList` → `LanguagePicker` → `ThemePicker` → `About` |
| **More** | `AboutScreen` → `LegalDisclaimer` → `PrivacyPolicy` |

### Tertiary: Material Top Tabs (in Results)
Within the Results screen, use `@react-navigation/material-top-tabs` with `react-native-pager-view` for swipeable sections:
```
[ Distribution ]  [ Steps ]  [ Explanation ]  [ Export ]
```

---

## 2. Screen Designs

### 2.1 Onboarding (Enhanced from App.tsx)
- **3-step swipeable full-screen carousel** (replace current modal approach)
- Each step: full-bleed illustration (vector SVG) + animated text entrance
- Step 1: "Welcome" — mosque/geometric pattern hero with app value prop
- Step 2: "Calculate" — animated calculator mockup showing flow
- Step 3: "Compare" — side-by-side madhab comparison visual
- Lottie-style animated illustrations using Reanimated shared transitions
- Dot indicators with animated width (active dot elongates)
- "Skip" and "Get Started" CTAs with Islamic green gradient buttons

### 2.2 Splash Screen
- Custom animated splash: geometric Islamic pattern that unfolds/draws itself
- App logo + name fade-in with scale spring animation
- Uses `expo-splash-screen` preventAutoHideAsync (already configured)

### 2.3 Calculator Screen (Main Home)
**Layout — Vertical scroll with section cards:**

1. **App Bar**: Animated header with Madhab selector chip, dark mode toggle icon
2. **Estate Card** — Elevated card with:
   - Total estate amount (large currency input with currency symbol suffix)
   - Collapsible "Advanced" section for Funeral, Debts, Will inputs
   - Real-time "Net Estate" computed badge (animated color: green when positive)
   - Animated total bar (horizontal progress showing deductions %)
3. **Heirs Section** — Category-based accordion:
   - **Quick-Add Chips Row**: Common scenarios as horizontal scrollable chips ("Family of 4", "With Parents", etc.)
   - **Heir Categories** as expandable sections with MD3 card styling:
     - Spouses (Husband/Wife toggle chips with +/- stepper)
     - Descendants (Son/Daughter with counter steppers)
     - Ascendants (Father/Mother toggle)
     - Siblings (Full/Paternal/Maternal with counters)
     - Extended (Nephews/Uncles, expandable "More" drawer)
   - Each heir row: icon + name + count stepper (animated +/- buttons)
   - Swipe-to-remove on each heir (GestureHandler)
4. **Calculate Button** — Fixed at bottom with animated gradient fill, loading spinner state, disabled state with opacity
5. **Empty State**: Illustrated placeholder when no heirs added ("Add your first heir")

### 2.4 Results Screen
**Layout — Tabbed content within a collapsing app bar:**

1. **Hero Summary Card** (top):
   - Total distribution amount with animated count-up number
   - Confidence score as animated circular progress ring (color-coded: green >95%, amber >80%, red otherwise)
   - Madhab badge chip
   - Special cases alert banner (if awl/radd applied, animated warning)
2. **Distribution Tab** (`react-native-pager-view`):
   - Visual donut chart (animated arc drawing) showing percentage distribution
   - Color-coded heir list cards with:
     - Heir name + icon
     - Amount (large, bold)
     - Fraction display (e.g., "1/4")
     - Percentage badge
     - Per-person breakdown (if count > 1)
   - Swipeable card stack feel
3. **Calculation Steps Tab**:
   - Vertical timeline with numbered step nodes connected by lines
   - Each step: expandable accordion with details
   - Animated reveal (stagger children animation)
4. **Explanation Tab** (Phase 3 knowledge base):
   - Fiqh rule explanations in elegant callout cards
   - Arabic text with proper RTL rendering
   - Color-coded madhab variation highlights
5. **Export Tab**:
   - Export format cards: PDF, Image, Text, Clipboard
   - Each with icon, preview thumbnail, and action button
   - Share button integration (expo-sharing)
6. **Floating Action Button**: "New Calculation" + "Compare Madhabs"

### 2.5 History Screen
- **List view** with virtualized `FlatList` (already using Dexie/IndexedDB):
  - Each item: Card with date, madhab badge, heir count summary, total amount
  - Swipe-to-delete (with confirmation bottom sheet)
  - Search bar at top (animated expand/collapse)
  - Filter chips: by madhab, date range
  - Pull-to-refresh with animated spinner
- **Empty state**: Illustrated "No history yet" with CTA to calculator
- **Batch actions**: Select multiple for export/delete (multi-select mode)

### 2.6 Comparison Screen
- **Input section**: Reuses calculator data or loads from history
- **Run Comparison button**: Triggers `compareAcrossMadhabs()`
- **Results display**:
  - Horizontal scroll of madhab result cards (each card = one madhab's output)
  - Side-by-side diff table: Heir | Madhab A | Madhab B | Diff
  - Color-coded differences: green (identical), amber (minor), red (major)
  - Recommendation banner at bottom
  - Export comparison report button

### 2.7 Settings Screen
- **Grouped sections** with MD3 list items:
  - **Appearance**: Theme toggle (Light/Dark/System) with animated icon transition
  - **Language**: Current language chip → Language picker bottom sheet (6 languages with native names)
  - **Calculation**: Default madhab picker, rounding decimals stepper, currency selector
  - **Data**: Auto-save toggle, Export all data, Clear all data (destructive)
  - **About**: Version, Developer, Legal links
- Settings persist via SettingsContext (already implemented with debounced save)

### 2.8 About Screen
- App logo + version info
- Feature highlights grid (2-column cards)
- Legal disclaimers
- Contact & links
- Privacy policy
- Terms of service

---

## 3. Reusable Components

### 3.1 Core UI Components (`components/ui/`)

| Component | Purpose |
|---|---|
| `Button` | Primary/secondary/text/outline variants with loading state, animated press feedback |
| `Card` | Elevated/outlined/filled variants with press animation |
| `Input` | Text input with label, helper text, error state, icon prefix/suffix |
| `StepperCounter` | +/- counter for heir counts with haptic feedback |
| `Chip` | Selectable/filter chips with animated selection state |
| `Badge` | Small notification/status badges (madhab, count) |
| `ProgressBar` | Linear animated progress bar |
| `CircularProgress` | Animated ring for confidence score |
| `Divider` | Themed horizontal/vertical divider |
| `Avatar` | Heir type icons with colored backgrounds |
| `Switch` | Toggle switch with label |
| `IconButton` | Pressable icon-only button with ripple |
| `FAB` | Floating action button with extended label variant |
| `BottomSheet` | Modal bottom sheet (GestureHandler-based) |
| `Snackbar` | Toast-style feedback notifications |
| `EmptyState` | Illustrated empty state with optional CTA |
| `ErrorFallback` | Error boundary UI with retry button |
| `SkeletonLoader` | Shimmer loading placeholders |
| `DonutChart` | Animated SVG donut/pie chart |
| `BarChart` | Animated horizontal bar chart |
| `SectionHeader` | Section title with optional action button |
| `SearchBar` | Expandable animated search input |
| `FilterChips` | Horizontal scrollable filter chip row |
| `HeirRow` | Heir display with icon, name, count, amount |
| `MadhabSelector` | Visual madhab picker with colored cards |

### 3.2 Layout Components (`components/layout/`)

| Component | Purpose |
|---|---|
| `ScreenContainer` | SafeAreaView wrapper with consistent padding |
| `ScrollScreen` | ScrollView with keyboard avoiding |
| `AnimatedHeader` | Collapsing/parallax app bar |
| `GlassCard` | Frosted glass effect card (blur + transparency) |

### 3.3 Feedback Components (`components/feedback/`)

| Component | Purpose |
|---|---|
| `Toast` | Auto-dismissing notification toast |
| `LoadingOverlay` | Full-screen loading with custom animation |
| `NetworkBanner` | Animated network status indicator (already in App.tsx, extract) |

---

## 4. Micro-Interactions & Animations

All powered by `react-native-reanimated` (v4.1.1) and `react-native-gesture-handler`:

| Interaction | Implementation |
|---|---|
| Screen transitions | Shared element transitions for card → detail |
| Tab bar | Animated icon scale + color on active state |
| Button press | `useAnimatedStyle` with spring scale(0.96) |
| Card press | Subtle scale + shadow elevation change |
| Stepper +/- | Scale bounce animation + haptic (`expo-haptics`) |
| List item delete | Animated layout transition (enter/exit) |
| Number count-up | Animated value interpolation for results |
| Chart draw | Animated arc/draw from 0 to final value |
| Pull-to-refresh | Custom animated spinner |
| Tab swipe | PagerView with animated tab indicator |
| Bottom sheet | Gesture-driven with spring physics |
| Skeleton loading | Shimmer gradient animation |
| Progress ring | Animated stroke-dashoffset |

---

## 5. Design Tokens Applied

Using the existing `lib/design/theme.ts`:

- **Colors**: Islamic green primary (#2e7d32), Blue secondary, Gold tertiary, full neutral scale
- **Typography**: Cairo (Arabic), Plus Jakarta Sans (English), 5-level hierarchy
- **Spacing**: 8pt base grid (4/8/12/16/24/32/48)
- **Border Radius**: xs(4) to xl(24), full for avatars
- **Shadows**: 6-level elevation + colored shadows for themed cards
- **Animations**: 100ms instant -> 300ms slow, ease-in-out curves

---

## 6. File Structure

```
V0.1/
├── navigation/
│   ├── RootNavigator.tsx          # Root stack (onboarding -> main)
│   ├── MainTabNavigator.tsx       # Bottom tab bar
│   ├── CalculatorStack.tsx        # Calculator tab stack
│   ├── HistoryStack.tsx           # History tab stack
│   ├── ComparisonStack.tsx        # Comparison tab stack
│   ├── SettingsStack.tsx          # Settings tab stack
│   └── MoreStack.tsx              # More tab stack
├── screens/
│   ├── onboarding/
│   │   └── OnboardingScreen.tsx
│   ├── calculator/
│   │   ├── CalculatorScreen.tsx   # Main calculator
│   │   └── CalculatorScreen.styles.ts
│   ├── results/
│   │   ├── ResultsScreen.tsx      # Tabbed results
│   │   ├── DistributionTab.tsx
│   │   ├── StepsTab.tsx
│   │   ├── ExplanationTab.tsx
│   │   └── ExportTab.tsx
│   ├── history/
│   │   ├── HistoryScreen.tsx
│   │   └── HistoryDetailScreen.tsx
│   ├── comparison/
│   │   ├── ComparisonScreen.tsx
│   │   └── ComparisonResultsScreen.tsx
│   ├── settings/
│   │   ├── SettingsScreen.tsx
│   │   ├── LanguagePickerScreen.tsx
│   │   └── AboutScreen.tsx
│   └── shared/
│       ├── LoadingScreen.tsx
│       └── ErrorScreen.tsx
├── components/
│   ├── ui/                       # 20+ reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── StepperCounter.tsx
│   │   ├── Chip.tsx
│   │   ├── Badge.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── CircularProgress.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── FAB.tsx
│   │   ├── Snackbar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── DonutChart.tsx
│   │   ├── SearchBar.tsx
│   │   ├── MadhabSelector.tsx
│   │   ├── HeirRow.tsx
│   │   ├── FilterChips.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── index.ts              # Barrel export
│   ├── layout/
│   │   ├── ScreenContainer.tsx
│   │   ├── AnimatedHeader.tsx
│   │   └── GlassCard.tsx
│   ├── feedback/
│   │   ├── Toast.tsx
│   │   ├── LoadingOverlay.tsx
│   │   └── ErrorBoundary.tsx
│   ├── onboarding/
│   │   └── OnboardingCarousel.tsx
│   ├── estate/
│   │   ├── EstateCard.tsx
│   │   └── DeductionsSection.tsx
│   ├── heirs/
│   │   ├── HeirCategory.tsx
│   │   ├── HeirCounter.tsx
│   │   ├── QuickAddChips.tsx
│   │   └── HeirList.tsx
│   └── DisclaimersModal.tsx
├── hooks/
│   └── useAnimatedValues.ts      # Shared animation hooks
└── constants/
    └── heirData.ts               # Heir icons, colors, groups
```

---

## 7. Implementation Phases (Recommended Order)

| Phase | Scope | Files |
|---|---|---|
| **Phase 1** | Foundation — Navigation + Screen shells + ErrorBoundary + LoadingScreen + core UI components (Button, Card, Input, Chip, StepperCounter) | ~20 files |
| **Phase 2** | Calculator Flow — Estate card, heir selector, calculate button, Results screen with all tabs | ~15 files |
| **Phase 3** | History + Comparison — History list, detail, comparison screen with visual diff | ~8 files |
| **Phase 4** | Settings + About + Onboarding — Settings list, language picker, about, onboarding carousel | ~8 files |
| **Phase 5** | Charts + Animations — DonutChart, CircularProgress, bar charts, micro-interactions, skeleton loaders | ~5 files |
| **Phase 6** | Polish — Empty states, snackbar notifications, glass effects, RTL verification, dark mode audit | ~5 files |

---

## 8. Key Technical Decisions

1. **No new dependencies required** — all needed libs are already in `package.json`
2. **All components consume existing hooks** — `useCalculator`, `useResults`, `useSettings`, `useMadhab`, `useCalculationStore`
3. **Full RTL support** — all components use `I18nManager` and `flexDirection` auto-flipping
4. **Dark mode** — every component reads `useAppTheme()` for colors
5. **Haptics** — `expo-haptics` for stepper +/-, button presses, calculation success
6. **Accessibility** — all interactive elements have `accessibilityLabel` and `accessibilityRole`
7. **Performance** — `FlatList` for history (virtualized), `useCallback`/`useMemo` in components, skeleton loaders during async operations

---

## 9. Competitive Differentiators

| Feature | Merath | Typical Competitors |
|---|---|---|
| Madhab comparison | Side-by-side diff table with recommendation | Single madhab only |
| Visual charts | Animated donut + bar charts in results | Text-only tables |
| Calculation transparency | Step-by-step timeline with fiqh explanations | Black box results |
| RTL + 6 languages | Full RTL with Arabic numerals | Usually Arabic-only |
| Confidence scoring | Visual ring with factor breakdown | Not available |
| Export quality | Professional PDF with SVG charts | Basic text share |
| Dark mode | Full dark theme with MD3 colors | Light only |
| Offline-first | All calculations local, IndexedDB audit | Cloud-dependent |

---

## 10. Competitive Analysis — Design Benchmarks

### Apps Studied
- **Muslim Pro** (prayer times) — Clean card-based layout, green theme, good dark mode
- **Zakat Calculator** (various) — Simple stepper flows, but limited results visualization
- **Islamic Finance calculators** — Usually text-heavy, poor mobile UX
- **Wealthy (Saudi)** — Good Arabic typography, modern card patterns

### Merath Advantages Over Competitors
1. **Multi-madhab comparison** is unique — no competitor offers side-by-side fiqh diff
2. **Calculation transparency** (step-by-step timeline) builds trust
3. **Professional export** (PDF with charts) is enterprise-grade
4. **6-language RTL support** with proper Arabic numerals is rare
5. **Confidence scoring** gives users a trust indicator competitors lack

### Design Principles Borrowed from Top Apps
- **Muslim Pro**: Clean card spacing, green accent color confidence
- **Revolut/Fintech**: Animated number transitions, glass morphism cards
- **Notion**: Collapsible sections, clean hierarchy
- **Google Material Gallery**: MD3 chip selections, FAB patterns

---

## 11. Accessibility & Inclusivity

- All touch targets minimum 44x44px (via `ensureTouchTarget` from `lib/utils/responsive.ts`)
- Arabic numerals auto-convert via `toArabicNumerals()` / `fromArabicNumerals()`
- Color is never the sole indicator (always paired with icons/text)
- Screen reader labels on all interactive elements
- Dynamic type scaling via `moderateScale()`
- High contrast mode support (WCAG AA minimum)

---

## 12. Performance Budget

| Metric | Target |
|---|---|
| First meaningful paint | < 1.5s |
| Screen transition | < 300ms |
| Calculation feedback | < 100ms |
| List scroll FPS | 60fps |
| Bundle size increase | < 150KB |
| Memory per screen | < 50MB |

---

*This plan is the authoritative reference for the Merath UI/UX rebuild. Implementation will follow the phased approach in Section 7, with each phase completed and verified before proceeding to the next.*
