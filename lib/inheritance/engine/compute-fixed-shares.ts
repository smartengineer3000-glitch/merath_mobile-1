import { FractionClass } from "../fraction";
import { FIQH_DATABASE } from "../constants";
import type { HeirsData, MadhhabType } from "../types";
import type { HeirShareObject } from "./types";

interface FixedSharesDeps {
  madhab: MadhhabType;
  hasDescendants: boolean;
  isUmariyyah: boolean;
  getSiblingsCount: (heirs: HeirsData) => number;
}

export function computeFixedShares(
  heirs: HeirsData,
  deps: FixedSharesDeps,
): HeirShareObject[] {
  const shares: HeirShareObject[] = [];
  const { hasDescendants, isUmariyyah } = deps;

  if (heirs.husband && heirs.husband > 0) {
    const fraction = hasDescendants
      ? new FractionClass(1, 4)
      : new FractionClass(1, 2);
    shares.push({
      key: "husband",
      name: "الزوج",
      type: "فرض",
      fraction,
      count: 1,
      reason: hasDescendants ? "¼ مع وجود الفرع الوارث" : "½ بدون فرع وارث",
    });
  }

  if (heirs.wife && heirs.wife > 0) {
    const fraction = hasDescendants
      ? new FractionClass(1, 8)
      : new FractionClass(1, 4);
    shares.push({
      key: "wife",
      name: heirs.wife > 1 ? "الزوجات" : "الزوجة",
      type: "فرض",
      fraction,
      count: heirs.wife || 0,
      reason: hasDescendants ? "⅛ مع الفرع الوارث" : "¼ بدون فرع",
    });
  }

  if (heirs.mother && heirs.mother > 0) {
    let fraction: FractionClass;
    let reason: string;

    if (isUmariyyah) {
      const umariyyahRule =
        FIQH_DATABASE.specialCases.umariyyah[
          deps.madhab as keyof typeof FIQH_DATABASE.specialCases.umariyyah
        ];
      if (umariyyahRule === "sixth" || (heirs.husband || 0) > 0) {
        fraction = new FractionClass(1, 6);
      } else {
        fraction = new FractionClass(1, 4);
      }
      reason = "ثلث الباقي (العمرية)";
    } else if (hasDescendants) {
      fraction = new FractionClass(1, 6);
      reason = "⅙ مع وجود فرع";
    } else if (deps.getSiblingsCount(heirs) >= 2) {
      fraction = new FractionClass(1, 6);
      reason = "⅙ مع جمع إخوة";
    } else {
      fraction = new FractionClass(1, 3);
      reason = "⅓ بدون فرع أو إخوة";
    }

    shares.push({
      key: "mother",
      name: "الأم",
      type: "فرض",
      fraction,
      count: 1,
      reason,
    });
  }

  if (heirs.father && heirs.father > 0 && hasDescendants && !isUmariyyah) {
    shares.push({
      key: "father",
      name: "الأب",
      type: "فرض",
      fraction: new FractionClass(1, 6),
      count: 1,
      reason: "⅙ مع وجود فرع وارث (Quran 4:11)",
    });
  }

  if (!heirs.mother || heirs.mother === 0) {
    const hasPaternalGM = (heirs.grandmother_father || 0) > 0;
    const hasMaternalGM = (heirs.grandmother_mother || 0) > 0;
    const hasGenericGM = (heirs.grandmother || 0) > 0;

    if (hasPaternalGM && hasMaternalGM) {
      shares.push({
        key: "grandmother_father",
        name: "الجدة لأب",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙ الجدة لأب (أولوية على الجدة لأم)",
      });
    } else if (hasPaternalGM) {
      shares.push({
        key: "grandmother_father",
        name: "الجدة لأب",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙ الجدة لأب (عند غياب الأم)",
      });
    } else if (hasMaternalGM) {
      shares.push({
        key: "grandmother_mother",
        name: "الجدة لأم",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙ الجدة لأم (عند غياب الأم)",
      });
    } else if (hasGenericGM) {
      shares.push({
        key: "grandmother",
        name: "الجدة",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: 1,
        reason: "⅙ الجدة (عند غياب الأم)",
      });
    }
  }

  if (heirs.daughter && heirs.daughter > 0 && (!heirs.son || heirs.son === 0)) {
    const fraction =
      heirs.daughter === 1 ? new FractionClass(1, 2) : new FractionClass(2, 3);
    shares.push({
      key: "daughter",
      name: heirs.daughter > 1 ? "البنات" : "البنت",
      type: "فرض",
      fraction,
      count: heirs.daughter || 0,
      reason: heirs.daughter === 1 ? "½" : "⅔",
    });
  }

  if (
    heirs.granddaughter &&
    heirs.granddaughter > 0 &&
    (!heirs.grandson || heirs.grandson === 0) &&
    (!heirs.son || heirs.son === 0)
  ) {
    if (heirs.daughter === 0) {
      const fraction =
        heirs.granddaughter === 1
          ? new FractionClass(1, 2)
          : new FractionClass(2, 3);
      shares.push({
        key: "granddaughter",
        name: heirs.granddaughter > 1 ? "بنات الابن" : "بنت الابن",
        type: "فرض",
        fraction,
        count: heirs.granddaughter || 0,
        reason: heirs.granddaughter === 1 ? "½" : "⅔",
      });
    } else if (heirs.daughter === 1) {
      shares.push({
        key: "granddaughter",
        name: heirs.granddaughter > 1 ? "بنات الابن" : "بنت الابن",
        type: "فرض",
        fraction: new FractionClass(1, 6),
        count: heirs.granddaughter || 0,
        reason: "⅙ تكملة للثلثين",
      });
    }
  }

  if (
    (heirs.full_sister || 0) > 0 &&
    (!heirs.full_brother || heirs.full_brother === 0)
  ) {
    if (!hasDescendants && !heirs.father && !heirs.grandfather) {
      const fraction =
        heirs.full_sister === 1
          ? new FractionClass(1, 2)
          : new FractionClass(2, 3);
      shares.push({
        key: "full_sister",
        name:
          (heirs.full_sister || 0) > 1 ? "الأخوات الشقيقات" : "الأخت الشقيقة",
        type: "فرض",
        fraction,
        count: heirs.full_sister || 0,
        reason: heirs.full_sister === 1 ? "½" : "⅔",
      });
    }
  }

  if (
    (heirs.half_sister_paternal || 0) > 0 &&
    (!heirs.full_brother || heirs.full_brother === 0) &&
    (!heirs.half_brother_paternal || heirs.half_brother_paternal === 0)
  ) {
    if (
      !hasDescendants &&
      !heirs.father &&
      !heirs.grandfather &&
      !heirs.full_sister
    ) {
      const fraction =
        heirs.half_sister_paternal === 1
          ? new FractionClass(1, 2)
          : new FractionClass(2, 3);
      shares.push({
        key: "half_sister_paternal",
        name:
          (heirs.half_sister_paternal || 0) > 1 ? "الأخوات لأب" : "الأخت لأب",
        type: "فرض",
        fraction,
        count: heirs.half_sister_paternal || 0,
        reason: heirs.half_sister_paternal === 1 ? "½" : "⅔",
      });
    }
  }

  const maternalCount =
    (heirs.maternal_brother || 0) + (heirs.maternal_sister || 0);
  if (
    maternalCount > 0 &&
    !hasDescendants &&
    !heirs.father &&
    !heirs.grandfather
  ) {
    const fraction =
      maternalCount === 1 ? new FractionClass(1, 6) : new FractionClass(1, 3);
    shares.push({
      key: "maternal_siblings",
      name: "الإخوة لأم",
      type: "فرض",
      fraction: fraction,
      count: maternalCount,
      reason: maternalCount === 1 ? "⅙" : "⅓",
    });
  }

  return shares;
}
