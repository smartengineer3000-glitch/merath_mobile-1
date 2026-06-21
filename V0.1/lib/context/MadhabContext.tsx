/**
 * @file lib/context/MadhabContext.tsx
 * @description Context for managing the currently selected madhab
 */

import React, { createContext, useContext, useState, useCallback } from "react";
import type { MadhhabType } from "../inheritance/types";

interface MadhabContextValue {
  madhab: MadhhabType;
  setMadhab: (madhab: MadhhabType) => void;
}

const MadhabContext = createContext<MadhabContextValue | undefined>(undefined);

export const MadhabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [madhab, setMadhabState] = useState<MadhhabType>("hanafi");

  const setMadhab = useCallback((m: MadhhabType) => {
    setMadhabState(m);
  }, []);

  return (
    <MadhabContext.Provider value={{ madhab, setMadhab }}>
      {children}
    </MadhabContext.Provider>
  );
};

export function useMadhab(): MadhabContextValue {
  const context = useContext(MadhabContext);
  if (!context) {
    throw new Error("useMadhab must be used within a MadhabProvider");
  }
  return context;
}

export default MadhabContext;
