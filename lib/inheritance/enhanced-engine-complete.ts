/**
 * Enhanced Inheritance Calculation Engine - Complete Islamic Law Implementation
 * Full implementation of all features from original Merath_Cluade_Pro7.html
 * 
 * تحتوي على جميع قواعد الفروض والعصبات والحالات الخاصة الكاملة
 * شاملة لجميع المذاهب الأربعة (حنفي، مالكي، شافعي، حنبلي)
 */

import { FractionClass } from './fraction';
import type { EstateData, HeirsData, MadhhabType, CalculationResult, HeirShare } from './types';
import { HijabSystem } from './hijab-system';

interface HeirShareObject {
  key: string;
  name: string;
  type: string;
  fraction: FractionClass;
  count: number;
  reason: string;
  addToExisting?: boolean;
}

export class EnhancedInheritanceCalculationEngine {
  private madhab: MadhhabType;
  private estate: EstateData;
  private heirs: HeirsData;
  private hijabSystem: HijabSystem;
  private steps: Array<{ step: string; description: string; code: string; data?: unknown }> = [];
  private specialCases: Array<{ type: string; name: string; description: string }> = [];

  constructor(madhab: MadhhabType, estate: EstateData, heirs: HeirsData) {
    this.madhab = madhab;
    this.estate = {
      total: estate.total || 0,
      funeral: estate.funeral || 0,
      debts: estate.debts || 0,
      will: estate.will || 0
    };
    this.heirs = this.normalizeHeirs(heirs);
    this.hijabSystem = new HijabSystem(madhab);
  }

  /**
   * Main calculation flow - matches HTML's 13-step process
   */
  calculate(): CalculationResult {
    const startTime = performance.now();
    const steps: string[] = [];
    
    try {
      // Step 1: Validate inputs
      const validation = this.validateInput();
      if (!validation.valid) {
        const endTime = performance.now();
        const calcSteps = steps.map((s, i) => ({
          stepNumber: i + 1,
          title: s,
          description: '',
          action: 'validate',
          details: {},
          timestamp: new Date().toISOString()
        }));

        return {
          success: false,
          madhab: this.madhab,
          madhhabName: this.madhab,
          shares: [],
          confidence: 0,
          steps: calcSteps,
          calculationTime: endTime - startTime,
          error: validation.error,
          specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] }
        };
      }
      steps.push('التحقق من البيانات: validate');

      // Step 2: Calculate net estate (total - funeral - debts - will)
      const netEstate = this.calculateNetEstate();
      steps.push('حساب التركة الصافية: estate_calculation');

      // Step 3: Apply hijab (blocking rules)
      const hijabResult = this.hijabSystem.applyHijab(this.heirs);
      const validHeirs = hijabResult.heirs;
      const hijabLog = hijabResult.log || [];
      steps.push('تطبيق الحجب: hijab');

      // Step 4: Compute fixed shares (fards)
      const fixedShares = this.computeFixedShares(validHeirs);
      steps.push('الفروض: fixed_shares');

      // Step 5: Apply awl if needed
      const totalFixed = this.sumFractions(fixedShares.map(s => s.fraction));
      let adjustedFixed = fixedShares;
      
      if (totalFixed.toDecimal() > 1) {
        adjustedFixed = this.applyAwl(fixedShares, totalFixed);
        steps.push('الأول: awl');
      }

      // Step 6: Calculate remainder
      const remainder = new FractionClass(1, 1).subtract(totalFixed);
      steps.push('حساب الباقي: remainder');

      // Step 7: Compute asaba distribution
      const asabaShares = this.computeAsaba(adjustedFixed, remainder, validHeirs);
      steps.push('العصبات: asaba');

      // Step 8: Merge fixed + asaba shares
      const allShares = this.mergeShares(adjustedFixed, asabaShares);
      steps.push('دمج الفروض والعصبات: merge');

      // Step 9: Recalculate total & remainder
      const totalAllShares = this.sumFractions(allShares.map(s => s.fraction));
      const finalRemainder = new FractionClass(1, 1).subtract(totalAllShares);
      steps.push('إعادة حساب الباقي: recalculate');

      // Step 10: Apply radd if remainder > 0 and no asaba
      let finalShares = allShares;
      if (finalRemainder.toDecimal() > 0.0001 && asabaShares.length === 0) {
        finalShares = this.applyRadd(allShares, finalRemainder);
        steps.push('الرد: radd');
      }

      // Step 11: Distribute to blood relatives if still remainder
      if (finalRemainder.toDecimal() > 0.0001 && asabaShares.length === 0) {
        const bloodDistribution = this.distributeToBloodRelatives(finalShares, finalRemainder);
        finalShares = bloodDistribution.shares;
        if (bloodDistribution.bloodRelatives.length > 0) {
          this.specialCases.push({
            type: 'blood_relatives',
            name: 'ذوو الأرحام',
            description: 'توزيع الباقي على ذوي الأرحام'
          });
          steps.push('ذوو الأرحام: blood_relatives');
        }
      }

      // Step 12: Convert to amounts
      const results = this.calculateFinalAmounts(finalShares, netEstate);
      steps.push('تحويل للمبالغ: amounts');

      // Step 13: Calculate confidence score
      const confidence = this.calculateConfidence(results, validHeirs, totalFixed);
      steps.push('حساب مستوى الثقة: confidence');

      const endTime = performance.now();
      const calcSteps = steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s,
        description: '',
        action: 'info',
        details: {},
        timestamp: new Date().toISOString()
      }));

      const special: import('./types').SpecialCases = {
        awl: this.specialCases.some(sc => sc.type === 'awl'),
        auled: 0,
        radd: this.specialCases.some(sc => sc.type === 'radd'),
        hijabTypes: hijabLog
      };

      return {
        success: true,
        madhab: this.madhab,
        madhhabName: this.madhab,
        shares: results,
        netEstate: netEstate,
        confidence,
        steps: calcSteps,
        calculationTime: endTime - startTime,
        specialCases: special
      };
    } catch (error) {
      const endTime = performance.now();
      const calcSteps = steps.map((s, i) => ({
        stepNumber: i + 1,
        title: s,
        description: '',
        action: 'error',
        details: {},
        timestamp: new Date().toISOString()
      }));

      return {
        success: false,
        madhab: this.madhab,
        madhhabName: this.madhab,
        shares: [],
        confidence: 0,
        steps: calcSteps,
        calculationTime: endTime - startTime,
        error: `خطأ في الحساب: ${(error as Error).message}`,
        specialCases: { awl: false, auled: 0, radd: false, hijabTypes: [] }
      };
    }
  }

  /**
   * Step 2: Calculate net estate (deduct will, funeral, debts)
   */
  private calculateNetEstate(): number {
    let net = this.estate.total;
    net -= this.estate.funeral || 0;
    net -= this.estate.debts || 0;

    // Enforce will ≤ 1/3 of (total - funeral - debts)
    const remainderAfterFuneral = this.estate.total - (this.estate.funeral || 0) - (this.estate.debts || 0);
    const maxWill = remainderAfterFuneral / 3;
    const actualWill = Math.min(this.estate.will || 0, maxWill);
    
    net -= actualWill;

    return Math.max(0, net);
  }

  /**
   * Step 3: Apply hijab (blocking rules)
   */
  private applyHijab(heirs: HeirsData): HeirsData {
    const result = this.hijabSystem.applyHijab(heirs);
    return result.heirs;
  }

  /**
   * Step 4: Compute fixed shares (fards)
   */
  private computeFixedShares(heirs: HeirsData): HeirShareObject[] {
    const shares: HeirShareObject[] = [];
    const hasDescendants = this.hasDescendants(heirs);

    // Special case: Umariyyah (spouse + both parents)
    const isUmariyyah = this.isUmariyyah(heirs);

    // ===== SPOUSE =====
    if (heirs.husband && heirs.husband > 0) {
      const fraction = hasDescendants ? new FractionClass(1, 4) : new FractionClass(1, 2);
      shares.push({
        key: 'husband',
        name: 'الزوج',
        type: 'فرض',
        fraction,
        count: 1,
        reason: hasDescendants ? '¼ مع وجود الفرع الوارث' : '½ بدون فرع وارث'
      });
    }

    if (heirs.wife && heirs.wife > 0) {
      const fraction = hasDescendants ? new FractionClass(1, 8) : new FractionClass(1, 4);
      shares.push({
        key: 'wife',
        name: heirs.wife > 1 ? 'الزوجات' : 'الزوجة',
        type: 'فرض',
        fraction,
        count: heirs.wife || 0,
        reason: hasDescendants ? '⅛ مع الفرع الوارث' : '¼ بدون فرع'
      });
    }

    // ===== MOTHER =====
    if (heirs.mother && heirs.mother > 0) {
      let fraction: FractionClass;
      let reason: string;

      if (isUmariyyah) {
        // Umariyyah: mother gets 1/3 of remainder after spouse
        fraction = new FractionClass(1, 6); // 1/3 × 1/2 or 1/3 × 3/4
        reason = 'ثلث الباقي (العمرية)';
      } else if (hasDescendants) {
        fraction = new FractionClass(1, 6);
        reason = '⅙ مع وجود فرع';
      } else if (this.getSiblingsCount(heirs) >= 2) {
        fraction = new FractionClass(1, 6);
        reason = '⅙ مع جمع إخوة';
      } else {
        fraction = new FractionClass(1, 3);
        reason = '⅓ بدون فرع أو إخوة';
      }

      shares.push({
        key: 'mother',
        name: 'الأم',
        type: 'فرض',
        fraction,
        count: 1,
        reason
      });
    }

    // ===== DAUGHTERS (no sons) =====
    if (heirs.daughter && heirs.daughter > 0 && (!heirs.son || heirs.son === 0)) {
      const fraction = heirs.daughter === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
      shares.push({
        key: 'daughter',
        name: heirs.daughter > 1 ? 'البنات' : 'البنت',
        type: 'فرض',
        fraction,
        count: heirs.daughter || 0,
        reason: heirs.daughter === 1 ? '½' : '⅔'
      });
    }

    // ===== GRANDDAUGHTERS (no sons, no grandsons) =====
    if (heirs.granddaughter && heirs.granddaughter > 0 && 
        (!heirs.grandson || heirs.grandson === 0) && 
        (!heirs.son || heirs.son === 0)) {
      
      if (heirs.daughter === 0) {
        const fraction = heirs.granddaughter === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
        shares.push({
          key: 'granddaughter',
          name: heirs.granddaughter > 1 ? 'بنات الابن' : 'بنت الابن',
          type: 'فرض',
          fraction,
          count: heirs.granddaughter || 0,
          reason: heirs.granddaughter === 1 ? '½' : '⅔'
        });
      } else if (heirs.daughter === 1) {
        // 1/6 as completion to 2/3 with one daughter
        shares.push({
          key: 'granddaughter',
          name: heirs.granddaughter > 1 ? 'بنات الابن' : 'بنت الابن',
          type: 'فرض',
          fraction: new FractionClass(1, 6),
          count: heirs.granddaughter || 0,
          reason: '⅙ تكملة للثلثين'
        });
      }
    }

    // ===== SISTERS (no brothers, no male descendants) =====
    if ((heirs.full_sister || 0) > 0 && (!heirs.full_brother || heirs.full_brother === 0)) {
      if (!hasDescendants && !heirs.father && !heirs.grandfather) {
        const fraction = heirs.full_sister === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
        shares.push({
          key: 'full_sister',
          name: (heirs.full_sister || 0) > 1 ? 'الأخوات الشقيقات' : 'الأخت الشقيقة',
          type: 'فرض',
          fraction,
          count: heirs.full_sister || 0,
          reason: heirs.full_sister === 1 ? '½' : '⅔'
        });
      }
    }

    // ===== PATERNAL SISTERS (similar logic) =====
    if ((heirs.half_sister_paternal || 0) > 0 && 
        (!heirs.full_brother || heirs.full_brother === 0) &&
        (!heirs.half_brother_paternal || heirs.half_brother_paternal === 0)) {
      if (!hasDescendants && !heirs.father && !heirs.grandfather && !heirs.full_sister) {
        const fraction = heirs.half_sister_paternal === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
        shares.push({
          key: 'half_sister_paternal',
          name: (heirs.half_sister_paternal || 0) > 1 ? 'الأخوات لأب' : 'الأخت لأب',
          type: 'فرض',
          fraction,
          count: heirs.half_sister_paternal || 0,
          reason: heirs.half_sister_paternal === 1 ? '½' : '⅔'
        });
      }
    }

    // ===== MATERNAL SIBLINGS =====
    const maternalCount = (heirs.half_brother_maternal || 0) + (heirs.half_sister_maternal || 0);
    if (maternalCount > 0 && !hasDescendants && !heirs.father && !heirs.grandfather) {
      const fraction = maternalCount === 1 ? new FractionClass(1, 6) : new FractionClass(1, 3);
      shares.push({
        key: 'maternal_siblings',
        name: 'الإخوة لأم',
        type: 'فرض',
        fraction,
        count: maternalCount || 0,
        reason: maternalCount === 1 ? '⅙' : '⅓'
      });
    }

    return shares;
  }

  /**
   * Step 5: Apply awl (augmentation of denominator)
   */
  private applyAwl(
    shares: HeirShareObject[],
    totalFraction: FractionClass
  ): HeirShareObject[] {
    this.specialCases.push({
      type: 'awl',
      name: 'الأول',
      description: 'تقليل الأنصباء بنسبة متساوية عند زيادة الفروض على التركة'
    });

    return shares.map(share => ({
      ...share,
      fraction: share.fraction.divide(totalFraction)
    }));
  }

  /**
   * Step 7: Compute asaba (residuary distribution)
   */
  private computeAsaba(
    fixedShares: HeirShareObject[],
    remainder: FractionClass,
    heirs: HeirsData
  ): HeirShareObject[] {
    if (remainder.toDecimal() <= 0.0001) {
      return [];
    }

    const asabaShares: HeirShareObject[] = [];

    // Hierarchy of asaba:
    // 1. Sons (2:1 ratio with daughters)
    if (heirs.son && heirs.son > 0) {
      const totalHeads = heirs.son * 2 + (heirs.daughter || 0);
      const sonWeight = heirs.son * 2;
      const daughterWeight = heirs.daughter || 0;

      if (sonWeight > 0) {
        asabaShares.push({
          key: 'son',
          name: 'الابن',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(sonWeight, totalHeads)),
          count: heirs.son || 0,
          reason: `${heirs.son} ابن(ة) يرثون الباقي`
        });
      }

      if (daughterWeight > 0) {
        asabaShares.push({
          key: 'daughter',
          name: 'البنت',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(daughterWeight, totalHeads)),
          count: heirs.daughter || 0,
          reason: 'البنات مع الابن'
        });
      }

      return asabaShares;
    }

    // 2. Grandsons and granddaughters
    if (heirs.grandson && heirs.grandson > 0) {
      const totalHeads = heirs.grandson * 2 + (heirs.granddaughter || 0);
      
      asabaShares.push({
        key: 'grandson',
        name: 'ابن الابن',
        type: 'تعصيب',
        fraction: remainder.multiply(new FractionClass(heirs.grandson * 2, totalHeads)),
        count: heirs.grandson || 0,
        reason: 'ابن الابن يرث الباقي'
      });

      if (heirs.granddaughter && heirs.granddaughter > 0) {
        asabaShares.push({
          key: 'granddaughter',
          name: 'بنت الابن',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(heirs.granddaughter, totalHeads)),
          count: heirs.granddaughter || 0,
          reason: 'بنات الابن مع الابن'
        });
      }

      return asabaShares;
    }

    // 3. Father
    if (heirs.father && heirs.father > 0) {
      asabaShares.push({
        key: 'father',
        name: 'الأب',
        type: 'تعصيب',
        fraction: remainder,
        count: 1,
        reason: 'الأب يرث الباقي',
        addToExisting: true
      });
      return asabaShares;
    }

    // 4. Grandfather
    if (heirs.grandfather && heirs.grandfather > 0 && !heirs.father) {
      asabaShares.push({
        key: 'grandfather',
        name: 'الجد',
        type: 'تعصيب',
        fraction: remainder,
        count: 1,
        reason: 'الجد يرث الباقي',
        addToExisting: true
      });
      return asabaShares;
    }

    // 5. Full brothers and sisters
    if (heirs.full_brother && heirs.full_brother > 0) {
      const totalHeads = heirs.full_brother * 2 + (heirs.full_sister || 0);
      
      asabaShares.push({
        key: 'full_brother',
        name: 'الأخ الشقيق',
        type: 'تعصيب',
        fraction: remainder.multiply(new FractionClass(heirs.full_brother * 2, totalHeads)),
        count: heirs.full_brother || 0,
        reason: 'الأخ الشقيق يعصب الأخت'
      });

      if (heirs.full_sister && heirs.full_sister > 0) {
        asabaShares.push({
          key: 'full_sister',
          name: 'الأخت الشقيقة',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(heirs.full_sister, totalHeads)),
          count: heirs.full_sister || 0,
          reason: 'الأخت الشقيقة مع الأخ'
        });
      }

      return asabaShares;
    }

    // 6. Paternal brothers and sisters
    if (heirs.half_brother_paternal && heirs.half_brother_paternal > 0) {
      const totalHeads = heirs.half_brother_paternal * 2 + (heirs.half_sister_paternal || 0);
      
      asabaShares.push({
        key: 'half_brother_paternal',
        name: 'الأخ لأب',
        type: 'تعصيب',
        fraction: remainder.multiply(new FractionClass(heirs.half_brother_paternal * 2, totalHeads)),
        count: heirs.half_brother_paternal || 0,
        reason: 'الأخ لأب يعصب الأخت'
      });

      if (heirs.half_sister_paternal && heirs.half_sister_paternal > 0) {
        asabaShares.push({
          key: 'half_sister_paternal',
          name: 'الأخت لأب',
          type: 'تعصيب',
          fraction: remainder.multiply(new FractionClass(heirs.half_sister_paternal, totalHeads)),
          count: heirs.half_sister_paternal || 0,
          reason: 'الأخت لأب مع الأخ'
        });
      }

      return asabaShares;
    }

    // 7. Uncles
    if (heirs.uncle_paternal && heirs.uncle_paternal > 0) {
      asabaShares.push({
        key: 'uncle_paternal',
        name: 'العم',
        type: 'تعصيب',
        fraction: remainder.divide(heirs.uncle_paternal),
        count: heirs.uncle_paternal || 0,
        reason: 'العم يرث الباقي'
      });
      return asabaShares;
    }

    // 8. Cousins
    if (heirs.nephew_from_brother && heirs.nephew_from_brother > 0) {
      asabaShares.push({
        key: 'nephew_from_brother',
        name: 'ابن الأخ',
        type: 'تعصيب',
        fraction: remainder.divide(heirs.nephew_from_brother),
        count: heirs.nephew_from_brother || 0,
        reason: 'ابن الأخ يرث الباقي'
      });
      return asabaShares;
    }

    return asabaShares;
  }

  /**
   * Step 10: Apply radd (return excess to fixed-share heirs proportionally)
   */
  private applyRadd(
    shares: HeirShareObject[],
    remainder: FractionClass
  ): HeirShareObject[] {
    if (remainder.toDecimal() <= 0.0001) {
      return shares;
    }

    // Filter eligible heirs for radd (not spouses, not asaba)
    const eligible = shares.filter(
      s => s.key !== 'husband' && s.key !== 'wife' && !s.type.includes('تعصيب')
    );

    if (eligible.length === 0) {
      return shares;
    }

    this.specialCases.push({
      type: 'radd',
      name: 'الرد',
      description: 'توزيع الفائض على أصحاب الفروض'
    });

    // Calculate total of eligible fractions
    const totalEligible = this.sumFractions(eligible.map(s => s.fraction));

    if (totalEligible.toDecimal() <= 0) {
      return shares;
    }

    // Distribute remainder proportionally
    return shares.map(share => {
      if (eligible.includes(share)) {
        const proportion = share.fraction.divide(totalEligible);
        const additionalShare = remainder.multiply(proportion);
        return {
          ...share,
          fraction: share.fraction.add(additionalShare),
          type: share.type + ' + رد'
        };
      }
      return share;
    });
  }

  /**
   * Step 11: Distribute to blood relatives (ذوو الأرحام)
   */
  private distributeToBloodRelatives(
    shares: HeirShareObject[],
    remainder: FractionClass
  ): { shares: HeirShareObject[]; bloodRelatives: HeirShareObject[] } {
    const bloodRelatives: HeirShareObject[] = [];

    if (remainder.toDecimal() <= 0.0001) {
      return { shares, bloodRelatives };
    }

    const heirs = this.heirs;

    // Check for blood relatives in hierarchy order
    const bloodHeirsList = [
      { key: 'daughter_son', name: 'ابن البنت', weight: 1 },
      { key: 'daughter_daughter', name: 'بنت البنت', weight: 1 },
      { key: 'sister_descendants', name: 'أولاد الأخت', weight: 1 },
      { key: 'maternal_uncle', name: 'الخال', weight: 1 },
      { key: 'maternal_aunt', name: 'الخالة', weight: 1 },
      { key: 'paternal_aunt', name: 'العمة', weight: 1 }
    ];

    let firstClass: any[] = [];
    for (const heir of bloodHeirsList) {
      const count = heirs[heir.key as keyof HeirsData] as number;
      if (count && count > 0) {
        firstClass.push({ ...heir, count });
        break; // Only first class inherits
      }
    }

    if (firstClass.length === 0) {
      return { shares, bloodRelatives };
    }

    this.specialCases.push({
      type: 'blood_relatives',
      name: 'ذوو الأرحام',
      description: 'توزيع الباقي على ذوي الأرحام'
    });

    // Distribute equally among first class members
    const totalCount = firstClass.reduce((sum, h) => sum + h.count, 0);
    firstClass.forEach(heir => {
      bloodRelatives.push({
        key: heir.key,
        name: heir.name,
        type: 'ذو رحم',
        fraction: remainder.multiply(new FractionClass(heir.count, totalCount)),
        count: heir.count,
        reason: 'من ذوي الأرحام'
      });
    });

    return { shares, bloodRelatives };
  }

  /**
   * Step 12: Convert fractions to amounts
   */
  private calculateFinalAmounts(shares: HeirShareObject[], netEstate: number): HeirShare[] {
    return shares.map(share => ({
      key: share.key as any,
      name: share.name,
      type: share.type,
      count: share.count,
      amount: Math.round(share.fraction.toDecimal() * netEstate * 100) / 100,
      percentage: Math.round(share.fraction.toDecimal() * 10000) / 100,
      fraction: {
        numerator: share.fraction.getNumerator(),
        denominator: share.fraction.getDenominator()
      },
      shares: Array(share.count).fill(0).map((_, i) => ({
        person: i + 1,
        amount: Math.round((share.fraction.toDecimal() * netEstate / share.count) * 100) / 100
      }))
    }));
  }

  /**
   * Step 13: Calculate confidence score
   */
  private calculateConfidence(
    results: HeirShare[],
    heirs: HeirsData,
    totalFixed: FractionClass
  ): number {
    let confidence = 100;

    // Reduce confidence for complex scenarios
    const heirCount = Object.values(heirs).filter(v => v && v > 0).length;
    if (heirCount > 5) confidence -= 10;
    if (heirCount > 8) confidence -= 15;

    // Reduce for awl
    if (totalFixed.toDecimal() > 1) confidence -= 5;

    // Reduce for special cases
    if (this.specialCases.length > 0) confidence -= Math.min(10, this.specialCases.length * 3);

    return Math.max(50, confidence);
  }

  /**
   * Check if estate has descendants
   */
  private hasDescendants(heirs: HeirsData): boolean {
    return (heirs.son || 0) > 0 || 
           (heirs.daughter || 0) > 0 ||
           (heirs.grandson || 0) > 0 ||
           (heirs.granddaughter || 0) > 0;
  }

  /**
   * Check if Umariyyah special case applies
   */
  private isUmariyyah(heirs: HeirsData): boolean {
    const hasSpouse = (heirs.husband || 0) > 0 || (heirs.wife || 0) > 0;
    const hasParents = (heirs.father || 0) > 0 && (heirs.mother || 0) > 0;
    const hasDescendants = this.hasDescendants(heirs);
    
    return hasSpouse && hasParents && !hasDescendants;
  }

  /**
   * Get total siblings count
   */
  private getSiblingsCount(heirs: HeirsData): number {
    return (heirs.full_brother || 0) + (heirs.full_sister || 0) +
           (heirs.half_brother_paternal || 0) + (heirs.half_sister_paternal || 0) +
           (heirs.half_brother_maternal || 0) + (heirs.half_sister_maternal || 0);
  }

  /**
   * Sum array of fractions
   */
  private sumFractions(fractions: FractionClass[]): FractionClass {
    return fractions.reduce(
      (sum, frac) => sum.add(frac),
      new FractionClass(0, 1)
    );
  }

  /**
   * Merge fixed and asaba shares
   */
  private mergeShares(
    fixedShares: HeirShareObject[],
    asabaShares: HeirShareObject[]
  ): HeirShareObject[] {
    const merged = [...fixedShares];

    asabaShares.forEach(asaba => {
      const existing = merged.find(s => s.key === asaba.key);
      if (existing && asaba.addToExisting) {
        existing.fraction = existing.fraction.add(asaba.fraction);
        existing.type = 'فرض + تعصيب';
      } else {
        merged.push(asaba);
      }
    });

    return merged;
  }

  /**
   * Normalize heir counts to valid ranges
   */
  private normalizeHeirs(heirs: HeirsData): HeirsData {
    return {
      husband: Math.min(heirs.husband || 0, 1),
      wife: Math.min(heirs.wife || 0, 4),
      son: heirs.son || 0,
      daughter: heirs.daughter || 0,
      father: Math.min(heirs.father || 0, 1),
      mother: Math.min(heirs.mother || 0, 1),
      grandfather: Math.min(heirs.grandfather || 0, 1),
      grandmother: Math.min(heirs.grandmother || 0, 1),
      full_brother: heirs.full_brother || 0,
      full_sister: heirs.full_sister || 0,
      half_brother_paternal: heirs.half_brother_paternal || 0,
      half_sister_paternal: heirs.half_sister_paternal || 0,
      half_brother_maternal: heirs.half_brother_maternal || 0,
      half_sister_maternal: heirs.half_sister_maternal || 0,
      grandson: heirs.grandson || 0,
      granddaughter: heirs.granddaughter || 0,
      nephew_from_brother: heirs.nephew_from_brother || 0,
      niece_from_brother: heirs.niece_from_brother || 0,
      uncle_paternal: heirs.uncle_paternal || 0,
      uncle_maternal: heirs.uncle_maternal || 0,
      aunt_paternal: heirs.aunt_paternal || 0,
      aunt_maternal: heirs.aunt_maternal || 0
    };
  }

  /**
   * Validate input data
   */
  private validateInput() {
    if (!this.estate.total || this.estate.total <= 0) {
      return {
        valid: false,
        error: 'يجب إدخال مبلغ إجمالي التركة'
      };
    }

    const totalHeirs = Object.values(this.heirs).filter(v => v && v > 0).length;
    if (totalHeirs === 0) {
      return {
        valid: false,
        error: 'يجب تحديد وارث واحد على الأقل'
      };
    }

    return { valid: true };
  }
}
