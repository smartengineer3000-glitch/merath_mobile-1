/**
 * Invariant Engine for Islamic Inheritance Calculations
 * Ensures conservation of estate: sum of all shares equals the total estate.
 */

interface Allocation {
  toDecimal: () => number;
}

export class InvariantEngine {
  /**
   * Assert that the sum of all allocations equals approximately 1 (the whole estate).
   * Throws if conservation is violated beyond tolerance.
   */
  static assertConservation(
    allocations: Record<string, Allocation>,
    tolerance: number = 1e-6,
  ): void {
    let total = 0;

    for (const key in allocations) {
      const value = allocations[key].toDecimal();
      if (!Number.isFinite(value)) {
        throw new Error(
          `[Invariant] Non-finite share for heir "${key}": ${value}`,
        );
      }
      total += value;
    }

    const deviation = Math.abs(total - 1);
    if (deviation > tolerance) {
      throw new Error(
        `[Invariant] Conservation violated: total shares = ${total.toFixed(10)}, expected 1.0, deviation = ${deviation.toFixed(10)}`,
      );
    }
  }
}
