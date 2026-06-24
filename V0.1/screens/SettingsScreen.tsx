import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import { PressableScale } from "../components/ui/PressableScale";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { useSettings } from "../lib/context/SettingsContext";
import { Card } from "../components/ui/Card";
import { db } from "../lib/database/db";
import type { Theme } from "../lib/design/theme";
import type { SettingsState } from "../lib/context/SettingsContext";
import type { Language } from "../lib/i18n";

const BACKUP_KEYS = {
  SETTINGS: "@merath_settings_v2",
  FAVORITES: "@merath_favorites",
  ONBOARDING: "@merath_onboarding",
};

interface BackupData {
  version: string;
  timestamp: string;
  appVersion: string;
  data: {
    settings: SettingsState | null;
    favorites: unknown[];
    onboardingCompleted: string | null;
    auditLogCount: number;
  };
}

const languages: Record<
  string,
  { name: string; nativeName: string; rtl: boolean }
> = {
  en: { name: "English", nativeName: "English", rtl: false },
  ar: { name: "Arabic", nativeName: "العربية", rtl: true },
  ur: { name: "Urdu", nativeName: "اردو", rtl: true },
  tr: { name: "Turkish", nativeName: "Türkçe", rtl: false },
  fr: { name: "French", nativeName: "Français", rtl: false },
  de: { name: "German", nativeName: "Deutsch", rtl: false },
};

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, isDark } = useAppTheme();
  const {
    state,
    setLanguage,
    setNotifications,
    setRoundingDecimals,
    setAutoSave,
  } = useSettings();

  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      setLanguage(lang as Language);
      i18n.changeLanguage(lang);
    },
    [setLanguage, i18n],
  );

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  const handleClearData = useCallback(() => {
    Alert.alert(
      t("settings.clearAllData") || "Clear All Data",
      t("settings.clearAllDataConfirm") ||
        "This will remove all calculations and settings. Are you sure?",
      [
        { text: t("common.cancel") || "Cancel", style: "cancel" },
        {
          text: t("common.clear") || "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.multiRemove(Object.values(BACKUP_KEYS));
              if (db && db.auditLogs) {
                await db.auditLogs.clear();
              }
              Alert.alert(
                t("common.success") || "Success",
                t("settings.dataCleared") || "All data cleared",
              );
            } catch (error) {
              Alert.alert(t("common.error") || "Error", "Failed to clear data");
            }
          },
        },
      ],
    );
  }, [t]);

  const handleExportData = useCallback(async () => {
    try {
      setIsBackingUp(true);

      const settingsJson = await AsyncStorage.getItem(BACKUP_KEYS.SETTINGS);
      const favoritesJson = await AsyncStorage.getItem(BACKUP_KEYS.FAVORITES);

      let auditLogCount = 0;
      if (db && db.auditLogs) {
        auditLogCount = await db.auditLogs.count();
      }

      const backupData: BackupData = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        appVersion: Constants.expoConfig?.version ?? "1.1.3",
        data: {
          settings: settingsJson ? JSON.parse(settingsJson) : null,
          favorites: favoritesJson ? JSON.parse(favoritesJson) : [],
          onboardingCompleted: await AsyncStorage.getItem(
            BACKUP_KEYS.ONBOARDING,
          ),
          auditLogCount,
        },
      };

      const backupJson = JSON.stringify(backupData, null, 2);
      const fileName = `merath-backup-${new Date().toISOString().split("T")[0]}.json`;
      const fileDir = FileSystem.documentDirectory;
      if (!fileDir) {
        throw new Error("Cannot access file system");
      }
      const fileUri = fileDir + fileName;

      await FileSystem.writeAsStringAsync(fileUri, backupJson, {
        encoding: "utf8",
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Backup",
        });
      } else {
        await Share.share({ message: backupJson, title: "Merath Backup" });
      }

      Alert.alert(
        t("common.success") || "Success",
        t("settings.dataExported") || "Data exported successfully",
      );
    } catch (error) {
      Alert.alert(t("common.error") || "Error", "Export failed");
    } finally {
      setIsBackingUp(false);
    }
  }, [t]);

  const handleExitApp = useCallback(() => {
    Alert.alert("Exit App", "Are you sure you want to exit?", [
      { text: t("common.cancel") || "Cancel", style: "cancel" },
      {
        text: "Yes, Exit",
        style: "destructive",
        onPress: () => BackHandler.exitApp(),
      },
    ]);
  }, [t]);

  const appVersion = Constants.expoConfig?.version ?? "1.1.3";
  const styles = createStyles(theme);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("settings.title") || "Settings"}</Text>
        <Text style={styles.subtitle}>
          {t("settings.subtitle") || "Customize your app experience"}
        </Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("settings.language") || "Language"}
        </Text>
        <Text style={styles.cardSubtitle}>
          {t("settings.languageSubtitle") || "Choose your preferred language"}
        </Text>
        <View
          style={styles.languageGrid}
          accessibilityRole="radiogroup"
          accessibilityLabel="Language selection"
        >
          {Object.entries(languages).map(([code, info]) => (
            <PressableScale
              key={code}
              style={[
                styles.languageCard,
                state.language === code && styles.languageCardActive,
              ]}
              onPress={() => handleLanguageChange(code)}
              haptic="light"
              scaleTo={0.97}
              accessibilityRole="radio"
              accessibilityLabel={`${info.name} language`}
              accessibilityState={{ selected: state.language === code }}
            >
              <Text
                style={[
                  styles.languageText,
                  state.language === code && styles.languageTextActive,
                ]}
              >
                {info.nativeName}
              </Text>
              <Text style={styles.languageSubtext}>{info.name}</Text>
            </PressableScale>
          ))}
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("settings.appearance") || "Appearance"}
        </Text>
        <Text style={styles.cardSubtitle}>
          {t("settings.appearanceSubtitle") || "Customize the app appearance"}
        </Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            {t("settings.darkMode") || "Dark Mode"}
          </Text>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{
              false: theme.colors.neutral.light300,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.light}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("settings.calculationPreferences") || "Calculation Preferences"}
        </Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            {t("settings.roundingDecimals") || "Rounding Decimals"}
          </Text>
          <View style={styles.decimalControl}>
            <PressableScale
              style={styles.decimalButton}
              onPress={() =>
                setRoundingDecimals(Math.max(0, state.roundingDecimals - 1))
              }
              haptic="light"
              scaleTo={0.92}
            >
              <Text style={styles.decimalButtonText}>-</Text>
            </PressableScale>
            <Text style={styles.decimalValue}>{state.roundingDecimals}</Text>
            <PressableScale
              style={styles.decimalButton}
              onPress={() =>
                setRoundingDecimals(Math.min(6, state.roundingDecimals + 1))
              }
              haptic="light"
              scaleTo={0.92}
            >
              <Text style={styles.decimalButtonText}>+</Text>
            </PressableScale>
          </View>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            {t("settings.notifications") || "Notifications"}
          </Text>
          <Switch
            value={state.notifications}
            onValueChange={setNotifications}
            trackColor={{
              false: theme.colors.neutral.light300,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.light}
          />
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>
            {t("settings.autoSave") || "Auto Save"}
          </Text>
          <Switch
            value={state.autoSave}
            onValueChange={setAutoSave}
            trackColor={{
              false: theme.colors.neutral.light300,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.light}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>
          {t("settings.dataManagement") || "Data Management"}
        </Text>
        <PressableScale
          style={styles.actionButton}
          onPress={handleExportData}
          disabled={isBackingUp}
          haptic="light"
          scaleTo={0.97}
        >
          <MaterialCommunityIcons
            name="download"
            size={24}
            color={theme.colors.primary.main}
          />
          <Text style={styles.actionButtonText}>
            {isBackingUp
              ? t("common.loading") || "Exporting..."
              : t("settings.exportData") || "Export Data"}
          </Text>
        </PressableScale>
        <PressableScale
          style={styles.actionButton}
          onPress={handleClearData}
          haptic="medium"
          scaleTo={0.97}
        >
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={theme.colors.error.main}
          />
          <Text style={[styles.actionButtonText, styles.dangerText]}>
            {t("settings.clearAllData") || "Clear All Data"}
          </Text>
        </PressableScale>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Test Configuration</Text>
        <View style={styles.settingRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons
              name="flask"
              size={20}
              color={theme.colors.neutral.main}
            />
            <Text style={styles.settingLabel}>Auto-run tests on start</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => undefined}
            trackColor={{
              false: theme.colors.neutral.light300,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.light}
          />
        </View>
        <View style={styles.settingRow}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons
              name="clipboard-list"
              size={20}
              color={theme.colors.neutral.main}
            />
            <Text style={styles.settingLabel}>Show test details</Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => undefined}
            trackColor={{
              false: theme.colors.neutral.light300,
              true: theme.colors.primary.main,
            }}
            thumbColor={theme.colors.background.light}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>{t("settings.about") || "About"}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {t("settings.version") || "Version"}
          </Text>
          <Text style={styles.infoValue}>{appVersion}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>
            {t("settings.developer") || "Developer"}
          </Text>
          <Text style={styles.infoValue}>Merath Team</Text>
        </View>
      </Card>

      <Card style={styles.exitCard}>
        <Text style={styles.cardTitle}>Exit App</Text>
        <Text style={styles.cardSubtitle}>
          Close Merath after confirming your choice.
        </Text>
        <PressableScale
          style={styles.exitButton}
          onPress={handleExitApp}
          haptic="medium"
          scaleTo={0.96}
        >
          <MaterialCommunityIcons
            name="exit-to-app"
            size={24}
            color={theme.colors.background.light}
          />
          <Text style={styles.exitButtonText}>Yes, Exit</Text>
        </PressableScale>
      </Card>
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
      padding: theme.spacing.lg,
    },
    header: {
      marginBottom: theme.spacing.xl,
    },
    title: {
      ...theme.typography.display.medium,
      color: theme.colors.primary.main,
    },
    subtitle: {
      ...theme.typography.body.large,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.sm,
    },
    card: {
      marginBottom: theme.spacing.lg,
    },
    cardTitle: {
      ...theme.typography.headline.large,
      color: theme.colors.neutral.dark300,
      marginBottom: theme.spacing.sm,
    },
    cardSubtitle: {
      ...theme.typography.body.medium,
      color: theme.colors.neutral.main,
      marginBottom: theme.spacing.lg,
    },
    languageGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    languageCard: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light300,
      backgroundColor: theme.colors.background.light,
      minWidth: 100,
      alignItems: "center",
    },
    languageCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.light,
    },
    languageText: {
      ...theme.typography.title.large,
      color: theme.colors.neutral.dark300,
    },
    languageTextActive: {
      color: theme.colors.primary.main,
    },
    languageSubtext: {
      ...theme.typography.body.small,
      color: theme.colors.neutral.main,
      marginTop: theme.spacing.xs,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: theme.spacing.sm,
    },
    settingLabel: {
      ...theme.typography.body.large,
      color: theme.colors.neutral.dark300,
    },
    decimalControl: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },
    decimalButton: {
      width: 44,
      height: 44,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.primary.light,
      alignItems: "center",
      justifyContent: "center",
    },
    decimalButtonText: {
      ...theme.typography.title.large,
      color: theme.colors.primary.main,
    },
    decimalValue: {
      ...theme.typography.title.large,
      color: theme.colors.neutral.dark300,
      minWidth: 20,
      textAlign: "center",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      backgroundColor: theme.colors.background.light,
      borderRadius: theme.borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light300,
    },
    actionButtonText: {
      ...theme.typography.body.large,
      color: theme.colors.neutral.dark300,
      marginLeft: theme.spacing.md,
    },
    dangerText: {
      color: theme.colors.error.main,
    },
    exitCard: {
      marginBottom: theme.spacing.xxl,
      borderColor: theme.colors.error.main,
      borderWidth: 1,
    },
    exitButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      backgroundColor: theme.colors.error.main,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.md,
    },
    exitButtonText: {
      color: theme.colors.background.light,
      ...theme.typography.title.large,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: theme.spacing.sm,
    },
    infoLabel: {
      ...theme.typography.body.large,
      color: theme.colors.neutral.main,
    },
    infoValue: {
      ...theme.typography.title.large,
      color: theme.colors.neutral.dark300,
    },
  });
