import React, { useState } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useMadhab } from '../lib/context/MadhabContext';
import { useCalculator } from '../lib/hooks/useCalculator';
import { useResults } from '../lib/hooks/useResults';
import { EstateInput } from '../components/EstateInput';
import { HeirSelector } from '../components/HeirSelector';
import { CalculationButton } from '../components/CalculationButton';
import { ResultsDisplay } from '../components/ResultsDisplay';
import { Card } from '../components/ui/Card';

export default function CalculatorScreen() {
  const { madhab, setMadhab } = useMadhab();
  const { calculateInheritance } = useCalculator();
  const { result, setResult } = useResults();
  const [estateValue, setEstateValue] = useState('');
  const [selectedHeirs, setSelectedHeirs] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const madhabs = [
    { label: 'Hanafi', value: 'hanafi' },
    { label: 'Maliki', value: 'maliki' },
    { label: 'Shafi\'i', value: 'shafii' },
    { label: 'Hanbali', value: 'hanbali' },
  ];

  const heirTypes = [
    'husband', 'wife', 'son', 'daughter', 'father', 'mother',
    'paternal_grandfather', 'paternal_grandmother', 'maternal_grandmother',
    'full_brother', 'full_sister', 'paternal_brother', 'paternal_sister',
    'maternal_brother', 'maternal_sister',
  ];

  const handleHeirToggle = (heir: string) => {
    setSelectedHeirs(prev =>
      prev.includes(heir)
        ? prev.filter(h => h !== heir)
        : [...prev, heir]
    );
  };

  const handleCalculate = async () => {
    if (!estateValue || parseFloat(estateValue) <= 0) {
      Alert.alert('Error', 'Please enter a valid estate value');
      return;
    }

    if (selectedHeirs.length === 0) {
      Alert.alert('Error', 'Please select at least one heir');
      return;
    }

    try {
      const calculationResult = await calculateInheritance(
        parseFloat(estateValue),
        selectedHeirs,
        madhab
      );

      setResult(calculationResult);
      setShowResults(true);
    } catch (error) {
      Alert.alert('Error', 'Calculation failed. Please try again.');
    }
  };

  const handleReset = () => {
    setEstateValue('');
    setSelectedHeirs([]);
    setResult(null);
    setShowResults(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          entering={FadeInUp.duration(500)}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Inheritance Calculator</Text>
            <Text style={styles.subtitle}>Calculate Islamic inheritance shares</Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Madhab Selection</Text>
            <Text style={styles.cardSubtitle}>Choose your school of Islamic jurisprudence</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={madhab}
                onValueChange={setMadhab}
                style={styles.picker}
              >
                {madhabs.map((m) => (
                  <Picker.Item key={m.value} label={m.label} value={m.value} />
                ))}
              </Picker>
            </View>
          </Card>

          <Card style={styles.card}>
            <EstateInput
              value={estateValue}
              onChangeText={setEstateValue}
              placeholder="Enter estate value"
            />
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Heirs</Text>
            <Text style={styles.cardSubtitle}>Select all applicable heirs</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.heirsScrollView}
            >
              <View style={styles.heirsContainer}>
                {heirTypes.map((heir) => (
                  <TouchableOpacity
                    key={heir}
                    style={[
                      styles.heirChip,
                      selectedHeirs.includes(heir) && styles.heirChipSelected,
                    ]}
                    onPress={() => handleHeirToggle(heir)}
                  >
                    <Text
                      style={[
                        styles.heirChipText,
                        selectedHeirs.includes(heir) && styles.heirChipTextSelected,
                      ]}
                    >
                      {heir.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Card>

          <View style={styles.buttonContainer}>
            <CalculationButton
              title="Calculate"
              onPress={handleCalculate}
              disabled={!estateValue || selectedHeirs.length === 0}
              style={styles.calculateButton}
            />
            <CalculationButton
              title="Reset"
              onPress={handleReset}
              variant="secondary"
              style={styles.resetButton}
            />
          </View>

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    color: '#2E7D32',
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
    fontFamily: 'Inter-Regular',
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  picker: {
    height: 50,
  },
  heirsScrollView: {
    marginTop: 8,
  },
  heirsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 8,
  },
  heirChip: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  heirChipSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  heirChipText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  heirChipTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  calculateButton: {
    flex: 1,
    marginRight: 8,
  },
  resetButton: {
    flex: 1,
    marginLeft: 8,
  },
  resultsContainer: {
    marginTop: 16,
  },
});
