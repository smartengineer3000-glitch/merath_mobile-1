import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../../components/ui";
import type { CalculationResult } from "../../../lib/inheritance/types";

interface StepsTabProps {
  result: CalculationResult;
}

export function StepsTab({ result }: StepsTabProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        <SectionHeader title={t("results.calculationSteps")} />
        {result.steps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.step,
              { borderLeftColor: theme.colors.primary.main },
            ]}
          >
            <View
              style={[
                styles.number,
                { backgroundColor: theme.colors.primary.main },
              ]}
            >
              <Text style={styles.numberText}>{index + 1}</Text>
            </View>
            <View style={styles.content}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.neutral.dark300,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {step.title}
              </Text>
              <Text
                style={[
                  styles.description,
                  {
                    color: theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: { padding: 16, paddingBottom: 32 },
  step: {
    flexDirection: "row",
    paddingVertical: 12,
    borderStartWidth: 2,
    paddingStart: 12,
    gap: 10,
  },
  number: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  numberText: { color: "#ffffff", fontSize: 11, fontWeight: "700" },
  content: { flex: 1 },
  title: { fontSize: 13, fontWeight: "600", marginBottom: 2 },
  description: { fontSize: 12, lineHeight: 18 },
});
