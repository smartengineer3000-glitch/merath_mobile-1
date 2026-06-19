import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMadhab } from '../lib/context/MadhabContext';
import { useCalculator } from '../lib/hooks/useCalculator';
import { useResults } from '../lib/hooks/useResults';
import { Card } from '../components/ui/Card';
import type { MadhhabType, CalculationResult } from '../lib/inheritance/types';

const ALL_MADHABS: MadhhabType[] = ['hanafi', 'shafii', 'maliki', 'hanbali'];

interface ComparisonEntry {
  madhab: MadhhabType;
  result: CalculationResult;
}

export default function MadhhabComparisonScreen() {
  const { madhab, setMadhab } = useMadhab();
  const { calculateWithMethod } = useCalculator();
  const [comparisonResults, setComparisonResults] = useState<ComparisonEntry[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = useCallback(async () => {
    try {
      setIsComparing(true);
      const comparisons: ComparisonEntry[] = [];
      for (const m of ALL_MADHABS) {
        const result = await calculateWithMethod(m, {});
        if (result) {
          comparisons.push({ madhab: m, result });
        }
      }
      setComparisonResults(comparisons);
    } catch (error) {
      Alert.alert('Error', 'Comparison failed. Please try again.');
    } finally {
      setIsComparing(false);
    }
  }, [calculateWithMethod]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Madhhab Comparison</Text>
        <Text style={styles.subtitle}>Compare inheritance calculations across Islamic schools</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Compare</Text>
        <Text style={styles.cardSubtitle}>Run calculations across all four madhabs</Text>
        <TouchableOpacity
          style={[styles.compareButton, isComparing && styles.compareButtonDisabled]}
          onPress={handleCompare}
          disabled={isComparing}
        >
          <MaterialCommunityIcons name="compare" size={24} color="#FFFFFF" />
          <Text style={styles.compareButtonText}>
            {isComparing ? 'Comparing...' : 'Compare Across Madhabs'}
          </Text>
        </TouchableOpacity>
      </Card>

      {comparisonResults.length > 0 && (
        <Card style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Comparison Results</Text>
          {comparisonResults.map((comp, index) => (
            <View key={index} style={styles.resultItem}>
              <Text style={styles.madhabName}>{comp.madhab.toUpperCase()}</Text>
              {comp.result.shares.map((share, si) => (
                <View key={si} style={styles.shareRow}>
                  <Text style={styles.shareName}>{share.name}</Text>
                  <Text style={styles.shareAmount}>
                    {share.percentage?.toFixed(2)}%
                  </Text>
                </View>
              ))}
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
  compareButtonDisabled: {
    opacity: 0.6,
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
  shareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  shareName: {
    fontSize: 14,
    color: '#333333',
  },
  shareAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
});
