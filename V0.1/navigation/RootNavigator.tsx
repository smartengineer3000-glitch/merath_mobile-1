/**
 * @file navigation/RootNavigator.tsx
 * @description Main navigation structure with bottom tab navigator
 */

import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { CalculatorStack } from "./CalculatorStack";
import { ResultsStack } from "./ResultsStack";
import { ComparisonStack } from "./ComparisonStack";
import { HistoryStack } from "./HistoryStack";
import { SettingsStack } from "./SettingsStack";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const { t } = useTranslation();
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.light400,
        tabBarStyle: {
          backgroundColor: theme.colors.background.light,
          borderTopColor: theme.colors.neutral.light200,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorStack}
        options={{
          tabBarLabel: t("navigation.calculator"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="calculator" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsStack}
        options={{
          tabBarLabel: t("navigation.results"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="results" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Comparison"
        component={ComparisonStack}
        options={{
          tabBarLabel: t("navigation.comparison"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="comparison" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{
          tabBarLabel: t("navigation.history"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="history" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: t("navigation.settings"),
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Temporary tab icon component (will be replaced with proper icons)
function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  const icons: Record<string, string> = {
    calculator: "🧮",
    results: "📊",
    comparison: "⚖️",
    history: "📜",
    settings: "⚙️",
  };

  return <Text style={{ color, fontSize: size }}>{icons[name] || "•"}</Text>;
}
