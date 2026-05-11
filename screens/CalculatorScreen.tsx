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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../lib/design/theme';
import { useCalculator, useMadhab, useHeirs, useAuditLog, useResults } from '../lib/inheritance/hooks';
import { PrimaryButton, OutlineButton } from '../components/ui/Button';
import MadhhabSelector from '../components/MadhhabSelector';
import EstateInput from '../components/EstateInput';
import HeirSelector from '../components/HeirSelector';
import ResultsDisplay from '../components/ResultsDisplay';
import type { HeirsData } from '../lib/inheritance/types';

export default function CalculatorScreen() {
  const { t } = useTranslation();
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
      errors.push(t('results.invalidEstate'));
    }
    
    const totalHeirs = getTotalHeirsCount();
    if (totalHeirs === 0) {
      errors.push(t('results.noHeirs'));
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  }, [estateData.total, getTotalHeirsCount]);

  // Handle calculation
  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) {
      Alert.alert(t('common.warning'), validationErrors.join('\n'));
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
        Alert.alert(t('common.error'), calculationResult?.error || t('results.error'));
      }
    } catch (error) {
      Alert.alert(t('common.error'), error instanceof Error ? error.message : t('common.error'));
    }
  }, [madhab, estateData, calculateWithMethod, validateInputs, validationErrors, getHeirsData, saveResult, logCalculation]);

  // Handle reset - clears ALL fields including madhab and heirs
  const handleReset = useCallback(() => {
    Alert.alert(
      t('calculator.resetConfirmationTitle'),
      t('calculator.resetConfirmationMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('calculator.clear'),
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
            <Text style={styles.headerTitle}>{t('calculator.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('app.subtitle')}</Text>
          </View>

          {/* Madhab Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="school" size={20} color={theme.colors.primary.main} />
              <Text style={styles.sectionTitle}>{t('madhab.title')}</Text>
            </View>
            <MadhhabSelector selectedMadhab={madhab} onSelect={changeMadhab} />
          </View>

          {/* Estate Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="currency-usd" size={20} color={theme.colors.success.main} />
              <Text style={styles.sectionTitle}>{t('estate.title')}</Text>
            </View>
            <EstateInput onEstateChange={updateEstateData} initialEstate={estateData} />
          </View>

          {/* Heirs Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="account-group" size={20} color={theme.colors.warning.main} />
              <Text style={styles.sectionTitle}>{t('heirs.title')}</Text>
              {heirsMap.size > 0 && (
                <View style={styles.heirBadge}>
                  <Text style={styles.heirBadgeText}>
                    {getTotalHeirsCount()}
                  </Text>
                </View>
              )}
            </View>
            <HeirSelector onHeirsChange={handleHeirsChange} />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <PrimaryButton
              title={t('calculator.calculate')}
              icon="calculator"
              iconPosition="left"
              fullWidth
              loading={isCalculating}
              disabled={isCalculating}
              onPress={handleCalculate}
              style={styles.primaryButton}
              accessibilityLabel={t('calculator.calculate')}
            />

            <OutlineButton
              title={t('calculator.clear')}
              icon="refresh"
              iconPosition="left"
              fullWidth
              disabled={isCalculating}
              onPress={handleReset}
              style={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              accessibilityLabel={t('calculator.clear')}
            />
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
      paddingHorizontal: 16,
      backgroundColor: theme.colors.primary.main,
      marginBottom: 12,
      borderBottomLeftRadius: 24,
      borderBottomRightRadius: 24,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: '#fff',
      marginTop: 12,
      marginBottom: 4,
      textAlign: 'center',
    },
    headerSubtitle: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.9)',
      fontWeight: '400',
    },
    section: {
      backgroundColor: '#fff',
      marginHorizontal: 12,
      marginVertical: 10,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 3,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.03)',
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.neutral.light200,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.neutral.dark300,
      flex: 1,
      letterSpacing: 0.2,
    },
    heirBadge: {
      backgroundColor: theme.colors.primary.light,
      borderRadius: 14,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
      minWidth: 32,
      alignItems: 'center',
    },
    heirBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.primary.main,
    },
    actionContainer: {
      flexDirection: 'row',
      marginHorizontal: 12,
      marginVertical: 20,
      gap: 10,
    },
    primaryButton: {
      flex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary.main,
      paddingVertical: 16,
      borderRadius: 14,
      gap: 8,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    primaryButtonText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#fff',
      letterSpacing: 0.3,
    },
    secondaryButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.neutral.light50,
      paddingVertical: 16,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: theme.colors.primary.main,
      gap: 6,
    },
    secondaryButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.primary.main,
      letterSpacing: 0.25,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    errorContainer: {
      marginHorizontal: 12,
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