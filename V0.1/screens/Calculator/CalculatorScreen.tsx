/**
 * @file screens/Calculator/CalculatorScreen.tsx
 * @description Main calculator screen for starting new calculations
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";

export function CalculatorScreen({ navigation }: any) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.icon}>🧮</Text>
          <Text style={[styles.title, { color: theme.colors.primary.main }]}>
            {t("calculator.title")}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.neutral.dark200 }]}>
            {t("calculator.subtitle")}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.colors.primary.main }]}
          onPress={() => navigation.navigate("EstateForm")}
          accessibilityLabel={t("calculator.newCalculation")}
          accessibilityRole="button"
          accessibilityHint="بدء حساب تركة جديد"
        >
          <Text style={[styles.buttonText, { color: theme.colors.background.light }]}>
            {t("calculator.newCalculation")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: theme.colors.primary.main }]}
          onPress={() => navigation.navigate("Results")}
          accessibilityLabel={t("calculator.viewLastResult")}
          accessibilityRole="button"
          accessibilityHint="عرض آخر نتيجة حسابية"
        >
          <Text style={[styles.secondaryButtonText, { color: theme.colors.primary.main }]}>
            {t("calculator.viewLastResult")}
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.neutral.dark300 }]}>
            {t("calculator.recentCalculations")}
          </Text>
          <View style={[styles.emptyState, { backgroundColor: theme.colors.neutral.light50 }]}>
            <Text style={[styles.emptyText, { color: theme.colors.neutral.light400 }]}>
              {t("calculator.noRecentCalculations")}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  hero: {
    alignItems: "center",
    marginVertical: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    marginBottom: 32,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
});
