import { describe, it } from 'vitest';
import { InheritanceCalculationEngine } from '../lib/inheritance/calculation-engine';
import type { EstateData, HeirsData } from '../lib/inheritance/types';

describe('Debug Calculation Output', () => {
  it('should show calculation details for wife and 2 sons', () => {
    const estate: EstateData = {
      total: 500000,
      funeral: 5000,
      debts: 0,
      will: 0
    };

    const heirs: HeirsData = {
      wife: 1,
      son: 2
    };

    const engine = new InheritanceCalculationEngine('hanafi', estate, heirs);
    const result = engine.calculate();

    console.log('=== CALCULATION RESULT ===');
    console.log('Success:', result.success);
    console.log('Madhab:', result.madhab);
    console.log('Net Estate:', estate.total - estate.funeral);
    console.log('\n=== SHARES ===');
    
    let totalAmount = 0;
    result.shares.forEach((share, index) => {
      console.log(`\n[${index}] ${share.name} (count: ${share.count})`);
      console.log('  Fraction:', share.fraction ? `${share.fraction.numerator}/${share.fraction.denominator}` : 'N/A');
      console.log('  Amount:', share.amount);
      console.log('  Individual shares:', share.shares?.map(s => `person ${s.person}: ${s.amount}`).join(', '));
      totalAmount += share.amount;
    });
    
    console.log('\n=== TOTALS ===');
    console.log('Sum of share.amount:', totalAmount);
    console.log('Expected (net estate):', estate.total - estate.funeral);
    console.log('Difference:', Math.abs(totalAmount - (estate.total - estate.funeral)));

    // Don't assert, just log for debugging
  });
});
