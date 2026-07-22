/**
 * نظام الحجب الفقهي الشامل
 * Comprehensive Islamic Hijab (Inheritance Obstruction) System
 *
 * يطبق جميع قواعس الحجب حسب كل مذهب إسلامي
 */

import { MadhhabType, HeirsData } from "./types";
import { getHijabRules } from "./constants";

export class HijabSystem {
  private madhab: MadhhabType;
  private hijabLog: string[] = [];

  constructor(madhab: MadhhabType) {
    this.madhab = madhab;
  }

  /**
   * تطبيق قواعس الحجب على الورثة
   * Apply hijab rules to heirs
   */
  applyHijab(heirs: HeirsData): { heirs: HeirsData; log: string[] } {
    this.hijabLog = [];
    const result = { ...heirs };

    // تطبيق الحجب الكامل
    this.applyCompleteHijab(result);

    // تطبيق الحجب الناقص
    this.applyPartialHijab(result);

    return {
      heirs: result,
      log: this.hijabLog,
    };
  }

  /**
   * الحجب الكامل: حرمان الوارث من الميراث كلياً
   * Complete Hijab: Complete deprivation from inheritance
   */
  private applyCompleteHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);

    // قائمة الحجب الكامل
    const completeHijabRules = rules.filter((r) => r.type === "complete");

    for (const rule of completeHijabRules) {
      const hijabber = heirs[rule.hijabber];

      if (hijabber && hijabber > 0) {
        for (const hijabbed of rule.hijabbed) {
          if (heirs[hijabbed] && heirs[hijabbed]! > 0) {
            this.hijabLog.push(`${rule.hijabber} blocks ${hijabbed}`);
            heirs[hijabbed] = 0;
          }
        }
      }
    }

    // When a rule blocks generic "grandmother" key, also block split keys
    // (grandmother_mother, grandmother_father) that the user may have entered
    for (const rule of completeHijabRules) {
      if (
        rule.hijabbed.includes("grandmother") &&
        (heirs[rule.hijabber] || 0) > 0
      ) {
        if ((heirs.grandmother_mother || 0) > 0) {
          this.hijabLog.push(`${rule.hijabber} blocks grandmother_mother`);
          heirs.grandmother_mother = 0;
        }
        if ((heirs.grandmother_father || 0) > 0) {
          this.hijabLog.push(`${rule.hijabber} blocks grandmother_father`);
          heirs.grandmother_father = 0;
        }
      }
    }

    // ===== MADHAB-SPECIFIC RULE: Grandfather with siblings =====
    const hasGrandfather = (heirs.grandfather || 0) > 0;
    const hasSiblings =
      (heirs.full_brother || 0) > 0 ||
      (heirs.full_sister || 0) > 0 ||
      (heirs.half_brother_paternal || 0) > 0 ||
      (heirs.half_sister_paternal || 0) > 0;

    if (hasGrandfather && hasSiblings) {
      // Hanafi: Grandfather BLOCKS siblings (hijab)
      if (this.madhab === "hanafi") {
        this.hijabLog.push(`Grandfather blocks siblings (${this.madhab})`);

        // Block all siblings
        heirs.full_brother = 0;
        heirs.full_sister = 0;
        heirs.half_brother_paternal = 0;
        heirs.half_sister_paternal = 0;
      }

      // Shafii, Maliki & Hanbali: Grandfather SHARES with siblings (muqasamah, handled in computeAsaba)
      else {
        this.hijabLog.push(
          `Grandfather shares with siblings (${this.madhab}, handled in asaba)`,
        );
        // No blocking - shares will be calculated in computeAsaba
      }
    }
    // ===== Granddaughter blocking by daughters =====
    // Rule: 2+ daughters block granddaughters (unless grandson exists)
    if ((heirs.daughter || 0) >= 2 && (heirs.granddaughter || 0) > 0) {
      // Check if there's a grandson to act as co-heir
      const hasGrandson = (heirs.grandson || 0) > 0;

      if (!hasGrandson) {
        // No grandson, so granddaughters are blocked
        this.hijabLog.push(`Two or more daughters block granddaughters`);
        heirs.granddaughter = 0;
      } else {
        // With grandson, granddaughters are not blocked, but will inherit as asaba
        this.hijabLog.push(
          `Daughters with grandson - granddaughters inherit as asaba`,
        );
        // No change - granddaughters will inherit with grandson in asaba
      }
    }

    // ===== Son blocks maternal siblings =====
    if ((heirs.son || 0) > 0) {
      for (const key of ["maternal_brother", "maternal_sister"]) {
        if ((heirs[key] || 0) > 0) {
          this.hijabLog.push(`Son blocks ${key}`);
          heirs[key] = 0;
        }
      }
    }

    // ===== Son blocks paternal aunts and uncles =====
    if ((heirs.son || 0) > 0) {
      for (const key of ["full_uncle", "paternal_uncle", "paternal_aunt"]) {
        if ((heirs[key] || 0) > 0) {
          this.hijabLog.push(`Son blocks ${key}`);
          heirs[key] = 0;
        }
      }
    }

    // ===== Son blocks nephews =====
    if ((heirs.son || 0) > 0) {
      for (const key of ["full_nephew", "paternal_nephew"]) {
        if ((heirs[key] || 0) > 0) {
          this.hijabLog.push(`Son blocks ${key}`);
          heirs[key] = 0;
        }
      }
    }

    // ===== Grandson blocks siblings (when no son) =====
    if ((heirs.grandson || 0) > 0 && (heirs.son || 0) <= 0) {
      for (const key of ["full_brother", "full_sister"]) {
        if ((heirs[key] || 0) > 0) {
          this.hijabLog.push(`Grandson blocks ${key}`);
          heirs[key] = 0;
        }
      }
    }

    // ===== Full brother blocks paternal brother/sister =====
    if ((heirs.full_brother || 0) > 0) {
      for (const key of ["paternal_brother", "paternal_sister"]) {
        if ((heirs[key] || 0) > 0) {
          this.hijabLog.push(`Full brother blocks ${key}`);
          heirs[key] = 0;
        }
      }
    }

    // ===== Daughter blocks maternal sister =====
    if ((heirs.daughter || 0) > 0) {
      if ((heirs.maternal_sister || 0) > 0) {
        this.hijabLog.push(`Daughter blocks maternal_sister`);
        heirs.maternal_sister = 0;
      }
    }

    // ===== 2+ granddaughters block paternal aunt =====
    if ((heirs.granddaughter || 0) >= 2) {
      if ((heirs.paternal_aunt || 0) > 0) {
        this.hijabLog.push(`2+ granddaughters block paternal_aunt`);
        heirs.paternal_aunt = 0;
      }
    }

    // Rule: Single daughter does NOT block granddaughters
    // (granddaughters get 1/6 if daughter=1, or nothing if daughter>=2 without grandson)
    // This is handled in computeFixedShares
  }

  /**
   * الحجب الناقص: تقليل نصيب الوارث
   * Partial Hijab: Reduction in heir's share
   */
  private applyPartialHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);
    const partialHijabRules = rules.filter((r) => r.type === "partial");

    for (const rule of partialHijabRules) {
      // معالجة القواعس الخاصة
      if (rule.reason === "from_third_to_sixth") {
        // الأب يخفض الأم من الثلث إلى السدس
        if (
          heirs["father"] &&
          heirs["father"]! > 0 &&
          heirs["mother"] &&
          heirs["mother"]! > 0
        ) {
          this.hijabLog.push(`Father reduces mother's share from 1/3 to 1/6`);
        }
      }
    }

    // ===== MADHAB-SPECIFIC PARTIAL HIJAB: =====
    // Some madhabs have partial reduction rules that will be handled in calculation engine
  }

  /**
   * التحقق من حق الميراث للوارث
   * Check if heir has inheritance rights
   */
  checkInheritanceRights(heir: string): boolean {
    // القائمة الكاملة للورثة المعترف بهم فقهياً
    const recognizedHeirs = [
      "husband",
      "wife",
      "son",
      "daughter",
      "father",
      "mother",
      "grandfather",
      "grandmother",
      "full_brother",
      "full_sister",
      "half_brother_paternal",
      "half_sister_paternal",
      "half_brother_maternal",
      "half_sister_maternal",
      "nephew_from_brother",
      "niece_from_brother",
      "uncle_paternal",
      "uncle_maternal",
      "aunt_paternal",
      "aunt_maternal",
    ];

    return recognizedHeirs.includes(heir);
  }

  /**
   * الحصول على سجل الحجب
   * Get hijab log
   */
  getHijabLog(): string[] {
    return this.hijabLog;
  }

  /**
   * التحقق من وجود أبناء
   * Check if there are descendants
   */
  hasDescendants(heirs: HeirsData): boolean {
    return (heirs["son"] || 0) > 0 || (heirs["daughter"] || 0) > 0;
  }

  /**
   * التحقق من وجود والد
   * Check if father exists
   */
  hasFather(heirs: HeirsData): boolean {
    return (heirs["father"] || 0) > 0;
  }

  /**
   * التحقق من وجود والدة
   * Check if mother exists
   */
  hasMother(heirs: HeirsData): boolean {
    return (heirs["mother"] || 0) > 0;
  }

  /**
   * التحقق من وجود زوج
   * Check if husband exists
   */
  hasHusband(heirs: HeirsData): boolean {
    return (heirs["husband"] || 0) > 0;
  }

  /**
   * التحقق من وجود زوجة
   * Check if wife exists
   */
  hasWife(heirs: HeirsData): boolean {
    return (heirs["wife"] || 0) > 0;
  }

  /**
   * التحقق من وجود إخوة
   * Check if siblings exist
   */
  hasSiblings(heirs: HeirsData): boolean {
    const siblings =
      (heirs["full_brother"] || 0) +
      (heirs["full_sister"] || 0) +
      (heirs["half_brother_paternal"] || 0) +
      (heirs["half_sister_paternal"] || 0);

    return siblings > 0;
  }

  /**
   * حساب عدد الذكور
   * Count males
   */
  countMales(heirs: HeirsData): number {
    return (
      (heirs["son"] || 0) +
      (heirs["father"] || 0) +
      (heirs["grandfather"] || 0) +
      (heirs["full_brother"] || 0) +
      (heirs["half_brother_paternal"] || 0) +
      (heirs["half_brother_maternal"] || 0) +
      (heirs["uncle_paternal"] || 0) +
      (heirs["uncle_maternal"] || 0)
    );
  }

  /**
   * حساب عدد الإناث
   * Count females
   */
  countFemales(heirs: HeirsData): number {
    return (
      (heirs["daughter"] || 0) +
      (heirs["mother"] || 0) +
      (heirs["grandmother"] || 0) +
      (heirs["full_sister"] || 0) +
      (heirs["half_sister_paternal"] || 0) +
      (heirs["half_sister_maternal"] || 0) +
      (heirs["aunt_paternal"] || 0) +
      (heirs["aunt_maternal"] || 0)
    );
  }

  /**
   * Get the madhab of this instance
   */
  getMadhab(): MadhhabType {
    return this.madhab;
  }
}

// ============================================================================
// DYNAMIC BLOCKING: Real-time hijab enforcement for heir selection UI
// ============================================================================

export interface BlockedHeirInfo {
  blocker: string;
  reason: string;
}

/**
 * Compute which heirs should be blocked in real-time based on currently
 * selected heirs and the active madhab. Reuses the same hijab rules from
 * constants.ts that the engine applies at calculation time.
 */
export function getBlockedHeirs(
  madhab: MadhhabType,
  selectedHeirs: Record<string, number>,
): Record<string, BlockedHeirInfo> {
  const blocked: Record<string, BlockedHeirInfo> = {};
  const rules = getHijabRules(madhab);

  // 1. Standard complete hijab rules from constants
  for (const rule of rules) {
    if (rule.type !== "complete") continue;
    if ((selectedHeirs[rule.hijabber] || 0) <= 0) continue;

    for (const hijabbed of rule.hijabbed) {
      if (!blocked[hijabbed]) {
        blocked[hijabbed] = {
          blocker: rule.hijabber,
          reason: `${rule.hijabber} blocks ${hijabbed}`,
        };
      }
    }
  }

  // Expand generic "grandmother" blocking to split keys
  // When a rule blocks "grandmother", also block grandmother_mother/grandmother_father
  for (const rule of rules) {
    if (
      rule.type === "complete" &&
      rule.hijabbed.includes("grandmother") &&
      (selectedHeirs[rule.hijabber] || 0) > 0
    ) {
      for (const splitKey of ["grandmother_mother", "grandmother_father"]) {
        if (
          (selectedHeirs[splitKey] || 0) > 0 &&
          !blocked[splitKey]
        ) {
          blocked[splitKey] = {
            blocker: rule.hijabber,
            reason: `${rule.hijabber} blocks ${splitKey}`,
          };
        }
      }
    }
  }

  // 2. Madhab-specific: Grandfather blocks siblings (Hanafi only — Shafii/Maliki/Hanbali use muqasamah)
  if (madhab === "hanafi") {
    if ((selectedHeirs["grandfather"] || 0) > 0) {
      const siblingKeys = [
        "full_brother",
        "full_sister",
        "half_brother_paternal",
        "half_sister_paternal",
      ];
      for (const sib of siblingKeys) {
        if (!blocked[sib]) {
          blocked[sib] = {
            blocker: "grandfather",
            reason: "grandfather blocks siblings (Hanafi)",
          };
        }
      }
    }
  }

  // 3. Daughter count rules: 2+ daughters block granddaughters
  if ((selectedHeirs["daughter"] || 0) >= 2) {
    if ((selectedHeirs["grandson"] || 0) <= 0) {
      if (!blocked["granddaughter"]) {
        blocked["granddaughter"] = {
          blocker: "daughter",
          reason: "2+ daughters block granddaughters",
        };
      }
    }
  }

  // 4. Son blocks maternal siblings (all madhabs)
  if ((selectedHeirs["son"] || 0) > 0) {
    const maternalSiblingKeys = ["maternal_brother", "maternal_sister"];
    for (const sib of maternalSiblingKeys) {
      if (!blocked[sib]) {
        blocked[sib] = {
          blocker: "son",
          reason: "الابن يحجب الأخ لأم",
        };
      }
    }
  }

  // 5. Son blocks paternal aunts and uncles (all madhabs)
  if ((selectedHeirs["son"] || 0) > 0) {
    const uncleAuntKeys = ["full_uncle", "paternal_uncle", "paternal_aunt"];
    for (const key of uncleAuntKeys) {
      if (!blocked[key]) {
        blocked[key] = {
          blocker: "son",
          reason: "الابن يحجب العم والعمّة",
        };
      }
    }
  }

  // 6. Son blocks nephews (all madhabs)
  if ((selectedHeirs["son"] || 0) > 0) {
    const nephewKeys = ["full_nephew", "paternal_nephew"];
    for (const key of nephewKeys) {
      if (!blocked[key]) {
        blocked[key] = {
          blocker: "son",
          reason: "الابن يحجب ابن الأخ",
        };
      }
    }
  }

  // 7. Grandson blocks full brothers and sisters (all madhabs)
  if (
    (selectedHeirs["grandson"] || 0) > 0 &&
    (selectedHeirs["son"] || 0) <= 0
  ) {
    const siblingKeys = ["full_brother", "full_sister"];
    for (const sib of siblingKeys) {
      if (!blocked[sib]) {
        blocked[sib] = {
          blocker: "grandson",
          reason: "ابن الابن يحجب الأخ الشقيق",
        };
      }
    }
  }

  // 8. Full brother blocks paternal brother/sister (all madhabs)
  if ((selectedHeirs["full_brother"] || 0) > 0) {
    const paternalSiblingKeys = ["paternal_brother", "paternal_sister"];
    for (const sib of paternalSiblingKeys) {
      if (!blocked[sib]) {
        blocked[sib] = {
          blocker: "full_brother",
          reason: "الأخ الشقيق يحجب الأخ لأب",
        };
      }
    }
  }

  // 9. Daughter blocks maternal sister (all madhabs)
  if ((selectedHeirs["daughter"] || 0) > 0) {
    if (!blocked["maternal_sister"]) {
      blocked["maternal_sister"] = {
        blocker: "daughter",
        reason: "البنت تحجب الأخت لأم",
      };
    }
  }

  // 10. 2+ granddaughters block paternal aunt (all madhabs)
  if ((selectedHeirs["granddaughter"] || 0) >= 2) {
    if (!blocked["paternal_aunt"]) {
      blocked["paternal_aunt"] = {
        blocker: "granddaughter",
        reason: "بنتا الابن تحجبان العمة",
      };
    }
  }

  // 11. Grandmother priority when both maternal and paternal grandmothers exist
  // When both are at same degree (which they are in our system),
  // ALL madhabs share equally — no blocking (IJMA for same-degree different-direction)
  // Madhab differences only apply when grandmothers are at different degrees,
  // which is not possible with our current heir keys.
  // No blocking needed here — computeFixedShares handles equal sharing.

  return blocked;
}
