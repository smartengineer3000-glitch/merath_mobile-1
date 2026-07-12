import { HeirType } from "../lib/inheritance/types";

export type HeirGroup =
  | "spouses"
  | "descendants"
  | "ascendants"
  | "siblings"
  | "extended";

export interface HeirConfig {
  key: HeirType;
  icon: string;
  color: string;
  gender: "male" | "female";
  group: HeirGroup;
  labelKey: string;
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
};

export const HEIRS: HeirConfig[] = [
  {
    key: "husband",
    icon: "account",
    color: "#4f9eff",
    gender: "male",
    group: "spouses",
    labelKey: "heirs.husband",
  },
  {
    key: "wife",
    icon: "account",
    color: "#e91e8a",
    gender: "female",
    group: "spouses",
    labelKey: "heirs.wife",
  },
  {
    key: "son",
    icon: "baby-face",
    color: "#4CAF50",
    gender: "male",
    group: "descendants",
    labelKey: "heirs.son",
  },
  {
    key: "daughter",
    icon: "baby-face",
    color: "#e91e63",
    gender: "female",
    group: "descendants",
    labelKey: "heirs.daughter",
  },
  {
    key: "grandson",
    icon: "baby-face-outline",
    color: "#66BB6A",
    gender: "male",
    group: "descendants",
    labelKey: "heirs.son",
  },
  {
    key: "granddaughter",
    icon: "baby-face-outline",
    color: "#f06292",
    gender: "female",
    group: "descendants",
    labelKey: "heirs.daughter",
  },
  {
    key: "father",
    icon: "account",
    color: "#2196F3",
    gender: "male",
    group: "ascendants",
    labelKey: "heirs.father",
  },
  {
    key: "mother",
    icon: "account",
    color: "#9C27B0",
    gender: "female",
    group: "ascendants",
    labelKey: "heirs.mother",
  },
  {
    key: "grandfather",
    icon: "account",
    color: "#1565C0",
    gender: "male",
    group: "ascendants",
    labelKey: "heirs.grandfather",
  },
  {
    key: "grandmother",
    icon: "account",
    color: "#7B1FA2",
    gender: "female",
    group: "ascendants",
    labelKey: "heirs.grandmother",
  },
  {
    key: "full_brother",
    icon: "account-multiple",
    color: "#00897B",
    gender: "male",
    group: "siblings",
    labelKey: "heirs.brother",
  },
  {
    key: "full_sister",
    icon: "account-multiple",
    color: "#F44336",
    gender: "female",
    group: "siblings",
    labelKey: "heirs.sister",
  },
  {
    key: "paternal_brother",
    icon: "account-multiple",
    color: "#26A69A",
    gender: "male",
    group: "siblings",
    labelKey: "heirs.paternalBrother",
  },
  {
    key: "paternal_sister",
    icon: "account-multiple",
    color: "#EF5350",
    gender: "female",
    group: "siblings",
    labelKey: "heirs.paternalSister",
  },
  {
    key: "maternal_brother",
    icon: "account-multiple",
    color: "#4DB6AC",
    gender: "male",
    group: "siblings",
    labelKey: "heirs.maternalBrother",
  },
  {
    key: "maternal_sister",
    icon: "account-multiple",
    color: "#E57373",
    gender: "female",
    group: "siblings",
    labelKey: "heirs.maternalSister",
  },
  {
    key: "full_nephew",
    icon: "account-child",
    color: "#FFA726",
    gender: "male",
    group: "extended",
    labelKey: "heirs.nephew",
  },
  {
    key: "full_uncle",
    icon: "account-tie",
    color: "#AB47BC",
    gender: "male",
    group: "extended",
    labelKey: "heirs.uncle",
  },
  {
    key: "full_cousin",
    icon: "account-group",
    color: "#5C6BC0",
    gender: "male",
    group: "extended",
    labelKey: "heirs.cousin",
  },
];

export function getHeirByType(key: string): HeirConfig | undefined {
  return HEIRS.find((h) => h.key === key);
}

export function getHeirsByGroup(group: HeirGroup): HeirConfig[] {
  return HEIRS.filter((h) => h.group === group);
}
