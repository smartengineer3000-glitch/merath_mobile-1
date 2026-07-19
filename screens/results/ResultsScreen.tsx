import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, Button } from "../../components/ui";
import { useCalculationStore } from "../../lib/context/CalculationContext";
import { DistributionTab } from "./tabs/DistributionTab";
import { StepsTab } from "./tabs/StepsTab";
import { ExplanationTab } from "./tabs/ExplanationTab";
import { ExportTab } from "./tabs/ExportTab";

type TabKey = "distribution" | "steps" | "explanation" | "export";

export default function ResultsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { currentResult } = useCalculationStore();

  const result = currentResult;
  const [activeTab, setActiveTab] = useState<TabKey>("distribution");

  if (!result) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background.light },
        ]}
      >
        <AnimatedHeader
          title={t("results.title")}
          leftIcon="arrow-back"
          onLeftPress={() => navigation.goBack()}
        />
        <Card variant="elevated" style={styles.emptyCard}>
          <View style={styles.emptyContainer}>
            <Text
              style={[
                styles.emptyTitle,
                {
                  color: theme.colors.neutral.dark200,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("results.noResultsTitle")}
            </Text>
            <Text
              style={[
                styles.emptyMessage,
                {
                  color: theme.colors.neutral.light400,
                  fontFamily: theme.fontFamily.english,
                },
              ]}
            >
              {t("results.noResultsDescription")}
            </Text>
            <Button
              title={t("calculator.newCalculation")}
              onPress={() => navigation.goBack()}
              variant="primary"
            />
          </View>
        </Card>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <AnimatedHeader
        title={t("results.title")}
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      {/* Tab Bar */}
      <View
        style={[
          styles.tabBar,
          { borderBottomColor: theme.colors.neutral.light200 },
        ]}
      >
        {(["distribution", "steps", "explanation", "export"] as TabKey[]).map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && {
                  borderBottomColor: theme.colors.primary.main,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color:
                      activeTab === tab
                        ? theme.colors.primary.main
                        : theme.colors.neutral.light400,
                    fontFamily: theme.fontFamily.english,
                  },
                ]}
              >
                {t(`results.tabs.${tab}`)}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>

      {/* Tab Content */}
      {activeTab === "distribution" && <DistributionTab result={result} />}
      {activeTab === "steps" && <StepsTab result={result} />}
      {activeTab === "explanation" && <ExplanationTab result={result} />}
      {activeTab === "export" && <ExportTab result={result} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { flexDirection: "row", borderBottomWidth: 1, paddingHorizontal: 16 },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: { fontSize: 12, fontWeight: "600" },
  emptyCard: { margin: 16, flex: 1 },
  emptyContainer: { alignItems: "center", paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  emptyMessage: { fontSize: 13, textAlign: "center", marginBottom: 20 },
});
