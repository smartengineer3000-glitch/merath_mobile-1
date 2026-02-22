import { describe, it } from 'vitest';
import { InheritanceCalculationEngine } from '../lib/inheritance/calculation-engine';
import type { EstateData, HeirsData } from '../lib/inheritance/types';

describe('Debug Edge Cases', () => {
  it('should handle only one son', () => {
    const estate: EstateData = {
      total: 99000,
      funeral: 9000,
      debts: 0,
      will: 0
    };

    const heirs: HeirsData = {
      son: 1
    };

    try {
      const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
      const result = engine.calculate();

      console.log('\n=== ONLY SON ===');
      console.log('Success:', result.success);
      if (!result.success) {
        console.log('Error:', (result as any).error);
      } else {
        console.log('Net estate:', estate.total - estate.funeral);
        result.shares.forEach((share, i) => {
          const fracStr = share.fraction ? `${share.fraction.numerator}/${share.fraction.denominator}` : 'N/A';
          console.log(`[${i}] ${share.name}: fraction=${fracStr}, amount=${share.amount}`);
        });
        const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
        console.log('Total:', total);
      }
    } catch (err) {
      console.log('\n=== ONLY SON ===');
      console.log('Exception thrown:', (err as any).message?.substring(0, 100));
      if ((err as any).stack) {
        console.log('Stack trace:', (err as any).stack.split('\n').slice(0, 3).join('\n'));
      }
    }
  });

  it('should handle only one daughter', () => {
    const estate: EstateData = {
      total: 99000,
      funeral: 9000,
      debts: 0,
      will: 0
    };

    const heirs: HeirsData = {
      daughter: 1
    };

    const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
    const result = engine.calculate();

    console.log('\n=== ONLY DAUGHTER ===');
    console.log('Success:', result.success);
    if (!result.success) {
      console.log('Error during calculation');
    } else {
      console.log('Net estate:', estate.total - estate.funeral);
      result.shares.forEach((share, i) => {
        const fracStr = share.fraction ? `${share.fraction.numerator}/${share.fraction.denominator}` : 'N/A';
        console.log(`[${i}] ${share.name}: fraction=${fracStr}, amount=${share.amount}`);
      });
      const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
      console.log('Total amount:', total);
      console.log('Expected (1/2 of net):', (estate.total - estate.funeral) / 2);
      console.log('Radd should have applied - remainder should go back to daughter');
    }
  });

  it('should handle five full brothers', () => {
    const estate: EstateData = {
      total: 600000,
      funeral: 6000,
      debts: 0,
      will: 0
    };

    const heirs: HeirsData = {
      full_brother: 5
    };

    const engine = new InheritanceCalculationEngine('shafii', estate, heirs);
    const result = engine.calculate();

    console.log('\n=== FIVE FULL BROTHERS ===');
    console.log('Success:', result.success);
    if (!result.success) {
      console.log('Error:', (result as any).error);
      console.log('Steps:', result.steps.map(s => `${s.title}: ${s.action}`));
    } else {
      console.log('Net estate:', estate.total - estate.funeral);
      result.shares.forEach((share, i) => {
        const fracStr = share.fraction ? `${share.fraction.numerator}/${share.fraction.denominator}` : 'N/A';
        console.log(`[${i}] ${share.name}: fraction=${fracStr}, amount=${share.amount}`);
      });
      const total = result.shares.reduce((sum, s) => sum + s.amount, 0);
      console.log('Total:', total);
    }
  });
});
