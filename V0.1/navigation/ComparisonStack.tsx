/**
 * @file navigation/ComparisonStack.tsx
 * @description Stack navigator for comparison tab
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ComparisonScreen } from "../screens/Comparison/ComparisonScreen";

const Stack = createNativeStackNavigator();

export function ComparisonStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="ComparisonHome"
        component={ComparisonScreen}
        options={{ title: "Comparison" }}
      />
      {/* More screens will be added here */}
    </Stack.Navigator>
  );
}
