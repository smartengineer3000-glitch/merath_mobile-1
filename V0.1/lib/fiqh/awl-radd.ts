/**
 * Phase 2 - Awl & Radd System
 * ---------------------------
 * Handles estate imbalance corrections:
 * - Awl: proportional reduction when shares exceed estate
 * - Radd: redistribution when surplus remains
 */

import { ShareResult } from "./fixed-shares";

export class AwlRaddEngine {
  apply(shares: ShareResult): ShareResult {
    let total = Object.values(shares).reduce((a, b) => a + b, 0);

    const result: ShareResult = { ...shares };

    // AWL (over-allocation correction)
    if (total > 1) {
      const factor = 1 / total;
      for (const k in result) {
        result[k] = result[k] * factor;
      }
    }

    // RADD (surplus redistribution)
    total = Object.values(result).reduce((a, b) => a + b, 0);

    if (total < 1) {
      const remainder = 1 - total;

      // simple radd to daughters (placeholder rule)
      if (result.daughter !== undefined) {
        result.daughter += remainder;
      }
    }

    return result;
  }
}
