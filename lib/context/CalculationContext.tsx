import React, { createContext, useCallback, useContext, useState } from 'react';
import type { CalculationResult, EstateData, HeirsData, MadhhabType } from '../inheritance/types';

export interface CalculationScenario {
  estate: EstateData;
  heirs: HeirsData;
  madhab: MadhhabType;
  result: CalculationResult;
}

interface CalculationContextValue {
  latestScenario: CalculationScenario | null;
  saveScenario: (scenario: CalculationScenario) => void;
  clearScenario: () => void;
}

const CalculationContext = createContext<CalculationContextValue | undefined>(undefined);

export function CalculationProvider({ children }: { children: React.ReactNode }) {
  const [latestScenario, setLatestScenario] = useState<CalculationScenario | null>(null);

  const saveScenario = useCallback((scenario: CalculationScenario) => {
    setLatestScenario(scenario);
  }, []);

  const clearScenario = useCallback(() => {
    setLatestScenario(null);
  }, []);

  return (
    <CalculationContext.Provider value={{ latestScenario, saveScenario, clearScenario }}>
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculationScenario() {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error('useCalculationScenario must be used within a CalculationProvider');
  }

  return context;
}
