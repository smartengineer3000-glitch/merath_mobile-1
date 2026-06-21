import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, I18nManager, Platform } from "react-native";
import { Icon } from "../components/Icon";
import { useSettings } from "../lib/context/SettingsContext";
import { languages } from "../lib/i18n";

// Types
import type { RootStackParamList, DrawerParamList } from "./types";
import { linking } from "./linking";

// Existing screens
import CalculatorScreen from "../screens/CalculatorScreen";
import { MadhhabComparisonScreen } from "../screens/MadhhabComparisonScreen";
import TestScreen from "../screens/TestScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AboutScreen from "../screens/AboutScreen";

// New wizard screens
import { CalculationProvider } from '../lib/context/CalculationContext';
import { EstateSetupStep } from '../screens/Calculator/EstateSetupStep';
import { MadhabSelectStep } from '../screens/Calculator/MadhabSelectStep';
import { HeirSelectionStep } from '../screens/Calculator/HeirSelectionStep';
import { ResultsStep } from '../screens/Calculator/ResultsStep';

// Allow RTL on supported platforms
if (Platform.OS !== "web") {
  I18nManager.allowRTL(true);
}

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();
const WizardStack = createNativeStackNavigator();

function CalculatorWizardFlow() {
  return (
    <CalculationProvider>
      <WizardStack.Navigator screenOptions={{ headerShown: false }}>
        <WizardStack.Screen name="EstateSetup" component={EstateSetupStep} />
        <WizardStack.Screen name="MadhabSelect" component={MadhabSelectStep} />
        <WizardStack.Screen name="HeirSelection" component={HeirSelectionStep} />
        <WizardStack.Screen name="Results" component={ResultsStep} />
      </WizardStack.Navigator>
    </CalculationProvider>
  );
}

/**
 * Drawer Navigator
 * Provides drawer navigation with modern design
 */
export function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        },
        headerTintColor: "#2E7D32",
        headerTitleStyle: {
          fontFamily: "Inter-Bold",
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: "#FFFFFF",
          width: 280,
        },
        drawerLabelStyle: {
          fontFamily: "Inter-Regular",
          fontSize: 16,
        },
        drawerActiveTintColor: "#2E7D32",
        drawerInactiveTintColor: "#666666",
      })}
    >
      <Drawer.Screen
        name="Calculator"
        component={CalculatorWizardFlow}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon
              name="calculator"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MadhhabComparison"
        component={MadhhabComparisonScreen}
        options={{
          title: "Madhhab Comparison",
          drawerIcon: ({ color, size }) => (
            <Icon name="compare" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="Test"
        component={TestScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon
              name="test-tube"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon
              name="information"
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

/**
 * Root Navigator
 * Main navigation container with stack for handling modals/wizard
 */
export function RootNavigator() {
  const navigationRef = React.useRef<any>(null);
  const { state } = useSettings();

  useEffect(() => {
    if (Platform.OS !== "web") {
      const desiredRTL = languages[state.language]?.rtl ?? false;
      if (I18nManager.isRTL !== desiredRTL) {
        I18nManager.forceRTL(desiredRTL);
      }
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
          <ActivityIndicator size="large" color="#2E7D32" />
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainApp"
          component={DrawerNavigator}
          options={{ headerShown: false }}
        />
        {/* New professional wizard – full screen without drawer */}
        <Stack.Screen
          name="CalculatorWizard"
          component={CalculatorWizardFlow}
          options={{ title: "New Calculator", headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
