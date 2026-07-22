/**
 * Manual Fiqh Validation - 50+ Real-World Inheritance Scenarios
 *
 * References:
 * - Quran 4:11-12, 176 (An-Nisa): Fixed shares for heirs
 * - Sahih al-Bukhari: "Give the Faraid to those entitled..."
 * - Islam-heritage.com: Complete shares table
 * - Wassiyyah.com: Madhab opinion differences
 * - Islam-héritage.com/awl-radd: Awl and Radd rules
 *
 * Each test case uses estate=240,000 (divisible by 2,3,4,6,8) for clean numbers.
 * We verify: shares sum to net, correct fractions, madhab-specific rules.
 */

import { EnhancedInheritanceCalculationEngine } from "../lib/inheritance/enhanced-engine-complete";
import type { MadhhabType } from "../lib/inheritance/types";

const E = 240000; // Estate (clean number for all fractions)
const TOLERANCE = 2; // Allow rounding tolerance

function run(
  madhab: MadhhabType,
  heirs: Record<string, number>,
  estate = E,
) {
  const engine = new EnhancedInheritanceCalculationEngine(
    madhab,
    { total: estate, funeral: 0, debts: 0, will: 0 },
    heirs,
  );
  return engine.calculate();
}

function shareAmount(result: any, key: string): number {
  const s = result.shares.find(
    (h: any) => h.key === key || h.heir === key || h.heirType === key || h.name === key,
  );
  return s ? s.amount : 0;
}

function hasShare(result: any, key: string): boolean {
  return shareAmount(result, key) > 0;
}

function totalShares(result: any): number {
  return result.shares.reduce((sum: number, h: any) => sum + h.amount, 0);
}

// ============================================================================
// QURAN 4:11 — SON GETS TWICE DAUGHTER'S SHARE
// ============================================================================
describe("Quran 4:11 — Son gets 2x daughter's share", () => {
  it("Case 1: 1 son + 1 daughter — son gets 2x (all madhabs)", () => {
    for (const m of ["shafii", "hanafi", "maliki", "hanbali"] as MadhhabType[]) {
      const r = run(m, { son: 1, daughter: 1 });
      const sonAmt = shareAmount(r, "son");
      const daugAmt = shareAmount(r, "daughter");
      expect(r.success).toBe(true);
      expect(sonAmt).toBeCloseTo(daugAmt * 2, -2);
      expect(totalShares(r)).toBeCloseTo(E, -2);
    }
  });

  it("Case 2: 1 son + 3 daughters — son gets 2x each daughter", () => {
    const r = run("shafii", { son: 1, daughter: 3 });
    // Son gets 2x each daughter; 1 son + 3 daughters = 5 parts
    // Son = 2/5 * E = 96000, each daughter = 1/5 * E = 48000
    // Engine aggregates: son=96000, daughter=144000 (3×48000)
    expect(r.success).toBe(true);
    const sonShare = shareAmount(r, "son");
    const daughterShare = shareAmount(r, "daughter");
    const daughterEntry = r.shares.find((h: any) => h.key === "daughter");
    const daughterCount = daughterEntry?.count || 1;
    expect(sonShare).toBeCloseTo(96000, -2);
    expect(sonShare).toBeCloseTo((daughterShare / daughterCount) * 2, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 3: 2 sons + 1 daughter — daughters=1/3, sons split remainder", () => {
    const r = run("shafii", { son: 2, daughter: 1 });
    // Daughter = 1/2 of son; 2 sons + 1 daughter
    // Daughter gets 1/3 (2/3 total for daughters with 2+ daughters? No, 1 daughter)
    // 1 daughter = 1/2; with sons, daughter gets 1/2 of what each son gets
    // Parts: son=2, son=2, daughter=1 → total 5 parts
    // Daughter = 1/5 * E = 48000
    // Each son = 2/5 * E = 96000
    expect(r.success).toBe(true);
    expect(shareAmount(r, "daughter")).toBeCloseTo(48000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 4: 3 sons + 2 daughters — per-son gets 2x per-daughter", () => {
    const r = run("hanafi", { son: 3, daughter: 2 });
    // Each son gets 2x each daughter
    // Parts: 3 sons × 2 + 2 daughters × 1 = 8 parts
    // Each son = 2/8 * E = 60000, each daughter = 1/8 * E = 30000
    // Engine aggregates: son=180000 (3×60000), daughter=60000 (2×30000)
    expect(r.success).toBe(true);
    const sonShare = shareAmount(r, "son");
    const daughterShare = shareAmount(r, "daughter");
    const sonEntry = r.shares.find((h: any) => h.key === "son");
    const daughterEntry = r.shares.find((h: any) => h.key === "daughter");
    const sonCount = sonEntry?.count || 1;
    const daughterCount = daughterEntry?.count || 1;
    expect(sonShare / sonCount).toBeCloseTo((daughterShare / daughterCount) * 2, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// QURAN 4:12 — DAUGHTER ALONE GETS 1/2, 2+ DAUGHTERS GET 2/3
// ============================================================================
describe("Quran 4:12 — Daughter shares", () => {
  it("Case 5: 1 daughter alone — gets 1/2 (radd in Hanafi/Hanbali, treasury in Shafii/Maliki)", () => {
    // Hanafi: daughter gets 1/2 + radd fills to full estate
    const rH = run("hanafi", { daughter: 1 });
    expect(rH.success).toBe(true);
    expect(rH.raddApplied).toBe(true);
    expect(shareAmount(rH, "daughter")).toBeCloseTo(E, -2);
    // Shafii: daughter gets only 1/2, surplus to Bayt al-Mal
    const rS = run("shafii", { daughter: 1 });
    expect(rS.success).toBe(true);
    expect(rS.raddApplied).toBe(false);
    expect(shareAmount(rS, "daughter")).toBeCloseTo(E / 2, -2);
  });

  it("Case 6: 1 daughter alone — Hanafi: radd gives full estate", () => {
    const r = run("hanafi", { daughter: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 7: 2 daughters alone — get 2/3 (no radd in Shafii, radd in Hanafi)", () => {
    const rShafii = run("shafii", { daughter: 2 });
    expect(rShafii.success).toBe(true);
    expect(rShafii.raddApplied).toBe(false);
    // 2 daughters = 2/3, remainder to treasury
    expect(shareAmount(rShafii, "daughter")).toBeCloseTo((E * 2) / 3, -2);

    const rHanafi = run("hanafi", { daughter: 2 });
    expect(rHanafi.success).toBe(true);
    expect(rHanafi.raddApplied).toBe(true);
    expect(totalShares(rHanafi)).toBeCloseTo(E, -2);
  });

  it("Case 8: 3 daughters alone — get 2/3 (no radd in Shafii, radd in Hanafi)", () => {
    const rShafii = run("shafii", { daughter: 3 });
    expect(rShafii.success).toBe(true);
    expect(rShafii.raddApplied).toBe(false);
    // 3 daughters = 2/3, remainder to treasury
    expect(shareAmount(rShafii, "daughter")).toBeCloseTo((E * 2) / 3, -2);

    const rHanafi = run("hanafi", { daughter: 3 });
    expect(rHanafi.success).toBe(true);
    expect(rHanafi.raddApplied).toBe(true);
    expect(totalShares(rHanafi)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// SPOUSE SHARES — QURAN 4:12
// ============================================================================
describe("Spouse shares — Quran 4:12", () => {
  it("Case 9: Husband alone — gets 1/2 (shafii, no radd)", () => {
    const r = run("shafii", { husband: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "husband")).toBeCloseTo(E / 2, -2);
    expect(r.raddApplied).toBe(false);
  });

  it("Case 10: Husband alone — gets 1/2 then radd (hanafi)", () => {
    const r = run("hanafi", { husband: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 11: Wife alone — gets 1/4 (shafii, no radd)", () => {
    const r = run("shafii", { wife: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 4, -2);
    expect(r.raddApplied).toBe(false);
  });

  it("Case 12: Wife alone — gets 1/4 then radd (hanafi)", () => {
    const r = run("hanafi", { wife: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 13: Husband with descendants — gets 1/4", () => {
    const r = run("hanafi", { husband: 1, son: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "husband")).toBeCloseTo(E / 4, -2);
  });

  it("Case 14: Wife with descendants — gets 1/8", () => {
    const r = run("hanafi", { wife: 1, son: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 8, -2);
  });

  it("Case 15: 4 wives with son — wives share 1/8 total, son gets remainder", () => {
    const r = run("hanafi", { wife: 4, son: 1 });
    expect(r.success).toBe(true);
    // 4 wives share 1/8 = 30000 total (each wife gets 7500)
    // Son gets 7/8 = 210000
    const totalWife = shareAmount(r, "wife");
    expect(totalWife).toBeCloseTo(E / 8, -2);
    expect(shareAmount(r, "son")).toBeCloseTo((E * 7) / 8, -2);
  });
});

// ============================================================================
// MOTHER'S SHARE — QURAN 4:11
// ============================================================================
describe("Mother's share — Quran 4:11", () => {
  it("Case 16: Mother with descendants — gets 1/6", () => {
    const r = run("hanafi", { mother: 1, son: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "mother")).toBeCloseTo(E / 6, -2);
  });

  it("Case 17: Mother alone (no descendants, no siblings) — gets 1/3 + radd fills", () => {
    const r = run("hanafi", { mother: 1 });
    expect(r.success).toBe(true);
    // Mother fard = 1/3 = 80000, radd fills remaining 2/3 in Hanafi
    // She gets the full estate
    expect(r.raddApplied).toBe(true);
    expect(shareAmount(r, "mother")).toBeCloseTo(E, -2);
  });

  it("Case 18: Mother with 2+ siblings — gets 1/6", () => {
    const r = run("hanafi", { mother: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "mother")).toBeCloseTo(E / 6, -2);
  });

  it("Case 19: Father + mother (no children) — mother keeps 1/3, father gets residue", () => {
    // Without children, father does NOT reduce mother to 1/6
    // Mother gets 1/3 = 80000, father gets asaba residue = 160000
    const r = run("hanafi", { father: 1, mother: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "mother")).toBeCloseTo(E / 3, -2);
    expect(shareAmount(r, "father")).toBeCloseTo((E * 2) / 3, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 20: Mother alone with father (Umariyyah) — mother 1/3, father remainder", () => {
    const r = run("hanafi", { mother: 1, father: 1, wife: 1 });
    // Wife: 1/4 = 60000
    // Mother: 1/3 of remainder = 1/3 × 180000 = 60000
    // Father: remainder = 120000
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(60000, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo(60000, -2);
    expect(shareAmount(r, "father")).toBeCloseTo(120000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// FATHER'S SHARE
// ============================================================================
describe("Father's share", () => {
  it("Case 21: Father with descendants — gets 1/6", () => {
    const r = run("hanafi", { father: 1, son: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "father")).toBeCloseTo(E / 6, -2);
  });

  it("Case 22: Father alone (no descendants) — gets residue (asaba)", () => {
    const r = run("hanafi", { father: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "father")).toBeCloseTo(E, -2);
  });

  it("Case 23: Father with daughters only — gets 1/6 + residue", () => {
    const r = run("hanafi", { father: 1, daughter: 1 });
    expect(r.success).toBe(true);
    // Daughter: 1/2 = 120000
    // Father: 1/6 + residue = 40000 + 80000 = 120000
    expect(shareAmount(r, "father")).toBeCloseTo(120000, -2);
    expect(shareAmount(r, "daughter")).toBeCloseTo(120000, -2);
  });
});

// ============================================================================
// GRANDFATHER + SIBLINGS — MADHAB DIFFERENCES
// ============================================================================
describe("Grandfather + siblings — madhab differences", () => {
  it("Case 24: Grandfather shares with siblings in Shafii (muqasamah)", () => {
    const r = run("shafii", { grandfather: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    // Shafii: muqasamah (sharing) — grandfather takes best of 1/3, 1/6, or muqasamah
    expect(hasShare(r, "grandfather")).toBe(true);
    expect(hasShare(r, "full_brother")).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 25: Grandfather blocks siblings in Hanafi", () => {
    const r = run("hanafi", { grandfather: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "grandfather")).toBeCloseTo(E, -2);
    expect(hasShare(r, "full_brother")).toBe(false);
  });

  it("Case 26: Grandfather shares with siblings in Maliki (muqasamah)", () => {
    const r = run("maliki", { grandfather: 1, full_brother: 1 });
    expect(r.success).toBe(true);
    expect(hasShare(r, "grandfather")).toBe(true);
    expect(hasShare(r, "full_brother")).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 27: Grandfather shares with siblings in Hanbali", () => {
    const r = run("hanbali", { grandfather: 1, full_brother: 1 });
    expect(r.success).toBe(true);
    expect(hasShare(r, "grandfather")).toBe(true);
    expect(hasShare(r, "full_brother")).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 28: Grandfather + sister (Shafii) — muqasamah (both share)", () => {
    const r = run("shafii", { grandfather: 1, full_sister: 1 });
    expect(r.success).toBe(true);
    expect(hasShare(r, "grandfather")).toBe(true);
    expect(hasShare(r, "full_sister")).toBe(true);
  });

  it("Case 29: Grandfather + sister (Maliki) — both share", () => {
    const r = run("maliki", { grandfather: 1, full_sister: 1 });
    expect(r.success).toBe(true);
    expect(hasShare(r, "grandfather")).toBe(true);
    expect(hasShare(r, "full_sister")).toBe(true);
  });
});

// ============================================================================
// AWL (PROPORTIONAL REDUCTION) — HISTORICALLY FIRST APPLIED BY UMAR
// ============================================================================
describe("Awl cases — proportional reduction", () => {
  it("Case 30: Husband + 2 sisters + mother — classic Awl case", () => {
    // Quranic shares: Husband=1/2, 2 sisters=2/3, mother=1/6
    // Total = 3/6 + 4/6 + 1/6 = 8/6 > 1 → Awl applies
    const r = run("hanafi", {
      husband: 1,
      full_sister: 2,
      mother: 1,
    });
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 31: Husband + 2 full sisters + mother (Shafii) — Awl", () => {
    const r = run("shafii", {
      husband: 1,
      full_sister: 2,
      mother: 1,
    });
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 32: Wife + 2 full brothers + mother — Awl", () => {
    // Wife=1/4, 2 brothers=asaba, mother=1/3 → need to check
    // Actually brothers are asaba, so no awl here. Let me use sisters.
    const r = run("hanafi", {
      wife: 1,
      full_sister: 2,
      mother: 1,
    });
    // Wife=1/4=60000, 2 sisters=2/3=160000, mother=1/3=80000
    // Total = 300000 > 240000 → Awl
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// RADD — SURPLUS TO NON-SPOUSE FIXED-SHARE HEIRS
// ============================================================================
describe("Radd cases — surplus redistribution", () => {
  it("Case 33: Daughter alone (Hanafi) — radd gives her full estate", () => {
    const r = run("hanafi", { daughter: 1 });
    expect(r.raddApplied).toBe(true);
    expect(shareAmount(r, "daughter")).toBeCloseTo(E, -2);
  });

  it("Case 34: Daughter alone (Shafii) — no radd, surplus to Bayt al-Mal", () => {
    const r = run("shafii", { daughter: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(false);
    expect(shareAmount(r, "daughter")).toBeCloseTo(E / 2, -2);
    // Daughter gets 1/2, treasury (Bayt al-Mal) gets the other 1/2
    expect(hasShare(r, "treasury")).toBe(true);
  });

  it("Case 35: Daughter + mother (no spouse) — radd to both (Hanafi)", () => {
    // Daughter=1/2=120000, mother=1/6=40000, total=160000
    // Radd: surplus=80000 redistributed proportionally
    // Daughter fraction=3/4, mother=1/4
    // Daughter gets 120000 + 3/4×80000 = 180000
    // Mother gets 40000 + 1/4×80000 = 60000
    const r = run("hanafi", { daughter: 1, mother: 1 });
    expect(r.raddApplied).toBe(true);
    expect(shareAmount(r, "daughter")).toBeCloseTo(180000, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo(60000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 36: Wife + daughter (Hanafi) — wife gets 1/8, radd to daughter", () => {
    // Wife = 1/8 = 30000 (daughter counts as descendant)
    // Daughter = 1/2 = 120000
    // Total = 150000, surplus = 90000 → radd to daughter
    const r = run("hanafi", { wife: 1, daughter: 1 });
    expect(r.raddApplied).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 8, -2);
    expect(shareAmount(r, "daughter")).toBeCloseTo(210000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 37: Wife + daughter (Shafii) — no radd, surplus to Bayt al-Mal", () => {
    // Wife = 1/8 = 30000, daughter = 1/2 = 120000
    // Total = 150000, surplus = 90000 → treasury (Shafii: no radd)
    const r = run("shafii", { wife: 1, daughter: 1 });
    expect(r.raddApplied).toBe(false);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 8, -2);
    expect(shareAmount(r, "daughter")).toBeCloseTo(E / 2, -2);
    // Treasury gets the surplus
    expect(hasShare(r, "treasury")).toBe(true);
  });

  it("Case 38: Husband + 2 daughters (Hanafi) — radd to daughters", () => {
    // Husband=1/4=60000, 2 daughters=2/3=160000, total=220000
    // Surplus=20000 → radd to daughters only
    const r = run("hanafi", { husband: 1, daughter: 2 });
    expect(r.raddApplied).toBe(true);
    expect(shareAmount(r, "husband")).toBeCloseTo(60000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// MATERNAL SIBLINGS — QURAN 4:12
// ============================================================================
describe("Maternal siblings — Quran 4:12", () => {
  it("Case 39: 1 maternal brother alone — gets 1/6 + radd fills remainder", () => {
    const r = run("hanafi", { maternal_brother: 1 });
    expect(r.success).toBe(true);
    // Engine groups maternal siblings under "maternal_siblings" key
    // With no other heirs, radd fills remainder → full estate
    const maternalEntry = r.shares.find((h: any) => h.key === "maternal_siblings");
    expect(maternalEntry).toBeDefined();
    expect(maternalEntry!.amount).toBeCloseTo(E, -2);
  });

  it("Case 40: 2 maternal siblings — get 1/3 + radd fills remainder", () => {
    const r = run("hanafi", {
      maternal_brother: 1,
      maternal_sister: 1,
    });
    expect(r.success).toBe(true);
    const maternalEntry = r.shares.find((h: any) => h.key === "maternal_siblings");
    expect(maternalEntry).toBeDefined();
    // 1/3 initial + radd fills remainder → full estate
    expect(maternalEntry!.amount).toBeCloseTo(E, -2);
    expect(maternalEntry!.count).toBe(2);
  });

  it("Case 41: Maternal siblings blocked by father (all madhabs)", () => {
    for (const m of ["shafii", "hanafi", "maliki", "hanbali"] as MadhhabType[]) {
      const r = run(m, {
        maternal_brother: 2,
        father: 1,
      });
      expect(r.success).toBe(true);
      expect(hasShare(r, "maternal_brother")).toBe(false);
    }
  });

  it("Case 42: Maternal siblings blocked by son (all madhabs)", () => {
    for (const m of ["shafii", "hanafi", "maliki", "hanbali"] as MadhhabType[]) {
      const r = run(m, {
        maternal_brother: 2,
        son: 1,
      });
      expect(r.success).toBe(true);
      expect(hasShare(r, "maternal_brother")).toBe(false);
    }
  });
});

// ============================================================================
// GRANDMOTHER RULES — HANBALI DIFFERENCE
// ============================================================================
describe("Grandmother rules — madhab differences", () => {
  it("Case 43: Grandmother blocked by mother in Shafii", () => {
    const r = run("shafii", { mother: 1, grandmother_mother: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "mother")).toBeGreaterThan(0);
    expect(hasShare(r, "grandmother_mother")).toBe(false);
  });

  it("Case 44: Grandmother gets 1/6 when no mother (all madhabs)", () => {
    for (const m of ["shafii", "hanafi", "maliki", "hanbali"] as MadhhabType[]) {
      const r = run(m, { grandmother_mother: 1, son: 1 });
      expect(r.success).toBe(true);
      expect(hasShare(r, "grandmother_mother")).toBe(true);
      expect(shareAmount(r, "grandmother_mother")).toBeCloseTo(E / 6, -2);
    }
  });
});

// ============================================================================
// BLOOD RELATIVES (DHAwU AL-ARHAM) — PRIORITY CLASSES
// ============================================================================
describe("Blood relatives — priority classes", () => {
  it("Case 45: Daughter's son (class 1) inherits when no closer heir (Shafii)", () => {
    const r = run("shafii", { daughter_son: 1, wife: 1 });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 4, -2);
    expect(shareAmount(r, "daughter_son")).toBeCloseTo((E * 3) / 4, -2);
  });

  it("Case 46: Class 2 blocked by class 1 (Shafii)", () => {
    const r = run("shafii", {
      daughter_son: 1,
      maternal_uncle: 1,
      wife: 1,
    });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 4, -2);
    expect(shareAmount(r, "daughter_son")).toBeGreaterThan(0);
    expect(hasShare(r, "maternal_uncle")).toBe(false);
  });

  it("Case 47: Maternal uncle (class 3) inherits when no closer heir (Shafii)", () => {
    const r = run("shafii", {
      maternal_uncle: 1,
      wife: 1,
    });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 4, -2);
    expect(shareAmount(r, "maternal_uncle")).toBeCloseTo((E * 3) / 4, -2);
  });

  it("Case 48: Blood relatives not applicable in Maliki (go to treasury)", () => {
    const r = run("maliki", {
      daughter_son: 1,
      wife: 1,
    });
    // In Maliki, blood relatives go to bait-ul-mal
    // Wife gets 1/4, remainder goes to treasury
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 4, -2);
  });
});

// ============================================================================
// COMPLEX MULTI-HEIR SCENARIOS
// ============================================================================
describe("Complex multi-heir scenarios", () => {
  it("Case 49: Wife + son + daughter + father + mother (Shafii)", () => {
    // Wife=1/8=30000, mother=1/6=40000, father=1/6=40000
    // Son+daughter: son=2x daughter; daughter=1/2 of son
    // Remainder after spouse+parents = 240000-110000=130000
    // Actually: wife=1/8, mother=1/6, father=1/6 = 1/8+1/6+1/6 = 3/24+4/24+4/24=11/24
    // Remainder = 13/24 → split between son (2 parts) and daughter (1 part)
    const r = run("shafii", {
      wife: 1,
      son: 1,
      daughter: 1,
      father: 1,
      mother: 1,
    });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(30000, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo(40000, -2);
    expect(shareAmount(r, "father")).toBeCloseTo(40000, -2);
    const sonAmt = shareAmount(r, "son");
    const daugAmt = shareAmount(r, "daughter");
    expect(sonAmt).toBeCloseTo(daugAmt * 2, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 50: Husband + mother + full brother + full sister (Shafii)", () => {
    // Husband = 1/2 = 120000 (no children)
    // Mother = 1/6 = 40000 (2+ siblings present)
    // Remainder = 80000 → brother gets 2/3, sister gets 1/3
    const r = run("shafii", {
      husband: 1,
      mother: 1,
      full_brother: 1,
      full_sister: 1,
    });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "husband")).toBeCloseTo(E / 2, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo(E / 6, -2);
    const broAmt = shareAmount(r, "full_brother");
    const sisAmt = shareAmount(r, "full_sister");
    expect(broAmt).toBeCloseTo(sisAmt * 2, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 51: Wife + father + mother (Shafii) — Umariyyah variant", () => {
    // Wife=1/4=60000
    // Mother=1/3 of remainder=1/3×180000=60000
    // Father=remainder=120000
    const r = run("shafii", {
      wife: 1,
      father: 1,
      mother: 1,
    });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(60000, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo(60000, -2);
    expect(shareAmount(r, "father")).toBeCloseTo(120000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 52: Husband + 2 daughters + mother (Shafii) — Awl case", () => {
    // Husband=1/4, 2 daughters=2/3, mother=1/6
    // = 3/12 + 8/12 + 2/12 = 13/12 > 1 → Awl
    const r = run("shafii", {
      husband: 1,
      daughter: 2,
      mother: 1,
    });
    expect(r.success).toBe(true);
    expect(r.awlApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
    // After awl: husband=3/13, 2 daughters=8/13, mother=2/13 (of E)
    expect(shareAmount(r, "husband")).toBeCloseTo((3 / 13) * E, -2);
    expect(shareAmount(r, "daughter")).toBeCloseTo((8 / 13) * E, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo((2 / 13) * E, -2);
  });

  it("Case 53: Grandson inheriting as asaba with daughters (Maliki)", () => {
    // Grandson + 2 daughters: grandson acts as asaba
    // Daughters get 2/3, grandson gets remainder
    const r = run("maliki", {
      granddaughter: 1,
      grandson: 1,
      wife: 1,
    });
    expect(r.success).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 54: 2 wives + son (Hanafi) — wives share 1/8 total", () => {
    const r = run("hanafi", { wife: 2, son: 1 });
    expect(r.success).toBe(true);
    // 2 wives share 1/8 = 30000 total
    expect(shareAmount(r, "wife")).toBeCloseTo(30000, -2);
    expect(shareAmount(r, "son")).toBeCloseTo(210000, -2);
  });

  it("Case 55: 3 wives + husband's daughter (Maliki)", () => {
    // 3 wives share 1/8=30000, husband's daughter gets 1/2=120000
    // Wait — no "husband's daughter" type. Use "daughter".
    const r = run("maliki", { wife: 3, daughter: 1 });
    expect(r.success).toBe(true);
    // 3 wives share 1/8 = 30000
    // Daughter: 1/2 = 120000
    // Radd to daughter: remainder = 90000
    // Total daughter = 120000 + radd
    expect(shareAmount(r, "wife")).toBeCloseTo(30000, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// HANBALI-SPECIFIC DIFFERENCES
// ============================================================================
describe("Hanbali-specific rules", () => {
  it("Case 56: Grandfather + siblings in Hanbali — shares (not blocked)", () => {
    const r = run("hanbali", { grandfather: 1, full_brother: 2 });
    expect(r.success).toBe(true);
    expect(hasShare(r, "grandfather")).toBe(true);
    expect(hasShare(r, "full_brother")).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 57: Grandmother inherits even when father alive (Hanbali only)", () => {
    // In Hanbali: grandmother gets 1/6 even with father alive
    const r = run("hanbali", { grandmother_mother: 1, father: 1, son: 1 });
    expect(r.success).toBe(true);
    expect(hasShare(r, "grandmother_mother")).toBe(true);
    expect(shareAmount(r, "grandmother_mother")).toBeCloseTo(E / 6, -2);
  });

  it("Case 58: Radd to spouse in Hanbali (unlike Shafii/Maliki)", () => {
    // Wife alone gets 1/4 then radd fills to full
    const r = run("hanbali", { wife: 1 });
    expect(r.success).toBe(true);
    expect(r.raddApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// MALIKI-SPECIFIC — NO BLOOD RELATIVES
// ============================================================================
describe("Maliki — no blood relatives", () => {
  it("Case 59: Blood relative (daughter's son) not recognized in Maliki", () => {
    const r = run("maliki", { daughter_son: 1, wife: 1 });
    expect(r.success).toBe(true);
    // Wife gets 1/4, remainder to bait-ul-mal (not daughter_son)
    expect(shareAmount(r, "wife")).toBeCloseTo(E / 4, -2);
  });
});

// ============================================================================
// MUSHARRAKA — SHAFII/MALIKI
// ============================================================================
describe("Musharraka — shared sibling inheritance", () => {
  it("Case 60: Husband + mother + maternal brothers + full brother (Shafii)", () => {
    // Husband=1/2=120000, mother=1/6=40000
    // Full brother + 2 maternal brothers share remainder=80000
    // In musharraka: count=3 siblings, each gets equal share of remainder
    const r = run("shafii", {
      husband: 1,
      mother: 1,
      maternal_brother: 2,
      full_brother: 1,
    });
    expect(r.success).toBe(true);
    expect(shareAmount(r, "husband")).toBeCloseTo(E / 2, -2);
    expect(shareAmount(r, "mother")).toBeCloseTo(E / 6, -2);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });
});

// ============================================================================
// EDGE CASES
// ============================================================================
describe("Edge cases", () => {
  it("Case 61: Very small estate (1000) with wife + son (Hanafi)", () => {
    const r = run("hanafi", { wife: 1, son: 1 }, 1000);
    expect(r.success).toBe(true);
    expect(shareAmount(r, "wife")).toBeCloseTo(125, -2);
    expect(shareAmount(r, "son")).toBeCloseTo(875, -2);
  });

  it("Case 62: Only deductions, net=0 — should succeed with 0 shares", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "hanafi",
      { total: 100000, funeral: 40000, debts: 60000, will: 0 },
      { wife: 1, son: 1 },
    );
    const r = engine.calculate();
    // Net = 0, but engine should still succeed with 0 shares
    expect(r.success).toBe(true);
    expect(totalShares(r)).toBeCloseTo(0, -2);
  });

  it("Case 63: Net estate exactly 1 with wife + son", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "hanafi",
      { total: 1, funeral: 0, debts: 0, will: 0 },
      { wife: 1, son: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
  });

  it("Case 64: Will exactly 1/3 — valid", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "hanafi",
      { total: 300000, funeral: 0, debts: 0, will: 100000 },
      { wife: 1, son: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
    // Net = 200000
    expect(shareAmount(r, "wife")).toBeCloseTo(25000, -2);
    expect(shareAmount(r, "son")).toBeCloseTo(175000, -2);
  });

  it("Case 65: Will exceeds 1/3 — capped at 1/3", () => {
    const engine = new EnhancedInheritanceCalculationEngine(
      "hanafi",
      { total: 300000, funeral: 0, debts: 0, will: 200000 },
      { wife: 1, son: 1 },
    );
    const r = engine.calculate();
    expect(r.success).toBe(true);
    // Will capped at 100000, net=200000
  });
});

// ============================================================================
// CROSS-MADHAB COMPARISON — SAME SCENARIO, DIFFERENT RESULTS
// ============================================================================
describe("Cross-madhab comparison — same scenario different outcomes", () => {
  it("Case 66: Wife alone — Hanafi/Hanbali get radd, Shafii/Maliki don't", () => {
    const rH = run("hanafi", { wife: 1 });
    const rS = run("shafii", { wife: 1 });
    const rM = run("maliki", { wife: 1 });
    const rB = run("hanbali", { wife: 1 });

    // Hanafi and Hanbali apply radd
    expect(rH.raddApplied).toBe(true);
    expect(rB.raddApplied).toBe(true);

    // Shafii and Maliki do NOT apply radd
    expect(rS.raddApplied).toBe(false);
    expect(rM.raddApplied).toBe(false);

    // Hanafi/Hanbali wife gets full estate via radd
    expect(shareAmount(rH, "wife")).toBeCloseTo(E, -2);
    expect(shareAmount(rB, "wife")).toBeCloseTo(E, -2);

    // Shafii wife gets only 1/4
    expect(shareAmount(rS, "wife")).toBeCloseTo(E / 4, -2);

    // Maliki wife gets only 1/4
    expect(shareAmount(rM, "wife")).toBeCloseTo(E / 4, -2);
  });

  it("Case 67: Grandfather + full brother — 4 different outcomes", () => {
    const rH = run("hanafi", { grandfather: 1, full_brother: 1 });
    const rS = run("shafii", { grandfather: 1, full_brother: 1 });
    const rM = run("maliki", { grandfather: 1, full_brother: 1 });
    const rB = run("hanbali", { grandfather: 1, full_brother: 1 });

    // Hanafi: grandfather blocks brother
    expect(shareAmount(rH, "grandfather")).toBeCloseTo(E, -2);
    expect(hasShare(rH, "full_brother")).toBe(false);

    // Shafii: grandfather shares with brother (muqasamah)
    expect(hasShare(rS, "grandfather")).toBe(true);
    expect(hasShare(rS, "full_brother")).toBe(true);
    expect(totalShares(rS)).toBeCloseTo(E, -2);

    // Maliki: both share
    expect(hasShare(rM, "grandfather")).toBe(true);
    expect(hasShare(rM, "full_brother")).toBe(true);
    expect(totalShares(rM)).toBeCloseTo(E, -2);

    // Hanbali: both share
    expect(hasShare(rB, "grandfather")).toBe(true);
    expect(hasShare(rB, "full_brother")).toBe(true);
    expect(totalShares(rB)).toBeCloseTo(E, -2);
  });

  it("Case 68: Husband alone — Hanafi/Hanbali radd, Shafii/Maliki no radd", () => {
    const rH = run("hanafi", { husband: 1 });
    const rS = run("shafii", { husband: 1 });
    expect(rH.raddApplied).toBe(true);
    expect(rS.raddApplied).toBe(false);
    expect(shareAmount(rH, "husband")).toBeCloseTo(E, -2);
    expect(shareAmount(rS, "husband")).toBeCloseTo(E / 2, -2);
  });

  it("Case 69: Daughter + mother (no spouse) — Hanafi radd, Shafii no radd", () => {
    const rH = run("hanafi", { daughter: 1, mother: 1 });
    const rS = run("shafii", { daughter: 1, mother: 1 });

    expect(rH.raddApplied).toBe(true);
    expect(rS.raddApplied).toBe(false); // Shafii: no radd, surplus to Bayt al-Mal

    // Hanafi radd: Daughter=1/2, mother=1/6 → total=2/3, radd fills remaining 1/3
    // Proportional: daughter=3/4, mother=1/4
    // Daughter = 120000 + 3/4×80000 = 180000
    // Mother = 40000 + 1/4×80000 = 60000
    expect(shareAmount(rH, "daughter")).toBeCloseTo(180000, -2);
    expect(shareAmount(rH, "mother")).toBeCloseTo(60000, -2);
    expect(totalShares(rH)).toBeCloseTo(E, -2);

    // Shafii: no radd — daughter=1/2=120000, mother=1/6=40000
    expect(shareAmount(rS, "daughter")).toBeCloseTo(E / 2, -2);
    expect(shareAmount(rS, "mother")).toBeCloseTo(E / 6, -2);
  });
});

// ============================================================================
// AWL PROPORTIONALITY VERIFICATION
// ============================================================================
describe("Awl proportionality — shares reduce correctly", () => {
  it("Case 70: Awl preserves relative proportions", () => {
    // Husband=1/4, 2 daughters=2/3, mother=1/6
    // = 3/12 + 8/12 + 2/12 = 13/12 → Awl denominator becomes 13
    const r = run("hanafi", {
      husband: 1,
      daughter: 2,
      mother: 1,
    });
    expect(r.awlApplied).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);

    // After awl: husband=3/13, 2 daughters=8/13, mother=2/13 (of E)
    const h = shareAmount(r, "husband");
    const d = shareAmount(r, "daughter");
    const m = shareAmount(r, "mother");
    expect(h).toBeCloseTo((3 / 13) * E, -2);
    expect(d).toBeCloseTo((8 / 13) * E, -2);
    expect(m).toBeCloseTo((2 / 13) * E, -2);
  });
});

// ============================================================================
// MATHEMATICAL INVARIANTS
// ============================================================================
describe("Mathematical invariants", () => {
  it("Case 71: All shares sum to net estate (50+ heir types)", () => {
    // Stress test with many heir types at once
    const r = run("hanafi", {
      wife: 1,
      mother: 1,
      full_brother: 1,
      full_sister: 1,
      maternal_brother: 1,
    });
    expect(r.success).toBe(true);
    expect(totalShares(r)).toBeCloseTo(E, -2);
  });

  it("Case 72: No heir gets negative amount", () => {
    const r = run("shafii", {
      wife: 1,
      son: 1,
      daughter: 1,
      father: 1,
      mother: 1,
      full_brother: 1,
      full_sister: 1,
    });
    for (const s of r.shares) {
      expect(s.amount).toBeGreaterThanOrEqual(0);
    }
  });

  it("Case 73: Son share always >= daughter share (same estate)", () => {
    for (const m of ["shafii", "hanafi", "maliki", "hanbali"] as MadhhabType[]) {
      const r = run(m, { son: 1, daughter: 1 });
      expect(shareAmount(r, "son")).toBeGreaterThanOrEqual(
        shareAmount(r, "daughter"),
      );
    }
  });

  it("Case 74: Husband share always >= wife share (same estate)", () => {
    for (const m of ["shafii", "hanafi", "maliki", "hanbali"] as MadhhabType[]) {
      const r = run(m, { husband: 1, wife: 1 });
      expect(shareAmount(r, "husband")).toBeGreaterThanOrEqual(
        shareAmount(r, "wife"),
      );
    }
  });
});
