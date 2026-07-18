import { HeirType } from "../lib/inheritance/types";

export type HeirGroup =
  | "spouses"
  | "descendants"
  | "ascendants"
  | "siblings"
  | "extended"
  | "blood_relatives";

export interface HeirConfig {
  key: HeirType;
  icon: string;
  color: string;
  gender: "male" | "female";
  group: HeirGroup;
  labelKey: string;
  maxCount: number;
}

export const HEIR_GROUPS: Record<
  HeirGroup,
  { icon: string; labelKey: string }
> = {
  spouses: { icon: "heart", labelKey: "heirs.group.spouses" },
  descendants: { icon: "account-group", labelKey: "heirs.group.descendants" },
  ascendants: {
    icon: "account-multiple-plus",
    labelKey: "heirs.group.ascendants",
  },
  siblings: { icon: "account-multiple", labelKey: "heirs.group.siblings" },
  extended: { icon: "account-network", labelKey: "heirs.group.nephews" },
  blood_relatives: {
    icon: "account-heart",
    labelKey: "heirs.group.bloodRelatives",
  },
};

export const HEIRS: HeirConfig[] = [
  {
    key: "husband",
    icon: "account",
    color: "#4f9eff",
    gender: "male",
    group: "spouses",
    labelKey: "heirs.husband",
    maxCount: 1,
  },
  {
    key: "wife",
    icon: "account",
    color: "#e91e8a",
    gender: "female",
    group: "spouses",
    labelKey: "heirs.wife",
    maxCount: 4,
  },
  {
    key: "son",
    icon: "baby-face",
    color: "#4CAF50",
    gender: "male",
    group: "descendants",
    labelKey: "heirs.son",
    maxCount: 20,
  },
  {
    key: "daughter",
    icon: "baby-face",
    color: "#e91e63",
    gender: "female",
    group: "descendants",
    labelKey: "heirs.daughter",
    maxCount: 20,
  },
  {
    key: "grandson",
    icon: "baby-face-outline",
    color: "#66BB6A",
    gender: "male",
    group: "descendants",
    labelKey: "heirs.grandson",
    maxCount: 20,
  },
  {
    key: "granddaughter",
    icon: "baby-face-outline",
    color: "#f06292",
    gender: "female",
    group: "descendants",
    labelKey: "heirs.granddaughter",
    maxCount: 20,
  },
  {
    key: "father",
    icon: "account",
    color: "#2196F3",
    gender: "male",
    group: "ascendants",
    labelKey: "heirs.father",
    maxCount: 1,
  },
  {
    key: "mother",
    icon: "account",
    color: "#9C27B0",
    gender: "female",
    group: "ascendants",
    labelKey: "heirs.mother",
    maxCount: 1,
  },
  {
    key: "grandfather",
    icon: "account",
    color: "#1565C0",
    gender: "male",
    group: "ascendants",
    labelKey: "heirs.grandfather",
    maxCount: 1,
  },
  {
    key: "grandmother_mother",
    icon: "account",
    color: "#7B1FA2",
    gender: "female",
    group: "ascendants",
    labelKey: "heirs.grandmotherMother",
    maxCount: 1,
  },
  {
    key: "grandmother_father",
    icon: "account",
    color: "#6A1B9A",
    gender: "female",
    group: "ascendants",
    labelKey: "heirs.grandmotherFather",
    maxCount: 1,
  },
  {
    key: "full_brother",
    icon: "account-multiple",
    color: "#00897B",
    gender: "male",
    group: "siblings",
    labelKey: "heirs.brother",
    maxCount: 20,
  },
  {
    key: "full_sister",
    icon: "account-multiple",
    color: "#F44336",
    gender: "female",
    group: "siblings",
    labelKey: "heirs.sister",
    maxCount: 20,
  },
  {
    key: "paternal_brother",
    icon: "account-multiple",
    color: "#26A69A",
    gender: "male",
    group: "siblings",
    labelKey: "heirs.paternalBrother",
    maxCount: 20,
  },
  {
    key: "paternal_sister",
    icon: "account-multiple",
    color: "#EF5350",
    gender: "female",
    group: "siblings",
    labelKey: "heirs.paternalSister",
    maxCount: 20,
  },
  {
    key: "maternal_brother",
    icon: "account-multiple",
    color: "#4DB6AC",
    gender: "male",
    group: "siblings",
    labelKey: "heirs.maternalBrother",
    maxCount: 20,
  },
  {
    key: "maternal_sister",
    icon: "account-multiple",
    color: "#E57373",
    gender: "female",
    group: "siblings",
    labelKey: "heirs.maternalSister",
    maxCount: 20,
  },
  {
    key: "full_nephew",
    icon: "account-child",
    color: "#FFA726",
    gender: "male",
    group: "extended",
    labelKey: "heirs.nephew",
    maxCount: 20,
  },
  {
    key: "paternal_nephew",
    icon: "account-child",
    color: "#FB8C00",
    gender: "male",
    group: "extended",
    labelKey: "heirs.paternalNephew",
    maxCount: 20,
  },
  {
    key: "full_uncle",
    icon: "account-tie",
    color: "#AB47BC",
    gender: "male",
    group: "extended",
    labelKey: "heirs.uncle",
    maxCount: 20,
  },
  {
    key: "paternal_uncle",
    icon: "account-tie",
    color: "#8E24AA",
    gender: "male",
    group: "extended",
    labelKey: "heirs.paternalUncle",
    maxCount: 20,
  },
  {
    key: "full_cousin",
    icon: "account-group",
    color: "#5C6BC0",
    gender: "male",
    group: "extended",
    labelKey: "heirs.cousin",
    maxCount: 20,
  },
  {
    key: "paternal_cousin",
    icon: "account-group",
    color: "#3949AB",
    gender: "male",
    group: "extended",
    labelKey: "heirs.paternalCousin",
    maxCount: 20,
  },
  {
    key: "daughter_son",
    icon: "baby-face-outline",
    color: "#FF7043",
    gender: "male",
    group: "blood_relatives",
    labelKey: "heirs.daughterSon",
    maxCount: 20,
  },
  {
    key: "daughter_daughter",
    icon: "baby-face-outline",
    color: "#EC407A",
    gender: "female",
    group: "blood_relatives",
    labelKey: "heirs.daughterDaughter",
    maxCount: 20,
  },
  {
    key: "maternal_uncle",
    icon: "account-tie",
    color: "#26A69A",
    gender: "male",
    group: "blood_relatives",
    labelKey: "heirs.maternalUncle",
    maxCount: 20,
  },
  {
    key: "maternal_aunt",
    icon: "account",
    color: "#EF5350",
    gender: "female",
    group: "blood_relatives",
    labelKey: "heirs.maternalAunt",
    maxCount: 20,
  },
  {
    key: "paternal_aunt",
    icon: "account",
    color: "#8E24AA",
    gender: "female",
    group: "blood_relatives",
    labelKey: "heirs.paternalAunt",
    maxCount: 20,
  },
  {
    key: "sister_children",
    icon: "account-child",
    color: "#66BB6A",
    gender: "male",
    group: "blood_relatives",
    labelKey: "heirs.sisterChildren",
    maxCount: 20,
  },
];

export function getHeirByType(key: string): HeirConfig | undefined {
  return HEIRS.find((h) => h.key === key);
}

export function getHeirsByGroup(group: HeirGroup): HeirConfig[] {
  return HEIRS.filter((h) => h.group === group);
}
