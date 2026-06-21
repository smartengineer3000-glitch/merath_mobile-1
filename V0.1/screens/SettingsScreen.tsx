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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
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
            <TouchableOpacity
              key={code}
              style={[
                styles.languageCard,
                state.language === code && styles.languageCardActive,
              ]}
              onPress={() => handleLanguageChange(code)}
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
            </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.decimalButton}
              onPress={() =>
                setRoundingDecimals(Math.max(0, state.roundingDecimals - 1))
              }
            >
              <Text style={styles.decimalButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.decimalValue}>{state.roundingDecimals}</Text>
            <TouchableOpacity
              style={styles.decimalButton}
              onPress={() =>
                setRoundingDecimals(Math.min(6, state.roundingDecimals + 1))
              }
            >
              <Text style={styles.decimalButtonText}>+</Text>
            </TouchableOpacity>
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
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleExportData}
          disabled={isBackingUp}
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
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleClearData}>
          <MaterialCommunityIcons
            name="delete"
            size={24}
            color={theme.colors.error.main}
          />
          <Text style={[styles.actionButtonText, styles.dangerText]}>
            {t("settings.clearAllData") || "Clear All Data"}
          </Text>
        </TouchableOpacity>
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
    </ScrollView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.primary.main,
      fontFamily: "Inter-Bold",
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.neutral.main,
      marginTop: 8,
      fontFamily: "Inter-Regular",
    },
    card: {
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.neutral.dark300,
      marginBottom: 8,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.colors.neutral.main,
      marginBottom: 16,
    },
    languageGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    languageCard: {
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: 8,
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
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
    },
    languageTextActive: {
      color: theme.colors.primary.main,
    },
    languageSubtext: {
      fontSize: 12,
      color: theme.colors.neutral.main,
      marginTop: 2,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 8,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.colors.neutral.dark300,
      fontFamily: "Inter-Regular",
    },
    decimalControl: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    decimalButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary.light,
      alignItems: "center",
      justifyContent: "center",
    },
    decimalButtonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary.main,
    },
    decimalValue: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.neutral.dark300,
      minWidth: 20,
      textAlign: "center",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginBottom: 8,
      backgroundColor: theme.colors.background.light,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.neutral.light300,
    },
    actionButtonText: {
      fontSize: 16,
      color: theme.colors.neutral.dark300,
      marginLeft: 12,
      fontFamily: "Inter-Regular",
    },
    dangerText: {
      color: theme.colors.error.main,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    infoLabel: {
      fontSize: 16,
      color: theme.colors.neutral.main,
      fontFamily: "Inter-Regular",
    },
    infoValue: {
      fontSize: 16,
      color: theme.colors.neutral.dark300,
      fontFamily: "Inter-Bold",
    },
  });
