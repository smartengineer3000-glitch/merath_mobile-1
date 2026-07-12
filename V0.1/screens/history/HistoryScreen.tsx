import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, EmptyState } from "../../components/ui";

export default function HistoryScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <AnimatedHeader title={t("history.title")} subtitle={t("history.subtitle")} />
      <Card variant="elevated" style={styles.card}>
        <EmptyState
          icon="time"
          title={t("history.noHistory")}
          message={t("history.subtitle")}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: { margin: 16, flex: 1 },
});
