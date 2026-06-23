/**
 * @file lib/hooks/useFonts.ts
 * @description Custom hook for loading Google Fonts
 * Culturally appropriate fonts for Arabic and English
 */

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

/**
 * Custom hook to load and manage fonts
 * Returns fonts loaded status and hides splash screen when ready
 *
 * Note: Font files need to be added to assets/fonts/ directory:
 * - Cairo-Regular.ttf
 * - Cairo-Bold.ttf
 * - PlusJakartaSans-Regular.ttf
 * - PlusJakartaSans-Bold.ttf
 *
 * Download from: https://fonts.google.com/
 *
 * TEMPORARY: Using system fonts until font files are added
 */
export function useCustomFonts() {
  // TEMPORARY: Use system fonts until actual font files are added
  // This prevents the app from crashing while we set up the fonts
  const [fontsLoaded, fontError] = useFonts({
    // Commented out until font files are added to assets/fonts/
    // Cairo: require("../../assets/fonts/Cairo-Regular.ttf"),
    // Cairo_Bold: require("../../assets/fonts/Cairo-Bold.ttf"),
    // PlusJakartaSans: require("../../assets/fonts/PlusJakartaSans-Regular.ttf"),
    // PlusJakartaSans_Bold: require("../../assets/fonts/PlusJakartaSans-Bold.ttf"),
  });

  // Hide splash screen when fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return {
    fontsLoaded: true, // Always return true for now since we're using system fonts
    fontError: null,
  };
}
