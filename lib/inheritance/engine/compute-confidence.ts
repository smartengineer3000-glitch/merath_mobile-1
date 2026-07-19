import { FractionClass } from "../fraction";
import type { HeirsData, HeirShare } from "../types";
import type { EngineState } from "./types";

export function calculateConfidence(
  results: HeirShare[],
  heirs: HeirsData,
  state: EngineState,
  invariantFailed: boolean = false,
): number {
  let confidence = 100;
  const factors: string[] = [];

  const heirCount = Object.values(heirs).filter((v) => v && v > 0).length;
  if (heirCount > 8) {
    confidence -= 10;
    factors.push("عدد كبير من الورثة (أكثر من 8)");
  } else if (heirCount > 5) {
    confidence -= 5;
    factors.push("عدد متوسط من الورثة (6-8)");
  }

  const totalFraction = results.reduce(
    (sum, r) =>
      sum + (r.fraction?.numerator || 0) / (r.fraction?.denominator || 1),
    0,
  );
  const deviation = Math.abs(totalFraction - 1);
  if (deviation > 0.01) {
    confidence -= 30;
    factors.push(`انحراف في مجموع الكسور: ${deviation.toFixed(4)}`);
  }

  if (invariantFailed) {
    confidence = 0;
    factors.push("انتهاك حفظ الكتلة: مجموع الأسهم لا يساوي التركة");
  }

  const hasChildren = heirs.son || heirs.daughter;
  const hasParents = heirs.father || heirs.mother;
  const hasGrandparents =
    heirs.grandfather || heirs.grandmother_mother || heirs.grandmother_father;

  const generationCount =
    (hasChildren ? 1 : 0) + (hasParents ? 1 : 0) + (hasGrandparents ? 1 : 0);
  if (generationCount >= 3) {
    confidence -= 5;
    factors.push("وجود عدة أجيال من الورثة");
  }

  const distantHeirs = [
    "full_nephew",
    "paternal_nephew",
    "full_uncle",
    "paternal_uncle",
    "full_cousin",
    "paternal_cousin",
    "daughter_son",
    "daughter_daughter",
    "sister_children",
    "maternal_uncle",
    "maternal_aunt",
    "paternal_aunt",
  ];

  const hasDistantHeirs = distantHeirs.some(
    (key) => (heirs[key as keyof HeirsData] || 0) > 0,
  );
  if (hasDistantHeirs) {
    confidence -= 8;
    factors.push("وجود ورثة من الدرجات البعيدة");
  }

  const hasGrandfatherWithSiblings =
    heirs.grandfather && (heirs.full_brother || heirs.paternal_brother);
  if (hasGrandfatherWithSiblings) {
    confidence -= 5;
    factors.push("حالة الجد مع الإخوة (تختلف باختلاف المذهب)");
  }

  if (heirs.wife && heirs.wife > 1) {
    confidence -= 3;
    factors.push("وجود عدة زوجات");
  }

  confidence = Math.max(50, Math.min(100, confidence));

  state.confidenceFactors = [];

  if (factors.length > 0) {
    state.confidenceFactors = factors;
  } else {
    state.confidenceFactors = ["حساب بسيط - دقة عالية"];
  }

  return confidence;
}
