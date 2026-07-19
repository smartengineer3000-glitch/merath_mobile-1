/**
 * EngineTestScreen parity test — runs exactly the same 40 cases
 * with the same tolerance logic as the in-app test screen.
 */
import { describe, it, expect } from "vitest";
import { EnhancedInheritanceCalculationEngine } from "../lib/inheritance/enhanced-engine-complete";
import type { EstateData, HeirsData, MadhhabType } from "../lib/inheritance/types";

const E: EstateData = { total: 120000, funeral: 0, debts: 0, will: 0 };
const ALL_MADHHABS: MadhhabType[] = ["shafii", "hanafi", "maliki", "hanbali"];

function run(
  name: string,
  madhab: MadhhabType,
  heirs: HeirsData,
  expected: Record<string, number>,
  tolerance = 50,
) {
  const engine = new EnhancedInheritanceCalculationEngine(madhab, E, heirs);
  const result = engine.calculate();
  const computed: Record<string, number> = {};
  for (const s of result.shares) {
    if (s.key) computed[s.key] = Math.round(s.amount);
  }

  it(name, () => {
    expect(result.success).toBe(true);
    for (const [key, expectedVal] of Object.entries(expected)) {
      const computedVal = computed[key];
      expect(computedVal, `Missing heir: ${key}`).toBeDefined();
      expect(
        Math.abs(computedVal! - expectedVal),
        `${key}: expected ${expectedVal}, got ${computedVal} (tolerance ${tolerance})`,
      ).toBeLessThanOrEqual(tolerance);
    }
  });
}

describe("EngineTestScreen parity (40 cases)", () => {
  // ── SIMPLE ──
  for (const m of ALL_MADHHABS) {
    const isRadd = m === "hanafi" || m === "hanbali";
    run(`S1 [${m}]: Wife only`, m, { wife: 1 }, { wife: isRadd ? 120000 : 30000 });
    run(`S2 [${m}]: Husband only`, m, { husband: 1 }, { husband: isRadd ? 120000 : 60000 });
    run(`S3 [${m}]: Son only`, m, { son: 1 }, { son: 120000 });
    run(`S4 [${m}]: Daughter only`, m, { daughter: 1 }, { daughter: 120000 });
    run(`S5 [${m}]: Mother + father`, m, { mother: 1, father: 1 }, { mother: 40000, father: 80000 });
    run(`S6 [${m}]: Wife + son`, m, { wife: 1, son: 1 }, { wife: 15000, son: 105000 });
    run(`S7 [${m}]: Husband + daughter`, m, { husband: 1, daughter: 1 }, { husband: 30000, daughter: 90000 });
    run(`S8 [${m}]: Wife + husband + son`, m, { wife: 1, husband: 1, son: 1 }, { wife: 15000, husband: 30000, son: 75000 });
    run(`S9 [${m}]: Son + 2 daughters`, m, { son: 1, daughter: 2 }, { son: 60000, daughter: 60000 });
    run(`S10 [${m}]: Wife + mother + father + son`, m, { wife: 1, mother: 1, father: 1, son: 1 }, { wife: 15000, mother: 20000, father: 20000, son: 65000 });
  }

  // ── MODERATE ──
  run("M1: Husband + 2 daughters + mother (AWL)", "shafii", { husband: 1, daughter: 2, mother: 1 }, { husband: 27692, daughter: 73846, mother: 18462 }, 100);
  run("M2: Wife + mother + 2 brothers", "shafii", { wife: 1, mother: 1, full_brother: 2 }, { wife: 30000, mother: 20000, full_brother: 70000 });
  run("M3: Husband + mother + brother + sister", "shafii", { husband: 1, mother: 1, full_brother: 1, full_sister: 1 }, { husband: 60000, mother: 20000, full_brother: 26667, full_sister: 13333 }, 100);
  run("M4: Wife + father + mother (Umariyyah)", "shafii", { wife: 1, father: 1, mother: 1 }, { wife: 30000, mother: 30000, father: 60000 });
  run("M5: 4 wives + son", "shafii", { wife: 4, son: 1 }, { wife: 15000, son: 105000 });
  run("M6: Husband + mother + 2 maternal siblings (AWL)", "shafii", { husband: 1, mother: 1, maternal_brother: 1, maternal_sister: 1 }, { husband: 51429, mother: 34286 }, 100);
  run("M7: Wife + father + 2 brothers", "shafii", { wife: 1, father: 1, full_brother: 2 }, { wife: 30000, father: 90000 });
  run("M8: Husband + 2 daughters + mother + father (AWL)", "shafii", { husband: 1, daughter: 2, mother: 1, father: 1 }, { husband: 24000, mother: 16000, father: 16000, daughter: 64000 }, 100);
  run("M9: Wife + grandfather + brother + sister [maliki]", "maliki", { wife: 1, grandfather: 1, full_brother: 1, full_sister: 1 }, { wife: 30000, grandfather: 40000, full_brother: 33333, full_sister: 16667 }, 100);
  run("M10: Wife + 3 daughters + mother (Radd)", "shafii", { wife: 1, daughter: 3, mother: 1 }, { wife: 15000, mother: 21000, daughter: 84000 });

  // ── COMPLEX ──
  run("C1 [shafii]: Umariyyah", "shafii", { wife: 1, mother: 1, father: 1 }, { wife: 30000, mother: 30000, father: 60000 });
  run("C1 [maliki]: Umariyyah", "maliki", { wife: 1, mother: 1, father: 1 }, { wife: 30000, mother: 20000, father: 70000 });
  run("C2 [hanafi]: Wife radd", "hanafi", { wife: 1 }, { wife: 120000 });
  run("C2 [shafii]: Wife no radd", "shafii", { wife: 1 }, { wife: 30000 });
  run("C3 [hanafi]: Husband radd", "hanafi", { husband: 1 }, { husband: 120000 });
  run("C3 [shafii]: Husband no radd", "shafii", { husband: 1 }, { husband: 60000 });
  run("C4a [shafii]: Mother + 1 brother", "shafii", { mother: 1, full_brother: 1 }, { mother: 40000, full_brother: 80000 });
  run("C4b [shafii]: Mother + 2 brothers", "shafii", { mother: 1, full_brother: 2 }, { mother: 20000, full_brother: 100000 });
  run("C5a [shafii]: 2 daughters radd", "shafii", { daughter: 2 }, { daughter: 120000 });
  run("C5b [shafii]: 3 daughters radd", "shafii", { daughter: 3 }, { daughter: 120000 });
  run("C6 [shafii]: Grandfather hijab", "shafii", { grandfather: 1, full_brother: 1 }, { grandfather: 120000 });
  run("C6 [maliki]: Grandfather musharak", "maliki", { grandfather: 1, full_brother: 1 }, { grandfather: 60000 }, 100);
  run("C7: Awl complex", "shafii", { wife: 1, husband: 1, mother: 1, daughter: 2 }, {}, 200);
  run("C8: Father blocks brother", "shafii", { husband: 1, father: 1, full_brother: 1 }, { husband: 60000, father: 60000 });
  run("C9: Awl 2 wives + family", "shafii", { wife: 2, mother: 1, father: 1, daughter: 2 }, {}, 200);
  run("C10 [maliki]: Grandfather + 3 brothers", "maliki", { grandfather: 1, full_brother: 3 }, { grandfather: 40000, full_brother: 80000 });

  // ── SPECIAL ──
  run("SP1 [shafii]: Musharraka", "shafii", { husband: 1, mother: 1, maternal_brother: 2, full_sister: 1 }, { husband: 60000, mother: 20000 });
  run("SP2 [shafii]: Akdariyya", "shafii", { husband: 1, mother: 1, grandfather: 1, full_sister: 1 }, { husband: 40000, mother: 26667, grandfather: 35556, full_sister: 17778 }, 100);
  run("SP3: Dhawu al-Arham (daughter_son)", "shafii", { wife: 1, daughter_son: 1 }, { wife: 30000, daughter_son: 90000 });
  run("SP4: Dhawu al-Arham (maternal_uncle)", "shafii", { wife: 1, maternal_uncle: 1 }, { wife: 30000, maternal_uncle: 90000 });
  run("SP5: Dhawu al-Arham (full_nephew)", "shafii", { wife: 1, full_nephew: 1 }, { wife: 30000, full_nephew: 90000 });
  run("SP6: Dhawu al-Arham (daughter_daughter)", "shafii", { wife: 1, daughter_daughter: 1 }, { wife: 30000, daughter_daughter: 90000 });
  run("SP7: Grandmother priority", "shafii", { wife: 1, grandmother_father: 1, grandmother_mother: 1 }, { wife: 30000, grandmother_father: 90000 });
  run("SP8: Grandmother radd", "shafii", { wife: 1, grandmother: 1 }, { wife: 30000, grandmother: 90000 });
  run("SP9 [hanafi]: Husband radd", "hanafi", { husband: 1 }, { husband: 120000 });
  run("SP9 [shafii]: Husband no radd", "shafii", { husband: 1 }, { husband: 60000 });
  run("SP10 [maliki]: Musharak", "maliki", { husband: 1, grandfather: 1, full_brother: 3 }, { husband: 60000, grandfather: 40000, full_brother: 20000 });
});
