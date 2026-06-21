import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Card } from "../components/ui/Card";
import { useSettings } from "../lib/context/SettingsContext";
import type { Language } from "../lib/i18n";
import { useThemeMode } from '../lib/context/ThemeModeContext';

const languageOptions: { label: string; value: Language }[] = [
  { label: "English", value: "en" },
  { label: "Arabic", value: "ar" },
  { label: "Urdu", value: "ur" },
  { label: "Turkish", value: "tr" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
];

export default function SettingsScreen() {
  const { state, setLanguage, setNotifications, setAutoSave, resetSettings } =
    useSettings();

  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your app experience</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Language</Text>
        <Text style={styles.cardSubtitle}>Choose your preferred language</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={state.language}
            onValueChange={(value) => setLanguage(value as Language)}
            style={styles.picker}
          >
            {languageOptions.map((lang) => (
              <Picker.Item
                key={lang.value}
                label={lang.label}
                value={lang.value}
              />
            ))}
          </Picker>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Appearance</Text>
        <Text style={styles.cardSubtitle}>Customize the app appearance</Text>
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingHint}>Toggle app theme appearance</Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode((prev) => !prev)}
            trackColor={{ false: "#DDDDDD", true: "#2E7D32" }}
            thumbColor={isDarkMode ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <Text style={styles.cardSubtitle}>Control app notifications</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={state.notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#DDDDDD", true: "#2E7D32" }}
            thumbColor={state.notifications ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Storage</Text>
        <Text style={styles.cardSubtitle}>Control saving preferences</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Auto Save</Text>
          <Switch
            value={state.autoSave}
            onValueChange={setAutoSave}
            trackColor={{ false: "#DDDDDD", true: "#2E7D32" }}
            thumbColor={state.autoSave ? "#FFFFFF" : "#FFFFFF"}
          />
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Data Management</Text>
        <Text style={styles.cardSubtitle}>Clear or reset your settings</Text>
        <TouchableOpacity style={styles.actionButton} onPress={resetSettings}>
          <MaterialCommunityIcons name="restore" size={24} color="#2E7D32" />
          <Text style={styles.actionButtonText}>Reset to Default</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>About</Text>
        <Text style={styles.cardSubtitle}>App information and version</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Version</Text>
          <Text style={styles.infoValue}>1.1.3</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Developer</Text>
          <Text style={styles.infoValue}>Merath Team</Text>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 8,
    fontFamily: "Inter-Regular",
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 50,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  settingLabel: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Inter-Regular",
  },
  settingHint: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
    fontFamily: "Inter-Regular",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDDDDD",
  },
  actionButtonText: {
    fontSize: 16,
    marginLeft: 12,
    fontFamily: "Inter-Regular",
    color: "#2E7D32",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "Inter-Regular",
  },
  infoValue: {
    fontSize: 16,
    color: "#333333",
    fontFamily: "Inter-Bold",
  },
});

export const ThemeToggle = () => {
  const { themeMode, setThemeMode, isDark } = useThemeMode();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 }}>
      <Text>Dark Mode</Text>
      <Switch value={isDark} onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')} />
    </View>
  );
};
