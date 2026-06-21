/**
 * Navigation Type Definitions
 * Complete redesign with drawer navigation
 *
 * Defines all navigation types and parameter lists for the app
 */

import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { DrawerNavigationProp as RNDrawerNavigationProp } from "@react-navigation/drawer";

/**
 * Root Stack Parameter List
 * Defines top-level navigation screens
 */
export type RootStackParamList = {
  CalculatorWizard: undefined;
  MadhhabComparison: undefined;
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
export type DrawerNavigationProp = RNDrawerNavigationProp<DrawerParamList>;

/**
 * Stack Navigation Props Type
 * For use in any stack screen
 */
export type StackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

/**
 * Calculator Navigation Props
 */
export type CalculatorNavigationProp =
  NativeStackNavigationProp<CalculatorParamList>;

/**
 * Route Props Types
 */
export type CalculatorRouteParams = {
  route: import("@react-navigation/native").RouteProp<
    CalculatorParamList,
    "Results"
  >;
};
