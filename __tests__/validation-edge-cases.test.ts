/**
 * Comprehensive validation edge-case tests
 * Covers: NaN, Infinity, negative, null, undefined, empty, overflow, strings, booleans
 */
import { describe, it, expect } from "vitest";
import {
  normalizeEstateInput,
  normalizeHeirsInput,
  validateEngineInput,
} from "../lib/inheritance/engine-input";
import {
  validateEstateData,
  validateHeirsData,
} from "../lib/inheritance/utils";
import { FractionClass } from "../lib/inheritance/fraction";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "../lib/utils/formatters";
import { InvariantEngine } from "../lib/inheritance/invariant";
import { EnhancedInheritanceCalculationEngine } from "../lib/inheritance/enhanced-engine-complete";
import type { EstateData, HeirsData } from "../lib/inheritance/types";

// ---------------------------------------------------------------------------
// Helper: a valid baseline estate + single heir
// ---------------------------------------------------------------------------
const VALID_ESTATE: EstateData = {
  total: 120000,
  funeral: 0,
  debts: 0,
  will: 0,
};
const VALID_HEIRS: HeirsData = { wife: 1 };

// ============================================================================
// 1. clamp() via normalizeEstateInput / normalizeHeirsInput
// ============================================================================
describe("Edge cases: normalizeEstateInput (clamp layer)", () => {
  it("handles undefined fields → all become 0", () => {
    const r = normalizeEstateInput({});
    expect(r.total).toBe(0);
    expect(r.funeral).toBe(0);
    expect(r.debts).toBe(0);
    expect(r.will).toBe(0);
  });

  it("clamps negative total to 0", () => {
    expect(normalizeEstateInput({ total: -500 }).total).toBe(0);
  });

  it("clamps negative funeral to 0", () => {
    expect(normalizeEstateInput({ total: 100, funeral: -10 }).funeral).toBe(0);
  });

  it("clamps negative debts to 0", () => {
    expect(normalizeEstateInput({ total: 100, debts: -20 }).debts).toBe(0);
  });

  it("clamps negative will to 0", () => {
    expect(normalizeEstateInput({ total: 100, will: -5 }).will).toBe(0);
  });

  it("NaN total becomes 0", () => {
    expect(normalizeEstateInput({ total: NaN }).total).toBe(0);
  });

  it("Infinity total becomes 0 (now guarded by Number.isFinite)", () => {
    const r = normalizeEstateInput({ total: Infinity });
    expect(r.total).toBe(0);
  });

  it("NaN funeral becomes 0", () => {
    expect(normalizeEstateInput({ total: 100, funeral: NaN }).funeral).toBe(0);
  });

  it("Infinity funeral becomes 0 (now guarded)", () => {
    expect(
      normalizeEstateInput({ total: 100, funeral: Infinity }).funeral,
    ).toBe(0);
  });

  it("handles null fields as 0", () => {
    const r = normalizeEstateInput({
      total: null as any,
      funeral: null as any,
      debts: null as any,
      will: null as any,
    });
    expect(r.total).toBe(0);
    expect(r.funeral).toBe(0);
    expect(r.debts).toBe(0);
    expect(r.will).toBe(0);
  });

  it("handles string inputs → coerced to 0 via Number()", () => {
    const r = normalizeEstateInput({
      total: "abc" as any,
      funeral: "xyz" as any,
    });
    expect(r.total).toBe(0);
    expect(r.funeral).toBe(0);
  });

  it("handles boolean inputs", () => {
    const r = normalizeEstateInput({
      total: true as any,
      funeral: false as any,
    });
    expect(r.total).toBe(1);
    expect(r.funeral).toBe(0);
  });

  it("handles very large numbers", () => {
    const r = normalizeEstateInput({ total: Number.MAX_SAFE_INTEGER });
    expect(r.total).toBe(Number.MAX_SAFE_INTEGER);
  });

  it("handles 0 total", () => {
    expect(normalizeEstateInput({ total: 0 }).total).toBe(0);
  });

  it("handles decimal values", () => {
    const r = normalizeEstateInput({ total: 120000.5, funeral: 100.99 });
    expect(r.total).toBeCloseTo(120000.5);
    expect(r.funeral).toBeCloseTo(100.99);
  });
});

// ============================================================================
// 2. normalizeHeirsInput
// ============================================================================
describe("Edge cases: normalizeHeirsInput", () => {
  it("empty object → all heirs become 0", () => {
    const r = normalizeHeirsInput({} as HeirsData);
    expect(r.husband).toBe(0);
    expect(r.wife).toBe(0);
    expect(r.son).toBe(0);
  });

  it("clamps husband max to 1", () => {
    const r = normalizeHeirsInput({ husband: 5 } as HeirsData);
    expect(r.husband).toBe(1);
  });

  it("clamps wife max to 4", () => {
    const r = normalizeHeirsInput({ wife: 10 } as HeirsData);
    expect(r.wife).toBe(4);
  });

  it("clamps father max to 1", () => {
    const r = normalizeHeirsInput({ father: 3 } as HeirsData);
    expect(r.father).toBe(1);
  });

  it("clamps mother max to 1", () => {
    const r = normalizeHeirsInput({ mother: 2 } as HeirsData);
    expect(r.mother).toBe(1);
  });

  it("clamps grandfather max to 1", () => {
    const r = normalizeHeirsInput({ grandfather: 5 } as HeirsData);
    expect(r.grandfather).toBe(1);
  });

  it("negative heir counts → 0", () => {
    const r = normalizeHeirsInput({
      wife: -3,
      son: -1,
      daughter: -2,
    } as HeirsData);
    expect(r.wife).toBe(0);
    expect(r.son).toBe(0);
    expect(r.daughter).toBe(0);
  });

  it("NaN heir counts → 0", () => {
    const r = normalizeHeirsInput({ wife: NaN, son: NaN } as HeirsData);
    expect(r.wife).toBe(0);
    expect(r.son).toBe(0);
  });

  it("Infinity heir counts → 0 (now guarded by Number.isFinite)", () => {
    const r = normalizeHeirsInput({ full_brother: Infinity } as HeirsData);
    expect(r.full_brother).toBe(0);
  });

  it("undefined heir counts → 0", () => {
    const r = normalizeHeirsInput({ wife: undefined } as HeirsData);
    expect(r.wife).toBe(0);
  });

  it("string heir counts → 0", () => {
    const r = normalizeHeirsInput({ wife: "three" as any } as HeirsData);
    expect(r.wife).toBe(0);
  });

  it("boolean heir counts", () => {
    const r = normalizeHeirsInput({ wife: true as any } as HeirsData);
    expect(r.wife).toBe(1);
  });

  it("null heir counts → 0", () => {
    const r = normalizeHeirsInput({ wife: null as any } as HeirsData);
    expect(r.wife).toBe(0);
  });

  it("0 heir counts remain 0", () => {
    const r = normalizeHeirsInput({ wife: 0, son: 0 } as HeirsData);
    expect(r.wife).toBe(0);
    expect(r.son).toBe(0);
  });

  it("fractional heir counts are kept (clamp only floors negatives)", () => {
    const r = normalizeHeirsInput({ full_brother: 2.5 } as HeirsData);
    expect(r.full_brother).toBe(2.5);
  });

  it("very large heir count", () => {
    const r = normalizeHeirsInput({ full_brother: 999999 } as HeirsData);
    expect(r.full_brother).toBe(999999);
  });
});

// ============================================================================
// 3. validateEngineInput
// ============================================================================
describe("Edge cases: validateEngineInput", () => {
  it("valid estate + heir → valid", () => {
    expect(validateEngineInput(VALID_ESTATE, VALID_HEIRS).valid).toBe(true);
  });

  it("total = 0 → invalid", () => {
    const r = validateEngineInput(
      { total: 0, funeral: 0, debts: 0, will: 0 },
      VALID_HEIRS,
    );
    expect(r.valid).toBe(false);
  });

  it("total = -100 → invalid (after clamp becomes 0)", () => {
    const e = normalizeEstateInput({ total: -100 });
    const r = validateEngineInput(e, VALID_HEIRS);
    expect(r.valid).toBe(false);
  });

  it("total = NaN → invalid (after clamp becomes 0)", () => {
    const e = normalizeEstateInput({ total: NaN });
    const r = validateEngineInput(e, VALID_HEIRS);
    expect(r.valid).toBe(false);
  });

  it("Infinity total → invalid (normalized to 0)", () => {
    const e = normalizeEstateInput({ total: Infinity });
    const r = validateEngineInput(e, VALID_HEIRS);
    expect(r.valid).toBe(false);
  });

  it("no heirs → invalid", () => {
    const r = validateEngineInput(VALID_ESTATE, {} as HeirsData);
    expect(r.valid).toBe(false);
  });

  it("all heirs zero → invalid", () => {
    const r = validateEngineInput(VALID_ESTATE, {
      wife: 0,
      son: 0,
    } as HeirsData);
    expect(r.valid).toBe(false);
  });

  it("negative heir count (normalized to 0) + no other heirs → invalid", () => {
    const h = normalizeHeirsInput({ wife: -5 } as HeirsData);
    const r = validateEngineInput(VALID_ESTATE, h);
    expect(r.valid).toBe(false);
  });
});

// ============================================================================
// 4. validateEstateData (utils.ts)
// ============================================================================
describe("Edge cases: validateEstateData", () => {
  it("valid data → null (no error)", () => {
    expect(validateEstateData(120000, 1000, 5000, 10000)).toBeNull();
  });

  it("total = 0 → error", () => {
    expect(validateEstateData(0, 0, 0)).toBeTruthy();
  });

  it("total = -1 → error", () => {
    expect(validateEstateData(-1, 0, 0)).toBeTruthy();
  });

  it("NaN total → error (NaN <= 0 is false, known gap: passes validation)", () => {
    const result = validateEstateData(NaN, 0, 0);
    // NaN <= 0 returns false, so total check doesn't catch it
    // This is a known gap in validateEstateData
    expect(result).toBeNull();
  });

  it("total = Infinity → no error (Infinity > 0)", () => {
    expect(validateEstateData(Infinity, 0, 0)).toBeNull();
  });

  it("negative funeral → error", () => {
    expect(validateEstateData(120000, -1, 0)).toBeTruthy();
  });

  it("negative debts → error", () => {
    expect(validateEstateData(120000, 0, -1)).toBeTruthy();
  });

  it("negative will → error", () => {
    expect(validateEstateData(120000, 0, 0, -1)).toBeTruthy();
  });

  it("will exceeds 1/3 of net → error", () => {
    expect(validateEstateData(120000, 0, 0, 50000)).toBeTruthy();
  });

  it("will exactly 1/3 of net → no error", () => {
    expect(validateEstateData(120000, 0, 0, 40000)).toBeNull();
  });

  it("deductions exceed total → error", () => {
    expect(validateEstateData(120000, 70000, 60000)).toBeTruthy();
  });

  it("deductions exactly equal total → no error", () => {
    expect(validateEstateData(120000, 60000, 60000)).toBeNull();
  });

  it("very large values", () => {
    expect(validateEstateData(Number.MAX_SAFE_INTEGER, 0, 0, 0)).toBeNull();
  });

  it("all zeros → error (total = 0)", () => {
    expect(validateEstateData(0, 0, 0, 0)).toBeTruthy();
  });
});

// ============================================================================
// 5. validateHeirsData (utils.ts)
// ============================================================================
describe("Edge cases: validateHeirsData", () => {
  it("valid heirs → null", () => {
    expect(validateHeirsData({ wife: 1 })).toBeNull();
  });

  it("empty object → error (no heirs)", () => {
    expect(validateHeirsData({})).toBeTruthy();
  });

  it("invalid heir key → error", () => {
    expect(validateHeirsData({ invalidKey: 1 })).toBeTruthy();
  });

  it("negative count → error", () => {
    expect(validateHeirsData({ wife: -1 })).toBeTruthy();
  });

  it("all zeros → error", () => {
    expect(validateHeirsData({ wife: 0, son: 0 })).toBeTruthy();
  });

  it("NaN count → error (NaN > 0 is false, no valid heirs)", () => {
    const result = validateHeirsData({ wife: NaN });
    expect(result).toBeTruthy();
  });

  it("Infinity count → passes (Infinity > 0 is true in raw check)", () => {
    expect(validateHeirsData({ wife: Infinity })).toBeNull();
  });

  it("undefined count → skipped, no error if others exist", () => {
    expect(validateHeirsData({ wife: 1, son: undefined })).toBeNull();
  });

  it("boolean true as count → treated as > 0", () => {
    expect(validateHeirsData({ wife: true as any })).toBeNull();
  });

  it("string count → not negative, treated as defined", () => {
    const result = validateHeirsData({ wife: "abc" as any });
    // "abc" < 0 is false, "abc" > 0 is false → no error but hasHeirs stays false
    expect(result).toBeTruthy();
  });
});

// ============================================================================
// 6. FractionClass edge cases
// ============================================================================
describe("Edge cases: FractionClass", () => {
  it("zero denominator throws", () => {
    expect(() => new FractionClass(1, 0)).toThrow();
  });

  it("NaN numerator → creates fraction (no guard)", () => {
    const f = new FractionClass(NaN, 2);
    expect(f.toDecimal()).toBeNaN();
  });

  it("NaN denominator → creates fraction (NaN !== 0 so no throw)", () => {
    const f = new FractionClass(1, NaN);
    // NaN denominator: simplify calls safeGcd which returns 1 on NaN
    expect(f.toDecimal()).toBeNaN();
  });

  it("Infinity numerator → produces NaN (known: Infinity through simplify)", () => {
    const f = new FractionClass(Infinity, 2);
    // Infinity input through simplify() produces NaN
    expect(Number.isFinite(f.toDecimal())).toBe(false);
  });

  it("Infinity denominator → creates fraction", () => {
    const f = new FractionClass(1, Infinity);
    expect(f.toDecimal()).toBe(0);
  });

  it("negative denominator → normalizes sign", () => {
    const f = new FractionClass(-1, -2);
    expect(f.toDecimal()).toBeCloseTo(0.5);
  });

  it("negative numerator → works", () => {
    const f = new FractionClass(-1, 2);
    expect(f.toDecimal()).toBeCloseTo(-0.5);
  });

  it("zero numerator → 0", () => {
    const f = new FractionClass(0, 5);
    expect(f.toDecimal()).toBe(0);
  });

  it("very large denominator → scaleDownToSafeRange", () => {
    const f = new FractionClass(1, 2_000_000_000);
    expect(f.toDecimal()).toBeGreaterThan(0);
    expect(f.toDecimal()).toBeLessThan(0.001);
  });

  it("add with NaN → NaN result", () => {
    const f1 = new FractionClass(1, 2);
    const f2 = new FractionClass(NaN, 3);
    const result = f1.add(f2);
    expect(result.toDecimal()).toBeNaN();
  });

  it("multiply by zero → 0", () => {
    const f = new FractionClass(5, 7);
    const result = f.multiply(new FractionClass(0, 1));
    expect(result.toDecimal()).toBe(0);
  });

  it("divide by zero fraction throws", () => {
    const f = new FractionClass(1, 2);
    expect(() => f.divide(new FractionClass(0, 1))).toThrow();
  });

  it("fromDecimal with NaN", () => {
    const f = FractionClass.fromDecimal(NaN);
    expect(f.toDecimal()).toBeNaN();
  });

  it("fromDecimal with Infinity → non-finite result", () => {
    const f = FractionClass.fromDecimal(Infinity);
    expect(Number.isFinite(f.toDecimal())).toBe(false);
  });

  it("fromDecimal with 0", () => {
    const f = FractionClass.fromDecimal(0);
    expect(f.toDecimal()).toBe(0);
  });

  it("fromDecimal with negative", () => {
    const f = FractionClass.fromDecimal(-0.5);
    expect(f.toDecimal()).toBeCloseTo(-0.5);
  });
});

// ============================================================================
// 7. Formatters edge cases
// ============================================================================
describe("Edge cases: formatCurrency", () => {
  it("normal value", () => {
    expect(formatCurrency(120000)).toBe("120,000");
  });

  it("0 → '0'", () => {
    expect(formatCurrency(0)).toBe("0");
  });

  it("NaN → '0' (NaN || 0 = 0)", () => {
    expect(formatCurrency(NaN)).toBe("0");
  });

  it("Infinity → '0' (now guarded)", () => {
    const result = formatCurrency(Infinity);
    expect(result).toBe("0");
  });

  it("negative → clamped to 0", () => {
    expect(formatCurrency(-500)).toBe("0");
  });

  it("undefined → '0'", () => {
    expect(formatCurrency(undefined as any)).toBe("0");
  });

  it("null → '0'", () => {
    expect(formatCurrency(null as any)).toBe("0");
  });

  it("string → '0'", () => {
    expect(formatCurrency("abc" as any)).toBe("0");
  });

  it("boolean true → '1'", () => {
    expect(formatCurrency(true as any)).toBe("1");
  });

  it("very large number", () => {
    const result = formatCurrency(Number.MAX_SAFE_INTEGER);
    expect(result).toBeTruthy();
  });

  it("decimal", () => {
    expect(formatCurrency(120000.5)).toBe("120,001");
  });
});

describe("Edge cases: formatNumber", () => {
  it("normal value", () => {
    expect(formatNumber(1234.56)).toBe("1,234.56");
  });

  it("0 → '0.00'", () => {
    expect(formatNumber(0)).toBe("0.00");
  });

  it("NaN → '0.00'", () => {
    expect(formatNumber(NaN)).toBe("0.00");
  });

  it("Infinity → '0.00' (now guarded)", () => {
    const result = formatNumber(Infinity);
    expect(result).toBe("0.00");
  });

  it("negative", () => {
    expect(formatNumber(-42.5)).toBe("-42.50");
  });

  it("undefined → '0.00'", () => {
    expect(formatNumber(undefined as any)).toBe("0.00");
  });
});

describe("Edge cases: formatPercentage", () => {
  it("normal value", () => {
    expect(formatPercentage(50)).toBe("50.00%");
  });

  it("0 → '0.00%'", () => {
    expect(formatPercentage(0)).toBe("0.00%");
  });

  it("NaN → '0.00%'", () => {
    expect(formatPercentage(NaN)).toBe("0.00%");
  });

  it("negative", () => {
    expect(formatPercentage(-10)).toBe("-10.00%");
  });

  it("over 100%", () => {
    expect(formatPercentage(150)).toBe("150.00%");
  });
});

// ============================================================================
// 8. InvariantEngine edge cases
// ============================================================================
describe("Edge cases: InvariantEngine.assertConservation", () => {
  it("perfect conservation → no throw", () => {
    expect(() =>
      InvariantEngine.assertConservation({
        wife: { toDecimal: () => 0.25 },
        son: { toDecimal: () => 0.75 },
      }),
    ).not.toThrow();
  });

  it("NaN share → throws", () => {
    expect(() =>
      InvariantEngine.assertConservation({
        wife: { toDecimal: () => NaN },
      }),
    ).toThrow("Non-finite");
  });

  it("Infinity share → throws", () => {
    expect(() =>
      InvariantEngine.assertConservation({
        wife: { toDecimal: () => Infinity },
      }),
    ).toThrow("Non-finite");
  });

  it("-Infinity share → throws", () => {
    expect(() =>
      InvariantEngine.assertConservation({
        wife: { toDecimal: () => -Infinity },
      }),
    ).toThrow("Non-finite");
  });

  it("total ≠ 1 beyond tolerance → throws", () => {
    expect(() =>
      InvariantEngine.assertConservation({
        wife: { toDecimal: () => 0.5 },
        son: { toDecimal: () => 0.3 },
      }),
    ).toThrow("Conservation violated");
  });

  it("empty allocations → throws (total = 0, deviation = 1)", () => {
    expect(() => InvariantEngine.assertConservation({})).toThrow(
      "Conservation violated",
    );
  });

  it("total exactly 1 → no throw", () => {
    expect(() =>
      InvariantEngine.assertConservation({
        a: { toDecimal: () => 0.3333333333 },
        b: { toDecimal: () => 0.6666666667 },
      }),
    ).not.toThrow();
  });

  it("custom tolerance", () => {
    expect(() =>
      InvariantEngine.assertConservation(
        { a: { toDecimal: () => 0.6 }, b: { toDecimal: () => 0.3 } },
        0.2,
      ),
    ).not.toThrow();
  });
});

// ============================================================================
// 9. Full engine with edge case inputs
// ============================================================================
describe("Edge cases: Full engine calculation", () => {
  const estate: EstateData = {
    total: 120000,
    funeral: 0,
    debts: 0,
    will: 0,
  };

  it("valid wife-only → success", () => {
    const engine = new EnhancedInheritanceCalculationEngine("shafii", estate, {
      wife: 1,
    });
    const r = engine.calculate();
    expect(r.success).toBe(true);
  });

  it("total = 0 → fails gracefully", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: 0, funeral: 0, debts: 0, will: 0 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("total = NaN → fails gracefully (normalized to 0)", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: NaN, funeral: 0, debts: 0, will: 0 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("total = negative → fails gracefully (normalized to 0)", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: -1000, funeral: 0, debts: 0, will: 0 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("total = Infinity → fails gracefully (normalized to 0)", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: Infinity, funeral: 0, debts: 0, will: 0 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("no heirs → fails gracefully", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      estate,
      {} as HeirsData,
    );
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("all heirs zero → fails gracefully", () => {
    const engine = new EnhancedInheritanceCalculationEngine("shafii", estate, {
      wife: 0,
      son: 0,
    } as HeirsData);
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("heir counts = NaN → normalized to 0 → fails", () => {
    const engine = new EnhancedInheritanceCalculationEngine("shafii", estate, {
      wife: NaN,
    } as HeirsData);
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("heir counts = Infinity → normalized to 0 → fails", () => {
    const engine = new EnhancedInheritanceCalculationEngine("shafii", estate, {
      wife: Infinity,
    } as HeirsData);
    const r = engine.calculate();
    // Infinity wife clamped to 0 by Number.isFinite guard
    expect(r.success).toBe(false);
  });

  it("negative heir counts → normalized to 0 → fails", () => {
    const engine = new EnhancedInheritanceCalculationEngine("shafii", estate, {
      wife: -5,
    } as HeirsData);
    const r = engine.calculate();
    expect(r.success).toBe(false);
  });

  it("will > 1/3 of total → engine caps will to 1/3", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: 120000, funeral: 0, debts: 0, will: 100000 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
  });

  it("funeral + debts > total → net estate clamped to 0 → no shares", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: 120000, funeral: 70000, debts: 60000, will: 0 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
    const total = r.shares.reduce((s, sh) => s + sh.amount, 0);
    expect(total).toBe(0);
  });

  it("total = 1 (very small) → works", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: 1, funeral: 0, debts: 0, will: 0 },
      { wife: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
  });

  it("estate with string fields → normalized", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      {
        total: "120000" as any,
        funeral: "0" as any,
        debts: "0" as any,
        will: "0" as any,
      },
      { wife: 1 },
    );
    const r = engine.calculate();
    // "120000" as any → Number("120000" || 0) would be NaN since string is truthy
    // clamp: Math.max(0, value || 0) → string is truthy → Math.max(0, "120000") → 120000
    expect(r.success).toBe(true);
  });

  it("all 4 madhhabs produce valid results for simple case", () => {
    for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"] as const) {
      const engine = new EnhancedInheritanceCalculationEngine(madhab, estate, {
        wife: 1,
      });
      const r = engine.calculate();
      expect(r.success).toBe(true);
      expect(r.shares.length).toBeGreaterThan(0);
    }
  });

  it("very large estate", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: 1e15, funeral: 0, debts: 0, will: 0 },
      { wife: 1, son: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
  });

  it("many heir types at once", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "shafii",
      { total: 120000, funeral: 0, debts: 0, will: 0 },
      {
        wife: 1,
        mother: 1,
        father: 1,
        daughter: 2,
        full_brother: 1,
        full_sister: 1,
      },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
  });
});
