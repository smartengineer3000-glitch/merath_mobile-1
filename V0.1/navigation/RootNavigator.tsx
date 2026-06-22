/**
 * Root Navigator Configuration
 * Complete redesign with bottom tab navigation
 *
 * Modern navigation using accessible tabs
 * Integrates required screens only
 */

import React, { Suspense, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  ActivityIndicator,
  I18nManager,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSettings } from "../lib/context/SettingsContext";
import { useAppTheme } from "../lib/context/ThemeProvider";
import { languages } from "../lib/i18n";

// Types
import type { RootStackParamList, TabParamList } from "./types";
import { linking } from "./linking";

// Screens — CalculatorScreen is eagerly loaded (landing screen);
// ResultsScreen is eagerly loaded (frequently accessed after calculation);
// heavier screens are lazy-loaded to improve startup time.
import CalculatorScreen from "../screens/CalculatorScreen";
import ResultsScreen from "../screens/ResultsScreen";

const MadhhabComparisonScreen = React.lazy(
  () => import("../screens/MadhhabComparisonScreen"),
);
const TestScreen = React.lazy(() => import("../screens/TestScreen"));
const SettingsScreen = React.lazy(() => import("../screens/SettingsScreen"));

function LazyFallback() {
  const { theme } = useAppTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background.lightVariant,
      }}
    >
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
    </View>
  );
}

function withSuspense<P extends object>(
  LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>,
) {
  return function SuspenseWrapper(props: P) {
    return (
      <Suspense fallback={<LazyFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

const LazyMadhhabComparison = withSuspense(MadhhabComparisonScreen);
const LazyTestScreen = withSuspense(TestScreen);
const LazySettingsScreen = withSuspense(SettingsScreen);

// Allow RTL layouts on supported platforms, and dynamically update direction based on selected language.
if (Platform.OS !== "web") {
  I18nManager.allowRTL(true);
}

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Tab Navigator
 * Provides quick access to primary app workflows
 */
export function TabNavigator() {
  const { theme } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background.light,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.neutral.light300,
        },
        headerTintColor: theme.colors.primary.main,
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.getParent()?.navigate("SettingsModal")}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
            style={{ paddingHorizontal: 8, paddingVertical: 4 }}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color={theme.colors.primary.main}
            />
          </TouchableOpacity>
        ),
        tabBarStyle: {
          backgroundColor: theme.colors.background.light,
          borderTopColor: theme.colors.neutral.light300,
          minHeight: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter-Regular",
          fontSize: 12,
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.dark200,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<
            keyof TabParamList,
            React.ComponentProps<typeof MaterialCommunityIcons>["name"]
          > = {
            Calculator: "calculator",
            Results: "chart-box",
            MadhhabComparison: "compare",
            Test: "lightning-bolt",
          };

          return (
            <MaterialCommunityIcons
              name={icons[route.name]}
              color={color}
              size={size}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: "Calculator",
          tabBarLabel: "Calculator",
        }}
      />
      <Tab.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          title: "Results",
          tabBarLabel: "Results",
        }}
      />
      <Tab.Screen
        name="MadhhabComparison"
        component={LazyMadhhabComparison}
        options={{
          title: "Madhhab Comparison",
          tabBarLabel: "Compare",
        }}
      />
      <Tab.Screen
        name="Test"
        component={LazyTestScreen}
        options={{
          title: "Real Test Cases",
          tabBarLabel: "Test Cases",
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Root Navigator
 * Main navigation container with stack for handling modals/errors
 */
export function RootNavigator() {
  const navigationRef = React.useRef(null);
  const { state } = useSettings();
  const { theme } = useAppTheme();

  useEffect(() => {
    if (Platform.OS === "web") return;

    const desiredRTL = languages[state.language]?.rtl ?? false;
    if (I18nManager.isRTL !== desiredRTL) {
      Alert.alert(
        "Language change",
        desiredRTL
          ? "تم اختيار لغة من اليمين إلى اليسار. لإكمال التغيير، يرجى إعادة تشغيل التطبيق."
          : "تم اختيار لغة من اليسار إلى اليمين. لإكمال التغيير، يرجى إعادة تشغيل التطبيق.",
        [{ text: "OK" }],
      );

      I18nManager.forceRTL(desiredRTL);
      I18nManager.swapLeftAndRightInRTL(true);
    }
  }, [state.language]);

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SettingsModal"
          component={LazySettingsScreen}
          options={{
            presentation: "modal",
            headerShown: true,
            title: "Settings",
            headerStyle: { backgroundColor: theme.colors.background.light },
            headerTintColor: theme.colors.primary.main,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
