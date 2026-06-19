/**
 * Root Navigator Configuration
 * Complete redesign with drawer navigation
 *
 * Modern navigation using drawer with dropdown sections
 * Integrates required screens only
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, I18nManager, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '../lib/context/SettingsContext';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { languages } from '../lib/i18n';

// Types
import type { RootStackParamList, DrawerParamList } from './types';
import { linking } from './linking';

// Screens
import CalculatorScreen from '../screens/CalculatorScreen';
import MadhhabComparisonScreen from '../screens/MadhhabComparisonScreen';
import TestScreen from '../screens/TestScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

// Allow RTL layouts on supported platforms, and dynamically update direction based on selected language.
if (Platform.OS !== 'web') {
  I18nManager.allowRTL(true);
}

const Drawer = createDrawerNavigator<DrawerParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Drawer Navigator
 * Provides drawer navigation with modern design
 */
export function DrawerNavigator() {
  const { theme } = useAppTheme();

  return (
    <Drawer.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background.light,
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.neutral.light300,
        },
        headerTintColor: theme.colors.primary.main,
        headerTitleStyle: {
          fontFamily: 'Inter-Bold',
          fontSize: 18,
        },
        drawerStyle: {
          backgroundColor: theme.colors.background.light,
          width: 280,
        },
        drawerLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 16,
        },
        drawerActiveTintColor: theme.colors.primary.main,
        drawerInactiveTintColor: theme.colors.neutral.dark200,
      })}
    >
      <Drawer.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calculator" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="MadhhabComparison"
        component={MadhhabComparisonScreen}
        options={{
          title: 'Madhhab Comparison',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="compare" color={color} size={size} />
          ),
        }}
      />
      {__DEV__ && (
        <Drawer.Screen
          name="Test"
          component={TestScreen}
          options={{
            drawerIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="test-tube" color={color} size={size} />
            ),
          }}
        />
      )}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="information" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

/**
 * Root Navigator
 * Main navigation container with stack for handling modals/errors
 */
export function RootNavigator() {
  const navigationRef = React.useRef(null);
  const { state } = useSettings();

  useEffect(() => {
    if (Platform.OS !== 'web') {
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;
