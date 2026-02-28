/**
 * @file screens/CalculatorScreen.tsx
 * @description Professional calculator screen with proper visual hierarchy
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
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
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../lib/design/theme';
import { useCalculator, useMadhab, useHeirs, useAuditLog, useResults } from '../lib/inheritance/hooks';
import MadhhabSelector from '../components/MadhhabSelector';
import EstateInput from '../components/EstateInput';
import HeirSelector from '../components/HeirSelector';
import ResultsDisplay from '../components/ResultsDisplay';
import type { HeirsData } from '../lib/inheritance/types';

export default function CalculatorScreen() {
  const { theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  // Hooks
  const { madhab, changeMadhab } = useMadhab('hanafi');
  const { 
    estateData, 
    updateEstateData, 
    calculateWithMethod, 
    isCalculating, 
    result,
    resetCalculator 
  } = useCalculator();
  
  // IMPORTANT: Track heirs as a Map to ensure reactivity
  const [heirsMap, setHeirsMap] = useState<Map<string, number>>(new Map());
  const { clearHeirs } = useHeirs(); // Still use the hook for its other functions
  
  const { saveResult, previousResults } = useResults();
  const { logCalculation } = useAuditLog();
  
  const [showResults, setShowResults] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Fade in animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle heir changes from HeirSelector
  const handleHeirsChange = useCallback((heirs: HeirsData) => {
    const newMap = new Map();
    Object.entries(heirs).forEach(([key, count]) => {
      if (count && count > 0) {
        newMap.set(key, count);
      }
    });
    setHeirsMap(newMap);
  }, []);

  // Convert heirs map to HeirsData object for calculation
  const getHeirsData = useCallback((): HeirsData => {
    const heirsData: HeirsData = {};
    heirsMap.forEach((count, key) => {
      heirsData[key] = count;
    });
    return heirsData;
  }, [heirsMap]);

  // Get total heirs count for validation
  const getTotalHeirsCount = useCallback((): number => {
    let total = 0;
    heirsMap.forEach(count => {
      total += count;
    });
    return total;
  }, [heirsMap]);

  // Validate inputs before calculation
  const validateInputs = useCallback((): boolean => {
    const errors: string[] = [];
    
    if (!estateData.total || estateData.total <= 0) {
      errors.push('الرجاء إدخال مبلغ التركة');
    }
    
    const totalHeirs = getTotalHeirsCount();
    if (totalHeirs === 0) {
      errors.push('الرجاء إضافة وارث واحد على الأقل');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [estateData.total, getTotalHeirsCount]);

  // Handle calculation
  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) {
      Alert.alert('تنبيه', validationErrors.join('\n'));
      return;
    }

    try {
      const heirsData = getHeirsData();
      const calculationResult = await calculateWithMethod(madhab, heirsData);
      
      if (calculationResult && calculationResult.success) {
        // Save to results and audit log
        saveResult(calculationResult);
        logCalculation(madhab, estateData, heirsData, calculationResult, calculationResult.calculationTime);
        setShowResults(true);
        
        // Scroll to results
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
      } else {
        Alert.alert('خطأ', calculationResult?.error || 'فشل في إجراء الحساب');
      }
    } catch (error) {
      Alert.alert('خطأ', error instanceof Error ? error.message : 'حدث خطأ غير متوقع');
    }
  }, [madhab, estateData, calculateWithMethod, validateInputs, validationErrors, getHeirsData, saveResult, logCalculation]);

  // Handle reset - clears ALL fields including madhab and heirs
  const handleReset = useCallback(() => {
    Alert.alert(
      'تأكيد إعادة التعيين',
      'هل أنت متأكد من مسح جميع البيانات؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: () => {
            // Reset to default madhab
            changeMadhab('hanafi');
            // Reset calculator state
            resetCalculator();
            // Clear heirs map
            setHeirsMap(new Map());
            // Clear heirs from hook
            clearHeirs();
            // Hide results
            setShowResults(false);
            setValidationErrors([]);
            
            // Scroll to top
            scrollViewRef.current?.scrollTo({ y: 0, animated: true });
          }
        }
      ]
    );
  }, [changeMadhab, resetCalculator, clearHeirs]);

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.ScrollView
          ref={scrollViewRef}
          style={[styles.scrollView, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="scale-balance" size={32} color={theme.colors.primary.main} />
            <Text style={styles.headerTitle}>حاسبة المواريث الشرعية</Text>
            <Text style={styles.headerSubtitle}>Islamic Inheritance Calculator</Text>
          </View>

          {/* Madhab Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="school" size={20} color={theme.colors.primary.main} />
              <Text style={styles.sectionTitle}>اختر المذهب الفقهي</Text>
            </View>
            <MadhhabSelector selectedMadhab={madhab} onSelect={changeMadhab} />
          </View>

          {/* Estate Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="currency-usd" size={20} color={theme.colors.success.main} />
              <Text style={styles.sectionTitle}>بيانات التركة</Text>
            </View>
            <EstateInput onEstateChange={updateEstateData} initialEstate={estateData} />
          </View>

          {/* Heirs Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.warning.main} />
              <Text style={styles.sectionTitle}>الورثة</Text>
              {heirsMap.size > 0 && (
                <View style={styles.heirBadge}>
                  <Text style={styles.heirBadgeText}>
                    {getTotalHeirsCount()}
                  </Text>
                </View>
              )}
            </View>
            {/* IMPORTANT: Pass the onHeirsChange prop */}
            <HeirSelector onHeirsChange={handleHeirsChange} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, isCalculating && styles.buttonDisabled]}
              onPress={handleCalculate}
              disabled={isCalculating}
            >
              {isCalculating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <MaterialCommunityIcons name="calculator" size={20} color="#fff" />
                  <Text style={styles.primaryButtonText}>حساب الميراث</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleReset}
              disabled={isCalculating}
            >
              <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.primary.main} />
              <Text style={styles.secondaryButtonText}>إعادة تعيين</Text>
            </TouchableOpacity>
          </View>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <View style={styles.errorContainer}>
              {validationErrors.map((error, index) => (
                <Text key={index} style={styles.errorText}>• {error}</Text>
              ))}
            </View>
          )}

          {/* Results */}
          {showResults && result && result.success && (
            <View style={styles.resultsContainer}>
              <ResultsDisplay result={result} onClose={() => setShowResults(false)} />
            </View>
          )}
        </Animated.ScrollView>
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
    scrollView: {
      flex: 1,
    },
    header: {
      alignItems: 'center',
      paddingVertical: 24,
      backgroundColor: '#fff',
      marginBottom: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
      marginTop: 12,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 12,
      color: theme.colors.neutral.dark200,
    },
    section: {
      backgroundColor: '#fff',
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
      flex: 1,
    },
    heirBadge: {
      backgroundColor: theme.colors.primary.light,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    heirBadgeText: {
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
    primaryButton: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary.main,
      paddingVertical: 14,
      borderRadius: 12,
      gap: 8,
    },
    primaryButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#fff',
    },
    secondaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fff',
      paddingVertical: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
      gap: 8,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary.main,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    errorContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
      padding: 12,
      backgroundColor: theme.colors.error.light,
      borderRadius: 8,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.error.main,
    },
    errorText: {
      fontSize: 12,
      color: theme.colors.error.main,
      marginVertical: 2,
      textAlign: 'right',
    },
    resultsContainer: {
      marginHorizontal: 16,
      marginVertical: 8,
    },
  });