/**
 * @file navigation/CalculatorStack.tsx
 * @description Stack navigator for calculator tab
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CalculatorScreen } from "../screens/Calculator/CalculatorScreen";

const Stack = createNativeStackNavigator();

export function CalculatorStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="CalculatorHome"
        component={CalculatorScreen}
        options={{ title: "Calculator" }}
      />
      {/* More screens will be added here */}
    </Stack.Navigator>
  );
}
