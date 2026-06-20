/**
 * @file App.tsx
 * @description Root application component with providers, navigation, and global features
 * 
 * FIXES: Timeout ref type, add missing imports
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  SafeAreaProvider, 
  SafeAreaView,
  initialWindowMetrics 
} from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import './lib/i18n';

import { useTranslation } from 'react-i18next';
import { ThemeProvider, useAppTheme } from './lib/context/ThemeProvider';
import { SettingsProvider } from './lib/context/SettingsContext';
import { MadhabProvider } from './lib/context/MadhabContext';
import { RootNavigator } from './navigation/RootNavigator';
import { ErrorBoundary } from './components/ErrorBoundary';
import DisclaimersModal from './components/DisclaimersModal';
import LoadingScreen from './components/LoadingScreen';

// ===== FIX: Onboarding storage key =====
const ONBOARDING_COMPLETED_KEY = '@merath_onboarding_completed';
const APP_LAUNCH_COUNT_KEY = '@merath_launch_count';

// ===== FIX: Network status component =====
const NetworkStatusIndicator = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  // ===== FIX: Proper timeout ref type =====
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
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
    <View style={[styles.networkIndicator, { backgroundColor: theme.colors.error.main }]}>
      <Text style={[styles.networkIndicatorText, { color: theme.colors.background.light }]}>
        {t('common.noNetwork')}
      </Text>
    </View>
  );
};

// ===== FIX: Onboarding modal =====
const OnboardingModal = ({ visible, onComplete }: { visible: boolean; onComplete: () => void }) => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return {
          icon: '🕌',
          title: t('onboarding.welcome'),
          description: t('onboarding.welcomeDescription'),
          details: t('onboarding.welcomeDetails'),
        };
      case 2:
        return {
          icon: '⚖️',
          title: t('onboarding.howToCalculate'),
          description: t('onboarding.howToCalculateDescription'),
          details: '',
        };
      case 3:
        return {
          icon: '📊',
          title: t('onboarding.resultsAndSharing'),
          description: t('onboarding.resultsAndSharingDescription'),
          details: '',
        };
      default:
        return { icon: '', title: '', description: '', details: '' };
    }
  };

  const content = getStepContent();

  return (
    <View style={[styles.onboardingOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <SafeAreaView style={[styles.onboardingCard, { backgroundColor: theme.colors.background.light }]}>
        <View style={styles.onboardingHeader}>
          <Text style={[styles.onboardingStep, { color: theme.colors.neutral.light400 }]}>{step}/{totalSteps}</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={[styles.onboardingSkip, { color: theme.colors.info.main }]}>{t('common.close')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.onboardingIconContainer}>
          <Text style={styles.onboardingIcon}>{content.icon}</Text>
        </View>

        <Text style={[styles.onboardingTitle, { color: theme.colors.primary.main }]}>
          {content.title}
        </Text>
        
        <Text style={[styles.onboardingDescription, { color: theme.colors.neutral.dark300 }]}>
          {content.description}
        </Text>
        
        <Text style={[styles.onboardingDetails, { color: theme.colors.neutral.dark200 }]}>
          {content.details}
        </Text>

        <View style={styles.onboardingDots}>
          {[1, 2, 3].map((i) => (
            <View
              key={i}
              style={[
                styles.onboardingDot,
                { backgroundColor: i === step ? theme.colors.primary.main : theme.colors.neutral.light300 }
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.onboardingButton, { backgroundColor: theme.colors.primary.main }]}
          onPress={handleNext}
        >
          <Text style={[styles.onboardingButtonText, { color: theme.colors.background.light }]}>
            {step === totalSteps ? t('onboarding.startNow') : t('onboarding.next')}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

// Main App Content with theme access
const AppContent = () => {
  const { theme } = useAppTheme();
  const { t } = useTranslation();
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimers, setShowDisclaimers] = useState(true);
  const [appReady, setAppReady] = useState(false);
  
  // ===== FIX: Onboarding state =====
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  
  // ===== FIX: Network state =====
  const [networkStatus, setNetworkStatus] = useState({ isConnected: true, type: 'unknown' });
  
  // ===== FIX: Monitor network changes =====
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus({
        isConnected: state.isConnected ?? true,
        type: state.type ?? 'unknown'
      });
    });

    return () => unsubscribe();
  }, []);

  // ===== FIX: Check if onboarding should be shown =====
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const [completed, launchCount] = await Promise.all([
          AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY),
          AsyncStorage.getItem(APP_LAUNCH_COUNT_KEY)
        ]);

        const count = launchCount ? parseInt(launchCount, 10) : 0;
        
        if (!completed || count === 0) {
          setShowOnboarding(true);
        }

        await AsyncStorage.setItem(APP_LAUNCH_COUNT_KEY, (count + 1).toString());
      } catch (error) {
        console.error('Failed to check onboarding status:', error);
        setShowOnboarding(false);
      } finally {
        setOnboardingLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // ===== FIX: Handle onboarding complete =====
  const handleOnboardingComplete = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
      setShowOnboarding(false);
    } catch (error) {
      console.error('Failed to save onboarding status:', error);
      setShowOnboarding(false);
    }
  }, []);

  const handleAcceptDisclaimers = useCallback(() => {
    setDisclaimerAccepted(true);
    setShowDisclaimers(false);
  }, []);

  const handleDeclineDisclaimers = useCallback(() => {
    alert(t('onboarding.mustAcceptTerms'));
  }, []);

  useEffect(() => {
    const prepare = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (e) {
        console.warn('Error loading app:', e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, []);

  if (!appReady || onboardingLoading) {
    return <LoadingScreen message={t('loading.appLoading')} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.light }]}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      <NetworkStatusIndicator />
      <ErrorBoundary theme={theme}>
        <RootNavigator />
      </ErrorBoundary>
      <DisclaimersModal
        visible={showDisclaimers}
        onAccept={handleAcceptDisclaimers}
        onDecline={handleDeclineDisclaimers}
        showPrivacyPolicy={true}
      />
      {showOnboarding && (
        <OnboardingModal
          visible={showOnboarding}
          onComplete={handleOnboardingComplete}
        />
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
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  onboardingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  onboardingCard: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  onboardingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  onboardingStep: {
    fontSize: 14,
    fontWeight: '600',
  },
  onboardingSkip: {
    fontSize: 14,
    fontWeight: '600',
    padding: 8,
  },
  onboardingIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  onboardingIcon: {
    fontSize: 64,
  },
  onboardingTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  onboardingDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  onboardingDetails: {
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  onboardingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  onboardingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onboardingButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  onboardingButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});