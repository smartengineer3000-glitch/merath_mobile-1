import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, SectionHeader, Chip, StepperCounter, Button, Divider, EmptyState } from "../../components/ui";
import { HEIR_GROUPS, getHeirsByGroup } from "../../constants/heirData";

export default function CalculatorScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <AnimatedHeader
        title={t("calculator.title")}
        subtitle={t("calculator.subtitle")}
        rightIcon="moon-outline"
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="elevated" style={styles.card}>
          <SectionHeader title={t("estate.title")} />
          <Text style={[styles.placeholder, { color: theme.colors.neutral.light400 }]}>
            Estate input fields will appear here
          </Text>
        </Card>

        <Card variant="elevated" style={styles.card}>
          <SectionHeader title={t("heirs.title")} />
          <EmptyState
            icon="+"
            title="Add your first heir"
            message="Select heirs from the categories below to begin calculating"
          />
        </Card>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.colors.background.light }]}>
        <Button
          title={t("calculator.calculate")}
          onPress={() => {}}
          variant="primary"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: { marginBottom: 16 },
  placeholder: { fontSize: 13, textAlign: "center", paddingVertical: 20 },
  bottomBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    ...({ shadowColor: "#000", shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 4 } as any),
  },
});
