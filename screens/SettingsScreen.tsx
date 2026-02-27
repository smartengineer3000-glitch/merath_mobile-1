/**
 * @file screens/SettingsScreen.tsx
 * @description Professional Settings Screen with persistence
 * Uses ThemeProvider for theme and SettingsContext for preferences
 */

import React, { useEffect, useState, useCallback } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { useSettings } from '../lib/context/SettingsContext';
import { languages } from '../lib/i18n';

const { width } = Dimensions.get('window');
const STORAGE_KEYS = {
  LANGUAGE: '@merath_settings_language',
  NOTIFICATIONS: '@merath_settings_notifications',
  ROUNDING: '@merath_settings_rounding',
  AUTO_SAVE: '@merath_settings_auto_save',
};

interface SettingsScreenProps {
  navigation?: any;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme, mode: themeMode, setThemeMode } = useAppTheme();
  const { 
    state, 
    setLanguage, 
    setNotifications, 
    setRoundingDecimals, 
    setAutoSave 
  } = useSettings();
  
  const [versionInfo] = useState('1.1.3');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        
        // Load language
        const savedLang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
        if (savedLang && Object.keys(languages).includes(savedLang)) {
          setLanguage(savedLang as keyof typeof languages);
          i18n.changeLanguage(savedLang);
        }
        
        // Load notifications
        const savedNotifications = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
        if (savedNotifications !== null) {
          setNotifications(savedNotifications === 'true');
        }
        
        // Load rounding decimals
        const savedRounding = await AsyncStorage.getItem(STORAGE_KEYS.ROUNDING);
        if (savedRounding !== null) {
          setRoundingDecimals(parseInt(savedRounding, 10));
        }
        
        // Load auto save
        const savedAutoSave = await AsyncStorage.getItem(STORAGE_KEYS.AUTO_SAVE);
        if (savedAutoSave !== null) {
          setAutoSave(savedAutoSave === 'true');
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [setLanguage, setNotifications, setRoundingDecimals, setAutoSave, i18n]);

  // Save settings with debounce
  const saveSettings = useCallback(async () => {
    try {
      setSaveStatus('saving');
      
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, state.language);
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, String(state.notifications));
      await AsyncStorage.setItem(STORAGE_KEYS.ROUNDING, String(state.roundingDecimals));
      await AsyncStorage.setItem(STORAGE_KEYS.AUTO_SAVE, String(state.autoSave));
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      Alert.alert(
        t('common.error'),
        'فشل حفظ الإعدادات. يرجى المحاولة مرة أخرى.'
      );
      setSaveStatus('idle');
    }
  }, [state, t]);

  // Auto-save when settings change
  useEffect(() => {
    if (!isLoading) {
      saveSettings();
    }
  }, [state, isLoading, saveSettings]);

  const handleLanguageChange = useCallback(async (lang: keyof typeof languages) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [setLanguage, i18n]);

  const handleThemeChange = useCallback((mode: 'light' | 'dark') => {
    setThemeMode(mode);
  }, [setThemeMode]);

  const handleDecimalChange = useCallback((value: number) => {
    setRoundingDecimals(Math.max(0, Math.min(6, value)));
  }, [setRoundingDecimals]);

  const handleNotificationToggle = useCallback((value: boolean) => {
    setNotifications(value);
  }, [setNotifications]);

  const handleAutoSaveToggle = useCallback((value: boolean) => {
    setAutoSave(value);
  }, [setAutoSave]);

  const openLink = useCallback(async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t('common.error'), t('common.error'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('common.error'));
    }
  }, [t]);

  const styles = React.useMemo(() => createStyles(theme), [theme]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>جاري تحميل الإعدادات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header with save status */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <Text style={styles.headerSubtitle}>{t('app.subtitle')}</Text>
          {saveStatus === 'saving' && (
            <View style={styles.saveStatusContainer}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.saveStatusText}>جاري الحفظ...</Text>
            </View>
          )}
          {saveStatus === 'saved' && (
            <View style={[styles.saveStatusContainer, styles.saveStatusSaved]}>
              <Text style={styles.saveStatusText}>✓ تم الحفظ</Text>
            </View>
          )}
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
                  themeMode === mode && styles.themeCardActive,
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
                  {mode === 'light' ? t('settings.lightMode') : t('settings.darkMode')}
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
              onValueChange={handleAutoSaveToggle}
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
              onValueChange={handleNotificationToggle}
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
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: theme.colors.neutral.dark200,
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
    saveStatusContainer: {
      position: 'absolute',
      top: 16,
      right: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.2)',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      gap: 6,
    },
    saveStatusSaved: {
      backgroundColor: 'rgba(76, 175, 80, 0.3)',
    },
    saveStatusText: {
      color: '#ffffff',
      fontSize: 12,
      fontWeight: '500',
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