/**
 * Enhanced Validation System with User Feedback
 * Phase 1: User-Centric Validation Messages
 *
 * Provides detailed validation with localized, user-friendly feedback
 */

import { EstateData, HeirsData, MadhhabType } from "../inheritance/types";

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationMessage[];
  warnings: ValidationMessage[];
}

export interface ValidationMessage {
  field: string;
  userMessage: string;
  technicalMessage: string;
  severity: "error" | "warning";
  suggestion?: string;
}

/**
 * Estate Validation with User Messages
 */
export class EstateValidator {
  static validate(estate: EstateData): ValidationResult {
    const errors: ValidationMessage[] = [];
    const warnings: ValidationMessage[] = [];

    // CRITICAL FIX: Validate total estate - must be > 0
    if (!estate.total || estate.total <= 0) {
      errors.push({
        field: "estate.total",
        userMessage: "يجب إدخال المبلغ الإجمالي للتركة (أكبر من صفر)",
        technicalMessage: "Estate total must be a positive number",
        severity: "error",
        suggestion: "أدخل المبلغ الإجمالي للتركة (مثل: 100000)",
      });
    }

    // Validate funeral costs
    if (estate.funeral && estate.funeral < 0) {
      errors.push({
        field: "estate.funeral",
        userMessage: "تكاليف التجهيز لا يمكن أن تكون سالبة",
        technicalMessage: "Funeral costs cannot be negative",
        severity: "error",
        suggestion: "أدخل مبلغ موجب أو اترك الحقل فارغاً",
      });
    }

    // Validate debts
    if (estate.debts && estate.debts < 0) {
      errors.push({
        field: "estate.debts",
        userMessage: "الديون لا يمكن أن تكون سالبة",
        technicalMessage: "Debts cannot be negative",
        severity: "error",
        suggestion: "أدخل مبلغ موجب أو اترك الحقل فارغاً",
      });
    }

    // Validate will amount
    if (estate.will && estate.will < 0) {
      errors.push({
        field: "estate.will",
        userMessage: "الوصية لا يمكن أن تكون سالبة",
        technicalMessage: "Will amount cannot be negative",
        severity: "error",
        suggestion: "أدخل مبلغ موجب أو اترك الحقل فارغاً",
      });
    }

    // Only proceed with additional validation if total is valid
    if (estate.total && estate.total > 0) {
      // Validate will does not exceed 1/3 of total estate
      if (estate.will && estate.will > estate.total / 3) {
        errors.push({
          field: "estate.will",
          userMessage: "الوصية لا يمكن أن تتجاوز ثلث التركة",
          technicalMessage:
            "Will cannot exceed 1/3 of total estate per Islamic law",
          severity: "error",
          suggestion: `الحد الأقصى للوصية: ${(estate.total / 3).toFixed(2)} (ثلث التركة)`,
        });
      }

      // Check if debts/funeral/will exceed total
      const deductions =
        (estate.funeral || 0) + (estate.debts || 0) + (estate.will || 0);
      if (deductions > estate.total) {
        errors.push({
          field: "estate.total",
          userMessage:
            "مجموع الديون والتكاليف والوصية لا يمكن أن يتجاوز التركة",
          technicalMessage: "Total deductions cannot exceed estate",
          severity: "error",
          suggestion:
            "تأكد من أن الديون والتكاليف والوصية أقل من أو تساوي التركة الإجمالية",
        });
      }

      // Warning: Large deductions
      if (deductions > estate.total * 0.5) {
        warnings.push({
          field: "estate.total",
          userMessage: "الديون والتكاليف تشكل أكثر من 50% من التركة",
          technicalMessage: "Large deductions detected",
          severity: "warning",
          suggestion: "تحقق من صحة المبالغ",
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

/**
 * Heir Validation with User Messages
 */
export class HeirValidator {
  static validate(heirs: HeirsData): ValidationResult {
    const errors: ValidationMessage[] = [];
    const warnings: ValidationMessage[] = [];

    // Check if heirs object is empty
    if (!heirs || Object.keys(heirs).length === 0) {
      errors.push({
        field: "heirs",
        userMessage: "يجب إضافة واحد على الأقل من الورثة",
        technicalMessage: "At least one heir must be specified",
        severity: "error",
        suggestion: "أضف الورثة الذين سيتقاسمون التركة",
      });
    }

    // Validate each heir
    for (const [heirKey, count] of Object.entries(heirs)) {
      if (count === undefined || count === null) {
        continue;
      }

      if (typeof count !== "number" || count < 0) {
        errors.push({
          field: `heirs.${heirKey}`,
          userMessage: `العدد غير صحيح للوارث: ${heirKey}`,
          technicalMessage: `Invalid count for heir: ${heirKey}`,
          severity: "error",
          suggestion: "أدخل عدد موجب من الورثة",
        });
      }

      if (count > 100) {
        warnings.push({
          field: `heirs.${heirKey}`,
          userMessage: `عدد كبير جداً من الورثة: ${count}`,
          technicalMessage: `Unusual heir count: ${count}`,
          severity: "warning",
          suggestion: "تحقق من صحة عدد الورثة",
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Validate incompatible heir combinations
   */
  static validateCombinations(heirs: HeirsData): ValidationMessage[] {
    const messages: ValidationMessage[] = [];

    const hasHusband = heirs.husband && heirs.husband > 0;
    const hasWife = heirs.wife && heirs.wife > 0;
    const hasFather = heirs.father && heirs.father > 0;
    const hasMother = heirs.mother && heirs.mother > 0;

    // Warning: Both spouses
    if (hasHusband && hasWife) {
      messages.push({
        field: "heirs.spouses",
        userMessage: "التحقق: يوجد زوج وزوجة",
        technicalMessage: "Both husband and wife detected",
        severity: "warning",
        suggestion: "تأكد من صحة بيانات الزوجين",
      });
    }

    return messages;
  }
}

/**
 * Madhab Validation
 */
export class MadhhabValidator {
  static validate(madhab: MadhhabType): ValidationResult {
    const errors: ValidationMessage[] = [];
    const validMadhabs: MadhhabType[] = [
      "hanafi",
      "maliki",
      "shafii",
      "hanbali",
    ];

    if (!validMadhabs.includes(madhab)) {
      errors.push({
        field: "madhab",
        userMessage: "يجب اختيار مذهب فقهي صحيح",
        technicalMessage: `Invalid madhab: ${madhab}`,
        severity: "error",
        suggestion: "اختر بين: الحنفي، المالكي، الشافعي، الحنبلي",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings: [],
    };
  }
}

/**
 * Comprehensive Input Validator
 */
export class InputValidator {
  static validateAll(
    madhab: MadhhabType,
    estate: EstateData,
    heirs: HeirsData,
  ): ValidationResult {
    const results: ValidationResult[] = [];

    results.push(MadhhabValidator.validate(madhab));
    results.push(EstateValidator.validate(estate));
    results.push(HeirValidator.validate(heirs));

    const combinationMessages = HeirValidator.validateCombinations(heirs);

    const allErrors = results.flatMap((r) => r.errors);
    const allWarnings = [
      ...results.flatMap((r) => r.warnings),
      ...combinationMessages,
    ];

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
    };
  }

  /**
   * Get user-friendly message summary
   */
  static getMessageSummary(result: ValidationResult): string {
    if (result.isValid && result.warnings.length === 0) {
      return "تم التحقق من البيانات بنجاح ✓";
    }

    let summary = "";

    if (result.errors.length > 0) {
      summary += `❌ ${result.errors.length} خطأ:\n`;
      result.errors.forEach((e) => {
        summary += `• ${e.userMessage}\n`;
        if (e.suggestion) {
          summary += `  💡 ${e.suggestion}\n`;
        }
      });
    }

    if (result.warnings.length > 0) {
      summary += `\n⚠️ ${result.warnings.length} تحذير:\n`;
      result.warnings.forEach((w) => {
        summary += `• ${w.userMessage}\n`;
        if (w.suggestion) {
          summary += `  💡 ${w.suggestion}\n`;
        }
      });
    }

    return summary;
  }
}
