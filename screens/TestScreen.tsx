import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCalculator } from '../lib/hooks/useCalculator';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function TestScreen() {
  const { calculateInheritance } = useCalculator();
  const [testResults, setTestResults] = useState<any[]>([]);
  const [customInput, setCustomInput] = useState('');

  const runBasicTest = async () => {
    // Run a basic test case
    const result = await calculateInheritance();
    if (result) {
      setTestResults([{ name: 'Basic Test', result, passed: true }]);
    } else {
      setTestResults([{ name: 'Basic Test', result: null, passed: false }]);
    }
  };

  const runCustomTest = async () => {
    // Parse custom input and run test
    try {
      const input = JSON.parse(customInput);
      // Apply custom input to calculator state
      const result = await calculateInheritance();
      setTestResults(prev => [...prev, { name: 'Custom Test', result, passed: !!result }]);
    } catch (error) {
      Alert.alert('Error', 'Invalid JSON input');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculator Tests</Text>
        <Text style={styles.subtitle}>Test inheritance calculations and edge cases</Text>
      </View>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Basic Test</Text>
        <Text style={styles.cardSubtitle}>Run a standard inheritance calculation test</Text>
        <TouchableOpacity style={styles.testButton} onPress={runBasicTest}>
          <MaterialCommunityIcons name="play" size={24} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Run Basic Test</Text>
        </TouchableOpacity>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Custom Test</Text>
        <Text style={styles.cardSubtitle}>Enter custom test data (JSON format)</Text>
        <TextInput
          style={styles.input}
          value={customInput}
          onChangeText={setCustomInput}
          placeholder='{"estate": 100000, "heirs": {...}}'
          multiline
        />
        <TouchableOpacity style={styles.testButton} onPress={runCustomTest}>
          <MaterialCommunityIcons name="test-tube" size={24} color="#FFFFFF" />
          <Text style={styles.testButtonText}>Run Custom Test</Text>
        </TouchableOpacity>
      </Card>

      {testResults.length > 0 && (
        <Card style={styles.resultsCard}>
          <Text style={styles.resultsTitle}>Test Results</Text>
          {testResults.map((test, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.resultHeader}>
                <Text style={styles.testName}>{test.name}</Text>
                <MaterialCommunityIcons
                  name={test.passed ? 'check-circle' : 'close-circle'}
                  size={24}
                  color={test.passed ? '#4CAF50' : '#F44336'}
                />
              </View>
              {test.result && (
                <Text style={styles.resultText}>{JSON.stringify(test.result, null, 2)}</Text>
              )}
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
  testButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter-Regular',
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
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  testName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  resultText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
});