/**
 * Phase 2 - Asaba Engine (Residuary Heirs)
 * ----------------------------------------
 * Handles remainder distribution after fixed shares
 */

import { ShareResult } from "./fixed-shares";

export class AsabaEngine {
  distribute(
    estate: number,
    fixedShares: ShareResult,
    heirs: Record<string, any>
  ): ShareResult {
    const allocated = Object.values(fixedShares).reduce((a, b) => a + b, 0);
    const remaining = Math.max(0, 1 - allocated);

    const result: ShareResult = { ...fixedShares };

    // Sons take residuary remainder
    if (heirs.son) {
      const sonCount = heirs.son.count || 1;
      result.son = remaining;

      // distribute equally among sons (simplified)
      result.son_each = remaining / sonCount;
    }

    // If no son, daughters may take residuary in future expansion

    return result;
  }
}
