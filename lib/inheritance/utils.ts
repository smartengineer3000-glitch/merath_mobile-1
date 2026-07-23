/**
 * Helper Functions and Inheritance System Constants
 */

import { MadhhabType, HeirType } from "./types";

/**
 * Arabic heir names (used internally by isValidHeirType)
 */
const HEIR_NAMES: Record<HeirType, string> = {
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
  shared_siblings: "الإخوة لأم والأشقاء",
};

/**
 * Madhab display colors (shared across app)
 */
export const MADHAB_COLORS: Record<MadhhabType, string> = {
  shafii: "#FF6B6B",
  hanafi: "#4ECDC4",
  maliki: "#45B7D1",
  hanbali: "#F7DC6F",
};

/**
 * Validate heir type against known types
 */
export function isValidHeirType(heir: any): heir is HeirType {
  return Object.keys(HEIR_NAMES).includes(heir);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate estate data
 */
export function validateEstateData(
  total: number,
  funeral: number,
  debts: number,
  will: number = 0,
): string | null {
  if (total <= 0) {
    return "Total estate must be greater than zero";
  }
  if (funeral < 0) {
    return "Funeral costs cannot be negative";
  }
  if (debts < 0) {
    return "Debts cannot be negative";
  }
  if (will < 0) {
    return "Will cannot be negative";
  }
  if (will > (total - funeral - debts) / 3) {
    return "Will cannot exceed one-third of the net estate";
  }
  if (funeral + debts + will > total) {
    return "Costs, debts, and will exceed total estate";
  }
  return null;
}

/**
 * Validate heirs data
 */
export function validateHeirsData(
  heirs: Record<string, number | undefined>,
): string | null {
  let hasHeirs = false;

  for (const [key, count] of Object.entries(heirs)) {
    if (count !== undefined) {
      if (!isValidHeirType(key)) {
        return `Invalid heir type: ${key}`;
      }
      if (count < 0) {
        return `Heir count cannot be negative: ${key}`;
      }
      if (count > 0) {
        hasHeirs = true;
      }
    }
  }

  if (!hasHeirs) {
    return "At least one heir must be specified";
  }

  return null;
}

/**
 * Count total number of heirs
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
 * Mapping from engine snake_case keys to i18n camelCase keys
 */
const HEIR_I18N_KEY_MAP: Record<string, string> = {
  full_brother: "brother",
  full_sister: "sister",
  paternal_brother: "paternalBrother",
  paternal_sister: "paternalSister",
  maternal_brother: "maternalBrother",
  maternal_sister: "maternalSister",
  half_brother_paternal: "paternalBrother",
  half_sister_paternal: "paternalSister",
  full_nephew: "nephew",
  paternal_nephew: "paternalNephew",
  nephew_from_brother: "nephew",
  niece_from_brother: "sisterChildren",
  full_uncle: "uncle",
  paternal_uncle: "paternalUncle",
  uncle_paternal: "uncle",
  uncle_maternal: "maternalUncle",
  full_cousin: "cousin",
  paternal_cousin: "paternalCousin",
  aunt_paternal: "paternalAunt",
  aunt_maternal: "maternalAunt",
  maternal_uncle: "maternalUncle",
  maternal_aunt: "maternalAunt",
  paternal_aunt: "paternalAunt",
  grandmother_mother: "grandmotherMother",
  grandmother_father: "grandmotherFather",
  daughter_son: "daughterSon",
  daughter_daughter: "daughterDaughter",
  sister_children: "sisterChildren",
  shared_siblings: "brother",
  treasury: "treasury",
};

/**
 * Get the i18n translation key for a given engine heir key.
 * Usage: t(getHeirI18nKey("full_brother")) -> t("heirs.brother")
 */
export function getHeirI18nKey(engineKey: string): string {
  return HEIR_I18N_KEY_MAP[engineKey] || engineKey;
}

// ── Heir Group Colors ──────────────────────────────────────────────────────
// Subtle background tints + accent border for professional table row coloring.
// Each heir category gets a unique color family.

export interface HeirGroupColor {
  bg: string;
  border: string;
}

const HEIR_GROUP_MAP: Record<string, string> = {
  husband: "spouse",
  wife: "spouse",
  son: "children",
  daughter: "children",
  grandson: "children",
  granddaughter: "children",
  father: "parents",
  mother: "parents",
  grandfather: "grandparents",
  grandmother: "grandparents",
  grandmother_mother: "grandparents",
  grandmother_father: "grandparents",
  full_brother: "siblings",
  full_sister: "siblings",
  half_brother_paternal: "siblings",
  half_sister_paternal: "siblings",
  paternal_brother: "siblings",
  paternal_sister: "siblings",
  maternal_brother: "maternal",
  maternal_sister: "maternal",
  half_brother_maternal: "maternal",
  half_sister_maternal: "maternal",
  nephew_from_brother: "extended",
  niece_from_brother: "extended",
  uncle_paternal: "extended",
  uncle_maternal: "extended",
  aunt_paternal: "extended",
  aunt_maternal: "extended",
  full_nephew: "extended",
  paternal_nephew: "extended",
  full_cousin: "extended",
  paternal_cousin: "extended",
  maternal_uncle: "extended",
  maternal_aunt: "extended",
  paternal_aunt: "extended",
  daughter_son: "extended",
  daughter_daughter: "extended",
  sister_children: "extended",
  shared_siblings: "siblings",
  treasury: "treasury",
};

const HEIR_GROUP_COLORS: Record<string, HeirGroupColor> = {
  spouse: { bg: "#FFFBEB", border: "#F59E0B" },
  children: { bg: "#F0FDF4", border: "#22C55E" },
  parents: { bg: "#EFF6FF", border: "#3B82F6" },
  grandparents: { bg: "#EEF2FF", border: "#6366F1" },
  siblings: { bg: "#FAF5FF", border: "#A855F7" },
  maternal: { bg: "#FFF1F2", border: "#F43F5E" },
  extended: { bg: "#F0FDFA", border: "#14B8A6" },
  treasury: { bg: "#FFF7ED", border: "#F97316" },
};

const DEFAULT_GROUP_COLOR: HeirGroupColor = {
  bg: "#F9FAFB",
  border: "#D1D5DB",
};

export function getHeirGroupColor(heirKey: string): HeirGroupColor {
  const group = HEIR_GROUP_MAP[heirKey];
  return HEIR_GROUP_COLORS[group] || DEFAULT_GROUP_COLOR;
}
