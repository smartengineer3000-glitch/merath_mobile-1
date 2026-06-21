/**
 * @file components/LoadingScreen.tsx
 * @description Professional loading screen with app logo and smooth animations
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '../lib/icons';
import { useAppTheme } from '../lib/context/ThemeProvider';
import type { Theme } from '../lib/design/theme';

export interface LoadingScreenProps {
  message?: string;
  progress?: number; // 0 to 1
  error?: string | null;
  onRetry?: () => void;
}

export function LoadingScreen({ 
  message = 'جاري التحميل...', 
  progress,
  error,
  onRetry 
}: LoadingScreenProps) {
  const { theme } = useAppTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.sin),
        }),
      ])
    ).start();
  }, [fadeAnim, pulseAnim, scaleAnim]);

  // Progress bar animation
  useEffect(() => {
    if (progress !== undefined) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
        easing: Easing.out(Easing.cubic),
      }).start();
    }
  }, [progress, progressAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const styles = createStyles(theme);

  if (error) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.errorIconContainer}>
            <MaterialCommunityIcons name="alert-circle" size={64} color={theme.colors.error.main} />
          </View>
          <Text style={styles.errorTitle}>خطأ في التحميل</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          {onRetry && (
            <Animated.View style={[styles.retryButton, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.retryButtonText} onPress={onRetry}>إعادة المحاولة</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        {/* Logo with pulse animation */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.logo}>
            <MaterialCommunityIcons name="scale-balance" size={80} color={theme.colors.primary.main} />
          </View>
        </Animated.View>

        {/* App Name */}
        <Text style={styles.appName}>حاسبة المواريث</Text>
        <Text style={styles.appNameEn}>Merath Calculator</Text>

        {/* Loading Message */}
        <Text style={styles.loadingMessage}>{message}</Text>

        {/* Progress Bar (if progress provided) */}
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
          </View>
        )}

        {/* Spinner */}
        <ActivityIndicator size="large" color={theme.colors.primary.main} style={styles.spinner} />

        {/* Version Info */}
        <Text style={styles.version}>الإصدار 1.1.3</Text>
      </Animated.View>
    </View>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.light,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      alignItems: 'center',
      paddingHorizontal: 32,
      maxWidth: 400,
    },
    logoContainer: {
      marginBottom: 24,
    },
    logo: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.primary.light,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.primary.main,
      marginBottom: 4,
      textAlign: 'center',
    },
    appNameEn: {
      fontSize: 14,
      color: theme.colors.neutral.dark200,
      marginBottom: 32,
      textAlign: 'center',
    },
    loadingMessage: {
      fontSize: 16,
      color: theme.colors.neutral.dark300,
      marginBottom: 20,
      textAlign: 'center',
    },
    progressContainer: {
      width: '100%',
      height: 6,
      backgroundColor: theme.colors.neutral.light200,
      borderRadius: 3,
      marginBottom: 24,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      backgroundColor: theme.colors.primary.main,
      borderRadius: 3,
    },
    spinner: {
      marginBottom: 32,
    },
    version: {
      fontSize: 12,
      color: theme.colors.neutral.light400,
      textAlign: 'center',
    },
    errorIconContainer: {
      marginBottom: 24,
    },
    errorTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: theme.colors.error.main,
      marginBottom: 12,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: 14,
      color: theme.colors.neutral.dark200,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 20,
    },
    retryButton: {
      paddingVertical: 14,
      paddingHorizontal: 32,
      backgroundColor: theme.colors.primary.main,
      borderRadius: 12,
      shadowColor: theme.colors.primary.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
      textAlign: 'center',
    },
  });

export default LoadingScreen;