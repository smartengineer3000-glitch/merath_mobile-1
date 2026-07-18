import type { EstateData, HeirsData } from "./types";

export interface EngineValidationResult {
  valid: boolean;
  error?: string;
}

const clamp = (value: number | undefined, max?: number) => {
  const normalized = Math.max(0, value || 0);
  return max === undefined ? normalized : Math.min(normalized, max);
};

export function normalizeEstateInput(estate: Partial<EstateData>): EstateData {
  return {
    total: clamp(estate.total),
    funeral: clamp(estate.funeral ?? estate.funeralCosts),
    debts: clamp(estate.debts),
    will: clamp(estate.will ?? estate.willAmount),
  };
}

export function normalizeHeirsInput(heirs: HeirsData): HeirsData {
  return {
    husband: clamp(heirs.husband, 1),
    wife: clamp(heirs.wife, 4),
    son: clamp(heirs.son),
    daughter: clamp(heirs.daughter),
    father: clamp(heirs.father, 1),
    mother: clamp(heirs.mother, 1),
    grandfather: clamp(heirs.grandfather, 1),
    grandmother: clamp(heirs.grandmother, 1),
    grandmother_mother: clamp(heirs.grandmother_mother),
    grandmother_father: clamp(heirs.grandmother_father),
    full_brother: clamp(heirs.full_brother),
    full_sister: clamp(heirs.full_sister),
    half_brother_paternal: clamp(heirs.half_brother_paternal),
    half_sister_paternal: clamp(heirs.half_sister_paternal),
    maternal_brother: clamp(heirs.maternal_brother),
    maternal_sister: clamp(heirs.maternal_sister),
    grandson: clamp(heirs.grandson),
    granddaughter: clamp(heirs.granddaughter),
    nephew_from_brother: clamp(heirs.nephew_from_brother),
    niece_from_brother: clamp(heirs.niece_from_brother),
    uncle_paternal: clamp(heirs.uncle_paternal),
    uncle_maternal: clamp(heirs.uncle_maternal),
    aunt_paternal: clamp(heirs.aunt_paternal),
    aunt_maternal: clamp(heirs.aunt_maternal),
    daughter_son: clamp(heirs.daughter_son),
    daughter_daughter: clamp(heirs.daughter_daughter),
    sister_children: clamp(heirs.sister_children),
    maternal_uncle: clamp(heirs.maternal_uncle),
    maternal_aunt: clamp(heirs.maternal_aunt),
    paternal_aunt: clamp(heirs.paternal_aunt),
    full_nephew: clamp(heirs.full_nephew),
    paternal_nephew: clamp(heirs.paternal_nephew),
    paternal_brother: clamp(heirs.paternal_brother),
    paternal_sister: clamp(heirs.paternal_sister),
    half_brother_maternal: clamp(heirs.half_brother_maternal),
    half_sister_maternal: clamp(heirs.half_sister_maternal),
    full_uncle: clamp(heirs.full_uncle),
    paternal_uncle: clamp(heirs.paternal_uncle),
    full_cousin: clamp(heirs.full_cousin),
    paternal_cousin: clamp(heirs.paternal_cousin),
    maternal_cousin: clamp(heirs.maternal_cousin),
  };
}

export function validateEngineInput(
  estate: EstateData,
  heirs: HeirsData,
): EngineValidationResult {
  if (!estate.total || estate.total <= 0) {
    return {
      valid: false,
      error: "يجب إدخال مبلغ إجمالي التركة",
    };
  }

  const totalHeirTypes = Object.values(heirs).filter((v) => v && v > 0).length;
  if (totalHeirTypes === 0) {
    return {
      valid: false,
      error: "يجب تحديد وارث واحد على الأقل",
    };
  }

  return { valid: true };
}
