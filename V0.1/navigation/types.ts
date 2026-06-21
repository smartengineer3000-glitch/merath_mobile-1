/**
 * Navigation Type Definitions
 * Complete redesign with bottom tab navigation
 *
 * Defines all navigation types and parameter lists for the app
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { RouteProp } from '@react-navigation/native';

/**
 * Root Stack Parameter List
 * Defines top-level navigation screens
 */
export type RootStackParamList = {
  MainApp: undefined;
  Details: { id: string };
  Error: { message: string };
};

/**
 * Tab Parameter List
 * Defines bottom tab screens
 */
export type TabParamList = {
  Calculator: undefined;
  Results: undefined;
  MadhhabComparison: undefined;
  Test: undefined;
  Settings: undefined;
  About: undefined;
};

/**
 * Calculator Stack Param List
 * Specific parameters for calculator navigation
 */
export type CalculatorParamList = {
  Main: undefined;
  Results: { calculationId: string };
};

/**
 * Navigation Props Type
 * For use in any tab screen
 */
export type AppTabNavigationProp = BottomTabNavigationProp<TabParamList>;

/**
 * Stack Navigation Props Type
 * For use in any stack screen
 */
export type AppStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Calculator Navigation Props
 */
export type CalculatorNavigationProp = NativeStackNavigationProp<CalculatorParamList>;

/**
 * Route Props Types
 */
export type CalculatorRouteParams = {
  route: RouteProp<CalculatorParamList, 'Results'>;
};
