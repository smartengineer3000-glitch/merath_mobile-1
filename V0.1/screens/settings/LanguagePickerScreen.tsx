import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAppTheme } from "../../lib/context/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../lib/context/SettingsContext";
import { AnimatedHeader } from "../../components/layout/AnimatedHeader";
import { languages, type Language, applyRTLOfLanguage } from "../../lib/i18n";
import { Ionicons } from "../../lib/icons";

export default function LanguagePickerScreen() {
  const { theme } = useAppTheme();
  const { i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const { setLanguage, state } = useSettings();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    applyRTLOfLanguage(lang);
    navigation.goBack();
  };

  const languageEntries = Object.entries(languages) as [Language, typeof languages[Language]][];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <AnimatedHeader title="Language" leftIcon="arrow-back" onLeftPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content}>
        {languageEntries.map(([code, lang]) => {
          const isActive = state.language === code;
          return (
            <TouchableOpacity
              key={code}
              onPress={() => handleSelect(code)}
              activeOpacity={0.7}
              style={[
                styles.option,
                {
                  backgroundColor: isActive ? theme.colors.primary.lighter : theme.colors.background.light,
                  borderColor: isActive ? theme.colors.primary.main : theme.colors.neutral.light200,
                  borderRadius: theme.borderRadius.md,
                },
              ]}
            >
              <View style={styles.optionLeft}>
                <Text style={[styles.nativeName, { color: isActive ? theme.colors.primary.main : theme.colors.neutral.dark300, fontFamily: theme.fontFamily.english }]}>
                  {lang.nativeName}
                </Text>
                <Text style={[styles.englishName, { color: theme.colors.neutral.light400, fontFamily: theme.fontFamily.english }]}>
                  {lang.name}
                </Text>
                {lang.rtl && (
                  <Text style={[styles.rtlBadge, { color: theme.colors.tertiary.main, fontFamily: theme.fontFamily.english }]}>RTL</Text>
                )}
              </View>
              {isActive && (
                <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary.main} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 8,
    borderWidth: 1.5,
  },
  optionLeft: {},
  nativeName: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  englishName: { fontSize: 12 },
  rtlBadge: { fontSize: 10, fontWeight: "700", marginTop: 4 },
});
