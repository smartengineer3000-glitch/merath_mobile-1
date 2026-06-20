import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMadhab } from '../lib/context/MadhabContext';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { useCalculator } from '../lib/hooks/useCalculator';
import { useResults } from '../lib/hooks/useResults';
import { EstateInput } from '../components/EstateInput';
import { HeirSelector } from '../components/HeirSelector';
import { MadhhabSelector } from '../components/MadhhabSelector';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Card } from '../components/ui/Card';
import type { Theme } from '../lib/design/theme';
import type { EstateData, HeirsData } from '../lib/inheritance/types';

export default function CalculatorScreen() {
  const { madhab, setMadhab } = useMadhab();
  const { theme } = useAppTheme();
  const { calculateWithMethod } = useCalculator();
  const { result, setResult, clearResults } = useResults();
  const [showResults, setShowResults] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [currentEstate, setCurrentEstate] = useState<EstateData>({
    total: 0,
    funeral: 0,
    debts: 0,
    will: 0,
  });
  const [currentHeirs, setCurrentHeirs] = useState<HeirsData>({});

  const handleEstateChange = useCallback((estate: EstateData) => {
    setCurrentEstate(estate);
  }, []);

  const handleHeirsChange = useCallback((heirs: HeirsData) => {
    setCurrentHeirs(heirs);
  }, []);

  const handleCalculate = useCallback(async () => {
    if (currentEstate.total <= 0) {
      Alert.alert('Error', 'Please enter a valid estate value');
      return;
    }

    const hasHeirs = Object.values(currentHeirs).some(v => (v ?? 0) > 0);
    if (!hasHeirs) {
      Alert.alert('Error', 'Please select at least one heir');
      return;
    }

    try {
      setIsCalculating(true);
      const calculationResult = await calculateWithMethod(madhab, currentHeirs);
      if (calculationResult) {
        setResult(calculationResult);
        setShowResults(true);
      }
    } catch (error) {
      Alert.alert('Error', 'Calculation failed. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  }, [madhab, currentEstate, currentHeirs, calculateWithMethod, setResult]);

  const handleReset = useCallback(() => {
    setCurrentEstate({ total: 0, funeral: 0, debts: 0, will: 0 });
    setCurrentHeirs({});
    clearResults();
    setShowResults(false);
  }, [clearResults]);

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Inheritance Calculator</Text>
            <Text style={styles.subtitle}>Calculate Islamic inheritance shares</Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Madhab Selection</Text>
            <Text style={styles.cardSubtitle}>Choose your school of Islamic jurisprudence</Text>
            <MadhhabSelector selectedMadhab={madhab} onSelect={setMadhab} />
          </Card>

          <Card style={styles.card}>
            <EstateInput onEstateChange={handleEstateChange} />
          </Card>

          <Card style={styles.card}>
            <HeirSelector onHeirsChange={handleHeirsChange} />
          </Card>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.calculateButton, isCalculating && styles.buttonDisabled]}
              onPress={handleCalculate}
              disabled={isCalculating}
            >
              <MaterialCommunityIcons name="calculator" size={20} color={theme.colors.background.light} />
              <Text style={styles.calculateButtonText}>
                {isCalculating ? 'Calculating...' : 'Calculate'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <MaterialCommunityIcons name="refresh" size={20} color={theme.colors.primary.main} />
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>

          {showResults && result && (
            <View style={styles.resultsContainer}>
              <ResultsDisplay result={result} onClose={() => setShowResults(false)} />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background.lightVariant,
    },
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.primary.main,
      fontFamily: 'Inter-Bold',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.neutral.main,
      marginTop: 8,
      fontFamily: 'Inter-Regular',
    },
    card: {
      marginBottom: 16,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.neutral.dark300,
      marginBottom: 8,
      fontFamily: 'Inter-Bold',
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.colors.neutral.main,
      marginBottom: 16,
      fontFamily: 'Inter-Regular',
    },
    buttonContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    calculateButton: {
      flex: 1,
      backgroundColor: theme.colors.primary.main,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 8,
      gap: 8,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    calculateButtonText: {
      color: theme.colors.background.light,
      fontSize: 16,
      fontWeight: 'bold',
    },
    resetButton: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.primary.main,
      gap: 8,
    },
    resetButtonText: {
      color: theme.colors.primary.main,
      fontSize: 16,
      fontWeight: 'bold',
    },
    resultsContainer: {
      marginBottom: 16,
    },
  });
