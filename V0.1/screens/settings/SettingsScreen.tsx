import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../lib/context/SettingsContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { Card, AppSwitch, Divider, Badge, Button } from "../../components/ui";
import { Ionicons } from "../../lib/icons";
import { languages, type Language } from "../../lib/i18n";

export default function SettingsScreen() {
  const { theme, toggleTheme, mode } = useAppTheme();
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const { state, setLanguage, setNotifications, setAutoSave, resetSettings } = useSettings();

  const currentLang = languages[state.language as Language];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <AnimatedHeader title={t("settings.title")} subtitle={t("settings.subtitle")} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance */}
        <Text style={[styles.groupLabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
          {t("settings.appearance").toUpperCase()}
        </Text>
        <Card variant="elevated" style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={toggleTheme} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={20} color={theme.colors.primary.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.theme")}
                </Text>
                <Text style={[styles.rowSublabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
                  {mode === "dark" ? t("settings.darkMode") : t("settings.lightMode")}
                </Text>
              </View>
            </View>
            <Badge label={mode === "dark" ? "Dark" : "Light"} color={theme.colors.primary.main} size="sm" />
          </TouchableOpacity>

          <Divider />

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("LanguagePicker")} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="language" size={20} color={theme.colors.secondary.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.language")}
                </Text>
                <Text style={[styles.rowSublabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
                  {currentLang?.nativeName || state.language}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.neutral.light400} />
          </TouchableOpacity>
        </Card>

        {/* Calculation Preferences */}
        <Text style={[styles.groupLabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
          {t("settings.calculationPreferences").toUpperCase()}
        </Text>
        <Card variant="elevated" style={styles.card}>
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="school" size={20} color={theme.colors.tertiary.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.defaultMadhab")}
                </Text>
                <Text style={[styles.rowSublabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
                  {state.language}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.neutral.light400} />
          </TouchableOpacity>

          <Divider />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="options" size={20} color={theme.colors.primary.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.precision")}
                </Text>
                <Text style={[styles.rowSublabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
                  {state.roundingDecimals} decimal places
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Data Management */}
        <Text style={[styles.groupLabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
          {t("settings.dataManagement").toUpperCase()}
        </Text>
        <Card variant="elevated" style={styles.card}>
          <AppSwitch
            label={t("settings.autoSave")}
            value={state.autoSave}
            onValueChange={setAutoSave}
          />
          <Divider />
          <AppSwitch
            label={t("settings.enableNotifications")}
            value={state.notifications}
            onValueChange={setNotifications}
          />
          <Divider />
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="download" size={20} color={theme.colors.success.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.exportData")}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.neutral.light400} />
          </TouchableOpacity>
          <Divider />
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="trash" size={20} color={theme.colors.error.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.error.main, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.clearAllData")}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.neutral.light400} />
          </TouchableOpacity>
        </Card>

        {/* About */}
        <Text style={[styles.groupLabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
          {t("settings.about").toUpperCase()}
        </Text>
        <Card variant="elevated" style={styles.card}>
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("About")} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <Ionicons name="information-circle" size={20} color={theme.colors.secondary.main} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: theme.colors.neutral.dark200, fontFamily: theme.fontFamily.english }]}>
                  {t("settings.about")}
                </Text>
                <Text style={[styles.rowSublabel, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
                  v1.1.3
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.neutral.light400} />
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  groupLabel: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5, marginBottom: 8, marginTop: 8 },
  card: { marginBottom: 8 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 12 },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 14, fontWeight: "500" },
  rowSublabel: { fontSize: 11, marginTop: 2 },
});
