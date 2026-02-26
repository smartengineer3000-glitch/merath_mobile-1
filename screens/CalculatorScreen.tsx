/**
 * @file screens/SettingsScreen.tsx
 * @description Professional Settings Screen with improved layout
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

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { state, setLanguage, setTheme, setNotifications, setRoundingDecimals, setAutoSave, saveSettings } = useSettings();
  const [versionInfo] = useState('1.1.3');

  useEffect(() => {
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
          <Text style={styles.headerSubtitle}>{t('app.subtitle')}</Text>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="translate" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          </View>
          <View style={styles.languageGrid}>
            {Object.entries(languages).map(([langCode, langInfo]) => (
              <TouchableOpacity
                key={langCode}
                style={[
                  styles.languageCard,
                  state.language === langCode && styles.languageCardActive,
                ]}
                onPress={() => handleLanguageChange(langCode as keyof typeof languages)}
              >
                <View style={styles.languageFlag}>
                  <Text style={styles.languageFlagText}>
                    {langCode === 'ar' ? '🇸🇦' :
                     langCode === 'en' ? '🇬🇧' :
                     langCode === 'ur' ? '🇵🇰' :
                     langCode === 'tr' ? '🇹🇷' :
                     langCode === 'fr' ? '🇫🇷' :
                     langCode === 'de' ? '🇩🇪' : '🌐'}
                  </Text>
                </View>
                <Text style={styles.languageNative}>{langInfo.nativeName}</Text>
                <Text style={styles.languageName}>{langInfo.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="palette" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.themeContainer}>
            {(['light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeCard,
                  state.themeMode === mode && styles.themeCardActive,
                ]}
                onPress={() => handleThemeChange(mode)}
              >
                <View style={[
                  styles.themePreview,
                  mode === 'light' && styles.themePreviewLight,
                  mode === 'dark' && styles.themePreviewDark,
                ]}>
                  <View style={styles.themePreviewHeader} />
                  <View style={styles.themePreviewContent} />
                  <View style={styles.themePreviewFooter} />
                </View>
                <Text style={styles.themeLabel}>
                  {mode === 'light' ? t('settings.lightMode') :
                   mode === 'dark' ? t('settings.darkMode') :
                   t('settings.systemMode')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cog" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.calculationPreferences')}</Text>
          </View>

          {/* Decimal places */}
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLabel}>
              <Text style={styles.preferenceTitle}>{t('settings.precision')}</Text>
              <Text style={styles.preferenceDescription}>{state.roundingDecimals} {t('common.decimalPlaces')}</Text>
            </View>
            <View style={styles.decimalControl}>
              <TouchableOpacity
                style={styles.decimalButton}
                onPress={() => handleDecimalChange(state.roundingDecimals - 1)}
                disabled={state.roundingDecimals <= 0}
              >
                <Text style={styles.decimalButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.decimalValue}>{state.roundingDecimals}</Text>
              <TouchableOpacity
                style={styles.decimalButton}
                onPress={() => handleDecimalChange(state.roundingDecimals + 1)}
                disabled={state.roundingDecimals >= 6}
              >
                <Text style={styles.decimalButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Auto-save toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <MaterialCommunityIcons name="content-save" size={20} color={theme.colors.neutral.dark200} />
              <Text style={styles.toggleTitle}>{t('settings.autoSave')}</Text>
            </View>
            <Switch
              value={state.autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={state.autoSave ? theme.colors.primary.main : '#f3f4f6'}
            />
          </View>

          {/* Notifications toggle */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <MaterialCommunityIcons name="bell" size={20} color={theme.colors.neutral.dark200} />
              <Text style={styles.toggleTitle}>{t('settings.enableNotifications')}</Text>
            </View>
            <Switch
              value={state.notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#d1d5db', true: theme.colors.primary.light200 }}
              thumbColor={state.notifications ? theme.colors.primary.main : '#f3f4f6'}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="information" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('about.title')}</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>{t('about.version')}</Text>
              <Text style={styles.aboutValue}>{versionInfo}</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.aboutDescription}>{t('app.description')}</Text>
          </View>

          {/* Links */}
          <View style={styles.linksContainer}>
            {[
              { icon: 'web', label: t('about.website'), url: 'https://merath.app' },
              { icon: 'email', label: t('about.contact'), url: 'mailto:support@merath.app' },
              { icon: 'shield-lock', label: t('about.privacy'), url: 'https://merath.app/privacy' },
              { icon: 'file-document', label: t('about.terms'), url: 'https://merath.app/terms' },
            ].map((link) => (
              <TouchableOpacity
                key={link.label}
                style={styles.linkButton}
                onPress={() => openLink(link.url)}
              >
                <MaterialCommunityIcons name={link.icon as any} size={20} color={theme.colors.primary.main} />
                <Text style={styles.linkLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('about.copyright')}</Text>
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
      paddingHorizontal: 20,
      paddingVertical: 24,
      backgroundColor: theme.colors.primary.main,
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      color: '#ffffff',
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
    },
    section: {
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      backgroundColor: '#ffffff',
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
    },
    languageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    languageCard: {
      width: (width - 64) / 3,
      aspectRatio: 0.9,
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
    },
    languageCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: '#eef2ff',
    },
    languageFlag: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e5e7eb',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    languageFlagText: {
      fontSize: 24,
    },
    languageNative: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: 2,
    },
    languageName: {
      fontSize: 10,
      color: '#6b7280',
      textAlign: 'center',
    },
    themeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
    },
    themeCard: {
      flex: 1,
      alignItems: 'center',
      padding: 12,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: 'transparent',
      backgroundColor: '#f9fafb',
    },
    themeCardActive: {
      borderColor: theme.colors.primary.main,
      backgroundColor: '#eef2ff',
    },
    themePreview: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: 8,
      marginBottom: 8,
      overflow: 'hidden',
    },
    themePreviewLight: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
    },
    themePreviewDark: {
      backgroundColor: '#1f2937',
    },
    themePreviewSystem: {
      backgroundColor: 'linear-gradient(45deg, #ffffff 50%, #1f2937 50%)',
    },
    themePreviewHeader: {
      height: 8,
      backgroundColor: theme.colors.primary.main,
    },
    themePreviewContent: {
      flex: 1,
      margin: 4,
      backgroundColor: '#e5e7eb',
    },
    themePreviewFooter: {
      height: 6,
      backgroundColor: '#d1d5db',
      margin: 4,
    },
    themeLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: '#374151',
    },
    preferenceRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    preferenceLabel: {
      flex: 1,
    },
    preferenceTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: 2,
    },
    preferenceDescription: {
      fontSize: 12,
      color: '#6b7280',
    },
    decimalControl: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    decimalButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    decimalButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    decimalValue: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1f2937',
      minWidth: 24,
      textAlign: 'center',
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: '#f3f4f6',
    },
    toggleLabel: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    toggleTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
    },
    aboutCard: {
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    aboutRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    aboutLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#6b7280',
    },
    aboutValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primary.main,
    },
    divider: {
      height: 1,
      backgroundColor: '#e5e7eb',
      marginVertical: 8,
    },
    aboutDescription: {
      fontSize: 12,
      color: '#6b7280',
      lineHeight: 18,
    },
    linksContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      backgroundColor: theme.colors.primary.light,
    },
    linkLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    footer: {
      paddingHorizontal: 20,
      paddingVertical: 24,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 12,
      color: '#9ca3af',
      textAlign: 'center',
    },
  });