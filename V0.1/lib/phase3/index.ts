/**
 * PHASE 3A / 3B / 3C - Unified Upgrade Layer
 * ------------------------------------------
 * 3A: Fiqh Knowledge Expansion Layer (advanced rule tables)
 * 3B: Explanation / Auditability Engine
 * 3C: Production API Skeleton
 */

// =========================
// 3A - Knowledge Layer
// =========================

export interface FiqhRule {
  id: string;
  description: string;
  appliesTo: string[];
  madhhabVariations?: Record<string, string>;
}

export class FiqhKnowledgeBase {
  private rules: FiqhRule[] = [
    {
      id: "R001",
      description: "Fixed shares based on Qur'anic inheritance",
      appliesTo: ["fixed_shares"],
    },
    {
      id: "R002",
      description: "Residuary inheritance (Asaba)",
      appliesTo: ["asaba"],
    },
    {
      id: "R003",
      description: "Blocking rules (Hijab)",
      appliesTo: ["hijab"],
    },
  ];

  getRules() {
    return this.rules;
  }
}

// =========================
// 3B - Explanation Engine
// =========================

export class ExplanationEngine {
  explain(result: any) {
    const steps = result?.steps || [];

    return steps.map((step: string, i: number) => ({
      step: i + 1,
      action: step,
      explanation: this.getExplanation(step),
    }));
  }

  private getExplanation(step: string): string {
    const map: Record<string, string> = {
      hijab: "Some heirs were excluded based on blocking rules.",
      fixed_shares: "Qur'anic fixed shares were applied.",
      asaba: "Remaining estate distributed to residuary heirs.",
      awl: "Estate was reduced proportionally due to oversubscription.",
      finalize: "Final allocation computed.",
    };

    return map[step] || "Step executed in inheritance pipeline.";
  }
}

// =========================
// 3C - API Skeleton
// =========================

export interface InheritanceRequest {
  estate: number;
  madhhab: string;
  heirs: Record<string, any>;
}

export interface InheritanceResponse {
  allocations: any;
  explanation: any;
  status: string;
}

export class InheritanceAPI {
  private pipeline: any;
  private explainer = new ExplanationEngine();

  constructor(pipeline: any) {
    this.pipeline = pipeline;
  }

  calculate(req: InheritanceRequest): InheritanceResponse {
    const result = this.pipeline.execute(req);

    return {
      allocations: result.allocations,
      explanation: this.explainer.explain(result),
      status: result.status,
    };
  }
}
