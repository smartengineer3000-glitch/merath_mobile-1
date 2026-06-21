/**
 * Deep Linking Configuration
 * Phase 6: App Integration & Navigation
 *
 * Configures URL schemes and deep linking routes
 */

import { LinkingOptions } from "@react-navigation/native";
import type { RootStackParamList } from "./types";

/**
 * Linking configuration for deep linking support
 * Supports merath:// scheme and https://merath.app domain
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ["merath://", "https://merath.app", "https://www.merath.app"],
  config: {
    screens: {
      MainApp: {
        screens: {
          Calculator: "calculator",
          MadhhabComparison: "comparison",
          Test: "test",
          Settings: "settings",
          About: "about",
        },
      },
    },
  },
};

/**
 * Deep link route examples:
 *
 * merath://calculator
 * merath://comparison
 * merath://settings
 * merath://about
 *
 * https://merath.app/calculator
 * https://merath.app/comparison
 */

export const getDeepLink = (
  screen: string,
  params?: Record<string, string>,
): string => {
  let url = `merath://${screen}`;

  if (params) {
    const queryString = new URLSearchParams(params).toString();
    url += `?${queryString}`;
  }

  return url;
};
