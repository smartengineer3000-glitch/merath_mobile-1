/**
 * @file navigation/SettingsStack.tsx
 * @description Stack navigator for settings tab
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SettingsScreen } from "../screens/Settings/SettingsScreen";

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="SettingsHome"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      {/* More screens will be added here */}
    </Stack.Navigator>
  );
}
