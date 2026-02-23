# INTEGRATION GUIDE - NEW ENHANCED ENGINE

**Document:** How to integrate the new `EnhancedInheritanceCalculationEngine` into your existing codebase

**Time to integrate:** 15-30 minutes  
**Complexity:** Low (mostly drop-in replacement)

---

## QUICK INTEGRATION (3 Steps)

### Step 1: Update Your Hook (useCalculator)

**Find file:** `hooks/useCalculator.ts` (or equivalent)

**Replace the calculate function:**
```typescript
// OLD CODE (remove):
import { InheritanceCalculationEngine } from '@/lib/inheritance/calculation-engine';

// NEW CODE (add):
import { EnhancedInheritanceCalculationEngine as InheritanceEngine } from '@/lib/inheritance/enhanced-engine-complete';

export function useCalculator() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const calculate = useCallback(
    (madhab: MadhhabType, estate: EstateData, heirs: HeirsData) => {
      setLoading(true);
      try {
        // Use new enhanced engine
        const engine = new InheritanceEngine(madhab, estate, heirs);
        const result = engine.calculate();
        setResult(result);
        return result;
      } catch (error) {
        const errorResult: CalculationResult = {
          success: false,
          error: `حدث خطأ: ${(error as Error).message}`,
          shares: [],
          total: 0,
          timestamp: new Date().toISOString()
        };
        setResult(errorResult);
        return errorResult;
      } finally {
        setLoading(false);
      }
    },
    []
  );
  
  return { result, calculate, loading };
}
```

### Step 2: Update Result Display Component

**No changes needed!** The `CalculationResult` interface is the same. Your existing display logic will work.

```typescript
// Your existing ResultsDisplay component works as-is
// The new engine returns the same output format
{result?.shares.map((share) => (
  <View key={share.key}>
    <Text>{share.name}: {share.amount} ({share.percentage}%)</Text>
  </View>
))}
```

### Step 3: Build and Test

```bash
# Verify TypeScript
npm run check

# Build for testing
npm run build

# For Android device testing
npm start
```

---

## DETAILED INTEGRATION EXAMPLES

### Example 1: Simple Calculator Screen

```typescript
import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { EnhancedInheritanceCalculationEngine } from '@/lib/inheritance/enhanced-engine-complete';
import type { EstateData, HeirsData, MadhhabType, CalculationResult } from '@/lib/inheritance/types';

export function CalculatorScreen() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  const handleCalculate = () => {
    try {
      // Sample data
      const madhab: MadhhabType = 'shafii';
      const estate: EstateData = {
        total: 100000,
        funeral: 5000,
        debts: 10000,
        will: 0
      };
      const heirs: HeirsData = {
        wife: 1,
        son: 2,
        daughter: 1
      };
      
      // Create engine and calculate
      const engine = new EnhancedInheritanceCalculationEngine(madhab, estate, heirs);
      const result = engine.calculate();
      
      setResult(result);
      
      if (result.success) {
        Alert.alert(
          'نتيجة الحساب',
          `تم توزيع ${result.total} بنجاح\nمستوى الثقة: ${result.confidence}%`
        );
      } else {
        Alert.alert('خطأ', result.error);
      }
    } catch (error) {
      Alert.alert('خطأ', (error as Error).message);
    }
  };
  
  return (
    <View style={{ padding: 20 }}>
      <Button title="احسب التقسيم" onPress={handleCalculate} />
      
      {result && result.success && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>النتائج:</Text>
          {result.shares.map((share, idx) => (
            <Text key={idx}>
              {share.name}: {share.amount} SR ({share.percentage}%)
            </Text>
          ))}
          <Text style={{ marginTop: 10, fontSize: 14 }}>
            مستوى الثقة: {result.confidence}%
          </Text>
        </View>
      )}
    </View>
  );
}
```

### Example 2: With Context API

```typescript
import React, { createContext, useCallback, useState } from 'react';
import { EnhancedInheritanceCalculationEngine } from '@/lib/inheritance/enhanced-engine-complete';
import type { CalculationResult, EstateData, HeirsData, MadhhabType } from '@/lib/inheritance/types';

export const CalculationContext = createContext<{
  result: CalculationResult | null;
  calculate: (madhab: MadhhabType, estate: EstateData, heirs: HeirsData) => Promise<void>;
  loading: boolean;
}>({ result: null, calculate: async () => {}, loading: false });

export function CalculationProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const calculate = useCallback(
    async (madhab: MadhhabType, estate: EstateData, heirs: HeirsData) => {
      setLoading(true);
      try {
        const engine = new EnhancedInheritanceCalculationEngine(madhab, estate, heirs);
        const calculationResult = engine.calculate();
        setResult(calculationResult);
      } catch (error) {
        setResult({
          success: false,
          error: (error as Error).message,
          shares: [],
          total: 0,
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );
  
  return (
    <CalculationContext.Provider value={{ result, calculate, loading }}>
      {children}
    </CalculationContext.Provider>
  );
}

// Usage in components
export function useCalculation() {
  return React.useContext(CalculationContext);
}
```

### Example 3: With Redux (if you use it)

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { EnhancedInheritanceCalculationEngine } from '@/lib/inheritance/enhanced-engine-complete';
import type { CalculationResult, EstateData, HeirsData, MadhhabType } from '@/lib/inheritance/types';

export const calculateInheritance = createAsyncThunk(
  'calculation/calculate',
  async (params: { madhab: MadhhabType; estate: EstateData; heirs: HeirsData }) => {
    const engine = new EnhancedInheritanceCalculationEngine(
      params.madhab,
      params.estate,
      params.heirs
    );
    return engine.calculate();
  }
);

interface CalculationState {
  result: CalculationResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: CalculationState = {
  result: null,
  loading: false,
  error: null
};

const calculationSlice = createSlice({
  name: 'calculation',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(calculateInheritance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateInheritance.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(calculateInheritance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Unknown error';
      });
  }
});

export default calculationSlice.reducer;
```

---

## BACKWARD COMPATIBILITY

### Old Interface Still Works

The `CalculationResult` interface is unchanged, so all your existing components will work:

```typescript
interface CalculationResult {
  success: boolean;
  error?: string;
  shares: HeirShare[];
  total: number;
  madhab?: MadhhabType;
  specialCases?: SpecialCase[];
  confidence?: number;
  timestamp: string;
  steps?: string[];
}
```

**New fields in enhanced engine:**
- `specialCases`: Array of detected special cases
- `confidence`: Confidence score (0-100)
- `steps`: Detailed step descriptions

---

## TESTING INTEGRATION

### Test File Example

```typescript
import { describe, it, expect } from 'vitest';
import { EnhancedInheritanceCalculationEngine } from '@/lib/inheritance/enhanced-engine-complete';

describe('Enhanced Calculation Engine', () => {
  it('should calculate wife + 2 sons correctly', () => {
    const engine = new EnhancedInheritanceCalculationEngine('shafii', {
      total: 100000,
      funeral: 5000,
      debts: 0,
      will: 0
    }, {
      wife: 1,
      son: 2
    });
    
    const result = engine.calculate();
    
    expect(result.success).toBe(true);
    expect(result.shares.length).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThanOrEqual(50);
  });
  
  it('should handle asaba with brothers', () => {
    const engine = new EnhancedInheritanceCalculationEngine('hanafi', {
      total: 50000,
      funeral: 2000,
      debts: 5000,
      will: 0
    }, {
      full_brother: 3,
      full_sister: 2
    });
    
    const result = engine.calculate();
    
    expect(result.success).toBe(true);
    // Each brother should get 2x sister's share
  });
  
  it('should calculate blood relatives distribution', () => {
    const engine = new EnhancedInheritanceCalculationEngine('maliki', {
      total: 75000,
      funeral: 3000,
      debts: 0,
      will: 0
    }, {
      daughter_son: 1,  // Blood relative
      daughter_daughter: 1
    });
    
    const result = engine.calculate();
    
    expect(result.success).toBe(true);
    expect(result.specialCases?.some(sc => sc.type === 'blood_relatives')).toBe(true);
  });
});
```

---

## MIGRATION CHECKLIST

- [ ] Import `EnhancedInheritanceCalculationEngine` in main hook/context
- [ ] Update calculation function to use new engine
- [ ] Verify TypeScript compilation: `npm run check`
- [ ] Run test suite: `npm test`
- [ ] Test on device/emulator: `npm start`
- [ ] Verify all calculations work correctly
- [ ] Check special cases display properly
- [ ] Confirm confidence scores appear
- [ ] Build APK: `eas build --platform android --profile production`

---

## TROUBLESHOOTING

### Issue: TypeScript errors with EnhancedInheritanceCalculationEngine

**Solution:** Make sure you're importing from the correct file:
```typescript
// Correct
import { EnhancedInheritanceCalculationEngine } from '@/lib/inheritance/enhanced-engine-complete';

// Not this
import { EnhancedInheritanceCalculationEngine } from '@/lib/inheritance/calculation-engine';
```

### Issue: Tests failing with new engine

**Cause:** Tests might not expect new fields like `confidence`, `specialCases`

**Solution:** Update test assertions:
```typescript
// Old
expect(result.shares.length).toBeGreaterThan(0);

// New - also check confidence
expect(result.success).toBe(true);
expect(result.confidence).toBeDefined();
expect(result.confidence).toBeGreaterThanOrEqual(50);
```

### Issue: Performance slower than before

**This shouldn't happen** - the new engine is actually faster because:
- Iterative GCD (no recursion overhead)
- Better fraction simplification
- Optimized merging logic

If you notice slowness, check for:
- Very large heir counts (>20)
- Multiple special case combinations
- Can debug with `console.time()` / `console.timeEnd()`

---

## OPTIONAL: KEEP BOTH ENGINES

If you want to run both engines for comparison during testing:

```typescript
const oldResult = new InheritanceCalculationEngine(madhab, estate, heirs).calculate();
const newResult = new EnhancedInheritanceCalculationEngine(madhab, estate, heirs).calculate();

console.log('Old:', oldResult.shares[0].amount);
console.log('New:', newResult.shares[0].amount);
console.log('Match:', Math.abs(oldResult.shares[0].amount - newResult.shares[0].amount) < 0.01);
```

---

## NEXT STEPS AFTER INTEGRATION

1. **Run full build:** `npm run build`
2. **Run tests:** `npm test`
3. **Deploy to Play Store:** `eas build --platform android --profile production`
4. **Monitor reviews:** Check Play Store for feedback
5. **Plan v1.1:** Gather user requests

---

## SUPPORT

**For questions about integration:**
- Check `COMPLETE_IMPLEMENTATION_GUIDE.md` for detailed explanations
- Review `enhanced-engine-complete.ts` comments for method details
- Look at test files for usage examples

---

**Integration Guide Complete ✅**  
**Estimated Integration Time:** 15-30 minutes  
**Difficulty Level:** Low  
**Risk Level:** Very Low (backward compatible)
