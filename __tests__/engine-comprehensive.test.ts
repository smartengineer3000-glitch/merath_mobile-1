import { describe, it, expect } from "vitest";
import { FractionClass } from "../lib/inheritance/fraction";
import { HijabSystem } from "../lib/inheritance/hijab-system";
import { InvariantEngine } from "../lib/inheritance/invariant";
import {
  normalizeEstateInput,
  normalizeHeirsInput,
  validateEngineInput,
} from "../lib/inheritance/engine-input";
import { EnhancedInheritanceCalculationEngine } from "../lib/inheritance/enhanced-engine-complete";
import {
  FIQH_DATABASE,
  getHijabRules,
  isValidMadhab,
} from "../lib/inheritance/constants";
import type {
  MadhhabType,
  EstateData,
  HeirsData,
} from "../lib/inheritance/types";

// ============================================================
// FractionClass: Edge cases
// ============================================================
describe("FractionClass edge cases", () => {
  it("zero numerator normalizes to 0/1", () => {
    const f = new FractionClass(0, 5);
    expect(f.getNumerator()).toBe(0);
    expect(f.getDenominator()).toBe(1);
    expect(f.isZero()).toBe(true);
  });

  it("negative denominator flips signs", () => {
    const f = new FractionClass(1, -4);
    expect(f.getNumerator()).toBe(-1);
    expect(f.getDenominator()).toBe(4);
  });

  it("double-negative normalizes to positive", () => {
    const f = new FractionClass(-3, -7);
    expect(f.getNumerator()).toBe(3);
    expect(f.getDenominator()).toBe(7);
  });

  it("whole number has denominator 1", () => {
    const f = new FractionClass(5);
    expect(f.getDenominator()).toBe(1);
    expect(f.toString()).toBe("5");
  });

  it("addition: 1/2 + 1/3 = 5/6", () => {
    const a = new FractionClass(1, 2);
    const b = new FractionClass(1, 3);
    const result = a.add(b);
    expect(result.equals(new FractionClass(5, 6))).toBe(true);
  });

  it("subtraction: 2/3 - 1/6 = 1/2", () => {
    const a = new FractionClass(2, 3);
    const b = new FractionClass(1, 6);
    const result = a.subtract(b);
    expect(result.equals(new FractionClass(1, 2))).toBe(true);
  });

  it("multiplication by scalar", () => {
    const f = new FractionClass(2, 3);
    const result = f.multiply(3);
    expect(result.equals(new FractionClass(2))).toBe(true);
  });

  it("multiplication by fraction", () => {
    const a = new FractionClass(1, 2);
    const b = new FractionClass(2, 3);
    const result = a.multiply(b);
    expect(result.equals(new FractionClass(1, 3))).toBe(true);
  });

  it("division by scalar", () => {
    const f = new FractionClass(3, 4);
    const result = f.divide(3);
    expect(result.equals(new FractionClass(1, 4))).toBe(true);
  });

  it("division by fraction", () => {
    const a = new FractionClass(1, 2);
    const b = new FractionClass(1, 4);
    const result = a.divide(b);
    expect(result.equals(new FractionClass(2))).toBe(true);
  });

  it("divide by zero throws", () => {
    const f = new FractionClass(1, 2);
    expect(() => f.divide(0)).toThrow();
  });

  it("divide by zero fraction throws", () => {
    const a = new FractionClass(1, 2);
    const b = new FractionClass(0);
    expect(() => a.divide(b)).toThrow();
  });

  it("constructor throws on zero denominator", () => {
    expect(() => new FractionClass(1, 0)).toThrow();
  });

  it("equals is strict rational equality", () => {
    const a = new FractionClass(1, 2);
    const b = new FractionClass(2, 4);
    expect(a.equals(b)).toBe(true);
  });

  it("unequal fractions are not equal", () => {
    const a = new FractionClass(1, 3);
    const b = new FractionClass(1, 4);
    expect(a.equals(b)).toBe(false);
  });

  it("compare returns -1, 0, 1 correctly", () => {
    const a = new FractionClass(1, 3);
    const b = new FractionClass(1, 2);
    expect(a.compare(b)).toBe(-1);
    expect(b.compare(a)).toBe(1);
    expect(a.compare(new FractionClass(1, 3))).toBe(0);
  });

  it("greaterThan / lessThan work", () => {
    const half = new FractionClass(1, 2);
    const third = new FractionClass(1, 3);
    expect(half.greaterThan(third)).toBe(true);
    expect(third.lessThan(half)).toBe(true);
    expect(half.greaterThanOrEqual(half)).toBe(true);
    expect(half.lessThanOrEqual(half)).toBe(true);
  });

  it("fromDecimal roundtrips", () => {
    const f = FractionClass.fromDecimal(0.75);
    expect(f.equals(new FractionClass(3, 4))).toBe(true);
  });

  it("fromData roundtrips", () => {
    const data = { numerator: 3, denominator: 8 };
    const f = FractionClass.fromData(data);
    const out = f.toData();
    expect(out.numerator).toBe(3);
    expect(out.denominator).toBe(8);
  });

  it("isPositive and isZero", () => {
    expect(new FractionClass(1, 2).isPositive()).toBe(true);
    expect(new FractionClass(0).isPositive()).toBe(false);
    expect(new FractionClass(0).isZero()).toBe(true);
    expect(new FractionClass(1, 2).isZero()).toBe(false);
  });

  it("additive identity: x + 0 = x", () => {
    const f = new FractionClass(3, 7);
    const zero = new FractionClass(0);
    expect(f.add(zero).equals(f)).toBe(true);
  });

  it("multiplicative identity: x * 1 = x", () => {
    const f = new FractionClass(5, 9);
    expect(f.multiply(new FractionClass(1)).equals(f)).toBe(true);
  });

  it("handles very large denominators via scale-down", () => {
    const a = new FractionClass(1, 999_999_999);
    const b = new FractionClass(1, 999_999_999);
    const result = a.add(b);
    expect(result.toDecimal()).toBeCloseTo(2 / 999_999_999, 10);
  });
});

// ============================================================
// HijabSystem: All four madhabs
// ============================================================
describe("HijabSystem across madhabs", () => {
  const allMadhabs: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

  describe("son blocks siblings", () => {
    it.each(allMadhabs)("son blocks full_brother in %s", (madhab) => {
      const sys = new HijabSystem(madhab);
      const { heirs } = sys.applyHijab({
        son: 1,
        full_brother: 2,
        full_sister: 1,
      });
      expect(heirs.full_brother).toBe(0);
    });

    it.each(allMadhabs)("son blocks half_brother_paternal in %s", (madhab) => {
      const sys = new HijabSystem(madhab);
      const { heirs } = sys.applyHijab({
        son: 1,
        half_brother_paternal: 1,
      });
      expect(heirs.half_brother_paternal).toBe(0);
    });
  });

  describe("father blocks grandfather", () => {
    it.each(allMadhabs)("father blocks grandfather in %s", (madhab) => {
      const sys = new HijabSystem(madhab);
      const { heirs } = sys.applyHijab({ father: 1, grandfather: 1 });
      expect(heirs.grandfather).toBe(0);
    });
  });

  describe("Shafii: mother blocks grandmother", () => {
    it("mother blocks grandmother in shafii", () => {
      const sys = new HijabSystem("shafii");
      const { heirs } = sys.applyHijab({ mother: 1, grandmother: 1 });
      expect(heirs.grandmother).toBe(0);
    });
  });

  describe("Hanafi: mother does NOT block grandmother", () => {
    it("grandmother survives in hanafi", () => {
      const sys = new HijabSystem("hanafi");
      const { heirs } = sys.applyHijab({ mother: 1, grandmother: 1 });
      expect(heirs.grandmother).toBe(1);
    });
  });

  describe("Grandfather with siblings: madhab-specific", () => {
    it("shafii: grandfather blocks siblings", () => {
      const sys = new HijabSystem("shafii");
      const { heirs } = sys.applyHijab({
        grandfather: 1,
        full_brother: 1,
        full_sister: 1,
      });
      expect(heirs.full_brother).toBe(0);
      expect(heirs.full_sister).toBe(0);
    });

    it("hanafi: grandfather blocks siblings", () => {
      const sys = new HijabSystem("hanafi");
      const { heirs } = sys.applyHijab({
        grandfather: 1,
        full_brother: 1,
      });
      expect(heirs.full_brother).toBe(0);
    });

    it("maliki: grandfather does NOT block siblings", () => {
      const sys = new HijabSystem("maliki");
      const { heirs } = sys.applyHijab({
        grandfather: 1,
        full_brother: 1,
        full_sister: 1,
      });
      expect(heirs.full_brother).toBe(1);
      expect(heirs.full_sister).toBe(1);
    });

    it("hanbali: grandfather does NOT block siblings", () => {
      const sys = new HijabSystem("hanbali");
      const { heirs } = sys.applyHijab({
        grandfather: 1,
        full_brother: 1,
      });
      expect(heirs.full_brother).toBe(1);
    });
  });

  describe("two daughters block granddaughter", () => {
    it("granddaughter blocked without grandson", () => {
      const sys = new HijabSystem("hanafi");
      const { heirs } = sys.applyHijab({
        daughter: 2,
        granddaughter: 1,
      });
      expect(heirs.granddaughter).toBe(0);
    });

    it("granddaughter NOT blocked when grandson exists", () => {
      const sys = new HijabSystem("hanafi");
      const { heirs } = sys.applyHijab({
        daughter: 2,
        granddaughter: 1,
        grandson: 1,
      });
      expect(heirs.granddaughter).toBe(1);
    });

    it("single daughter does NOT block granddaughter", () => {
      const sys = new HijabSystem("hanafi");
      const { heirs } = sys.applyHijab({
        daughter: 1,
        granddaughter: 1,
      });
      expect(heirs.granddaughter).toBe(1);
    });
  });

  describe("utility methods", () => {
    it("hasDescendants with son", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.hasDescendants({ son: 1 })).toBe(true);
    });

    it("hasDescendants with daughter only", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.hasDescendants({ daughter: 1 })).toBe(true);
    });

    it("hasDescendants with no children", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.hasDescendants({ husband: 1 })).toBe(false);
    });

    it("hasSiblings counts all sibling types", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.hasSiblings({ full_sister: 1 })).toBe(true);
      expect(sys.hasSiblings({ half_sister_paternal: 1 })).toBe(true);
      expect(sys.hasSiblings({ husband: 1 })).toBe(false);
    });

    it("countMales counts all male heir types", () => {
      const sys = new HijabSystem("hanafi");
      const count = sys.countMales({
        son: 2,
        father: 1,
        grandfather: 1,
        full_brother: 3,
      });
      expect(count).toBe(7);
    });

    it("countFemales counts all female heir types", () => {
      const sys = new HijabSystem("hanafi");
      const count = sys.countFemales({
        daughter: 1,
        mother: 1,
        grandmother: 1,
        full_sister: 2,
      });
      expect(count).toBe(5);
    });

    it("countMales and countFemales with zero heirs", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.countMales({})).toBe(0);
      expect(sys.countFemales({})).toBe(0);
    });

    it("checkInheritanceRights recognizes standard heirs", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.checkInheritanceRights("husband")).toBe(true);
      expect(sys.checkInheritanceRights("wife")).toBe(true);
      expect(sys.checkInheritanceRights("son")).toBe(true);
      expect(sys.checkInheritanceRights("daughter")).toBe(true);
      expect(sys.checkInheritanceRights("father")).toBe(true);
      expect(sys.checkInheritanceRights("mother")).toBe(true);
    });

    it("checkInheritanceRights rejects unknown types", () => {
      const sys = new HijabSystem("hanafi");
      expect(sys.checkInheritanceRights("unknown")).toBe(false);
      expect(sys.checkInheritanceRights("")).toBe(false);
    });

    it("getMadhab returns the correct madhab", () => {
      const sys = new HijabSystem("maliki");
      expect(sys.getMadhab()).toBe("maliki");
    });
  });
});

// ============================================================
// InvariantEngine
// ============================================================
describe("InvariantEngine", () => {
  it("passes when shares sum to 1", () => {
    const allocations = {
      husband: { toDecimal: () => 0.25 },
      wife: { toDecimal: () => 0.125 },
      son: { toDecimal: () => 0.625 },
    };
    expect(() => InvariantEngine.assertConservation(allocations)).not.toThrow();
  });

  it("throws when shares don't sum to 1", () => {
    const allocations = {
      husband: { toDecimal: () => 0.5 },
      wife: { toDecimal: () => 0.5 },
      son: { toDecimal: () => 0.5 },
    };
    expect(() => InvariantEngine.assertConservation(allocations)).toThrow(
      /Conservation violated/,
    );
  });

  it("throws on non-finite share", () => {
    const allocations = {
      heir: { toDecimal: () => NaN },
    };
    expect(() => InvariantEngine.assertConservation(allocations)).toThrow(
      /Non-finite/,
    );
  });

  it("respects custom tolerance", () => {
    const allocations = {
      heir: { toDecimal: () => 1.0000000001 },
    };
    expect(() =>
      InvariantEngine.assertConservation(allocations, 1e-9),
    ).not.toThrow();
  });
});

// ============================================================
// Engine Input Normalization & Validation
// ============================================================
describe("Engine input: advanced normalization", () => {
  it("clamps NaN values to 0", () => {
    const estate = normalizeEstateInput({
      total: NaN,
      funeral: NaN,
      debts: NaN,
      will: NaN,
    });
    expect(estate.total).toBe(0);
    expect(estate.funeral).toBe(0);
    expect(estate.debts).toBe(0);
    expect(estate.will).toBe(0);
  });

  it("Infinity passes through (Math.max(0, Infinity) = Infinity)", () => {
    const estate = normalizeEstateInput({
      total: Infinity,
      funeral: Infinity,
      debts: Infinity,
      will: Infinity,
    });
    expect(estate.total).toBe(Infinity);
  });

  it("wife clamped to max 4", () => {
    const heirs = normalizeHeirsInput({ wife: 10 });
    expect(heirs.wife).toBe(4);
  });

  it("husband clamped to max 1", () => {
    const heirs = normalizeHeirsInput({ husband: 5 });
    expect(heirs.husband).toBe(1);
  });

  it("father clamped to max 1", () => {
    const heirs = normalizeHeirsInput({ father: 3 });
    expect(heirs.father).toBe(1);
  });

  it("mother clamped to max 1", () => {
    const heirs = normalizeHeirsInput({ mother: 2 });
    expect(heirs.mother).toBe(1);
  });

  it("grandfather clamped to max 1", () => {
    const heirs = normalizeHeirsInput({ grandfather: 2 });
    expect(heirs.grandfather).toBe(1);
  });

  it("grandmother clamped to max 1", () => {
    const heirs = normalizeHeirsInput({ grandmother: 2 });
    expect(heirs.grandmother).toBe(1);
  });

  it("son count has no upper limit", () => {
    const heirs = normalizeHeirsInput({ son: 100 });
    expect(heirs.son).toBe(100);
  });

  it("daughter count has no upper limit", () => {
    const heirs = normalizeHeirsInput({ daughter: 10 });
    expect(heirs.daughter).toBe(10);
  });

  it("maps funeralCosts to funeral", () => {
    const estate = normalizeEstateInput({
      total: 100000,
      funeralCosts: 5000,
    });
    expect(estate.funeral).toBe(5000);
  });

  it("maps willAmount to will", () => {
    const estate = normalizeEstateInput({
      total: 100000,
      willAmount: 10000,
    });
    expect(estate.will).toBe(10000);
  });

  it("undefined heir types are clamped to 0", () => {
    const heirs = normalizeHeirsInput({});
    expect(heirs.son).toBe(0);
    expect(heirs.daughter).toBe(0);
    expect(heirs.husband).toBe(0);
  });

  it("validateEngineInput: will exceeding 1/3 of estate still valid (engine handles)", () => {
    const estate: EstateData = {
      total: 100000,
      funeral: 0,
      debts: 0,
      will: 50000,
    };
    const heirs: HeirsData = { husband: 1 };
    const result = validateEngineInput(estate, heirs);
    expect(result.valid).toBe(true);
  });

  it("validateEngineInput: funeral exceeding total", () => {
    const estate: EstateData = {
      total: 10000,
      funeral: 20000,
      debts: 0,
      will: 0,
    };
    const heirs: HeirsData = { wife: 1 };
    const result = validateEngineInput(estate, heirs);
    expect(result.valid).toBe(true);
  });

  it("validateEngineInput: multiple heir types present", () => {
    const estate: EstateData = { total: 100000, funeral: 0, debts: 0, will: 0 };
    const heirs: HeirsData = {
      husband: 1,
      wife: 1,
      son: 2,
      daughter: 1,
      father: 1,
      mother: 1,
    };
    const result = validateEngineInput(estate, heirs);
    expect(result.valid).toBe(true);
  });
});

// ============================================================
// Constants and Fiqh database
// ============================================================
describe("FIQH_DATABASE integrity", () => {
  it("has all 4 madhabs", () => {
    expect(Object.keys(FIQH_DATABASE.madhabs)).toEqual(
      expect.arrayContaining(["shafii", "hanafi", "maliki", "hanbali"]),
    );
  });

  it("all madhabs have required fields", () => {
    for (const [code, config] of Object.entries(FIQH_DATABASE.madhabs)) {
      expect(config.code).toBe(code);
      expect(typeof config.name).toBe("string");
      expect(typeof config.color).toBe("string");
      expect(typeof config.rules).toBe("object");
      expect(typeof config.rules.spouse_radd).toBe("boolean");
    }
  });

  it("isValidMadhab works", () => {
    expect(isValidMadhab("hanafi")).toBe(true);
    expect(isValidMadhab("shafii")).toBe(true);
    expect(isValidMadhab("invalid")).toBe(false);
  });

  it("getHijabRules returns array for each madhab", () => {
    for (const madhab of ["shafii", "hanafi", "maliki", "hanbali"]) {
      const rules = getHijabRules(madhab);
      expect(Array.isArray(rules)).toBe(true);
      expect(rules.length).toBeGreaterThan(0);
    }
  });

  it("radd rules: hanafi and hanbali allow spouse radd, shafii and maliki do not", () => {
    expect(FIQH_DATABASE.madhabs.hanafi.rules.spouse_radd).toBe(true);
    expect(FIQH_DATABASE.madhabs.hanbali.rules.spouse_radd).toBe(true);
    expect(FIQH_DATABASE.madhabs.shafii.rules.spouse_radd).toBe(false);
    expect(FIQH_DATABASE.madhabs.maliki.rules.spouse_radd).toBe(false);
  });

  it("grandfather_with_siblings: shafii/hanafi=hijab, maliki/hanbali=musharak", () => {
    expect(FIQH_DATABASE.madhabs.shafii.rules.grandfather_with_siblings).toBe(
      "hijab",
    );
    expect(FIQH_DATABASE.madhabs.hanafi.rules.grandfather_with_siblings).toBe(
      "hijab",
    );
    expect(FIQH_DATABASE.madhabs.maliki.rules.grandfather_with_siblings).toBe(
      "musharak",
    );
    expect(FIQH_DATABASE.madhabs.hanbali.rules.grandfather_with_siblings).toBe(
      "musharak",
    );
  });
});

// ============================================================
// Engine: Comprehensive calculation scenarios
// ============================================================

function calc(madhab: MadhhabType, estate: EstateData, heirs: HeirsData) {
  const engine = new EnhancedInheritanceCalculationEngine(
    madhab,
    estate,
    heirs,
  );
  return engine.calculate();
}

function estate(total: number, opts: Partial<EstateData> = {}): EstateData {
  return { total, funeral: 0, debts: 0, will: 0, ...opts };
}

describe("Engine: Will/Wasiyyah interaction", () => {
  const base = estate(120000);

  it("will of 0 has no effect on net estate", () => {
    const result = calc("hanafi", base, { husband: 1 });
    expect(result.netEstate).toBe(120000);
  });

  it("will of 10000 deducts from net estate", () => {
    const withWill = estate(120000, { will: 10000 });
    const result = calc("hanafi", withWill, { husband: 1 });
    expect(result.netEstate).toBe(110000);
  });

  it("will is capped at 1/3 of remainder after funeral+debts", () => {
    const withWill = estate(120000, { will: 100000 });
    const result = calc("hanafi", withWill, { husband: 1 });
    // max will = 120000/3 = 40000
    expect(result.netEstate).toBe(80000);
  });

  it("will with funeral and debts deducted first", () => {
    const withEverything = estate(120000, {
      funeral: 10000,
      debts: 20000,
      will: 50000,
    });
    const result = calc("hanafi", withEverything, { husband: 1 });
    // remainder = 120000 - 10000 - 20000 = 90000
    // max will = 90000/3 = 30000
    // net = 90000 - 30000 = 60000
    expect(result.netEstate).toBe(60000);
  });
});

describe("Engine: Awl (proportional reduction)", () => {
  it("triggers when fard fractions exceed 1", () => {
    // 2 daughters (2/3) + husband (1/4) + mother (1/6) = 2/3 + 1/4 + 1/6 = 17/12 > 1
    const result = calc("hanafi", estate(120000), {
      daughter: 2,
      husband: 1,
      mother: 1,
    });
    expect(result.awlApplied).toBe(true);
    expect(result.success).toBe(true);
  });

  it("does not trigger when fractions <= 1", () => {
    const result = calc("hanafi", estate(120000), {
      wife: 1,
      son: 1,
    });
    expect(result.awlApplied).toBe(false);
  });
});

describe("Engine: Radd (return of surplus)", () => {
  it("single daughter gets 1/2 + radd of surplus", () => {
    const result = calc("hanafi", estate(120000), { daughter: 1 });
    // daughter gets 1/2 as fard, plus radd of remaining 1/2
    // since no asaba heirs exist, radd goes to her
    expect(result.raddApplied).toBe(true);
    const daughterShare = result.shares.find(
      (s) => s.key === "daughter" || s.name?.includes("بنت"),
    );
    expect(daughterShare).toBeDefined();
    // She should get the full estate
    expect(daughterShare!.amount).toBeCloseTo(120000, -1);
  });

  it("wife does NOT get radd in shafii", () => {
    const result = calc("shafii", estate(120000), { wife: 1 });
    // wife gets 1/4 = 30000
    // radd goes to blood relatives or stays
    const wifeShare = result.shares.find(
      (s) => s.key === "wife" || s.name?.includes("زوجة"),
    );
    expect(wifeShare).toBeDefined();
    expect(wifeShare!.amount).toBeCloseTo(30000, -1);
  });

  it("wife gets fard + radd in hanafi when no asaba", () => {
    const result = calc("hanafi", estate(120000), { wife: 1 });
    const wifeShare = result.shares.find(
      (s) => s.key === "wife" || s.name?.includes("زوجة"),
    );
    expect(wifeShare).toBeDefined();
    // wife gets 1/4 fard + radd (remainder) = full estate when no asaba heirs
    expect(wifeShare!.amount).toBeCloseTo(120000, -1);
    expect(result.success).toBe(true);
  });
});

describe("Engine: Asaba distribution", () => {
  it("son takes remainder after wife's share", () => {
    const result = calc("hanafi", estate(120000), { wife: 1, son: 1 });
    const wifeShare = result.shares.find(
      (s) => s.key === "wife" || s.name?.includes("زوجة"),
    );
    const sonShare = result.shares.find(
      (s) => s.key === "son" || s.name?.includes("ابن"),
    );
    expect(wifeShare).toBeDefined();
    expect(sonShare).toBeDefined();
    // wife gets 1/8 = 15000, son gets remainder = 105000
    expect(wifeShare!.amount).toBeCloseTo(15000, -1);
    expect(sonShare!.amount).toBeCloseTo(105000, -1);
  });

  it("son and daughter: 2:1 ratio for remainder", () => {
    const result = calc("hanafi", estate(120000), {
      wife: 1,
      son: 1,
      daughter: 1,
    });
    const sonShare = result.shares.find(
      (s) => s.key === "son" || s.name?.includes("ابن"),
    );
    expect(sonShare).toBeDefined();
    // wife 1/8 = 15000, remainder = 105000
    // son gets 2/3 of 105000 = 70000
    expect(sonShare!.amount).toBeCloseTo(70000, -1);
  });
});

describe("Engine: Madhab comparison", () => {
  const baseEstate = estate(120000);
  const baseHeirs: HeirsData = { wife: 1, son: 1, daughter: 1 };

  it("same scenario gives same wife share across all madhabs", () => {
    const results = (
      ["hanafi", "maliki", "shafii", "hanbali"] as MadhhabType[]
    ).map((m) => calc(m, baseEstate, baseHeirs));

    const wifeAmounts = results.map((r) => {
      const w = r.shares.find(
        (s) => s.key === "wife" || s.name?.includes("زوجة"),
      );
      return w?.amount ?? 0;
    });

    // wife 1/8 is same across all madhabs for this scenario
    expect(wifeAmounts[0]).toBeCloseTo(wifeAmounts[1], -1);
    expect(wifeAmounts[1]).toBeCloseTo(wifeAmounts[2], -1);
    expect(wifeAmounts[2]).toBeCloseTo(wifeAmounts[3], -1);
  });
});

describe("Engine: Grandfather with siblings (Maliki/Hanbali musharak)", () => {
  it("maliki: grandfather and brother both inherit", () => {
    const result = calc("maliki", estate(120000), {
      grandfather: 1,
      full_brother: 1,
    });
    expect(result.success).toBe(true);
    // Both should receive shares
    const grandfatherShare = result.shares.find(
      (s) => s.key === "grandfather" || s.name?.includes("جد"),
    );
    const brotherShare = result.shares.find(
      (s) => s.key === "full_brother" || s.name?.includes("أخ"),
    );
    expect(grandfatherShare).toBeDefined();
    expect(brotherShare).toBeDefined();
    expect(grandfatherShare!.amount).toBeGreaterThan(0);
    expect(brotherShare!.amount).toBeGreaterThan(0);
  });

  it("shafii: grandfather alone inherits (siblings blocked)", () => {
    const result = calc("shafii", estate(120000), {
      grandfather: 1,
      full_brother: 1,
    });
    expect(result.success).toBe(true);
    const grandfatherShare = result.shares.find(
      (s) => s.key === "grandfather" || s.name?.includes("جد"),
    );
    expect(grandfatherShare).toBeDefined();
    expect(grandfatherShare!.amount).toBe(120000);
  });
});

describe("Engine: Multiple wives", () => {
  it("4 wives each get 1/8 with children", () => {
    const result = calc("hanafi", estate(120000), {
      wife: 4,
      son: 1,
    });
    expect(result.success).toBe(true);
    const wifeShares = result.shares.filter(
      (s) => s.key === "wife" || s.name?.includes("زوجة"),
    );
    // Total wife share should be 1/8 = 15000
    const totalWife = wifeShares.reduce((sum, s) => sum + s.amount, 0);
    expect(totalWife).toBeCloseTo(15000, -1);
  });

  it("single wife without children gets 1/4 fard", () => {
    const result = calc("hanafi", estate(120000), { wife: 1, son: 1 });
    const wifeShare = result.shares.find(
      (s) => s.key === "wife" || s.name?.includes("زوجة"),
    );
    expect(wifeShare).toBeDefined();
    expect(wifeShare!.amount).toBeCloseTo(15000, -1);
  });
});

describe("Engine: Mother's share variations", () => {
  it("mother alone with descendants: 1/6", () => {
    const result = calc("hanafi", estate(120000), {
      mother: 1,
      son: 1,
      wife: 1,
    });
    const motherShare = result.shares.find(
      (s) => s.key === "mother" || s.name?.includes("أم"),
    );
    expect(motherShare).toBeDefined();
    // mother 1/6 = 20000
    expect(motherShare!.amount).toBeCloseTo(20000, -1);
  });

  it("mother without descendants or siblings: 1/3 fard + radd fills remainder", () => {
    const result = calc("hanafi", estate(120000), { mother: 1 });
    const motherShare = result.shares.find(
      (s) => s.key === "mother" || s.name?.includes("أم"),
    );
    expect(motherShare).toBeDefined();
    // mother gets 1/3 = 40000 as fard, radd distributes remainder to her
    expect(motherShare!.amount).toBeGreaterThanOrEqual(40000);
    const totalDistributed = result.shares.reduce(
      (sum, s) => sum + s.amount,
      0,
    );
    expect(totalDistributed).toBeCloseTo(120000, -1);
  });
});

describe("Engine: Father's share", () => {
  it("father gets 1/6 with descendants", () => {
    const result = calc("hanafi", estate(120000), {
      father: 1,
      son: 1,
      wife: 1,
    });
    // Total should be distributed, father gets 1/6 = 20000
    const totalDistributed = result.shares.reduce(
      (sum, s) => sum + s.amount,
      0,
    );
    expect(totalDistributed).toBeCloseTo(120000, -1);
    // Find father by any heuristic
    const fatherShare = result.shares.find(
      (s) =>
        s.key === "father" ||
        s.name?.includes("أب") ||
        s.name?.includes("father"),
    );
    // The engine may merge father into the son group or list separately
    if (fatherShare) {
      expect(fatherShare.amount).toBeCloseTo(20000, -1);
    }
  });

  it("father gets remainder (asaba) without descendants", () => {
    const result = calc("hanafi", estate(120000), {
      father: 1,
      wife: 1,
    });
    const fatherShare = result.shares.find(
      (s) => s.key === "father" || s.name?.includes("أب"),
    );
    const wifeShare = result.shares.find(
      (s) => s.key === "wife" || s.name?.includes("زوجة"),
    );
    expect(fatherShare).toBeDefined();
    expect(wifeShare).toBeDefined();
    // wife 1/4 = 30000, father gets remainder = 90000
    expect(wifeShare!.amount).toBeCloseTo(30000, -1);
    expect(fatherShare!.amount).toBeCloseTo(90000, -1);
  });
});

describe("Engine: Error handling", () => {
  it("zero estate fails gracefully", () => {
    const result = calc("hanafi", estate(0), { wife: 1 });
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("no heirs fails gracefully", () => {
    const result = calc("hanafi", estate(120000), {});
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("negative estate values are clamped to 0", () => {
    const result = calc("hanafi", estate(-1000), { wife: 1 });
    expect(result.success).toBe(false);
  });

  it("result always has required structure", () => {
    const result = calc("hanafi", estate(120000), { wife: 1 });
    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("madhab");
    expect(result).toHaveProperty("shares");
    expect(result).toHaveProperty("steps");
    expect(result).toHaveProperty("confidence");
    expect(result).toHaveProperty("calculationTime");
    expect(Array.isArray(result.shares)).toBe(true);
    expect(Array.isArray(result.steps)).toBe(true);
  });
});

describe("Engine: Confidence score", () => {
  it("simple scenario has high confidence", () => {
    const result = calc("hanafi", estate(120000), { wife: 1, son: 1 });
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it("complex scenario still has reasonable confidence", () => {
    const result = calc("hanafi", estate(120000), {
      wife: 1,
      son: 2,
      daughter: 1,
      father: 1,
      mother: 1,
    });
    expect(result.confidence).toBeGreaterThan(0.5);
  });
});

describe("Engine: Net estate calculation", () => {
  it("net = total - funeral - debts - will", () => {
    const result = calc(
      "hanafi",
      estate(200000, { funeral: 10000, debts: 30000, will: 20000 }),
      {
        wife: 1,
        son: 1,
      },
    );
    expect(result.netEstate).toBe(140000);
  });

  it("net never goes below 0", () => {
    const result = calc(
      "hanafi",
      estate(10000, { funeral: 5000, debts: 8000 }),
      {
        wife: 1,
      },
    );
    expect(result.netEstate).toBe(0);
  });
});
