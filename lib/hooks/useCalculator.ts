/**
 * Adapter hook that wraps the core useCalculator from inheritance/hooks
 * to provide the API that screen components expect.
 */
import { useCallback } from 'react';
import { useCalculator as useCoreCalculator } from '../inheritance/hooks';
import type { MadhhabType, HeirsData, CalculationResult } from '../inheritance/types';

export function useCalculator() {
  const core = useCoreCalculator();

  const calculateInheritance = useCallback(
    async (
      estateTotal?: number,
      selectedHeirs?: string[],
      madhab?: MadhhabType
    ): Promise<CalculationResult | null> => {
      const m = madhab ?? 'hanafi';

      if (estateTotal !== undefined) {
        core.updateEstateData({ total: estateTotal });
      }

      let heirs: HeirsData = {};
      if (selectedHeirs && selectedHeirs.length > 0) {
        for (const heir of selectedHeirs) {
          heirs[heir] = (heirs[heir] ?? 0) + 1;
        }
      }

      return core.calculateWithMethod(m, heirs);
    },
    [core]
  );

  return {
    ...core,
    calculateInheritance,
  };
}
