# Merath Development Guide

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Code Style Guide](#code-style-guide)
3. [Component Architecture](#component-architecture)
4. [Testing Strategy](#testing-strategy)
5. [Performance Guidelines](#performance-guidelines)
6. [Debugging](#debugging)

## Development Workflow

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/feature-name

# 2. Make changes and commit
git add .
git commit -m "feat: description of changes"

# 3. Push to remote
git push origin feature/feature-name

# 4. Create Pull Request on GitHub

# 5. After review, merge to main
git checkout main
git pull origin main
git merge feature/feature-name
git push origin main

# 6. Delete feature branch
git branch -d feature/feature-name
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Test addition/modification
- `ci`: CI/CD changes
- `chore`: Dependency updates

**Examples:**
```
feat(calculation): add fraction arithmetic

Implement fraction addition, subtraction, multiplication, and division
with automatic simplification for exact inheritance calculations.

Closes #123

fix(ui): button not responding to presses on Android

The TouchableOpacity opacity was set to 0.7 causing issues.
Changed to use proper activeOpacity configuration.

docs(readme): update installation instructions

Add step-by-step guide for iOS development setup.

perf(bundle): reduce app size by 50KB

Remove unused dependencies and enable tree-shaking.
```

### Branch Naming Convention

```
feature/feature-name       # New feature
fix/bug-description       # Bug fix
docs/documentation-update # Documentation
refactor/description      # Code refactoring
test/test-description     # Tests
perf/optimization-name    # Performance improvement
```

## Code Style Guide

### TypeScript/JavaScript

#### File Structure

```typescript
/**
 * @file components/CalculationButton.tsx
 * @description Button component for triggering calculations
 */

// 1. Imports (organized by type)
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../lib/design/theme';
import type { ButtonProps } from '../lib/types';

// 2. Type definitions
interface CalculationButtonProps {
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// 3. Component
export const CalculationButton: React.FC<CalculationButtonProps> = ({
  onPress,
  disabled = false,
  loading = false,
}) => {
  // Hooks
  const { colors, spacing } = useTheme();
  const [pressed, setPressed] = useState(false);

  // Handlers
  const handlePress = useCallback(() => {
    if (!disabled && !loading) {
      onPress();
    }
  }, [onPress, disabled, loading]);

  // Render
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.text}>
        {loading ? 'Calculating...' : 'Calculate'}
      </Text>
    </TouchableOpacity>
  );
};

// 4. Styles
const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#1F71BA',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});

// 5. Default export
export default CalculationButton;
```

#### Naming Conventions

```typescript
// Components: PascalCase
export const CalculationButton = () => {};
export const EstateInput = () => {};
export const ResultsDisplay = () => {};

// Functions: camelCase
function calculateInheritance(estate, heirs) {}
const performValidation = (data) => {};

// Constants: UPPER_SNAKE_CASE
const MAX_HEIRS = 100;
const DEFAULT_MADHAB = 'hanafi';
const CALCULATION_TIMEOUT = 5000;

// Types/Interfaces: PascalCase
interface Estate { }
type Madhab = 'hanafi' | 'maliki' | 'shafii' | 'hanbali';

// Private functions: camelCase with underscore
const _calculateShare = () => {};

// Boolean variables: is/has prefix
const isLoading = false;
const hasError = true;
const shouldReset = false;
```

#### Function Documentation

```typescript
/**
 * Calculates heir shares based on Islamic inheritance rules
 * @param madhab - Islamic school (hanafi, maliki, shafii, hanbali)
 * @param estate - Deceased's estate information
 * @param heirs - List of heirs with relationships
 * @returns Calculation result with distribution amounts
 * @throws ValidationError if input is invalid
 * @example
 * const result = calculateInheritance('hanafi', estate, heirs);
 */
export function calculateInheritance(
  madhab: Madhab,
  estate: Estate,
  heirs: Heir[]
): CalculationResult {
  // Implementation
}
```

### React Components

#### Functional Component Best Practices

```typescript
// ✓ Good: Memoized component with hooks
import React, { useCallback, useMemo } from 'react';

export const MyComponent = React.memo(({ data, onPress }: Props) => {
  const processedData = useMemo(() => processData(data), [data]);
  
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return <View onPress={handlePress}>{processedData}</View>;
});

// ✗ Bad: No memoization, recreates functions
export const MyComponent = ({ data, onPress }) => {
  const processedData = processData(data);
  
  const handlePress = () => {
    onPress();
  };

  return <View onPress={handlePress}>{processedData}</View>;
};
```

#### Hook Best Practices

```typescript
// ✓ Good: Extracted custom hook
function useCalculation(estate, heirs) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculate = useCallback(async () => {
    try {
      setLoading(true);
      const result = await engine.calculate(estate, heirs);
      setResult(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [estate, heirs]);

  return { result, loading, error, calculate };
}

// Use in component
const { result, loading, calculate } = useCalculation(estate, heirs);

// ✗ Bad: Complex logic in component
function Calculator({ estate, heirs }) {
  const [result, setResult] = useState(null);
  
  useEffect(() => {
    const calculate = async () => {
      const result = await engine.calculate(estate, heirs);
      setResult(result);
    };
    calculate();
  }, [estate, heirs]);

  return <View>...</View>;
}
```

## Component Architecture

### Folder Structure

```
components/
├── ui/                          # Design system components
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Loader.tsx
│   └── index.ts
├── CalculationButton.tsx         # Feature components
├── CalculationHistory.tsx
├── EstateInput.tsx
├── HeirSelector.tsx
├── MadhhabSelector.tsx
├── ResultsDisplay.tsx
└── index.ts                      # Export all components
```

### Component Hierarchy

```
App
├── CalculatorScreen (main screen)
│   ├── MadhhabSelector (select Islamic school)
│   ├── EstateInput (enter estate details)
│   │   └── ModernInput (UI component)
│   ├── HeirSelector (manage heirs)
│   │   ├── ModernCard (UI component)
│   │   └── ModernButton (UI component)
│   ├── CalculationButton (trigger calculation)
│   ├── ResultsDisplay (show results)
│   │   └── ModernCard (UI component)
│   └── CalculationHistory (view past calculations)
```

### Stateful vs Stateless Components

```typescript
// Stateless: Presentational component
const ResultCard: React.FC<{ result: CalculationResult }> = ({ result }) => (
  <Card>
    <Text>{result.distribution[0].amount}</Text>
  </Card>
);

// Stateful: Container component
export const CalculatorScreen = () => {
  const [estate, setEstate] = useState<Estate | null>(null);
  const [heirs, setHeirs] = useState<Heir[]>([]);
  const { result, calculate } = useInheritanceCalculator(madhab, estate, heirs);

  return (
    <View>
      <EstateInput onChange={setEstate} />
      <HeirSelector onChange={setHeirs} />
      <Button onPress={calculate} />
      {result && <ResultCard result={result} />}
    </View>
  );
};
```

## Testing Strategy

### Test File Naming

```
__tests__/
├── components.test.ts          # Component tests
├── hooks.test.ts               # Hook tests
├── inheritance.test.ts         # Engine tests
├── audit-log.test.ts           # Audit log tests
└── setup.ts                    # Test setup
```

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { calculateInheritance } from '../lib/inheritance';

describe('calculateInheritance', () => {
  let estate: Estate;
  let heirs: Heir[];

  beforeEach(() => {
    estate = {
      totalValue: 100000,
      currency: 'USD',
      debts: 5000,
    };

    heirs = [
      { id: '1', name: 'Wife', gender: 'female', relationship: 'spouse' },
      { id: '2', name: 'Son', gender: 'male', relationship: 'son' },
    ];
  });

  it('should calculate correct distribution for Hanafi madhab', () => {
    const result = calculateInheritance('hanafi', estate, heirs);
    
    expect(result.distributions).toHaveLength(2);
    expect(result.distributions[0].amount).toBe(18750);
    expect(result.distributions[1].amount).toBe(76250);
  });

  it('should handle empty heirs list', () => {
    expect(() => {
      calculateInheritance('hanafi', estate, []);
    }).toThrow('No heirs provided');
  });

  it('should validate input before calculation', () => {
    const invalidEstate = { totalValue: -1000, currency: 'USD' };
    const errors = validateEstate(invalidEstate);
    
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toContain('Total value must be positive');
  });
});
```

### Test Types

```typescript
// Unit tests: Test individual functions
it('should add fractions correctly', () => {
  const result = addFractions({ num: 1, den: 2 }, { num: 1, den: 3 });
  expect(result).toEqual({ num: 5, den: 6 });
});

// Integration tests: Test multiple components
it('should calculate and display results', async () => {
  const { result } = render(<Calculator {...testProps} />);
  
  const button = result.getByText('Calculate');
  fireEvent.press(button);
  
  await waitFor(() => {
    expect(result.getByText(/Total: /)).toBeTruthy();
  });
});

// Snapshot tests: Regression testing
it('should render correctly', () => {
  const { result } = render(<ResultsDisplay {...testProps} />);
  expect(result).toMatchSnapshot();
});
```

## Performance Guidelines

### Optimization Techniques

```typescript
// 1. Memoization
const MemoizedComponent = React.memo(Component);

// 2. useCallback for event handlers
const handlePress = useCallback(() => {
  onPress();
}, [onPress]);

// 3. useMemo for expensive calculations
const result = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

// 4. Lazy loading
const SettingsScreen = lazy(() => import('./SettingsScreen'));

// 5. Code splitting
export { default as CalculatorScreen } from './CalculatorScreen';
export { default as HistoryScreen } from './HistoryScreen';

// 6. Image optimization
<Image
  source={require('./logo.png')}
  resizeMode="contain"
  style={{ width: 100, height: 100 }}
/>

// 7. FlatList optimization
<FlatList
  data={items}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  removeClippedSubviews
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

### Bundle Size Optimization

```bash
# Analyze bundle size
npm run analyze

# Key metrics:
# - Total bundle: < 500KB
# - Initial load: < 2s
# - Calculation time: < 100ms
```

## Debugging

### React DevTools

```bash
# Install React DevTools
npm install -g react-devtools

# Start DevTools
react-devtools

# In app, open debugger menu (Cmd+D on iOS, Cmd+M on Android)
# Select "Debugger"
```

### Chrome DevTools

```bash
# Open in Chrome DevTools
# Press Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
# Select "React" tab
```

### Console Logging

```typescript
// ✓ Good: Clear, contextual logging
console.log('Calculation started:', { madhab, heirCount: heirs.length });
console.warn('Legacy madhab detected, using hanafi as default');
console.error('Calculation failed:', error.message);

// ✗ Bad: Unclear logging
console.log('calc');
console.log(result);
```

### Breakpoints

```typescript
// Set breakpoint in code
function calculateInheritance(madhab, estate, heirs) {
  debugger; // Execution pauses here when debugger is open
  
  // Code execution
}
```

---

## Standards Checklist

Before submitting code:

- [ ] Code follows naming conventions
- [ ] Functions are documented with JSDoc
- [ ] Types are properly defined
- [ ] No console errors/warnings
- [ ] Tests pass (`npm test`)
- [ ] Linting passes (`npm run lint`)
- [ ] TypeScript checks pass (`npm run type-check`)
- [ ] No console.log statements remain
- [ ] Comments explain "why", not "what"
- [ ] PR has description of changes

---

**Last Updated**: 2024
**Maintained By**: Merath Development Team
