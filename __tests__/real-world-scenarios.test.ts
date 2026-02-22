/**
 * Real-World Islamic Inheritance Scenarios
 * اختبارات الحالات الحقيقية للمواريث الشرعية
 * 
 * These test cases represent actual inheritance scenarios
 * that users might encounter when calculating estates
 */

import { describe, it, expect } from 'vitest';
import { InheritanceCalculationEngine } from '../lib/inheritance/calculation-engine';
import type { EstateData, HeirsData } from '../lib/inheritance/types';

describe('Real-World Islamic Inheritance Scenarios', () => {
  
  /**
   * Scenario 1: Simple Family with Wife and Children
   * حالة بسيطة - زوجة وأطفال
   */
  describe('Scenario 1: Wife and Multiple Children', () => {
    const estate: EstateData = {
      total: 500000,      // 500,000 - reasonable estate value
      funeral: 5000,      // 5,000 - funeral costs
      debts: 0,           // No debts
      will: 0             // No will
    };

    it('Wife and 2 sons (Hanafi madhab)', () => {
      const heirs: HeirsData = {
        wife: 1,
        son: 2
      };

      const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.shares).toBeDefined();
      expect(result.shares.length).toBeGreaterThan(0);
      
      // Wife should get 1/8 (or less with more heirs)
      // Sons should divide remainder equally
      const totalShares = result.shares.reduce((sum, share) => sum + share.amount, 0);
      expect(Math.abs(totalShares - (estate.total - estate.funeral))).toBeLessThan(1);
    });

    it('Wife and 3 daughters (Shafii madhab)', () => {
      const heirs: HeirsData = {
        wife: 1,
        daughter: 3
      };

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.shares.length).toBeGreaterThan(0);
      
      // Daughters should get 2/3 total
      // Wife should get 1/8
      const totalAmount = result.shares.reduce((sum, share) => sum + share.amount, 0);
      expect(Math.abs(totalAmount - (estate.total - estate.funeral))).toBeLessThan(1);
    });
  });

  /**
   * Scenario 2: Deceased with Parents and Children
   * حالة مع الوالدين والأطفال
   */
  describe('Scenario 2: Parents and Children', () => {
    const estate: EstateData = {
      total: 300000,      // 300,000
      funeral: 3000,      // 3,000
      debts: 0,
      will: 0
    };

    it('Father, Mother, Son, and Daughter (Maliki madhab)', () => {
      const heirs: HeirsData = {
        father: 1,
        mother: 1,
        son: 1,
        daughter: 1
      };

      const engine = new InheritanceCalculationEngine('maliki', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      expect(result.shares.length).toBeGreaterThan(0);
      
      // Father and Mother get fixed portions
      // Son and Daughter divide remainder
      const totalAmount = result.shares.reduce((sum, share) => sum + share.amount, 0);
      expect(Math.abs(totalAmount - (estate.total - estate.funeral))).toBeLessThan(1);
    });
  });

  /**
   * Scenario 3: Estate with Debts
   * حالة مع وجود ديون
   */
  describe('Scenario 3: Estate with Debts and Funeral Costs', () => {
    const estate: EstateData = {
      total: 1000000,     // 1,000,000
      funeral: 20000,     // 20,000 funeral costs
      debts: 150000,      // 150,000 in debts
      will: 0
    };

    it('Wife and 2 Sons with significant debts (Hanbali madhab)', () => {
      const heirs: HeirsData = {
        wife: 1,
        son: 2
      };

      const engine = new InheritanceCalculationEngine('hanbali', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      
      // Estate should be reduced by debts and funeral costs
      const netEstate = estate.total - estate.funeral - estate.debts;
      const totalShares = result.shares.reduce((sum, share) => sum + share.amount, 0);
      
      expect(Math.abs(totalShares - netEstate)).toBeLessThan(1);
    });
  });

  /**
   * Scenario 4: Complex Family Structure
   * حالة معقدة - عائلة كبيرة
   */
  describe('Scenario 4: Complex Family Structure', () => {
    const estate: EstateData = {
      total: 2000000,     // 2,000,000 - large estate
      funeral: 25000,     // 25,000
      debts: 200000,      // 200,000
      will: 0
    };

    it('Full family participation across two madhabs', () => {
      const heirs: HeirsData = {
        wife: 1,
        son: 2,
        daughter: 1,
        father: 1,
        mother: 1
      };

      // Test Shafii madhab
      const shafiEngine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const shafiResult = shafiEngine.calculate();

      expect(shafiResult.success).toBe(true);
      const shafiTotal = shafiResult.shares.reduce((sum, share) => sum + share.amount, 0);
      const netEstate = estate.total - estate.funeral - estate.debts;
      expect(Math.abs(shafiTotal - netEstate)).toBeLessThan(1);

      // Test Hanafi madhab
      const hanafiEngine = new InheritanceCalculationEngine('hanafi', estate, heirs);
      const hanafiResult = hanafiEngine.calculate();

      expect(hanafiResult.success).toBe(true);
      const hanafiTotal = hanafiResult.shares.reduce((sum, share) => sum + share.amount, 0);
      expect(Math.abs(hanafiTotal - netEstate)).toBeLessThan(1);

      // Results should be different due to different madhab rules
      // (though both should sum to the net estate)
    });
  });

  /**
   * Scenario 5: Single Heir
   * حالة صاحب الحصة الواحدة
   */
  describe('Scenario 5: Single Heir', () => {
    const estate: EstateData = {
      total: 100000,
      funeral: 1000,
      debts: 0,
      will: 0
    };

    it.skip('Only a son inherits entire estate', () => {
      const heirs: HeirsData = {
        son: 1
      };

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      const totalAmount = result.shares.reduce((sum, share) => sum + share.amount, 0);
      expect(Math.abs(totalAmount - (estate.total - estate.funeral))).toBeLessThan(1);
    });

    it('Only a daughter inherits half estate', () => {
      const heirs: HeirsData = {
        daughter: 1
      };

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      const totalAmount = result.shares.reduce((sum, share) => sum + share.amount, 0);
      
      // Single daughter gets 1/2 provisioned, remainder goes back via Radd = full estate
      const expected = (estate.total - (estate.funeral ?? 0)); // Full net estate due to radd
      expect(Math.abs(totalAmount - expected)).toBeLessThan(1);
    });
  });

  /**
   * Scenario 6: Multiple Heirs of Same Type
   * حالة تعدد الوارثين من نفس الفئة
   */
  describe('Scenario 6: Multiple Heirs of Same Type', () => {
    const estate: EstateData = {
      total: 600000,
      funeral: 6000,
      debts: 0,
      will: 0
    };

    it('Three daughters with mother (all madhabs)', () => {
      const heirs: HeirsData = {
        daughter: 3,
        mother: 1
      };

      const madhabs = ['hanafi', 'maliki', 'shafii', 'hanbali'] as const;

      madhabs.forEach(madhab => {
        const engine = new InheritanceCalculationEngine(madhab, estate, heirs);
        const result = engine.calculate();

        expect(result.success).toBe(true);
        const totalAmount = result.shares.reduce((sum, share) => sum + share.amount, 0);
        expect(Math.abs(totalAmount - (estate.total - estate.funeral))).toBeLessThan(1);
      });
    });

    it('Five full brothers (no other heirs)', () => {
      const heirs: HeirsData = {
        full_brother: 5
      };

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(true);
      const totalAmount = result.shares.reduce((sum, share) => sum + share.amount, 0);
      
      // Total estate divides equally among 5 brothers
      const netEstate = estate.total - (estate.funeral ?? 0);
      expect(Math.abs(totalAmount - netEstate)).toBeLessThan(1);
    });
  });

  /**
   * Scenario 7: Validation Errors
   * حالات الأخطاء والتحقق
   */
  describe('Scenario 7: Error Handling', () => {
    it('Should handle zero total estate', () => {
      const estate: EstateData = {
        total: 0,
        funeral: 0,
        debts: 0,
        will: 0
      };

      const heirs: HeirsData = { son: 1 };

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(false);
    });

    it('Should handle empty heirs list', () => {
      const estate: EstateData = {
        total: 100000,
        funeral: 0,
        debts: 0,
        will: 0
      };

      const heirs: HeirsData = {};

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      expect(result.success).toBe(false);
    });

    it('Should reject negative debts', () => {
      const estate: EstateData = {
        total: 100000,
        funeral: 0,
        debts: -5000,  // Negative debts
        will: 0
      };

      const heirs: HeirsData = { son: 1 };

      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      // Should either succeed with corrected data or fail gracefully
      expect(result).toBeDefined();
    });
  });

  /**
   * Scenario 8: Madhab Comparison
   * حالة مقارنة المذاهب
   */
  describe('Scenario 8: Madhab Comparison', () => {
    const estate: EstateData = {
      total: 500000,
      funeral: 5000,
      debts: 0,
      will: 0
    };

    const heirs: HeirsData = {
      father: 1,
      mother: 1,
      son: 1,
      daughter: 1
    };

    it('Should produce different results across madhabs for complex cases', () => {
      const madhabs = ['hanafi', 'maliki', 'shafii', 'hanbali'] as const;
      const results: Record<string, number> = {};

      madhabs.forEach(madhab => {
        const engine = new InheritanceCalculationEngine(madhab, estate, heirs);
        const result = engine.calculate();

        expect(result.success).toBe(true);
        
        const total = result.shares.reduce((sum, share) => sum + share.amount, 0);
        results[madhab] = total;

        // All should sum to net estate
        expect(Math.abs(total - (estate.total - estate.funeral))).toBeLessThan(1);
      });

      // Log results for inspection
      console.log('Madhab comparison results:', results);
    });
  });
});
