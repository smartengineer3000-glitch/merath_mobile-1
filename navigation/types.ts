/**
 * Navigation Type Definitions
 * Complete redesign with drawer navigation
 *
 * Defines all navigation types and parameter lists for the app
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { DrawerNavigationProp } from '@react-navigation/drawer';

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
export type DrawerNavigationProp = DrawerNavigationProp<DrawerParamList>;

/**
 * Stack Navigation Props Type
 * For use in any stack screen
 */
export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Calculator Navigation Props
 */
export type CalculatorNavigationProp = NativeStackNavigationProp<CalculatorParamList>;

/**
 * Generic navigation prop extractor
 * Usage: type Props = { navigation: NavigationOf<ScreenName> }
 */
export type NavigationOf<T extends keyof TabParamList> = BottomTabNavigationProp<
  TabParamList,
  T
>;

/**
 * Route Props Types
 */
export type CalculatorRouteParams = {
  route: import('@react-navigation/native').RouteProp<CalculatorParamList, 'Results'>;
};
