/**
 * @file App.tsx
 * @description Root application component with providers, navigation, and global features
 *
 * FIXES: Timeout ref type, add missing imports, FONT LOADING
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import "./lib/i18n";

// ===== FONT IMPORTS - CRITICAL FOR DESIGN SYSTEM =====
// These fonts must be loaded for the design system to work
import "@fontsource/cairo";
import "@fontsource/plus-jakarta-sans";

import { useTranslation } from "react-i18next";
import { ThemeProvider, useAppTheme } from "./lib/context/ThemeProvider";
import { SettingsProvider } from "./lib/context/SettingsContext";
import { MadhabProvider } from "./lib/context/MadhabContext";
import { CalculationProvider } from "./lib/context/CalculationContext";
import { RootNavigator } from "./navigation/RootNavigator";
import { ErrorBoundary } from "./components/feedback/ErrorBoundary";
import { DisclaimersModal } from "./components/DisclaimersModal";
import { LoadingScreen } from "./screens/shared/LoadingScreen";
import {
  OnboardingScreen,
  shouldShowOnboarding,
} from "./screens/onboarding/OnboardingScreen";

const APP_LAUNCH_COUNT_KEY = "@merath_launch_count";

// ===== FIX: Network status component =====
const NetworkStatusIndicator = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // ===== FIX: Proper timeout ref type =====
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected ?? true;

      if (!connected && isConnected) {
        setIsVisible(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        // ===== FIX: Assign timeout correctly =====
        timeoutRef.current = setTimeout(() => setIsVisible(false), 3000);
      }

      setIsConnected(connected);
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isConnected]);

  if (isConnected || !isVisible) return null;

  return (
    <View
      style={[
        styles.networkIndicator,
        { backgroundColor: theme.colors.error.main },
      ]}
    >
      <Text
        style={[
          styles.networkIndicatorText,
          { color: theme.colors.background.light },
        ]}
      >
        {t("common.noNetwork")}
      </Text>
    </View>
  );
};

// Main App Content with theme access
const AppContent = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [showDisclaimers, setShowDisclaimers] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // ===== LOAD FONTS =====

  const [fontsLoaded] = useFonts({
    Cairo: require("./node_modules/@fontsource/cairo/files/cairo-arabic-400-normal.woff"),

    "Cairo-Bold": require("./node_modules/@fontsource/cairo/files/cairo-arabic-700-normal.woff"),

    PlusJakartaSans: require("./node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-400-normal.woff"),

    "PlusJakartaSans-Bold": require("./node_modules/@fontsource/plus-jakarta-sans/files/plus-jakarta-sans-latin-700-normal.woff"),
  });

  // ===== FIX: Monitor network changes =====
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Network status monitoring for future use
      console.log("Network status:", state.isConnected, state.type);
    });

    return () => unsubscribe();
  }, []);

  // ===== Check if onboarding should be shown =====
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const shouldShow = await shouldShowOnboarding();
        if (shouldShow) {
          setShowOnboarding(true);
        }

        const launchCount = await AsyncStorage.getItem(APP_LAUNCH_COUNT_KEY);
        const count = launchCount ? parseInt(launchCount, 10) : 0;
        await AsyncStorage.setItem(
          APP_LAUNCH_COUNT_KEY,
          (count + 1).toString(),
        );
      } catch (error) {
        console.error("Failed to check onboarding status:", error);
      }
    };

    checkOnboardingStatus();
  }, []);

  // ===== Handle onboarding complete =====
  const handleOnboardingComplete = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  const handleAcceptDisclaimers = useCallback(() => {
    setShowDisclaimers(false);
  }, []);

  const handleDeclineDisclaimers = useCallback(() => {
    alert(t("onboarding.mustAcceptTerms"));
  }, [t]);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn("Error loading app:", e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  // ===== SHOW LOADING IF FONTS NOT LOADED OR APP NOT READY =====
  if (!appReady || !fontsLoaded) {
    return <LoadingScreen message={t("loading.appLoading")} />;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.light },
      ]}
    >
      <StatusBar style={theme.mode === "dark" ? "light" : "dark"} />
      <NetworkStatusIndicator />
      <ErrorBoundary theme={theme}>
        <CalculationProvider>
          <RootNavigator />
        </CalculationProvider>
      </ErrorBoundary>
      <DisclaimersModal
        visible={showDisclaimers}
        onAccept={handleAcceptDisclaimers}
        onDecline={handleDeclineDisclaimers}
        showPrivacyPolicy={true}
      />
      {showOnboarding && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}
    </View>
  );
};

// Root App component with providers
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ThemeProvider>
          <SettingsProvider>
            <MadhabProvider>
              <AppContent />
            </MadhabProvider>
          </SettingsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  networkIndicator: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  networkIndicatorText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
