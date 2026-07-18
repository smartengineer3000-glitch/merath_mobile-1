/**
 * Enhanced Inheritance Calculation Engine - Complete Islamic Law Implementation
 * Full implementation of all features from original Merath_Cluade_Pro7.html
 *
 * تحتوي على جميع قواعد الفروض والعصبات والحالات الخاصة الكاملة
 * شاملة لجميع المذاهب الأربعة (حنفي، مالكي، شافعي، حنبلي)
 *
 * FIXES IMPLEMENTED:
 * - C1: Musharraka (المشتركة/الحمارية) special case
 * - C2: Akdariyya (الأكدرية/الغراء) special case
 * - C3: Grandfather with siblings optimal selection (muqasamah vs third vs sixth)
 * - C4: Blood relatives priority system by class
 */

import { FractionClass } from "./fraction";
import { FIQH_DATABASE } from "./constants";
import { InvariantEngine } from "./invariant";
import type {
  EstateData,
  HeirsData,
  MadhhabType,
  CalculationResult,
  HeirShare,
  HeirType,
} from "./types";
import { HijabSystem } from "./hijab-system";
import {
  normalizeEstateInput,
  normalizeHeirsInput,
  validateEngineInput,
} from "./engine-input";

interface HeirShareObject {
  key: string;
  name: string;
  type: string;
  fraction: FractionClass;
  count: number;
  reason: string;
  addToExisting?: boolean;
}

interface EngineState {
  blockedHeirs: string[];
  hijabTypes: string[];
  awlApplied: boolean;
  raddApplied: boolean;
  bloodRelativesApplied: boolean;
  confidenceFactors: string[];
  specialCases: { type: string; name: string; description: string }[];
}

export class EnhancedInheritanceCalculationEngine {
  private madhab: MadhhabType;
  private estate: EstateData;
  private heirs: HeirsData;
  private hijabSystem: HijabSystem;
  private steps: {
    step: string;
    description: string;
    code: string;
    data?: unknown;
  }[] = [];
  private specialCases: {
    type: string;
    name: string;
    description: string;
  }[] = [];
  private state: EngineState = {
    blockedHeirs: [],
    hijabTypes: [],
    awlApplied: false,
    raddApplied: false,
    bloodRelativesApplied: false,
    confidenceFactors: [],
    specialCases: [],
  };

  constructor(madhab: MadhhabType, estate: EstateData, heirs: HeirsData) {
    this.madhab = madhab;
    this.estate = normalizeEstateInput(estate);
    this.heirs = normalizeHeirsInput(heirs);
    this.hijabSystem = new HijabSystem(madhab);
  }

  calculate(): CalculationResult {
    const startTime = performance.now();
    const steps: string[] = [];

    try {
      const validation = this.validateInput();
      if (!validation.valid) {
        const endTime = performance.now();
        const calcSteps = steps.map((s, i) => ({
          stepNumber: i + 1,
          title: s,
          description: "",
          action: "validate",
          details: {},
          timestamp: new Date().toISOString(),
        }));

        return {
          success: false,
          madhab: this.madhab,
          madhhabName: this.madhab,
          shares: [],
          confidence: 0,
          confidenceFactors: [],
          steps: calcSteps,
          calculationTime: endTime - startTime,
          error: validation.error,
          specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] },
        };
      }
      steps.push("التحقق من البيانات: validate");

      const netEstate = this.calculateNetEstate();
      steps.push("حساب التركة الصافية: estate_calculation");

      const hijabResult = this.hijabSystem.applyHijab(this.heirs);
      const validHeirs = hijabResult.heirs;
      const hijabLog = hijabResult.log || [];
      this.state.blockedHeirs = hijabLog;
      steps.push("تطبيق الحجب: hijab");

      let fixedShares: HeirShareObject[] = [];

      if (this.isMusharraka(validHeirs)) {
        fixedShares = this.computeMusharraka(validHeirs);
        this.state.specialCases.push({
          type: "musharraka",
          name: "المشتركة",
          description: "الإخوة الأشقاء يشاركون الإخوة لأم في الثلث",
        });
        steps.push("المشتركة: musharraka");
      } else if (this.isAkdariyya()) {
        fixedShares = this.computeAkdariyya();
        this.state.specialCases.push({
          type: "akdariyya",
          name: "الأكدرية",
          description: "مسألة الأكدرية - للجد مع الأخت طريقة خاصة",
        });
        steps.push("الأكدرية: akdariyya");
      } else {
        fixedShares = this.computeFixedShares(validHeirs);
        steps.push("الفروض: fixed_shares");
      }

      const totalFixed = this.sumFractions(fixedShares.map((s) => s.fraction));
      let adjustedFixed = fixedShares;

      if (totalFixed.toDecimal() > 1) {
        adjustedFixed = this.applyAwl(fixedShares, totalFixed);
        this.state.awlApplied = true;
        steps.push("الأول: awl");
      }

      // M1 FIX: Compute remainder from adjusted fractions (post-awl), not pre-awl totalFixed
      const totalAdjusted = this.sumFractions(
        adjustedFixed.map((s) => s.fraction),
      );
      const remainder = new FractionClass(1, 1).subtract(totalAdjusted);
      steps.push("حساب الباقي: remainder");

      const asabaShares = this.computeAsaba(
        adjustedFixed,
        remainder,
        validHeirs,
      );
      steps.push("العصبات: asaba");

      const allShares = this.mergeShares(adjustedFixed, asabaShares);
      steps.push("دمج الفروض والعصبات: merge");

      const totalAllShares = this.sumFractions(
        allShares.map((s) => s.fraction),
      );
      const finalRemainder = new FractionClass(1, 1).subtract(totalAllShares);
      steps.push("إعادة حساب الباقي: recalculate");

      let finalShares = allShares;
      if (finalRemainder.toDecimal() > 0.0001 && asabaShares.length === 0) {
        const raddResult = this.applyRadd(allShares, finalRemainder);
        finalShares = raddResult.shares;
        if (raddResult.applied) {
          this.state.raddApplied = true;
          steps.push("الرد: radd");
        }
      }

      // Recalculate remainder after radd
      const totalAfterRadd = this.sumFractions(
        finalShares.map((s) => s.fraction),
      );
      const remainderAfterRadd = new FractionClass(1, 1).subtract(
        totalAfterRadd,
      );

      if (remainderAfterRadd.toDecimal() > 0.0001 && asabaShares.length === 0) {
        const bloodDistribution = this.distributeToBloodRelatives(
          finalShares,
          remainderAfterRadd,
        );
        finalShares = bloodDistribution.shares;
        if (bloodDistribution.bloodRelatives.length > 0) {
          this.state.bloodRelativesApplied = true;
          this.specialCases.push({
            type: "blood_relatives",
            name: "ذوو الأرحام",
            description: "توزيع الباقي على ذوي الأرحام",
          });
          steps.push("ذوو الأرحام: blood_relatives");
        }
      }

      const results = this.calculateFinalAmounts(finalShares, netEstate);
      steps.push("تحويل للمبالغ: amounts");

      // D1 FIX: Wire InvariantEngine conservation check
      let invariantFailed = false;
      try {
        const allocations: Record<string, { toDecimal: () => number }> = {};
        for (const s of finalShares) {
          allocations[s.key] = { toDecimal: () => s.fraction.toDecimal() };
        }
        InvariantEngine.assertConservation(allocations);
      } catch (invariantError) {
        invariantFailed = true;
        this.state.confidenceFactors.push(
          `انتهاك حفظ الكتلة: ${(invariantError as Error).message}`,
        );
      }

      const confidence = this.calculateConfidence(
        results,
        validHeirs,
        invariantFailed,
      );
      steps.push("حساب مستوى الثقة: confidence");

      const endTime = performance.now();
      const calcSteps = steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s,
        description: "",
        action: "info",
        details: {},
        timestamp: new Date().toISOString(),
      }));

      const special: import("./types").SpecialCases = {
        awl: this.specialCases.some((sc) => sc.type === "awl"),
        auled: 0,
        radd: this.specialCases.some((sc) => sc.type === "radd"),
        hijabTypes: hijabLog,
      };

      return {
        success: true,
        madhab: this.madhab,
        madhhabName: this.madhab,
        shares: results,
        netEstate: netEstate,
        confidence,
        confidenceFactors: this.state.confidenceFactors,
        steps: calcSteps,
        calculationTime: endTime - startTime,
        specialCases: special,
        awlApplied: this.state.awlApplied,
        raddApplied: this.state.raddApplied,
        bloodRelativesApplied: this.state.bloodRelativesApplied,
        blockedHeirs: this.state.blockedHeirs,
      };
    } catch (error) {
      const endTime = performance.now();
      const calcSteps = steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s,
        description: "",
        action: "error",
        details: {},
        timestamp: new Date().toISOString(),
      }));

      return {
        success: false,
        madhab: this.madhab,
        madhhabName: this.madhab,
        shares: [],
        confidence: 0,
        confidenceFactors: ["حدث خطأ في الحساب"],
        steps: calcSteps,
        calculationTime: endTime - startTime,
        error: `خطأ في الحساب: ${(error as Error).message}`,
        specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] },
      };
    }
  }

  private calculateNetEstate(): number {
    let net = this.estate.total;
    net -= this.estate.funeral || 0;
    net -= this.estate.debts || 0;

    const remainderAfterFuneral =
      this.estate.total - (this.estate.funeral || 0) - (this.estate.debts || 0);
    const maxWill = remainderAfterFuneral / 3;
    const actualWill = Math.min(this.estate.will || 0, maxWill);

    net -= actualWill;

    return Math.max(0, net);
  }

  private applyHijab(heirs: HeirsData): HeirsData {
    const result = this.hijabSystem.applyHijab(heirs);
    return result.heirs;
  }

  private isMusharraka(filteredHeirs?: HeirsData): boolean {
    // Musharraka (المشتركة/الحمارية) is recognized in Shafii and Maliki madhabs
    if (this.madhab !== "shafii" && this.madhab !== "maliki") {
      return false;
    }
    const h = filteredHeirs || this.heirs;
    const hasHusband = (h.husband || 0) > 0;
    const hasMother = (h.mother || 0) > 0;
    const hasGrandmother = (h.grandmother_mother || 0) > 0;
    const hasMotherOrGrandmother = hasMother || hasGrandmother;
    const maternalCount = this.getMaternalSiblingsCount();
    const fullSiblingsExist = this.getFullSiblingsCount() > 0;
    const noDescendants = !this.hasDescendants();
    const noFather = (h.father || 0) === 0;
    const noGrandfather = (h.grandfather || 0) === 0;
    return (
      hasHusband &&
      hasMotherOrGrandmother &&
      maternalCount >= 2 &&
      fullSiblingsExist &&
      noDescendants &&
      noFather &&
      noGrandfather
    );
  }

  private computeMusharraka(filteredHeirs?: HeirsData): HeirShareObject[] {
    const shares: HeirShareObject[] = [];
    const h = filteredHeirs || this.heirs;

    shares.push({
      key: "husband",
      name: "الزوج",
      type: "فرض",
      fraction: new FractionClass(1, 2),
      count: 1,
      reason: "½ لعدم وجود فرع وارث",
    });

    if (h.mother && h.mother > 0) {
      shares.push({
        key: "mother",
        name: "الأم",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙ لوجود جمع من الإخوة",
      });
    } else if (h.grandmother_mother && h.grandmother_mother > 0) {
      shares.push({
        key: "grandmother_mother",
        name: "الجدة لأم",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙",
      });
    }

    const maternalCount = (h.maternal_brother || 0) + (h.maternal_sister || 0);
    const fullCount = (h.full_brother || 0) + (h.full_sister || 0);
    const totalSiblings = maternalCount + fullCount;

    shares.push({
      key: "shared_siblings",
      name: "الإخوة لأم والأشقاء",
      type: "فرض",
      fraction: new FractionClass(1, 3),
      count: totalSiblings,
      reason: "⅓ يشتركون فيه بالتساوي (المسألة المشتركة)",
    });

    this.steps.push({
      step: "المسألة المشتركة (الحمارية)",
      description: `تم تطبيق المشتركة: الزوج (½), الأم (⅙), الإخوة (⅓)`,
      code: "musharraka",
      data: { shares: shares.length },
    });

    return shares;
  }

  private isAkdariyya(): boolean {
    const h = this.heirs;
    const result =
      (h.husband || 0) > 0 &&
      (h.mother || 0) > 0 &&
      (h.grandfather || 0) > 0 &&
      (h.full_sister || 0) === 1 &&
      !this.hasDescendants() &&
      (h.father || 0) === 0 &&
      (h.full_brother || 0) === 0;
    return result;
  }

  private computeAkdariyya(): HeirShareObject[] {
    const shares: HeirShareObject[] = [];

    shares.push({
      key: "husband",
      name: "الزوج",
      type: "فرض",
      fraction: new FractionClass(9, 27),
      count: 1,
      reason: "½ = 9/27",
    });

    shares.push({
      key: "mother",
      name: "الأم",
      type: "فرض",
      fraction: new FractionClass(6, 27),
      count: 1,
      reason: "⅓ = 6/27",
    });

    shares.push({
      key: "grandfather",
      name: "الجد",
      type: "فرض + تعصيب",
      fraction: new FractionClass(8, 27),
      count: 1,
      reason: "⅙ ثم المقاسمة مع الأخت",
    });

    shares.push({
      key: "full_sister",
      name: "الأخت الشقيقة",
      type: "فرض + تعصيب",
      fraction: new FractionClass(4, 27),
      count: 1,
      reason: "½ ثم المقاسمة مع الجد",
    });

    this.state.awlApplied = true;

    // M2 FIX: Sync specialCases with awlApplied flag
    this.state.specialCases.push({
      type: "awl",
      name: "الحجب بالنقص",
      description: "الأكدرية: تقسيم خاص مع الحجب بالنقص",
    });

    this.steps.push({
      step: "الأكدرية (الغراء)",
      description: `تم تطبيق الأكدرية: الزوج (9/27), الأم (6/27), الجد (8/27), الأخت (4/27)`,
      code: "akdariyya",
      data: { shares: shares.length },
    });

    return shares;
  }

  private computeFixedShares(heirs: HeirsData): HeirShareObject[] {
    const shares: HeirShareObject[] = [];
    const hasDescendants = this.hasDescendants();
    const isUmariyyah = this.isUmariyyah(heirs);

    if (heirs.husband && heirs.husband > 0) {
      const fraction = hasDescendants
        ? new FractionClass(1, 4)
        : new FractionClass(1, 2);
      shares.push({
        key: "husband",
        name: "الزوج",
        type: "فرض",
        fraction,
        count: 1,
        reason: hasDescendants ? "¼ مع وجود الفرع الوارث" : "½ بدون فرع وارث",
      });
    }

    if (heirs.wife && heirs.wife > 0) {
      const fraction = hasDescendants
        ? new FractionClass(1, 8)
        : new FractionClass(1, 4);
      shares.push({
        key: "wife",
        name: heirs.wife > 1 ? "الزوجات" : "الزوجة",
        type: "فرض",
        fraction,
        count: heirs.wife || 0,
        reason: hasDescendants ? "⅛ مع الفرع الوارث" : "¼ بدون فرع",
      });
    }

    if (heirs.mother && heirs.mother > 0) {
      let fraction: FractionClass;
      let reason: string;

      if (isUmariyyah) {
        // C1 FIX: Umariyyah — mother gets 1/3 of remainder after spouse's share
        // Maliki always gives 1/6; others give 1/3 of (1 - spouse_share)
        const umariyyahRule =
          FIQH_DATABASE.specialCases.umariyyah[
            this.madhab as keyof typeof FIQH_DATABASE.specialCases.umariyyah
          ];
        if (umariyyahRule === "sixth" || (heirs.husband || 0) > 0) {
          // Maliki: always 1/6; Husband present: 1/3 × (1 - 1/2) = 1/6
          fraction = new FractionClass(1, 6);
        } else {
          // Wife present (Shafi'i/Hanafi/Hanbali): 1/3 × (1 - 1/4) = 1/4
          fraction = new FractionClass(1, 4);
        }
        reason = "ثلث الباقي (العمرية)";
      } else if (hasDescendants) {
        fraction = new FractionClass(1, 6);
        reason = "⅙ مع وجود فرع";
      } else if (this.getSiblingsCount(heirs) >= 2) {
        fraction = new FractionClass(1, 6);
        reason = "⅙ مع جمع إخوة";
      } else {
        fraction = new FractionClass(1, 3);
        reason = "⅓ بدون فرع أو إخوة";
      }

      shares.push({
        key: "mother",
        name: "الأم",
        type: "فرض",
        fraction,
        count: 1,
        reason,
      });
    }

    // Quran 4:11: Father gets 1/6 fard when there are children
    if (heirs.father && heirs.father > 0 && hasDescendants && !isUmariyyah) {
      shares.push({
        key: "father",
        name: "الأب",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙ مع وجود فرع وارث (Quran 4:11)",
      });
    }

    // C4 + F1 FIX: Grandmother fard share — 1/6 when mother is absent
    // Handles competing grandmothers: paternal gets priority, or shared
    if (!heirs.mother || heirs.mother === 0) {
      const hasPaternalGM = (heirs.grandmother_father || 0) > 0;
      const hasMaternalGM = (heirs.grandmother_mother || 0) > 0;
      const hasGenericGM = (heirs.grandmother || 0) > 0;

      if (hasPaternalGM && hasMaternalGM) {
        // Both lines compete: paternal gets priority (Islamic rule)
        // If paternal grandmother exists, she takes the full 1/6
        shares.push({
          key: "grandmother_father",
          name: "الجدة لأب",
          type: "فرض",
          fraction: new FractionClass(1, 6),
          count: 1,
          reason: "⅙ الجدة لأب (أولوية على الجدة لأم)",
        });
      } else if (hasPaternalGM) {
        shares.push({
          key: "grandmother_father",
          name: "الجدة لأب",
          type: "فرض",
          fraction: new FractionClass(1, 6),
          count: 1,
          reason: "⅙ الجدة لأب (عند غياب الأم)",
        });
      } else if (hasMaternalGM) {
        shares.push({
          key: "grandmother_mother",
          name: "الجدة لأم",
          type: "فرض",
          fraction: new FractionClass(1, 6),
          count: 1,
          reason: "⅙ الجدة لأم (عند غياب الأم)",
        });
      } else if (hasGenericGM) {
        shares.push({
          key: "grandmother",
          name: "الجدة",
          type: "فرض",
          fraction: new FractionClass(1, 6),
          count: 1,
          reason: "⅙ الجدة (عند غياب الأم)",
        });
      }
    }

    if (
      heirs.daughter &&
      heirs.daughter > 0 &&
      (!heirs.son || heirs.son === 0)
    ) {
      const fraction =
        heirs.daughter === 1
          ? new FractionClass(1, 2)
          : new FractionClass(2, 3);
      shares.push({
        key: "daughter",
        name: heirs.daughter > 1 ? "البنات" : "البنت",
        type: "فرض",
        fraction,
        count: heirs.daughter || 0,
        reason: heirs.daughter === 1 ? "½" : "⅔",
      });
    }

    if (
      heirs.granddaughter &&
      heirs.granddaughter > 0 &&
      (!heirs.grandson || heirs.grandson === 0) &&
      (!heirs.son || heirs.son === 0)
    ) {
      if (heirs.daughter === 0) {
        const fraction =
          heirs.granddaughter === 1
            ? new FractionClass(1, 2)
            : new FractionClass(2, 3);
        shares.push({
          key: "granddaughter",
          name: heirs.granddaughter > 1 ? "بنات الابن" : "بنت الابن",
          type: "فرض",
          fraction,
          count: heirs.granddaughter || 0,
          reason: heirs.granddaughter === 1 ? "½" : "⅔",
        });
      } else if (heirs.daughter === 1) {
        shares.push({
          key: "granddaughter",
          name: heirs.granddaughter > 1 ? "بنات الابن" : "بنت الابن",
          type: "فرض",
          fraction: new FractionClass(1, 6),
          count: heirs.granddaughter || 0,
          reason: "⅙ تكملة للثلثين",
        });
      }
    }

    if (
      (heirs.full_sister || 0) > 0 &&
      (!heirs.full_brother || heirs.full_brother === 0)
    ) {
      if (!hasDescendants && !heirs.father && !heirs.grandfather) {
        const fraction =
          heirs.full_sister === 1
            ? new FractionClass(1, 2)
            : new FractionClass(2, 3);
        shares.push({
          key: "full_sister",
          name:
            (heirs.full_sister || 0) > 1 ? "الأخوات الشقيقات" : "الأخت الشقيقة",
          type: "فرض",
          fraction,
          count: heirs.full_sister || 0,
          reason: heirs.full_sister === 1 ? "½" : "⅔",
        });
      }
    }

    if (
      (heirs.half_sister_paternal || 0) > 0 &&
      (!heirs.full_brother || heirs.full_brother === 0) &&
      (!heirs.half_brother_paternal || heirs.half_brother_paternal === 0)
    ) {
      if (
        !hasDescendants &&
        !heirs.father &&
        !heirs.grandfather &&
        !heirs.full_sister
      ) {
        const fraction =
          heirs.half_sister_paternal === 1
            ? new FractionClass(1, 2)
            : new FractionClass(2, 3);
        shares.push({
          key: "half_sister_paternal",
          name:
            (heirs.half_sister_paternal || 0) > 1 ? "الأخوات لأب" : "الأخت لأب",
          type: "فرض",
          fraction,
          count: heirs.half_sister_paternal || 0,
          reason: heirs.half_sister_paternal === 1 ? "½" : "⅔",
        });
      }
    }

    const maternalCount =
      (heirs.maternal_brother || 0) + (heirs.maternal_sister || 0);
    if (
      maternalCount > 0 &&
      !hasDescendants &&
      !heirs.father &&
      !heirs.grandfather
    ) {
      const fraction =
        maternalCount === 1 ? new FractionClass(1, 6) : new FractionClass(1, 3);
      shares.push({
        key: "maternal_siblings",
        name: "الإخوة لأم",
        type: "فرض",
        fraction: fraction,
        count: maternalCount,
        reason: maternalCount === 1 ? "⅙" : "⅓",
      });
    }

    return shares;
  }

  private applyAwl(
    shares: HeirShareObject[],
    totalFraction: FractionClass,
  ): HeirShareObject[] {
    this.specialCases.push({
      type: "awl",
      name: "الأول",
      description: "تقليل الأنصباء بنسبة متساوية عند زيادة الفروض على التركة",
    });

    return shares.map((share) => ({
      ...share,
      fraction: share.fraction.divide(totalFraction),
    }));
  }

  private computeAsaba(
    fixedShares: HeirShareObject[],
    remainder: FractionClass,
    heirs: HeirsData,
  ): HeirShareObject[] {
    if (remainder.toDecimal() <= 0.0001) {
      return [];
    }

    const asabaShares: HeirShareObject[] = [];

    if (heirs.son && heirs.son > 0) {
      const totalHeads = heirs.son * 2 + (heirs.daughter || 0);
      const sonWeight = heirs.son * 2;
      const daughterWeight = heirs.daughter || 0;

      if (sonWeight > 0) {
        asabaShares.push({
          key: "son",
          name: "الابن",
          type: "تعصيب",
          fraction: remainder.multiply(
            new FractionClass(sonWeight, totalHeads),
          ),
          count: heirs.son || 0,
          reason: `${heirs.son} ابن(ة) يرثون الباقي`,
        });
      }

      if (daughterWeight > 0) {
        asabaShares.push({
          key: "daughter",
          name: "البنت",
          type: "تعصيب",
          fraction: remainder.multiply(
            new FractionClass(daughterWeight, totalHeads),
          ),
          count: heirs.daughter || 0,
          reason: "البنات مع الابن",
        });
      }

      return asabaShares;
    }

    if (heirs.grandson && heirs.grandson > 0) {
      const totalHeads = heirs.grandson * 2 + (heirs.granddaughter || 0);

      asabaShares.push({
        key: "grandson",
        name: "ابن الابن",
        type: "تعصيب",
        fraction: remainder.multiply(
          new FractionClass(heirs.grandson * 2, totalHeads),
        ),
        count: heirs.grandson || 0,
        reason: "ابن الابن يرث الباقي",
      });

      if (heirs.granddaughter && heirs.granddaughter > 0) {
        asabaShares.push({
          key: "granddaughter",
          name: "بنت الابن",
          type: "تعصيب",
          fraction: remainder.multiply(
            new FractionClass(heirs.granddaughter, totalHeads),
          ),
          count: heirs.granddaughter || 0,
          reason: "بنات الابن مع الابن",
        });
      }

      return asabaShares;
    }

    if (heirs.father && heirs.father > 0) {
      asabaShares.push({
        key: "father",
        name: "الأب",
        type: "تعصيب",
        fraction: remainder,
        count: 1,
        reason: "الأب يرث الباقي",
        addToExisting: true,
      });
      return asabaShares;
    }

    if (heirs.grandfather && heirs.grandfather > 0 && !heirs.father) {
      const siblingsCount = this.getFullAndPaternalSiblingsCount();
      const madhabConfig = FIQH_DATABASE.madhabs[this.madhab];
      const shouldShare =
        madhabConfig?.rules.grandfather_with_siblings === "musharak";

      if (siblingsCount > 0 && shouldShare) {
        const totalHeads =
          2 +
          (heirs.full_brother || 0) * 2 +
          (heirs.full_sister || 0) +
          (heirs.half_brother_paternal || 0) * 2 +
          (heirs.half_sister_paternal || 0);

        // C3 FIX: Compare asaba amounts on the same basis
        // Option A: muqasama — 2/(2+s) of remainder
        // Option B: third of total estate (1/3)
        // Option C: sixth of total estate (1/6)
        const byMuqasamah = remainder.multiply(
          new FractionClass(2, totalHeads),
        );
        const byThird = new FractionClass(1, 3);
        const bySixth = new FractionClass(1, 6);

        let bestOption = byMuqasamah;
        let bestReason = "muqasamah";
        let bestValue = byMuqasamah.toDecimal();

        const thirdValue = byThird.toDecimal();
        if (thirdValue > bestValue) {
          bestOption = byThird;
          bestReason = "third";
          bestValue = thirdValue;
        }

        const sixthValue = bySixth.toDecimal();
        if (sixthValue > bestValue) {
          bestOption = bySixth;
          bestReason = "sixth";
          bestValue = sixthValue;
        }

        this.steps.push({
          step: "اختيار الأفضل للجد مع الإخوة",
          description: `تم اختيار ${
            bestReason === "muqasamah"
              ? "المقاسمة"
              : bestReason === "third"
                ? "الثلث"
                : "السدس"
          } (${bestOption.toString()})`,
          code: "grandfather_optimal",
          data: { bestOption: bestOption.toString(), bestReason },
        });

        asabaShares.push({
          key: "grandfather",
          name: "الجد",
          type: "تعصيب",
          fraction: bestOption,
          count: 1,
          reason: `${
            bestReason === "muqasamah"
              ? "المقاسمة مع الإخوة"
              : bestReason === "third"
                ? "ثلث المال"
                : "سدس المال"
          } (الأفضل)`,
          addToExisting: true,
        });

        if (bestReason === "muqasamah") {
          if (heirs.full_brother && heirs.full_brother > 0) {
            const brotherFrac = remainder.multiply(
              new FractionClass(heirs.full_brother * 2, totalHeads),
            );
            asabaShares.push({
              key: "full_brother",
              name: "الأخ الشقيق",
              type: "تعصيب",
              fraction: brotherFrac,
              count: heirs.full_brother || 0,
              reason: "مع الجد بالمقاسمة",
            });
          }

          if (heirs.full_sister && heirs.full_sister > 0) {
            const sisterFrac = remainder.multiply(
              new FractionClass(heirs.full_sister, totalHeads),
            );
            asabaShares.push({
              key: "full_sister",
              name: "الأخت الشقيقة",
              type: "تعصيب",
              fraction: sisterFrac,
              count: heirs.full_sister || 0,
              reason: "مع الجد بالمقاسمة",
            });
          }

          if (heirs.half_brother_paternal && heirs.half_brother_paternal > 0) {
            asabaShares.push({
              key: "half_brother_paternal",
              name: "الأخ لأب",
              type: "تعصيب",
              fraction: remainder.multiply(
                new FractionClass(heirs.half_brother_paternal * 2, totalHeads),
              ),
              count: heirs.half_brother_paternal || 0,
              reason: "مع الجد بالمقاسمة",
            });
          }

          if (heirs.half_sister_paternal && heirs.half_sister_paternal > 0) {
            asabaShares.push({
              key: "half_sister_paternal",
              name: "الأخت لأب",
              type: "تعصيب",
              fraction: remainder.multiply(
                new FractionClass(heirs.half_sister_paternal, totalHeads),
              ),
              count: heirs.half_sister_paternal || 0,
              reason: "مع الجد بالمقاسمة",
            });
          }
        } else {
          // Grandfather took 1/3 or 1/6 — siblings get the remaining estate as asaba
          const remainingAfterGrandfather = remainder.subtract(bestOption);
          if (remainingAfterGrandfather.toDecimal() > 0.0001) {
            const siblingHeads =
              (heirs.full_brother || 0) * 2 +
              (heirs.full_sister || 0) +
              (heirs.half_brother_paternal || 0) * 2 +
              (heirs.half_sister_paternal || 0);
            if (siblingHeads > 0) {
              if (heirs.full_brother && heirs.full_brother > 0) {
                asabaShares.push({
                  key: "full_brother",
                  name: "الأخ الشقيق",
                  type: "تعصيب",
                  fraction: remainingAfterGrandfather.multiply(
                    new FractionClass(heirs.full_brother * 2, siblingHeads),
                  ),
                  count: heirs.full_brother || 0,
                  reason: "الباقي بعد الجد",
                });
              }
              if (heirs.full_sister && heirs.full_sister > 0) {
                asabaShares.push({
                  key: "full_sister",
                  name: "الأخت الشقيقة",
                  type: "تعصيب",
                  fraction: remainingAfterGrandfather.multiply(
                    new FractionClass(heirs.full_sister, siblingHeads),
                  ),
                  count: heirs.full_sister || 0,
                  reason: "الباقي بعد الجد",
                  addToExisting: true,
                });
              }
              if (
                heirs.half_brother_paternal &&
                heirs.half_brother_paternal > 0
              ) {
                asabaShares.push({
                  key: "half_brother_paternal",
                  name: "الأخ لأب",
                  type: "تعصيب",
                  fraction: remainingAfterGrandfather.multiply(
                    new FractionClass(
                      heirs.half_brother_paternal * 2,
                      siblingHeads,
                    ),
                  ),
                  count: heirs.half_brother_paternal || 0,
                  reason: "الباقي بعد الجد",
                });
              }
              if (
                heirs.half_sister_paternal &&
                heirs.half_sister_paternal > 0
              ) {
                asabaShares.push({
                  key: "half_sister_paternal",
                  name: "الأخت لأب",
                  type: "تعصيب",
                  fraction: remainingAfterGrandfather.multiply(
                    new FractionClass(heirs.half_sister_paternal, siblingHeads),
                  ),
                  count: heirs.half_sister_paternal || 0,
                  reason: "الباقي بعد الجد",
                  addToExisting: true,
                });
              }
            }
          }
        }

        return asabaShares;
      } else if (siblingsCount > 0 && !shouldShare) {
        asabaShares.push({
          key: "grandfather",
          name: "الجد",
          type: "تعصيب",
          fraction: remainder,
          count: 1,
          reason: "الجد يرث الباقي (يَحجب الإخوة)",
          addToExisting: true,
        });
        return asabaShares;
      } else {
        asabaShares.push({
          key: "grandfather",
          name: "الجد",
          type: "تعصيب",
          fraction: remainder,
          count: 1,
          reason: "الجد يرث الباقي",
          addToExisting: true,
        });
        return asabaShares;
      }
    }

    if (heirs.full_brother && heirs.full_brother > 0) {
      const totalHeads = heirs.full_brother * 2 + (heirs.full_sister || 0);

      asabaShares.push({
        key: "full_brother",
        name: "الأخ الشقيق",
        type: "تعصيب",
        fraction: remainder.multiply(
          new FractionClass(heirs.full_brother * 2, totalHeads),
        ),
        count: heirs.full_brother || 0,
        reason: "الأخ الشقيق يعصب الأخت",
      });

      if (heirs.full_sister && heirs.full_sister > 0) {
        asabaShares.push({
          key: "full_sister",
          name: "الأخت الشقيقة",
          type: "تعصيب",
          fraction: remainder.multiply(
            new FractionClass(heirs.full_sister, totalHeads),
          ),
          count: heirs.full_sister || 0,
          reason: "الأخت الشقيقة مع الأخ",
          // F3 FIX: addToExisting so fard + asaba merge correctly
          addToExisting: true,
        });
      }

      return asabaShares;
    }

    if (heirs.half_brother_paternal && heirs.half_brother_paternal > 0) {
      const totalHeads =
        heirs.half_brother_paternal * 2 + (heirs.half_sister_paternal || 0);

      asabaShares.push({
        key: "half_brother_paternal",
        name: "الأخ لأب",
        type: "تعصيب",
        fraction: remainder.multiply(
          new FractionClass(heirs.half_brother_paternal * 2, totalHeads),
        ),
        count: heirs.half_brother_paternal || 0,
        reason: "الأخ لأب يعصب الأخت",
      });

      if (heirs.half_sister_paternal && heirs.half_sister_paternal > 0) {
        asabaShares.push({
          key: "half_sister_paternal",
          name: "الأخت لأب",
          type: "تعصيب",
          fraction: remainder.multiply(
            new FractionClass(heirs.half_sister_paternal, totalHeads),
          ),
          count: heirs.half_sister_paternal || 0,
          reason: "الأخت لأب مع الأخ",
          // F3 FIX: addToExisting so fard + asaba merge correctly
          addToExisting: true,
        });
      }

      return asabaShares;
    }

    if (heirs.uncle_paternal && heirs.uncle_paternal > 0) {
      asabaShares.push({
        key: "uncle_paternal",
        name: "العم",
        type: "تعصيب",
        fraction: remainder.divide(heirs.uncle_paternal),
        count: heirs.uncle_paternal || 0,
        reason: "العم يرث الباقي",
      });
      return asabaShares;
    }

    if (heirs.nephew_from_brother && heirs.nephew_from_brother > 0) {
      asabaShares.push({
        key: "nephew_from_brother",
        name: "ابن الأخ",
        type: "تعصيب",
        fraction: remainder.divide(heirs.nephew_from_brother),
        count: heirs.nephew_from_brother || 0,
        reason: "ابن الأخ يرث الباقي",
      });
      return asabaShares;
    }

    return asabaShares;
  }

  private applyRadd(
    shares: HeirShareObject[],
    remainder: FractionClass,
  ): { shares: HeirShareObject[]; applied: boolean } {
    if (remainder.toDecimal() <= 0.0001) {
      return { shares, applied: false };
    }

    // C2 FIX: Read madhab config for spouse radd eligibility
    const spouseRaddAllowed =
      FIQH_DATABASE.madhabs[this.madhab]?.rules.spouse_radd ?? false;

    // Spouse radd only applies when spouse is the SOLE fard heir
    // When other fard heirs exist (e.g. daughters), remainder goes to them, not spouse
    const hasNonSpouseFardHeirs = shares.some(
      (s) =>
        s.key !== "husband" && s.key !== "wife" && !s.type.includes("تعصيب"),
    );

    const eligible = shares.filter((s) => {
      if (s.type.includes("تعصيب")) return false;
      if (s.key === "husband" || s.key === "wife") {
        if (!spouseRaddAllowed) return false;
        if (hasNonSpouseFardHeirs) return false;
      }
      return true;
    });

    if (eligible.length === 0) {
      return { shares, applied: false };
    }

    this.specialCases.push({
      type: "radd",
      name: "الرد",
      description: "توزيع الفائض على أصحاب الفروض",
    });

    const totalEligible = this.sumFractions(eligible.map((s) => s.fraction));

    if (totalEligible.toDecimal() <= 0) {
      return { shares, applied: false };
    }

    const updatedShares = shares.map((share) => {
      if (eligible.includes(share)) {
        const proportion = share.fraction.divide(totalEligible);
        const additionalShare = remainder.multiply(proportion);
        return {
          ...share,
          fraction: share.fraction.add(additionalShare),
          type: share.type + " + رد",
        };
      }
      return share;
    });

    return { shares: updatedShares, applied: true };
  }

  private distributeToBloodRelatives(
    shares: HeirShareObject[],
    remainder: FractionClass,
  ): { shares: HeirShareObject[]; bloodRelatives: HeirShareObject[] } {
    const bloodRelatives: HeirShareObject[] = [];

    if (remainder.toDecimal() <= 0.0001) {
      return { shares, bloodRelatives };
    }

    const h = this.heirs;

    // F2 FIX: Extended dhawu al-arham hierarchy — all blood relative classes
    // Ordered by proximity of blood relation (closest first)
    const classes = [
      // Class 1: Descendants of daughters (closest blood relatives after direct heirs)
      [
        { key: "daughter_son", name: "ابن البنت", weight: 1 },
        { key: "daughter_daughter", name: "بنت البنت", weight: 1 },
      ],
      // Class 2: Sons of brothers (male-line nephews)
      [
        { key: "full_nephew", name: "ابن الأخ الشقيق", weight: 1 },
        { key: "nephew_from_brother", name: "ابن الأخ", weight: 1 },
      ],
      // Class 3: Sons of paternal half-brothers
      [{ key: "paternal_nephew", name: "ابن الأخ لأب", weight: 1 }],
      // Class 4: Daughters of brothers (female-line nephews)
      [{ key: "niece_from_brother", name: "بنت الأخ", weight: 1 }],
      // Class 5: Children of sisters
      [{ key: "sister_children", name: "أولاد الأخت", weight: 1 }],
      // Class 6: Sons of paternal uncles (cousins)
      [
        { key: "full_cousin", name: "ابن العم الشقيق", weight: 1 },
        { key: "paternal_cousin", name: "ابن العم لأب", weight: 1 },
      ],
      // Class 7: Maternal uncles/aunts (maternal line)
      [
        { key: "maternal_uncle", name: "الخال", weight: 1 },
        { key: "maternal_aunt", name: "الخالة", weight: 1 },
      ],
      // Class 8: Paternal aunts (female-line paternal)
      [
        { key: "aunt_paternal", name: "الخالة لأب", weight: 1 },
        { key: "paternal_aunt", name: "العمة", weight: 1 },
      ],
      // Class 9: Maternal aunts (female-line maternal, furthest)
      [{ key: "aunt_maternal", name: "الخالة لأم", weight: 1 }],
    ];

    let inheritingClass: {
      key: string;
      name: string;
      count: number;
      weight: number;
    }[] = [];

    for (let classIndex = 0; classIndex < classes.length; classIndex++) {
      const currentClass = classes[classIndex];
      const classHeirs = [];

      for (const heir of currentClass) {
        const count = h[heir.key as keyof HeirsData] as number;
        if (count && count > 0) {
          classHeirs.push({ ...heir, count });
        }
      }

      if (classHeirs.length > 0) {
        inheritingClass = classHeirs;
        this.steps.push({
          step: `ذوو الأرحام - الصنف ${classIndex + 1}`,
          description: `الوارثون من الصنف ${classIndex + 1} يرثون الباقي`,
          code: "blood_relatives_class",
          data: { class: classIndex + 1, heirs: classHeirs.length },
        });
        break;
      }
    }

    if (inheritingClass.length === 0) {
      return { shares, bloodRelatives };
    }

    this.specialCases.push({
      type: "blood_relatives",
      name: "ذوو الأرحام",
      description: "توزيع الباقي على ذوي الأرحام",
    });

    const totalCount = inheritingClass.reduce((sum, h) => sum + h.count, 0);
    inheritingClass.forEach((heir) => {
      const fraction = remainder.multiply(
        new FractionClass(heir.count, totalCount),
      );
      bloodRelatives.push({
        key: heir.key,
        name: heir.name,
        type: "ذو رحم",
        fraction: fraction,
        count: heir.count,
        reason: `من ذوي الأرحام - الصنف ${inheritingClass[0] === heir ? "الوارث" : ""}`,
      });
    });

    return { shares: [...shares, ...bloodRelatives], bloodRelatives };
  }

  private calculateFinalAmounts(
    shares: HeirShareObject[],
    netEstate: number,
  ): HeirShare[] {
    return shares.map((share) => ({
      key: share.key as HeirType,
      name: share.name,
      type: share.type,
      count: share.count,
      amount: Math.round(share.fraction.toDecimal() * netEstate * 100) / 100,
      percentage: Math.round(share.fraction.toDecimal() * 10000) / 100,
      fraction: {
        numerator: share.fraction.getNumerator(),
        denominator: share.fraction.getDenominator(),
      },
      shares: Array(share.count)
        .fill(0)
        .map((_, i) => ({
          person: i + 1,
          amount:
            Math.round(
              ((share.fraction.toDecimal() * netEstate) / share.count) * 100,
            ) / 100,
        })),
    }));
  }

  private calculateConfidence(
    results: HeirShare[],
    heirs: HeirsData,
    invariantFailed: boolean = false,
  ): number {
    let confidence = 100;
    const factors: string[] = [];

    const heirCount = Object.values(heirs).filter((v) => v && v > 0).length;
    if (heirCount > 8) {
      confidence -= 10;
      factors.push("عدد كبير من الورثة (أكثر من 8)");
    } else if (heirCount > 5) {
      confidence -= 5;
      factors.push("عدد متوسط من الورثة (6-8)");
    }

    // D2 FIX: Check mathematical invariants instead of penalizing rule application
    const totalFraction = results.reduce(
      (sum, r) =>
        sum + (r.fraction?.numerator || 0) / (r.fraction?.denominator || 1),
      0,
    );
    const deviation = Math.abs(totalFraction - 1);
    if (deviation > 0.01) {
      confidence -= 30;
      factors.push(`انحراف في مجموع الكسور: ${deviation.toFixed(4)}`);
    }

    // D1 FIX: Apply invariant violation penalty
    if (invariantFailed) {
      confidence = 0;
      factors.push("انتهاك حفظ الكتلة: مجموع الأسهم لا يساوي التركة");
    }

    const hasChildren = heirs.son || heirs.daughter;
    const hasParents = heirs.father || heirs.mother;
    const hasGrandparents =
      heirs.grandfather || heirs.grandmother_mother || heirs.grandmother_father;

    const generationCount =
      (hasChildren ? 1 : 0) + (hasParents ? 1 : 0) + (hasGrandparents ? 1 : 0);
    if (generationCount >= 3) {
      confidence -= 5;
      factors.push("وجود عدة أجيال من الورثة");
    }

    const distantHeirs = [
      "full_nephew",
      "paternal_nephew",
      "full_uncle",
      "paternal_uncle",
      "full_cousin",
      "paternal_cousin",
      "daughter_son",
      "daughter_daughter",
      "sister_children",
      "maternal_uncle",
      "maternal_aunt",
      "paternal_aunt",
    ];

    const hasDistantHeirs = distantHeirs.some(
      (key) => (heirs[key as keyof HeirsData] || 0) > 0,
    );
    if (hasDistantHeirs) {
      confidence -= 8;
      factors.push("وجود ورثة من الدرجات البعيدة");
    }

    const hasGrandfatherWithSiblings =
      heirs.grandfather && (heirs.full_brother || heirs.paternal_brother);
    if (hasGrandfatherWithSiblings) {
      confidence -= 5;
      factors.push("حالة الجد مع الإخوة (تختلف باختلاف المذهب)");
    }

    if (heirs.wife && heirs.wife > 1) {
      confidence -= 3;
      factors.push("وجود عدة زوجات");
    }

    confidence = Math.max(50, Math.min(100, confidence));

    this.state.confidenceFactors = [];

    if (factors.length > 0) {
      this.state.confidenceFactors = factors;
    } else {
      this.state.confidenceFactors = ["حساب بسيط - دقة عالية"];
    }

    return confidence;
  }

  private getFullAndPaternalSiblingsCount(): number {
    return (
      (this.heirs.full_brother || 0) +
      (this.heirs.full_sister || 0) +
      (this.heirs.half_brother_paternal || 0) +
      (this.heirs.half_sister_paternal || 0)
    );
  }

  private hasDescendants(): boolean {
    return (
      (this.heirs.son || 0) > 0 ||
      (this.heirs.daughter || 0) > 0 ||
      (this.heirs.grandson || 0) > 0 ||
      (this.heirs.granddaughter || 0) > 0
    );
  }

  private isUmariyyah(heirs: HeirsData): boolean {
    const hasSpouse = (heirs.husband || 0) > 0 || (heirs.wife || 0) > 0;
    const hasParents = (heirs.father || 0) > 0 && (heirs.mother || 0) > 0;
    const hasDescendants = this.hasDescendants();

    return hasSpouse && hasParents && !hasDescendants;
  }

  private getSiblingsCount(heirs: HeirsData): number {
    return (
      (heirs.full_brother || 0) +
      (heirs.full_sister || 0) +
      (heirs.half_brother_paternal || 0) +
      (heirs.half_sister_paternal || 0) +
      (heirs.half_brother_maternal || 0) +
      (heirs.half_sister_maternal || 0)
    );
  }

  private getMaternalSiblingsCount(): number {
    const h = this.heirs;
    return (h.maternal_brother || 0) + (h.maternal_sister || 0);
  }

  private getFullSiblingsCount(): number {
    return (this.heirs.full_brother || 0) + (this.heirs.full_sister || 0);
  }

  private sumFractions(fractions: FractionClass[]): FractionClass {
    return fractions.reduce(
      (sum, frac) => sum.add(frac),
      new FractionClass(0, 1),
    );
  }

  private mergeShares(
    fixedShares: HeirShareObject[],
    asabaShares: HeirShareObject[],
  ): HeirShareObject[] {
    const merged = [...fixedShares];
    const seenKeys = new Set<string>();

    asabaShares.forEach((asaba) => {
      const existing = merged.find((s) => s.key === asaba.key);

      // F3 FIX: Prevent double asaba — if same key already in merged asaba, skip
      if (seenKeys.has(asaba.key) && !existing) {
        this.steps.push({
          step: "تنبيه: double_asaba",
          description: `عصبة مكررة: ${asaba.name} (${asaba.key}) تم تجاهلها لتجنب التكرار`,
          code: "double_asaba",
          data: { key: asaba.key },
        });
        return;
      }
      seenKeys.add(asaba.key);

      if (existing && asaba.addToExisting) {
        existing.fraction = existing.fraction.add(asaba.fraction);
        existing.type = "فرض + تعصيب";
      } else if (existing && !asaba.addToExisting) {
        // D5 FIX: Log dropped asaba shares instead of silently ignoring
        this.steps.push({
          step: "تنبيه: asaba_dropped",
          description: `عصبة ${asaba.name} (${asaba.key}) لم تُدمج لأن المفتاح موجود مسبقاً`,
          code: "asaba_dropped",
          data: { key: asaba.key, asabaFraction: asaba.fraction.toString() },
        });
      } else {
        merged.push(asaba);
      }
    });

    return merged;
  }

  private validateInput() {
    return validateEngineInput(this.estate, this.heirs);
  }
}
