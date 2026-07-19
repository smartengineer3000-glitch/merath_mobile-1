import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Card, SectionHeader } from "../../../components/ui";
import { Ionicons } from "../../../lib/icons";
import type { CalculationResult } from "../../../lib/inheritance/types";

interface ExplanationTabProps {
  result: CalculationResult;
}

export function ExplanationTab({ result }: ExplanationTabProps) {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.tabContent}
      showsVerticalScrollIndicator={false}
    >
      <Card variant="elevated">
        <SectionHeader title={t("results.fiqhExplanation")} />
        {result.madhhabNotes && result.madhhabNotes.length > 0 ? (
          result.madhhabNotes.map((note, i) => (
            <View
              key={i}
              style={[
                styles.note,
                {
                  backgroundColor: theme.colors.primary.light,
                  borderRadius: theme.borderRadius.sm,
                },
              ]}
            >
              <Text
                style={[
                  styles.noteText,
                  {
                    color: theme.colors.neutral.dark200,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {note}
              </Text>
            </View>
          ))
        ) : (
          <Text
            style={[
              styles.fallback,
              {
                color: theme.colors.neutral.light400,
                fontFamily: theme.fontFamily.english,
              },
            ]}
          >
            {t("results.fiqhExplanationFallback")}
          </Text>
        )}

        {result.warnings && result.warnings.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <SectionHeader title={t("results.warnings")} />
            {result.warnings.map((warn, i) => (
              <View
                key={i}
                style={[
                  styles.warning,
                  {
                    backgroundColor: theme.colors.warning.light,
                    borderRadius: theme.borderRadius.sm,
                  },
                ]}
              >
                <Ionicons
                  name="warning"
                  size={14}
                  color={theme.colors.warning.main}
                />
                <Text
                  style={[
                    styles.warningText,
                    {
                      color: theme.colors.warning.dark,
                      fontFamily: theme.fontFamily.english,
                    },
                  ]}
                >
                  {warn}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabContent: { padding: 16, paddingBottom: 32 },
  note: { padding: 12, marginBottom: 8 },
  noteText: { fontSize: 13, lineHeight: 20 },
  fallback: { fontSize: 13, textAlign: "center", paddingVertical: 20 },
  warning: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    marginBottom: 6,
  },
  warningText: { fontSize: 12, flex: 1, lineHeight: 18 },
});
