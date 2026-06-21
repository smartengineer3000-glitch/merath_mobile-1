# Merath Application Architecture

## Architecture Overview

The Merath application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  Screens (CalculatorScreen, HistoryScreen, etc.)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Component/UI Layer                          │
│  Reusable Components (Button, Card, Input, etc.)            │
│  Layout Components (Containers, Sections, etc.)             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  Custom Hooks (useInheritanceCalculator, etc.)              │
│  State Management & Data Handling                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Core Service Layer                         │
│  Calculation Engine (CalculationEngine)                     │
│  Validation (ValidationHelper)                              │
│  Export/Import (ExportHelper)                               │
│  Audit Logging (AuditLog)                                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Utility Layer                             │
│  Fraction Calculator, Date Utils, Format Utils             │
│  Storage Service, Cache Management                          │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
merath_mobile/
├── app.config.ts                 # Expo app configuration
├── eas.json                      # EAS Build configuration
├── metro.config.cjs              # Metro bundler config
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config
├── vitest.config.ts              # Vitest config
├── eslint.config.js              # ESLint config
│
├── screens/                      # Main screen components
│   ├── CalculatorScreen.tsx      # Main calculator UI
│   └── HistoryScreen.tsx         # Calculation history
│
├── components/                   # Reusable components
│   ├── ui/                       # Design system
│   │   ├── Button.tsx            # Modern button component
│   │   ├── Card.tsx              # Card component
│   │   ├── Input.tsx             # Text input component
│   │   └── index.ts              # Export all UI components
│   ├── CalculationButton.tsx    # Feature button
│   ├── CalculationHistory.tsx   # History display
│   ├── EstateInput.tsx          # Estate input component
│   ├── HeirSelector.tsx         # Heir management component
│   ├── MadhhabSelector.tsx      # Islamic school selector
│   ├── ResultsDisplay.tsx       # Results presentation
│   └── index.ts                 # Export all components
│
├── hooks/                        # Custom React hooks
│   ├── useInheritanceCalculator.ts
│   ├── useValidation.ts
│   ├── useCalculationHistory.ts
│   └── index.ts
│
├── lib/                          # Core libraries & utilities
│   ├── inheritance/              # Calculation engine
│   │   ├── calculation-engine.ts # Main engine class
│   │   ├── fraction.ts           # Fraction arithmetic
│   │   ├── hijab-system.ts       # Hijab/exclusion rules
│   │   ├── audit-log.ts          # Audit logging
│   │   ├── constants.ts          # Constants & configs
│   │   ├── types.ts              # Type definitions
│   │   ├── utils.ts              # Utility functions
│   │   ├── hooks.ts              # Custom hooks
│   │   ├── index.ts              # Public API
│   │   └── test-suite.ts         # Test helpers
│   │
│   ├── design/                   # Design system
│   │   ├── theme.ts              # Theme configuration
│   │   ├── colors.ts             # Color palette
│   │   └── typography.ts         # Typography scales
│   │
│   └── utils/                    # General utilities
│       ├── export.ts             # Export functionality
│       ├── validation.ts         # Input validation
│       ├── storage.ts            # Local storage
│       └── formatting.ts         # Data formatting
│
├── __tests__/                    # Test files
│   ├── setup.ts                  # Test setup & config
│   ├── inheritance.test.ts       # Engine tests
│   ├── components.test.ts        # Component tests
│   ├── hooks.test.ts             # Hook tests
│   └── audit-log.test.ts         # Audit log tests
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── API.md                    # API reference
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── FAQ.md                    # Frequently asked questions
│
└── README.md                     # Project README
```

## Data Flow Architecture

### Calculation Flow

```
User Input (Estate, Heirs, Madhab)
           ↓
      [Validation]
      • Check estate value
      • Check heir relationships
      • Detect conflicts
           ↓
   [Calculation Engine]
   • Calculate shares using madhab rules
   • Apply hijab system
   • Calculate monetary distribution
           ↓
      [Audit Logging]
      • Log calculation details
      • Record timestamp
      • Store results
           ↓
    [Results Display]
    • Show shares as fractions
    • Display monetary amounts
    • Present hijab cases
           ↓
    [Export Options]
    • JSON export
    • CSV export
    • PDF export
```

## Component Hierarchy

```
App
└── CalculatorScreen
    ├── MadhhabSelector
    │   └── ModernButton (select madhab)
    ├── EstateInput
    │   ├── ModernInput (total value)
    │   ├── ModernInput (debts)
    │   └── ModernInput (funeral)
    ├── HeirSelector
    │   ├── ModernCard (heir list)
    │   ├── ModernButton (add heir)
    │   └── ModernButton (remove heir)
    ├── CalculationButton
    │   └── ModernButton (calculate)
    ├── ResultsDisplay
    │   ├── ModernCard (summary)
    │   ├── ModernCard (distributions)
    │   ├── ModernCard (hijab cases)
    │   └── ModernButton (export)
    └── CalculationHistory
        ├── ModernCard (history item)
        └── ModernButton (load/delete)
```

## State Management Pattern

### Redux-free Architecture

Merath uses React Hooks for state management instead of Redux:

```typescript
// State hook
const [estate, setEstate] = useState<Estate | null>(null);
const [heirs, setHeirs] = useState<Heir[]>([]);
const [madhab, setMadhab] = useState<Madhab>("hanafi");

// Effect hook for side effects
useEffect(() => {
  // Load from storage
  loadCalculationHistory();
}, []);

// Custom hook for complex logic
const { result, loading, error, calculate } = useInheritanceCalculator(
  madhab,
  estate,
  heirs,
);

// Context for theme
const { colors, spacing } = useTheme();
```

### Benefits

- Simpler for team (less boilerplate)
- Better performance (no re-renders on unrelated state)
- Easier testing (mocking simpler)
- Smaller bundle size

## Calculation Engine Architecture

### Class Hierarchy

```
CalculationEngine
├── estate: Estate
├── heirs: Heir[]
├── madhab: Madhab
│
├── calculate(): CalculationResult
├── validateInput(): ValidationError[]
├── getHijabCases(): TajneebCase[]
│
└── Private Methods
    ├── _calculateShares(): HeirShare[]
    ├── _applyHijab(): void
    ├── _calculateDistributions(): Distribution[]
    └── _validateLogic(): void
```

### Calculation Algorithm

```
1. Input Validation
   └── Check estate value, heirs, madhab

2. Share Calculation
   ├── Identify fixed share holders (wives, daughters)
   ├── Calculate fixed shares as fractions
   ├── Calculate remaining (residue) for asaba (males)
   └── Distribute residue among asaba

3. Hijab Application
   ├── Check for primary hijab (بالقرب)
   ├── Check for secondary hijab (بالدرجة)
   ├── Check for tertiary hijab (بالوجود)
   └── Mark excluded heirs

4. Monetary Distribution
   ├── Calculate distributable amount
      └── Total - Debts - Funeral - Bequests
   ├── Multiply each share by distributable amount
   └── Generate final distribution

5. Result Compilation
   ├── Compile shares array
   ├── Compile distributions array
   ├── Compile hijab cases
   └── Generate summary
```

## Design System Architecture

### Theme System

```
Theme
├── Colors
│   ├── Primary (Islamic Blue)
│   ├── Secondary (Professional Slate)
│   ├── Accent (Gold)
│   ├── Error (Red)
│   ├── Surface (Background)
│   └── Text Colors
├── Spacing
│   ├── xs: 4px
│   ├── sm: 8px
│   ├── md: 12px
│   ├── lg: 16px
│   ├── xl: 24px
│   └── xxl: 32px
├── Border Radius
│   ├── xs: 4px
│   ├── sm: 8px
│   ├── md: 12px
│   ├── lg: 16px
│   ├── xl: 20px
│   └── full: 9999px
└── Typography
    ├── Display (Large, Medium, Small)
    ├── Headline (Large, Medium, Small)
    ├── Title (Large, Medium, Small)
    ├── Body (Large, Medium, Small)
    └── Label (Large, Medium, Small)
```

## Testing Architecture

### Test Pyramid

```
       /\
      /  \     E2E Tests (Few, Integration)
     /────\
    /      \   Component Tests (Some, Functional)
   /────────\
  /          \  Unit Tests (Many, Fast)
 /────────────\
```

### Test Coverage

```
Unit Tests (60%)
├── Fraction arithmetic: 25 tests
├── Calculation logic: 35 tests
└── Utilities: 10 tests

Integration Tests (25%)
├── Calculation pipeline: 8 tests
├── Export functionality: 5 tests
└── Validation flow: 3 tests

Component Tests (10%)
├── Button component: 5 tests
├── Card component: 3 tests
├── Input component: 3 tests
└── Form components: 4 tests

Hook Tests (5%)
├── useInheritanceCalculator: 3 tests
└── useCalculationHistory: 2 tests
```

## Performance Architecture

### Optimization Strategies

1. **Code Splitting**

   ```typescript
   // Lazy load screens
   const HistoryScreen = lazy(() => import("./screens/HistoryScreen"));
   ```

2. **Memoization**

   ```typescript
   const MemoizedComponent = React.memo(Component);
   const memoizedValue = useMemo(() => expensiveOp(), [dep]);
   ```

3. **Callbacks**

   ```typescript
   const handlePress = useCallback(() => {}, []);
   ```

4. **List Optimization**
   ```typescript
   <FlatList
     maxToRenderPerBatch={10}
     updateCellsBatchingPeriod={50}
   />
   ```

### Performance Metrics

```
Bundle Size:     ~500KB (gzipped)
Load Time:       <2 seconds
Calculation:     <100ms
Memory Usage:    <50MB
Startup:         <1 second
Frame Rate:      60 FPS
```

## Security Architecture

### Data Security

1. **No Network Calls**
   - All calculations are local
   - No data sent to servers

2. **Encrypted Storage**
   - Use SecureStore for sensitive data
   - Encrypted at-rest storage

3. **Input Validation**
   - All inputs validated
   - Type-safe with TypeScript
   - Range checks on all numeric inputs

4. **Error Handling**
   - Graceful error messages
   - No sensitive info in errors
   - Full error logging internally

## Deployment Architecture

### Build Pipeline

```
Source Code
    ↓
[Linting & Type Check]
    ↓
[Test Suite]
    ↓
[Build Process]
├── Native Binaries
├── Bundle Assets
└── Generate APK/IPA
    ↓
[Distribution]
├── App Store
├── Google Play
└── Web (Firebase Hosting)
```

### Version Management

- **Semantic Versioning**: MAJOR.MINOR.PATCH
- **Git Tags**: v1.0.0 format
- **Build Numbers**: Increment per build

---

## Key Design Principles

1. **Separation of Concerns**
   - UI logic separate from business logic
   - Components only handle presentation

2. **Reusability**
   - All components are reusable
   - Utilities are library-agnostic

3. **Testability**
   - Pure functions where possible
   - Dependency injection for testing

4. **Performance**
   - Optimize for mobile devices
   - Minimize re-renders

5. **Maintainability**
   - Clear code structure
   - Well-documented functions
   - Consistent patterns

---

**Last Updated**: 2024
**Maintained By**: Merath Architecture Team
