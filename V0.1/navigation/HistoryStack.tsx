/**
 * @file navigation/HistoryStack.tsx
 * @description Stack navigator for history tab
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HistoryScreen } from "../screens/History/HistoryScreen";

const Stack = createNativeStackNavigator();

export function HistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="HistoryHome"
        component={HistoryScreen}
        options={{ title: "History" }}
      />
      {/* More screens will be added here */}
    </Stack.Navigator>
  );
}
