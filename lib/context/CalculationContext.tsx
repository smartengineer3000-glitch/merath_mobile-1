import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  CalculationResult,
  EstateData,
  HeirsData,
  MadhhabType,
} from "../inheritance/types";

export interface CalculationScenario {
  estate: EstateData;
  heirs: HeirsData;
  madhab: MadhhabType;
  result: CalculationResult;
}

export interface AuditEvent {
  id: string;
  timestamp: number;
  type:
    | "app_open"
    | "screen_view"
    | "calculation_start"
    | "calculation_complete"
    | "calculation_error"
    | "heir_update"
    | "estate_update"
    | "madhab_change"
    | "settings_change"
    | "data_clear"
    | "comparison_start"
    | "comparison_complete"
    | "export"
    | "info";
  message: string;
  details?: Record<string, any>;
}

interface StoredCalculationState {
  latestScenario: CalculationScenario | null;
  currentResult: CalculationResult | null;
  previousResults: CalculationResult[];
}

interface CalculationContextValue extends StoredCalculationState {
  isHydrated: boolean;
  events: AuditEvent[];
  logEvent: (
    type: AuditEvent["type"],
    message: string,
    details?: Record<string, any>,
  ) => void;
  saveScenario: (scenario: CalculationScenario) => void;
  saveResult: (result: CalculationResult) => void;
  restoreState: () => Promise<void>;
  clearScenario: () => void;
  clearResults: () => void;
  clearAllCalculationState: () => void;
}

const STORAGE_KEY = "@merath_calculation_state_v1";
const MAX_PREVIOUS_RESULTS = 10;
const MAX_EVENTS = 100;

const initialState: StoredCalculationState = {
  latestScenario: null,
  currentResult: null,
  previousResults: [],
};

const CalculationContext = createContext<CalculationContextValue | undefined>(
  undefined,
);

function trimResults(results: CalculationResult[]) {
  return results.slice(0, MAX_PREVIOUS_RESULTS);
}

function serializeState(state: StoredCalculationState) {
  return JSON.stringify(state);
}

function parseStoredState(value: string | null): StoredCalculationState {
  if (!value) return initialState;

  try {
    const parsed = JSON.parse(value) as Partial<StoredCalculationState>;
    return {
      latestScenario: parsed.latestScenario ?? null,
      currentResult: parsed.currentResult ?? null,
      previousResults: Array.isArray(parsed.previousResults)
        ? trimResults(parsed.previousResults)
        : [],
    };
  } catch (error) {
    console.warn("Failed to parse calculation state:", error);
    return initialState;
  }
}

export function CalculationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<StoredCalculationState>(initialState);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const persist = useCallback(async (nextState: StoredCalculationState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, serializeState(nextState));
    } catch (error) {
      console.warn("Failed to persist calculation state:", error);
    }
  }, []);

  const restoreState = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      setState(parseStoredState(stored));
    } catch (error) {
      console.warn("Failed to restore calculation state:", error);
      setState(initialState);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    restoreState();
  }, [restoreState]);

  const updateState = useCallback(
    (updater: (prev: StoredCalculationState) => StoredCalculationState) => {
      setState((prev) => {
        const next = updater(prev);
        void persist(next);
        return next;
      });
    },
    [persist],
  );

  const saveResult = useCallback(
    (result: CalculationResult) => {
      updateState((prev) => ({
        ...prev,
        currentResult: result,
        previousResults: trimResults([result, ...prev.previousResults]),
      }));
    },
    [updateState],
  );

  const saveScenario = useCallback(
    (scenario: CalculationScenario) => {
      updateState((prev) => ({
        ...prev,
        latestScenario: scenario,
        currentResult: scenario.result,
      }));
    },
    [updateState],
  );

  const clearScenario = useCallback(() => {
    updateState((prev) => ({ ...prev, latestScenario: null }));
  }, [updateState]);

  const clearResults = useCallback(() => {
    updateState((prev) => ({
      ...prev,
      currentResult: null,
      previousResults: [],
    }));
  }, [updateState]);

  const clearAllCalculationState = useCallback(() => {
    updateState(() => initialState);
  }, [updateState]);

  const logEvent = useCallback(
    (
      type: AuditEvent["type"],
      message: string,
      details?: Record<string, any>,
    ) => {
      setEvents((prev) => {
        const next = [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            timestamp: Date.now(),
            type,
            message,
            details,
          },
          ...prev,
        ];
        return next.length > MAX_EVENTS ? next.slice(0, MAX_EVENTS) : next;
      });
    },
    [],
  );

  const value = useMemo(
    () => ({
      ...state,
      isHydrated,
      events,
      logEvent,
      saveScenario,
      saveResult,
      restoreState,
      clearScenario,
      clearResults,
      clearAllCalculationState,
    }),
    [
      state,
      isHydrated,
      events,
      logEvent,
      saveScenario,
      saveResult,
      restoreState,
      clearScenario,
      clearResults,
      clearAllCalculationState,
    ],
  );

  return (
    <CalculationContext.Provider value={value}>
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculationScenario() {
  const context = useContext(CalculationContext);
  if (!context) {
    throw new Error(
      "useCalculationScenario must be used within a CalculationProvider",
    );
  }

  return context;
}

export function useCalculationStore() {
  return useCalculationScenario();
}
