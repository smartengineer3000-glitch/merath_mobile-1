/**
 * @file screens/Comparison/ComparisonScreen.tsx
 * @description Comparison screen for comparing madhab results
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";

export function ComparisonScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary.main }]}>
          {t("comparison.title")}
        </Text>
        <Text style={[styles.message, { color: theme.colors.neutral.dark200 }]}>
          {t("comparison.noComparison")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
});
