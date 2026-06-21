/**
 * نظام الحجب الفقهي الشامل
 * Comprehensive Islamic Hijab (Inheritance Obstruction) System
 * 
 * يطبق جميع قواعس الحجب حسب كل مذهب إسلامي
 */

import { MadhhabType, HeirsData } from './types';
import { getHijabRules } from './constants';

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
      log: this.hijabLog
    };
  }

  /**
   * الحجب الكامل: حرمان الوارث من الميراث كلياً
   * Complete Hijab: Complete deprivation from inheritance
   */
  private applyCompleteHijab(heirs: HeirsData): void {
    const rules = getHijabRules(this.madhab);

    // قائمة الحجب الكامل
    const completeHijabRules = rules.filter(r => r.type === 'complete');

    for (const rule of completeHijabRules) {
      const hijabber = heirs[rule.hijabber];

      if (hijabber && hijabber > 0) {
        for (const hijabbed of rule.hijabbed) {
          if (heirs[hijabbed] && heirs[hijabbed]! > 0) {
            this.hijabLog.push(
              `${rule.hijabber} يحجب ${hijabbed}`,
              `${rule.hijabber} blocks ${hijabbed}`
            );
            heirs[hijabbed] = 0;
          }
        }
      }
    }

// ===== MADHAB-SPECIFIC RULE: Grandfather with siblings =====
const hasGrandfather = (heirs.grandfather || 0) > 0;
const hasSiblings = (heirs.full_brother || 0) > 0 || 
                    (heirs.full_sister || 0) > 0 ||
                    (heirs.half_brother_paternal || 0) > 0 ||
                    (heirs.half_sister_paternal || 0) > 0;

if (hasGrandfather && hasSiblings) {
  // Shafii & Hanafi: Grandfather BLOCKS siblings
  if (this.madhab === 'shafii' || this.madhab === 'hanafi') {
    this.hijabLog.push(
      `في المذهب ${this.madhab === 'shafii' ? 'الشافعي' : 'الحنفي'}: الجد يحجب الإخوة`,
      `In ${this.madhab} madhab: Grandfather blocks siblings`
    );
    
    // Block all siblings
    heirs.full_brother = 0;
    heirs.full_sister = 0;
    heirs.half_brother_paternal = 0;
    heirs.half_sister_paternal = 0;
  }
  
  // Maliki & Hanbali: Grandfather SHARES with siblings (handled in computeAsaba, not hijab)
  else if (this.madhab === 'maliki' || this.madhab === 'hanbali') {
    this.hijabLog.push(
      `في المذهب ${this.madhab === 'maliki' ? 'المالكي' : 'الحنبلي'}: الجد يقاسم الإخوة (يعالج في العصبات)`,
      `In ${this.madhab} madhab: Grandfather shares with siblings (handled in asaba)`
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
        this.hijabLog.push(
          `بنتان فأكثر تحجبان بنت الابن`,
          `Two or more daughters block granddaughters`
        );
        heirs.granddaughter = 0;
      } else {
        // With grandson, granddaughters are not blocked, but will inherit as asaba
        this.hijabLog.push(
          `بنتان مع ابن الابن - بنات الابن يرثن كعصبة`,
          `Daughters with grandson - granddaughters inherit as asaba`
        );
        // No change - granddaughters will inherit with grandson in asaba
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
    const partialHijabRules = rules.filter(r => r.type === 'partial');

    for (const rule of partialHijabRules) {
      // معالجة القواعس الخاصة
      if (rule.reason === 'from_third_to_sixth') {
        // الأب يخفض الأم من الثلث إلى السدس
        if (heirs['father'] && heirs['father']! > 0 && heirs['mother'] && heirs['mother']! > 0) {
          this.hijabLog.push(
            `الأب يخفض نصيب الأم من الثلث إلى السدس`,
            `Father reduces mother's share from 1/3 to 1/6`
          );
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
      'husband',
      'wife',
      'son',
      'daughter',
      'father',
      'mother',
      'grandfather',
      'grandmother',
      'full_brother',
      'full_sister',
      'half_brother_paternal',
      'half_sister_paternal',
      'half_brother_maternal',
      'half_sister_maternal',
      'nephew_from_brother',
      'niece_from_brother',
      'uncle_paternal',
      'uncle_maternal',
      'aunt_paternal',
      'aunt_maternal'
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
    return (heirs['son'] || 0) > 0 || (heirs['daughter'] || 0) > 0;
  }

  /**
   * التحقق من وجود والد
   * Check if father exists
   */
  hasFather(heirs: HeirsData): boolean {
    return (heirs['father'] || 0) > 0;
  }

  /**
   * التحقق من وجود والدة
   * Check if mother exists
   */
  hasMother(heirs: HeirsData): boolean {
    return (heirs['mother'] || 0) > 0;
  }

  /**
   * التحقق من وجود زوج
   * Check if husband exists
   */
  hasHusband(heirs: HeirsData): boolean {
    return (heirs['husband'] || 0) > 0;
  }

  /**
   * التحقق من وجود زوجة
   * Check if wife exists
   */
  hasWife(heirs: HeirsData): boolean {
    return (heirs['wife'] || 0) > 0;
  }

  /**
   * التحقق من وجود إخوة
   * Check if siblings exist
   */
  hasSiblings(heirs: HeirsData): boolean {
    const siblings =
      (heirs['full_brother'] || 0) +
      (heirs['full_sister'] || 0) +
      (heirs['half_brother_paternal'] || 0) +
      (heirs['half_sister_paternal'] || 0);

    return siblings > 0;
  }

  /**
   * حساب عدد الذكور
   * Count males
   */
  countMales(heirs: HeirsData): number {
    return (
      (heirs['son'] || 0) +
      (heirs['father'] || 0) +
      (heirs['grandfather'] || 0) +
      (heirs['full_brother'] || 0) +
      (heirs['half_brother_paternal'] || 0) +
      (heirs['half_brother_maternal'] || 0) +
      (heirs['uncle_paternal'] || 0) +
      (heirs['uncle_maternal'] || 0)
    );
  }

  /**
   * حساب عدد الإناث
   * Count females
   */
  countFemales(heirs: HeirsData): number {
    return (
      (heirs['daughter'] || 0) +
      (heirs['mother'] || 0) +
      (heirs['grandmother'] || 0) +
      (heirs['full_sister'] || 0) +
      (heirs['half_sister_paternal'] || 0) +
      (heirs['half_sister_maternal'] || 0) +
      (heirs['aunt_paternal'] || 0) +
      (heirs['aunt_maternal'] || 0)
    );
  }

  /**
   * Get the madhab of this instance
   */
  getMadhab(): MadhhabType {
    return this.madhab;
  }
}