/**
 * Navigation Type Definitions
 * Complete redesign with drawer navigation
 *
 * Defines all navigation types and parameter lists for the app
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
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
 * Drawer Parameter List
 * Defines drawer screens
 */
export type DrawerParamList = {
  Calculator: undefined;
  MadhhabComparison: undefined;
  Test: undefined;
  Settings: undefined;
  About: undefined;
};

/**
 * Calculator Drawer Param List
 * Specific parameters for calculator navigation
 */
export type CalculatorParamList = {
  Main: undefined;
  Results: { calculationId: string };
};

/**
 * Navigation Props Type
 * For use in any drawer screen
 */
export type AppDrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;

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
