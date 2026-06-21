# API Documentation

## Merath Islamic Inheritance Calculator - Complete API Reference

---

## Core Classes

### EnhancedInheritanceEngine

Main calculation engine for Islamic inheritance distribution.

```typescript
class EnhancedInheritanceEngine {
  constructor(madhab: MadhhabType, estate: EstateData, heirs: HeirsData);
  calculate(): CalculationResult;
  calculateWithSteps(): CalculationResult;
  getDebugInfo(): object;
}
```

**Methods:**

#### `calculate(): CalculationResult`

Execute inheritance calculation.

**Parameters:**

- None (uses constructor parameters)

**Returns:**

```typescript
interface CalculationResult {
  success: boolean;
  madhab: MadhhabType;
  madhhabName: string;
  netEstate: number;
  finalBase: number;
  shares: HeirShare[];
  blockedHeirs: string[];
  awlApplied: boolean;
  raddApplied: boolean;
  bloodRelativesApplied: boolean;
  confidence: number;
  calculationTime?: number;
  steps?: CalculationStep[];
}
```

**Example:**

```typescript
const engine = new EnhancedInheritanceEngine(
  "shafii",
  { total: 1000000, funeral: 50000, debts: 0, will: 0 },
  { son: 1, daughter: 2, wife: 1 },
);
const result = engine.calculate();
console.log(result.shares); // Array of heir shares
```

---

### FractionClass

Precise fraction arithmetic without floating-point errors.

```typescript
class FractionClass {
  constructor(numerator: number, denominator?: number);

  // Arithmetic operations
  add(other: FractionClass): FractionClass;
  subtract(other: FractionClass): FractionClass;
  multiply(factor: number): FractionClass;
  divide(divisor: number): FractionClass;

  // Conversions
  toDecimal(): number;
  toArabicName(): string;
  toString(): string;

  // Utilities
  simplify(): FractionClass;
  equals(other: FractionClass): boolean;

  // Properties
  numeratorValue: number;
  denominatorValue: number;
}
```

**Example:**

```typescript
const half = new FractionClass(1, 2);
const quarter = new FractionClass(1, 4);
const result = half.add(quarter); // 3/4
console.log(result.toDecimal()); // 0.75
console.log(result.toArabicName()); // "ثلاثة أرباع"
```

---

### HijabSystem

Islamic inheritance blocking rules implementation.

```typescript
class HijabSystem {
  constructor(madhab: MadhhabType);
  applyHijab(heirs: HeirsData): { heirs: HeirsData; log: string[] };
  checkInheritanceRights(heir: string): boolean;
}
```

**Methods:**

#### `applyHijab(heirs: HeirsData): Object`

Apply hijab (blocking) rules to heirs.

**Returns:**

```typescript
{
  heirs: HeirsData           // Modified heir list
  log: string[]              // Blocking explanation
}
```

**Example:**

```typescript
const hijab = new HijabSystem("shafii");
const result = hijab.applyHijab({
  son: 1,
  full_brother: 1,
  father: 1,
});
// full_brother will be blocked by son
// Result: { son: 1, full_brother: 0, father: 1 }
```

---

## React Hooks

### useCalculator()

Main hook for calculation management.

```typescript
function useCalculator() {
  return {
    estateData: EstateData
    updateEstateData: (updates: Partial<EstateData>) => void
    result: CalculationResult | null
    isCalculating: boolean
    error: string | null
    calculateWithMethod: (madhab: MadhhabType, heirs: HeirsData) => void
    resetCalculator: () => void
  }
}
```

**Example:**

```typescript
const { estateData, updateEstateData, result, calculateWithMethod } =
  useCalculator();

// Update estate
updateEstateData({ total: 500000, funeral: 25000 });

// Calculate
calculateWithMethod("shafii", { son: 1, daughter: 1 });
```

### useResults()

Manage calculation results and history.

```typescript
function useResults() {
  return {
    previousResults: CalculationResult[]
    addResult: (result: CalculationResult) => void
    clearHistory: () => void
    getResultById: (id: string) => CalculationResult | null
  }
}
```

---

## Type Definitions

### MadhhabType

```typescript
type MadhhabType = "shafii" | "hanafi" | "maliki" | "hanbali";
```

### EstateData

```typescript
interface EstateData {
  total: number; // Total assets
  funeral?: number; // Funeral & burial costs
  funeralCosts?: number; // Alternative name
  debts?: number; // Outstanding debts
  will?: number; // Will amount
  willAmount?: number; // Alternative name
}
```

### HeirsData

```typescript
interface HeirsData {
  husband?: number;
  wife?: number;
  son?: number;
  daughter?: number;
  father?: number;
  mother?: number;
  grandfather?: number;
  grandmother?: number;
  full_brother?: number;
  full_sister?: number;
  half_brother_paternal?: number;
  half_sister_paternal?: number;
  half_brother_maternal?: number;
  half_sister_maternal?: number;
  nephew_from_brother?: number;
  niece_from_brother?: number;
  uncle_paternal?: number;
  uncle_maternal?: number;
  aunt_paternal?: number;
  aunt_maternal?: number;
}
```

### HeirShare

```typescript
interface HeirShare {
  heir: string; // Heir key
  name: string; // Display name (Arabic)
  share: number; // Fraction (0-1)
  percentage: number; // Percentage (0-100)
  amount: number; // Amount in currency
  shareType: "calculated"; // Type
  madhab: MadhhabType; // Used madhab
}
```

---

## Validation Functions

### validateEstateData(estate: EstateData): ValidationResult

Validate estate data.

**Returns:**

```typescript
{
  valid: boolean
  errors: string[]
}
```

### validateHeirsData(heirs: HeirsData): ValidationResult

Validate heirs data.

**Returns:**

```typescript
{
  valid: boolean
  errors: string[]
  warnings: string[]
}
```

---

## Constants

### FIQH_DATABASE

Complete madhab configurations and rules.

```typescript
const FIQH_DATABASE = {
  madhabs: {
    shafii: { name: 'Shafi\'i', code: 'SH', ... },
    hanafi: { name: 'Hanafi', code: 'HA', ... },
    maliki: { name: 'Maliki', code: 'MA', ... },
    hanbali: { name: 'Hanbali', code: 'HB', ... }
  },
  hijabRules: {
    shafii: [ /* 8+ rules */ ],
    // ... other madhabs
  },
  shares: {
    husband: 1/2,
    wife: 1/4,
    // ... all heir shares
  }
}
```

---

## Components

### EstateInput

Input component for estate data.

```typescript
interface EstateInputProps {
  onEstateChange?: (estate: EstateData) => void;
  initialEstate?: EstateData;
}

function EstateInput(props: EstateInputProps): JSX.Element;
```

### HeirSelector

Multi-select component for heirs.

```typescript
interface HeirSelectorProps {
  onHeirsChange?: (heirs: HeirsData) => void;
  initialHeirs?: HeirsData;
}

function HeirSelector(props: HeirSelectorProps): JSX.Element;
```

### ResultsDisplay

Display calculation results.

```typescript
interface ResultsDisplayProps {
  result?: CalculationResult | null;
  onClose?: () => void;
}

function ResultsDisplay(props: ResultsDisplayProps): JSX.Element;
```

---

## Error Handling

### Custom Errors

```typescript
class ValidationError extends Error {
  constructor(message: string, field?: string);
}

class CalculationError extends Error {
  constructor(message: string, madhab?: string);
}
```

### Error Example

```typescript
try {
  const engine = new EnhancedInheritanceEngine(madhab, estate, heirs);
  const result = engine.calculate();
} catch (error) {
  if (error instanceof ValidationError) {
    console.error("Invalid input:", error.message);
  } else if (error instanceof CalculationError) {
    console.error("Calculation failed:", error.message);
  }
}
```

---

## Performance Tips

1. **Cache Results**: Use built-in LRU cache (1000 entries)
2. **Batch Calculations**: Calculate multiple madhabs together
3. **Memoize Components**: Use React.memo for ResultsDisplay
4. **Lazy Load**: Load screens on demand

---

## Examples

### Complete Calculation

```typescript
import { EnhancedInheritanceEngine } from "./lib/inheritance";

const estate = {
  total: 1000000,
  funeral: 50000,
  debts: 100000,
  will: 0,
};

const heirs = {
  husband: 1,
  daughter: 2,
  mother: 1,
  full_brother: 1,
};

const engine = new EnhancedInheritanceEngine("shafii", estate, heirs);
const result = engine.calculate();

console.log(`Net Estate: ${result.netEstate}`);
result.shares.forEach((share) => {
  console.log(`${share.name}: ${share.amount} (${share.percentage}%)`);
});
```

### Multi-Madhab Comparison

```typescript
const madhabs = ["shafii", "hanafi", "maliki", "hanbali"];

const results = madhabs.map((madhab) => {
  const engine = new EnhancedInheritanceEngine(madhab, estate, heirs);
  return engine.calculate();
});

// Compare results
results.forEach((result) => {
  console.log(`${result.madhhabName}:`);
  result.shares.forEach((share) => {
    console.log(`  ${share.name}: ${share.percentage}%`);
  });
});
```

---

**Last Updated**: January 21, 2026  
**Version**: 1.0.0  
**API Stability**: Stable
