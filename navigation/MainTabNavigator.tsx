import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { Ionicons } from "../lib/icons";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CalculatorStack } from "./CalculatorStack";
import { HistoryStack } from "./HistoryStack";
import { ComparisonStack } from "./ComparisonStack";
import { SettingsStack } from "./SettingsStack";
import { useCalculationStore } from "../lib/context/CalculationContext";

const Tab = createBottomTabNavigator();

const TAB_ICONS: Record<string, { focused: string; default: string }> = {
  Calculator: { focused: "calculator", default: "calculator-outline" },
  History: { focused: "time", default: "time-outline" },
  Compare: { focused: "git-compare", default: "git-compare-outline" },
  Settings: { focused: "settings", default: "settings-outline" },
};

export function MainTabNavigator() {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { logEvent } = useCalculationStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name] || TAB_ICONS.Calculator;
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.light400,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          fontFamily: theme.fontFamily.english,
          marginBottom: Platform.OS === "ios" ? 0 : 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.background.light,
          borderTopColor: theme.colors.neutral.light200,
          height: (Platform.OS === "ios" ? 88 : 64) + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
          ...theme.shadows.sm,
        },
      })}
      screenListeners={({ route }) => ({
        focus: () => {
          logEvent("screen_view", `Navigated to ${route.name}`);
        },
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorStack}
        options={{ tabBarLabel: t("navigation.calculator") }}
      />
      <Tab.Screen
        name="History"
        component={HistoryStack}
        options={{ tabBarLabel: t("navigation.history") }}
      />
      <Tab.Screen
        name="Compare"
        component={ComparisonStack}
        options={{ tabBarLabel: t("navigation.comparison") }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{ tabBarLabel: t("navigation.settings") }}
      />
    </Tab.Navigator>
  );
}
