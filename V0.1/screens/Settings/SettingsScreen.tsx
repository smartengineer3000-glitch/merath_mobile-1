/**
 * @file screens/Settings/SettingsScreen.tsx
 * @description Settings screen for app preferences
 */

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";

export function SettingsScreen() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary.main }]}>
          {t("settings.title")}
        </Text>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.neutral.light50 }]}
          accessibilityLabel={`${t("settings.language")}: Arabic`}
          accessibilityRole="button"
          accessibilityHint="تغيير لغة التطبيق"
        >
          <Text style={[styles.settingLabel, { color: theme.colors.neutral.dark300 }]}>
            {t("settings.language")}
          </Text>
          <Text style={[styles.settingValue, { color: theme.colors.neutral.light400 }]}>
            Arabic
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.neutral.light50 }]}
          accessibilityLabel={`${t("settings.theme")}: Light`}
          accessibilityRole="button"
          accessibilityHint="تغيير مظهر التطبيق"
        >
          <Text style={[styles.settingLabel, { color: theme.colors.neutral.dark300 }]}>
            {t("settings.theme")}
          </Text>
          <Text style={[styles.settingValue, { color: theme.colors.neutral.light400 }]}>
            Light
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.colors.neutral.light50 }]}
          accessibilityLabel={`${t("settings.defaultMadhab")}: Hanafi`}
          accessibilityRole="button"
          accessibilityHint="تغيير المذهب الفقهي الافتراضي"
        >
          <Text style={[styles.settingLabel, { color: theme.colors.neutral.dark300 }]}>
            {t("settings.defaultMadhab")}
          </Text>
          <Text style={[styles.settingValue, { color: theme.colors.neutral.light400 }]}>
            Hanafi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  settingValue: {
    fontSize: 14,
  },
});
