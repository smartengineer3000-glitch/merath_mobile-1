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
    input.heirs
  );

  const result = engine.calculate();

  if (result.success && result.shares) {
    const allocations: any = {};

    for (const s of result.shares) {
      // normalize to FractionClass-like decimal proxy
      allocations[s.key] = {
        toDecimal: () => s.fraction?.numerator / s.fraction?.denominator,
      } as any;
    }

    InvariantEngine.assertConservation(allocations);
  }

  return result;
}
