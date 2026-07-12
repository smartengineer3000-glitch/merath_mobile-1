import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CalculatorScreen from "../../screens/calculator/CalculatorScreen";
import ResultsScreen from "../../screens/results/ResultsScreen";

const Stack = createNativeStackNavigator();

export function CalculatorStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalculatorHome" component={CalculatorScreen} />
      <Stack.Screen name="Results" component={ResultsScreen} />
    </Stack.Navigator>
  );
}
