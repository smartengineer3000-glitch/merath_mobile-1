import { EnhancedInheritanceCalculationEngine } from './enhanced-engine-complete';

export function calculateInheritance(input: any) {
  const engine = new EnhancedInheritanceCalculationEngine(
    input.madhab,
    { total: input.totalEstate, debts: input.debts, funeral: input.funeralExpenses, will: input.will },
    input.heirs
  );
  return engine.calculate();
}
