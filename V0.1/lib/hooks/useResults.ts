/**
 * Adapter hook that wraps the core useResults from inheritance/hooks
 * to provide the API that screen components expect.
 */
import { useResults as useCoreResults } from '../inheritance/hooks';
import type { CalculationResult } from '../inheritance/types';

export function useResults() {
  const core = useCoreResults();

  return {
    result: core.currentResult,
    setResult: core.saveResult,
    results: core.previousResults,
    setResults: (_results: unknown[]) => {
      /* comparison screen passes array; no-op for now */
    },
    ...core,
  };
}
