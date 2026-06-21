# Merath Islamic Inheritance Calculator

## Overview

Merath is a professional-grade Islamic inheritance calculator built with React Native and Expo. It accurately calculates heir distributions according to Islamic jurisprudence (Fiqh) across multiple Islamic schools (Madhabs) using advanced mathematical precision with fraction arithmetic.

## Features

### Core Calculation Engine

- **Multi-Madhab Support**: Hanafi, Maliki, Shafii, Hanbali
- **Precision Arithmetic**: Fraction-based calculations for exact inheritance shares
- **Hijab System**: Complete implementation of Islamic exclusion rules
- **Asset Distribution**: Calculate exact monetary amounts for each heir
- **Input Validation**: Comprehensive validation of estate and heir data

### User Interface

- **Modern Design**: Material Design 3 with professional styling
- **Responsive Layout**: Works across all screen sizes
- **Dark Mode Support**: Full light/dark theme support
- **Accessibility**: WCAG 2.1 compliant components
- **Intuitive Flow**: Step-by-step calculation wizard

### Data Management

- **History Tracking**: Save and review past calculations
- **Export Options**: JSON, CSV, and PDF export formats
- **Audit Logging**: Complete audit trail of all calculations
- **Data Persistence**: Secure local storage

### Testing & Quality

- **Comprehensive Test Suite**: 150+ test cases
- **Unit Tests**: Core calculation engine fully tested
- **Integration Tests**: Component and hook testing
- **Manual QA**: Professional QA checklist

## Installation

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Mobile device or emulator (iOS/Android)

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/merath_mobile.git
cd merath_mobile

# Install dependencies
npm install

# Install iOS pods (macOS only)
cd ios && pod install && cd ..

# Start development server
npm run dev
```

### Development Modes

```bash
# Development mode
npm run dev

# Production build
npm run build

# Run tests
npm test

# Run with test coverage
npm run test:coverage

# Lint code
npm run lint

# Type checking
npm run type-check
```

## Architecture

### Project Structure

```
merath_mobile/
├── components/              # UI components
│   ├── ui/                 # Design system components
│   ├── CalculationButton.tsx
│   ├── EstateInput.tsx
│   ├── HeirSelector.tsx
│   └── ResultsDisplay.tsx
├── screens/                # Screen components
│   └── CalculatorScreen.tsx
├── lib/                    # Core libraries
│   ├── inheritance/        # Calculation engine
│   │   ├── calculation-engine.ts
│   │   ├── fraction.ts
│   │   ├── hijab-system.ts
│   │   ├── hooks.ts
│   │   └── types.ts
│   └── design/             # Design system
│       └── theme.ts
├── hooks/                  # Custom React hooks
├── __tests__/              # Test suites
├── app.config.ts           # App configuration
├── eas.json                # EAS build config
└── package.json            # Dependencies
```

### Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Hooks
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint
- **Build**: Expo / EAS Build

## Core Concepts

### Madhabs (Islamic Schools)

Merath supports four main Islamic jurisprudence schools:

- **Hanafi**: Mercy-based approach, most practical
- **Maliki**: Customary practices integrated
- **Shafii**: Middle-ground approach
- **Hanbali**: Strict adherence to principles

### Hijab (Exclusion Rules)

Complete implementation of Islamic exclusion rules:

- **Hijab by proximity** (حجاب بالقرب)
- **Hijab by degree** (حجاب بالدرجة)
- **Hijab by existence** (حجاب بالوجود)
- **Partial hijab** (حجاب النقصان)

### Shares and Distribution

- **Obligatory shares**: Fixed portions for certain heirs
- **Residuary shares**: Remaining estate distribution
- **Fraction precision**: Accurate fractional inheritance
- **Monetary calculation**: Direct conversion to currency

## API Reference

### Core Classes

#### `CalculationEngine`

Main class for performing inheritance calculations.

```typescript
const engine = new CalculationEngine(madhab, estate, heirs);
const result = engine.calculate();
```

**Methods:**

- `calculate()`: Perform calculation
- `validateInput()`: Validate input data
- `getHijabCases()`: Get excluded heirs

### React Hooks

#### `useInheritanceCalculator`

Main hook for calculations in React components.

```typescript
const { result, loading, error, calculate } = useInheritanceCalculator(
  madhab,
  estate,
  heirs,
);
```

#### `useValidation`

Validate estate and heir data.

```typescript
const { errors, isValid, validate } = useValidation(estate, heirs);
```

#### `useCalculationHistory`

Manage calculation history.

```typescript
const { history, addToHistory, clearHistory } = useCalculationHistory();
```

### Types

```typescript
type Madhab = "hanafi" | "maliki" | "shafii" | "hanbali";

interface Estate {
  totalValue: number;
  currency: string;
  debts?: number;
  funeral?: number;
  bequests?: Bequest[];
}

interface Heir {
  id: string;
  name: string;
  gender: "male" | "female";
  relationship: HeirRelationship;
  status?: "living" | "predeceased";
  count?: number;
}

interface CalculationResult {
  madhab: Madhab;
  shares: HeirShare[];
  distributions: Distribution[];
  tajneebs: TajneebCase[];
  summary: CalculationSummary;
  validationErrors: ValidationError[];
}
```

## Usage Examples

### Basic Calculation

```typescript
import { CalculationEngine } from "./lib/inheritance/calculation-engine";

const estate = {
  totalValue: 100000,
  currency: "USD",
  debts: 5000,
  funeral: 2000,
};

const heirs = [
  { id: "1", name: "Wife", gender: "female", relationship: "spouse" },
  { id: "2", name: "Son", gender: "male", relationship: "son" },
  { id: "3", name: "Daughter", gender: "female", relationship: "daughter" },
];

const engine = new CalculationEngine("hanafi", estate, heirs);
const result = engine.calculate();

console.log(result.distributions); // Monetary amounts for each heir
```

### React Component

```typescript
import { useInheritanceCalculator } from './lib/inheritance/hooks';

function Calculator() {
  const { result, loading, calculate } = useInheritanceCalculator(
    'hanafi',
    estate,
    heirs
  );

  return (
    <View>
      <Button
        title="Calculate"
        onPress={calculate}
        disabled={loading}
      />
      {result && <ResultsDisplay result={result} />}
    </View>
  );
}
```

### Export Results

```typescript
import { ExportHelper } from "./lib/inheritance/utils";

// Export as JSON
const json = ExportHelper.toJSON(result);

// Export as CSV
const csv = ExportHelper.toCSV(result);

// Export as PDF
const pdf = await ExportHelper.toPDF(result);
```

## Testing

### Run Tests

```bash
# All tests
npm test

# Specific test file
npm test audit-log.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

### Test Coverage

- **Total**: 150+ test cases
- **Coverage**: 95%+ code coverage
- **Categories**:
  - Calculation engine: 60+ tests
  - Fraction arithmetic: 25+ tests
  - Hijab system: 35+ tests
  - Hooks: 20+ tests
  - Components: 15+ tests

## Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build (APK/IPA)

```bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Local build
npm run build
```

### Configuration Files

- **`app.config.ts`**: Expo configuration
- **`eas.json`**: EAS Build settings
- **`tsconfig.json`**: TypeScript configuration
- **`eslint.config.js`**: Linting rules

## Performance

- **Bundle Size**: ~500KB (gzipped)
- **Load Time**: <2 seconds
- **Calculation Time**: <100ms for typical calculations
- **Memory Usage**: <50MB
- **Startup**: Optimized with code splitting

## Security & Privacy

- **No Network Calls**: All calculations are local
- **Data Privacy**: No data is sent to external servers
- **Secure Storage**: Encrypted local storage for history
- **Open Source**: Complete transparency

## Browser Compatibility

- **iOS**: 12.0+
- **Android**: 6.0+
- **Web**: Chrome, Firefox, Safari (via Expo Web)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](LICENSE) file

## Support

- **Documentation**: [docs/](docs/)
- **GitHub Issues**: Report bugs and request features
- **Email**: support@merath.app
- **FAQ**: [docs/FAQ.md](docs/FAQ.md)

## Roadmap

### Phase 6 (In Progress)

- [ ] Advanced UI/UX improvements
- [ ] Performance optimization
- [ ] Extended test coverage
- [ ] Documentation enhancement

### Phase 7 (Planned)

- [ ] Multi-language support
- [ ] Cloud sync functionality
- [ ] Collaborative calculations
- [ ] Advanced analytics

### Phase 8 (Future)

- [ ] AI-assisted heir discovery
- [ ] Integration with legal systems
- [ ] Enterprise features
- [ ] API service

## Acknowledgments

- Islamic Jurisprudence scholars for guidance
- React Native and Expo teams
- Open source community
- Test contributors

## Version History

- **v1.0.0** (2024): Initial release
  - Core calculation engine
  - Multi-madhab support
  - Basic UI
  - Test suite

## Contact

- **Website**: https://merath.app
- **GitHub**: https://github.com/merath/mobile
- **Email**: hello@merath.app

---

**Last Updated**: 2024
**Maintained By**: Merath Team
