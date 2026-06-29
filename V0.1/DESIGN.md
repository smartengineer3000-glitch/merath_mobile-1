# DESIGN.md - Merath Design System

## Design Philosophy

Merath's design system is built on **Material Design 3 principles** with cultural sensitivity for Islamic users. The design prioritizes:

- **Trust & Authority**: Professional, scholarly appearance
- **Clarity**: Complex information presented simply
- **Accessibility**: WCAG AA compliance for all users
- **Cultural Appropriateness**: Arabic-first design with RTL support
- **Modern Polish**: Smooth animations and tactile feedback

## Color System

### Primary Palette - Islamic Green (#2e7d32)
**Purpose**: Trust, growth, nature, and Islamic identity
**Usage**: Primary actions, navigation, brand elements

```typescript
Light variants:
- light: #f0f9f6 (subtle backgrounds)
- lighter: #d4f1e9 (tinted surfaces)
- light50: #a8e4d6 (hover states)
- light100: #7dd4be (subtle highlights)
- light200: #5cc9ac (accent highlights)
- main: #2e7d32 (primary color)
- dark100: #2d6b2a (pressed states)
- dark200: #2a5a23 (active states)
- dark300: #27491d (deep accents)
- dark: #1f3817 (text on light backgrounds)
```

### Secondary Palette - Professional Blue (#4f9eff)
**Purpose**: Calm, stability, information
**Usage**: Secondary actions, informational elements, links

```typescript
Light variants:
- light: #f0f5ff (subtle backgrounds)
- lighter: #d9eaff (tinted surfaces)
- light50: #b3d5ff (hover states)
- light100: #8dbfff (subtle highlights)
- light200: #67aaff (accent highlights)
- main: #4f9eff (secondary color)
- dark100: #4680e6 (pressed states)
- dark200: #3d62cd (active states)
- dark300: #3a59bd (deep accents)
- dark: #33439f (text on light backgrounds)
```

### Tertiary Palette - Warm Gold (#ffa500)
**Purpose**: Energy, emphasis, special attention
**Usage**: Call-to-actions, warnings, highlights

```typescript
Light variants:
- light: #fffbf0 (subtle backgrounds)
- lighter: #ffe8cc (tinted surfaces)
- light50: #ffd699 (hover states)
- light100: #ffc266 (subtle highlights)
- light200: #ffb340 (accent highlights)
- main: #ffa500 (tertiary color)
- dark100: #ff9500 (pressed states)
- dark200: #ff8500 (active states)
- dark300: #e67000 (deep accents)
- dark: #b35900 (text on light backgrounds)
```

### Neutral Palette - Professional Grays
**Purpose**: Structure, hierarchy, readability
**Usage**: Text, borders, backgrounds, separators

```typescript
- white: #ffffff (primary background)
- light50: #f9fafb (secondary background)
- light100: #f3f4f6 (tertiary background)
- light200: #e5e7eb (borders, dividers)
- light300: #d1d5db (disabled text)
- light400: #9ca3af (secondary text)
- main: #6b7280 (body text)
- dark100: #4b5563 (subheadings)
- dark200: #374151 (headings)
- dark300: #1f2937 (primary text)
- black: #111827 (text on light backgrounds)
```

### Semantic Colors
**Optimized for WCAG AA contrast (4.5:1 minimum)**

```typescript
Success:
- light: #e8f5e9 (background)
- main: #2e7d32 (text/icon)
- dark: #1b5e20 (strong emphasis)

Warning:
- light: #fff3e0 (background)
- main: #e65100 (text/icon)
- dark: #bf360c (strong emphasis)

Error:
- light: #ffebee (background)
- main: #d32f2f (text/icon)
- dark: #b71c1c (strong emphasis)

Info:
- light: #e3f2fd (background)
- main: #1565c0 (text/icon)
- dark: #0d47a1 (strong emphasis)
```

### Dark Mode Colors
Dark mode inverts the color palette while maintaining the same semantic relationships:

```typescript
Background:
- light: #121212 (primary background)
- lightVariant: #1a1a2e (secondary background)
- dark: #f9fafb (inverted for dark mode surfaces)
- darkVariant: #f3f4f6 (inverted for dark mode cards)

Primary colors are lightened for visibility on dark backgrounds:
- main: #4CAF50 (lighter than light mode)
- dark variants become progressively lighter

Text colors are inverted:
- white becomes the darkest
- black becomes the lightest
```

## Typography System

### Font Families

**Arabic (Primary for RTL)**
- Family: Cairo
- Weights: 400 (Regular), 700 (Bold)
- Optimized for Arabic script readability
- Downloaded from @fontsource/cairo

**English (Primary for LTR)**
- Family: Plus Jakarta Sans
- Weights: 400 (Regular), 700 (Bold)
- Modern, professional sans-serif
- Downloaded from @fontsource/plus-jakarta-sans

**Fallback**
- Family: system-ui
- Platform default fonts when custom fonts fail to load

### Typography Scale

#### Display Scale (Prominent Headlines)
```typescript
display.large:
  fontSize: 32px
  lineHeight: 40px
  fontWeight: 700
  letterSpacing: 0

display.medium:
  fontSize: 28px
  lineHeight: 36px
  fontWeight: 700
  letterSpacing: 0

display.small:
  fontSize: 24px
  lineHeight: 32px
  fontWeight: 700
  letterSpacing: 0
```

**Usage**: App titles, splash screens, major section headers

#### Headline Scale (Section Headings)
```typescript
headline.large:
  fontSize: 20px
  lineHeight: 28px
  fontWeight: 800
  letterSpacing: -0.5

headline.medium:
  fontSize: 18px
  lineHeight: 26px
  fontWeight: 700
  letterSpacing: -0.25

headline.small:
  fontSize: 16px
  lineHeight: 24px
  fontWeight: 600
  letterSpacing: 0
```

**Usage**: Screen titles, card headers, section headings

#### Title Scale (Component Titles)
```typescript
title.large:
  fontSize: 16px
  lineHeight: 24px
  fontWeight: 600
  letterSpacing: 0.15

title.medium:
  fontSize: 14px
  lineHeight: 20px
  fontWeight: 600
  letterSpacing: 0.1

title.small:
  fontSize: 12px
  lineHeight: 18px
  fontWeight: 500
  letterSpacing: 0.1
```

**Usage**: Button text, card titles, list item headers

#### Body Scale (Main Content)
```typescript
body.large:
  fontSize: 16px
  lineHeight: 24px
  fontWeight: 400
  letterSpacing: 0.5

body.medium:
  fontSize: 14px
  lineHeight: 20px
  fontWeight: 400
  letterSpacing: 0.25

body.small:
  fontSize: 12px
  lineHeight: 18px
  fontWeight: 400
  letterSpacing: 0.4
```

**Usage**: Paragraphs, descriptions, form labels

#### Label Scale (Buttons, Labels, Small Text)
```typescript
label.large:
  fontSize: 14px
  lineHeight: 20px
  fontWeight: 500
  letterSpacing: 0.1

label.medium:
  fontSize: 12px
  lineHeight: 16px
  fontWeight: 500
  letterSpacing: 0.5

label.small:
  fontSize: 11px
  lineHeight: 16px
  fontWeight: 500
  letterSpacing: 0.5
```

**Usage**: Captions, helper text, button labels, tags

## Spacing System

**Base Grid**: 8pt system for consistent spacing

```typescript
xs: 4px   (0.5x - tight spacing)
sm: 8px   (1x - base unit)
md: 12px  (1.5x - comfortable spacing)
lg: 16px  (2x - section spacing)
xl: 24px  (3x - component spacing)
xxl: 32px (4x - major spacing)
xxxl: 48px (6x - screen-level spacing)
```

**Usage Guidelines**:
- xs: Icon padding, tight borders
- sm: Internal component spacing, button padding
- md: Form input padding, card internal spacing
- lg: Section margins, component gaps
- xl: Screen padding, major section gaps
- xxl: Hero section spacing, modal padding
- xxxl: Full-screen layout spacing

## Border Radius

```typescript
xs: 4px   (subtle rounding - tags, badges)
sm: 8px   (standard rounding - buttons, inputs)
md: 12px  (medium rounding - cards, panels)
lg: 16px  (large rounding - modals, sheets)
xl: 24px  (extra large - hero cards, onboarding)
full: 9999px (fully rounded - avatars, chips)
```

**Usage Guidelines**:
- xs: Small interactive elements, tags
- sm: Standard buttons, form inputs
- md: Content cards, panels
- lg: Modal cards, bottom sheets
- xl: Hero elements, onboarding cards
- full: Circular elements, floating action buttons

## Border Width

```typescript
hairline: 1px (subtle borders, dividers)
thin: 2px (standard borders)
medium: 3px (emphasized borders)
thick: 4px (only for sharp edges, rare)
```

**Usage Guidelines**:
- hairline: Subtle separators, disabled states
- thin: Standard input borders, card borders
- medium: Emphasized borders, active states
- thick: Rare usage, only for specific design needs

## Shadow System

**Based on Material Design 3 elevation system with colored shadows**

```typescript
none:
  elevation: 0
  shadowOpacity: 0

xs:
  elevation: 1
  shadowOffset: { width: 0, height: 1 }
  shadowOpacity: 0.05
  shadowRadius: 1

sm:
  elevation: 2
  shadowOffset: { width: 0, height: 2 }
  shadowOpacity: 0.08
  shadowRadius: 3

md:
  elevation: 3
  shadowOffset: { width: 0, height: 4 }
  shadowOpacity: 0.1
  shadowRadius: 6

lg:
  elevation: 6
  shadowOffset: { width: 0, height: 8 }
  shadowOpacity: 0.12
  shadowRadius: 12

xl:
  elevation: 8
  shadowOffset: { width: 0, height: 12 }
  shadowOpacity: 0.15
  shadowRadius: 16
```

### Colored Shadows (Thematic Depth)

```typescript
primary:
  shadowColor: #2e7d32
  elevation: 4
  shadowOpacity: 0.15
  shadowRadius: 8

secondary:
  shadowColor: #4f9eff
  elevation: 4
  shadowOpacity: 0.15
  shadowRadius: 8

tertiary:
  shadowColor: #ffa500
  elevation: 4
  shadowOpacity: 0.15
  shadowRadius: 8

inner:
  shadowColor: #000
  elevation: 2
  shadowOpacity: 0.05
  shadowRadius: 4
```

**Usage Guidelines**:
- none: Flat elements, disabled states
- xs: Subtle elevation, small cards
- sm: Standard elevation, buttons
- md: Elevated cards, panels
- lg: Modal cards, bottom sheets
- xl: Hero elements, onboarding cards
- primary/secondary/tertiary: Thematic accents
- inner: Inset depth, input fields

## Animation System

### Duration Scale

```typescript
instant: 100ms (micro-interactions)
quick: 150ms (fast transitions)
standard: 200ms (standard transitions)
slow: 300ms (complex animations)
```

### Easing Functions

```typescript
ease: "ease" (default)
easeIn: "ease-in" (entering)
easeOut: "ease-out" (exiting)
easeInOut: "ease-in-out" (both)
```

### Reduced Motion Support

```typescript
reducedMotion:
  scale: 1
  opacity: 1
  duration: 0
  useNativeDriver: true
```

**Usage Guidelines**:
- instant: Button presses, hover states
- quick: Tooltips, small menus
- standard: Screen transitions, modal open/close
- slow: Complex multi-step animations
- Always respect user's reduced motion preferences

## Component Specifications

### Button
```typescript
height: 44px
minWidth: 120px
paddingHorizontal: 16px (Spacing.lg)
borderRadius: 12px (BorderRadius.md)
```

**Variants**:
- Primary: Background primary.main, text background.light
- Secondary: Background secondary.main, text background.light
- Tertiary: Background tertiary.main, text background.light
- Outline: Border primary.main, text primary.main
- Ghost: Transparent, text primary.main

### Input
```typescript
height: 44px
paddingHorizontal: 12px (Spacing.md)
paddingVertical: 12px (Spacing.md)
borderRadius: 12px (BorderRadius.md)
borderWidth: 1 (BorderWidth.hairline)
```

**States**:
- Default: Border neutral.light200, text neutral.dark300
- Focused: Border primary.main, shadow sm
- Error: Border error.main, text error.main
- Disabled: Border neutral.light300, text neutral.light300

### Card
```typescript
borderRadius: 16px (BorderRadius.lg)
paddingHorizontal: 16px (Spacing.lg)
paddingVertical: 16px (Spacing.lg)
shadow: md
```

**Variants**:
- Default: Background background.light, shadow md
- Elevated: Background background.light, shadow lg
- Outlined: Background background.light, border neutral.light200
- Filled: Background neutral.light50

## Layout Patterns

### Screen Structure
```
┌─────────────────────────────┐
│ Status Bar (auto)           │
├─────────────────────────────┤
│ Header (optional)           │
│ - Title                     │
│ - Actions (back, menu)      │
├─────────────────────────────┤
│ Content Area                │
│ - Scrollable                │
│ - Safe area insets          │
├─────────────────────────────┤
│ Footer (optional)           │
│ - Primary action            │
│ - Secondary actions         │
└─────────────────────────────┘
```

### Card Structure
```
┌─────────────────────────────┐
│ Header (optional)           │
│ - Title + icon              │
│ - Badge/tag                 │
├─────────────────────────────┤
│ Body                        │
│ - Main content              │
│ - Subtext/details           │
├─────────────────────────────┤
│ Footer (optional)           │
│ - Actions                   │
│ - Metadata                  │
└─────────────────────────────┘
```

### Form Structure
```
┌─────────────────────────────┐
│ Section Title               │
├─────────────────────────────┤
│ Label                       │
│ [ Input field           ]   │
│ Helper text                 │
├─────────────────────────────┤
│ Label                       │
│ [ Input field           ]   │
│ Error message               │
└─────────────────────────────┘
```

## Iconography

### Icon Style
- **Style**: Outlined icons (Material Icons)
- **Size**: 24px (standard), 20px (compact), 32px (large)
- **Weight**: 400 (regular)
- **Color**: Inherits from text color or semantic colors

### Icon Usage Guidelines
- Use icons for visual hierarchy, not decoration
- Maintain consistent stroke width
- Use semantic colors for meaning (error, success, etc.)
- Support RTL by mirroring directional icons

## Responsive Design

### Breakpoints
```typescript
mobile: < 768px (primary target)
tablet: 768px - 1024px (future support)
desktop: > 1024px (future web support)
```

### Adaptive Spacing
- Base spacing remains consistent
- Content margins scale on larger screens
- Use percentage-based widths for flexibility

## Accessibility

### Color Contrast
- WCAG AA compliance (4.5:1 minimum)
- WCAG AAA compliance where possible (7:1)
- Never rely on color alone for meaning
- Provide text labels for color-coded elements

### Touch Targets
- Minimum 44x44px for interactive elements
- 48x48px recommended for primary actions
- 8px spacing between touch targets

### Screen Reader Support
- Semantic labels for all interactive elements
- ARIA labels for icons without text
- Announce state changes (loading, errors)
- Logical reading order

### Reduced Motion
- Respect user's motion preferences
- Provide instant transitions when preferred
- Disable parallax and complex animations

## RTL Support

### Direction
- Full RTL layout support for Arabic
- Mirrored navigation and layouts
- Right-aligned text and icons
- Adjusted padding/margins

### Typography
- Cairo font for Arabic text
- Proper line height for Arabic script
- Adjusted letter spacing
- Contextual font switching

### Icons
- Mirrored directional icons (arrows, chevrons)
- Neutral icons remain unchanged
- Consistent visual weight

## Dark Mode

### Implementation
- System-wide theme mode (light/dark)
- Smooth transition (200ms)
- Inverted color palette
- Maintained contrast ratios

### Guidelines
- All colors have dark mode variants
- Shadows adjusted for dark backgrounds
- Text colors inverted appropriately
- Semantic colors preserved

## Internationalization

### Supported Languages
- Arabic (primary, RTL)
- English (secondary, LTR)
- Urdu (RTL)
- Turkish (LTR)
- French (LTR)
- German (LTR)

### Text Direction
- Automatic direction based on language
- RTL support for Arabic, Urdu
- LTR support for English, Turkish, French, German

### Number Formatting
- Localized number formats
- Arabic numerals (0-9) for consistency
- Currency formatting based on locale
- Percentage formatting

## Design Tokens

### Usage in Code
```typescript
import { Colors, Typography, Spacing, BorderRadius, Shadows } from './lib/design/theme';

// Example usage
const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    shadow: Shadows.sm,
  },
  title: {
    ...theme.typography.headline.medium,
    color: theme.colors.neutral.dark300,
  },
});
```

## Design Principles in Practice

### 1. Clarity Over Complexity
- Use simple, direct language
- Avoid jargon unless necessary
- Provide context for technical terms
- Use visual hierarchy to guide attention

### 2. Consistency
- Use design tokens consistently
- Maintain spacing patterns
- Reuse component patterns
- Follow established conventions

### 3. Accessibility First
- Design for all users from the start
- Test with screen readers
- Ensure sufficient contrast
- Support keyboard navigation

### 4. Cultural Sensitivity
- Respect Islamic design principles
- Use appropriate imagery and icons
- Consider cultural context in copy
- Support Arabic-first experience

### 5. Performance
- Optimize image sizes
- Use system fonts when possible
- Minimize complex animations
- Test on lower-end devices

## Design Review Process

### Checklist
- [ ] WCAG AA contrast ratios met
- [ ] RTL layout tested
- [ ] Dark mode verified
- [ ] Touch targets adequate
- [ ] Screen reader labels present
- [ ] Reduced motion respected
- [ ] Design tokens used consistently
- [ ] Typography hierarchy clear
- [ ] Spacing system followed
- [ ] Color usage semantic

### Tools
- Color contrast checker
- Screen reader testing
- RTL layout testing
- Performance profiling
- Accessibility audit

## Future Enhancements

### Planned Improvements
- Motion system expansion
- Micro-interaction library
- Advanced component library
- Design system documentation site
- Figma design tokens integration

### Technical Improvements
- Design token automation
- Component testing framework
- Design linting tools
- Automated accessibility testing
- Performance monitoring

---

*This design system is maintained alongside the product and should be updated when new UI patterns are introduced or design guidelines change.*
