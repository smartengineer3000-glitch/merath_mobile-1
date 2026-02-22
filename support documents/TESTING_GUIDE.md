# Merath Testing Guide

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [Component Testing](#component-testing)
5. [Hook Testing](#hook-testing)
6. [Test Coverage](#test-coverage)
7. [CI/CD Testing](#cicd-testing)

## Testing Overview

### Test Framework

- **Framework**: Vitest (Jest-compatible)
- **Assertion Library**: Vitest built-in
- **React Testing**: React Testing Library
- **Mocking**: Vitest mocking utilities

### Running Tests

```bash
# Run all tests
npm test

# Run with watch mode
npm test -- --watch

# Run specific file
npm test -- inheritance.test.ts

# Run with coverage
npm test -- --coverage

# Run specific test
npm test -- --t "should calculate distribution"
```

## Unit Testing

### Fraction Arithmetic Tests

```typescript
// __tests__/inheritance.test.ts
import { describe, it, expect } from 'vitest';
import { Fraction } from '../lib/inheritance/fraction';

describe('Fraction Arithmetic', () => {
  describe('Addition', () => {
    it('should add two simple fractions', () => {
      const f1 = new Fraction(1, 2);
      const f2 = new Fraction(1, 3);
      const result = f1.add(f2);
      
      expect(result.numerator).toBe(5);
      expect(result.denominator).toBe(6);
    });

    it('should simplify result after addition', () => {
      const f1 = new Fraction(1, 2);
      const f2 = new Fraction(1, 2);
      const result = f1.add(f2);
      
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(1);
    });

    it('should handle addition with zero', () => {
      const f1 = new Fraction(1, 2);
      const f2 = new Fraction(0, 1);
      const result = f1.add(f2);
      
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(2);
    });
  });

  describe('Multiplication', () => {
    it('should multiply fractions correctly', () => {
      const f1 = new Fraction(2, 3);
      const f2 = new Fraction(3, 4);
      const result = f1.multiply(f2);
      
      expect(result.numerator).toBe(1);
      expect(result.denominator).toBe(2);
    });
  });

  describe('Division', () => {
    it('should divide fractions correctly', () => {
      const f1 = new Fraction(1, 2);
      const f2 = new Fraction(1, 3);
      const result = f1.divide(f2);
      
      expect(result.numerator).toBe(3);
      expect(result.denominator).toBe(2);
    });
  });

  describe('Simplification', () => {
    it('should simplify fractions to lowest terms', () => {
      const f = new Fraction(6, 8);
      const simplified = f.simplify();
      
      expect(simplified.numerator).toBe(3);
      expect(simplified.denominator).toBe(4);
    });
  });
});
```

### Calculation Engine Tests

```typescript
describe('CalculationEngine', () => {
  let engine: CalculationEngine;
  let estate: Estate;
  let heirs: Heir[];

  beforeEach(() => {
    estate = {
      totalValue: 120000,
      currency: 'USD',
      debts: 10000,
      funeral: 5000,
    };

    heirs = [
      { id: '1', name: 'Wife', gender: 'female', relationship: 'spouse' },
      { id: '2', name: 'Son', gender: 'male', relationship: 'son' },
      { id: '3', name: 'Daughter', gender: 'female', relationship: 'daughter' },
    ];

    engine = new CalculationEngine('hanafi', estate, heirs);
  });

  describe('Hanafi Distribution', () => {
    it('should give wife 1/8 of distributable amount', () => {
      const result = engine.calculate();
      const wife = result.distributions.find(d => d.heirId === '1');
      
      const distributable = 120000 - 10000 - 5000;
      const expected = distributable / 8;
      
      expect(wife?.amount).toBeCloseTo(expected);
    });

    it('should give sons and daughters asaba shares', () => {
      const result = engine.calculate();
      const asabaShares = result.shares.filter(s => s.status === 'asaba');
      
      expect(asabaShares.length).toBe(2); // Son and Daughter
      expect(asabaShares[0].denominator).toBe(asabaShares[1].denominator);
    });
  });

  describe('Maliki Distribution', () => {
    it('should distribute according to Maliki madhab', () => {
      const malikeEngine = new CalculationEngine('maliki', estate, heirs);
      const result = malikeEngine.calculate();
      
      expect(result.madhab).toBe('maliki');
      expect(result.shares.length).toBe(3);
    });
  });

  describe('Hijab Cases', () => {
    it('should detect hijab of daughters by grandsons', () => {
      const heirstWithGrandson = [
        { id: '1', name: 'Granddaughter', gender: 'female', relationship: 'granddaughter' },
        { id: '2', name: 'Grandson', gender: 'male', relationship: 'grandson' },
      ];
      
      const engine = new CalculationEngine('hanafi', estate, heirstWithGrandson);
      const result = engine.calculate();
      
      expect(result.tajneebs.length).toBeGreaterThan(0);
      expect(result.tajneebs[0].excludedHeir).toBe('Granddaughter');
    });
  });

  describe('Input Validation', () => {
    it('should reject negative estate value', () => {
      const invalidEstate = { ...estate, totalValue: -1000 };
      const invalidEngine = new CalculationEngine('hanafi', invalidEstate, heirs);
      const errors = invalidEngine.validateInput();
      
      expect(errors.some(e => e.field === 'totalValue')).toBe(true);
    });

    it('should require at least one heir', () => {
      const invalidEngine = new CalculationEngine('hanafi', estate, []);
      const errors = invalidEngine.validateInput();
      
      expect(errors.some(e => e.type === 'NO_HEIRS')).toBe(true);
    });

    it('should reject conflicting heirs', () => {
      const conflictingHeirs = [
        { id: '1', name: 'Father', gender: 'male', relationship: 'father' },
        { id: '2', name: 'Grandfather', gender: 'male', relationship: 'grandfather' },
      ];
      
      const invalidEngine = new CalculationEngine('hanafi', estate, conflictingHeirs);
      const errors = invalidEngine.validateInput();
      
      expect(errors.some(e => e.type === 'CONFLICTING_HEIRS')).toBe(true);
    });
  });
});
```

## Integration Testing

### Calculation Flow

```typescript
describe('Calculation Flow Integration', () => {
  it('should perform complete calculation pipeline', async () => {
    const estate = {
      totalValue: 100000,
      currency: 'USD',
      debts: 5000,
      funeral: 2000,
    };

    const heirs = [
      { id: '1', name: 'Wife', gender: 'female', relationship: 'spouse' },
      { id: '2', name: 'Son', gender: 'male', relationship: 'son' },
      { id: '3', name: 'Daughter', gender: 'female', relationship: 'daughter' },
    ];

    // Step 1: Validate input
    const engine = new CalculationEngine('hanafi', estate, heirs);
    const errors = engine.validateInput();
    expect(errors).toHaveLength(0);

    // Step 2: Calculate shares
    const result = engine.calculate();
    expect(result).toBeDefined();
    expect(result.shares).toHaveLength(3);

    // Step 3: Verify distributions sum to total
    const total = result.distributions.reduce((sum, d) => sum + d.amount, 0);
    const expected = 100000 - 5000 - 2000;
    expect(total).toBeCloseTo(expected);

    // Step 4: Export results
    const json = ExportHelper.toJSON(result);
    expect(json).toBeDefined();
    expect(JSON.parse(json)).toEqual(result);
  });
});
```

## Component Testing

### ModernButton Component

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ModernButton } from '../components/ui/Button';

describe('ModernButton', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <ModernButton title="Click Me" onPress={() => {}} />
    );
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <ModernButton title="Click" onPress={onPress} />
    );
    
    fireEvent.press(getByText('Click'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    const onPress = vi.fn();
    const { getByText } = render(
      <ModernButton title="Click" onPress={onPress} disabled />
    );
    
    fireEvent.press(getByText('Click'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { getByTestId } = render(
      <ModernButton title="Click" onPress={() => {}} loading testID="button" />
    );
    
    expect(getByTestId('button-loader')).toBeTruthy();
  });

  it('should apply variant styles correctly', () => {
    const { getByTestId } = render(
      <ModernButton
        title="Error"
        onPress={() => {}}
        variant="danger"
        testID="error-button"
      />
    );
    
    const button = getByTestId('error-button');
    expect(button).toHaveStyle({ backgroundColor: expect.stringContaining('rgb') });
  });
});
```

### EstateInput Component

```typescript
describe('EstateInput', () => {
  it('should render input fields', () => {
    const { getByPlaceholderText } = render(
      <EstateInput onChange={() => {}} />
    );
    
    expect(getByPlaceholderText('Enter total estate value')).toBeTruthy();
    expect(getByPlaceholderText('Enter debts (optional)')).toBeTruthy();
  });

  it('should call onChange with updated values', () => {
    const onChange = vi.fn();
    const { getByPlaceholderText } = render(
      <EstateInput onChange={onChange} />
    );
    
    const input = getByPlaceholderText('Enter total estate value');
    fireEvent.changeText(input, '100000');
    
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ totalValue: 100000 })
    );
  });

  it('should validate input', () => {
    const onChange = vi.fn();
    const { getByPlaceholderText, getByText } = render(
      <EstateInput onChange={onChange} />
    );
    
    const input = getByPlaceholderText('Enter total estate value');
    fireEvent.changeText(input, '-1000');
    
    expect(getByText(/must be positive/i)).toBeTruthy();
  });
});
```

## Hook Testing

### useInheritanceCalculator Hook

```typescript
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useInheritanceCalculator } from '../lib/inheritance/hooks';

describe('useInheritanceCalculator', () => {
  const estate = {
    totalValue: 100000,
    currency: 'USD',
    debts: 5000,
  };

  const heirs = [
    { id: '1', name: 'Wife', gender: 'female', relationship: 'spouse' },
    { id: '2', name: 'Son', gender: 'male', relationship: 'son' },
  ];

  it('should initialize with null result', () => {
    const { result } = renderHook(() =>
      useInheritanceCalculator('hanafi', estate, heirs)
    );

    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should calculate on demand', async () => {
    const { result } = renderHook(() =>
      useInheritanceCalculator('hanafi', estate, heirs)
    );

    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.result).not.toBeNull();
    });

    expect(result.current.result?.distributions).toHaveLength(2);
  });

  it('should handle calculation errors', async () => {
    const { result } = renderHook(() =>
      useInheritanceCalculator('invalid-madhab', estate, [])
    );

    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });
  });

  it('should reset state on reset', async () => {
    const { result } = renderHook(() =>
      useInheritanceCalculator('hanafi', estate, heirs)
    );

    act(() => {
      result.current.calculate();
    });

    await waitFor(() => {
      expect(result.current.result).not.toBeNull();
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
```

## Test Coverage

### Target Coverage

- **Overall**: 90%+
- **Statements**: 90%+
- **Branches**: 85%+
- **Functions**: 90%+
- **Lines**: 90%+

### View Coverage Report

```bash
# Generate coverage report
npm test -- --coverage

# Open coverage in browser (if generated as HTML)
open coverage/index.html

# Key metrics:
# - calculation-engine.ts: 98%
# - fraction.ts: 100%
# - hijab-system.ts: 95%
# - components: 85%+
# - hooks: 90%+
```

## CI/CD Testing

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run type check
        run: npm run type-check
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```bash
# Install husky
npm install husky --save-dev

# Add pre-commit hook
npx husky add .husky/pre-commit "npm run lint && npm test"

# Add pre-push hook
npx husky add .husky/pre-push "npm run type-check && npm test"
```

## Testing Checklist

Before submitting code:

- [ ] All tests pass (`npm test`)
- [ ] Coverage above 90% (`npm test -- --coverage`)
- [ ] No console errors/warnings
- [ ] Added tests for new features
- [ ] Edge cases covered
- [ ] Error scenarios handled
- [ ] Integration tests pass
- [ ] Component snapshot tests updated

---

**Last Updated**: 2024
**Maintained By**: Merath QA Team
