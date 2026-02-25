/**
 * @file screens/SettingsScreen.tsx
 * @description Professional Settings Screen with i18n, theme, and preferences
 * Phase 8: World-class UI/UX Enhancements
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Linking,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import { useSettings } from '../lib/context/SettingsContext';
import { languages } from '../lib/i18n';

const { width } = Dimensions.get('window');

interface SettingsScreenProps {
  navigation?: any;
}

export default function SettingsScreen({
  navigation,
}: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { state, setLanguage, setTheme, setNotifications, setRoundingDecimals, setAutoSave, saveSettings } = useSettings();
  const [versionInfo] = useState('1.1.3');

  useEffect(() => {
    // Save settings whenever they change
    saveSettings();
  }, [state, saveSettings]);

  const handleLanguageChange = (lang: keyof typeof languages) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleThemeChange = (mode: 'light' | 'dark') => {
    setTheme(mode);
  };

  const handleDecimalChange = (value: number) => {
    setRoundingDecimals(Math.max(0, Math.min(6, value)));
  };

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert(t('common.error'), t('common.error'));
    }
  };

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('app.subtitle')}
          </Text>
        </View>

        {/* Language Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="translate"
              size={24}
              color={theme.colors.primary.main}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          </View>

          <View style={styles.languageGrid}>
            {Object.entries(languages).map(([langCode, langInfo]) => (
              <TouchableOpacity
                key={langCode}
                style={[
                  styles.languageOption,
                  state.language === langCode && styles.languageOptionActive,
                ]}
                onPress={() =>
                  handleLanguageChange(langCode as keyof typeof languages)
                }
              >
                <View
                  style={[
                    styles.languageCircle,
                    state.language === langCode && styles.languageCircleActive,
                  ]}
                >
                  {state.language === langCode && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="white"
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.languageText,
                    state.language === langCode && styles.languageTextActive,
                  ]}
                >
                  {langInfo.nativeName}
                </Text>
                <Text style={styles.languageSubtext}>{langInfo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="palette"
              size={24}
              color={theme.colors.primary.main}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          </View>

          <View style={styles.themeGrid}>
            {['light', 'dark'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeOption,
                  state.themeMode === mode && styles.themeOptionActive,
                ]}
                onPress={() => handleThemeChange(mode as 'light' | 'dark')}
              >
                <View
                  style={[
                    styles.themePreview,
                    {
                      backgroundColor:
                        mode === 'light' ? '#ffffff' : '#1f2937',
                    },
                  ]}
                >
                  <View
                    style={{
                      width: '100%',
                      height: 4,
                      backgroundColor:
                        mode === 'light' ? '#e5e7eb' : '#374151',
                      marginBottom: 4,
                    }}
                  />
                  <View
                    style={{
                      width: '80%',
                      height: 3,
                      backgroundColor:
                        mode === 'light' ? '#d1d5db' : '#4b5563',
                    }}
                  />
                </View>
                <Text
                  style={[
                    styles.themeLabel,
                    state.themeMode === mode && styles.themeLabelActive,
                  ]}
                >
                  {t(`settings.${mode}Mode`)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Calculation Preferences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="calculator"
              size={24}
              color={theme.colors.primary.main}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              {t('settings.calculationPreferences')}
            </Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingLabelText}>
                {t('settings.precision')}
              </Text>
              <Text style={styles.settingDescription}>
                {state.roundingDecimals} places
              </Text>
            </View>
            <View style={styles.decimalsControl}>
              <TouchableOpacity
                style={styles.decimalsButton}
                onPress={() => handleDecimalChange(state.roundingDecimals - 1)}
              >
                <Text style={styles.decimalsButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.decimalsValue}>
                {state.roundingDecimals}
              </Text>
              <TouchableOpacity
                style={styles.decimalsButton}
                onPress={() => handleDecimalChange(state.roundingDecimals + 1)}
              >
                <Text style={styles.decimalsButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingLabelText}>
                {t('settings.enableNotifications')}
              </Text>
            </View>
            <Switch
              value={state.notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={
                state.notifications ? theme.colors.primary.main : '#f3f4f6'
              }
              ios_backgroundColor="#d1d5db"
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={theme.colors.primary.main}
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>{t('about.title')}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('about.version')}</Text>
              <Text style={styles.infoValue}>{versionInfo}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.descriptionText}>
              {t('app.description')}
            </Text>
          </View>

          {/* Links */}
          <View style={styles.linksGrid}>
            {[
              { icon: 'globe', label: 'Website', action: () => openLink('https://merath.app') },
              { icon: 'email', label: 'Contact', action: () => openLink('mailto:support@merath.app') },
              { icon: 'shield-check', label: 'Privacy', action: () => openLink('https://merath.app/privacy') },
              { icon: 'file-document', label: 'Terms', action: () => openLink('https://merath.app/terms') },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={styles.linkButton}
                onPress={link.action}
              >
                <MaterialCommunityIcons
                  name={link.icon as any}
                  size={20}
                  color={theme.colors.primary.main}
                />
                <Text style={styles.linkLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {t('about.copyright')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
    },
    contentContainer: {
      paddingBottom: 32,
    },
    header: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      backgroundColor: theme.colors.primary.main,
      gap: 8,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#ffffff',
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    section: {
      marginHorizontal: 12,
      marginVertical: 12,
      borderRadius: 12,
      backgroundColor: '#ffffff',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    sectionIcon: {
      width: 28,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: '#1f2937',
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    languageOption: {
      flex: 1,
      minWidth: (width - 56) / 2,
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e5e7eb',
      backgroundColor: '#f9fafb',
    },
    languageOptionActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.light,
    },
    languageCircle: {
      width: 28,
      height: 28,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: '#d1d5db',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    languageCircleActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.main,
    },
    languageText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#374151',
    },
    languageTextActive: {
      color: theme.colors.primary.main,
    },
    languageSubtext: {
      fontSize: 11,
      color: '#9ca3af',
      marginTop: 4,
    },
    themeGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    themeOption: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: '#e5e7eb',
      backgroundColor: '#f9fafb',
    },
    themeOptionActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: theme.colors.primary.light,
    },
    themePreview: {
      width: '100%',
      height: 60,
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: '#d1d5db',
    },
    themeLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#374151',
    },
    themeLabelActive: {
      color: theme.colors.primary.main,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      marginBottom: 8,
    },
    settingLabel: {
      flex: 1,
    },
    settingLabelText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
    },
    settingDescription: {
      fontSize: 12,
      color: '#9ca3af',
      marginTop: 4,
    },
    decimalsControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 8,
    },
    decimalsButton: {
      width: 32,
      height: 32,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    decimalsButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    decimalsValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      minWidth: 24,
      textAlign: 'center',
    },
    infoCard: {
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    infoLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#6b7280',
    },
    infoValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary.main,
    },
    divider: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginVertical: 8,
    },
    descriptionText: {
      fontSize: 12,
      color: '#6b7280',
      lineHeight: 18,
      marginTop: 4,
    },
    linksGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    linkButton: {
      flex: 1,
      minWidth: (width - 68) / 2,
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
      alignItems: 'center',
      gap: 6,
    },
    linkLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    footer: {
      paddingHorizontal: 16,
      paddingVertical: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#9ca3af',
      textAlign: 'center',
      lineHeight: 18,
    },
  });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 16,
  },
  section: {
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
