import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Chip } from "../ui";

interface QuickAddChipsProps {
  onSelect: (heirs: Record<string, number>) => void;
}

const QUICK_SCENARIOS: { label: string; data: Record<string, number> }[] = [
  { label: "Wife + 2 Daughters", data: { wife: 1, daughter: 2 } },
  {
    label: "Husband + Son + Daughter",
    data: { husband: 1, son: 1, daughter: 1 },
  },
  { label: "Parents + Wife", data: { father: 1, mother: 1, wife: 1 } },
  {
    label: "Wife + Parents + Brother",
    data: { wife: 1, father: 1, mother: 1, full_brother: 1 },
  },
  { label: "2 Sons + Wife", data: { son: 2, wife: 1 } },
  { label: "Daughter + Grandfather", data: { daughter: 1, grandfather: 1 } },
];

export function QuickAddChips({ onSelect }: QuickAddChipsProps) {
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
