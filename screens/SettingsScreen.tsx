/**
 * @file screens/SettingsScreen.tsx
 * @description Professional Settings Screen with persistence and backup
 * 
 * FIXES:
 * - M1 (🟡): Data backup/restore functionality
 * - L3 (🔵): Manual theme toggle in UI
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Share,
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
  Modal,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import { useSettings } from '../lib/context/SettingsContext';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { languages } from '../lib/i18n';
import { db } from '../lib/database/db';
import { AuditLog } from '../lib/inheritance/audit-log';
import { CalculationCache } from '../lib/performance/optimization';

const { width } = Dimensions.get('window');
const STORAGE_KEYS = {
  LANGUAGE: '@merath_settings_language',
  THEME: '@merath_settings_theme',
  NOTIFICATIONS: '@merath_settings_notifications',
  ROUNDING: '@merath_settings_rounding',
  AUTO_SAVE: '@merath_settings_auto_save',
};

// ===== FIX M1: Backup/Restore keys =====
const BACKUP_KEYS = {
  SETTINGS: '@merath_settings_v2',
  FAVORITES: '@merath_audit_favorites',
  ONBOARDING: '@merath_onboarding_completed',
  LAUNCH_COUNT: '@merath_launch_count',
};

interface SettingsScreenProps {
  navigation?: any;
}

// ===== FIX M1: Backup data interface =====
interface BackupData {
  version: string;
  timestamp: string;
  appVersion: string;
  data: {
    settings: any;
    favorites: string[];
    onboardingCompleted: string | null;
    auditLogCount?: number;
  };
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const { mode, setThemeMode, toggleTheme } = useAppTheme();
  const { state, setLanguage, setNotifications, setRoundingDecimals, setAutoSave } = useSettings();
  
  const [versionInfo] = useState('1.1.3');
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  
  // ===== FIX M1: Backup/Restore states =====
  const [backupModalVisible, setBackupModalVisible] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  const [backupSize, setBackupSize] = useState<string>('0 KB');

  // ===== FIX L3: Theme options modal =====
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  // Performance stats
  const [performanceStats, setPerformanceStats] = useState({
    totalCalculations: 0,
    hitRate: 0,
    avgCalculationTime: 0,
    cacheSize: 0,
  });

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

        // ===== FIX M1: Load last backup info =====
        await loadBackupInfo();

        // Load performance stats
        loadPerformanceStats();
        
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, [setLanguage, setNotifications, setRoundingDecimals, setAutoSave, i18n]);

  // ===== FIX M1: Load backup information =====
  const loadBackupInfo = async () => {
    try {
      const lastBackup = await AsyncStorage.getItem('@merath_last_backup');
      if (lastBackup) {
        setLastBackupTime(new Date(JSON.parse(lastBackup)).toLocaleString('ar-SA'));
      }

      // Estimate backup size
      let totalSize = 0;
      for (const key of Object.values(BACKUP_KEYS)) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += new Blob([value]).size;
        }
      }

      // Add IndexedDB estimate if available
      if (db && db.auditLogs) {
        const count = await db.auditLogs.count();
        totalSize += count * 2000; // Rough estimate: 2KB per log entry
      }

      setBackupSize(formatFileSize(totalSize));
    } catch (error) {
      console.error('Failed to load backup info:', error);
    }
  };

  // Load performance stats
  const loadPerformanceStats = () => {
    const stats = CalculationCache.getStats();
    setPerformanceStats(stats);
  };

  // ===== FIX M1: Format file size =====
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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
  }, [state]);

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

  // ===== FIX L3: Theme change handler with modal =====
  const handleThemeChange = useCallback((newMode: 'light' | 'dark' | 'system') => {
    if (newMode === 'system') {
      // System theme is handled by ThemeProvider automatically
      // We just set to light/dark based on system
      const systemMode = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeMode(systemMode);
    } else {
      setThemeMode(newMode);
    }
    setThemeModalVisible(false);
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

  // ===== FIX M1: Create backup =====
  const createBackup = useCallback(async () => {
    try {
      setIsBackingUp(true);
      
      // Collect all data
      const settings = await AsyncStorage.getItem(BACKUP_KEYS.SETTINGS);
      const favorites = await AsyncStorage.getItem(BACKUP_KEYS.FAVORITES);
      const onboarding = await AsyncStorage.getItem(BACKUP_KEYS.ONBOARDING);
      
      // Get audit log count from IndexedDB
      let auditLogCount = 0;
      if (db && db.auditLogs) {
        auditLogCount = await db.auditLogs.count();
      }
      
      const backupData: BackupData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        appVersion: versionInfo,
        data: {
          settings: settings ? JSON.parse(settings) : null,
          favorites: favorites ? JSON.parse(favorites) : [],
          onboardingCompleted: onboarding,
          auditLogCount,
        }
      };
      
      // Save backup file
      const backupJson = JSON.stringify(backupData, null, 2);
      const fileName = `merath-backup-${new Date().toISOString().split('T')[0]}.json`;
      const fileDir = (FileSystem as any).documentDirectory;
      if (!fileDir) {
        throw new Error('لا يمكن الوصول إلى نظام الملفات');
      }
      const fileUri = fileDir + fileName;
      
      await FileSystem.writeAsStringAsync(fileUri, backupJson, {
        encoding: "utf8",
      });
      
      // Share backup file
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        // @ts-ignore
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'حفظ نسخة احتياطية',
        });
      } else {
        // Fallback to clipboard
        // Use Share API for text
        await Share.share({
          message: backupJson,
          title: 'النسخة الاحتياطية',
        });
      }
      
      // Save backup timestamp
      await AsyncStorage.setItem('@merath_last_backup', JSON.stringify(new Date()));
      setLastBackupTime(new Date().toLocaleString('ar-SA'));
      
      Alert.alert('تم', 'تم إنشاء النسخة الاحتياطية بنجاح');
      
    } catch (error) {
      console.error('Backup failed:', error);
      Alert.alert('خطأ', 'فشل في إنشاء النسخة الاحتياطية');
    } finally {
      setIsBackingUp(false);
      setBackupModalVisible(false);
    }
  }, [versionInfo]);

  // ===== FIX M1: Restore from backup =====
  const restoreFromBackup = useCallback(async () => {
    try {
      setIsRestoring(true);
      
      // Pick backup file
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });
      
      if (result.canceled) {
        setIsRestoring(false);
        return;
      }
      
      const file = result.assets[0];
      
      // Read file content
      const content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: "utf8",
      });
      
      const backupData: BackupData = JSON.parse(content);
      
      // Validate backup
      if (!backupData.version || !backupData.data) {
        throw new Error('ملف نسخة احتياطية غير صالح');
      }
      
      // Confirm restore
      Alert.alert(
        'تأكيد الاستعادة',
        `سيتم استبدال جميع البيانات الحالية بنسخة من ${new Date(backupData.timestamp).toLocaleDateString('ar-SA')}. هل أنت متأكد؟`,
        [
          { text: 'إلغاء', onPress: () => setIsRestoring(false) },
          {
            text: 'استعادة',
            onPress: async () => {
              try {
                // Restore settings
                if (backupData.data.settings) {
                  await AsyncStorage.setItem(BACKUP_KEYS.SETTINGS, JSON.stringify(backupData.data.settings));
                }
                
                // Restore favorites
                if (backupData.data.favorites) {
                  await AsyncStorage.setItem(BACKUP_KEYS.FAVORITES, JSON.stringify(backupData.data.favorites));
                }
                
                // Restore onboarding status
                if (backupData.data.onboardingCompleted) {
                  await AsyncStorage.setItem(BACKUP_KEYS.ONBOARDING, backupData.data.onboardingCompleted);
                }
                
                Alert.alert(
                  'تم',
                  'تم استعادة البيانات بنجاح. سيتم إعادة تشغيل التطبيق.',
                  [
                    {
                      text: 'موافق',
                      onPress: () => {
                        // Force reload
                        if (Platform.OS === 'web') {
                          window.location.reload();
                        } else {
                          // For native, we'll just reload settings
                          loadBackupInfo();
                        }
                      }
                    }
                  ]
                );
                
              } catch (restoreError) {
                console.error('Restore failed:', restoreError);
                Alert.alert('خطأ', 'فشل في استعادة البيانات');
              } finally {
                setIsRestoring(false);
                setBackupModalVisible(false);
              }
            }
          }
        ]
      );
      
    } catch (error) {
      console.error('Restore failed:', error);
      Alert.alert('خطأ', 'فشل في قراءة ملف النسخة الاحتياطية');
      setIsRestoring(false);
    }
  }, []);

  // ===== FIX M1: Clear all data =====
  const handleClearAllData = useCallback(() => {
    Alert.alert(
      'مسح جميع البيانات',
      'هل أنت متأكد؟ هذا الإجراء لا يمكن التراجع عنه.',
      [
        { text: 'إلغاء', onPress: () => {} },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.multiRemove(Object.values(BACKUP_KEYS));
              
              // Clear IndexedDB
              if (db && db.auditLogs) {
                await db.auditLogs.clear();
              }
              
              setLastBackupTime(null);
              setBackupSize('0 KB');
              
              Alert.alert('تم', 'تم مسح جميع البيانات');
            } catch (error) {
              console.error('Clear data failed:', error);
              Alert.alert('خطأ', 'فشل في مسح البيانات');
            }
          }
        }
      ]
    );
  }, []);

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

        {/* ===== FIX L3: Appearance Section with Manual Theme Toggle ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="palette" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>{t('settings.theme')}</Text>
          </View>
          
          {/* Theme selector button */}
          <TouchableOpacity
            style={styles.themeSelector}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={styles.themeSelectorLeft}>
              <MaterialCommunityIcons 
                name={mode === 'dark' ? 'weather-night' : 'weather-sunny'} 
                size={20} 
                color={theme.colors.primary.main} 
              />
              <Text style={styles.themeSelectorText}>
                {mode === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.colors.neutral.dark200} />
          </TouchableOpacity>

          {/* Quick theme toggle */}
          <TouchableOpacity
            style={styles.quickThemeToggle}
            onPress={toggleTheme}
          >
            <MaterialCommunityIcons 
              name="theme-light-dark" 
              size={20} 
              color={theme.colors.primary.main} 
            />
            <Text style={styles.quickThemeToggleText}>
              تبديل سريع إلى {mode === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== FIX M1: Backup & Restore Section ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="backup-restore" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>النسخ الاحتياطي</Text>
          </View>

          <View style={styles.backupInfo}>
            <View style={styles.backupInfoRow}>
              <Text style={styles.backupInfoLabel}>آخر نسخة:</Text>
              <Text style={styles.backupInfoValue}>{lastBackupTime || 'لا توجد'}</Text>
            </View>
            <View style={styles.backupInfoRow}>
              <Text style={styles.backupInfoLabel}>حجم البيانات:</Text>
              <Text style={styles.backupInfoValue}>{backupSize}</Text>
            </View>
          </View>

          <View style={styles.backupActions}>
            <TouchableOpacity
              style={[styles.backupButton, { backgroundColor: theme.colors.primary.main }]}
              onPress={() => setBackupModalVisible(true)}
              disabled={isBackingUp || isRestoring}
            >
              {isBackingUp ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="cloud-upload" size={20} color="#fff" />
                  <Text style={styles.backupButtonText}>إنشاء نسخة</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.backupButton, styles.restoreButton]}
              onPress={restoreFromBackup}
              disabled={isBackingUp || isRestoring}
            >
              {isRestoring ? (
                <ActivityIndicator size="small" color={theme.colors.primary.main} />
              ) : (
                <>
                  <MaterialCommunityIcons name="cloud-download" size={20} color={theme.colors.primary.main} />
                  <Text style={[styles.backupButtonText, styles.restoreButtonText]}>استعادة</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.clearDataButton}
            onPress={handleClearAllData}
          >
            <MaterialCommunityIcons name="delete-sweep" size={20} color={theme.colors.error.main} />
            <Text style={styles.clearDataText}>مسح جميع البيانات</Text>
          </TouchableOpacity>
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

        {/* Performance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="speedometer" size={24} color={theme.colors.primary.main} />
            <Text style={styles.sectionTitle}>الأداء والإحصائيات</Text>
          </View>
          <View style={styles.aboutCard}>
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>إجمالي الحسابات</Text>
              <Text style={styles.aboutValue}>{performanceStats.totalCalculations}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>معدل الإصابة في الذاكرة المؤقتة</Text>
              <Text style={styles.aboutValue}>{performanceStats.hitRate.toFixed(1)}%</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>متوسط وقت الحساب</Text>
              <Text style={styles.aboutValue}>{performanceStats.avgCalculationTime.toFixed(0)}ms</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.aboutRow}>
              <Text style={styles.aboutLabel}>حجم الذاكرة المؤقتة</Text>
              <Text style={styles.aboutValue}>{performanceStats.cacheSize} عنصر</Text>
            </View>
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

      {/* ===== FIX L3: Theme Selection Modal ===== */}
      <Modal
        visible={themeModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر المظهر</Text>
              <TouchableOpacity onPress={() => setThemeModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.neutral.dark200} />
              </TouchableOpacity>
            </View>

            {(['light', 'dark', 'system'] as const).map((themeMode) => (
              <TouchableOpacity
                key={themeMode}
                style={[
                  styles.themeOption,
                  (themeMode === 'system' ? mode : themeMode) === mode && styles.themeOptionActive
                ]}
                onPress={() => handleThemeChange(themeMode)}
              >
                <MaterialCommunityIcons
                  name={
                    themeMode === 'light' ? 'weather-sunny' :
                    themeMode === 'dark' ? 'weather-night' : 'theme-light-dark'
                  }
                  size={24}
                  color={themeMode === 'system' ? theme.colors.primary.main : theme.colors.primary.main}
                />
                <Text style={styles.themeOptionText}>
                  {themeMode === 'light' ? t('settings.lightMode') :
                   themeMode === 'dark' ? t('settings.darkMode') :
                   'النظام (حسب إعدادات الجهاز)'}
                </Text>
                {(themeMode === 'system' ? true : themeMode === mode) && (
                  <MaterialCommunityIcons name="check" size={20} color={theme.colors.primary.main} style={styles.themeOptionCheck} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* ===== FIX M1: Backup Confirmation Modal ===== */}
      <Modal
        visible={backupModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBackupModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.confirmModal]}>
            <MaterialCommunityIcons name="cloud-upload" size={48} color={theme.colors.primary.main} />
            <Text style={styles.confirmTitle}>إنشاء نسخة احتياطية</Text>
            <Text style={styles.confirmText}>
              سيتم إنشاء ملف JSON يحتوي على جميع إعداداتك وبياناتك. يمكنك استخدام هذا الملف لاستعادة البيانات لاحقاً.
            </Text>
            
            <View style={styles.confirmActions}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelConfirmButton]}
                onPress={() => setBackupModalVisible(false)}
              >
                <Text style={styles.cancelConfirmText}>إلغاء</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.confirmButton, styles.okConfirmButton, { backgroundColor: theme.colors.primary.main }]}
                onPress={createBackup}
              >
                <Text style={styles.okConfirmText}>متابعة</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    // ===== FIX L3: Theme selector styles =====
    themeSelector: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    themeSelectorLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeSelectorText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
    },
    quickThemeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      backgroundColor: '#f3f4f6',
      borderRadius: 8,
    },
    quickThemeToggleText: {
      fontSize: 13,
      color: theme.colors.primary.main,
      fontWeight: '600',
    },
    // ===== FIX M1: Backup styles =====
    backupInfo: {
      backgroundColor: '#f9fafb',
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
    },
    backupInfoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
    },
    backupInfoLabel: {
      fontSize: 13,
      color: '#6b7280',
    },
    backupInfoValue: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1f2937',
    },
    backupActions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    backupButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      borderRadius: 10,
      gap: 8,
    },
    restoreButton: {
      backgroundColor: '#f3f4f6',
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
    },
    backupButtonText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '600',
    },
    restoreButtonText: {
      color: theme.colors.primary.main,
    },
    clearDataButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      backgroundColor: '#ffebee',
      borderRadius: 8,
    },
    clearDataText: {
      fontSize: 13,
      color: theme.colors.error.main,
      fontWeight: '600',
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
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      width: '90%',
      maxWidth: 400,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1f2937',
    },
    // Theme option styles
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      backgroundColor: '#f9fafb',
    },
    themeOptionActive: {
      backgroundColor: '#eef2ff',
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: '#1f2937',
      marginLeft: 12,
      flex: 1,
    },
    themeOptionCheck: {
      marginLeft: 'auto',
    },
    // Confirm modal styles
    confirmModal: {
      alignItems: 'center',
      padding: 24,
    },
    confirmTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#1f2937',
      marginTop: 12,
      marginBottom: 8,
    },
    confirmText: {
      fontSize: 14,
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: 20,
      lineHeight: 20,
    },
    confirmActions: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
    },
    confirmButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    cancelConfirmButton: {
      backgroundColor: '#f3f4f6',
    },
    okConfirmButton: {
      backgroundColor: theme.colors.primary.main,
    },
    cancelConfirmText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#6b7280',
    },
    okConfirmText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
  });