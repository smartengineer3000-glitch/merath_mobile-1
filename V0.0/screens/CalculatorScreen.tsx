import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { EstateInput } from "../components/EstateInput";
import { HeirSelector } from "../components/HeirSelector";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { useCalculator, useMadhab } from "../lib/inheritance/hooks";
import type { HeirsData, MadhhabType } from "../lib/inheritance/types";

export default function CalculatorScreen() {
  const { madhab, changeMadhab } = useMadhab();
  const { calculateWithMethod, result, resetCalculator } = useCalculator();
  const [heirs, setHeirs] = useState<HeirsData>({});
  const [showResults, setShowResults] = useState(false);

  const madhabs: { label: string; value: MadhhabType }[] = [
    { label: "Hanafi", value: "hanafi" },
    { label: "Maliki", value: "maliki" },
    { label: "Shafi'i", value: "shafii" },
    { label: "Hanbali", value: "hanbali" },
  ];

  const handleCalculate = async () => {
    if (Object.keys(heirs).length === 0) {
      return Alert.alert("Error", "Please select at least one heir");
    }

    try {
      const calculationResult = await calculateWithMethod(madhab, heirs);
      if (calculationResult && calculationResult.success) {
        setShowResults(true);
      } else {
        setShowResults(false);
        Alert.alert(
          "Error",
          calculationResult?.error || "Calculation failed. Please try again.",
        );
      }
    } catch (error) {
      setShowResults(false);
      Alert.alert("Error", "Calculation failed. Please try again.");
    }
  };

  const handleReset = () => {
    setHeirs({});
    resetCalculator();
    setShowResults(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Inheritance Calculator</Text>
            <Text style={styles.subtitle}>
              Calculate Islamic inheritance shares
            </Text>
          </View>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Madhab Selection</Text>
            <Text style={styles.cardSubtitle}>
              Choose your school of Islamic jurisprudence
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={madhab}
                onValueChange={(value) => changeMadhab(value as MadhhabType)}
                style={styles.picker}
              >
                {madhabs.map((m) => (
                  <Picker.Item key={m.value} label={m.label} value={m.value} />
                ))}
              </Picker>
            </View>
          </Card>

          <Card style={styles.card}>
            <EstateInput />
          </Card>

          <Card style={styles.card}>
            <Text style={styles.cardTitle}>Heirs</Text>
            <Text style={styles.cardSubtitle}>Select all applicable heirs</Text>
            <HeirSelector onHeirsChange={setHeirs} />
          </Card>

          <View style={styles.buttonContainer}>
            <Button
              children="Calculate"
              onPress={handleCalculate}
              disabled={Object.keys(heirs).length === 0}
              style={styles.calculateButton}
            />
            <Button
              children="Reset"
              onPress={handleReset}
             
              style={styles.resetButton}
            />
          </View>

          {showResults && result?.success && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultHeader}>Calculation complete.</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
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
    fontWeight: "bold",
    color: "#2E7D32",
    fontFamily: "Inter-Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    marginTop: 8,
    fontFamily: "Inter-Regular",
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 8,
    fontFamily: "Inter-Bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 16,
    fontFamily: "Inter-Regular",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
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
  resultHeader: {
    fontSize: 16,
    color: "#2E7D32",
    fontFamily: "Inter-Regular",
  },
});
