/**
 * Adapter hook that exposes the shared calculation result store and keeps the
 * advanced comparison helpers from the inheritance hooks available to screens.
 */
import { useResults as useCoreResults } from "../inheritance/hooks";
import { useCalculationStore } from "../context/CalculationContext";

export function useResults() {
  const core = useCoreResults();
  const store = useCalculationStore();

  return {
    ...core,
    result: store.currentResult,
    currentResult: store.currentResult,
    previousResults: store.previousResults,
    results: store.previousResults,
    setResult: store.saveResult,
    saveResult: store.saveResult,
    clearResults: store.clearResults,
    isHydrated: store.isHydrated,
    setResults: (_results: unknown[]) => {
      /* comparison screen passes array; no-op until bulk import is required */
    },
  };
}
