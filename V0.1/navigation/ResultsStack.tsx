/**
 * @file navigation/ResultsStack.tsx
 * @description Stack navigator for results tab
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ResultsScreen } from "../screens/Results/ResultsScreen";

const Stack = createNativeStackNavigator();

export function ResultsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="ResultsHome"
        component={ResultsScreen}
        options={{ title: "Results" }}
      />
      {/* More screens will be added here */}
    </Stack.Navigator>
  );
}
