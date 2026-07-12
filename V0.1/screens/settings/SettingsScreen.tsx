import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, AppSwitch, Divider } from "../../components/ui";

export default function SettingsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <AnimatedHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card variant="elevated" style={styles.card}>
          <AppSwitch label="Auto Save" value={true} onValueChange={() => {}} />
          <Divider />
          <AppSwitch label="Notifications" value={true} onValueChange={() => {}} />
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: { marginBottom: 16 },
});
