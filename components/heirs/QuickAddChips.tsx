import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Chip } from "../ui";

interface QuickAddChipsProps {
  onSelect: (heirs: Record<string, number>) => void;
}

export function QuickAddChips({ onSelect }: QuickAddChipsProps) {
  const { t } = useTranslation();

  const QUICK_SCENARIOS: { label: string; data: Record<string, number> }[] = [
    { label: t("quickAdd.wife2Daughters"), data: { wife: 1, daughter: 2 } },
    {
      label: t("quickAdd.husbandSonDaughter"),
      data: { husband: 1, son: 1, daughter: 1 },
    },
    {
      label: t("quickAdd.parentsWife"),
      data: { father: 1, mother: 1, wife: 1 },
    },
    {
      label: t("quickAdd.wifeParentsBrother"),
      data: { wife: 1, father: 1, mother: 1, full_brother: 1 },
    },
    { label: t("quickAdd.twoSonsWife"), data: { son: 2, wife: 1 } },
    {
      label: t("quickAdd.daughterGrandfather"),
      data: { daughter: 1, grandfather: 1 },
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {QUICK_SCENARIOS.map((scenario) => (
          <Chip
            key={scenario.label}
            label={scenario.label}
            size="sm"
            onPress={() => onSelect(scenario.data)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  scroll: { paddingVertical: 2 },
});
