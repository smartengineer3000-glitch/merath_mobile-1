/**
 * Phase 2 - Hijab Rules Engine
 * ----------------------------
 * Implements blocking rules (حجب) in inheritance:
 * - Full exclusion (hijab deprivation)
 * - Partial blocking logic (to be expanded)
 */

export interface HeirNode {
  name: string;
  relation: string;
  count?: number;
}

export interface HijabContext {
  heirs: Record<string, HeirNode>;
}

/**
 * Basic hijab rules scaffold
 * (Full jurisprudential rules will be expanded in Phase 2.1)
 */
export class HijabEngine {
  apply(ctx: HijabContext): HijabContext {
    const heirs = { ...ctx.heirs };

    // RULE: Son blocks grandsons (simplified scaffold)
    if (heirs["son"] && heirs["grandson"]) {
      delete heirs["grandson"];
    }

    // RULE: Daughter does NOT block others (placeholder rule)

    // RULE: Father blocks siblings (simplified placeholder)
    if (heirs["father"] && heirs["brother"]) {
      delete heirs["brother"];
      delete heirs["sister"];
    }

    return { heirs };
  }
}
