# Audit Report — Merath V0.1

**Date**: 2026-06-24  
**Command**: `/impeccable audit V0.1`  
**Register**: Product  

---

## Audit Health Score

| # | Dimension | Score | Key Finding |
|---|-----------|-------|-------------|
| 1 | Accessibility | 2/4 | Good ARIA labels, but `Alert.prompt` crashes on Android, emoji-icons, no reduced motion |
| 2 | Performance | 3/4 | `React.memo` + debounced search good; `AnimatedNumber` uses `useNativeDriver: false` |
| 3 | Theming | 3/4 | Excellent token system; **PDFExporter hardcodes `#1F71BA` instead of brand green `#2e7d32`** |
| 4 | Responsive Design | 3/4 | Narrow-screen card fallback works; Android crash from `Alert.prompt` |
| 5 | Anti-Patterns | 2/4 | 4 side-stripe borders in PDFExporter, uppercase eyebrow, emoji-icons |
| **Total** | | **13/20** | **Acceptable (significant work needed)** |

**Rating bands**: 18-20 Excellent (minor polish), 14-17 Good (address weak dimensions), 10-13 Acceptable (significant work needed), 6-9 Poor (major overhaul), 0-5 Critical (fundamental issues)

---

## Anti-Patterns Verdict

**FAIL — AI-generated tells remain.** The PDFExporter is the main offender: 4 side-stripe borders (`border-right: 2px solid #1F71BA`), wrong brand color (`#1F71BA` blue vs `#2e7d32` green), and emoji as icons. The CalculatorScreen has a tiny uppercase tracked eyebrow ("Merath Calculator"). These are the saturated AI scaffold patterns.

---

## Detailed Findings by Severity

### P0 — Blocking

**[P0] Side-stripe borders in PDFExporter**  
- **Location**: `lib/export/PDFExporter.ts` lines 339, 386, 459, 562  
- **Category**: Anti-Pattern  
- **Impact**: The #1 AI-generated tell. Side-stripe borders on metadata, summary, special cases, and disclaimer cards make the PDF look AI-generated.  
- **Recommendation**: Replace with full background tint + border-radius, or icon indicators, or nothing.  
- **Suggested command**: `/impeccable polish`

**[P0] Wrong brand color (`#1F71BA`) in PDFExporter**  
- **Location**: `lib/export/PDFExporter.ts` — 11+ locations (lines 317, 323, 339, 357, 374, 376, 420, 443, 459, 483, 526)  
- **Category**: Theming  
- **Impact**: Blue (`#1F71BA`) is used throughout the PDF while the brand is Islamic green (`#2e7d32`). Breaks brand consistency across the product.  
- **Recommendation**: Replace all `#1F71BA` with theme-based colors or at minimum the brand primary green.  
- **Suggested command**: `/impeccable polish`

### P1 — Major

**[P1] PDFExporter doesn't use design tokens**  
- **Location**: `lib/export/PDFExporter.ts` (entire file)  
- **Category**: Theming  
- **Impact**: Hardcoded `#666`, `#333`, `#e0e0e0`, `#f0f7ff` etc. The PDF won't respect dark mode and duplicates color values that already exist in the theme.  
- **Recommendation**: Pass theme colors into `generateHTML()` instead of hardcoding.  
- **Suggested command**: `/impeccable polish`

**[P1] `Alert.prompt` unavailable on Android**  
- **Location**: `components/HeirSelector.tsx` line 698  
- **Category**: Accessibility / Responsive  
- **Impact**: `Alert.prompt` is iOS-only. Long-press on heir count triggers a crash on Android devices.  
- **Recommendation**: Use a modal or inline TextInput instead of `Alert.prompt`.  
- **Suggested command**: `/impeccable harden`

**[P1] `AnimatedNumber` uses `useNativeDriver: false`**  
- **Location**: `components/ResultsDisplay.tsx` line 99  
- **Category**: Performance  
- **Impact**: Animating number values drives JS-thread re-renders on every frame. Potential jank on low-end devices.  
- **Recommendation**: Use `react-native-reanimated` for native-driven value animation, or remove the animation for simple number display.  
- **Suggested command**: `/impeccable optimize`

**[P1] Emoji as icons in PDF and share HTML**  
- **Location**: `lib/export/PDFExporter.ts` (lines 345, 393, 466, 571, 594, 619, 632, 655); `components/ResultsDisplay.tsx` line 368  
- **Category**: Accessibility  
- **Impact**: Emoji are not reliably rendered across platforms, are read as text by screen readers, and have unpredictable styling.  
- **Recommendation**: Use SVG icons or remove decorative emoji.  
- **Suggested command**: `/impeccable polish`

**[P1] Results display entrance animation too slow for product UI**  
- **Location**: `components/ResultsDisplay.tsx` lines 321-333  
- **Category**: Performance / Anti-Pattern  
- **Impact**: 500ms fade+slide on every results render. Product users in flow shouldn't wait for choreography. Per product register: 150–250 ms on most transitions.  
- **Recommendation**: Reduce to 200ms or remove (content ships visible by default).  
- **Suggested command**: `/impeccable animate`

### P2 — Minor

**[P2] CalculatorScreen uppercase tracked eyebrow**  
- **Location**: `screens/CalculatorScreen.tsx` line 294 (`.eyebrow` style, `textTransform: "uppercase"`)  
- **Category**: Anti-Pattern  
- **Impact**: The "Merath Calculator" small uppercase label above the hero text is the AI eyebrow scaffold pattern.  
- **Recommendation**: Remove or integrate into the heading naturally.  
- **Suggested command**: `/impeccable quieter`

**[P2] LoadingScreen pulse animation loops continuously**  
- **Location**: `components/LoadingScreen.tsx` lines 56-71  
- **Category**: Performance / Accessibility  
- **Impact**: Infinite `Animated.loop` of the logo pulse. Unbounded animation drains battery and is not reduced-motion safe.  
- **Recommendation**: Limit to 2-3 cycles, or remove the pulse entirely.  
- **Suggested command**: `/impeccable animate`

**[P2] No `prefers-reduced-motion` handling anywhere**  
- **Location**: Global  
- **Category**: Accessibility  
- **Impact**: All animations run at full speed regardless of user accessibility preferences.  
- **Recommendation**: Use `AccessibilityInfo.isReduceMotionEnabled()` and disable or simplify animations.  
- **Suggested command**: `/impeccable harden`

### P3 — Polish

**[P3] Hardcoded gradient background in share HTML**  
- **Location**: `components/ResultsDisplay.tsx` line 420  
- **Category**: Theming  
- **Impact**: `background: linear-gradient(135deg, #2e7d32 0%, #4f9eff 100%)` is decorative and won't match dark theme.  
- **Recommendation**: Use a solid brand color instead of gradient.  
- **Suggested command**: `/impeccable polish`

**[P3] Digit-by-digit screen reader issues in `AnimatedNumber`**  
- **Location**: `components/ResultsDisplay.tsx` lines 119-125  
- **Category**: Accessibility  
- **Impact**: Each digit is a child `<Text>` creating individual focusable elements. Screen readers read each digit separately.  
- **Recommendation**: Render a single `<Text>` with the formatted value.  
- **Suggested command**: `/impeccable harden`

---

## Patterns & Systemic Issues

1. **PDFExporter is disconnected from the design system.** It has its own hardcoded color palette (`#1F71BA`) that's completely different from the brand `#2e7d32`. This is the single biggest visual inconsistency in the app.

2. **Emoji-as-icon pattern** appears in PDFExporter (📊, 💰, ⚠️, ℹ️) and ResultsDisplay share text (📊, ⚖️). This isn't accessible, scalable, or reliably rendered.

3. **Entrance animations are too long** for a product tool. The LoadingScreen takes 800ms + spring, the ResultsDisplay takes 500ms. Product register says 150-250ms max.

---

## Positive Findings

- **Excellent token system** in `lib/design/theme.ts` — comprehensive, well-organized, light + dark themes
- **Components consistently use `useAppTheme`** — design tokens flow through Button, Card, Input, HeirSelector, CalculatorScreen
- **React Native components use accessibilityRole/label** on most interactive elements
- **HeirSelector uses `React.memo` + debounced search** — good performance hygiene
- **Touch targets are consistently 44x44px or larger** on interactive controls
- **Narrow-screen fallback** in ResultsDisplay (card layout < 360px) shows responsive thinking
- **Enhanced CalculatorScreen stepper** is well-executed — collapsible steps, completion badges, review step
- **Temp file cleanup** in PDFExporter shows engineering maturity

---

## Recommended Actions

1. **[P0] `/impeccable polish PDFExporter.ts`**: Replace side-stripe borders, fix `#1F71BA` → brand green, pass design tokens
2. **[P1] `/impeccable harden HeirSelector.tsx`**: Replace `Alert.prompt` with Android-compatible modal input
3. **[P1] `/impeccable optimize ResultsDisplay.tsx`**: Fix `useNativeDriver: false` in AnimatedNumber
4. **[P1] `/impeccable animate`**: Reduce entrance animation durations to 200ms across the app
5. **[P2] `/impeccable quieter CalculatorScreen.tsx`**: Remove/tone down the uppercase eyebrow
6. **[P2] `/impeccable harden`**: Add `AccessibilityInfo.isReduceMotionEnabled()` handling

---

You can ask me to run these one at a time, all at once, or in any order you prefer.

Re-run `/impeccable audit` after fixes to see your score improve.
