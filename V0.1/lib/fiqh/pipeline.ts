/**
 * Phase 2 - Full Fiqh Pipeline
 * ----------------------------
 * Orchestrates all inheritance rule engines:
 * Hijab → Fixed Shares → Asaba → Awl/Radd → Invariant Check
 */

import { HijabEngine } from "./hijab";
import { FixedSharesEngine } from "./fixed-shares";
import { AsabaEngine } from "./asaba";
import { AwlRaddEngine } from "./awl-radd";
import { InvariantEngine } from "../invariant";

export class FiqhPipeline {
  private hijab = new HijabEngine();
  private fixed = new FixedSharesEngine();
  private asaba = new AsabaEngine();
  private balance = new AwlRaddEngine();

  execute(input: any) {
    // Step 1: Hijab
    const hijabed = this.hijab.apply({ heirs: input.heirs });

    // Step 2: Fixed shares
    const fixed = this.fixed.compute(hijabed.heirs);

    // Step 3: Asaba
    const withAsaba = this.asaba.distribute(input.estate, fixed, input.heirs);

    // Step 4: Awl/Radd balancing
    const balanced = this.balance.apply(withAsaba);

    // Step 5: Invariant check
    const allocations: any = {};
    for (const k in balanced) {
      allocations[k] = {
        toDecimal: () => balanced[k],
      };
    }

    InvariantEngine.assertConservation(allocations);

    return {
      allocations: balanced,
      status: "success",
    };
  }
}
