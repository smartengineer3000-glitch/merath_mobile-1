import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMadhab } from '../lib/context/MadhabContext';
import { useCalculator } from '../lib/hooks/useCalculator';
import { useResults } from '../lib/hooks/useResults';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function MadhhabComparisonScreen() {
  const { madhab, setMadhab } = useMadhab();
  const { calculateInheritance } = useCalculator();
  const { results, setResults } = useResults();
  const [comparisonResults, setComparisonResults] = useState<any[]>([]);

  const madhabs = ['hanafi', 'shafii', 'maliki', 'hanbali'];

  const handleCompare = async () => {
    const comparisons = [];
    for (const m of madhabs) {
      setMadhab(m);
      const result = await calculateInheritance();
      if (result) {
        comparisons.push({ madhab: m, result });
      }
    }
    setComparisonResults(comparisons);
    setResults(comparisons);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Madhhab Comparison</Text>
        <Text style={styles.subtitle}>Compare inheritance calculations across Islamic schools</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Select Case</Text>
        <Text style={styles.cardSubtitle}>Choose heirs and estate details</Text>
        {/* Add heir selection components here */}
        <TouchableOpacity style={styles.compareButton} onPress={handleCompare}>
          <MaterialCommunityIcons name="compare" size={24} color="#FFFFFF" />
          <Text style={styles.compareButtonText}>Compare Across Madhabs</Text>
        </TouchableOpacity>
      </Card>

      {comparisonResults.length > 0 && (
        <Card style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Comparison Results</Text>
          {comparisonResults.map((comp, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.madhabName}>{comp.madhab.toUpperCase()}</Text>
              <Text style={styles.resultText}>{JSON.stringify(comp.result, null, 2)}</Text>
            </View>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  compareButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  compareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  resultsCard: {
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  resultItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  madhabName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 14,
    color: '#333333',
    fontFamily: 'Inter-Regular',
  },
});