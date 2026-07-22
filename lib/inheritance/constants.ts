/**
 * قاعدة البيانات الفقهية الشاملة
 * Comprehensive Fiqh Database
 *
 * تحتوي على جميع القواعس والأحكام الفقهية للمذاهب الأربعة
 */

import { MadhhabConfig, MadhhabRules } from "./types";

export interface HijabRule {
  hijabber: string;
  hijabbed: string[];
  type: "complete" | "partial";
  reason?: string;
}

export const FIQH_DATABASE = {
  // ====== معلومات المذاهب ======
  madhabs: {
    shafii: {
      code: "shafii" as const,
      name: "المذهب الشافعي",
      description: "المذهب الشافعي - من أشهر المذاهب الإسلامية",
      color: "#FF6B6B",
      icon: "🕌",
      rules: {
        grandfather_with_siblings: "musharak" as const,
        mother_with_father_children: "sixth" as const,
        mother_with_father_only: "third" as const,
        spouse_radd: false,
        radd_allowed: false,
        umariyyah_rule: "first" as const,
        musharraka: true,
      } as MadhhabRules,
    },
    hanafi: {
      code: "hanafi" as const,
      name: "المذهب الحنفي",
      description: "المذهب الحنفي - الأكثر اتباعاً",
      color: "#4ECDC4",
      icon: "📖",
      rules: {
        grandfather_with_siblings: "hijab" as const,
        mother_with_father_children: "sixth" as const,
        mother_with_father_only: "third" as const,
        spouse_radd: true,
        radd_allowed: true,
        umariyyah_rule: "first" as const,
        musharraka: false,
      } as MadhhabRules,
    },
    maliki: {
      code: "maliki" as const,
      name: "المذهب المالكي",
      description: "المذهب المالكي - المذهب الرسمي للمغرب",
      color: "#45B7D1",
      icon: "⚖️",
      rules: {
        grandfather_with_siblings: "musharak" as const,
        mother_with_father_children: "sixth" as const,
        mother_with_father_only: "third" as const,
        spouse_radd: false,
        radd_allowed: false,
        umariyyah_rule: "first" as const,
        musharraka: true,
      } as MadhhabRules,
    },
    hanbali: {
      code: "hanbali" as const,
      name: "المذهب الحنبلي",
      description: "المذهب الحنبلي - المذهب الرسمي للسعودية",
      color: "#F7DC6F",
      icon: "📜",
      rules: {
        grandfather_with_siblings: "musharak" as const,
        mother_with_father_children: "sixth" as const,
        mother_with_father_only: "third" as const,
        spouse_radd: true,
        radd_allowed: true,
        umariyyah_rule: "first" as const,
        musharraka: false,
      } as MadhhabRules,
    },
  } as Record<string, MadhhabConfig>,

  // ====== قواعس الحجب ======
  hijabRules: {
    shafii: [
      {
        hijabber: "son",
        hijabbed: [
          "full_brother",
          "full_sister",
          "half_brother_paternal",
          "half_sister_paternal",
          "nephew_from_brother",
          "niece_from_brother",
        ],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["maternal_brother", "maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_uncle", "paternal_uncle", "paternal_aunt"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_nephew", "paternal_nephew"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["grandfather"],
        type: "complete" as const,
      },
      {
        hijabber: "mother",
        hijabbed: ["grandmother"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["mother"],
        type: "partial" as const,
        reason: "from_third_to_sixth",
      },
      {
        hijabber: "daughter",
        hijabbed: ["maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "full_brother",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
    ],
    hanafi: [
      {
        hijabber: "son",
        hijabbed: ["full_brother", "half_brother_paternal"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["maternal_brother", "maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_uncle", "paternal_uncle", "paternal_aunt"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_nephew", "paternal_nephew"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["grandfather"],
        type: "complete" as const,
      },
      {
        hijabber: "mother",
        hijabbed: ["grandmother"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["mother"],
        type: "partial" as const,
        reason: "from_third_to_sixth",
      },
      {
        hijabber: "daughter",
        hijabbed: ["maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "full_brother",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
    ],
    maliki: [
      {
        hijabber: "son",
        hijabbed: ["full_brother", "half_brother_paternal"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["maternal_brother", "maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_uncle", "paternal_uncle", "paternal_aunt"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_nephew", "paternal_nephew"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["grandfather"],
        type: "complete" as const,
      },
      {
        hijabber: "mother",
        hijabbed: ["grandmother"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["mother"],
        type: "partial" as const,
        reason: "from_third_to_sixth",
      },
      {
        hijabber: "daughter",
        hijabbed: ["maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "full_brother",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
    ],
    hanbali: [
      {
        hijabber: "son",
        hijabbed: ["full_brother", "half_brother_paternal"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["maternal_brother", "maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_uncle", "paternal_uncle", "paternal_aunt"],
        type: "complete" as const,
      },
      {
        hijabber: "son",
        hijabbed: ["full_nephew", "paternal_nephew"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["grandfather"],
        type: "complete" as const,
      },
      {
        hijabber: "mother",
        hijabbed: ["grandmother"],
        type: "complete" as const,
      },
      {
        hijabber: "father",
        hijabbed: ["mother"],
        type: "partial" as const,
        reason: "from_third_to_sixth",
      },
      {
        hijabber: "daughter",
        hijabbed: ["maternal_sister"],
        type: "complete" as const,
      },
      {
        hijabber: "full_brother",
        hijabbed: ["paternal_brother", "paternal_sister"],
        type: "complete" as const,
      },
    ],
  },

  // ====== الحالات الخاصة ======
  specialCases: {
    umariyyah: {
      description: "العمرية: حالة خاصة للأم مع الأب والزوج/الزوجة",
      shafii: "third_of_remainder" as const,
      hanafi: "third_of_remainder" as const,
      maliki: "sixth" as const,
      hanbali: "third_of_remainder" as const,
    },
    awl: {
      description: "العول: عندما يتجاوز مجموع الفروض التركة",
    },
    radd: {
      description: "الرد: عندما يبقى من التركة بعد الفروض",
    },
  },

  // ====== الثوابت الحسابية ======
  constants: {
    PRECISION: 10, // دقة الحساب العشرية
    TOLERANCE: 0.0001, // هامش التفاوت المسموح
    MIN_AMOUNT: 0.01, // الحد الأدنى للمبلغ
    DEFAULT_ESTATE: 120000, // التركة الافتراضية للاختبار
  },
};

// ====== دالة مساعدة للحصول على معلومات المذهب ======
export function getMadhhabConfig(madhab: string): MadhhabConfig | null {
  const madhabs = FIQH_DATABASE.madhabs as Record<string, MadhhabConfig>;
  return madhabs[madhab] || null;
}

// ====== دالة مساعدة للحصول على قواعس الحجب ======
export function getHijabRules(madhab: string): HijabRule[] {
  const rules = FIQH_DATABASE.hijabRules as Record<string, HijabRule[]>;
  return rules[madhab] || [];
}

// ====== دالة مساعدة للتحقق من صحة المذهب ======
export function isValidMadhab(madhab: string): boolean {
  return madhab in FIQH_DATABASE.madhabs;
}
