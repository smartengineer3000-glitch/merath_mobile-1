/**
 * Root Navigator Configuration
 * Complete redesign with bottom tab navigation
 *
 * Modern navigation using accessible tabs
 * Integrates required screens only
 */

import React, { Suspense, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, I18nManager, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSettings } from '../lib/context/SettingsContext';
import { useAppTheme } from '../lib/context/ThemeProvider';
import { languages } from '../lib/i18n';

// Types
import type { RootStackParamList, TabParamList } from './types';
import { linking } from './linking';

// Screens — CalculatorScreen is eagerly loaded (landing screen);
// heavier screens are lazy-loaded to improve startup time.
import CalculatorScreen from '../screens/CalculatorScreen';

const MadhhabComparisonScreen = React.lazy(() => import('../screens/MadhhabComparisonScreen'));
const TestScreen = React.lazy(() => import('../screens/TestScreen'));
const SettingsScreen = React.lazy(() => import('../screens/SettingsScreen'));
const AboutScreen = React.lazy(() => import('../screens/AboutScreen'));

function LazyFallback() {
  const { theme } = useAppTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.lightVariant }}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
    </View>
  );
}

function withSuspense<P extends object>(LazyComponent: React.LazyExoticComponent<React.ComponentType<P>>) {
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
const LazyAboutScreen = withSuspense(AboutScreen);

// Allow RTL layouts on supported platforms, and dynamically update direction based on selected language.
if (Platform.OS !== 'web') {
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
        tabBarStyle: {
          backgroundColor: theme.colors.background.light,
          borderTopColor: theme.colors.neutral.light300,
          minHeight: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
        },
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.neutral.dark200,
        tabBarIcon: ({ color, size }) => {
          const icons: Record<keyof TabParamList, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
            Calculator: 'calculator',
            MadhhabComparison: 'compare',
            Test: 'test-tube',
            Settings: 'cog',
            About: 'information',
          };

          return <MaterialCommunityIcons name={icons[route.name]} color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="Calculator"
        component={CalculatorScreen}
        options={{
          title: 'Calculator',
          tabBarLabel: 'Calculator',
        }}
      />
      <Tab.Screen
        name="MadhhabComparison"
        component={LazyMadhhabComparison}
        options={{
          title: 'Madhhab Comparison',
          tabBarLabel: 'Compare',
        }}
      />
      {__DEV__ && (
        <Tab.Screen
          name="Test"
          component={LazyTestScreen}
          options={{
            title: 'Test',
            tabBarLabel: 'Test',
          }}
        />
      )}
      <Tab.Screen
        name="Settings"
        component={LazySettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
        }}
      />
      <Tab.Screen
        name="About"
        component={LazyAboutScreen}
        options={{
          title: 'About',
          tabBarLabel: 'About',
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
    if (Platform.OS === 'web') return;

    const desiredRTL = languages[state.language]?.rtl ?? false;
    if (I18nManager.isRTL !== desiredRTL) {
      Alert.alert(
        'Language change',
        desiredRTL
          ? 'تم اختيار لغة من اليمين إلى اليسار. لإكمال التغيير، يرجى إعادة تشغيل التطبيق.'
          : 'تم اختيار لغة من اليسار إلى اليمين. لإكمال التغيير، يرجى إعادة تشغيل التطبيق.',
        [{ text: 'OK' }]
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default RootNavigator;
