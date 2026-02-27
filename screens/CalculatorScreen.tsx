/**
 * @file screens/CalculatorScreen.tsx
 * @description Main calculator screen for Islamic inheritance calculations
 * Fully integrated with existing hooks and components
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import { useSettings } from '../lib/context/SettingsContext';
import { useCalculator, useMadhab, useHeirs, useAuditLog, useResults } from '../lib/inheritance/hooks';
import HeirSelector from '../components/HeirSelector';
import ResultsDisplay from '../components/ResultsDisplay';
import EstateInput from '../components/EstateInput';
import MadhhabSelector from '../components/MadhhabSelector';
import type { MadhhabType } from '../lib/inheritance/types';

interface CalculatorScreenProps {
  navigation?: any;
}

export default function CalculatorScreen({ navigation }: CalculatorScreenProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { state: settings } = useSettings();
  
  // Core hooks
  const { 
    estateData, 
    result, 
    isCalculating, 
    error: calcError,
    calculateWithMethod,
    updateEstateData,
    resetCalculator 
  } = useCalculator();
  
  // Madhab is managed by its own hook, not in settings
  const { madhab, changeMadhab } = useMadhab('shafii');
  const { heirs, addHeir, updateHeir, removeHeir, clearHeirs } = useHeirs();
  const { logCalculation } = useAuditLog();
  const { saveResult, previousResults } = useResults();
  
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Transform heirs array to HeirsData object for calculation
  const getHeirsData = useCallback(() => {
    const heirsData: Record<string, number> = {};
    heirs.forEach(heir => {
      heirsData[heir.key] = heir.count;
    });
    return heirsData;
  }, [heirs]);

  // Validate inputs before calculation
  const validateInputs = useCallback((): boolean => {
    const errors: string[] = [];
    
    // Validate estate
    if (!estateData.total || estateData.total <= 0) {
      errors.push('يجب إدخال المبلغ الإجمالي للتركة');
    }
    
    // Validate heirs
    if (heirs.length === 0) {
      errors.push('يجب إضافة واحد على الأقل من الورثة');
    } else {
      const totalHeirs = heirs.reduce((sum, h) => sum + h.count, 0);
      if (totalHeirs === 0) {
        errors.push('يجب أن يكون عدد الورثة أكبر من صفر');
      }
    }
    
    // Validate madhab
    if (!madhab) {
      errors.push('يجب اختيار المذهب الفقهي');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [estateData.total, heirs, madhab]);

  // Handle calculation
  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) {
      Alert.alert(
        'خطأ في التحقق',
        validationErrors.join('\n'),
        [{ text: 'حسناً' }]
      );
      return;
    }

    try {
      const heirsData = getHeirsData();
      const calculationResult = await calculateWithMethod(madhab, heirsData);
      
      if (calculationResult && calculationResult.success) {
        // Log to audit trail
        logCalculation(
          madhab,
          estateData,
          heirsData,
          calculationResult,
          calculationResult.calculationTime || 0
        );
        
        // Save to results history
        saveResult(calculationResult);
        setShowResults(true);
        
        Alert.alert(
          'تم بنجاح',
          'تم حساب توزيع الميراث بنجاح',
          [{ text: 'حسناً' }]
        );
      } else {
        Alert.alert(
          'خطأ في الحساب',
          calculationResult?.error || 'فشل في إجراء الحساب',
          [{ text: 'حسناً' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'خطأ',
        error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        [{ text: 'حسناً' }]
      );
    }
  }, [validateInputs, getHeirsData, calculateWithMethod, madhab, estateData, logCalculation, saveResult, validationErrors]);

  // Handle reset
  const handleReset = useCallback(() => {
    Alert.alert(
      'تأكيد المسح',
      'هل أنت متأكد من مسح جميع البيانات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: () => {
            resetCalculator();
            clearHeirs();
            setShowResults(false);
            setValidationErrors([]);
          }
        }
      ]
    );
  }, [resetCalculator, clearHeirs]);

  // Auto-validate on changes
  useEffect(() => {
    validateInputs();
  }, [estateData, heirs, madhab, validateInputs]);

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          scrollEnabled={true}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>حاسبة المواريث الشرعية</Text>
            <Text style={styles.headerSubtitle}>
              Islamic Inheritance Calculator
            </Text>
            
            {/* Validation Summary */}
            {validationErrors.length > 0 && (
              <View style={styles.validationSummary}>
                <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
                <Text style={styles.validationSummaryText}>
                  {validationErrors.length} {validationErrors.length === 1 ? 'خطأ' : 'أخطاء'} تحتاج إلى مراجعة
                </Text>
              </View>
            )}
          </View>

          {/* Madhab Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="school"
                size={24}
                color={theme.colors.primary.main}
              />
              <Text style={styles.sectionTitle}>
                اختر المذهب الفقهي
              </Text>
            </View>
            <MadhhabSelector
              onMadhhabChange={changeMadhab}
            />
          </View>

          {/* Estate Input */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={24}
                color={theme.colors.primary.main}
              />
              <Text style={styles.sectionTitle}>
                بيانات التركة
              </Text>
            </View>
            <EstateInput
              onEstateChange={updateEstateData}
              initialEstate={estateData}
            />
          </View>

          {/* Heir Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color={theme.colors.primary.main}
              />
              <Text style={styles.sectionTitle}>
                إضافة الوارثون
              </Text>
              {heirs.length > 0 && (
                <View style={styles.heirCountBadge}>
                  <Text style={styles.heirCountText}>
                    {heirs.reduce((sum, h) => sum + h.count, 0)}
                  </Text>
                </View>
              )}
            </View>
            <HeirSelector
              onHeirsChange={() => {}}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.calculateButton,
                (isCalculating || validationErrors.length > 0) && styles.buttonDisabled
              ]}
              onPress={handleCalculate}
              disabled={isCalculating || validationErrors.length > 0}
            >
              {isCalculating ? (
                <>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.buttonText}>
                    جاري الحساب...
                  </Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="calculator"
                    size={20}
                    color="#ffffff"
                  />
                  <Text style={styles.buttonText}>
                    حساب الميراث
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
              disabled={isCalculating}
            >
              <MaterialCommunityIcons
                name="refresh"
                size={20}
                color={theme.colors.primary.main}
              />
              <Text style={[styles.buttonText, styles.resetButtonText]}>
                مسح الكل
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Display */}
          {calcError && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={24} color="#d32f2f" />
              <Text style={styles.errorText}>{calcError}</Text>
            </View>
          )}

          {/* Results */}
          {showResults && result && result.success && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="chart-pie"
                  size={24}
                  color={theme.colors.primary.main}
                />
                <Text style={styles.sectionTitle}>
                  نتائج التوزيع
                </Text>
              </View>
              <ResultsDisplay
                result={result}
                onClose={() => setShowResults(false)}
              />
            </View>
          )}

          {/* Quick Stats (if available) */}
          {previousResults.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>
                النشاط الأخير
              </Text>
              <Text style={styles.statsText}>
                لديك {previousResults.length} عملية حساب سابقة
              </Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.8)',
      textAlign: 'center',
    },
    validationSummary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: 20,
      alignSelf: 'center',
      gap: 8,
    },
    validationSummaryText: {
      color: '#ffffff',
      fontSize: 13,
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
      flex: 1,
    },
    heirCountBadge: {
      backgroundColor: theme.colors.primary.light,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    heirCountText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    actionContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginVertical: 16,
      gap: 12,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      gap: 8,
      minHeight: 48,
    },
    calculateButton: {
      backgroundColor: theme.colors.primary.main,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    resetButton: {
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
    },
    buttonDisabled: {
      opacity: 0.6,
      shadowOpacity: 0,
      elevation: 0,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    resetButtonText: {
      color: theme.colors.primary.main,
    },
    errorContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      backgroundColor: '#ffebee',
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      borderLeftWidth: 4,
      borderLeftColor: '#d32f2f',
    },
    errorText: {
      fontSize: 14,
      color: '#d32f2f',
      flex: 1,
    },
    statsContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 16,
      backgroundColor: '#e3f2fd',
      borderRadius: 12,
    },
    statsTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: '#1976d2',
      marginBottom: 4,
      textAlign: 'center',
    },
    statsText: {
      fontSize: 12,
      color: '#666',
      textAlign: 'center',
    },
  });