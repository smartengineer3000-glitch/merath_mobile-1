/**
 * دوال مساعدة وثوابت نظام المواريث
 * Helper Functions and Inheritance System Constants
 */

import { MadhhabType, HeirType } from "./types";

/**
 * قائمة أسماء الورثة بالعربية
 * Matches original HTML (Merath_Cluade_Pro7.html) exactly
 */
export const HEIR_NAMES: Record<HeirType, string> = {
  husband: "الزوج",
  wife: "الزوجة",
  father: "الأب",
  mother: "الأم",
  grandfather: "الجد",
  grandmother: "الجدة",
  grandmother_mother: "الجدة لأم",
  grandmother_father: "الجدة لأب",
  son: "الابن",
  daughter: "البنت",
  grandson: "ابن الابن",
  granddaughter: "بنت الابن",
  full_brother: "الأخ الشقيق",
  full_sister: "الأخت الشقيقة",
  paternal_brother: "الأخ لأب",
  paternal_sister: "الأخت لأب",
  maternal_brother: "الأخ لأم",
  maternal_sister: "الأخت لأم",
  half_brother_paternal: "نصف أخ لأب",
  half_sister_paternal: "نصف أخت لأب",
  full_nephew: "ابن الأخ الشقيق",
  paternal_nephew: "ابن الأخ لأب",
  nephew_from_brother: "ابن الأخ",
  niece_from_brother: "بنت الأخ",
  full_uncle: "العم الشقيق",
  paternal_uncle: "العم لأب",
  uncle_paternal: "العم",
  uncle_maternal: "الخال",
  aunt_paternal: "العمة",
  aunt_maternal: "الخالة",
  full_cousin: "ابن العم الشقيق",
  paternal_cousin: "ابن العم لأب",
  maternal_uncle: "الخال",
  maternal_aunt: "الخالة",
  paternal_aunt: "العمة",
  daughter_son: "ابن البنت",
  daughter_daughter: "بنت البنت",
  sister_children: "أولاد الأخت",
  treasury: "بيت المال",
  // Added for Musharraka special case
  shared_siblings: "الإخوة لأم والأشقاء",
};

/**
 * ألوان المذاهب
 */
export const MADHAB_COLORS: Record<MadhhabType, string> = {
  shafii: "#FF6B6B",
  hanafi: "#4ECDC4",
  maliki: "#45B7D1",
  hanbali: "#F7DC6F",
};

/**
 * أيقونات المذاهب
 */
export const MADHAB_ICONS: Record<MadhhabType, string> = {
  shafii: "🕌",
  hanafi: "📖",
  maliki: "⚖️",
  hanbali: "📜",
};

/**
 * أسماء المذاهب
 */
export const MADHAB_NAMES: Record<MadhhabType, string> = {
  shafii: "المذهب الشافعي",
  hanafi: "المذهب الحنفي",
  maliki: "المذهب المالكي",
  hanbali: "المذهب الحنبلي",
};

/**
 * التحقق من صحة المذهب
 */
export function isValidMadhab(madhab: any): madhab is MadhhabType {
  return ["shafii", "hanafi", "maliki", "hanbali"].includes(madhab);
}

/**
 * التحقق من صحة نوع الوارث
 */
export function isValidHeirType(heir: any): heir is HeirType {
  return Object.keys(HEIR_NAMES).includes(heir);
}

/**
 * تنسيق المبلغ كعملة
 */
export function formatCurrency(amount: number, currency = "SAR"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * تنسيق النسبة المئوية
 */
export function formatPercentage(decimal: number): string {
  return `${(decimal * 100).toFixed(2)}%`;
}

/**
 * حساب LCM (أقل مضاعف مشترك)
 */
export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

/**
 * حساب GCD (أكبر عامل مشترك)
 */
export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * توليد معرف فريد
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * قياس وقت التنفيذ
 */
export function measureTime<T>(fn: () => T): { result: T; time: number } {
  const start = performance.now();
  const result = fn();
  const time = performance.now() - start;
  return { result, time };
}

/**
 * تنسيق الوقت بصيغة قابلة للقراءة
 */
export function formatTime(milliseconds: number): string {
  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(2)}ms`;
  }
  return `${(milliseconds / 1000).toFixed(2)}s`;
}

/**
 * التحقق من صحة بيانات التركة
 */
export function validateEstateData(
  total: number,
  funeral: number,
  debts: number,
  will: number = 0,
): string | null {
  if (total <= 0) {
    return "إجمالي التركة يجب أن يكون أكبر من صفر";
  }
  if (funeral < 0) {
    return "تكاليف التجهيز لا يمكن أن تكون سالبة";
  }
  if (debts < 0) {
    return "الديون لا يمكن أن تكون سالبة";
  }
  if (will < 0) {
    return "الوصية لا يمكن أن تكون سالبة";
  }
  if (will > (total - funeral - debts) / 3) {
    return "الوصية لا يمكن أن تتجاوز ثلث التركة الصافية (بعد الخصم والديون)";
  }
  if (funeral + debts + will > total) {
    return "التكاليف والديون والوصية تتجاوز إجمالي التركة";
  }
  return null;
}

/**
 * التحقق من صحة بيانات الورثة
 */
export function validateHeirsData(
  heirs: Record<string, number | undefined>,
): string | null {
  let hasHeirs = false;

  for (const [key, count] of Object.entries(heirs)) {
    if (count !== undefined) {
      if (!isValidHeirType(key)) {
        return `نوع وارث غير صحيح: ${key}`;
      }
      if (count < 0) {
        return `عدد الورثة لا يمكن أن يكون سالباً: ${key}`;
      }
      if (count > 0) {
        hasHeirs = true;
      }
    }
  }

  if (!hasHeirs) {
    return "يجب تحديد ورثة واحد على الأقل";
  }

  return null;
}

/**
 * حساب عدد الورثة الإجمالي
 */
export function countTotalHeirs(
  heirs: Record<string, number | undefined>,
): number {
  let sum = 0;
  for (const count of Object.values(heirs)) {
    if (count !== undefined) {
      sum += count;
    }
  }
  return sum;
}

/**
 * حساب عدد أنواع الورثة
 */
export function countHeirTypes(
  heirs: Record<string, number | undefined>,
): number {
  return Object.values(heirs).filter((count) => count && count > 0).length;
}

/**
 * ترتيب الورثة حسب الأولوية الفقهية
 */
export function sortHeirsByPriority(heirs: HeirType[]): HeirType[] {
  const priority: Record<HeirType, number> = {
    husband: 1,
    wife: 2,
    son: 3,
    daughter: 4,
    grandson: 3,
    granddaughter: 4,
    father: 5,
    mother: 6,
    grandfather: 7,
    grandmother: 8,
    grandmother_mother: 8,
    grandmother_father: 7,
    full_brother: 9,
    full_sister: 10,
    paternal_brother: 9,
    paternal_sister: 10,
    maternal_brother: 9,
    maternal_sister: 10,
    half_brother_paternal: 11,
    half_sister_paternal: 12,
    full_nephew: 15,
    paternal_nephew: 15,
    nephew_from_brother: 15,
    niece_from_brother: 16,
    full_uncle: 17,
    paternal_uncle: 17,
    uncle_paternal: 17,
    uncle_maternal: 19,
    full_cousin: 21,
    paternal_cousin: 21,
    aunt_paternal: 18,
    paternal_aunt: 18,
    aunt_maternal: 20,
    maternal_aunt: 20,
    maternal_uncle: 19,
    daughter_son: 3,
    daughter_daughter: 4,
    sister_children: 11,
    treasury: 100,
    // Added for Musharraka
    shared_siblings: 9, // Between full_brother and others
  };

  return [...heirs].sort((a, b) => priority[a] - priority[b]);
}

/**
 * الحصول على اسم الوارث العربي
 */
export function getHeirName(heir: HeirType): string {
  return HEIR_NAMES[heir] || heir;
}

/**
 * الحصول على لون المذهب
 */
export function getMadhhabColor(madhab: MadhhabType): string {
  return MADHAB_COLORS[madhab];
}

/**
 * الحصول على أيقونة المذهب
 */
export function getMadhhabIcon(madhab: MadhhabType): string {
  return MADHAB_ICONS[madhab];
}

/**
 * الحصول على اسم المذهب
 */
export function getMadhhabName(madhab: MadhhabType): string {
  return MADHAB_NAMES[madhab];
}
