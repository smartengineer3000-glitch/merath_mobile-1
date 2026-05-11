/**
 * Root Navigator Configuration
 * Phase 6: App Integration & Navigation
 * 
 * Main navigation orchestration with bottom tab navigation
 * Integrates all screens and navigation flows
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, I18nManager, Platform } from 'react-native';
import { Ionicons } from '../lib/icons';
import { useSettings } from '../lib/context/SettingsContext';
import { languages } from '../lib/i18n';

// Types
import type { RootStackParamList, TabParamList } from './types';
import { linking } from './linking';

// Screens
import CalculatorScreen from '../screens/CalculatorScreen';
import HistoryScreen from '../screens/HistoryScreen';
import AuditTrail from '../screens/AuditTrailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';

// Allow RTL layouts on supported platforms, and dynamically update direction based on selected language.
if (Platform.OS !== 'web') {
  I18nManager.allowRTL(true);
}

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Tab Navigator
 * Provides bottom tab navigation between main screens
 */
export function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
          color: '#1F2937',
        },
        headerTitleAlign: 'center',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'calculator';

          if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'time' : 'time-outline';
          } else if (route.name === 'AuditTrail') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'About') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#9CA3AF',
        lazy: true,
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: 'حاسبة المواريث',
          tabBarLabel: 'الحاسبة',
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'سجل العمليات',
          tabBarLabel: 'السجل',
        }}
      />
      <Tab.Screen
        name="AuditTrail"
        component={AuditTrail}
        options={{
          title: 'سجل التدقيق',
          tabBarLabel: 'التدقيق',
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'الإعدادات',
          tabBarLabel: 'الإعدادات',
        }}
      />
      <Tab.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'حول التطبيق',
          tabBarLabel: 'حول',
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
  const navigationRef = React.useRef<any>(null);
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
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      }
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="MainApp"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;
