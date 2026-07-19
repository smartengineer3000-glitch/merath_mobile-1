/**
 * @file lib/context/MadhabContext.tsx
 * @description Context for managing the currently selected madhab with AsyncStorage persistence
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { MadhhabType } from "../inheritance/types";

interface MadhabContextValue {
  madhab: MadhhabType;
  setMadhab: (madhab: MadhhabType) => void;
}

const MadhabContext = createContext<MadhabContextValue | undefined>(undefined);

const MADHAB_STORAGE_KEY = "@merath_selected_madhab";

export const MadhabProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [madhab, setMadhabState] = useState<MadhhabType>("hanafi");

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(MADHAB_STORAGE_KEY);
        if (saved) {
          setMadhabState(saved as MadhhabType);
        }
      } catch {
        // ignore read errors, keep default
      }
    })();
  }, []);

  const setMadhab = useCallback((m: MadhhabType) => {
    setMadhabState(m);
    AsyncStorage.setItem(MADHAB_STORAGE_KEY, m).catch(() => {});
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
