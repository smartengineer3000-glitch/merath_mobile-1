/**
 * Firebase Configuration & Analytics
 * Phase 7: Firebase Integration
 * 
 * Handles Firebase Crashlytics and Analytics
 */

import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import * as Sentry from 'sentry-expo';

// Firebase configuration - Replace with your credentials
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'demo-key',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'merath-app.firebaseapp.com',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'merath-app',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'merath-app.appspot.com',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:000000000000:android:0000000000000000',
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: any;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase
 */
export const initializeFirebase = () => {
  try {
    if (!app) {
      app = initializeApp(firebaseConfig);
      analytics = getAnalytics(app);
      console.log('Firebase initialized successfully');
    }
    return app;
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
    return null;
  }
};

/**
 * Initialize Sentry for enhanced error tracking
 */
export const initializeSentry = () => {
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    environment: __DEV__ ? 'development' : 'production',
  });
};

/**
 * Track Analytics Event
 * @param eventName - Name of the event
 * @param parameters - Event parameters
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, parameters || {});
    }
  } catch (error) {
    console.warn('Analytics event tracking failed:', error);
  }
};

/**
 * Track Calculation Event
 */
export const trackCalculation = (madhab: string, heirCount: number, estateAmount: number) => {
  trackEvent('calculation_performed', {
    madhab,
    heir_count: heirCount,
    estate_amount: estateAmount,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Screen View
 */
export const trackScreenView = (screenName: string) => {
  trackEvent('screen_view', {
    screen_name: screenName,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Feature Usage
 */
export const trackFeatureUsage = (featureName: string, metadata?: Record<string, any>) => {
  trackEvent('feature_used', {
    feature: featureName,
    ...metadata,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track Export Action
 */
export const trackExport = (format: 'pdf' | 'json' | 'csv') => {
  trackEvent('export_performed', {
    format,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Track App Crash (for consistency)
 */
export const trackError = (error: Error, context?: string) => {
  trackEvent('app_error', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });

  // Also send to Sentry
  Sentry.captureException(error, {
    tags: {
      context: context || 'unknown',
    },
  });
};

/**
 * Analytics Events Map - For reference
 */
export const ANALYTICS_EVENTS = {
  // Screen views
  SCREEN_CALCULATOR: 'screen_view_calculator',
  SCREEN_HISTORY: 'screen_view_history',
  SCREEN_SETTINGS: 'screen_view_settings',
  SCREEN_AUDIT: 'screen_view_audit',
  SCREEN_ABOUT: 'screen_view_about',

  // Calculations
  CALCULATION_STARTED: 'calculation_started',
  CALCULATION_COMPLETED: 'calculation_completed',
  CALCULATION_FAILED: 'calculation_failed',

  // User actions
  HEIR_ADDED: 'heir_added',
  HEIR_REMOVED: 'heir_removed',
  MADHAB_CHANGED: 'madhab_changed',
  ESTATE_ENTERED: 'estate_entered',

  // Exports
  EXPORT_PDF: 'export_pdf',
  EXPORT_JSON: 'export_json',
  EXPORT_CSV: 'export_csv',

  // Settings
  LANGUAGE_CHANGED: 'language_changed',
  DARK_MODE_TOGGLED: 'dark_mode_toggled',
  ANALYTICS_TOGGLED: 'analytics_toggled',

  // Data management
  HISTORY_CLEARED: 'history_cleared',
  ENTRY_DELETED: 'entry_deleted',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  CRASH_REPORTED: 'crash_reported',
};

export default {
  initializeFirebase,
  initializeSentry,
  trackEvent,
  trackCalculation,
  trackScreenView,
  trackFeatureUsage,
  trackExport,
  trackError,
  ANALYTICS_EVENTS,
};
