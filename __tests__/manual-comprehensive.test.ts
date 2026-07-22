/**
 * Manual comprehensive test suite:
 * Case 1: Female deceased with complex family
 * Case 1b: Same with mother selected
 * 3 non-Ijma cases (madhab differences)
 * Edge cases for all blocking rules
 */
import { describe, it, expect } from "vitest";
import { InheritanceCalculationEngine } from "../lib/inheritance";
import { HijabSystem } from "../lib/inheritance/hijab-system";
import { getBlockedHeirs } from "../lib/inheritance/hijab-system";
import type { EstateData, HeirsData } from "../lib/inheritance/types";

const MADHABS = ["hanafi", "shafii", "maliki", "hanbali"] as const;

function runEngine(madhab: (typeof MADHABS)[number], estate: EstateData, heirs: HeirsData) {
  const engine = new InheritanceCalculationEngine(madhab, estate, heirs);
  return engine.calculate();
}

function getTotalDistributed(result: ReturnType<typeof runEngine>) {
  return result.shares.reduce((a, s) => a + s.amount, 0);
}

function findShare(result: ReturnType<typeof runEngine>, key: string) {
  return result.shares.find((s) => s.key === key);
}

// ============================================================================
// CASE 1: Female deceased — complex family
// Husband + 2 sons + 4 daughters + father + grandfather + grandmother + full_brother
// Net estate = 1,200,000
// Expected: husband=1/4, father=1/6, grandmother=1/6, sons+daughters share remainder
// Grandfather blocked by father. Full_brother blocked by sons.
// ============================================================================
describe("Case 1: Female deceased — complex family", () => {
  const estate: EstateData = { total: 1200000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = {
    husband: 1,
    son: 2,
    daughter: 4,
    father: 1,
    grandfather: 1,
    grandmother: 1,
    full_brother: 1,
  };

  it("hijab system: full_brother blocked by sons (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.full_brother).toBe(0);
    }
  });

  it("hijab system: grandfather blocked by father (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.grandfather).toBe(0);
    }
  });

  it("hijab system: grandmother survives (mother not selected)", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.grandmother).toBe(1);
    }
  });

  it("hijab system: all madhabs produce same blocking (Ijma)", () => {
    const results: Record<string, string> = {};
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { log } = sys.applyHijab({ ...heirs });
      results[madhab] = log.sort().join("|");
    }
    expect(results.hanafi).toEqual(results.shafii);
    expect(results.hanafi).toEqual(results.maliki);
    expect(results.hanafi).toEqual(results.hanbali);
  });

  it("engine: husband gets 1/4 when children exist (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const h = findShare(result, "husband");
      expect(h).toBeDefined();
      expect(h!.percentage).toBeCloseTo(25, 1); // 25% = 1/4
      expect(h!.amount).toBeCloseTo(300000, 0);
    }
  });

  it("engine: father gets 1/6 when children exist (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const f = findShare(result, "father");
      expect(f).toBeDefined();
      expect(f!.percentage).toBeCloseTo(16.67, 1); // ~16.67% = 1/6
      expect(f!.amount).toBeCloseTo(200000, 0);
    }
  });

  it("engine: grandmother gets 1/6 (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const gm = findShare(result, "grandmother");
      expect(gm).toBeDefined();
      expect(gm!.amount).toBeCloseTo(200000, 0);
    }
  });

  it("engine: grandfather gets 0 (blocked by father)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const gf = findShare(result, "grandfather");
      expect(gf).toBeUndefined();
    }
  });

  it("engine: full_brother gets 0 (blocked by sons)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const fb = findShare(result, "full_brother");
      expect(fb).toBeUndefined();
    }
  });

  it("engine: sons+daughters share 500k remainder (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const sons = findShare(result, "son");
      const daughters = findShare(result, "daughter");
      expect(sons).toBeDefined();
      expect(daughters).toBeDefined();
      const remainder = 500000;
      expect(sons!.amount + daughters!.amount).toBeCloseTo(remainder, 0);
    }
  });

  it("engine: total distribution = net estate (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const total = getTotalDistributed(result);
      expect(total).toBeCloseTo(result.netEstate!, -1);
    }
  });

  it("engine: no NaN or Infinity in results", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      expect(Number.isFinite(result.netEstate!)).toBe(true);
      for (const s of result.shares) {
        expect(Number.isFinite(s.amount)).toBe(true);
      }
    }
  });
});

// ============================================================================
// CASE 1b: With mother — mother blocks grandmother
// ============================================================================
describe("Case 1b: Female deceased — with mother (mother blocks grandmother)", () => {
  const estate: EstateData = { total: 1200000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = {
    husband: 1,
    son: 2,
    daughter: 4,
    father: 1,
    grandfather: 1,
    grandmother: 1,
    full_brother: 1,
    mother: 1,
  };

  it("hijab: mother blocks grandmother (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.grandmother).toBe(0);
      expect(h.mother).toBe(1);
    }
  });

  it("engine: mother gets 1/6, grandmother gets 0 (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const mother = findShare(result, "mother");
      expect(mother).toBeDefined();
      expect(mother!.percentage).toBeCloseTo(16.67, 1); // ~16.67% = 1/6
      const gm = findShare(result, "grandmother");
      expect(gm).toBeUndefined();
    }
  });
});

// ============================================================================
// NON-IJMA CASE 1: Grandfather + siblings
// Shafii/Maliki/Hanbali: grandfather shares (muqasamah)
// Hanafi: grandfather blocks siblings (hijab)
// ============================================================================
describe("Non-Ijma 1: Grandfather + siblings (musharak vs hijab)", () => {
  const estate: EstateData = { total: 600000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = { grandfather: 1, full_brother: 1 };

  it("Shafii: both grandfather and brother get shares", () => {
    const result = runEngine("shafii", estate, heirs);
    const gf = findShare(result, "grandfather");
    const bro = findShare(result, "full_brother");
    expect(gf).toBeDefined();
    expect(bro).toBeDefined();
    expect(gf!.amount).toBeGreaterThan(0);
    expect(bro!.amount).toBeGreaterThan(0);
    const total = getTotalDistributed(result);
    expect(total).toBeCloseTo(600000, -1);
  });

  it("Maliki: both grandfather and brother get shares", () => {
    const result = runEngine("maliki", estate, heirs);
    const gf = findShare(result, "grandfather");
    const bro = findShare(result, "full_brother");
    expect(gf).toBeDefined();
    expect(bro).toBeDefined();
    expect(gf!.amount).toBeGreaterThan(0);
    expect(bro!.amount).toBeGreaterThan(0);
  });

  it("Hanbali: both grandfather and brother get shares", () => {
    const result = runEngine("hanbali", estate, heirs);
    const gf = findShare(result, "grandfather");
    const bro = findShare(result, "full_brother");
    expect(gf).toBeDefined();
    expect(bro).toBeDefined();
    expect(gf!.amount).toBeGreaterThan(0);
    expect(bro!.amount).toBeGreaterThan(0);
  });

  it("Hanafi: grandfather blocks brother entirely", () => {
    const result = runEngine("hanafi", estate, heirs);
    const gf = findShare(result, "grandfather");
    const bro = findShare(result, "full_brother");
    expect(gf).toBeDefined();
    expect(gf!.amount).toBeCloseTo(600000, -1);
    expect(bro).toBeUndefined();
  });

  it("Shafii/Maliki/Hanbali: total distributed = net estate", () => {
    for (const madhab of ["shafii", "maliki", "hanbali"] as const) {
      const result = runEngine(madhab, estate, heirs);
      const total = getTotalDistributed(result);
      expect(total).toBeCloseTo(result.netEstate!, -1);
    }
  });
});

// ============================================================================
// NON-IJMA CASE 2: Radd — husband only (no blood relatives)
// Hanafi/Hanbali: husband gets 1/2 + radd
// Shafii/Maliki: husband gets 1/2 only, surplus → Bayt al-Mal
// ============================================================================
describe("Non-Ijma 2: Radd — husband only", () => {
  const estate: EstateData = { total: 100000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = { husband: 1 };

  it("Hanafi: husband gets 1/2 + radd (more than 50%)", () => {
    const result = runEngine("hanafi", estate, heirs);
    const h = findShare(result, "husband");
    expect(h).toBeDefined();
    expect(h!.percentage).toBeGreaterThan(0.5);
    expect(h!.amount).toBeGreaterThan(50000);
  });

  it("Hanbali: husband gets 1/2 + radd (more than 50%)", () => {
    const result = runEngine("hanbali", estate, heirs);
    const h = findShare(result, "husband");
    expect(h).toBeDefined();
    expect(h!.percentage).toBeGreaterThan(0.5);
    expect(h!.amount).toBeGreaterThan(50000);
  });

  it("Shafii: husband gets exactly 1/2 (no radd)", () => {
    const result = runEngine("shafii", estate, heirs);
    const h = findShare(result, "husband");
    expect(h).toBeDefined();
    expect(h!.amount).toBeCloseTo(50000, 0);
  });

  it("Maliki: husband gets exactly 1/2 (no radd)", () => {
    const result = runEngine("maliki", estate, heirs);
    const h = findShare(result, "husband");
    expect(h).toBeDefined();
    expect(h!.amount).toBeCloseTo(50000, 0);
  });
});

// ============================================================================
// NON-IJMA CASE 3: Grandmother priority — different directions, different degrees
// Paternal grandmother (closer) vs maternal grandmother (farther)
// Hanafi/Hanbali: closer blocks farther
// Shafii/Maliki: both share equally
// ============================================================================
describe("Grandmother priority — same degree, different directions (all madhabs share equally)", () => {
  const estate: EstateData = { total: 300000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = {
    grandmother_father: 1,
    grandmother_mother: 1,
    husband: 1,
  };

  it("Hanafi: both grandmothers share equally, radd applied", () => {
    const result = runEngine("hanafi", estate, heirs);
    const paternal = findShare(result, "grandmother_father");
    const maternal = findShare(result, "grandmother_mother");
    expect(paternal).toBeDefined();
    expect(maternal).toBeDefined();
    // Husband gets 1/2 = 150k; grandmothers share remainder with radd
    // Each gets 1/12 base + radd = 75k each
    expect(paternal!.amount).toBeCloseTo(75000, 0);
    expect(maternal!.amount).toBeCloseTo(75000, 0);
  });

  it("Hanbali: both grandmothers share equally, radd applied", () => {
    const result = runEngine("hanbali", estate, heirs);
    const paternal = findShare(result, "grandmother_father");
    const maternal = findShare(result, "grandmother_mother");
    expect(paternal).toBeDefined();
    expect(maternal).toBeDefined();
    expect(paternal!.amount).toBeCloseTo(75000, 0);
    expect(maternal!.amount).toBeCloseTo(75000, 0);
  });

  it("Shafii: both grandmothers share equally (1/12 each, no radd)", () => {
    const result = runEngine("shafii", estate, heirs);
    const paternal = findShare(result, "grandmother_father");
    const maternal = findShare(result, "grandmother_mother");
    expect(paternal).toBeDefined();
    expect(maternal).toBeDefined();
    expect(paternal!.amount).toBeCloseTo(25000, 0);
    expect(maternal!.amount).toBeCloseTo(25000, 0);
  });

  it("Maliki: both grandmothers share equally (1/12 each, no radd)", () => {
    const result = runEngine("maliki", estate, heirs);
    const paternal = findShare(result, "grandmother_father");
    const maternal = findShare(result, "grandmother_mother");
    expect(paternal).toBeDefined();
    expect(maternal).toBeDefined();
    expect(paternal!.amount).toBeCloseTo(25000, 0);
    expect(maternal!.amount).toBeCloseTo(25000, 0);
  });
});

// ============================================================================
// UI DYNAMIC BLOCKING: getBlockedHeirs tests
// ============================================================================
describe("UI Blocking: getBlockedHeirs", () => {
  it("son blocks extended family in getBlockedHeirs (all madhabs)", () => {
    const selectedHeirs: Record<string, number> = {
      son: 1,
      maternal_brother: 1,
      maternal_sister: 1,
      full_uncle: 1,
      paternal_uncle: 1,
      paternal_aunt: 1,
      full_nephew: 1,
      paternal_nephew: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.maternal_brother).toBeDefined();
      expect(blocked.maternal_sister).toBeDefined();
      expect(blocked.full_uncle).toBeDefined();
      expect(blocked.paternal_uncle).toBeDefined();
      expect(blocked.paternal_aunt).toBeDefined();
      expect(blocked.full_nephew).toBeDefined();
      expect(blocked.paternal_nephew).toBeDefined();
    }
  });

  it("mother blocks grandmother_mother and grandmother_father in getBlockedHeirs", () => {
    const selectedHeirs: Record<string, number> = {
      mother: 1,
      grandmother_mother: 1,
      grandmother_father: 1,
      husband: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.grandmother_mother).toBeDefined();
      expect(blocked.grandmother_father).toBeDefined();
    }
  });

  it("daughter blocks maternal_sister in getBlockedHeirs", () => {
    const selectedHeirs: Record<string, number> = {
      daughter: 1,
      maternal_sister: 1,
      husband: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.maternal_sister).toBeDefined();
    }
  });

  it("2+ granddaughters block paternal_aunt in getBlockedHeirs", () => {
    const selectedHeirs: Record<string, number> = {
      granddaughter: 2,
      paternal_aunt: 1,
      husband: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.paternal_aunt).toBeDefined();
    }
  });

  it("full_brother blocks paternal siblings in getBlockedHeirs", () => {
    const selectedHeirs: Record<string, number> = {
      full_brother: 1,
      paternal_brother: 1,
      paternal_sister: 1,
      husband: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.paternal_brother).toBeDefined();
      expect(blocked.paternal_sister).toBeDefined();
    }
  });

  it("grandson (no son) blocks full siblings in getBlockedHeirs", () => {
    const selectedHeirs: Record<string, number> = {
      grandson: 1,
      full_brother: 1,
      full_sister: 1,
      wife: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.full_brother).toBeDefined();
      expect(blocked.full_sister).toBeDefined();
    }
  });

  it("grandson WITH son does NOT block siblings", () => {
    const selectedHeirs: Record<string, number> = {
      son: 1,
      grandson: 1,
      full_brother: 1,
      wife: 1,
    };
    for (const madhab of MADHABS) {
      const blocked = getBlockedHeirs(madhab, selectedHeirs);
      expect(blocked.full_brother).toBeDefined(); // blocked by son, not grandson
    }
  });
});

// ============================================================================
// EDGE CASES: Engine-level blocking verification
// ============================================================================
describe("Engine: Mother blocks all grandmothers (IJMA)", () => {
  const estate: EstateData = { total: 600000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = {
    mother: 1,
    grandmother: 1,
    husband: 1,
  };

  it("hijab: mother blocks grandmother (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.mother).toBe(1);
      expect(h.grandmother).toBe(0);
    }
  });

  it("engine: mother gets grandmother's share, grandmother gets 0", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const mother = findShare(result, "mother");
      expect(mother).toBeDefined();
      expect(mother!.amount).toBeGreaterThan(0);
      const gm = findShare(result, "grandmother");
      expect(gm).toBeUndefined();
    }
  });
});

describe("Engine: Son blocks extended family", () => {
  const estate: EstateData = { total: 1000000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = {
    son: 1,
    maternal_brother: 1,
    maternal_sister: 1,
    full_uncle: 1,
    paternal_uncle: 1,
    paternal_aunt: 1,
    full_nephew: 1,
    paternal_nephew: 1,
    wife: 1,
  };

  it("hijab: son blocks ALL extended family (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.maternal_brother).toBe(0);
      expect(h.maternal_sister).toBe(0);
      expect(h.full_uncle).toBe(0);
      expect(h.paternal_uncle).toBe(0);
      expect(h.paternal_aunt).toBe(0);
      expect(h.full_nephew).toBe(0);
      expect(h.paternal_nephew).toBe(0);
    }
  });

  it("engine: only son and wife receive (all madhabs)", () => {
    for (const madhab of MADHABS) {
      const result = runEngine(madhab, estate, heirs);
      const keys = result.shares.map((s) => s.key);
      expect(keys).toContain("wife");
      expect(keys).not.toContain("maternal_brother");
      expect(keys).not.toContain("maternal_sister");
      expect(keys).not.toContain("full_uncle");
      expect(keys).not.toContain("paternal_uncle");
      expect(keys).not.toContain("paternal_aunt");
      expect(keys).not.toContain("full_nephew");
      expect(keys).not.toContain("paternal_nephew");
    }
  });
});

describe("Engine: Grandson blocks full siblings (no son)", () => {
  const estate: EstateData = { total: 600000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = { grandson: 1, full_brother: 1, full_sister: 1, wife: 1 };

  it("hijab: grandson blocks full siblings", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.full_brother).toBe(0);
      expect(h.full_sister).toBe(0);
    }
  });
});

describe("Engine: Daughter blocks maternal sister", () => {
  const estate: EstateData = { total: 600000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = { daughter: 1, maternal_sister: 1, husband: 1 };

  it("hijab: daughter blocks maternal_sister", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.daughter).toBe(1);
      expect(h.maternal_sister).toBe(0);
    }
  });
});

describe("Engine: 2+ granddaughters block paternal aunt", () => {
  const estate: EstateData = { total: 600000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = { granddaughter: 2, paternal_aunt: 1, husband: 1 };

  it("hijab: 2 granddaughters block paternal aunt", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.granddaughter).toBe(2);
      expect(h.paternal_aunt).toBe(0);
    }
  });
});

describe("Engine: Full brother blocks paternal siblings", () => {
  const estate: EstateData = { total: 600000, funeral: 0, debts: 0, will: 0 };
  const heirs: HeirsData = {
    full_brother: 1,
    paternal_brother: 1,
    paternal_sister: 1,
    husband: 1,
  };

  it("hijab: full brother blocks paternal siblings", () => {
    for (const madhab of MADHABS) {
      const sys = new HijabSystem(madhab);
      const { heirs: h } = sys.applyHijab({ ...heirs });
      expect(h.full_brother).toBe(1);
      expect(h.paternal_brother).toBe(0);
      expect(h.paternal_sister).toBe(0);
    }
  });
});
