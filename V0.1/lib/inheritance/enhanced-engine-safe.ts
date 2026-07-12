import { EnhancedInheritanceCalculationEngine } from "./enhanced-engine-complete";
import { InvariantEngine } from "./invariant";

/**
 * Safe wrapper around the inheritance engine
 * Adds invariant enforcement without modifying core engine
 */
export function runInheritanceCalculation(input: any) {
  const engine = new EnhancedInheritanceCalculationEngine(
    input.madhhab,
    input.estate,
    input.heirs,
  );

  const result = engine.calculate();

  if (result.success && result.shares) {
    const allocations: any = {};

    for (const s of result.shares) {
      if (!s.key || !s.fraction) continue;
      const num = s.fraction.numerator;
      const den = s.fraction.denominator;
      if (num == null || den == null || den === 0) continue;
      allocations[s.key] = {
        toDecimal: () => num / den,
      } as any;
    }

    InvariantEngine.assertConservation(allocations);
  }

  return result;
}
